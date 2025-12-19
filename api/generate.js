
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a professional academic consultant. Generate a comprehensive PowerPoint presentation outline for the study topic: "${topic}". 
      Include 7-10 slides with titles, high-quality bullet points, and visual suggestions.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            presentationTitle: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slideNumber: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  bulletPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  visualSuggestion: { type: Type.STRING }
                },
                required: ["slideNumber", "title", "bulletPoints", "visualSuggestion"]
              }
            }
          },
          required: ["topic", "presentationTitle", "targetAudience", "slides"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate content" });
  }
}
