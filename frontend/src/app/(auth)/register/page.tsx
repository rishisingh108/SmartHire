'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'CANDIDATE' as 'RECRUITER' | 'CANDIDATE',
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!formData.name) e.name = 'Name is required';
    else if (formData.name.length < 2) e.name = 'Minimum 2 characters';
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
      const res = await api.post('/auth/register', formData);
      setAuth(res.data.user, res.data.token);
      router.push(res.data.user.role === 'RECRUITER' ? '/dashboard/recruiter' : '/dashboard/candidate');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError?: string) => ({
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: hasError ? '1.5px solid #ef4444' : '1.5px solid #d1d5db',
    fontSize: '15px', color: '#111827', outline: 'none',
    background: '#fff', boxSizing: 'border-box' as const, transition: 'all 0.15s',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '40px', background: '#ffffff',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Logo */}
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

          <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#111827', margin: '0 0 6px' }}>
            Create your account
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 28px' }}>
            Join 10,000+ companies hiring smarter
          </p>

          {/* Role Toggle */}
          <div style={{
            display: 'flex', background: '#f3f4f6',
            borderRadius: '10px', padding: '4px', marginBottom: '24px',
            border: '1px solid #e5e7eb',
          }}>
            {(['CANDIDATE', 'RECRUITER'] as const).map((role) => (
              <button key={role} type="button"
                onClick={() => setFormData({ ...formData, role })}
                style={{
                  flex: 1, padding: '9px', borderRadius: '8px', border: 'none',
                  background: formData.role === role ? '#16a34a' : 'transparent',
                  color: formData.role === role ? 'white' : '#6b7280',
                  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}>
                {role === 'CANDIDATE' ? '🎯 Job Seeker' : '🏢 Recruiter'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Full name
              </label>
              <input
                placeholder="Rishi Singh"
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: undefined }); }}
                style={inputStyle(errors.name)}
                onFocus={(e) => { e.target.style.border = '1.5px solid #16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
                onBlur={(e) => { if (!errors.name) { e.target.style.border = '1.5px solid #d1d5db'; e.target.style.boxShadow = 'none'; }}}
              />
              {errors.name && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>⚠ {errors.name}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Work email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: undefined }); }}
                style={inputStyle(errors.email)}
                onFocus={(e) => { e.target.style.border = '1.5px solid #16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
                onBlur={(e) => { if (!errors.email) { e.target.style.border = '1.5px solid #d1d5db'; e.target.style.boxShadow = 'none'; }}}
              />
              {errors.email && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>⚠ {errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors({ ...errors, password: undefined }); }}
                  style={{ ...inputStyle(errors.password), paddingRight: '44px' }}
                  onFocus={(e) => { e.target.style.border = '1.5px solid #16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
                  onBlur={(e) => { if (!errors.password) { e.target.style.border = '1.5px solid #d1d5db'; e.target.style.boxShadow = 'none'; }}}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px' }}>⚠ {errors.password}</p>}

              {/* Password strength */}
              {formData.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                    {[1,2,3,4].map((i) => (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '2px',
                        background: formData.password.length >= i * 2
                          ? i <= 1 ? '#ef4444' : i <= 2 ? '#f59e0b' : i <= 3 ? '#3b82f6' : '#16a34a'
                          : '#e5e7eb',
                        transition: 'background 0.2s',
                      }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
                    {formData.password.length < 4 ? 'Weak' : formData.password.length < 6 ? 'Fair' : formData.password.length < 8 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}
            </div>

            {apiError && (
              <div style={{
                padding: '12px 14px', borderRadius: '8px', marginBottom: '20px',
                background: '#fef2f2', border: '1px solid #fecaca',
                color: '#dc2626', fontSize: '14px',
              }}>⚠ {apiError}</div>
            )}

            <button type="submit" disabled={loading}
              style={{
                width: '100%', padding: '11px', borderRadius: '8px', border: 'none',
                background: loading ? '#86efac' : '#16a34a',
                color: 'white', fontSize: '15px', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s', marginBottom: '16px',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#15803d'; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#16a34a'; }}
            >
              {loading ? 'Creating account...' : 'Create free account →'}
            </button>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '13px', margin: '0 0 20px' }}>
              By creating an account, you agree to our{' '}
              <span style={{ color: '#16a34a', cursor: 'pointer' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: '#16a34a', cursor: 'pointer' }}>Privacy Policy</span>
            </p>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: '#16a34a', fontWeight: '600', textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden',
        display: 'none',
      }}
        className="right-panel"
      >
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '400px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '28px', fontWeight: '700', margin: '0 0 12px' }}>
            Hire smarter with AI
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', margin: '0 0 40px', lineHeight: '1.6' }}>
            SmartHire uses GPT-4 to screen resumes, rank candidates, and schedule interviews automatically.
          </p>

          {/* Features */}
          {[
            { icon: '🤖', title: 'AI Resume Screening', desc: 'Auto-score candidates in seconds' },
            { icon: '🎥', title: 'Video Interviews', desc: 'Built-in WebRTC video calls' },
            { icon: '🔍', title: 'Semantic Search', desc: 'Find candidates by meaning, not keywords' },
            { icon: '📧', title: 'Auto Outreach', desc: 'AI-written personalized emails' },
          ].map((f) => (
            <div key={f.title} style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              background: 'rgba(255,255,255,0.07)', borderRadius: '12px',
              padding: '14px 16px', marginBottom: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'left',
            }}>
              <span style={{ fontSize: '22px' }}>{f.icon}</span>
              <div>
                <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{f.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{f.desc}</div>
              </div>
              <div style={{ marginLeft: 'auto', color: '#4ade80', fontSize: '16px' }}>✓</div>
            </div>
          ))}
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