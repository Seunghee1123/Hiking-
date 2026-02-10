
import { GoogleGenAI, Type } from "@google/genai";
import { MountainInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getMountainInsights = async (mountainName: string): Promise<MountainInfo | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide detailed information about ${mountainName} in South Korea for hikers.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Easy", "Moderate", "Hard", "Expert"] },
            recommendedSeason: { type: Type.STRING },
            gearSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["name", "description", "difficulty", "recommendedSeason", "gearSuggestions"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MountainInfo;
    }
    return null;
  } catch (error) {
    console.error("Error fetching mountain insights:", error);
    return null;
  }
};
