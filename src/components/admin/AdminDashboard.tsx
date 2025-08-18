import React, { useState } from 'react';

interface ChatMessage {
  id: number;
  from: 'user' | 'admin';
  message: string;
}

const AdminDashboard: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: 'user', message: 'Hello, I need help with my subscription.' }
  ]);
  const [reply, setReply] = useState('');

  const sendReply = () => {
    if (!reply.trim()) return;
    setMessages([...messages, { id: Date.now(), from: 'admin', message: reply }]);
    setReply('');
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-stone-500">Total Visitors</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-stone-500">Sections Visited</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-stone-500">Plan Purchases</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-stone-500">Pages Viewed</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">User Chat</h2>
        <div className="h-48 overflow-y-auto border border-stone-200 rounded p-2 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 text-sm ${msg.from === 'admin' ? 'text-right' : ''}`}
            >
              <span className="font-medium">
                {msg.from === 'admin' ? 'You' : 'User'}:
              </span>{' '}
              {msg.message}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="flex-1 border border-stone-300 rounded p-2"
            placeholder="Type your reply..."
          />
          <button
            onClick={sendReply}
            className="px-4 py-2 bg-stone-800 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
