'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';

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

const STATUS_CONFIG: Record<string, { bg: string; color: string; border: string; label: string }> = {
  APPLIED:   { bg: '#eff6ff', color: '#3b82f6', border: '#bfdbfe', label: 'Applied' },
  SCREENING: { bg: '#fffbeb', color: '#f59e0b', border: '#fde68a', label: 'AI Screening' },
  INTERVIEW: { bg: '#f5f3ff', color: '#8b5cf6', border: '#ddd6fe', label: 'Interview' },
  OFFERED:   { bg: '#ecfdf5', color: '#10b981', border: '#a7f3d0', label: 'Offered' },
  REJECTED:  { bg: '#fef2f2', color: '#ef4444', border: '#fecaca', label: 'Not Selected' },
};

const Icons = {
  Briefcase: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Video: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  Gift: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Location: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Rupee: () => (
    <span style={{ fontSize: '11px', fontWeight: '600', lineHeight: 1 }}>₹</span>
  ),
  Users: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Brain: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.65A3 3 0 016 10a3 3 0 013.5-2.96V2zM14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.65A3 3 0 0018 10a3 3 0 00-3.5-2.96V2z"/>
    </svg>
  ),
  Check: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  Logout: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  ),
  Building: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="1"/>
      <path d="M9 22V12h6v10M2 9h20"/>
    </svg>
  ),
};

