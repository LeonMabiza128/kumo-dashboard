'use client';
import { useState, useEffect } from 'react';

export default function DomainsPage() {
  var [apps, setApps] = useState([]);
  useEffect(function() {
    fetch('/api/projects').then(function(r) { return r.json(); }).then(function(d) { setApps(Array.isArray(d) ? d.filter(function(a) { return a.fqdn; }) : []); });
  }, []);
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>Domains</h1>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 24 }}>{apps.length} domain{apps.length !== 1 ? 's' : ''} configured</p>
      {apps.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, borderRadius: 16, border: '1px dashed rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>{'\uD83C\uDF10'}</div>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>Deploy a project to see domains here</p>
        </div>
      ) : apps.map(function(a) {
        var domain = (a.fqdn || '').replace('https://', '').replace('http://', '');
        return (
          <div key={a.uuid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>{domain}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 3 }}>{'\u2192'} {a.name}</div>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: '#34d399', background: 'rgba(52,211,153,0.06)', padding: '4px 12px', borderRadius: 6, border: '1px solid rgba(52,211,153,0.1)' }}>{'\uD83D\uDD12'} SSL</span>
          </div>
        );
      })}
    </div>
  );
}
