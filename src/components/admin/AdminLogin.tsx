import React, { useState } from 'react';

interface AdminLoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onSuccess();
      setPassword('');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-80 space-y-4 shadow-lg"
      >
        <h2 className="text-xl font-semibold text-center">Admin Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-stone-300 rounded-lg p-2"
          placeholder="Password"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-stone-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2 rounded-lg bg-stone-800 text-white"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
