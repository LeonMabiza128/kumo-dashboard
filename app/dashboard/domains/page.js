"use client";
import { useState, useEffect } from "react";

export default function DomainsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(d => { setProjects((d.projects || []).filter(p => p.fqdn)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 28 }} className="animate-in">
      <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", marginBottom: 6 }}>Domains</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24 }}>Manage domains across your projects</p>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} /></div>
      ) : projects.length === 0 ? (
        <div style={{ padding: 50, borderRadius: 14, border: "1px dashed rgba(255,255,255,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🌐</div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>No domains configured yet. Add a domain in your project settings.</p>
        </div>
      ) : projects.map(p => (
        <div key={p.uuid} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px", borderRadius: 10, background: "#0e1117",
          border: "1px solid rgba(255,255,255,0.06)", marginBottom: 8,
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", fontFamily: "JetBrains Mono, monospace" }}>
              {p.fqdn.replace('https://', '').replace('http://', '')}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>→ {p.name}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {p.fqdn.startsWith('https') && (
              <span style={{
                display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600,
                color: "#22c55e", background: "rgba(34,197,94,0.08)", padding: "3px 10px", borderRadius: 100,
              }}>🔒 SSL</span>
            )}
            <span style={{
              padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
              background: p.status === 'running' ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)",
              color: p.status === 'running' ? "#22c55e" : "rgba(255,255,255,0.3)",
            }}>{p.status === 'running' ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
