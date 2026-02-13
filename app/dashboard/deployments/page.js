"use client";
import { useState, useEffect } from "react";

export default function DeploymentsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(d => { setProjects(d.projects || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 28 }} className="animate-in">
      <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", marginBottom: 6 }}>Deployments</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24 }}>Recent deployments across all projects</p>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} /></div>
      ) : projects.length === 0 ? (
        <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 40 }}>No deployments yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {projects.map(p => (
            <div key={p.uuid} style={{
              display: "flex", alignItems: "center", padding: "16px 20px",
              borderRadius: 10, background: "#0e1117", border: "1px solid rgba(255,255,255,0.06)", gap: 14,
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                background: p.status === 'running' ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                color: p.status === 'running' ? "#22c55e" : "#f59e0b",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor" }} />
                {p.status === 'running' ? 'Live' : p.status || 'Unknown'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{p.branch} · {p.framework}</div>
              </div>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", fontFamily: "JetBrains Mono, monospace" }}>
                {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
