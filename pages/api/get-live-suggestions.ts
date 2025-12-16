import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData, currentSection } = req.body;

    if (!formData || typeof currentSection !== 'number') {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const businessInfo = Object.entries(formData)
      .filter(([_, value]) => value && value !== '')
      .map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
        return `${formattedKey}: ${Array.isArray(value) ? value.join(', ') : value}`;
      })
      .join('\n');

    if (!businessInfo.trim()) {
      return res.status(200).json({ suggestions: [] });
    }

    const prompt = `You are an expert IT and cybersecurity consultant analyzing a client's business information as they fill out a questionnaire.

CURRENT BUSINESS INFORMATION PROVIDED:
${businessInfo}

TASK:
Based on the information provided so far, generate 2-3 SPECIFIC, ACTIONABLE service suggestions that would be valuable for this business. Keep each suggestion concise (1-2 sentences max).

IMPORTANT:
- Be specific to their industry, business model, and stated challenges
- Focus on high-impact, realistic solutions
- Make suggestions engaging and relevant to what they've shared
- Include a brief "why" this matters for their business
- If not enough information is provided yet, give general relevant suggestions based on what you know

Return ONLY a valid JSON object in this exact format:
{
  "suggestions": [
    {
      "title": "Service Name",
      "description": "Specific recommendation with why it matters",
      "icon": "Cloud" | "Shield" | "Zap" | "Brain" | "Target" | "Lock" | "Database" | "Workflow"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
        responseMimeType: 'application/json',
      },
    });

    if (!response.text) {
      return res.status(200).json({ suggestions: [] });
    }
    console.log(response.text);
    
    const parsed = JSON.parse(response.text);

    return res.status(200).json({
      suggestions: parsed.suggestions || [],
    });
  } catch (error) {
    console.error('Live suggestions error:', error);
    return res.status(200).json({ suggestions: [] });
  }
}
