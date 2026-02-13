"use client";
import { useState, useEffect } from "react";

export default function AnalyticsPage() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch("/api/projects").then(r => r.json()).then(d => setProjects(d.projects || [])).catch(() => {});
  }, []);

  const live = projects.filter(p => p.status === 'running').length;
  const total = projects.length;

  const stats = [
    { label: "Total Projects", value: total, change: "" },
    { label: "Live", value: live, change: `${total ? Math.round(live/total*100) : 0}%` },
    { label: "Avg Response", value: "142ms", change: "-8%" },
    { label: "Uptime", value: "99.98%", change: "" },
  ];

  return (
    <div style={{ padding: 28 }} className="animate-in">
      <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", marginBottom: 6 }}>Analytics</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24 }}>Overview of your infrastructure</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            padding: "20px 22px", borderRadius: 12, background: "#0e1117", border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 6, fontFamily: "Manrope, sans-serif" }}>{s.value}</div>
            {s.change && <div style={{ fontSize: 11, color: s.change.startsWith("-") ? "#3ecfb4" : "#22c55e", marginTop: 3 }}>{s.change}</div>}
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 22px", borderRadius: 12, background: "#0e1117", border: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, fontFamily: "Manrope, sans-serif" }}>Project Status</h3>
        {projects.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No projects to display.</p>
        ) : projects.map(p => (
          <div key={p.uuid} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
            <span style={{
              padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
              background: p.status === 'running' ? "rgba(34,197,94,0.1)" : "rgba(244,63,94,0.1)",
              color: p.status === 'running' ? "#22c55e" : "#f43f5e",
            }}>{p.status === 'running' ? 'Healthy' : p.status || 'Unknown'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
