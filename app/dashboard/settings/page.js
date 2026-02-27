'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  var router = useRouter();
  var [user, setUser] = useState(null);
  useEffect(function() {
    fetch('/api/auth').then(function(r) { return r.json(); }).then(function(d) { if (d.user) setUser(d.user); });
  }, []);

  function logout() {
    fetch('/api/auth', { method: 'DELETE' }).then(function() { router.push('/'); });
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
      <style>{`
        .settings-input { width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); color: rgba(255,255,255,0.5); font-size: 14px; font-family: 'Outfit', sans-serif; outline: none; box-sizing: border-box; }
      `}</style>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>Settings</h1>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 28 }}>Manage your account</p>

      <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)', display: 'block', marginBottom: 6 }}>Name</label>
          <input className="settings-input" defaultValue={user ? user.name : ''} readOnly />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)', display: 'block', marginBottom: 6 }}>Email</label>
          <input className="settings-input" defaultValue={user ? user.email : ''} readOnly />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.25)', display: 'block', marginBottom: 6 }}>Plan</label>
          <div style={{ padding: '14px 18px', borderRadius: 12, background: 'linear-gradient(135deg, rgba(56,189,168,0.06), rgba(37,136,204,0.04))', border: '1px solid rgba(56,189,168,0.1)', color: '#38bda8', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Pro Plan</span>
            <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(56,189,168,0.12)', padding: '3px 10px', borderRadius: 6 }}>ACTIVE</span>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 22, marginTop: 8 }}>
          <button onClick={logout} style={{ padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', background: 'rgba(248,113,113,0.06)', color: '#f87171', border: '1px solid rgba(248,113,113,0.1)', fontFamily: "'Outfit'" }}>Sign Out</button>
        </div>
      </div>
    </div>
  );
}
