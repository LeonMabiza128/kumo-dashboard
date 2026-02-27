'use client';

var DOCS = [
  { title: 'Getting Started', desc: 'Create your first project and deploy it in under 60 seconds', icon: '\uD83D\uDE80', tag: 'Start here' },
  { title: 'AI Builder', desc: 'Use AI to generate complete websites from a text description', icon: '\u26A1', tag: 'Popular' },
  { title: 'Custom Domains', desc: 'Connect your own domain with automatic SSL certificates', icon: '\uD83C\uDF10', tag: null },
  { title: 'Git Integration', desc: 'Import and auto-deploy from any public GitHub repository', icon: '\uD83D\uDCC1', tag: null },
  { title: 'Databases', desc: 'Set up PostgreSQL, MySQL, MongoDB, or Redis instances', icon: '\uD83D\uDDC3\uFE0F', tag: null },
  { title: 'Environment Variables', desc: 'Manage secrets and configuration for your applications', icon: '\uD83D\uDD10', tag: null },
];

export default function DocsPage() {
  return (
    <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>
      <style>{`
        .doc-card { padding: 22px; border-radius: 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: all 0.2s ease; position: relative; overflow: hidden; }
        .doc-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.3); }
      `}</style>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 4 }}>Documentation</h1>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, marginBottom: 28 }}>Guides, tutorials, and API reference</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
        {DOCS.map(function(d) {
          return (
            <div key={d.title} className="doc-card">
              {d.tag && <span style={{ position: 'absolute', top: 14, right: 14, fontSize: 10, fontWeight: 700, color: '#38bda8', background: 'rgba(56,189,168,0.08)', padding: '2px 8px', borderRadius: 5, border: '1px solid rgba(56,189,168,0.1)' }}>{d.tag}</span>}
              <div style={{ fontSize: 28, marginBottom: 14 }}>{d.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.3px' }}>{d.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>{d.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
