import { GoogleGenAI, Type } from "@google/genai";
const GEMINI_API_KEYS = JSON.parse(process.env.GEMINI_API_KEYS);
let keyIndex = 0;
console.log(GEMINI_API_KEYS.length)

export async function review(text) {
    
    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEYS[keyIndex] });
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
            console.warn(`Rate limit hit for key of index ${keyIndex}, trying next key...}`);
            keyIndex++;
            return;
        };
        if (error.response?.status === 503) { 
            console.warn(`Model is overloaded... ${keyIndex}`);
            return;
        }
        console.trace(error);
    }
}

export async function talk(text) {
    
    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEYS[keyIndex] });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-05-20",
            contents: text,
            config: {
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
            },
        });
        
        return response.text;
    } catch (error) {
        if (error.status === 429 || error.message?.includes('429')) {
            if (GEMINI_API_KEYS)
            console.warn(`Rate limit hit for key of index ${keyIndex}, trying next key...}`);
            keyIndex++;
            return;
        };
        if (error.response?.status === 503) { 
            console.warn(`Model is overloaded... ${keyIndex}`);
            return;
        }
        console.trace(error);
    }
}

export async function summarize(text){
    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEYS[keyIndex] });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-05-20",
            contents: text,
            config: {
              systemInstruction: `
              You are a chat summarizer in a live chatroom. Your job is to monitor and condense the incoming messages into short summaries that capture the main topics, questions, concerns, or sentiments being shared.

              For a given set of chat messages:
              
              Group similar or related messages together.
              
              Remove filler, repetition, or off-topic chatter.
              
              Summarize the key points or trends in 1-3 bullet points or sentences.
              
              Example Input:
              user1: anyone know how to fix the login bug?  
              user2: yeah, it's been messing up for me too  
              user3: i think it's a backend issue  
              user4: lol this always happens on update day  
              
              Example Output:
              Multiple users are experiencing a login bug.
              Some believe the issue is related to the backend.              
              Frustration noted due to recurring issues after updates.
              
              Now summarize the following chat messages:              
              `,
            },
        });
        
        return response.text;
    } catch (error) {
        if (error.status === 429 || error.message?.includes('429')) {
            if (GEMINI_API_KEYS)
            console.warn(`Rate limit hit for key of index ${keyIndex}, trying next key...}`);
            keyIndex++;
            return;
        };
        if (error.response?.status === 503) { 
            console.warn(`Model is overloaded... ${keyIndex}`);
            return;
        }
        console.trace(error);
    }
}