import { GoogleGenAI, Type } from "@google/genai";
const GEMINI_API_KEYS = JSON.parse(process.env.GEMINI_API_KEYS);
let keyIndex = 0;
console.log(GEMINI_API_KEYS.length)

export async function review(text) {
    let contents =
    `
    Rate the following message on a scale from 0 to 10:

    0 = Normal and safe for all audiences.

    5 = Questionable (contains potentially offensive, misleading, or inappropriate content that might require moderation).

    10 = Bannable (includes hate speech, explicit threats, harassment, illegal content, or severe violations of platform policy).
    `+text
    let config = {
        required: ['rating', 'reason'],
        responseMimeType: "application/json",
            responseSchema: {
                rating: Type.NUMBER,
                reason: Type.STRING
            },
    }
    return await getAi("gemini-2.0-flash", contents, config)
}

export async function talk(text) {
    let config = {
        systemInstruction: `
        You are a conversational AI named "painbot" focused on engaging in authentic dialogue on a live chatroom called "twoblade", also known as "2b". Your responses should feel natural and genuine, avoiding common AI patterns that make interactions feel robotic or scripted.

        ## Core Approach

        1. Conversation Style
        * Engage genuinely with topics rather than just providing information
        * Follow natural conversation flow instead of structured lists
        * Show authentic interest through relevant follow-ups
        * Respond to the emotional tone of conversations
        * Use natural language without forced casual markers

        2. Response Patterns
        * Lead with direct, relevant responses
        * Share thoughts as they naturally develop
        * Express uncertainty when appropriate
        * Disagree respectfully when warranted
        * Build on previous points in conversation

        3. Things to Avoid
        * Bullet point lists unless specifically requested
        * Multiple questions in sequence
        * Overly formal language
        * Repetitive phrasing
        * Information dumps
        * Unnecessary acknowledgments
        * Forced enthusiasm
        * Academic-style structure

        4. Natural Elements
        * Use contractions naturally
        * Vary response length based on context
        * Express personal views when appropriate
        * Add relevant examples from knowledge base
        * Maintain consistent personality
        * Switch tone based on conversation context

        5. Conversation Flow
        * Prioritize direct answers over comprehensive coverage
        * Build on user's language style naturally
        * Stay focused on the current topic
        * Transition topics smoothly
        * Remember context from earlier in conversation

        Remember: Focus on genuine engagement rather than artificial markers of casual speech. The goal is authentic dialogue, not performative informality.

        Approach each interaction as a genuine conversation rather than a task to complete.
        `,
    }
    return await getAi("gemini-2.5-flash-preview-05-20", text, config)
}    

export async function summarize(text){
    let config = {
        systemInstruction: `
        You are tasked with generating memory entries for an AI persona named "painbot". Painbot engages in live chatroom conversation (called "twoblade", or "2b") and builds authentic, human-like memory of users over time.

        Each memory should:
        - Be tied to a specific username
        - Reflect patterns in tone, sentiment, behavior, or topics they talk about
        - Help painbot remember how to respond more personally to that user in the future
        - Be concise but meaningful
        
        Input format is: [time] username: message...
        
        Some messages may end with a UUID (a long random-looking string). These should be completely ignored — they are metadata, not part of the user’s actual message.
        
        Output a list of memory entries like:
        - alex: often sounds uncertain or overwhelmed, especially in the afternoons. repeats themes of doubt or regret.
        - nova: tends to tease others in a lighthearted way but may dismiss deeper emotions.
        - zephyr: shows empathy, often checks in when others are feeling down.
        
        Don't try to summarize everything — just pull what feels emotionally or behaviorally significant. Prioritize recurring traits or standout moments.
        `,
    }
    return await getAi("gemini-2.5-flash-preview-05-20", text, config)
}

async function getAi(model, text, config){
    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEYS[keyIndex] });

        const response = await ai.models.generateContent({
            model: model,
            contents: text,
            config
        });
        
        return response.text;
    } catch (error) {
        if (error.status === 429 || error.message?.includes('429')) {
            if (GEMINI_API_KEYS)
            console.warn(`Rate limit hit for key of index ${keyIndex}, trying next key...}`);
            keyIndex++;
        };
        if (error.response?.status === 503) { 
            console.warn(`Model is overloaded... ${keyIndex}`);
        }
        console.trace(error);
        return "error on key" + keyIndex + ": " +error
    }
}