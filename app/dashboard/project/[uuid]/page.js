'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProjectPage() {
  var router = useRouter();
  var params = useParams();
  var [app, setApp] = useState(null);
  var [deployments, setDeployments] = useState([]);
  var [tab, setTab] = useState('preview');
  var [device, setDevice] = useState('desktop');
  var [deploying, setDeploying] = useState(false);
  var [error, setError] = useState('');
  var widths = { desktop: '100%', tablet: 768, mobile: 390 };

  function load() {
    fetch('/api/projects/' + params.uuid).then(function(r) { return r.json(); }).then(function(data) {
      if (data.application) setApp(data.application);
      if (data.deployments) setDeployments(data.deployments.slice(0, 10));
    });
  }

  useEffect(function() { load(); var iv = setInterval(load, 10000); return function() { clearInterval(iv); }; }, [params.uuid]);

  function redeploy() {
    setDeploying(true);
    fetch('/api/projects/' + params.uuid, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'deploy' }) })
      .then(function() { setDeploying(false); load(); })
      .catch(function(e) { setError(e.message); setDeploying(false); });
  }

  function deleteProject() {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    fetch('/api/projects/' + params.uuid, { method: 'DELETE' }).then(function() { router.push('/dashboard'); });
  }

  if (!app) return <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>Loading...</div>;

  var siteUrl = app.fqdn || '';
  var status = (app.status || 'unknown').toLowerCase();
  var sc = { color: 'rgba(255,255,255,0.3)', label: app.status || 'unknown' };
  if (status.includes('running')) sc = { color: '#34d399', label: 'Live' };
  else if (status.includes('building')) sc = { color: '#fbbf24', label: 'Building' };
  else if (status.includes('failed') || status.includes('exited')) sc = { color: '#f87171', label: 'Failed' };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <style>{`
        .tab-btn { padding: 11px 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; text-transform: capitalize; border: none; background: none; font-family: 'Outfit', sans-serif; }
        .device-btn { padding: 7px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; font-family: 'Outfit', sans-serif; transition: all 0.15s; }
      `}</style>

      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={function() { router.push('/dashboard'); }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, color: 'rgba(255,255,255,0.4)', padding: '6px 12px', cursor: 'pointer', fontSize: 12, fontFamily: "'Outfit'" }}>{'\u2190'} Back</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#fff', letterSpacing: '-0.3px' }}>{app.name}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: sc.color + '14', color: sc.color }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.color }} />{sc.label}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {siteUrl && <a href={siteUrl} target="_blank" rel="noopener" style={{ padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'rgba(56,189,168,0.06)', color: '#38bda8', textDecoration: 'none', border: '1px solid rgba(56,189,168,0.1)', fontFamily: "'Outfit'" }}>Visit {'\u2197'}</a>}
          <button onClick={redeploy} disabled={deploying} style={{ padding: '8px 18px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'linear-gradient(135deg, #38bda8, #2588cc)', color: '#060a0f', border: 'none', fontFamily: "'Outfit'", opacity: deploying ? 0.6 : 1 }}>
            {deploying ? 'Deploying...' : 'Redeploy'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '0 24px' }}>
        {['preview', 'deployments', 'settings'].map(function(t) {
          var active = tab === t;
          return <button key={t} className="tab-btn" onClick={function() { setTab(t); }} style={{
            color: active ? '#38bda8' : 'rgba(255,255,255,0.3)',
            borderBottom: active ? '2px solid #38bda8' : '2px solid transparent',
          }}>{t}</button>;
        })}
      </div>

      {error && <div style={{ margin: '14px 24px 0', padding: '12px 16px', borderRadius: 10, background: 'rgba(248,113,113,0.06)', color: '#f87171', fontSize: 13 }}>{error}</div>}

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
        {tab === 'preview' && (
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 18, background: 'rgba(255,255,255,0.02)', padding: 4, borderRadius: 10, width: 'fit-content', border: '1px solid rgba(255,255,255,0.04)' }}>
              {['desktop', 'tablet', 'mobile'].map(function(d) {
                var icons = { desktop: '\uD83D\uDDA5', tablet: '\uD83D\uDCF1', mobile: '\uD83D\uDCF2' };
                return <button key={d} className="device-btn" onClick={function() { setDevice(d); }} style={{
                  background: device === d ? 'rgba(56,189,168,0.1)' : 'transparent',
                  color: device === d ? '#38bda8' : 'rgba(255,255,255,0.2)',
                }}>{icons[d]} {d.charAt(0).toUpperCase() + d.slice(1)}</button>;
              })}
            </div>
            <div style={{
              width: widths[device], maxWidth: '100%', margin: '0 auto', borderRadius: 16, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.06)', height: 520, transition: 'width 0.3s ease',
              boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            }}>
              <div style={{ padding: '10px 14px', background: 'rgba(12,16,24,0.9)', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 7 }}>
                {['#ff5f57', '#febc2e', '#28c840'].map(function(c) { return <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.5 }} />; })}
                <span style={{ marginLeft: 10, fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 400 }}>{siteUrl || 'building...'}</span>
              </div>
              {siteUrl ? (
                <iframe src={siteUrl} style={{ width: '100%', height: 'calc(100% - 38px)', border: 'none', background: '#fff' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100% - 38px)', background: 'rgba(8,12,18,0.95)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 12, animation: 'pulse 1.5s ease infinite' }}>{'\uD83D\uDE80'}</div>
                    <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Deploying...</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Preview will appear once the build completes</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'deployments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {deployments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 48, color: 'rgba(255,255,255,0.2)' }}>No deployments yet</div>
            ) : deployments.map(function(d, i) {
              var ds = (d.status || '').toLowerCase();
              var dc = 'rgba(255,255,255,0.3)';
              if (ds.includes('finished') || ds.includes('success')) dc = '#34d399';
              else if (ds.includes('progress') || ds.includes('building')) dc = '#fbbf24';
              else if (ds.includes('failed') || ds.includes('error')) dc = '#f87171';
              return (
                <div key={d.id || i} style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', gap: 14 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: dc + '14', color: dc }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: dc }} />{d.status || 'unknown'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{d.commit_message || 'Deployment'}</div>
                    <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.2)' }}>{d.created_at ? new Date(d.created_at * 1000).toLocaleString() : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'settings' && (
          <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { label: 'Project Name', value: app.name },
              { label: 'Domain', value: app.fqdn || 'Not configured' },
              { label: 'Repository', value: app.git_repository || 'N/A' },
              { label: 'Build Pack', value: app.build_pack || 'nixpacks' },
            ].map(function(f) {
              return <div key={f.label}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input defaultValue={f.value} readOnly style={{
                  width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.6)', fontSize: 14,
                  outline: 'none', boxSizing: 'border-box', fontFamily: f.label === 'Repository' ? "'JetBrains Mono', monospace" : "'Outfit'",
                }} />
              </div>;
            })}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20, marginTop: 8 }}>
              <button onClick={deleteProject} style={{ padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'rgba(248,113,113,0.06)', color: '#f87171', border: '1px solid rgba(248,113,113,0.1)', fontFamily: "'Outfit'" }}>Delete Project</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
