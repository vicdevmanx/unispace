import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspacePortalContext } from '../../../../contexts/WorkspacePortalContext';

const WorkspaceLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, loading, error } = useWorkspacePortalContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const success = await login(email, password);
    if (success) {
      navigate('/workspace/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#1D3A8A]">Workspace Login</h2>
        <input type="email" className="border rounded px-4 py-2 mb-3 w-full" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" className="border rounded px-4 py-2 mb-3 w-full" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        {(formError || error) && <div className="text-red-500 text-sm mb-2">{formError || error}</div>}
        <button type="submit" className="bg-[#1D3A8A] text-white font-semibold py-2 rounded w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account? <a href="/workspace/register" className="text-[#1D3A8A] underline">Register</a>
        </div>
      </form>
    </div>
  );
};

export default WorkspaceLogin; 