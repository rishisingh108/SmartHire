'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

interface Application {
  id: string;
  status: string;
  aiScore: number | null;
  aiSummary: string | null;
  aiSkills: string[];
  aiGaps: string[];
  resumeUrl: string;
  createdAt: string;
  candidate: { id: string; name: string; email: string };
  job: { id: string; title: string; company: { name: string } };
}

interface Job {
  id: string;
  title: string;
  location: string;
  salary: string;
  createdAt: string;
  isActive: boolean;
  _count: { applications: number };
  company: { name: string };
}

interface Interview {
  id: string;
  roomUrl: string;
  scheduledAt: string;
  application: {
    candidate: { name: string; email: string };
    job: { title: string };
    status: string;
  };
}

const STATUS = {
  APPLIED:   { label: 'Applied',   color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  SCREENING: { label: 'Screening', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  INTERVIEW: { label: 'Interview', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe' },
  OFFERED:   { label: 'Offered',   color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
  REJECTED:  { label: 'Rejected',  color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
};

const Icons = {
  Dashboard: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  Pipeline: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12H3M22 6H3M22 18H3"/>
    </svg>
  ),
  Jobs: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  ),
  Candidates: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Interviews: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  Logout: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
    </svg>
  ),
  Document: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  Video: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  Location: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  // FIX 1: Rupee symbol instead of dollar
  Salary: () => (
    <span style={{ fontSize: '11px', fontWeight: '600', color: 'currentColor', lineHeight: 1 }}>₹</span>
  ),
};

export default function RecruiterDashboard() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState<'dashboard' | 'pipeline' | 'jobs' | 'candidates' | 'interviews'>('dashboard');
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingApp, setSchedulingApp] = useState<Application | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleLoading, setScheduleLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    if (user?.role !== 'RECRUITER') { router.push('/dashboard/candidate'); return; }
    fetchData();
    fetchInterviews();
  }, []);

  const fetchData = async () => {
    try {
      const jobsRes = await api.get('/jobs');
      setJobs(jobsRes.data);
      if (jobsRes.data.length > 0) {
        const allApps: Application[] = [];
        for (const job of jobsRes.data) {
          try {
            const appRes = await api.get(`/applications/job/${job.id}`);
            allApps.push(...appRes.data.map((a: any) => ({ ...a, job })));
          } catch {}
        }
        setApplications(allApps);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchInterviews = async () => {
    try {
      const res = await api.get('/interviews');
      setInterviews(res.data);
    } catch {}
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch {}
  };

  const scheduleInterview = async () => {
    if (!schedulingApp || !scheduleDate) { alert('Please select a date and time'); return; }
    setScheduleLoading(true);
    try {
      await api.post('/interviews', { applicationId: schedulingApp.id, scheduledAt: scheduleDate });
      setShowScheduleModal(false);
      setSchedulingApp(null);
      setScheduleDate('');
      await fetchInterviews();
      await fetchData();
      alert(`Interview scheduled. Email sent to ${schedulingApp.candidate.email}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to schedule interview');
    }
    setScheduleLoading(false);
  };

  const filteredApps = applications.filter(a => {
    const matchSearch = a.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.job?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchJob = !selectedJob || a.job?.id === selectedJob;
    return matchSearch && matchStatus && matchJob;
  });

  const stats = {
    totalJobs: jobs.length,
    totalApps: applications.length,
    pending: applications.filter(a => a.status === 'APPLIED').length,
    interviews: applications.filter(a => a.status === 'INTERVIEW').length,
    avgScore: applications.filter(a => a.aiScore).length > 0
      ? Math.round(applications.filter(a => a.aiScore).reduce((s, a) => s + (a.aiScore || 0), 0) / applications.filter(a => a.aiScore).length)
      : 0,
  };

  const avatarColor = (name: string) => {
    const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '2.5px solid #e2e8f0', borderTop: '2.5px solid #1e293b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500', letterSpacing: '0.02em' }}>Loading SmartHire</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', Icon: Icons.Dashboard, badge: null },
    { id: 'pipeline', label: 'Pipeline', Icon: Icons.Pipeline, badge: applications.filter(a => a.status === 'APPLIED').length },
    { id: 'jobs', label: 'Jobs', Icon: Icons.Jobs, badge: jobs.length },
    { id: 'candidates', label: 'Candidates', Icon: Icons.Candidates, badge: applications.length },
    { id: 'interviews', label: 'Interviews', Icon: Icons.Interviews, badge: interviews.length },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: '#f1f5f9' }}>

      {/* ── SIDEBAR ── */}
      <div style={{ width: '232px', flexShrink: 0, background: '#0f172a', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 50 }}>

        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: '800', fontSize: '14px', letterSpacing: '-0.5px' }}>S</span>
            </div>
            <span style={{ fontSize: '15px', fontWeight: '700', color: 'white', letterSpacing: '-0.3px' }}>SmartHire</span>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '10px' }}>
          <p style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 10px 6px', margin: 0 }}>Menu</p>
          {navItems.map(({ id, label, Icon, badge }) => {
            const active = activeNav === id;
            return (
              <button key={id} onClick={() => setActiveNav(id as any)}
                style={{
                  // FIX 2: position relative added for active indicator
                  position: 'relative',
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 10px', borderRadius: '7px', border: 'none',
                  background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: active ? 'white' : 'rgba(255,255,255,0.45)',
                  fontSize: '13px', fontWeight: active ? '500' : '400',
                  cursor: 'pointer', marginBottom: '1px', textAlign: 'left',
                  transition: 'all 0.12s', letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; } }}
                onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; } }}>
                {active && (
                  <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '18px', background: '#22c55e', borderRadius: '0 2px 2px 0' }} />
                )}
                <span style={{ opacity: active ? 1 : 0.7, display: 'flex' }}><Icon /></span>
                <span style={{ flex: 1 }}>{label}</span>
                {badge ? (
                  <span style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: active ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)', color: active ? '#4ade80' : 'rgba(255,255,255,0.4)' }}>
                    {badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '10px' }}>
          <Link href="/dashboard/recruiter/jobs/new"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '9px', borderRadius: '7px', background: '#16a34a', color: 'white', fontSize: '13px', fontWeight: '500', textDecoration: 'none', letterSpacing: '0.01em' }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = '#15803d'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = '#16a34a'}>
            <Icons.Plus /> Post a Job
          </Link>
        </div>

        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: avatarColor(user?.name || 'U'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '12px' }}>{user?.name?.charAt(0)}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '500', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '1px' }}>Recruiter</div>
          </div>
          <button onClick={() => { logout(); router.push('/login'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: '4px', borderRadius: '4px', display: 'flex', transition: 'color 0.15s' }}
            title="Sign out"
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)'}>
            <Icons.Logout />
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ marginLeft: '232px', flex: 1, padding: '28px 32px', minWidth: 0 }}>

        {/* ── DASHBOARD ── */}
        {activeNav === 'dashboard' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
                Good morning, {user?.name?.split(' ')[0]}
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, letterSpacing: '0.01em' }}>Here is your hiring overview for today</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
              {[
                { label: 'Active Jobs', value: stats.totalJobs, accent: '#3b82f6' },
                { label: 'Applications', value: stats.totalApps, accent: '#10b981' },
                { label: 'Pending Review', value: stats.pending, accent: '#f59e0b' },
                { label: 'Interviews', value: stats.interviews, accent: '#8b5cf6' },
                { label: 'Avg AI Score', value: stats.avgScore || '—', accent: '#06b6d4' },
              ].map((s) => (
                <div key={s.label}
                  style={{ background: '#fff', borderRadius: '10px', padding: '18px 16px', border: '1px solid #e2e8f0', transition: 'all 0.18s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: s.accent, opacity: 0.7 }} />
                  <div style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '6px' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', margin: 0 }}>AI Screened Candidates</h3>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>Ranked by match score</p>
                  </div>
                  <button onClick={() => setActiveNav('candidates')}
                    style={{ fontSize: '11px', color: '#64748b', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    View all <Icons.ChevronRight />
                  </button>
                </div>
                {applications.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#cbd5e1', fontSize: '13px' }}>No applications yet</div>
                ) : applications.slice(0, 5).map((app) => (
                  <div key={app.id} onClick={() => setSelectedCandidate(app)}
                    style={{ padding: '11px 18px', borderBottom: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'background 0.12s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: avatarColor(app.candidate.name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: 'white', fontWeight: '600', fontSize: '13px' }}>{app.candidate.name.charAt(0)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{app.candidate.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{app.job?.title}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      {app.aiScore !== null && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: app.aiScore >= 70 ? '#10b981' : app.aiScore >= 50 ? '#f59e0b' : '#ef4444', letterSpacing: '-0.3px' }}>{app.aiScore}</div>
                          <div style={{ fontSize: '9px', color: '#cbd5e1', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ATS</div>
                        </div>
                      )}
                      <span style={{ padding: '3px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: '500', background: STATUS[app.status as keyof typeof STATUS]?.bg, color: STATUS[app.status as keyof typeof STATUS]?.color, border: `1px solid ${STATUS[app.status as keyof typeof STATUS]?.border}` }}>
                        {STATUS[app.status as keyof typeof STATUS]?.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Active Jobs</h3>
                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>{jobs.length} open positions</p>
                  </div>
                  <Link href="/dashboard/recruiter/jobs/new"
                    style={{ fontSize: '11px', color: '#16a34a', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icons.Plus /> New job
                  </Link>
                </div>
                {jobs.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 14px' }}>No jobs posted yet</p>
                    <Link href="/dashboard/recruiter/jobs/new" style={{ padding: '8px 16px', background: '#0f172a', color: 'white', borderRadius: '7px', fontSize: '12px', fontWeight: '500', textDecoration: 'none' }}>Post your first job</Link>
                  </div>
                ) : jobs.map((job) => (
                  <div key={job.id} onClick={() => { setSelectedJob(job.id); setActiveNav('candidates'); }}
                    style={{ padding: '13px 18px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: 'background 0.12s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{job.title}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>{job._count.applications}</span>
                        <span style={{ fontSize: '10px', color: '#94a3b8' }}>applicants</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', display: 'flex', gap: '10px' }}>
                      {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Icons.Location />{job.location}</span>}
                      {job.salary && <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Icons.Salary />{job.salary}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {Object.entries(STATUS).map(([status, s]) => {
                        const count = applications.filter(a => a.job?.id === job.id && a.status === status).length;
                        return count > 0 ? (
                          <div key={status} style={{ padding: '2px 7px', borderRadius: '4px', background: s.bg, border: `1px solid ${s.border}` }}>
                            <span style={{ fontSize: '10px', color: s.color, fontWeight: '600' }}>{s.label} {count}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Recent Activity</h3>
              </div>
              <div style={{ padding: '4px 0' }}>
                {applications.length === 0 ? (
                  <p style={{ color: '#cbd5e1', fontSize: '13px', margin: 0, textAlign: 'center', padding: '28px' }}>No activity yet</p>
                ) : applications.slice(0, 5).map((app, i) => (
                  <div key={app.id} style={{ display: 'flex', gap: '14px', padding: '12px 18px', borderBottom: i < 4 ? '1px solid #f8fafc' : 'none', alignItems: 'flex-start' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS[app.status as keyof typeof STATUS]?.color, marginTop: '5px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 2px', fontSize: '13px', color: '#374151', lineHeight: '1.4' }}>
                        <span style={{ fontWeight: '500', color: '#0f172a' }}>{app.candidate.name}</span>
                        <span style={{ color: '#94a3b8' }}> applied for </span>
                        <span style={{ fontWeight: '500', color: '#0f172a' }}>{app.job?.title}</span>
                        {app.aiScore && (
                          <span style={{ marginLeft: '8px', padding: '1px 7px', borderRadius: '4px', fontSize: '11px', background: app.aiScore >= 70 ? '#f0fdf4' : '#fffbeb', color: app.aiScore >= 70 ? '#16a34a' : '#d97706', fontWeight: '600', border: `1px solid ${app.aiScore >= 70 ? '#bbf7d0' : '#fde68a'}` }}>
                            {app.aiScore}/100
                          </span>
                        )}
                      </p>
                      <p style={{ margin: 0, fontSize: '11px', color: '#cbd5e1' }}>
                        {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PIPELINE ── */}
        {activeNav === 'pipeline' && (
          <div>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Hiring Pipeline</h2>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Track candidates across stages</p>
              </div>
              <select value={selectedJob || ''} onChange={(e) => setSelectedJob(e.target.value || null)}
                style={{ padding: '8px 12px', borderRadius: '7px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#374151', background: '#fff', outline: 'none', cursor: 'pointer' }}>
                <option value="">All Jobs</option>
                {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {Object.entries(STATUS).map(([status, s]) => {
                const stageApps = filteredApps.filter(a => a.status === status);
                return (
                  <div key={status} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '11px 13px', borderBottom: `2px solid ${s.color}`, background: s.bg }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: s.color, letterSpacing: '0.02em' }}>{s.label}</span>
                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{stageApps.length}</span>
                      </div>
                    </div>
                    <div style={{ padding: '8px', maxHeight: '520px', overflowY: 'auto' }}>
                      {stageApps.map(app => (
                        <div key={app.id} onClick={() => setSelectedCandidate(app)}
                          style={{ padding: '10px', borderRadius: '7px', background: '#f8fafc', marginBottom: '6px', border: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.12s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#bbf7d0'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#f1f5f9'; }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                            <div style={{ fontSize: '12px', fontWeight: '500', color: '#0f172a' }}>{app.candidate.name}</div>
                            {app.aiScore !== null && (
                              <span style={{ fontSize: '12px', fontWeight: '700', color: app.aiScore >= 70 ? '#10b981' : app.aiScore >= 50 ? '#f59e0b' : '#ef4444' }}>{app.aiScore}</span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '7px' }}>{app.job?.title}</div>
                          {app.aiSkills?.slice(0, 2).map(sk => (
                            <span key={sk} style={{ display: 'inline-block', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', background: '#f0fdf4', color: '#16a34a', fontWeight: '500', marginRight: '3px', border: '1px solid #bbf7d0' }}>{sk}</span>
                          ))}
                          <div style={{ marginTop: '8px' }}>
                            <select value={app.status} onChange={(e) => { e.stopPropagation(); updateStatus(app.id, e.target.value); }}
                              onClick={(e) => e.stopPropagation()}
                              style={{ width: '100%', padding: '4px 6px', borderRadius: '5px', border: '1px solid #e2e8f0', fontSize: '11px', color: '#374151', background: '#fff', cursor: 'pointer', outline: 'none' }}>
                              {Object.entries(STATUS).map(([sv, st]) => <option key={sv} value={sv}>{st.label}</option>)}
                            </select>
                          </div>
                        </div>
                      ))}
                      {stageApps.length === 0 && (
                        <div style={{ padding: '28px', textAlign: 'center', color: '#e2e8f0', fontSize: '12px' }}>Empty</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CANDIDATES ── */}
        {activeNav === 'candidates' && (
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Candidates</h2>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{filteredApps.length} candidates found</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input placeholder="Search candidates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '7px', border: '1px solid #e2e8f0', fontSize: '12px', outline: 'none', width: '200px', color: '#374151' }} />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ padding: '8px 10px', borderRadius: '7px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#374151', background: '#fff', outline: 'none', cursor: 'pointer' }}>
                  <option value="ALL">All Status</option>
                  {Object.entries(STATUS).map(([s, st]) => <option key={s} value={s}>{st.label}</option>)}
                </select>
                <select value={selectedJob || ''} onChange={(e) => setSelectedJob(e.target.value || null)}
                  style={{ padding: '8px 10px', borderRadius: '7px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#374151', background: '#fff', outline: 'none', cursor: 'pointer' }}>
                  <option value="">All Jobs</option>
                  {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                </select>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    {['Candidate', 'Position', 'AI Score', 'Skills', 'Status', 'Date', ''].map(h => (
                      <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.length === 0 ? (
                    <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#cbd5e1', fontSize: '13px' }}>No candidates found</td></tr>
                  ) : filteredApps.map((app) => (
                    <tr key={app.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.1s', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => setSelectedCandidate(app)}>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: avatarColor(app.candidate.name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ color: 'white', fontWeight: '600', fontSize: '12px' }}>{app.candidate.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{app.candidate.name}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{app.candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: '12px', color: '#374151' }}>{app.job?.title}</td>
                      <td style={{ padding: '13px 16px' }}>
                        {app.aiScore !== null ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '52px', height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                              <div style={{ width: `${app.aiScore}%`, height: '100%', background: app.aiScore >= 70 ? '#10b981' : app.aiScore >= 50 ? '#f59e0b' : '#ef4444', borderRadius: '3px' }} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: app.aiScore >= 70 ? '#10b981' : app.aiScore >= 50 ? '#f59e0b' : '#ef4444', letterSpacing: '-0.2px' }}>{app.aiScore}</span>
                          </div>
                        ) : <span style={{ fontSize: '12px', color: '#e2e8f0' }}>Pending</span>}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {app.aiSkills?.slice(0, 3).map(sk => (
                            <span key={sk} style={{ padding: '2px 7px', borderRadius: '4px', fontSize: '10px', background: '#f0fdf4', color: '#16a34a', fontWeight: '500', border: '1px solid #bbf7d0' }}>{sk}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <select value={app.status} onChange={(e) => { e.stopPropagation(); updateStatus(app.id, e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          style={{ padding: '4px 8px', borderRadius: '5px', border: `1px solid ${STATUS[app.status as keyof typeof STATUS]?.border}`, fontSize: '11px', fontWeight: '500', color: STATUS[app.status as keyof typeof STATUS]?.color, background: STATUS[app.status as keyof typeof STATUS]?.bg, cursor: 'pointer', outline: 'none' }}>
                          {Object.entries(STATUS).map(([s, st]) => <option key={s} value={s}>{st.label}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '13px 16px', fontSize: '11px', color: '#94a3b8' }}>
                        {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </td>
                      <td style={{ padding: '13px 16px' }}>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedCandidate(app); }}
                          style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '11px', fontWeight: '500', color: '#374151', cursor: 'pointer', transition: 'all 0.12s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── JOBS ── */}
        {activeNav === 'jobs' && (
          <div>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Job Postings</h2>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{jobs.length} active positions</p>
              </div>
              <Link href="/dashboard/recruiter/jobs/new"
                style={{ padding: '9px 16px', background: '#0f172a', color: 'white', borderRadius: '7px', fontSize: '13px', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icons.Plus /> Post New Job
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {jobs.length === 0 ? (
                <div style={{ gridColumn: '1/-1', background: '#fff', borderRadius: '10px', padding: '60px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '0 0 16px' }}>No jobs posted yet</p>
                  <Link href="/dashboard/recruiter/jobs/new" style={{ padding: '9px 18px', background: '#0f172a', color: 'white', borderRadius: '7px', fontSize: '13px', fontWeight: '500', textDecoration: 'none' }}>Post your first job</Link>
                </div>
              ) : jobs.map((job) => (
                <div key={job.id} onClick={() => { setSelectedJob(job.id); setActiveNav('candidates'); }}
                  style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '18px', transition: 'all 0.15s', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: '0 0 3px' }}>{job.title}</h3>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{job.company?.name}</p>
                    </div>
                    <span style={{ padding: '3px 9px', borderRadius: '5px', fontSize: '11px', fontWeight: '500', background: job.isActive ? '#f0fdf4' : '#f1f5f9', color: job.isActive ? '#16a34a' : '#64748b', border: `1px solid ${job.isActive ? '#bbf7d0' : '#e2e8f0'}` }}>
                      {job.isActive ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    {job.location && <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}><Icons.Location />{job.location}</span>}
                    {job.salary && <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}><Icons.Salary />{job.salary}</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {Object.entries(STATUS).map(([status, s]) => {
                        const count = applications.filter(a => a.job?.id === job.id && a.status === status).length;
                        return count > 0 ? (
                          <div key={status} style={{ padding: '2px 7px', borderRadius: '4px', background: s.bg, border: `1px solid ${s.border}` }}>
                            <span style={{ fontSize: '10px', color: s.color, fontWeight: '600' }}>{s.label} {count}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.3px' }}>{job._count.applications}<span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '400' }}> applicants</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── INTERVIEWS ── */}
        {activeNav === 'interviews' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Video Interviews</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>{interviews.length} scheduled</p>
            </div>
            {interviews.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '60px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#cbd5e1', margin: '0 0 6px' }}>No interviews scheduled yet</p>
                <p style={{ fontSize: '12px', color: '#e2e8f0', margin: '0 0 20px' }}>Go to Candidates, open a profile and schedule a video interview.</p>
                <button onClick={() => setActiveNav('candidates')}
                  style={{ padding: '9px 18px', background: '#0f172a', color: 'white', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                  View Candidates
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {interviews.map((iv) => (
                  <div key={iv.id} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: avatarColor(iv.application?.candidate?.name || 'U'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>{(iv.application?.candidate?.name || 'U').charAt(0)}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#0f172a', marginBottom: '2px' }}>{iv.application?.candidate?.name}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{iv.application?.job?.title}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Icons.Calendar />
                          {new Date(iv.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' })} IST
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: '500', background: '#f5f3ff', color: '#8b5cf6', border: '1px solid #ddd6fe' }}>Scheduled</span>
                      <a href={`/dashboard/interview/${iv.id}`}
                        style={{ padding: '8px 16px', borderRadius: '7px', background: '#0f172a', color: 'white', fontSize: '12px', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Icons.Video /> Join Room
                      </a>
                      <a href={iv.roomUrl} target="_blank" rel="noreferrer"
                        style={{ padding: '8px 12px', borderRadius: '7px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '12px', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Icons.ExternalLink /> Link
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── CANDIDATE MODAL ── */}
      {selectedCandidate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(2px)' }}
          onClick={() => setSelectedCandidate(null)}>
          <div style={{ background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '560px', maxHeight: '86vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
              <div style={{ display: 'flex', gap: '13px', alignItems: 'center' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: avatarColor(selectedCandidate.candidate.name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '17px' }}>{selectedCandidate.candidate.name.charAt(0)}</span>
                </div>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.2px' }}>{selectedCandidate.candidate.name}</h2>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{selectedCandidate.candidate.email}</p>
                  <p style={{ color: '#cbd5e1', fontSize: '11px', margin: '2px 0 0' }}>Applied for <span style={{ color: '#374151', fontWeight: '500' }}>{selectedCandidate.job?.title}</span></p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#64748b', padding: '5px', display: 'flex' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = '#e2e8f0'}
                onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9'}>
                <Icons.X />
              </button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {selectedCandidate.aiScore !== null ? (
                <div style={{ marginBottom: '20px', padding: '18px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', margin: '0 0 2px' }}>AI Assessment</h3>
                      <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Automated resume analysis</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '28px', fontWeight: '700', color: selectedCandidate.aiScore >= 70 ? '#10b981' : selectedCandidate.aiScore >= 50 ? '#f59e0b' : '#ef4444', letterSpacing: '-1px', lineHeight: 1 }}>
                        {selectedCandidate.aiScore}<span style={{ fontSize: '14px', fontWeight: '500', color: '#cbd5e1' }}>/100</span>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: '500', color: selectedCandidate.aiScore >= 70 ? '#10b981' : selectedCandidate.aiScore >= 50 ? '#f59e0b' : '#ef4444', marginTop: '2px' }}>
                        {selectedCandidate.aiScore >= 70 ? 'Strong match' : selectedCandidate.aiScore >= 50 ? 'Moderate match' : 'Weak match'}
                      </div>
                    </div>
                  </div>
                  <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '14px' }}>
                    <div style={{ width: `${selectedCandidate.aiScore}%`, height: '100%', background: selectedCandidate.aiScore >= 70 ? '#10b981' : selectedCandidate.aiScore >= 50 ? '#f59e0b' : '#ef4444', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                  </div>
                  {selectedCandidate.aiSummary && (
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: '1.6', padding: '12px', background: '#fff', borderRadius: '7px', border: '1px solid #e2e8f0' }}>{selectedCandidate.aiSummary}</p>
                  )}
                </div>
              ) : (
                <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '10px', background: '#fffbeb', border: '1px solid #fde68a' }}>
                  <p style={{ color: '#92400e', fontSize: '12px', margin: 0, fontWeight: '500' }}>AI screening in progress — check back shortly</p>
                </div>
              )}
              {selectedCandidate.aiSkills?.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Matched Skills</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {selectedCandidate.aiSkills.map(skill => (
                      <span key={skill} style={{ padding: '4px 10px', borderRadius: '5px', fontSize: '12px', background: '#f0fdf4', color: '#16a34a', fontWeight: '500', border: '1px solid #bbf7d0' }}>{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedCandidate.aiGaps?.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Skill Gaps</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {selectedCandidate.aiGaps.map(gap => (
                      <span key={gap} style={{ padding: '4px 10px', borderRadius: '5px', fontSize: '12px', background: '#fef2f2', color: '#ef4444', fontWeight: '500', border: '1px solid #fecaca' }}>{gap}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedCandidate.resumeUrl && (
                <div style={{ marginBottom: '18px', padding: '12px 14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icons.Document />
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>Resume / CV</span>
                  </div>
                  <a href={selectedCandidate.resumeUrl} target="_blank" rel="noreferrer"
                    style={{ padding: '5px 12px', borderRadius: '6px', background: '#0f172a', color: 'white', fontSize: '11px', fontWeight: '500', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View <Icons.ExternalLink />
                  </a>
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                <select value={selectedCandidate.status}
                  onChange={(e) => { updateStatus(selectedCandidate.id, e.target.value); setSelectedCandidate({ ...selectedCandidate, status: e.target.value }); }}
                  style={{ flex: 1, padding: '9px 10px', borderRadius: '7px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#374151', background: '#fff', outline: 'none', fontWeight: '500', cursor: 'pointer' }}>
                  {Object.entries(STATUS).map(([s, st]) => <option key={s} value={s}>{st.label}</option>)}
                </select>
                {selectedCandidate.status !== 'REJECTED' && (
                  <button onClick={() => { setSchedulingApp(selectedCandidate); setSelectedCandidate(null); setShowScheduleModal(true); }}
                    style={{ padding: '9px 14px', borderRadius: '7px', border: 'none', background: '#8b5cf6', color: 'white', fontSize: '12px', fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icons.Video /> Schedule Interview
                  </button>
                )}
                <button onClick={() => { updateStatus(selectedCandidate.id, 'REJECTED'); setSelectedCandidate(null); }}
                  style={{ padding: '9px 12px', borderRadius: '7px', border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEDULE MODAL ── */}
      {showScheduleModal && schedulingApp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(2px)' }}
          onClick={() => { setShowScheduleModal(false); setSchedulingApp(null); setScheduleDate(''); }}>
          <div style={{ background: '#fff', borderRadius: '14px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#0f172a', fontSize: '15px', fontWeight: '600', margin: '0 0 2px', letterSpacing: '-0.2px' }}>Schedule Interview</h3>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>A video room will be created and email sent</p>
              </div>
              <button onClick={() => { setShowScheduleModal(false); setSchedulingApp(null); setScheduleDate(''); }}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#64748b', padding: '5px', display: 'flex' }}>
                <Icons.X />
              </button>
            </div>
            <div style={{ padding: '20px 22px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: avatarColor(schedulingApp.candidate.name), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{schedulingApp.candidate.name.charAt(0)}</span>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{schedulingApp.candidate.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>{schedulingApp.candidate.email}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{schedulingApp.job?.title}</div>
                </div>
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '7px', letterSpacing: '0.02em' }}>Date & Time (IST)</label>
                <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '7px', border: '1.5px solid #e2e8f0', fontSize: '13px', color: '#374151', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#8b5cf6'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'} />
              </div>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: '18px' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: '#374151', margin: '0 0 7px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>What happens</p>
                {['Video room created automatically', 'Email sent to candidate with join link', 'Application moved to Interview stage', 'Room appears in your Interviews tab'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setShowScheduleModal(false); setSchedulingApp(null); setScheduleDate(''); }}
                  style={{ flex: 1, padding: '10px', borderRadius: '7px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '13px', color: '#64748b', cursor: 'pointer', fontWeight: '500' }}>
                  Cancel
                </button>
                <button onClick={scheduleInterview} disabled={scheduleLoading || !scheduleDate}
                  style={{ flex: 2, padding: '10px', borderRadius: '7px', border: 'none', background: scheduleLoading || !scheduleDate ? '#ddd6fe' : '#8b5cf6', color: 'white', fontSize: '13px', fontWeight: '500', cursor: scheduleLoading || !scheduleDate ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  {scheduleLoading ? 'Scheduling...' : <><Icons.Video /> Schedule & Send Email</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}