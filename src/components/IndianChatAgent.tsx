import React, { useRef, useState } from 'react';
import React, { useState } from 'react';
main

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const IndianChatAgent: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const sendMessage = async (content: string) => {
    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);

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
          model: 'gpt-4o-mini',

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
      const data = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const aiMessage = data.choices?.[0]?.message?.content?.trim();
      if (aiMessage) {
        setMessages([...newMessages, { role: 'assistant', content: aiMessage }]);
        await speak(aiMessage);

      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content?.trim();
      if (aiMessage) {
        setMessages([...newMessages, { role: 'assistant', content: aiMessage }]);
      main
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    await sendMessage(text);
  };

  const handleAudioMessage = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice.webm');
      formData.append('model', 'whisper-1');
      const transcriptRes = await fetch(
        'https://api.openai.com/v1/audio/transcriptions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: formData,
        },
      );
      const transcriptData = (await transcriptRes.json()) as { text?: string };
      const text = transcriptData.text?.trim();
      if (text) {
        await sendMessage(text);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleRecording = async () => {
    if (recording) {
      mediaRecorderRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioMessage(audioBlob);
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const speak = async (text: string) => {
    try {
      const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini-tts',
          voice: 'alloy',
          input: text,
        }),
      });
      const buffer = await ttsRes.arrayBuffer();
      const audioUrl = URL.createObjectURL(new Blob([buffer]));
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="h-72 overflow-y-auto border p-4 mb-4 bg-white rounded">
        {messages.map((m, idx) => (
          <div key={idx} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span
              className={`inline-block rounded px-3 py-2 ${
                m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-stone-200'
              }`}
            >
              {m.content}
            </span>
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
          onClick={handleTextSend}

          onClick={sendMessage}
        main
          disabled={loading}
        >
          Send
        </button>
        <button
          className={`${recording ? 'bg-red-500' : 'bg-green-500'} text-white px-3 py-1 rounded`}
          onClick={toggleRecording}
          disabled={loading}
        >
          {recording ? 'Stop' : '🎤'}
        </button>
      </div>
    </div>
  );
};

export default IndianChatAgent;
