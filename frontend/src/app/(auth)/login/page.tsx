'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!formData.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Enter a valid email';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setApiError('');
    try {
      const res = await api.post('/auth/login', formData);
      setAuth(res.data.user, res.data.token);
      router.push(res.data.user.role === 'RECRUITER' ? '/dashboard/recruiter' : '/dashboard/candidate');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '40px',
        background: '#ffffff',
      }}>
        {/* Logo */}
        <div style={{ width: '100%', maxWidth: '400px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontWeight: '800', fontSize: '18px' }}>S</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>SmartHire</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>
            Welcome back
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 32px' }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: undefined }); }}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: errors.email ? '1.5px solid #ef4444' : '1.5px solid #d1d5db',
                  fontSize: '15px', color: '#111827', outline: 'none',
                  background: '#fff', boxSizing: 'border-box', transition: 'border 0.15s',
                }}
                onFocus={(e) => { if (!errors.email) e.target.style.border = '1.5px solid #16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
                onBlur={(e) => { if (!errors.email) e.target.style.border = '1.5px solid #d1d5db'; e.target.style.boxShadow = 'none'; }}
              />
              {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>⚠ {errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>Password</label>
                <span style={{ fontSize: '13px', color: '#16a34a', cursor: 'pointer', fontWeight: '500' }}>Forgot password?</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: undefined }); }}
                  style={{
                    width: '100%', padding: '10px 44px 10px 14px', borderRadius: '8px',
                    border: errors.password ? '1.5px solid #ef4444' : '1.5px solid #d1d5db',
                    fontSize: '15px', color: '#111827', outline: 'none',
                    background: '#fff', boxSizing: 'border-box', transition: 'border 0.15s',
                  }}
                  onFocus={(e) => { if (!errors.password) e.target.style.border = '1.5px solid #16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
                  onBlur={(e) => { if (!errors.password) e.target.style.border = '1.5px solid #d1d5db'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px' }}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>⚠ {errors.password}</p>}
            </div>

            {apiError && (
              <div style={{
                padding: '12px 14px', borderRadius: '8px', marginBottom: '20px',
                background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '14px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                ⚠ {apiError}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '11px', borderRadius: '8px', border: 'none',
                background: loading ? '#86efac' : '#16a34a',
                color: 'white', fontSize: '15px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', marginBottom: '20px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#15803d'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#16a34a'; }}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
              Don't have an account?{' '}
              <Link href="/register" style={{ color: '#16a34a', fontWeight: '600', textDecoration: 'none' }}>
                Create free account
              </Link>
            </p>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: '13px' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Social */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {['Google', 'LinkedIn', 'GitHub'].map((provider) => (
              <button key={provider} style={{
                flex: 1, padding: '9px', borderRadius: '8px',
                border: '1.5px solid #e5e7eb', background: '#fff',
                fontSize: '13px', fontWeight: '500', color: '#374151',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.border = '1.5px solid #16a34a'; e.currentTarget.style.background = '#f0fdf4'; }}
                onMouseLeave={(e) => { e.currentTarget.style.border = '1.5px solid #e5e7eb'; e.currentTarget.style.background = '#fff'; }}
              >
                {provider}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, display: 'none',
        background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden',
      }}
        className="right-panel"
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '400px', textAlign: 'center' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
            {[
              { val: '3x', label: 'Faster hiring' },
              { val: '85%', label: 'Better candidate fit' },
              { val: '60%', label: 'Cost reduction' },
              { val: '10k+', label: 'Companies trust us' },
            ].map((stat) => (
              <div key={stat.val} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: '12px',
                padding: '20px', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: '#4ade80', marginBottom: '4px' }}>{stat.val}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div style={{
            background: 'rgba(255,255,255,0.08)', borderRadius: '16px',
            padding: '24px', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px', fontStyle: 'italic' }}>
              "SmartHire's AI screening saved us 40 hours per week. The quality of candidates has never been better."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #4ade80, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#052e16', fontWeight: '700', fontSize: '14px' }}>R</span>
              </div>
              <div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Rahul Mehta</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Head of Talent, TechCorp India</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .right-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
}