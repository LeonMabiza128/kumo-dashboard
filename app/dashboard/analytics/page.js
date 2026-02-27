'use client';
import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  var [apps, setApps] = useState([]);
  useEffect(function() {
    fetch('/api/projects').then(function(r) { return r.json(); }).then(function(d) { setApps(Array.isArray(d) ? d : []); });
  }, []);
  var live = apps.filter(function(a) { return (a.status || '').toLowerCase().includes('running'); }).length;
  var stats = [
    { label: 'Total Projects', value: apps.length + '', icon: '\uD83D\uDCC1' },
    { label: 'Live Sites', value: live + '', icon: '\uD83D\uDE80' },
    { label: 'Server', value: '154.66.198.81', icon: '\uD83D\uDDA5\uFE0F' },
    { label: 'Region', value: 'Johannesburg', icon: '\uD83C\uDF0D' },
    { label: 'Uptime', value: '99.9%', icon: '\u2705' },
    { label: 'Build Pack', value: 'Nixpacks', icon: '\u2699\uFE0F' },
  ];
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>Analytics</h1>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 28 }}>Server and project overview</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        {stats.map(function(s) {
          return (
            <div key={s.label} style={{ padding: '22px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>{s.label}</span>
                <span style={{ fontSize: 16 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', fontFamily: "'Outfit', sans-serif" }}>{s.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
