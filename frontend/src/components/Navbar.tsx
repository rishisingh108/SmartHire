'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth.store';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const recruiterLinks = [
    { href: '/dashboard/recruiter', label: 'Dashboard' },
    { href: '/dashboard/recruiter/jobs', label: 'Jobs' },
    { href: '/dashboard/recruiter/candidates', label: 'Candidates' },
    { href: '/dashboard/recruiter/interviews', label: 'Interviews' },
  ];

  const candidateLinks = [
    { href: '/dashboard/candidate', label: 'Dashboard' },
    { href: '/dashboard/candidate?tab=jobs', label: 'Browse Jobs' },
    { href: '/dashboard/candidate?tab=applications', label: 'My Applications' },
  ];

  const links = user?.role === 'RECRUITER' ? recruiterLinks : candidateLinks;

  return (
    <nav style={{
      height: '60px', background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky',
      top: 0, zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      {/* Logo */}
      <Link href={user?.role === 'RECRUITER' ? '/dashboard/recruiter' : '/dashboard/candidate'}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <Image
          src="/logo.png"
          alt="SmartHire Logo"
          width={32}
          height={32}
          style={{ borderRadius: '6px', objectFit: 'cover' }}
        />
        <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>SmartHire</span>
      </Link>

      {/* Desktop Nav Links */}
      <div className="desktop-nav" style={{ display: 'flex', gap: '4px' }}>
        {links.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href.split('?')[0]} />
        ))}
      </div>

      {/* User menu (desktop) */}
      <div className="desktop-user" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #16a34a, #15803d)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <span style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{user?.name}</div>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>{user?.role}</div>
        </div>
        <button onClick={handleLogout}
          style={{
            padding: '6px 14px', borderRadius: '6px',
            border: '1px solid #e5e7eb', background: '#fff',
            fontSize: '13px', color: '#6b7280', cursor: 'pointer',
            fontWeight: '500', transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.border = '1px solid #fecaca'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.border = '1px solid #e5e7eb'; }}
        >
          Logout
        </button>
      </div>

      {/* Hamburger button (mobile only) */}
      <button
        className="mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none', background: 'none', border: 'none',
          fontSize: '22px', cursor: 'pointer', color: '#111827',
        }}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '60px', left: 0, right: 0,
          background: '#fff', borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
          display: 'flex', flexDirection: 'column', padding: '12px',
          gap: '4px', zIndex: 99,
        }}>
          {links.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} active={pathname === link.href.split('?')[0]} onClick={() => setMobileOpen(false)} />
          ))}
          <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '8px', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{user?.name}</div>
                <div style={{ fontSize: '11px', color: '#6b7280' }}>{user?.role}</div>
              </div>
            </div>
            <button onClick={handleLogout}
              style={{
                padding: '6px 14px', borderRadius: '6px',
                border: '1px solid #fecaca', background: '#fee2e2',
                fontSize: '13px', color: '#dc2626', cursor: 'pointer', fontWeight: '500',
              }}>
              Logout
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav, .desktop-user {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}

function NavLink({ href, label, active, onClick }: { href: string; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} style={{
      padding: '6px 14px', borderRadius: '6px',
      fontSize: '14px', fontWeight: '500',
      color: active ? '#16a34a' : '#374151',
      background: active ? '#f0fdf4' : 'transparent',
      textDecoration: 'none', transition: 'all 0.15s',
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f0fdf4'; (e.currentTarget as HTMLElement).style.color = '#16a34a'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = active ? '#f0fdf4' : 'transparent'; (e.currentTarget as HTMLElement).style.color = active ? '#16a34a' : '#374151'; }}
    >
      {label}
    </Link>
  );
}