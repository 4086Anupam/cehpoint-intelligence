import type { NextApiRequest, NextApiResponse } from 'next';
import { analyzeBusinessProfile } from '@/lib/gemini';
import { requireEnv } from '@/lib/env-validation';
import { BusinessProfileSchema, normalizeBusinessProfile } from '@/lib/validation';
import { getAuthenticatedUser } from '@/lib/auth-helpers';
import { getServiceSupabase } from '@/lib/supabase';

const MAX_PAYLOAD_SIZE = 1024 * 1024;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get authenticated user early for error tracking
  const user = await getAuthenticatedUser(req);
  const pendingAnalysisId = req.body.pendingAnalysisId || null;

  try {
    requireEnv(process.env.GEMINI_API_KEY, 'GEMINI_API_KEY');

    const payloadSize = JSON.stringify(req.body).length;
    if (payloadSize > MAX_PAYLOAD_SIZE) {
      return res.status(413).json({ error: 'Request payload too large' });
    }

    const normalizedProfile = normalizeBusinessProfile(req.body);
    
    const validation = BusinessProfileSchema.safeParse(normalizedProfile);
    if (!validation.success) {
      console.error('Profile validation failed:', validation.error);
      return res.status(400).json({ 
        error: 'Invalid business profile data',
        details: validation.error.issues[0]?.message || 'Validation failed'
      });
    }

    const businessProfile = validation.data;
    
    // Analyze the business profile with AI
    const result = await analyzeBusinessProfile(businessProfile);
    
    // If user is authenticated, save/update analysis in Supabase
    let savedAnalysisId: string | null = null;
    if (user) {
      try {
        const supabase = getServiceSupabase();
        
        // Get the business profile PDF URL if it was uploaded (passed in request body)
        const businessProfilePdfUrl = req.body.businessProfilePdfUrl || null;
        
        if (pendingAnalysisId) {
          // Update existing pending record with analysis results
          const { data: updatedAnalysis, error: updateError } = await supabase
            .from('analysis_history')
            .update({
              status: 'completed',
              business_profile: businessProfile,
              recommendations: result.recommendations,
              project_blueprint: result.projectBlueprint || null,
              parsed_data: null, // Clear parsed data after successful analysis
              error_message: null,
            })
            .eq('id', pendingAnalysisId)
            .eq('user_id', user.id)
            .select('id')
            .single();

          if (updateError) {
            console.error('Error updating analysis in database:', updateError);
            // Fall back to creating a new record
          } else {
            savedAnalysisId = updatedAnalysis?.id || null;
            console.log('Analysis updated with ID:', savedAnalysisId);
          }
        }
        
        // If no pending record or update failed, create new record
        // Only create new record for manual entries (no pendingAnalysisId)
        if (!savedAnalysisId && !pendingAnalysisId) {
          const { data: savedAnalysis, error: saveError } = await supabase
            .from('analysis_history')
            .insert({
              user_id: user.id,
              company_name: businessProfile.businessName || 'Unknown Company',
              status: 'completed',
              business_profile: businessProfile,
              recommendations: result.recommendations,
              project_blueprint: result.projectBlueprint || null,
              business_profile_pdf_url: businessProfilePdfUrl,
            })
            .select('id')
            .single();

          if (saveError) {
            console.error('Error saving analysis to database:', saveError);
          } else {
            savedAnalysisId = savedAnalysis?.id || null;
            console.log('Analysis saved with ID:', savedAnalysisId);
          }
        }
      } catch (dbError) {
        console.error('Database error while saving analysis:', dbError);
      }
    }
    
    // Return the analysis result along with saved analysis ID
    res.status(200).json({
      ...result,
      analysisId: savedAnalysisId || pendingAnalysisId,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    
    // If there's a pending analysis, mark it as failed
    if (user && pendingAnalysisId) {
      try {
        const supabase = getServiceSupabase();
        await supabase
          .from('analysis_history')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Analysis failed',
          })
          .eq('id', pendingAnalysisId)
          .eq('user_id', user.id);
      } catch (dbError) {
        console.error('Failed to update analysis status to failed:', dbError);
      }
    }
    
    if (error instanceof Error && error.message.includes('Environment variable')) {
      return res.status(500).json({ 
        error: 'Server configuration error. Please contact support.' 
      });
    }
    
    res.status(500).json({ error: 'Failed to analyze business profile' });
  }
}
