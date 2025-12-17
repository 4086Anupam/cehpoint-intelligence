import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({});
  
  try {
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = file.filepath;
    const mimeType = file.mimetype || '';
    const fileName = file.originalFilename || 'document';
    
    let content = '';
    
    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      content = data.text;
      
      if (!content || content.trim().length === 0) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ 
          error: 'Unable to extract text from PDF. The file may be image-based or encrypted. Please try uploading a text-based PDF or use the questionnaire instead.' 
        });
      }
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               mimeType === 'application/msword') {
      const arrayBuffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer: arrayBuffer });
      content = result.value;
    } else if (mimeType === 'text/plain') {
      content = fs.readFileSync(filePath, 'utf-8');
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file type. Please upload PDF, DOCX, or TXT files.' });
    }

    fs.unlinkSync(filePath);
    console.log(content);
    
    
    res.status(200).json({ content, fileName });
  } catch (error) {
    console.error('File parsing error:', error);
    res.status(500).json({ error: 'Failed to parse file. Please ensure the file is not corrupted or password-protected.' });
  }
}
