'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Bot, Search, Video, LayoutGrid, Mail, BarChart3, Briefcase, PartyPopper } from 'lucide-react';

function useCounter(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

function useScrollAnim(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [billingYearly, setBillingYearly] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [scores, setScores] = useState([0, 0, 0, 0]);

  // Chatbot state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Hi! I\'m SmartHire\'s AI assistant. Ask me anything about our platform — features, pricing, or how to get started.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const logoAnim = useScrollAnim(0.2);
  const featuresHeadAnim = useScrollAnim(0.2);
  const howAnim = useScrollAnim(0.15);
  const testimonialsHeadAnim = useScrollAnim(0.2);
  const pricingAnim = useScrollAnim(0.1);
  const ctaAnim = useScrollAnim(0.2);

  const techAnim = useScrollAnim(0.1);
  const techFEAnim = useScrollAnim(0.1);
  const techBEAnim = useScrollAnim(0.1);
  const techAIAnim = useScrollAnim(0.1);
  const techResumeAnim = useScrollAnim(0.1);

  const featureRefs = [useScrollAnim(0.1), useScrollAnim(0.1), useScrollAnim(0.1), useScrollAnim(0.1), useScrollAnim(0.1), useScrollAnim(0.1)];
  const stepRefs = [useScrollAnim(0.1), useScrollAnim(0.1), useScrollAnim(0.1), useScrollAnim(0.1)];
  const testimonialRefs = [useScrollAnim(0.1), useScrollAnim(0.1), useScrollAnim(0.1)];
  const planRefs = [useScrollAnim(0.1), useScrollAnim(0.1), useScrollAnim(0.1)];

  const stat1 = useCounter(85, 2200, statsVisible);
  const stat2 = useCounter(60, 2200, statsVisible);
  const stat3 = useCounter(10000, 2200, statsVisible);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const targets = [92, 87, 74, 61];
    const duration = 1800;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setScores(targets.map(t => Math.floor(eased * t)));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, []);

  const fadeUp = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  });

  const fadeIn = (visible: boolean, delay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transition: `opacity 0.5s ease ${delay}ms`,
  });

  // Chatbot send function
  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [...chatMessages, { role: 'user', content: userMsg }],
  }),
});
const data = await response.json();
const reply = data.reply || 'Sorry, I could not process that. Please try again.';
      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }]);
    }
    setChatLoading(false);
  };

  const candidates = [
    { name: 'Priya Sharma', role: 'Senior React Dev', score: 92, status: 'Interview', statusBg: 'rgba(124,58,237,0.15)', statusColor: '#a78bfa', borderColor: 'rgba(124,58,237,0.3)' },
    { name: 'Rahul Mehta', role: 'Full Stack Engineer', score: 87, status: 'Screening', statusBg: 'rgba(217,119,6,0.15)', statusColor: '#fbbf24', borderColor: 'rgba(217,119,6,0.3)' },
    { name: 'Anjali Singh', role: 'Node.js Developer', score: 74, status: 'Applied', statusBg: 'rgba(37,99,235,0.15)', statusColor: '#60a5fa', borderColor: 'rgba(37,99,235,0.3)' },
    { name: 'Karan Patel', role: 'DevOps Engineer', score: 61, status: 'Applied', statusBg: 'rgba(37,99,235,0.15)', statusColor: '#60a5fa', borderColor: 'rgba(37,99,235,0.3)' },
  ];

  const features = [
    { icon: Bot, title: 'AI Resume Screening', desc: 'GPT-4o analyzes every resume against your job requirements and gives a match score with detailed breakdown of skills and gaps.', color: '#7c3aed' },
    { icon: Search, title: 'Semantic Search', desc: 'Search candidates by meaning, not just keywords. Find "React developer with startup experience" and get exact matches instantly.', color: '#0891b2' },
    { icon: Video, title: 'Video Interviews', desc: 'Built-in WebRTC video calls — no Zoom needed. AI automatically transcribes and scores the interview conversation.', color: '#2563eb' },
    { icon: LayoutGrid, title: 'ATS Pipeline', desc: 'Kanban-style hiring pipeline. Move candidates through stages, track AI scores, and collaborate with your team in real-time.', color: '#16a34a' },
    { icon: Mail, title: 'Auto Email Outreach', desc: 'AI drafts personalized emails for every candidate. Send offers, rejections, and interview invites in one click.', color: '#d97706' },
    { icon: BarChart3, title: 'Hiring Analytics', desc: 'Real-time dashboards showing time-to-hire, pipeline health, and AI-powered insights to improve your recruitment process.', color: '#dc2626' },
  ];

  const plans = [
    {
      name: 'Basic', desc: 'Perfect for early-stage startups',
      monthlyPrice: 0, yearlyPrice: 0,
      color: '#6b7280', accent: '#f3f4f6', popular: false,
      features: ['3 active job postings', 'AI resume screening (50/mo)', 'Candidate pipeline', 'Email notifications', 'Basic analytics'],
      cta: 'Start for free',
    },
    {
      name: 'Pro', desc: 'For growing teams hiring regularly',
      monthlyPrice: 2999, yearlyPrice: 2399,
      color: '#16a34a', accent: '#f0fdf4', popular: true,
      features: ['Unlimited job postings', 'AI resume screening (500/mo)', 'Video interviews', 'AI interview scheduling', 'Email outreach automation', 'Advanced analytics', 'Priority support'],
      cta: 'Start free trial',
    },
    {
      name: 'Enterprise', desc: 'For large teams with custom needs',
      monthlyPrice: null, yearlyPrice: null,
      color: '#7c3aed', accent: '#f5f3ff', popular: false,
      features: ['Everything in Pro', 'Unlimited AI screening', 'Custom integrations', 'SSO & SAML', 'Dedicated account manager', 'SLA guarantee', 'Custom AI models'],
      cta: 'Contact sales',
    },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: '#111827', overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 48px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(10,15,13,0.92)' : 'rgba(10,15,13,0.3)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #00f59b, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(0,245,155,0.35)' }}>
              <span style={{ color: '#052e16', fontWeight: '800', fontSize: '16px' }}>S</span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>SmartHire</span>
          </Link>
          <div style={{ display: 'flex', gap: '2px' }}>
            {['Platform', 'Why SmartHire', 'Resources', 'About'].map((item) => (
              <button key={item} style={{ padding: '7px 14px', background: 'none', border: 'none', fontSize: '14px', fontWeight: '500', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', borderRadius: '6px', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/login" style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)', background: 'transparent', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}>
            Sign in
          </Link>
          <Link href="/register" style={{ padding: '8px 18px', borderRadius: '8px', background: 'linear-gradient(135deg, #00f59b, #16a34a)', fontSize: '14px', fontWeight: '600', color: '#052e16', textDecoration: 'none', boxShadow: '0 0 16px rgba(0,245,155,0.25)', transition: 'all 0.15s' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(0,245,155,0.45)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(0,245,155,0.25)'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
            Request a demo
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: '#0a0f0d', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '15%', left: '5%', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,155,0.09) 0%, transparent 65%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 65%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 48px 80px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ animation: 'heroFadeUp 0.9s ease forwards' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '20px', background: 'rgba(0,245,155,0.08)', border: '1px solid rgba(0,245,155,0.18)', marginBottom: '28px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00f59b', boxShadow: '0 0 6px #00f59b', animation: 'pulse 2s ease-in-out infinite' }} />
              <span style={{ fontSize: '13px', color: '#00f59b', fontWeight: '500' }}>Now with GPT-4o · 6,000+ companies hiring smarter</span>
            </div>
            <h1 style={{ fontSize: '62px', fontWeight: '800', color: 'white', lineHeight: '1.04', margin: '0 0 22px', letterSpacing: '-0.03em' }}>
              The{' '}
              <em style={{ fontStyle: 'italic', color: '#00f59b', textShadow: '0 0 32px rgba(0,245,155,0.35)' }}>only</em>
              <br />hiring platform<br />you'll ever need
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.72', margin: '0 0 40px', maxWidth: '440px' }}>
              SmartHire uses AI to screen resumes, rank candidates, schedule video interviews, and make better hiring decisions — automatically.
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
              <Link href="/register" style={{ padding: '13px 30px', borderRadius: '10px', background: 'linear-gradient(135deg, #00f59b, #16a34a)', color: '#052e16', fontSize: '16px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 0 28px rgba(0,245,155,0.3)', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(0,245,155,0.5)';
                  const arrow = e.currentTarget.querySelector('span');
                  if (arrow) (arrow as HTMLElement).style.transform = 'translateX(4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 0 28px rgba(0,245,155,0.3)';
                  const arrow = e.currentTarget.querySelector('span');
                  if (arrow) (arrow as HTMLElement).style.transform = 'translateX(0)';
                }}>
                Get started free <span style={{ display: 'inline-block', transition: 'transform 0.2s' }}>→</span>
              </Link>
              <Link href="/login" style={{ padding: '13px 24px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontWeight: '500', textDecoration: 'none', background: 'rgba(255,255,255,0.04)', transition: 'all 0.2s' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}>
                Sign in
              </Link>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '13px', margin: 0 }}>✓ No credit card &nbsp;·&nbsp; ✓ Free for 3 jobs &nbsp;·&nbsp; ✓ Setup in 2 min</p>
          </div>
          <div style={{ position: 'relative', animation: 'heroSlideRight 1s ease 0.2s both' }}>
            <div style={{ position: 'absolute', inset: '-24px', borderRadius: '32px', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,245,155,0.07), transparent 70%)', filter: 'blur(16px)' }} />
            <div style={{ background: 'rgba(255,255,255,0.035)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.09)', padding: '22px', boxShadow: '0 32px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }} />
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginLeft: '10px' }}>SmartHire — AI Pipeline</span>
              </div>
              {candidates.map((c, i) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', animation: `heroFadeUp 0.5s ease ${0.4 + i * 0.1}s both` }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: `hsl(${c.name.charCodeAt(0) * 15}, 65%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>{c.name.charAt(0)}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)' }}>{c.role}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: `2.5px solid ${c.score >= 80 ? '#00f59b' : c.score >= 65 ? '#fbbf24' : '#f87171'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: c.score >= 80 ? '#00f59b' : c.score >= 65 ? '#fbbf24' : '#f87171' }}>{scores[i]}</span>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', background: c.statusBg, color: c.statusColor, border: `1px solid ${c.borderColor}` }}>{c.status}</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: '14px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(0,245,155,0.07)', border: '1px solid rgba(0,245,155,0.14)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✅</span>
                <span style={{ fontSize: '12px', color: '#00f59b', fontWeight: '500' }}>AI screened 4 candidates in 2.3 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS ── */}
      <section style={{ padding: '48px 48px', background: '#fff', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
        <div ref={logoAnim.ref} style={fadeUp(logoAnim.visible)}>
          <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', color: '#9ca3af', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trusted by fast-growing teams at</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap', alignItems: 'center' }}>
  {[
    { name: 'Razorpay', file: 'Razorpay_logo.svg', height: '28px' },
    { name: 'CRED', file: 'CRED-LOGO2.png', height: '30px' },
    { name: 'Zepto', file: 'Zepto_Logo.svg', height: '24px' },
    { name: 'PhonePe', file: 'PhonePe_Logo.svg', height: '28px' },
    { name: 'Meesho', file: 'Meesho_logo.png', height: '34px' },
  ].map((c, i) => (
    <img
      key={c.name}
      src={`https://commons.wikimedia.org/wiki/Special:FilePath/${c.file}`}
      alt={c.name}
      style={{ height: c.height, objectFit: 'contain', opacity: 0.85, transition: 'opacity 0.2s', ...fadeIn(logoAnim.visible, i * 80) }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
      onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
    />
  ))}
</div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '96px 48px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div ref={featuresHeadAnim.ref} style={{ textAlign: 'center', marginBottom: '64px', ...fadeUp(featuresHeadAnim.visible) }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Platform</span>
            <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#111827', margin: '12px 0 14px', letterSpacing: '-0.03em' }}>Everything you need<br />to hire smarter</h2>
            <p style={{ fontSize: '17px', color: '#6b7280', margin: 0 }}>One platform to source, screen, interview, and hire top talent</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title} ref={featureRefs[i].ref}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    padding: '28px', borderRadius: '16px',
                    border: hoveredCard === i ? `1px solid ${f.color}40` : '1px solid #e2e8f0',
                    background: hoveredCard === i ? '#fafafa' : '#fff',
                    transition: 'all 0.25s', cursor: 'pointer',
                    transform: featureRefs[i].visible ? (hoveredCard === i ? 'translateY(-5px)' : 'translateY(0)') : 'translateY(28px)',
                    opacity: featureRefs[i].visible ? 1 : 0,
                    transitionDelay: `${i * 80}ms`,
                    boxShadow: hoveredCard === i ? `0 20px 40px ${f.color}18` : 'none',
                    position: 'relative', overflow: 'hidden',
                  }}>
                  {hoveredCard === i && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />}
                  <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                    <Icon size={22} color={f.color} strokeWidth={2} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#111827', margin: '0 0 10px' }}>{f.title}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '96px 48px', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div ref={howAnim.ref} style={{ textAlign: 'center', marginBottom: '64px', ...fadeUp(howAnim.visible) }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Process</span>
            <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#111827', margin: '12px 0 14px', letterSpacing: '-0.03em' }}>How SmartHire works</h2>
            <p style={{ fontSize: '17px', color: '#6b7280', margin: 0 }}>From job posting to offer letter in minutes, not weeks</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '23px', left: '12.5%', right: '12.5%', height: '2px', background: 'linear-gradient(90deg, #16a34a, #7c3aed, #2563eb, #d97706)', opacity: howAnim.visible ? 0.3 : 0, transition: 'opacity 1s ease 0.3s', zIndex: 0 }} />
            {[
              { step: '01', title: 'Post a Job', desc: 'Create your job posting. AI uses your requirements to auto-screen every candidate.', icon: Briefcase, color: '#16a34a' },
              { step: '02', title: 'AI Screens', desc: 'GPT-4o instantly scores every resume — skills, gaps, and match percentage.', icon: Bot, color: '#7c3aed' },
              { step: '03', title: 'Video Interview', desc: 'Top candidates get invites. AI transcribes and analyzes responses live.', icon: Video, color: '#2563eb' },
              { step: '04', title: 'Hire', desc: 'Make data-driven decisions. Send offers in one click from your dashboard.', icon: PartyPopper, color: '#d97706' },
            ].map((s, i) => {
              const StepIcon = s.icon;
              return (
                <div key={s.step} ref={stepRefs[i].ref} style={{ textAlign: 'center', position: 'relative', zIndex: 1, ...fadeUp(stepRefs[i].visible, i * 120) }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: s.color, color: 'white', fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 0 0 4px #f9fafb, 0 0 0 6px ${s.color}40` }}>{s.step}</div>
                  <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'center' }}>
                    <StepIcon size={32} color={s.color} strokeWidth={1.8} />
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#111827', margin: '0 0 8px' }}>{s.title}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.65', margin: 0 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div ref={statsRef}>
        <section style={{ padding: '80px 48px', background: '#111827', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '800px', height: '400px', background: 'radial-gradient(ellipse, rgba(0,245,155,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {[
              { value: '3x', label: 'Faster time to hire' },
              { value: `${stat1}%`, label: 'Better candidate fit' },
              { value: `${stat2}%`, label: 'Less time screening' },
              { value: stat3 >= 10000 ? '10k+' : `${stat3}+`, label: 'Companies trust us' },
            ].map((s, i) => (
              <div key={s.label} style={{ ...fadeUp(statsVisible, i * 100) }}>
                <div style={{ fontSize: '50px', fontWeight: '800', color: '#00f59b', marginBottom: '8px', letterSpacing: '-0.03em', textShadow: '0 0 24px rgba(0,245,155,0.3)' }}>{s.value}</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', fontWeight: '500' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '96px 48px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div ref={testimonialsHeadAnim.ref} style={{ textAlign: 'center', marginBottom: '60px', ...fadeUp(testimonialsHeadAnim.visible) }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Customer Stories</span>
            <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#111827', margin: '12px 0 0', letterSpacing: '-0.03em' }}>
              Great companies hire<br />with SmartHire
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { quote: 'SmartHire\'s AI screening saved us 40 hours per week. The quality of candidates has never been better. We hired our entire engineering team in 2 weeks.', name: 'Rahul Mehta', role: 'Head of Talent, TechCorp India', initial: 'R', color: '#16a34a' },
              { quote: 'We went from 3 weeks to 3 days to fill a role. The video interview AI transcription is a game changer. Our hiring managers absolutely love it.', name: 'Priya Sharma', role: 'HR Director, Fintech Startup', initial: 'P', color: '#7c3aed' },
              { quote: 'The ATS score breakdown helps us make fair, data-driven decisions. We\'ve reduced unconscious bias in our hiring process significantly.', name: 'Amit Kumar', role: 'CTO, SaaS Company', initial: 'A', color: '#2563eb' },
            ].map((t, i) => (
              <div key={t.name} ref={testimonialRefs[i].ref}
                style={{ padding: '28px', borderRadius: '18px', border: '1px solid #e5e7eb', background: '#fff', position: 'relative', overflow: 'hidden', ...fadeUp(testimonialRefs[i].visible, i * 120) }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(0,0,0,0.07)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <div style={{ fontSize: '48px', color: t.color, opacity: 0.12, lineHeight: 1, marginBottom: '4px', fontFamily: 'Georgia, serif', fontWeight: '900' }}>"</div>
                <p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.75', margin: '0 0 24px' }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '18px', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}bb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>{t.initial}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section style={{ padding: '96px 48px', background: '#f9fafb' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

          {/* Header */}
          <div ref={pricingAnim.ref} style={{ textAlign: 'center', marginBottom: '48px', ...fadeUp(pricingAnim.visible) }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pricing</span>
            <h2 style={{ fontSize: '42px', fontWeight: '800', color: '#111827', margin: '12px 0 14px', letterSpacing: '-0.03em' }}>
              Simple, transparent pricing
            </h2>
            <p style={{ fontSize: '17px', color: '#6b7280', margin: '0 0 28px' }}>Start free. Scale as you grow. No hidden fees.</p>

            {/* Toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: '#e5e7eb', padding: '3px', borderRadius: '10px' }}>
              <button onClick={() => setBillingYearly(false)}
                style={{ padding: '7px 20px', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', background: !billingYearly ? '#fff' : 'transparent', color: !billingYearly ? '#111827' : '#6b7280', boxShadow: !billingYearly ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                Monthly
              </button>
              <button onClick={() => setBillingYearly(true)}
                style={{ padding: '7px 20px', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s', background: billingYearly ? '#fff' : 'transparent', color: billingYearly ? '#111827' : '#6b7280', boxShadow: billingYearly ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Yearly
                <span style={{ padding: '2px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', background: '#dcfce7', color: '#16a34a' }}>Save 20%</span>
              </button>
            </div>
          </div>

          {/* Plans */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
            {plans.map((plan, i) => (
              <div key={plan.name} ref={planRefs[i].ref}
                style={{
                  background: '#fff', borderRadius: '16px', padding: '28px',
                  border: plan.popular ? `2px solid ${plan.color}` : '1px solid #e5e7eb',
                  position: 'relative',
                  boxShadow: plan.popular ? `0 8px 32px ${plan.color}18` : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s',
                  ...fadeUp(planRefs[i].visible, i * 100),
                }}
                onMouseEnter={(e) => { if (!plan.popular) e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = planRefs[i].visible ? 'translateY(-3px)' : 'translateY(28px)'; }}
                onMouseLeave={(e) => { if (!plan.popular) e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = planRefs[i].visible ? 'translateY(0)' : 'translateY(28px)'; }}>

                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', borderRadius: '20px', background: plan.color, color: 'white', fontSize: '11px', fontWeight: '700', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    MOST POPULAR
                  </div>
                )}

                <div style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '6px', background: plan.accent, color: plan.color, fontSize: '12px', fontWeight: '600', marginBottom: '10px' }}>
                    {plan.name}
                  </div>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 18px', lineHeight: '1.5' }}>{plan.desc}</p>

                  {plan.monthlyPrice !== null ? (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                        <span style={{ fontSize: '18px', color: '#374151', fontWeight: '500' }}>₹</span>
                        <span style={{ fontSize: '42px', fontWeight: '800', color: '#111827', letterSpacing: '-1.5px', lineHeight: 1 }}>
                          {plan.monthlyPrice === 0 ? '0' : billingYearly ? plan.yearlyPrice?.toLocaleString('en-IN') : plan.monthlyPrice?.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '13px', color: '#9ca3af', marginLeft: '2px' }}>/mo</span>
                      </div>
                      {billingYearly && plan.monthlyPrice > 0 && (
                        <p style={{ fontSize: '12px', color: '#16a34a', margin: '5px 0 0', fontWeight: '500' }}>
                          Billed ₹{((plan.yearlyPrice || 0) * 12).toLocaleString('en-IN')}/yr · Save ₹{((plan.monthlyPrice - (plan.yearlyPrice || 0)) * 12).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '32px', fontWeight: '800', color: '#111827', letterSpacing: '-0.5px', lineHeight: 1.2 }}>Custom</div>
                  )}
                </div>

                <Link href="/register"
                  style={{
                    display: 'block', textAlign: 'center', padding: '11px 16px', borderRadius: '9px',
                    fontSize: '14px', fontWeight: '600', textDecoration: 'none', marginBottom: '24px',
                    transition: 'all 0.15s',
                    background: plan.popular ? plan.color : 'transparent',
                    color: plan.popular ? 'white' : plan.color,
                    border: `1.5px solid ${plan.color}`,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'none'; }}>
                  {plan.cta}
                </Link>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>What's included</p>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', marginBottom: '10px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: plan.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke={plan.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: '13px', color: '#374151', lineHeight: '1.45' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', margin: '32px 0 0' }}>
            All plans include 14-day free trial · No credit card required · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section style={{ padding: '96px 48px', background: '#0a0f0d', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', right: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,245,155,0.05) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* Header */}
          <div ref={techAnim.ref} style={{ textAlign: 'center', marginBottom: '64px', ...fadeUp(techAnim.visible) }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#00f59b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Architecture</span>
            <h2 style={{ fontSize: '42px', fontWeight: '800', color: 'white', margin: '12px 0 14px', letterSpacing: '-0.03em' }}>
              Built with modern tech
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              Production-grade stack used by top engineering teams
            </p>
          </div>

          {/* Two columns — Frontend + Backend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>

            {/* Frontend */}
            <div ref={techFEAnim.ref} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', padding: '28px', ...fadeUp(techFEAnim.visible, 0) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'white', letterSpacing: '0.01em' }}>Frontend</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'Next.js 14', desc: 'App Router, SSR, RSC', color: '#ffffff', dot: '#e2e8f0' },
                  { name: 'TypeScript', desc: 'Type-safe codebase', color: '#3b82f6', dot: '#3b82f6' },
                  { name: 'Tailwind CSS', desc: 'Utility-first styling', color: '#06b6d4', dot: '#06b6d4' },
                  { name: 'Zustand', desc: 'Global state management', color: '#f59e0b', dot: '#f59e0b' },
                  { name: 'shadcn/ui', desc: 'Component library', color: '#a78bfa', dot: '#a78bfa' },
                ].map((tech) => (
                  <div key={tech.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tech.dot, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'white' }}>{tech.name}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginLeft: '8px' }}>{tech.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backend */}
            <div ref={techBEAnim.ref} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', padding: '28px', ...fadeUp(techBEAnim.visible, 100) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'white', letterSpacing: '0.01em' }}>Backend</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'NestJS', desc: 'REST API + WebSockets', color: '#ef4444', dot: '#ef4444' },
                  { name: 'PostgreSQL + Prisma', desc: 'Type-safe ORM', color: '#3b82f6', dot: '#3b82f6' },
                  { name: 'Redis + BullMQ', desc: 'Async job queue', color: '#ef4444', dot: '#ef4444' },
                  { name: 'JWT + RBAC', desc: 'Auth & access control', color: '#f59e0b', dot: '#f59e0b' },
                  { name: 'AWS S3', desc: 'Resume file storage', color: '#f59e0b', dot: '#f59e0b' },
                ].map((tech) => (
                  <div key={tech.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tech.dot, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'white' }}>{tech.name}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginLeft: '8px' }}>{tech.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI + Infra row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

            {/* AI & Data */}
            <div ref={techAIAnim.ref} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', padding: '28px', ...fadeUp(techAIAnim.visible, 200) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,245,155,0.1)', border: '1px solid rgba(0,245,155,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00f59b" strokeWidth="2" strokeLinecap="round"><path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96-.46 2.5 2.5 0 01-1.07-4.65A3 3 0 016 10a3 3 0 013.5-2.96V2z"/><path d="M14.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 004.96-.46 2.5 2.5 0 001.07-4.65A3 3 0 0018 10a3 3 0 00-3.5-2.96V2z"/></svg>
                </div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'white', letterSpacing: '0.01em' }}>AI & Data</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { name: 'OpenAI GPT-4o', desc: 'Resume screening & scoring', dot: '#00f59b' },
                  { name: 'Pinecone', desc: 'Vector DB for semantic search', dot: '#3b82f6' },
                  { name: 'Nodemailer', desc: 'Automated email notifications', dot: '#f59e0b' },
                  { name: 'Jitsi Meet', desc: 'WebRTC video interviews', dot: '#8b5cf6' },
                  { name: 'Docker', desc: 'Containerized deployment', dot: '#3b82f6' },
                ].map((tech) => (
                  <div key={tech.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: tech.dot, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'white' }}>{tech.name}</span>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginLeft: '8px' }}>{tech.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume line */}
            <div ref={techResumeAnim.ref} style={{ background: 'rgba(0,245,155,0.03)', borderRadius: '16px', border: '1px solid rgba(0,245,155,0.08)', padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', ...fadeUp(techResumeAnim.visible, 300) }}>
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(0,245,155,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Resume line</span>
                <p style={{ fontSize: '15px', fontWeight: '600', color: 'white', margin: '10px 0 0', lineHeight: '1.6' }}>
                  "Built a full-stack AI recruitment platform with WebRTC video interviews, GPT-4o resume screening, Pinecone vector search, and role-based multi-tenant architecture using Next.js 14, NestJS, PostgreSQL, and Redis."
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Next.js 14', 'NestJS', 'PostgreSQL', 'Redis', 'GPT-4o', 'Pinecone', 'WebRTC', 'AWS S3', 'BullMQ', 'JWT', 'Prisma', 'TypeScript'].map((tag) => (
                  <span key={tag} style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '500', background: 'rgba(0,245,155,0.08)', color: '#00f59b', border: '1px solid rgba(0,245,155,0.15)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '96px 48px', background: '#0a0f0d', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '350px', background: 'radial-gradient(ellipse, rgba(0,245,155,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div ref={ctaAnim.ref} style={{ position: 'relative', zIndex: 1, maxWidth: '560px', margin: '0 auto', ...fadeUp(ctaAnim.visible) }}>
          <h2 style={{ fontSize: '50px', fontWeight: '800', color: 'white', margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
            Ready to hire<br /><span style={{ color: '#00f59b', textShadow: '0 0 28px rgba(0,245,155,0.3)' }}>smarter?</span>
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', margin: '0 0 36px', lineHeight: 1.65 }}>
            Join thousands of companies using SmartHire to find and hire the best talent with AI.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/register" style={{ padding: '14px 32px', borderRadius: '10px', background: 'linear-gradient(135deg, #00f59b, #16a34a)', color: '#052e16', fontSize: '16px', fontWeight: '700', textDecoration: 'none', boxShadow: '0 0 32px rgba(0,245,155,0.28)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 48px rgba(0,245,155,0.45)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(0,245,155,0.28)'; }}>
              Get started free →
            </Link>
            <Link href="/login" style={{ padding: '14px 24px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontWeight: '500', textDecoration: 'none', background: 'rgba(255,255,255,0.04)', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}>
              Sign in
            </Link>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', marginTop: '18px' }}>✓ Free forever plan &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ 2 min setup</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#060b08', padding: '56px 48px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: 'linear-gradient(135deg, #00f59b, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#052e16', fontWeight: '800', fontSize: '15px' }}>S</span>
                </div>
                <span style={{ fontSize: '17px', fontWeight: '700', color: 'white' }}>SmartHire</span>
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.38)', lineHeight: '1.7', margin: '0 0 18px' }}>The AI-powered recruitment platform built for modern companies who want to hire faster and smarter.</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { label: 'Twitter/X', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg> },
                  { label: 'LinkedIn', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
                  { label: 'GitHub', svg: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg> },
                ].map((s) => (
                  <div key={s.label} title={s.label} style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,245,155,0.1)'; (e.currentTarget as HTMLElement).style.color = '#00f59b'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,245,155,0.2)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                    {s.svg}
                  </div>
                ))}
              </div>
            </div>
            {[
              { title: 'Platform', links: ['AI Recruiting', 'Video Interviews', 'ATS Pipeline', 'Analytics', 'Integrations'] },
              { title: 'Why SmartHire', links: ['Compare', 'ROI Calculator', 'Customer Stories', 'Security', 'Pricing'] },
              { title: 'Resources', links: ['Blog', 'Documentation', 'API Reference', 'Community', 'Changelog'] },
              { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact', 'Legal'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>{col.title}</h4>
                {col.links.map((link) => (
                  <div key={link} style={{ marginBottom: '9px' }}>
                    <a href="#" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#00f59b'}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'}>
                      {link}
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', margin: 0 }}>©2026 SmartHire, Inc. All rights reserved.</p>
            <div style={{ display: 'flex', gap: '22px' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Preferences'].map((link) => (
                <a key={link} href="#" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ── CHATBOT WIDGET ── */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000 }}>
        {/* Chat window */}
        {chatOpen && (
          <div style={{ position: 'absolute', bottom: '64px', right: 0, width: '340px', background: '#fff', borderRadius: '16px', boxShadow: '0 24px 60px rgba(0,0,0,0.18)', border: '1px solid #e2e8f0', overflow: 'hidden', animation: 'chatSlideUp 0.25s ease' }}>

            {/* Header */}
            <div style={{ padding: '14px 16px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #00f59b, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#052e16', fontWeight: '800', fontSize: '12px' }}>S</span>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>SmartHire AI</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00f59b' }} />
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)}
                style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: '4px 8px', fontSize: '14px' }}>
                ✕
              </button>
            </div>

            {/* Messages */}
            <div style={{ height: '280px', overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', background: '#f8fafc' }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '80%', padding: '9px 13px', borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: msg.role === 'user' ? '#0f172a' : '#fff',
                    color: msg.role === 'user' ? 'white' : '#374151',
                    fontSize: '13px', lineHeight: '1.5',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '9px 13px', borderRadius: '12px 12px 12px 2px', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0,1,2].map(i => (
                      <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#94a3b8', animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick questions */}
            {chatMessages.length === 1 && (
              <div style={{ padding: '8px 14px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['What is SmartHire?', 'How is pricing?', 'Tech stack?'].map(q => (
                  <button key={q} onClick={() => { setChatInput(q); }}
                    style={{ padding: '4px 10px', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#fff', fontSize: '11px', color: '#64748b', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.color = '#16a34a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}>
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px', background: '#fff' }}>
              <input
                placeholder="Ask anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') sendChatMessage(); }}
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px', outline: 'none', color: '#374151' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#16a34a'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
              <button onClick={sendChatMessage} disabled={chatLoading || !chatInput.trim()}
                style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: chatLoading || !chatInput.trim() ? '#e2e8f0' : '#0f172a', color: chatLoading || !chatInput.trim() ? '#94a3b8' : 'white', fontSize: '13px', fontWeight: '500', cursor: chatLoading || !chatInput.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>
                Send
              </button>
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button onClick={() => setChatOpen(!chatOpen)}
          style={{ width: '52px', height: '52px', borderRadius: '50%', background: chatOpen ? '#0f172a' : 'linear-gradient(135deg, #00f59b, #16a34a)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: chatOpen ? '0 4px 16px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,245,155,0.4)', transition: 'all 0.25s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.08)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}>
          {chatOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#052e16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          )}
        </button>
      </div>

      <style>{`
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroSlideRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}