function CandidateDashboardInner() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>(
    (searchParams.get('tab') as 'jobs' | 'applications') || 'jobs'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [applyingJob, setApplyingJob] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) { router.push('/login'); return; }
    if (user?.role !== 'CANDIDATE') { router.push('/dashboard/recruiter'); return; }
    fetchData();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab') as 'jobs' | 'applications';
    if (tab === 'jobs' || tab === 'applications') setActiveTab(tab);
  }, [searchParams]);

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
    setApplying(true);
    try {
      const resumeText = `
        Full Stack Developer with 3+ years of experience.
        Skills: React.js, Next.js, Node.js, TypeScript, PostgreSQL, MongoDB, AWS S3, Docker, Redis.
        Experience: Built production applications, REST APIs, microservices architecture.
        Education: B.Tech Computer Science.
        Projects: E-commerce platform, Real-time chat app, AI-powered recruitment system.
        Resume Link: ${resumeUrl}
      `;
      await api.post('/applications', { jobId, resumeUrl, resumeText });
      setApplyingJob(null);
      setResumeUrl('');
      fetchData();
      alert('Application submitted. AI screening in progress.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to apply');
    }
    setApplying(false);
  };

  const switchTab = (tab: 'jobs' | 'applications') => {
    setActiveTab(tab);
    router.push(`/dashboard/candidate?tab=${tab}`);
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const appliedJobIds = applications.map(a => a.job?.title);

  const avatarColor = (name: string) => {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
    return colors[name.charCodeAt(0) % colors.length];
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '2.5px solid #e2e8f0', borderTop: '2.5px solid #1e293b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>Loading</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: '800', fontSize: '13px' }}>S</span>
              </div>
              <span style={{ fontSize: '14px', fontWeight: '700', color: 'white', letterSpacing: '-0.3px' }}>SmartHire</span>
            </div>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[
                { label: 'Dashboard', tab: null },
                { label: 'Browse Jobs', tab: 'jobs' },
                { label: 'My Applications', tab: 'applications' },
              ].map((item) => (
                <button key={item.label}
                  onClick={() => item.tab ? switchTab(item.tab as any) : switchTab('jobs')}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.55)', fontSize: '13px', fontWeight: '400', cursor: 'pointer', transition: 'all 0.12s', letterSpacing: '0.01em' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.background = 'transparent'; }}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: avatarColor(user?.name || 'U'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontWeight: '600', fontSize: '11px' }}>{user?.name?.charAt(0)}</span>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: 'white', lineHeight: 1.2 }}>{user?.name}</div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.2 }}>Candidate</div>
              </div>
            </div>
            <button onClick={() => { logout(); router.push('/login'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: '4px', display: 'flex', transition: 'color 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)'}>
              <Icons.Logout />
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '28px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
            {applications.length > 0
              ? `${applications.length} active application${applications.length > 1 ? 's' : ''} in progress`
              : 'Start applying to jobs today'}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Jobs Available', value: jobs.length, accent: '#3b82f6', Icon: Icons.Briefcase },
            { label: 'Applied', value: applications.length, accent: '#10b981', Icon: Icons.FileText },
            { label: 'In Interview', value: applications.filter(a => a.status === 'INTERVIEW').length, accent: '#8b5cf6', Icon: Icons.Video },
            { label: 'Offers', value: applications.filter(a => a.status === 'OFFERED').length, accent: '#f59e0b', Icon: Icons.Gift },
          ].map((s) => (
            <div key={s.label}
              style={{ background: '#fff', borderRadius: '10px', padding: '16px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', transition: 'all 0.18s' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: s.accent, opacity: 0.7 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '26px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '4px' }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                </div>
                <div style={{ color: s.accent, opacity: 0.6, marginTop: '2px' }}><s.Icon /></div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1px', background: '#e2e8f0', borderRadius: '8px', padding: '3px', marginBottom: '20px', width: 'fit-content' }}>
          {(['jobs', 'applications'] as const).map((tab) => (
            <button key={tab} onClick={() => switchTab(tab)}
              style={{ padding: '7px 18px', borderRadius: '6px', border: 'none', background: activeTab === tab ? '#fff' : 'transparent', color: activeTab === tab ? '#0f172a' : '#64748b', fontSize: '13px', fontWeight: activeTab === tab ? '500' : '400', cursor: 'pointer', boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', letterSpacing: '0.01em' }}>
              {tab === 'jobs' ? `Browse Jobs (${jobs.length})` : `My Applications (${applications.length})`}
            </button>
          ))}
        </div>

        {/* ── JOBS TAB ── */}
        {activeTab === 'jobs' && (
          <div>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                <Icons.Search />
              </div>
              <input placeholder="Search jobs by title or company..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 34px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: '#fff', color: '#374151', transition: 'border 0.12s' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#94a3b8'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'} />
            </div>

            {filteredJobs.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '10px', padding: '48px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0 }}>No jobs found</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredJobs.map((job) => {
                  const isApplied = appliedJobIds.includes(job.title);
                  return (
                    <div key={job.id}
                      style={{ background: '#fff', borderRadius: '10px', padding: '18px 20px', border: '1px solid #e2e8f0', transition: 'all 0.15s' }}
                      onMouseEnter={(e) => { if (applyingJob !== job.id) { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#cbd5e1'; } }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexShrink: 0 }}>
                              <Icons.Building />
                            </div>
                            <div>
                              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0, letterSpacing: '0.01em' }}>{job.title}</h3>
                              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{job.company?.name}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                            {job.location && (
                              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Icons.Location />{job.location}
                              </span>
                            )}
                            {job.salary && (
                              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                <Icons.Rupee />{job.salary}
                              </span>
                            )}
                            <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Icons.Users />{job._count?.applications || 0} applicants
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                          {applyingJob === job.id ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <input placeholder="Resume URL (Google Drive / S3)"
                                value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)}
                                style={{ padding: '8px 12px', borderRadius: '7px', border: '1.5px solid #10b981', fontSize: '12px', outline: 'none', width: '240px', color: '#374151' }} />
                              <button onClick={() => applyToJob(job.id)} disabled={applying}
                                style={{ padding: '8px 14px', background: applying ? '#86efac' : '#10b981', color: 'white', borderRadius: '7px', border: 'none', fontSize: '12px', fontWeight: '500', cursor: applying ? 'not-allowed' : 'pointer', letterSpacing: '0.01em' }}>
                                {applying ? 'Submitting...' : 'Submit'}
                              </button>
                              <button onClick={() => { setApplyingJob(null); setResumeUrl(''); }}
                                style={{ padding: '8px 10px', background: '#fff', color: '#64748b', borderRadius: '7px', border: '1px solid #e2e8f0', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <Icons.X />
                              </button>
                            </div>
                          ) : isApplied ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '7px', background: '#f0fdf4', color: '#16a34a', fontSize: '12px', fontWeight: '500', border: '1px solid #bbf7d0' }}>
                              <Icons.Check /> Applied
                            </span>
                          ) : (
                            <button onClick={() => setApplyingJob(job.id)}
                              style={{ padding: '8px 16px', borderRadius: '7px', border: 'none', background: '#0f172a', color: 'white', fontSize: '12px', fontWeight: '500', cursor: 'pointer', letterSpacing: '0.01em', transition: 'background 0.15s' }}
                              onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = '#1e293b'}
                              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = '#0f172a'}>
                              Apply Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── APPLICATIONS TAB ── */}
        {activeTab === 'applications' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {applications.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: '10px', padding: '60px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#e2e8f0', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                  <Icons.FileText />
                </div>
                <p style={{ fontSize: '14px', fontWeight: '500', color: '#94a3b8', margin: '0 0 6px' }}>No applications yet</p>
                <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 20px' }}>Browse available jobs and submit your application</p>
                <button onClick={() => switchTab('jobs')}
                  style={{ padding: '9px 18px', background: '#0f172a', color: 'white', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                  Browse Jobs
                </button>
              </div>
            ) : applications.map((app) => {
              const s = STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED;
              return (
                <div key={app.id} style={{ background: '#fff', borderRadius: '10px', padding: '18px 20px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: '0 0 3px', letterSpacing: '0.01em' }}>{app.job?.title}</h3>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                        {app.job?.company?.name}
                        {app.job?.location && <span> · {app.job.location}</span>}
                      </p>
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: '5px', fontSize: '11px', fontWeight: '500', background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                  </div>

                  {app.aiScore !== null && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '500', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          <Icons.Brain /> AI Match Score
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: app.aiScore >= 70 ? '#10b981' : app.aiScore >= 50 ? '#f59e0b' : '#ef4444', letterSpacing: '-0.2px' }}>
                          {app.aiScore}/100
                        </span>
                      </div>
                      <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${app.aiScore}%`, height: '100%', background: app.aiScore >= 70 ? '#10b981' : app.aiScore >= 50 ? '#f59e0b' : '#ef4444', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                      </div>
                    </div>
                  )}

                  {app.aiSummary && (
                    <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 10px', lineHeight: '1.6', padding: '10px 12px', borderRadius: '7px', background: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '3px solid #10b981' }}>
                      {app.aiSummary}
                    </p>
                  )}

                  <p style={{ fontSize: '11px', color: '#cbd5e1', margin: 0, letterSpacing: '0.01em' }}>
                    Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CandidateDashboard() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
        <div style={{ width: '36px', height: '36px', border: '2.5px solid #e2e8f0', borderTop: '2.5px solid #1e293b', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <CandidateDashboardInner />
    </Suspense>
  );
}