import React, { useState } from 'react';
import DatingProfileForm, { Profile } from './DatingProfileForm';

interface ChatMessage {
  id: string;
  sender: 'me' | 'them';
  text: string;
}

const initialProfiles: Profile[] = [
  {
    id: 'p1',
    name: 'Asha',
    age: 26,
    bio: 'Loves hiking and music.',
    interests: ['hiking', 'music'],
    likes: 0
  },
  {
    id: 'p2',
    name: 'Rohit',
    age: 28,
    bio: 'Foodie and traveler.',
    interests: ['food', 'travel'],
    likes: 0
  }
];

const DatingSection: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [chatProfile, setChatProfile] = useState<Profile | null>(null);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [message, setMessage] = useState('');

  const handleCreate = (profile: Profile) => {
    setUserProfile(profile);
    setProfiles(prev => [...prev, profile]);
  };

  const likeProfile = (target: Profile) => {
    setProfiles(prev =>
      prev.map(p => p.id === target.id ? { ...p, likes: p.likes + 1 } : p)
    );
  };

  const simulateLikeFrom = (from: Profile) => {
    setNotifications(prev => [...prev, `${from.name} liked your profile`]);
  };

  const openChat = (profile: Profile) => {
    setChatProfile(profile);
    if (!chats[profile.id]) {
      setChats(prev => ({ ...prev, [profile.id]: [] }));
    }
  };

  const sendMessage = () => {
    if (!chatProfile || !message.trim()) return;
    const newMsg: ChatMessage = { id: Date.now().toString(), sender: 'me', text: message };
    setChats(prev => ({
      ...prev,
      [chatProfile.id]: [...(prev[chatProfile.id] || []), newMsg]
    }));
    setMessage('');
  };

  return (
    <div className="p-4 space-y-4">
      {!userProfile ? (
        <DatingProfileForm onCreate={handleCreate} />
      ) : (
        <>
          <div>
            <h2 className="text-xl font-semibold mb-2">Profiles</h2>
            <ul className="grid sm:grid-cols-2 gap-4">
              {profiles.filter(p => p.id !== userProfile.id).map(p => (
                <li key={p.id} className="border rounded p-4 text-sm space-y-2">
                  <h3 className="font-medium">{p.name}, {p.age}</h3>
                  <p>{p.bio}</p>
                  <button className="text-pink-600" onClick={() => likeProfile(p)}>Like</button>
                  <button className="ml-2 text-stone-600" onClick={() => simulateLikeFrom(p)}>Simulate Like</button>
                  <button className="ml-2 text-blue-600" onClick={() => openChat(p)}>Chat</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Notifications</h2>
            {notifications.length === 0 ? (
              <p className="text-sm text-stone-500">No notifications</p>
            ) : (
              <ul className="text-sm list-disc list-inside">
                {notifications.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}
          </div>

          {chatProfile && (
            <div className="fixed bottom-4 right-4 w-64 bg-white border rounded shadow-lg">
              <div className="p-2 border-b flex justify-between items-center">
                <span className="font-medium text-sm">Chat with {chatProfile.name}</span>
                <button onClick={() => setChatProfile(null)}>×</button>
              </div>
              <div className="p-2 h-40 overflow-y-auto text-sm">
                {(chats[chatProfile.id] || []).map(m => (
                  <div key={m.id} className={`mb-1 ${m.sender === 'me' ? 'text-right' : ''}`}>{m.text}</div>
                ))}
              </div>
              <div className="p-2 border-t flex">
                <input
                  className="flex-1 border rounded px-1 text-sm"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <button className="ml-1 text-sm text-blue-600" onClick={sendMessage}>Send</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DatingSection;
