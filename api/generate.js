
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic } = req.body;
  if (!topic || typeof topic !== 'string') {
    return res.status(400).json({ error: 'A valid study topic is required' });
  }

  try {
    // Note: process.env.API_KEY is the standard for this environment.
    // In Vercel, you can set GEMINI_API_KEY and map it or rename this to process.env.GEMINI_API_KEY.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a professional and structured PowerPoint presentation outline for the study topic: "${topic}". 
      Format it clearly with 'Slide X: [Title]' and descriptive bullet points. 
      Include 6-8 slides covering Introduction, Core Concepts, Practical Examples, and a Summary.`,
    });

    res.status(200).json({ output: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to generate presentation outline. Please try again later.' });
  }
}
