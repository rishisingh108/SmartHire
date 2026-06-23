'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
        style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '6px',
          background: 'linear-gradient(135deg, #16a34a, #15803d)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: 'white', fontWeight: '800', fontSize: '15px' }}>S</span>
        </div>
        <span style={{ fontSize: '17px', fontWeight: '700', color: '#111827' }}>SmartHire</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {user?.role === 'RECRUITER' ? (
          <>
            <NavLink href="/dashboard/recruiter" label="Dashboard" />
            <NavLink href="/dashboard/recruiter/jobs" label="Jobs" />
            <NavLink href="/dashboard/recruiter/candidates" label="Candidates" />
            <NavLink href="/dashboard/recruiter/interviews" label="Interviews" />
          </>
        ) : (
          <>
            <NavLink href="/dashboard/candidate" label="Dashboard" />
            <NavLink href="/dashboard/candidate/jobs" label="Browse Jobs" />
            <NavLink href="/dashboard/candidate/applications" label="My Applications" />
          </>
        )}
      </div>

      {/* User menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} style={{
      padding: '6px 14px', borderRadius: '6px',
      fontSize: '14px', fontWeight: '500', color: '#374151',
      textDecoration: 'none', transition: 'all 0.15s',
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f0fdf4'; (e.currentTarget as HTMLElement).style.color = '#16a34a'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#374151'; }}
    >
      {label}
    </Link>
  );
}