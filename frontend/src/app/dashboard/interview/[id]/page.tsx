'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Interview {
  id: string;
  roomUrl: string;
  scheduledAt: string;
  application: {
    candidate: { name: string; email: string };
    job: { title: string; company: { name: string } };
  };
}

export default function InterviewRoom() {
  const params = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/interviews/${params.id}`);
        setInterview(res.data);
      } catch {
        router.push('/dashboard/recruiter');
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [params.id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #7c3aed', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Loading interview room...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!interview) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(124,58,237,0.12) 0%, transparent 65%)' }} />
      <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '480px', textAlign: 'center', position: 'relative', zIndex: 1 }}>

        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', boxShadow: '0 0 32px rgba(124,58,237,0.4)' }}>🎥</div>

        <h1 style={{ color: 'white', fontSize: '22px', fontWeight: '700', margin: '0 0 8px' }}>Ready to join?</h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', margin: '0 0 24px' }}>
          {interview.application?.job?.title} Interview
        </p>

        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Candidate</span>
            <span style={{ fontSize: '13px', color: 'white', fontWeight: '500' }}>{interview.application?.candidate?.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Position</span>
            <span style={{ fontSize: '13px', color: 'white', fontWeight: '500' }}>{interview.application?.job?.title}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Scheduled</span>
            <span style={{ fontSize: '13px', color: 'white', fontWeight: '500' }}>
              {new Date(interview.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' })} IST
            </span>
          </div>
        </div>

        <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', marginBottom: '24px', textAlign: 'left' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 6px' }}>Before joining, make sure:</p>
          {['Camera & microphone are working', 'You are in a quiet environment', 'Stable internet connection'].map((tip, i) => (
            <div key={i} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '3px' }}>✓ {tip}</div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => router.back()}
            style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
            ← Back
          </button>
          <button onClick={() => window.open(interview.roomUrl, '_blank')}
            style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
            🎥 Join Interview
          </button>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', marginTop: '16px' }}>
          Opens in Daily.co — no download required
        </p>
      </div>
    </div>
  );
}