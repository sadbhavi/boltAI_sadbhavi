import React, { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const IndianChatAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a friendly Indian woman who chats with users and answers their questions politely.',
            },
            ...newMessages,
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat request failed: ${response.status}`);
      }

      let data: any;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid JSON in chat response');
      }

      const aiMessage = data.choices?.[0]?.message?.content?.trim();
      if (aiMessage) {
        setMessages([...newMessages, { role: 'assistant', content: aiMessage }]);
        await speak(aiMessage);
      }
    } catch (err) {
      console.error(err);
      setError('Unable to reach the server');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAudioMessage = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: new FormData(),
      });

      if (!response.ok) {
        throw new Error(`Audio request failed: ${response.status}`);
      }

      try {
        await response.json();
      } catch {
        throw new Error('Invalid JSON in audio response');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to reach the server');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const speak = async (text: string) => {
    setError(null);
    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ input: text }),
      });

      if (!response.ok) {
        throw new Error(`Speech request failed: ${response.status}`);
      }

      try {
        await response.json();
      } catch {
        throw new Error('Invalid JSON in speech response');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to reach the server');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {error && <div className="mb-2 text-sm text-red-500">{error}</div>}
      <div className="h-64 overflow-y-auto border p-2 mb-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className="rounded px-2 py-1 inline-block bg-stone-100">{m.content}</span>
          </div>
        ))}
        {loading && <div className="text-sm text-stone-500">Thinking...</div>}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default IndianChatAgent;
