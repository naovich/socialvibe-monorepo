import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useSocialStore } from '../store';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { fetchCurrentUser, fetchPosts, connectWebSocket } = useSocialStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.login(email, password);
      
      // Navigate immediately after successful login
      navigate('/');
      
      // Load user data (in background, errors won't block navigation)
      fetchCurrentUser().catch(console.error);
      fetchPosts().catch(console.error);
      connectWebSocket();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">SocialVibe</h1>
          <p className="text-gray-400">Welcome back! Sign in to continue</p>
        </div>

        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                placeholder="alice@socialvibe.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
                placeholder="••••••••"
                required
              />
              <div className="mt-2 text-right">
                <Link to="/forgot-password" className="text-sm text-orange-500 hover:text-orange-400">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-500 hover:underline font-bold">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-500 text-xs text-center mb-3">Test Accounts (password: password123)</p>
            <div className="grid grid-cols-2 gap-2">
              {['alice@socialvibe.com', 'bob@socialvibe.com', 'charlie@socialvibe.com', 'diana@socialvibe.com'].map((testEmail) => (
                <button
                  key={testEmail}
                  type="button"
                  onClick={() => {
                    setEmail(testEmail);
                    setPassword('password123');
                  }}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white text-xs transition-all"
                >
                  {testEmail.split('@')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
