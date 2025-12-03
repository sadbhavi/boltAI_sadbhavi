/**
 * Gemini API Service for Emotional Support Chat
 * Provides natural, human-like conversations with Hindi-English bilingual support
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiResponse {
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
 * Send a message to Gemini API and get a response
 */
export async function sendMessageToGemini(
  userMessage: string,
  conversationHistory: ChatMessage[] = []
): Promise<GeminiResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Gemini API key not configured');
    return {
      success: false,
      message: '',
      error: 'API key not configured. Please add VITE_GEMINI_API_KEY to your environment.'
    };
  }

  try {
    // Build the contents array with conversation history
    const contents = [
      ...conversationHistory,
      {
        role: 'user' as const,
        parts: [{ text: userMessage }]
      }
    ];

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_ONLY_HIGH'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_ONLY_HIGH'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_ONLY_HIGH'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_ONLY_HIGH'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      return {
        success: false,
        message: '',
        error: `API request failed: ${response.status}`
      };
    }

    const data = await response.json();
    
    // Extract the response text
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
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
    console.error('Error calling Gemini API:', error);
    return {
      success: false,
      message: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Convert app message format to Gemini conversation history format
 */
export function convertToGeminiHistory(
  messages: Array<{ sender: string; text: string }>
): ChatMessage[] {
  return messages
    .filter(msg => msg.sender === 'user' || msg.sender === 'support')
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.text }]
    }));
}

