'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeploymentsPage() {
  var [apps, setApps] = useState([]);
  var router = useRouter();
  useEffect(function() {
    fetch('/api/projects').then(function(r) { return r.json(); }).then(function(d) { setApps(Array.isArray(d) ? d : []); });
  }, []);
  var live = apps.filter(function(a) { return (a.status || '').toLowerCase().includes('running'); }).length;
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>Deployments</h1>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 24 }}>{apps.length} total {'\u00B7'} {live} live</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {apps.map(function(a) {
          var s = (a.status || '').toLowerCase();
          var col = 'rgba(255,255,255,0.3)';
          if (s.includes('running')) col = '#34d399'; else if (s.includes('building')) col = '#fbbf24'; else if (s.includes('fail') || s.includes('exit')) col = '#f87171';
          return (
            <div key={a.uuid} onClick={function() { router.push('/dashboard/project/' + a.uuid); }} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', gap: 14, cursor: 'pointer', transition: 'all 0.15s' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: col + '14', color: col }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: col }} />{a.status || 'unknown'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{a.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{a.git_repository || ''}</div>
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>{'\u2192'}</span>
            </div>
          );
        })}
        {apps.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.2)' }}>No deployments yet</div>}
      </div>
    </div>
  );
}
