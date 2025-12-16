import type { NextApiRequest, NextApiResponse } from 'next';
import { analyzeUploadedDocument } from '@/lib/gemini';
import { requireEnv } from '@/lib/env-validation';

const MAX_PAYLOAD_SIZE = 2 * 1024 * 1024;
const MAX_CONTENT_SIZE = 500 * 1024;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    requireEnv(process.env.GEMINI_API_KEY, 'GEMINI_API_KEY');

    const payloadSize = JSON.stringify(req.body).length;
    if (payloadSize > MAX_PAYLOAD_SIZE) {
      return res.status(413).json({ error: 'Request payload too large' });
    }

    const { content, fileName } = req.body;
    
    if (!content || !fileName) {
      return res.status(400).json({ error: 'Missing content or fileName' });
    }

    if (typeof content !== 'string' || typeof fileName !== 'string') {
      return res.status(400).json({ error: 'Invalid content or fileName format' });
    }

    if (content.length > MAX_CONTENT_SIZE) {
      return res.status(413).json({ error: 'Document content too large. Please upload a smaller file.' });
    }
    
    const profile = await analyzeUploadedDocument(content, fileName);
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Document analysis error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Environment variable')) {
        return res.status(500).json({ error: 'Server configuration error. Please contact support.' });
      }
      if (error.message.includes('Document analysis') || error.message.includes('Invalid document')) {
        return res.status(400).json({ error: error.message });
      }
    }
    
    res.status(500).json({ error: 'Failed to analyze document' });
  }
}
