"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function StatusBadge({ status }) {
  const s = (status || '').toLowerCase();
  const cfg = {
    running: { c: "#22c55e", bg: "rgba(34,197,94,0.1)", l: "Live" },
    building: { c: "#f59e0b", bg: "rgba(245,158,11,0.1)", l: "Building" },
    stopped: { c: "#f43f5e", bg: "rgba(244,63,94,0.1)", l: "Stopped" },
    exited: { c: "#f43f5e", bg: "rgba(244,63,94,0.1)", l: "Failed" },
  };
  const d = cfg[s] || { c: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.05)", l: s || "Unknown" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
      background: d.bg, color: d.c,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: d.c,
        animation: s === "building" ? "pulse 1.5s ease infinite" : "none",
      }} />
      {d.l}
    </span>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(d => { setProjects(d.projects || []); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const liveCount = projects.filter(p => p.status === 'running').length;

  return (
    <div style={{ padding: 28 }} className="animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", letterSpacing: "-0.5px" }}>Projects</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 4 }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} · {liveCount} live
          </p>
        </div>
        <button onClick={() => router.push("/dashboard/new")} style={{
          padding: "10px 22px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700,
          background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)", color: "#070a0e",
        }}>+ New Project</button>
      </div>

      {error && (
        <div style={{
          padding: "14px 18px", borderRadius: 10, marginBottom: 16,
          background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)",
          color: "#f43f5e", fontSize: 13,
        }}>
          Could not connect to server: {error}
          <br /><span style={{ fontSize: 12, opacity: 0.7 }}>Make sure COOLIFY_API_URL and COOLIFY_API_TOKEN are set in your .env.local</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
          <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
        </div>
      ) : projects.length === 0 ? (
        <div style={{
          padding: 60, borderRadius: 14, border: "1px dashed rgba(255,255,255,0.08)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>☁️</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, fontFamily: "Manrope, sans-serif" }}>No projects yet</h3>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 20 }}>
            Deploy your first app from a Git repository
          </p>
          <button onClick={() => router.push("/dashboard/new")} style={{
            padding: "12px 28px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 700,
            background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)", color: "#070a0e",
          }}>+ New Project</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {projects.map(p => (
            <div key={p.uuid}
              onClick={() => router.push(`/dashboard/project/${p.uuid}`)}
              style={{
                padding: "18px 22px", borderRadius: 12, cursor: "pointer",
                background: "#0e1117", border: "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.15s",
              }}
              onMouseOver={e => { e.currentTarget.style.background = "#131820"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              onMouseOut={e => { e.currentTarget.style.background = "#0e1117"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: "linear-gradient(135deg, rgba(62,207,180,0.1), rgba(43,168,224,0.08))",
                    border: "1px solid rgba(62,207,180,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, fontWeight: 700, color: "#3ecfb4",
                  }}>{(p.name || '?')[0].toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: "#fff" }}>{p.name || 'Unnamed'}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>
                      {p.fqdn ? p.fqdn.replace('https://', '').replace('http://', '') : 'No domain set'}
                    </div>
                  </div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div style={{ display: "flex", gap: 20, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                <span>{p.framework}</span>
                <span>{p.branch}</span>
                {p.repository && <span>{p.repository.split('/').slice(-1)[0]}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
