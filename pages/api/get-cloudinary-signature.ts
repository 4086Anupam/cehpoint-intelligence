import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import { requireEnv } from '@/lib/env-validation';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate Cloudinary environment variables
    requireEnv(process.env.CLOUDINARY_CLOUD_NAME, 'CLOUDINARY_CLOUD_NAME');
    requireEnv(process.env.CLOUDINARY_API_KEY, 'CLOUDINARY_API_KEY');
    requireEnv(process.env.CLOUDINARY_API_SECRET, 'CLOUDINARY_API_SECRET');

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'cehpoint-business-profiles';
    
    // Generate signature for secure upload
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
        tags: 'business-profile,uploaded-document',
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    res.status(200).json({
      signature,
      timestamp,
      folder,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error('Signature generation error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Environment variable')) {
        return res.status(500).json({ 
          error: 'Cloudinary not configured. Please contact support.' 
        });
      }
      return res.status(500).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to generate upload signature' });
  }
}
