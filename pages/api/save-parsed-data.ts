import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth-helpers';
import { getServiceSupabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return;

    const { parsedData, companyName, pdfUrl } = req.body;

    if (!parsedData) {
      return res.status(400).json({ error: 'Parsed data is required' });
    }

    const supabase = getServiceSupabase();

    // Create a pending analysis record with parsed data
    const { data, error } = await supabase
      .from('analysis_history')
      .insert({
        user_id: user.id,
        company_name: companyName || parsedData.businessName || 'Unknown Company',
        status: 'pending',
        parsed_data: parsedData,
        business_profile_pdf_url: pdfUrl || null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving parsed data:', error);
      return res.status(500).json({ error: 'Failed to save parsed data' });
    }

    res.status(200).json({ 
      success: true, 
      analysisId: data.id,
      message: 'Parsed data saved successfully'
    });
  } catch (error) {
    console.error('Save parsed data API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
