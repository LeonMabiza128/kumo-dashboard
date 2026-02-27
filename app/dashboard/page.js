'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function StatusBadge({ status }) {
  var s = (status || '').toLowerCase();
  var cfg = { color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.04)', label: status || 'unknown', glow: 'none' };
  if (s.includes('running')) cfg = { color: '#34d399', bg: 'rgba(52,211,153,0.08)', label: 'Live', glow: '0 0 8px rgba(52,211,153,0.2)' };
  else if (s.includes('building') || s.includes('deploying')) cfg = { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', label: 'Building', glow: 'none' };
  else if (s.includes('failed') || s.includes('error') || s.includes('exited')) cfg = { color: '#f87171', bg: 'rgba(248,113,113,0.08)', label: 'Failed', glow: 'none' };
  else if (s.includes('stopped')) cfg = { color: 'rgba(255,255,255,0.25)', bg: 'rgba(255,255,255,0.03)', label: 'Stopped', glow: 'none' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.color, letterSpacing: '0.2px' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, boxShadow: cfg.glow }} />
      {cfg.label}
    </span>
  );
}

export default function DashboardPage() {
  var [projects, setProjects] = useState([]);
  var [loading, setLoading] = useState(true);
  var router = useRouter();

  useEffect(function() {
    fetch('/api/projects').then(function(r) { return r.json(); }).then(function(data) {
      setProjects(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(function() { setLoading(false); });
  }, []);

  var live = projects.filter(function(p) { return (p.status || '').toLowerCase().includes('running'); }).length;

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
      <style>{`
        .project-card { padding: 20px 22px; border-radius: 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: all 0.2s ease; }
        .project-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); transform: translateY(-1px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
        .action-btn { padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; border: none; }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', margin: 0 }}>Projects</h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 4 }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''}{live > 0 ? ' \u00B7 ' + live + ' live' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="action-btn" onClick={function() { router.push('/dashboard/new'); }} style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}>+ Import</button>
          <button className="action-btn" onClick={function() { router.push('/dashboard/create'); }} style={{ background: 'linear-gradient(135deg, #38bda8, #2588cc)', color: '#060a0f', fontWeight: 700, boxShadow: '0 4px 20px rgba(56,189,168,0.2)' }}>{'\u26A1'} Create with AI</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: 'rgba(255,255,255,0.2)' }}>
          <div style={{ fontSize: 14, animation: 'pulse 1.5s ease infinite' }}>Loading projects...</div>
        </div>
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', borderRadius: 20, border: '1px dashed rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(56,189,168,0.06)', border: '1px solid rgba(56,189,168,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px' }}>{'\uD83D\uDE80'}</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.5px' }}>No projects yet</h3>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 24, maxWidth: 320, margin: '0 auto 24px' }}>Create your first website with AI or import an existing GitHub repo</p>
          <button className="action-btn" onClick={function() { router.push('/dashboard/create'); }} style={{ background: 'linear-gradient(135deg, #38bda8, #2588cc)', color: '#060a0f', fontWeight: 700, padding: '12px 28px', fontSize: 14 }}>{'\u26A1'} Create with AI</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {projects.map(function(p) {
            var url = '';
            if (p.fqdn) url = p.fqdn.replace('https://', '').replace('http://', '');
            return (
              <div key={p.uuid} className="project-card" onClick={function() { router.push('/dashboard/project/' + p.uuid); }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: 'linear-gradient(135deg, rgba(56,189,168,0.08), rgba(37,136,204,0.06))',
                      border: '1px solid rgba(56,189,168,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, fontWeight: 700, color: '#38bda8',
                    }}>{(p.name || '?')[0].toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '-0.3px' }}>{p.name}</div>
                      {url && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: 400 }}>{url}</div>}
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
                  <span style={{ background: 'rgba(255,255,255,0.03)', padding: '3px 8px', borderRadius: 5 }}>{p.build_pack || 'nixpacks'}</span>
                  {p.git_repository && <span>{p.git_repository.split('/').pop()}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
