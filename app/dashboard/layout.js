'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

var NAV = [
  { icon: '\u26A1', label: 'Create with AI', path: '/dashboard/create', type: 'ai' },
  { icon: '+', label: 'Import from Git', path: '/dashboard/new', type: 'import' },
  { type: 'divider' },
  { icon: '\uD83D\uDCC1', label: 'Projects', path: '/dashboard' },
  { icon: '\uD83D\uDE80', label: 'Deployments', path: '/dashboard/deployments' },
  { icon: '\uD83D\uDDC3\uFE0F', label: 'Databases', path: '/dashboard/databases' },
  { icon: '\uD83C\uDF10', label: 'Domains', path: '/dashboard/domains' },
  { icon: '\uD83D\uDCCA', label: 'Analytics', path: '/dashboard/analytics' },
  { type: 'divider' },
  { icon: '\uD83D\uDCAC', label: 'Support', path: '/dashboard/support' },
  { icon: '\uD83D\uDCD6', label: 'Docs', path: '/dashboard/docs' },
  { type: 'divider' },
  { icon: '\u2699\uFE0F', label: 'Settings', path: '/dashboard/settings' },
];

export default function DashboardLayout({ children }) {
  var router = useRouter();
  var pathname = usePathname();
  var [user, setUser] = useState(null);

  useEffect(function() {
    fetch('/api/auth').then(function(r) { return r.json(); }).then(function(d) {
      if (d.user) setUser(d.user); else router.push('/');
    }).catch(function() { router.push('/'); });
  }, []);

  function logout() {
    fetch('/api/auth', { method: 'DELETE' }).then(function() { router.push('/'); });
  }

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#060a0f', fontFamily: "'Outfit', sans-serif" }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#060a0f', fontFamily: "'Outfit', sans-serif", color: '#e8eaed' }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:4px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.1)}
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 14px; border-radius: 10px; cursor: pointer; font-size: 13.5px; font-weight: 500; transition: all 0.15s ease; border: 1px solid transparent; }
        .nav-item:hover { background: rgba(255,255,255,0.03); }
      `}</style>

      {/* Sidebar */}
      <div style={{
        width: 240, background: 'rgba(8,12,18,0.95)', borderRight: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', flexDirection: 'column', padding: '20px 14px', flexShrink: 0, overflow: 'auto',
        backdropFilter: 'blur(20px)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2px 10px', marginBottom: 24 }}>
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <defs><linearGradient id="kgl2" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor="#38bda8" /><stop offset="100%" stopColor="#2588cc" /></linearGradient></defs>
            <rect width="48" height="48" rx="14" fill="url(#kgl2)" fillOpacity="0.1" />
            <rect x="0.5" y="0.5" width="47" height="47" rx="13.5" stroke="url(#kgl2)" strokeOpacity="0.25" />
            <path d="M14 30c-2.2 0-4-1.8-4-4s1.8-4 4-4c.3 0 .6 0 .9.1C15.5 19.2 18.4 17 22 17c3.1 0 5.7 1.7 7 4.2.5-.1 1-.2 1.5-.2 3.3 0 6 2.7 6 6s-2.7 6-6 6H14z" fill="url(#kgl2)" fillOpacity="0.12" stroke="url(#kgl2)" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M24 33V23m0 0l-3.5 3.5M24 23l3.5 3.5" stroke="url(#kgl2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #38bda8, #2588cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>kumo</span>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', marginLeft: 'auto', background: 'rgba(56,189,168,0.08)', padding: '2px 8px', borderRadius: 6, fontWeight: 600, border: '1px solid rgba(56,189,168,0.1)' }}>PRO</span>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(function(item, i) {
            if (item.type === 'divider') return <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '8px 6px' }} />;

            var isActive = item.path === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.path);

            if (item.type === 'ai') return (
              <button key={i} onClick={function() { router.push(item.path); }} style={{
                width: '100%', padding: '11px 14px', borderRadius: 12, border: '1px solid rgba(56,189,168,0.15)', cursor: 'pointer',
                marginBottom: 4, background: isActive ? 'rgba(56,189,168,0.1)' : 'linear-gradient(135deg, rgba(56,189,168,0.06), rgba(37,136,204,0.04))',
                color: '#38bda8', fontSize: 13.5, fontWeight: 700, fontFamily: "'Outfit', sans-serif",
                display: 'flex', alignItems: 'center', gap: 9, boxSizing: 'border-box',
                transition: 'all 0.2s ease',
              }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span> {item.label}
                <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, background: 'rgba(56,189,168,0.15)', padding: '2px 7px', borderRadius: 5, letterSpacing: '0.5px' }}>AI</span>
              </button>
            );

            if (item.type === 'import') return (
              <button key={i} onClick={function() { router.push(item.path); }} style={{
                width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px dashed rgba(255,255,255,0.08)', cursor: 'pointer',
                marginBottom: 2, background: 'transparent', color: 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: 500,
                fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', gap: 9, boxSizing: 'border-box',
              }}>
                <span style={{ fontSize: 13 }}>{item.icon}</span> {item.label}
              </button>
            );

            return (
              <div key={i} className="nav-item" onClick={function() { router.push(item.path); }} style={{
                background: isActive ? 'rgba(56,189,168,0.06)' : undefined,
                color: isActive ? '#38bda8' : 'rgba(255,255,255,0.4)',
                borderColor: isActive ? 'rgba(56,189,168,0.08)' : undefined,
              }}>
                <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* User */}
        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '0 6px 14px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, cursor: 'pointer' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #38bda8, #2588cc)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#060a0f',
            }}>{user.name ? user.name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase() : 'U'}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{user.name || user.email}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>Pro Plan</div>
            </div>
            <span onClick={logout} style={{ fontSize: 14, color: 'rgba(255,255,255,0.15)', cursor: 'pointer', padding: '4px' }} title="Sign out">{'\u23FB'}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* Subtle gradient overlay at top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(180deg, rgba(56,189,168,0.02) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
