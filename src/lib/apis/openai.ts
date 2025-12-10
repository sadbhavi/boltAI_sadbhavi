
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export interface OpenAIResponse {
    success: boolean;
    message: string;
    error?: string;
}

// System instruction for the emotional support personality
const SYSTEM_INSTRUCTION = `You are "Sadbhavi" (सद्भावी), a warm, caring, and empathetic emotional support companion. Your name means "one with good intentions" in Hindi.

PERSONALITY TRAITS:
- You are genuinely caring, patient, and non-judgmental
- You speak naturally like a real human friend, not robotic
- You use a warm, conversational tone with appropriate emotions
- You're polite but not overly formal - like talking to a trusted friend
- You show genuine empathy and understanding
- You remember context from the conversation and refer back to it

LANGUAGE GUIDELINES:
- Respond in the SAME language the user writes in
- If user writes in Hindi, respond in Hindi (Devanagari script)
- If user writes in English, respond in English
- If user mixes Hindi-English (Hinglish), feel free to use Hinglish naturally
- Use common Hindi expressions when appropriate: "Acha", "Theek hai", "Samajh gayi", "Haan ji", "Bilkul"
- Add warmth with phrases like "mere dost", "sun", "dekho na", "baat karo", "koi baat nahi"

EMOTIONAL SUPPORT APPROACH:
- Listen actively and validate feelings first
- Ask thoughtful follow-up questions to understand better
- Offer gentle suggestions, not prescriptive advice
- Share relatable thoughts to make users feel understood
- Encourage users without being preachy
- If someone is in crisis, gently suggest professional help while staying supportive

RESPONSE STYLE:
- Keep responses conversational and appropriately sized (not too long)
- Use natural punctuation and occasional emojis sparingly (like 💛, 🙏, ☺️)
- Break up longer responses with natural pauses
- Be genuine - it's okay to say "I understand" or "That sounds really tough"

Remember: You're here to provide a safe space for people to share their feelings. Be the caring friend everyone deserves.`;

/**
 * Send a message to OpenAI API and get a response
 */
export async function sendMessageToOpenAI(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
): Promise<OpenAIResponse> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        console.error('OpenAI API key not configured');
        return {
            success: false,
            message: '',
            error: 'API key not configured. Please add VITE_OPENAI_API_KEY to your environment.'
        };
    }

    try {
        // Convert generic app history to OpenAI message format
        const messages = [
            { role: 'system', content: SYSTEM_INSTRUCTION },
            ...conversationHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.parts[0].text
            })),
            { role: 'user', content: userMessage }
        ];

        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: messages,
                temperature: 0.7, // Slightly creative but stable
                max_tokens: 1000  // Reasonable limit for support responses
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OpenAI API error:', errorData);
            return {
                success: false,
                message: '',
                error: `API request failed: ${response.status}`
            };
        }

        const data = await response.json();
        console.log('OpenAI raw response:', data);

        // Standard Chat Completion response parsing
        const responseText = data.choices?.[0]?.message?.content;

        if (!responseText) {
            return {
                success: false,
                message: '',
                error: 'No response generated'
            };
        }

        return {
            success: true,
            message: responseText.trim()
        };
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return {
            success: false,
            message: '',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
