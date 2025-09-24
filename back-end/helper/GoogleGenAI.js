import { GoogleGenAI } from "@google/genai";

export async function callModel(model, apiKey, prompt, resType, resSchema) {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const config = {};
    if (resType) {
      config.responseMimeType = resType;
    }
    if (resSchema) {
      config.responseSchema = resSchema;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    if (!response || !response.text) {
      console.error("AI returned empty response:", response);
      return "";
    }
    console.log("AI response:", response);
    return response.text;
  } catch (e) {
    console.error("Gemini generation error:", e);
    return "";
  }
}
