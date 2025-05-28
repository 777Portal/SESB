import { GoogleGenAI, Type } from "@google/genai";
const GEMINI_API_KEYS = JSON.parse(process.env.GEMINI_API_KEYS);
let keyIndex = 0;

export async function review(text) {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEYS[keyIndex] });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents:
            "Rate the following message, from 0 being normal, 5 being questionable, to 10 being bannable. Do not return an array. Return only a single JSON object \n"+text,
            config: {
            required: ['rating', 'reason'],
            responseMimeType: "application/json",
                responseSchema: {
                    rating: Type.NUMBER,
                    reason: Type.STRING
                },
            },            
        });
        return response.text;
    } catch (error) {
        if (error.response?.status === 429) {
            if (GEMINI_API_KEYS)
            console.warn(`Rate limit hit for key of index ${keyIndex}, trying next key...`);
            keyIndex++;
            return;
        };
        if (error.response?.status === 503) { 
            console.warn(`Model is overloaded... ${keyIndex}`);
            return;
        }
        throw error;
    }
}