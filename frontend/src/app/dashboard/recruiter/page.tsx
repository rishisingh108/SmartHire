'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/Navbar';

interface Stats {
  totalJobs: number;
  totalApplications: number;
  pendingReviews: number;
  interviewsScheduled: number;
}

interface Application {
  id: string;
  status: string;
  aiScore: number | null;
  aiSummary: string | null;
  aiSkills: string[];
  createdAt: string;
  candidate: { id: string; name: string; email: string };
  job: { id: string; title: string; company: { name: string } };
}

interface Job {
  id: string;
  title: string;
  location: string;
  createdAt: string;
  isActive: boolean;
  _count: { applications: number };
  company: { name: string };
}

const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  APPLIED:    { bg: '#eff6ff', color: '#2563eb', label: 'Applied' },
  SCREENING:  { bg: '#fef9c3', color: '#ca8a04', label: 'Screening' },
  INTERVIEW:  { bg: '#f0fdf4', color: '#16a34a', label: 'Interview' },
  OFFERED:    { bg: '#ecfdf5', color: '#059669', label: 'Offered' },
  REJECTED:   { bg: '#fef2f2', color: '#dc2626', label: 'Rejected' },
};

export default function RecruiterDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'jobs'>('overview');

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    if (user?.role !== 'RECRUITER') { router.push('/dashboard/candidate'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes] = await Promise.all([api.get('/jobs')]);
      setJobs(jobsRes.data);
      if (jobsRes.data.length > 0) {
        const appRes = await api.get(`/applications/job/${jobsRes.data[0].id}`);
        setApplications(appRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalJobs: jobs.length,
    totalApplications: jobs.reduce((a, j) => a + j._count.applications, 0),
    pendingReviews: applications.filter(a => a.status === 'APPLIED').length,
    interviewsScheduled: applications.filter(a => a.status === 'INTERVIEW').length,
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTop: '3px solid #16a34a', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', margin: '0 0 4px' }}>
              Good morning, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Here's what's happening with your hiring today
            </p>
          </div>
          <Link href="/dashboard/recruiter/jobs/new"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '10px 18px', borderRadius: '8px',
              background: '#16a34a', color: 'white',
              fontSize: '14px', fontWeight: '600', textDecoration: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}>
            + Post a Job
          </Link>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Active Jobs', value: stats.totalJobs, icon: '💼', color: '#2563eb', bg: '#eff6ff', change: '+2 this week' },
            { label: 'Total Applications', value: stats.totalApplications, icon: '📄', color: '#16a34a', bg: '#f0fdf4', change: '+12 this week' },
            { label: 'Pending Review', value: stats.pendingReviews, icon: '⏳', color: '#d97706', bg: '#fffbeb', change: 'Needs attention' },
            { label: 'Interviews', value: stats.interviewsScheduled, icon: '🎥', color: '#7c3aed', bg: '#f5f3ff', change: 'This week' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: '#fff', borderRadius: '12px', padding: '20px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                  {stat.icon}
                </div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280', marginBottom: '6px' }}>{stat.label}</div>
              <div style={{ fontSize: '12px', color: stat.color, fontWeight: '500' }}>{stat.change}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2px', background: '#f3f4f6', borderRadius: '10px', padding: '4px', marginBottom: '20px', width: 'fit-content' }}>
          {(['overview', 'pipeline', 'jobs'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none',
                background: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? '#111827' : '#6b7280',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s', textTransform: 'capitalize',
              }}>
              {tab === 'overview' ? '📊 Overview' : tab === 'pipeline' ? '🔄 Pipeline' : '💼 Jobs'}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* Recent Applications */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>Recent Applications</h3>
                <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500', cursor: 'pointer' }}>View all →</span>
              </div>
              {applications.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                  <p style={{ margin: 0, fontSize: '14px' }}>No applications yet</p>
                </div>
              ) : (
                applications.slice(0, 5).map((app) => (
                  <div key={app.id} style={{
                    padding: '14px 20px', borderBottom: '1px solid #f3f4f6',
                    display: 'flex', alignItems: 'center', gap: '12px',
                  }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #15803d)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>{app.candidate.name.charAt(0)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>{app.candidate.name}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{app.job?.title}</div>
                    </div>
                    {app.aiScore !== null && (
                      <div style={{
                        padding: '3px 8px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                        background: app.aiScore >= 70 ? '#f0fdf4' : app.aiScore >= 50 ? '#fffbeb' : '#fef2f2',
                        color: app.aiScore >= 70 ? '#16a34a' : app.aiScore >= 50 ? '#d97706' : '#dc2626',
                      }}>
                        AI: {app.aiScore}
                      </div>
                    )}
                    <div style={{
                      padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500',
                      background: statusColors[app.status]?.bg || '#f3f4f6',
                      color: statusColors[app.status]?.color || '#6b7280',
                    }}>
                      {statusColors[app.status]?.label || app.status}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Active Jobs */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>Active Jobs</h3>
                <Link href="/dashboard/recruiter/jobs/new" style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500', textDecoration: 'none' }}>+ New job</Link>
              </div>
              {jobs.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>💼</div>
                  <p style={{ margin: '0 0 16px', fontSize: '14px' }}>No jobs posted yet</p>
                  <Link href="/dashboard/recruiter/jobs/new"
                    style={{ padding: '8px 16px', background: '#16a34a', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>
                    Post your first job
                  </Link>
                </div>
              ) : (
                jobs.slice(0, 5).map((job) => (
                  <div key={job.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💼</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>{job.title}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{job.location || 'Remote'}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{job._count.applications}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>applicants</div>
                    </div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: job.isActive ? '#16a34a' : '#9ca3af' }} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            {Object.entries(statusColors).map(([status, style]) => (
              <div key={status} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ padding: '12px 14px', background: style.bg, borderBottom: '2px solid ' + style.color }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: style.color }}>{style.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginTop: '2px' }}>
                    {applications.filter(a => a.status === status).length}
                  </div>
                </div>
                <div style={{ padding: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                  {applications.filter(a => a.status === status).map(app => (
                    <div key={app.id} style={{
                      padding: '10px', borderRadius: '8px', background: '#f9fafb',
                      marginBottom: '8px', border: '1px solid #f3f4f6',
                    }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{app.candidate.name}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>{app.job?.title}</div>
                      {app.aiScore !== null && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                          <div style={{ flex: 1, height: '4px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${app.aiScore}%`, height: '100%', background: app.aiScore >= 70 ? '#16a34a' : app.aiScore >= 50 ? '#d97706' : '#ef4444', borderRadius: '2px' }} />
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '600', color: '#374151' }}>{app.aiScore}</span>
                        </div>
                      )}
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        style={{ width: '100%', padding: '4px 6px', borderRadius: '6px', border: '1px solid #e5e7eb', fontSize: '11px', color: '#374151', background: '#fff', cursor: 'pointer' }}
                      >
                        {Object.keys(statusColors).map(s => <option key={s} value={s}>{statusColors[s].label}</option>)}
                      </select>
                    </div>
                  ))}
                  {applications.filter(a => a.status === status).length === 0 && (
                    <p style={{ textAlign: 'center', color: '#d1d5db', fontSize: '12px', padding: '20px 0' }}>Empty</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>All Job Postings</h3>
              <Link href="/dashboard/recruiter/jobs/new"
                style={{ padding: '8px 14px', background: '#16a34a', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
                + Post Job
              </Link>
            </div>
            {jobs.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💼</div>
                <p style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '500', color: '#374151' }}>No jobs posted yet</p>
                <Link href="/dashboard/recruiter/jobs/new"
                  style={{ padding: '10px 20px', background: '#16a34a', color: 'white', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
                  Post your first job →
                </Link>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['Job Title', 'Location', 'Applications', 'Status', 'Posted', 'Action'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}
                      style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{job.title}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>{job.company?.name}</div>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6b7280' }}>{job.location || 'Remote'}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>{job._count.applications}</span>
                          <span style={{ fontSize: '12px', color: '#9ca3af' }}>applicants</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: job.isActive ? '#f0fdf4' : '#f3f4f6', color: job.isActive ? '#16a34a' : '#6b7280' }}>
                          {job.isActive ? '● Active' : '○ Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: '#6b7280' }}>
                        {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <button
                          onClick={() => api.get(`/applications/job/${job.id}`).then(r => setApplications(r.data))}
                          style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '12px', color: '#374151', cursor: 'pointer', fontWeight: '500' }}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}