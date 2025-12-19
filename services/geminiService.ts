
import { GoogleGenAI, Type } from "@google/genai";
import { PPTOutline } from "../types";

export const generatePPTOutline = async (topic: string): Promise<PPTOutline> => {
  // Use process.env.API_KEY exclusively as per requirements
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a detailed PowerPoint presentation outline for the study topic: "${topic}". 
    The outline should be educational, professional, and include 7-10 slides.
    Include introduction, core theories, real-world applications, and a summary.`,
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
                visualSuggestion: { type: Type.STRING, description: "Detailed description of an image or chart for this slide" }
              },
              required: ["slideNumber", "title", "bulletPoints", "visualSuggestion"]
            }
          }
        },
        required: ["topic", "presentationTitle", "targetAudience", "slides"]
      }
    }
  });

  const resultText = response.text;
  if (!resultText) throw new Error("AI failed to generate a response.");

  return JSON.parse(resultText) as PPTOutline;
};
