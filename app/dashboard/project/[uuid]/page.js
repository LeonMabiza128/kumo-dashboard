"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

function StatusBadge({ status }) {
  const s = (status || '').toLowerCase();
  const cfg = {
    running: { c: "#22c55e", bg: "rgba(34,197,94,0.1)", l: "Live" },
    building: { c: "#f59e0b", bg: "rgba(245,158,11,0.1)", l: "Building" },
    stopped: { c: "#f43f5e", bg: "rgba(244,63,94,0.1)", l: "Stopped" },
    exited: { c: "#f43f5e", bg: "rgba(244,63,94,0.1)", l: "Failed" },
    queued: { c: "#f59e0b", bg: "rgba(245,158,11,0.1)", l: "Queued" },
  };
  const d = cfg[s] || { c: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.05)", l: s || "Unknown" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
      background: d.bg, color: d.c,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: d.c }} />
      {d.l}
    </span>
  );
}

export default function ProjectDetail() {
  const router = useRouter();
  const params = useParams();
  const uuid = params.uuid;

  const [app, setApp] = useState(null);
  const [tab, setTab] = useState("preview");
  const [device, setDevice] = useState("desktop");
  const [deployments, setDeployments] = useState([]);
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fqdn, setFqdn] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchApp();
  }, [uuid]);

  useEffect(() => {
    if (tab === "deployments") fetchDeployments();
    if (tab === "logs") fetchLogs();
  }, [tab]);

  async function fetchApp() {
    try {
      const res = await fetch(`/api/projects/${uuid}`);
      const data = await res.json();
      setApp(data.application);
      setFqdn(data.application?.fqdn || '');
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  async function fetchDeployments() {
    try {
      const res = await fetch(`/api/projects/${uuid}?action=deployments`);
      const data = await res.json();
      setDeployments(Array.isArray(data.deployments) ? data.deployments : []);
    } catch { setDeployments([]); }
  }

  async function fetchLogs() {
    try {
      const res = await fetch(`/api/projects/${uuid}?action=logs`);
      const data = await res.json();
      setLogs(typeof data.logs === 'string' ? data.logs : JSON.stringify(data.logs, null, 2));
    } catch { setLogs("Could not fetch logs"); }
  }

  async function deploy() {
    setDeploying(true);
    try {
      await fetch(`/api/projects/${uuid}`, { method: "POST" });
      setMsg("Deployment started!");
      setTimeout(() => { fetchApp(); fetchDeployments(); setMsg(""); }, 3000);
    } catch (err) { setMsg("Deploy failed: " + err.message); }
    setDeploying(false);
  }

  async function save() {
    setSaving(true);
    try {
      await fetch(`/api/projects/${uuid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fqdn }),
      });
      setMsg("Settings saved!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) { setMsg("Save failed: " + err.message); }
    setSaving(false);
  }

  async function deleteApp() {
    if (!confirm("Are you sure? This will permanently delete this project.")) return;
    try {
      await fetch(`/api/projects/${uuid}`, { method: "DELETE" });
      router.push("/dashboard");
    } catch (err) { setMsg("Delete failed: " + err.message); }
  }

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
      <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
    </div>
  );

  if (!app) return (
    <div style={{ padding: 28 }}>
      <p style={{ color: "rgba(255,255,255,0.5)" }}>Project not found.</p>
      <button onClick={() => router.push("/dashboard")} style={{
        marginTop: 12, padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)",
        background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 13,
      }}>← Back</button>
    </div>
  );

  const siteUrl = app.fqdn || '';
  const cleanUrl = siteUrl.replace('https://', '').replace('http://', '');
  const widths = { desktop: "100%", tablet: "768px", mobile: "375px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }} className="animate-in">
      {/* Top bar */}
      <div style={{
        padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => router.push("/dashboard")} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6,
            color: "rgba(255,255,255,0.5)", padding: "5px 12px", fontSize: 12,
          }}>← Back</button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>{app.name || 'Unnamed'}</span>
              <StatusBadge status={app.status} />
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace", marginTop: 2 }}>
              {cleanUrl || 'No domain'}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {msg && <span style={{ fontSize: 12, color: "#3ecfb4" }}>{msg}</span>}
          {siteUrl && (
            <a href={siteUrl} target="_blank" rel="noopener" style={{
              padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: "rgba(62,207,180,0.08)", color: "#3ecfb4", textDecoration: "none",
              border: "1px solid rgba(62,207,180,0.15)",
            }}>Visit ↗</a>
          )}
          <button onClick={deploy} disabled={deploying} style={{
            padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 700,
            background: deploying ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #3ecfb4, #2ba8e0)",
            color: deploying ? "rgba(255,255,255,0.3)" : "#070a0e", border: "none",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            {deploying && <span className="spinner" style={{ width: 12, height: 12 }} />}
            {deploying ? "Deploying..." : "Redeploy"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", flexShrink: 0 }}>
        {["preview", "deployments", "logs", "settings"].map(t => (
          <div key={t} onClick={() => setTab(t)} style={{
            padding: "11px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            color: tab === t ? "#3ecfb4" : "rgba(255,255,255,0.4)",
            borderBottom: tab === t ? "2px solid #3ecfb4" : "2px solid transparent",
            textTransform: "capitalize", transition: "all 0.15s",
          }}>{t}</div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 24 }}>

        {/* PREVIEW TAB */}
        {tab === "preview" && (
          <div>
            <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "rgba(255,255,255,0.03)", padding: 3, borderRadius: 8, width: "fit-content" }}>
              {["desktop", "tablet", "mobile"].map(d => (
                <button key={d} onClick={() => setDevice(d)} style={{
                  padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                  border: "none", textTransform: "capitalize",
                  background: device === d ? "rgba(62,207,180,0.12)" : "transparent",
                  color: device === d ? "#3ecfb4" : "rgba(255,255,255,0.25)",
                }}>{d === "desktop" ? "🖥 Desktop" : d === "tablet" ? "📱 Tablet" : "📲 Mobile"}</button>
              ))}
            </div>

            {siteUrl ? (
              <div style={{
                width: widths[device], maxWidth: "100%", margin: "0 auto",
                borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)",
                background: "#111", height: "calc(100vh - 240px)", minHeight: 400,
                transition: "width 0.3s ease",
              }}>
                <div style={{
                  padding: "8px 14px", background: "rgba(255,255,255,0.03)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  {["#ff5f57", "#febc2e", "#28c840"].map(c => (
                    <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.6 }} />
                  ))}
                  <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>
                    {cleanUrl}
                  </span>
                </div>
                <iframe
                  src={siteUrl}
                  style={{ width: "100%", height: "calc(100% - 36px)", border: "none", background: "#fff" }}
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            ) : (
              <div style={{
                padding: 60, borderRadius: 14, border: "1px dashed rgba(255,255,255,0.08)",
                textAlign: "center",
              }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🌐</div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                  No domain configured. Add one in Settings to enable preview.
                </p>
              </div>
            )}
          </div>
        )}

        {/* DEPLOYMENTS TAB */}
        {tab === "deployments" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {deployments.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, textAlign: "center", padding: 40 }}>
                No deployments yet. Click Redeploy to start one.
              </p>
            ) : deployments.map((d, i) => (
              <div key={d.uuid || i} style={{
                display: "flex", alignItems: "center", padding: "14px 18px",
                borderRadius: 10, background: "#0e1117", border: "1px solid rgba(255,255,255,0.06)", gap: 14,
              }}>
                <StatusBadge status={d.status} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>
                    {d.commit_message || d.status || 'Deployment'}
                  </div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)" }}>
                    {d.git_branch || 'main'} · {d.created_at ? new Date(d.created_at).toLocaleString() : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOGS TAB */}
        {tab === "logs" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>Application Logs</span>
              <button onClick={fetchLogs} style={{
                padding: "6px 14px", borderRadius: 6, fontSize: 11, fontWeight: 600, border: "1px solid rgba(255,255,255,0.06)",
                background: "transparent", color: "rgba(255,255,255,0.4)",
              }}>Refresh</button>
            </div>
            <pre style={{
              background: "#0a0c10", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: 18, fontSize: 12, lineHeight: 1.7,
              fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.6)",
              overflow: "auto", maxHeight: "calc(100vh - 280px)", minHeight: 300,
              whiteSpace: "pre-wrap", wordBreak: "break-all",
            }}>
              {logs || "No logs available. Deploy the application first."}
            </pre>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div style={{ maxWidth: 520 }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Project Name</label>
              <input defaultValue={app.name || ''} readOnly style={{ opacity: 0.6 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Domain (FQDN)</label>
              <input value={fqdn} onChange={e => setFqdn(e.target.value)} placeholder="https://myapp.getkumo.org" />
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>Include https:// — SSL is automatic</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Repository</label>
              <input defaultValue={app.git_repository || ''} readOnly style={{ opacity: 0.6 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Branch</label>
              <input defaultValue={app.git_branch || 'main'} readOnly style={{ opacity: 0.6 }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>Build Pack</label>
              <input defaultValue={app.build_pack || 'nixpacks'} readOnly style={{ opacity: 0.6 }} />
            </div>

            <button onClick={save} disabled={saving} style={{
              padding: "12px 28px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700,
              background: saving ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #3ecfb4, #2ba8e0)",
              color: saving ? "rgba(255,255,255,0.3)" : "#070a0e",
            }}>{saving ? "Saving..." : "Save Changes"}</button>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, marginTop: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f43f5e", marginBottom: 8 }}>Danger Zone</h3>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>This will permanently delete the project and all deployments.</p>
              <button onClick={deleteApp} style={{
                padding: "10px 22px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: "rgba(244,63,94,0.08)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)",
              }}>Delete Project</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
