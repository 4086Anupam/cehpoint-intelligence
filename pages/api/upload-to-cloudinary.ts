import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import fs from 'fs';
import { requireEnv } from '@/lib/env-validation';

// Disable Next.js body parser to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // Parse the incoming form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB max
      allowEmptyFiles: false,
      filter: ({ mimetype }) => {
        // Allow PDF, DOCX, and TXT files
        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          'text/plain',
        ];
        return mimetype ? allowedTypes.includes(mimetype) : false;
      },
    });

    const [, files] = await form.parse(req);

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'cehpoint-business-profiles',
      resource_type: 'auto',
      public_id: `business-profile-${Date.now()}`,
      // Add tags for better organization
      tags: ['business-profile', 'uploaded-document'],
    });

    // Clean up the temporary file
    fs.unlink(file.filepath, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });

    res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
      fileName: file.originalFilename,
      format: result.format,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Environment variable')) {
        return res.status(500).json({ 
          error: 'Cloudinary not configured. Please contact support.' 
        });
      }
      return res.status(500).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to upload file' });
  }
}
