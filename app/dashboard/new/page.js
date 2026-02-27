'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  var router = useRouter();
  var [step, setStep] = useState(1);
  var [name, setName] = useState('');
  var [repo, setRepo] = useState('');
  var [branch, setBranch] = useState('main');
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState('');

  async function deploy() {
    if (!name || !repo) return;
    setLoading(true); setError('');
    try {
      var res = await fetch('/api/projects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name, repository: repo, branch: branch }) });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push('/dashboard/project/' + data.uuid);
    } catch (err) { setError(err.message); setLoading(false); }
  }

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
      <style>{`
        .git-input { width: 100%; padding: 14px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); color: #fff; font-size: 14px; font-family: 'Outfit', sans-serif; outline: none; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s; }
        .git-input:focus { border-color: rgba(56,189,168,0.3); box-shadow: 0 0 0 3px rgba(56,189,168,0.06); }
        .git-input::placeholder { color: rgba(255,255,255,0.15); }
      `}</style>
      <div style={{ maxWidth: 520, margin: '20px auto' }}>
        <button onClick={function() { router.push('/dashboard'); }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: 'rgba(255,255,255,0.3)', padding: '6px 14px', cursor: 'pointer', fontSize: 12, fontFamily: "'Outfit'", marginBottom: 28 }}>{'\u2190'} Back</button>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>Import from Git</h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 28 }}>Deploy an existing GitHub repository</p>

        {error && <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.1)', color: '#f87171', fontSize: 13, marginBottom: 18 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
          {[1, 2].map(function(s) { return <div key={s} style={{ flex: 1, height: 3, borderRadius: 3, background: s <= step ? 'linear-gradient(90deg, #38bda8, #2588cc)' : 'rgba(255,255,255,0.04)', transition: 'all 0.3s' }} />; })}
        </div>

        {step === 1 && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 6 }}>Project Name</label>
              <input className="git-input" value={name} onChange={function(e) { setName(e.target.value); }} placeholder="My Website" />
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 6 }}>GitHub Repository URL</label>
              <input className="git-input" value={repo} onChange={function(e) { setRepo(e.target.value); }} placeholder="https://github.com/user/repo" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 6 }}>Branch</label>
              <input className="git-input" value={branch} onChange={function(e) { setBranch(e.target.value); }} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }} />
            </div>
            <button onClick={function() { if (name && repo) setStep(2); }} disabled={!name || !repo} style={{
              width: '100%', padding: 14, borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: name && repo ? 'pointer' : 'not-allowed',
              fontFamily: "'Outfit'", background: name && repo ? 'linear-gradient(135deg, #38bda8, #2588cc)' : 'rgba(255,255,255,0.03)',
              color: name && repo ? '#060a0f' : 'rgba(255,255,255,0.15)', boxSizing: 'border-box',
            }}>Continue {'\u2192'}</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ padding: 22, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', marginBottom: 22 }}>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 4, fontWeight: 600 }}>Project</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 16 }}>{name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 4, fontWeight: 600 }}>Repository</div>
              <div style={{ fontSize: 13, color: '#38bda8', fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>{repo}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 4, fontWeight: 600 }}>Branch</div>
              <div style={{ fontSize: 13, color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>{branch}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={function() { setStep(1); }} style={{ flex: 1, padding: 14, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit'" }}>{'\u2190'} Back</button>
              <button onClick={deploy} disabled={loading} style={{ flex: 2, padding: 14, borderRadius: 12, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit'", background: 'linear-gradient(135deg, #38bda8, #2588cc)', color: '#060a0f', opacity: loading ? 0.6 : 1 }}>{loading ? 'Deploying...' : '\uD83D\uDE80 Deploy'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
