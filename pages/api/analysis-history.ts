import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '@/lib/auth-helpers';
import { getServiceSupabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Require authentication
    const user = await requireAuth(req, res);
    if (!user) return; // Response already sent by requireAuth

    const supabase = getServiceSupabase();
    
    // Check if a specific analysis ID is requested
    const { id } = req.query;
    
    if (id && typeof id === 'string') {
      // Fetch a single analysis by ID
      const { data, error } = await supabase
        .from('analysis_history')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching analysis:', error);
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Analysis not found' });
        }
        return res.status(500).json({ error: 'Failed to fetch analysis' });
      }

      return res.status(200).json(data);
    }

    // Fetch all analysis history for the user, ordered by date
    const { data, error } = await supabase
      .from('analysis_history')
      .select('id, company_name, status, created_at, business_profile_pdf_url, error_message')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching analysis history:', error);
      return res.status(500).json({ error: 'Failed to fetch analysis history' });
    }

    res.status(200).json(data || []);
  } catch (error) {
    console.error('Analysis history API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
