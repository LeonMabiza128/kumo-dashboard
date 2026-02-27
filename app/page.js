'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  var [mode, setMode] = useState('login');
  var [name, setName] = useState('');
  var [email, setEmail] = useState('');
  var [pass, setPass] = useState('');
  var [error, setError] = useState('');
  var [loading, setLoading] = useState(false);
  var router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      var endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      var body = mode === 'login' ? { email: email, password: pass } : { name: name, email: email, password: pass };
      var res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push('/dashboard');
    } catch (err) { setError(err.message); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Outfit', sans-serif", color: '#e8eaed', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(2deg); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .login-input { width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.03); color: #fff; font-size: 14px; font-family: 'Outfit', sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s; }
        .login-input:focus { border-color: rgba(56,189,168,0.4); box-shadow: 0 0 0 3px rgba(56,189,168,0.08); }
        .login-input::placeholder { color: rgba(255,255,255,0.2); }
        .login-btn { width: 100%; padding: 14px; border-radius: 12px; border: none; font-size: 15px; font-weight: 700; font-family: 'Outfit', sans-serif; cursor: pointer; box-sizing: border-box; transition: transform 0.15s, box-shadow 0.15s; }
        .login-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(56,189,168,0.25); }
        .login-btn:active { transform: translateY(0); }
      `}</style>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: '#060a0f', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(56,189,168,0.06) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse, rgba(37,136,204,0.05) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      {/* Left brand panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px 40px', position: 'relative', zIndex: 1 }}>
        <div style={{ animation: 'fadeUp 0.8s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <defs><linearGradient id="kgl" x1="0" y1="0" x2="48" y2="48"><stop offset="0%" stopColor="#38bda8" /><stop offset="100%" stopColor="#2588cc" /></linearGradient></defs>
              <rect width="48" height="48" rx="14" fill="url(#kgl)" fillOpacity="0.1" />
              <rect x="0.5" y="0.5" width="47" height="47" rx="13.5" stroke="url(#kgl)" strokeOpacity="0.3" />
              <path d="M14 30c-2.2 0-4-1.8-4-4s1.8-4 4-4c.3 0 .6 0 .9.1C15.5 19.2 18.4 17 22 17c3.1 0 5.7 1.7 7 4.2.5-.1 1-.2 1.5-.2 3.3 0 6 2.7 6 6s-2.7 6-6 6H14z" fill="url(#kgl)" fillOpacity="0.15" stroke="url(#kgl)" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M24 33V23m0 0l-3.5 3.5M24 23l3.5 3.5" stroke="url(#kgl)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg, #38bda8, #2588cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>kumo</span>
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1.5px', margin: 0, maxWidth: 420 }}>
            Build websites<br /><span style={{ background: 'linear-gradient(135deg, #38bda8, #2588cc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>with AI.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginTop: 16, maxWidth: 380 }}>
            Describe what you want. We generate, deploy, and host it — all in under 60 seconds.
          </p>

          <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
            {[
              { val: '60s', label: 'Deploy time' },
              { val: 'AI', label: 'Powered' },
              { val: 'SSL', label: 'Included' },
            ].map(function(s) {
              return <div key={s.label}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#38bda8' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{s.label}</div>
              </div>;
            })}
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div style={{ width: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '100%', maxWidth: 400, padding: '36px 32px', borderRadius: 20,
          background: 'rgba(12,16,24,0.8)', backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          animation: 'fadeUp 0.8s ease 0.2s both',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.5px' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: '0 0 28px' }}>
            {mode === 'login' ? 'Sign in to your dashboard' : 'Start building with Kumo'}
          </p>

          {error && <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444', fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, letterSpacing: '0.3px' }}>Full Name</label>
                <input className="login-input" value={name} onChange={function(e) { setName(e.target.value); }} placeholder="Your name" required />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, letterSpacing: '0.3px' }}>Email</label>
              <input className="login-input" type="email" value={email} onChange={function(e) { setEmail(e.target.value); }} placeholder="you@company.co.za" required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, letterSpacing: '0.3px' }}>Password</label>
              <input className="login-input" type="password" value={pass} onChange={function(e) { setPass(e.target.value); }} placeholder="••••••••" required />
            </div>
            <button type="submit" className="login-btn" disabled={loading} style={{
              background: 'linear-gradient(135deg, #38bda8, #2588cc)', color: '#060a0f',
              opacity: loading ? 0.6 : 1,
            }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 500 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.35)' }}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span onClick={function() { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} style={{ color: '#38bda8', cursor: 'pointer', fontWeight: 600 }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
