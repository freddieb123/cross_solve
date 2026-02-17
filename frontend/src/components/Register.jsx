import React, { useState } from 'react';
import { register } from '../utils/api';

export default function Register({ onRegisterSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    try {
      setLoading(true);
      const response = await register(email, password);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      onRegisterSuccess(response.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setPassword('');
      setConfirmPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md min-h-screen mx-auto bg-newsprint border-x border-stone/20 shadow-2xl shadow-stone/10 flex flex-col items-center justify-center px-6 py-8">
      {/* Masthead */}
      <header className="text-center mb-12 pb-8 border-b border-ink/20 w-full">
        <h1 className="font-display italic font-bold text-4xl mb-2 text-ink">
          The Sunday Edition
        </h1>
        <p className="font-sans text-xs font-semibold tracking-[0.2em] text-stone uppercase">Create Account</p>
      </header>

      {/* Register Form */}
      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="font-sans font-semibold text-xs tracking-widest text-ink uppercase">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
              autoComplete="email"
              className="font-serif text-ink bg-paper border border-ink/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink/50 focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label className="font-sans font-semibold text-xs tracking-widest text-ink uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6+ characters"
                disabled={loading}
                autoComplete="new-password"
                className="w-full font-serif text-ink bg-paper border border-ink/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink/50 focus:border-transparent disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-ink transition-colors disabled:opacity-50"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col gap-2">
            <label className="font-sans font-semibold text-xs tracking-widest text-ink uppercase">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat password"
              disabled={loading}
              autoComplete="new-password"
              className="font-serif text-ink bg-paper border border-ink/30 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ink/50 focus:border-transparent disabled:opacity-50"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-crimson/10 border border-crimson text-crimson px-4 py-3 font-serif text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-newsprint font-sans font-bold text-sm tracking-widest uppercase py-4 hover:bg-ink/90 transition-colors border border-ink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ink disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-8 pt-8 border-t border-ink/20">
          <p className="font-serif text-stone text-sm">
            Already have an account?{' '}
            <a
              href="#login"
              onClick={(e) => {
                e.preventDefault();
                onSwitchToLogin();
              }}
              className="text-navy font-bold hover:text-crimson transition-colors border-b border-navy hover:border-crimson"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
