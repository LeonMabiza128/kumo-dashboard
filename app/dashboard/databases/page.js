'use client';
import { useState, useEffect } from 'react';

export default function DatabasesPage() {
  var [dbs, setDbs] = useState([]);
  useEffect(function() {
    fetch('/api/databases').then(function(r) { return r.json(); }).then(function(d) { setDbs(Array.isArray(d) ? d : []); });
  }, []);
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>Databases</h1>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 24 }}>Manage your database instances</p>
      {dbs.length === 0 ? (
        <div style={{ padding: '60px 40px', borderRadius: 16, border: '1px dashed rgba(255,255,255,0.06)', textAlign: 'center', background: 'rgba(255,255,255,0.01)' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 16px' }}>{'\uD83D\uDDC3\uFE0F'}</div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>No databases yet</h3>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>Create databases from the Coolify admin panel</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {dbs.map(function(db, i) {
            return <div key={i} style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{db.name || 'Database'}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>{db.type || 'PostgreSQL'}</div>
            </div>;
          })}
        </div>
      )}
    </div>
  );
}
