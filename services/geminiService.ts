
import { GoogleGenAI, Type } from "@google/genai";
import { LogEntry, DailySummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const summarizeLogs = async (logs: LogEntry[]): Promise<DailySummary> => {
  const logTexts = logs.map(l => `[${new Date(l.timestamp).toLocaleTimeString()}] (${l.category}): ${l.content}`).join('\n');
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize the following daily logs and provide insights:\n\n${logTexts}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          summary: { type: Type.STRING },
          keyTakeaways: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          suggestedFocus: { type: Type.STRING }
        },
        required: ["date", "summary", "keyTakeaways", "suggestedFocus"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getWritingHelp = async (currentText: string): Promise<string> => {
  if (!currentText || currentText.length < 5) return "";
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `I'm writing a daily log entry: "${currentText}". Can you give a very short, one-sentence suggestion to expand on it or a thoughtful reflection question?`,
  });

  return response.text.trim();
};
