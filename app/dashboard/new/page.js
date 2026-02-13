"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function NewProject() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appUuid, setAppUuid] = useState(null);
  const [deployStatus, setDeployStatus] = useState("starting");
  const [logs, setLogs] = useState([]);
  const logsRef = useRef(null);

  const slug = (name || "mysite").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  useEffect(() => {
    if (!appUuid || step !== 3) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/projects/" + appUuid);
        const data = await res.json();
        const status = data.application?.status || "";
        if (status.includes("running")) {
          setDeployStatus("live");
          clearInterval(interval);
        } else if (status.includes("exited")) {
          setDeployStatus("failed");
        }
        const logRes = await fetch("/api/projects/" + appUuid + "?action=logs");
        const logData = await logRes.json();
        if (logData.logs) {
          var lines = typeof logData.logs === "string" ? logData.logs.split("\n").filter(Boolean) : [];
          if (lines.length > 0) setLogs(lines);
        }
        const depRes = await fetch("/api/projects/" + appUuid + "?action=deployments");
        const depData = await depRes.json();
        if (depData.deployments?.length > 0) {
          var latest = depData.deployments[0];
          if (latest.status === "finished") { setDeployStatus("live"); clearInterval(interval); }
          else if (latest.status === "failed") { setDeployStatus("failed"); clearInterval(interval); }
        }
      } catch (e) { console.log("Poll error:", e); }
    }, 3000);
    return () => clearInterval(interval);
  }, [appUuid, step]);

  useEffect(() => {
    if (logsRef.current) logsRef.current.scrollTop = logsRef.current.scrollHeight;
  }, [logs]);

  async function deploy() {
    setLoading(true);
    setError("");
    setLogs(["Initializing project...", "Creating " + name + "..."]);
    try {
      var res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, repository: repo, branch: branch }),
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");
      setAppUuid(data.application?.uuid);
      setLogs(function(prev) { return prev.concat(["Project created!", "Build triggered...", "Waiting for build output..."]); });
      setStep(3);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  var statusConfig = {
    starting: { icon: "⏳", label: "Starting build...", color: "#f59e0b" },
    building: { icon: "🔨", label: "Building...", color: "#f59e0b" },
    live: { icon: "✅", label: "Deployed!", color: "#22c55e" },
    failed: { icon: "❌", label: "Build failed", color: "#f43f5e" },
  };
  var sc = statusConfig[deployStatus] || statusConfig.starting;

  return (
    <div style={{ padding: 28, maxWidth: 680 }} className="animate-in">
      <button onClick={function() { router.push("/dashboard"); }} style={{
        background: "none", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6,
        color: "rgba(255,255,255,0.5)", padding: "5px 12px", fontSize: 12, marginBottom: 24,
      }}>← Back</button>

      <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", marginBottom: 6 }}>New Project</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>Deploy from a Git repository</p>

      <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
        {[1, 2, 3].map(function(s) {
          return <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? "#3ecfb4" : "rgba(255,255,255,0.06)", transition: "background 0.3s" }} />;
        })}
      </div>

      {error && (
        <div style={{ padding: "12px 16px", borderRadius: 8, marginBottom: 18, background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)", color: "#f43f5e", fontSize: 13 }}>{error}</div>
      )}

      {step === 1 && (
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>Project Name</label>
          <input value={name} onChange={function(e) { setName(e.target.value); }} placeholder="My Awesome Website" autoFocus style={{ fontSize: 16, padding: "14px 16px" }} />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
            Your site will be available at <span style={{ color: "#3ecfb4" }}>{slug}.getkumo.org</span>
          </p>
          <button onClick={function() { setStep(2); }} disabled={!name.trim()} style={{
            width: "100%", padding: "14px", borderRadius: 10, border: "none", fontSize: 14.5, fontWeight: 700,
            background: name.trim() ? "linear-gradient(135deg, #3ecfb4, #2ba8e0)" : "rgba(255,255,255,0.05)",
            color: name.trim() ? "#070a0e" : "rgba(255,255,255,0.2)", marginTop: 24,
          }}>Continue →</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>Repository URL</label>
          <input value={repo} onChange={function(e) { setRepo(e.target.value); }} placeholder="https://github.com/username/repo" autoFocus style={{ marginBottom: 16 }} />
          <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>Branch</label>
          <input value={branch} onChange={function(e) { setBranch(e.target.value); }} placeholder="main" />
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={function() { setStep(1); }} style={{
              flex: 1, padding: "13px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)",
              background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600,
            }}>← Back</button>
            <button onClick={deploy} disabled={!repo.trim() || loading} style={{
              flex: 2, padding: "13px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 700,
              background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #3ecfb4, #2ba8e0)",
              color: loading ? "rgba(255,255,255,0.3)" : "#070a0e",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading && <span className="spinner" style={{ width: 14, height: 14 }} />}
              {loading ? "Creating..." : "Deploy →"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
            padding: "14px 18px", borderRadius: 10,
            background: sc.color + "10", border: "1px solid " + sc.color + "25",
          }}>
            <span style={{ fontSize: 20 }}>{sc.icon}</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: sc.color }}>{sc.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{name}</div>
            </div>
            {deployStatus === "starting" && (
              <span className="spinner" style={{ marginLeft: "auto", width: 16, height: 16, borderColor: sc.color + "30", borderTopColor: sc.color }} />
            )}
          </div>

          <div style={{ background: "#0a0c10", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
            <div style={{
              padding: "8px 14px", background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {["#ff5f57", "#febc2e", "#28c840"].map(function(c) {
                return <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.6 }} />;
              })}
              <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>
                {"build — " + name}
              </span>
            </div>
            <div ref={logsRef} style={{ padding: 16, height: 300, overflow: "auto", fontFamily: "JetBrains Mono, monospace", fontSize: 12, lineHeight: 1.8 }}>
              {logs.map(function(line, i) {
                return (
                  <div key={i} style={{ color: line.includes("error") || line.includes("Error") ? "#f43f5e" : "rgba(255,255,255,0.5)" }}>
                    <span style={{ color: "rgba(255,255,255,0.15)", marginRight: 8 }}>{String(i + 1).padStart(2, "0")}</span>
                    {line}
                  </div>
                );
              })}
              {deployStatus === "starting" && (
                <div style={{ color: "#f59e0b", animation: "pulse 1.5s ease infinite" }}>
                  <span style={{ color: "rgba(255,255,255,0.15)", marginRight: 8 }}>{String(logs.length + 1).padStart(2, "0")}</span>
                  Waiting for build output...
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button onClick={function() { router.push("/dashboard"); }} style={{
              flex: 1, padding: "13px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)",
              background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600,
            }}>Go to Dashboard</button>
            {deployStatus === "live" && appUuid && (
              <button onClick={function() { router.push("/dashboard/project/" + appUuid); }} style={{
                flex: 2, padding: "13px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 700,
                background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)", color: "#070a0e",
              }}>View Project →</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
