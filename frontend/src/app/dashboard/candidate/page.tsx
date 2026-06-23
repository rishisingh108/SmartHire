'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/Navbar';

interface Job {
  id: string;
  title: string;
  location: string;
  salary: string;
  createdAt: string;
  company: { name: string };
  _count: { applications: number };
}

interface Application {
  id: string;
  status: string;
  aiScore: number | null;
  aiSummary: string | null;
  createdAt: string;
  job: { title: string; company: { name: string }; location: string };
}

const statusConfig: Record<string, { bg: string; color: string; label: string; icon: string }> = {
  APPLIED:   { bg: '#eff6ff', color: '#2563eb', label: 'Applied', icon: '📤' },
  SCREENING: { bg: '#fef9c3', color: '#ca8a04', label: 'AI Screening', icon: '🤖' },
  INTERVIEW: { bg: '#f0fdf4', color: '#16a34a', label: 'Interview', icon: '🎥' },
  OFFERED:   { bg: '#ecfdf5', color: '#059669', label: 'Offered! 🎉', icon: '🎊' },
  REJECTED:  { bg: '#fef2f2', color: '#dc2626', label: 'Not Selected', icon: '❌' },
};

export default function CandidateDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    if (user?.role !== 'CANDIDATE') { router.push('/dashboard/recruiter'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get('/jobs'),
        api.get('/applications/my'),
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const applyToJob = async (jobId: string) => {
    if (!resumeUrl) { alert('Please enter your resume URL'); return; }
    try {
      await api.post('/applications', { jobId, resumeUrl, resumeText: 'Resume text for AI screening' });
      setApplyingJob(null);
      setResumeUrl('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const appliedJobIds = applications.map(a => a.job?.title);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTop: '3px solid #16a34a', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>
            Hello, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            {applications.length > 0 ? `You have ${applications.length} active application${applications.length > 1 ? 's' : ''}` : 'Start applying to jobs today'}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
          {[
            { label: 'Jobs Available', value: jobs.length, icon: '💼', color: '#2563eb', bg: '#eff6ff' },
            { label: 'Applied', value: applications.length, icon: '📤', color: '#16a34a', bg: '#f0fdf4' },
            { label: 'In Interview', value: applications.filter(a => a.status === 'INTERVIEW').length, icon: '🎥', color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Offers', value: applications.filter(a => a.status === 'OFFERED').length, icon: '🎊', color: '#059669', bg: '#ecfdf5' },
          ].map((s) => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '12px', padding: '18px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', marginBottom: '10px' }}>{s.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '2px' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2px', background: '#f3f4f6', borderRadius: '10px', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
          {(['jobs', 'applications'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none',
                background: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? '#111827' : '#6b7280',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}>
              {tab === 'jobs' ? `💼 Browse Jobs (${jobs.length})` : `📄 My Applications (${applications.length})`}
            </button>
          ))}
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <input
              placeholder="🔍 Search jobs by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredJobs.map((job) => (
                <div key={job.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏢</div>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: 0 }}>{job.title}</h3>
                          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{job.company?.name}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        {job.location && <span style={{ fontSize: '13px', color: '#6b7280' }}>📍 {job.location}</span>}
                        {job.salary && <span style={{ fontSize: '13px', color: '#6b7280' }}>💰 {job.salary}</span>}
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>👥 {job._count?.applications || 0} applicants</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {applyingJob === job.id ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            placeholder="Resume URL (Google Drive / S3)"
                            value={resumeUrl}
                            onChange={(e) => setResumeUrl(e.target.value)}
                            style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #16a34a', fontSize: '13px', outline: 'none', width: '250px' }}
                          />
                          <button onClick={() => applyToJob(job.id)}
                            style={{ padding: '8px 14px', background: '#16a34a', color: 'white', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                            Submit
                          </button>
                          <button onClick={() => setApplyingJob(null)}
                            style={{ padding: '8px 12px', background: '#fff', color: '#6b7280', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', cursor: 'pointer' }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setApplyingJob(job.id)}
                          disabled={appliedJobIds.includes(job.title)}
                          style={{
                            padding: '9px 18px', borderRadius: '8px', border: 'none',
                            background: appliedJobIds.includes(job.title) ? '#f3f4f6' : '#16a34a',
                            color: appliedJobIds.includes(job.title) ? '#9ca3af' : 'white',
                            fontSize: '14px', fontWeight: '600',
                            cursor: appliedJobIds.includes(job.title) ? 'not-allowed' : 'pointer',
                          }}>
                          {appliedJobIds.includes(job.title) ? '✓ Applied' : 'Apply Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {applications.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '12px', padding: '60px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
                <p style={{ fontSize: '16px', fontWeight: '500', color: '#374151', margin: '0 0 8px' }}>No applications yet</p>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 20px' }}>Browse jobs and start applying</p>
                <button onClick={() => setActiveTab('jobs')}
                  style={{ padding: '10px 20px', background: '#16a34a', color: 'white', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Browse Jobs →
                </button>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 4px' }}>{app.job?.title}</h3>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{app.job?.company?.name} • {app.job?.location || 'Remote'}</p>
                    </div>
                    <span style={{ padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', background: statusConfig[app.status]?.bg, color: statusConfig[app.status]?.color }}>
                      {statusConfig[app.status]?.icon} {statusConfig[app.status]?.label}
                    </span>
                  </div>

                  {app.aiScore !== null && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>🤖 AI Match Score</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: app.aiScore >= 70 ? '#16a34a' : app.aiScore >= 50 ? '#d97706' : '#dc2626' }}>{app.aiScore}/100</span>
                      </div>
                      <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${app.aiScore}%`, height: '100%', background: app.aiScore >= 70 ? '#16a34a' : app.aiScore >= 50 ? '#d97706' : '#ef4444', borderRadius: '3px', transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  )}

                  {app.aiSummary && (
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px', lineHeight: '1.5', background: '#f9fafb', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #16a34a' }}>
                      🤖 {app.aiSummary}
                    </p>
                  )}

                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                    Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}