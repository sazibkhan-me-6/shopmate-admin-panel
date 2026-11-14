'use client';
import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('admin@shopmate.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Demo validation - allows demo credentials or any valid looking combo
      if (email.includes('@') && password.length >= 4) {
        const user: UserProfile = {
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: email.trim(),
          role: 'Store Administrator',
          avatar: email.substring(0, 2).toUpperCase(),
        };
        if (rememberMe && typeof window !== 'undefined') {
          localStorage.setItem('shopmate_auth_user', JSON.stringify(user));
        }
        onLogin(user);
      } else {
        setError('Invalid credentials. You can use the demo credentials below.');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickDemo = () => {
    setEmail('admin@shopmate.com');
    setPassword('admin123');
    setError('');
    const user: UserProfile = {
      name: 'Admin User',
      email: 'admin@shopmate.com',
      role: 'Store Administrator',
      avatar: 'AU',
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopmate_auth_user', JSON.stringify(user));
    }
    onLogin(user);
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-header">
          <div className="login-brandmark">S</div>
          <h1>ShopMate Admin</h1>
          <p>Sign in to manage products, categories & store orders</p>
        </div>

        {error && (
          <div className="login-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <div className="input-with-icon">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                autoComplete="email"
              />
              <span className="input-addon-icon"><Mail size={16} /></span>
            </div>
          </div>

          <div className="input-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
            </div>
            <div className="input-with-icon">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="remember-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span>Remember this session</span>
            </label>
          </div>

          <button type="submit" className="btn primary login-submit" disabled={isLoading}>
            {isLoading ? 'Signing in...' : <>Sign in to dashboard <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="login-demo-box">
          <div className="demo-header">
            <CheckCircle2 size={14} color="#6b5ce7" />
            <span><b>Demo Credentials</b></span>
          </div>
          <div className="demo-credentials">
            <div>Email: <code>admin@shopmate.com</code></div>
            <div>Password: <code>admin123</code></div>
          </div>
          <button type="button" onClick={handleQuickDemo} className="btn-demo">
            ⚡ One-Click Demo Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
