import { GoogleGenAI, Type } from "@google/genai";
const GEMINI_API_KEYS = JSON.parse(process.env.GEMINI_API_KEYS);
let keyIndex = 0;
console.log(GEMINI_API_KEYS)
export async function review(text) {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEYS[keyIndex] });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents:
            `
            Rate the following message on a scale from 0 to 10:

            0 = Normal and safe for all audiences.

            5 = Questionable (contains potentially offensive, misleading, or inappropriate content that might require moderation).

            10 = Bannable (includes hate speech, explicit threats, harassment, illegal content, or severe violations of platform policy).
            `+text,
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
        if (error.status === 429 || error.message?.includes('429')) {
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