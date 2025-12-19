import React, { useState } from 'react';

export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  likes: number;
}

interface DatingProfileFormProps {
  onCreate: (profile: Profile) => void;
}

const DatingProfileForm: React.FC<DatingProfileFormProps> = ({ onCreate }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age) return;
    const profile: Profile = {
      id: Date.now().toString(),
      name,
      age: Number(age),
      bio,
      interests: interests.split(',').map(i => i.trim()).filter(Boolean),
      likes: 0
    };
    onCreate(profile);
    setName('');
    setAge('');
    setBio('');
    setInterests('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 max-w-md">
      <input
        className="w-full border border-stone-300 rounded p-2"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="w-full border border-stone-300 rounded p-2"
        placeholder="Age"
        type="number"
        value={age}
        onChange={e => setAge(e.target.value)}
      />
      <textarea
        className="w-full border border-stone-300 rounded p-2"
        placeholder="Bio"
        value={bio}
        onChange={e => setBio(e.target.value)}
      />
      <input
        className="w-full border border-stone-300 rounded p-2"
        placeholder="Interests (comma separated)"
        value={interests}
        onChange={e => setInterests(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-pink-600 text-white rounded"
      >
        Create Profile
      </button>
    </form>
  );
};

export default DatingProfileForm;
