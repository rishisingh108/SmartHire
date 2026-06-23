'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/Navbar';

export default function NewJobPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '', description: '', requirements: '',
    location: '', salary: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.title) e.title = 'Job title is required';
    if (!formData.description || formData.description.length < 50) e.description = 'Description must be at least 50 characters';
    if (!formData.requirements || formData.requirements.length < 20) e.requirements = 'Requirements must be at least 20 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setApiError('');
    try {
      await api.post('/jobs', formData);
      router.push('/dashboard/recruiter');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError?: string) => ({
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: hasError ? '1.5px solid #ef4444' : '1.5px solid #d1d5db',
    fontSize: '14px', color: '#111827', outline: 'none',
    background: '#fff', boxSizing: 'border-box' as const,
    fontFamily: 'inherit', transition: 'all 0.15s',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <button onClick={() => router.back()}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#6b7280', fontSize: '14px', cursor: 'pointer', marginBottom: '12px', padding: 0 }}>
            ← Back
          </button>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>Post a New Job</h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Fill in the details below — AI will use this to screen candidates automatically</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '28px' }}>
          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Job Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                placeholder="e.g. Senior Frontend Developer"
                value={formData.title}
                onChange={(e) => { setFormData({ ...formData, title: e.target.value }); setErrors({ ...errors, title: '' }); }}
                style={inputStyle(errors.title)}
                onFocus={(e) => { e.target.style.border = '1.5px solid #16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
                onBlur={(e) => { if (!errors.title) { e.target.style.border = '1.5px solid #d1d5db'; e.target.style.boxShadow = 'none'; }}}
              />
              {errors.title && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>⚠ {errors.title}</p>}
            </div>

            {/* Location + Salary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Location</label>
                <input
                  placeholder="e.g. Bangalore, Remote"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={inputStyle()}
                  onFocus={(e) => { e.target.style.border = '1.5px solid #16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
                  onBlur={(e) => { e.target.style.border = '1.5px solid #d1d5db'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Salary Range</label>
                <input
                  placeholder="e.g. ₹8L - ₹15L per annum"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  style={inputStyle()}
                  onFocus={(e) => { e.target.style.border = '1.5px solid #16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
                  onBlur={(e) => { e.target.style.border = '1.5px solid #d1d5db'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Job Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                placeholder="Describe the role, responsibilities, and what success looks like in this position..."
                value={formData.description}
                onChange={(e) => { setFormData({ ...formData, description: e.target.value }); setErrors({ ...errors, description: '' }); }}
                rows={6}
                style={{ ...inputStyle(errors.description), resize: 'vertical' }}
                onFocus={(e) => { e.target.style.border = '1.5px solid #16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
                onBlur={(e) => { if (!errors.description) { e.target.style.border = '1.5px solid #d1d5db'; e.target.style.boxShadow = 'none'; }}}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                {errors.description ? <p style={{ color: '#ef4444', fontSize: '12px', margin: 0 }}>⚠ {errors.description}</p> : <span />}
                <span style={{ fontSize: '12px', color: formData.description.length < 50 ? '#ef4444' : '#9ca3af' }}>
                  {formData.description.length}/50 min
                </span>
              </div>
            </div>

            {/* Requirements */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Requirements <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                placeholder="List the skills, experience, and qualifications required..."
                value={formData.requirements}
                onChange={(e) => { setFormData({ ...formData, requirements: e.target.value }); setErrors({ ...errors, requirements: '' }); }}
                rows={5}
                style={{ ...inputStyle(errors.requirements), resize: 'vertical' }}
                onFocus={(e) => { e.target.style.border = '1.5px solid #16a34a'; e.target.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
                onBlur={(e) => { if (!errors.requirements) { e.target.style.border = '1.5px solid #d1d5db'; e.target.style.boxShadow = 'none'; }}}
              />
              {errors.requirements && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>⚠ {errors.requirements}</p>}
            </div>

            {/* AI Notice */}
            <div style={{ padding: '14px 16px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', marginBottom: '24px', display: 'flex', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>🤖</span>
              <div>
                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: '#15803d' }}>AI Screening Enabled</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#16a34a' }}>
                  When candidates apply, AI will automatically screen their resume against this job description and assign a match score.
                </p>
              </div>
            </div>

            {apiError && (
              <div style={{ padding: '12px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '14px', marginBottom: '20px' }}>
                ⚠ {apiError}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => router.back()}
                style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#fff', fontSize: '14px', fontWeight: '600', color: '#374151', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="submit" disabled={loading}
                style={{ flex: 2, padding: '11px', borderRadius: '8px', border: 'none', background: loading ? '#86efac' : '#16a34a', color: 'white', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = '#15803d'; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = '#16a34a'; }}
              >
                {loading ? 'Posting...' : '🚀 Post Job & Enable AI Screening'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}