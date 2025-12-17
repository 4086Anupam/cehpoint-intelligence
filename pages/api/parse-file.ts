import type { NextApiRequest, NextApiResponse } from 'next';
import mammoth from 'mammoth';
import { v2 as cloudinary } from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse');

// Configure Cloudinary for signed URL generation
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
    const { fileUrl, fileName, mimeType } = req.body;
    
    if (!fileUrl) {
      return res.status(400).json({ error: 'No file URL provided' });
    }

    console.log('Original file URL:', fileUrl);

    // Extract public_id from Cloudinary URL to generate signed URL
    // URL format: https://res.cloudinary.com/{cloud}/raw/upload/v{version}/{folder}/{public_id}
    // For RAW resources, the extension IS part of the public_id
    let downloadUrl = fileUrl;
    
    if (fileUrl.includes('cloudinary.com')) {
      try {
        // Parse the URL to extract public_id
        const urlParts = fileUrl.split('/upload/');
        if (urlParts.length === 2) {
          // Get everything after /upload/ and remove version prefix (v1234567890/)
          let pathAfterUpload = urlParts[1];
          // Remove version number if present
          if (pathAfterUpload.match(/^v\d+\//)) {
            pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');
          }
          // For RAW resources, DO NOT remove the file extension - it's part of the public_id
          // e.g., "cehpoint-business-profiles/xe62k0ppxu64jhzkbkx4.pdf"
          const publicId = pathAfterUpload;
          
          console.log('Extracted public_id:', publicId);
          
          // Generate signed URL for raw resource
          downloadUrl = cloudinary.url(publicId, {
            resource_type: 'raw',
            type: 'upload',
            sign_url: true,
            secure: true,
          });
          
          console.log('Generated signed URL:', downloadUrl);
        }
      } catch (urlError) {
        console.error('Error generating signed URL, using original:', urlError);
        downloadUrl = fileUrl;
      }
    }

    // Download the file
    const fileResponse = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
      },
    });
    
    if (!fileResponse.ok) {
      console.error('File download failed:', {
        status: fileResponse.status,
        statusText: fileResponse.statusText,
        url: downloadUrl,
      });
      return res.status(400).json({ 
        error: `Failed to download file: ${fileResponse.status} ${fileResponse.statusText}` 
      });
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log('File downloaded, buffer size:', buffer.length);
    
    let content = '';
    const detectedMimeType = mimeType || '';
    const detectedFileName = fileName || 'document';
    
    // Detect file type from URL or mimeType
    const isPdf = detectedMimeType.includes('pdf') || fileUrl.toLowerCase().includes('.pdf');
    const isDocx = detectedMimeType.includes('wordprocessingml') || detectedMimeType.includes('msword') || 
                   fileUrl.toLowerCase().includes('.docx') || fileUrl.toLowerCase().includes('.doc');
    const isTxt = detectedMimeType.includes('text/plain') || fileUrl.toLowerCase().includes('.txt');
    
    if (isPdf) {
      const data = await pdfParse(buffer);
      content = data.text;
      
      if (!content || content.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Unable to extract text from PDF. The file may be image-based or encrypted. Please try uploading a text-based PDF or use the questionnaire instead.' 
        });
      }
    } else if (isDocx) {
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    } else if (isTxt) {
      content = buffer.toString('utf-8');
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.' });
    }

    console.log('Parsed content length:', content.length);
    
    res.status(200).json({ content, fileName: detectedFileName });
  } catch (error) {
    console.error('File parsing error:', error);
    res.status(500).json({ error: 'Failed to parse file. Please ensure the file is not corrupted or password-protected.' });
  }
}
