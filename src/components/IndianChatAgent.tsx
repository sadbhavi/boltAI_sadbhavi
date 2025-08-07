import React, { useEffect, useState } from 'react';

type RecordingEvent = Event & { data: Blob };

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const IndianChatAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let recorder: MediaRecorder | undefined;
    const setupRecorder = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event: RecordingEvent) => {
          // placeholder for handling recorded audio data
          event.data.arrayBuffer();
        };
      } catch (error) {
        console.error(error);
      }
    };
    setupRecorder();
    return () => {
      recorder?.stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
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
      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content?.trim();
      if (aiMessage) {
        setMessages([...newMessages, { role: 'assistant', content: aiMessage }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
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
