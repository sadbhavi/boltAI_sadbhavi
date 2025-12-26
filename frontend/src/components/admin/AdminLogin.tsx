import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BackButton from '../common/BackButton';

interface AdminLoginProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error?.message || 'Login failed');
      }

      // Store token
      localStorage.setItem('admin_token', json.data.token);

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl w-80 space-y-4 shadow-lg"
      >
        <div className="absolute top-4 left-4">
          <BackButton to="/" />
        </div>
        <h2 className="text-xl font-semibold text-center mt-6">Admin Login</h2>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Username</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-stone-300 rounded-lg p-2"
            placeholder="admin"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-stone-300 rounded-lg p-2"
            placeholder="Password"
            required
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex space-x-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-2 rounded-lg border border-stone-300 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 rounded-lg bg-stone-800 text-white hover:bg-stone-900 disabled:opacity-50"
          >
            {loading ? '...' : 'Login'}
          </button>
        </div>
        <div className="pt-4 border-t border-stone-100 mt-4 text-center">
          <p className="text-xs text-stone-500 mb-2">Always Happy</p>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
