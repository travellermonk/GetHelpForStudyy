
import { GoogleGenAI, Type } from "@google/genai";
import { PPTOutline } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generatePPTOutline = async (topic: string): Promise<PPTOutline> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a detailed PowerPoint presentation outline for the topic: "${topic}". 
    The outline should be educational, structured for a student or professional presentation, and include at least 7-10 slides.
    Include a clear introduction, core concepts, case studies or examples, and a conclusion.`,
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

  const response = await model;
  const resultText = response.text;
  
  if (!resultText) {
    throw new Error("Failed to generate content from AI");
  }

  try {
    return JSON.parse(resultText) as PPTOutline;
  } catch (err) {
    console.error("JSON Parsing error:", err);
    throw new Error("AI returned invalid JSON structure.");
  }
};
