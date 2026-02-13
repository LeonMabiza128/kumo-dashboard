"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProject() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [branch, setBranch] = useState("main");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const slug = (name || "mysite").toLowerCase().replace(/[^a-z0-9]+/g, "-");

  async function deploy() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, repository: repo, branch }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project");
      setResult(data);
      setStep(3);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 28, maxWidth: 560 }} className="animate-in">
      <button onClick={() => router.push("/dashboard")} style={{
        background: "none", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6,
        color: "rgba(255,255,255,0.5)", padding: "5px 12px", fontSize: 12, marginBottom: 24,
      }}>← Back</button>

      <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", marginBottom: 6 }}>New Project</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>Deploy from a Git repository</p>

      {/* Progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: s <= step ? "#3ecfb4" : "rgba(255,255,255,0.06)",
            transition: "background 0.3s",
          }} />
        ))}
      </div>

      {error && (
        <div style={{
          padding: "12px 16px", borderRadius: 8, marginBottom: 18,
          background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)",
          color: "#f43f5e", fontSize: 13,
        }}>{error}</div>
      )}

      {/* Step 1: Name */}
      {step === 1 && (
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>
            Project Name
          </label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="My Awesome Website" autoFocus
            style={{ fontSize: 16, padding: "14px 16px" }} />
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 8 }}>
            Your site will be available at <span style={{ color: "#3ecfb4" }}>{slug}.getkumo.org</span>
          </p>
          <button onClick={() => setStep(2)} disabled={!name.trim()} style={{
            width: "100%", padding: "14px", borderRadius: 10, border: "none", fontSize: 14.5, fontWeight: 700,
            background: name.trim() ? "linear-gradient(135deg, #3ecfb4, #2ba8e0)" : "rgba(255,255,255,0.05)",
            color: name.trim() ? "#070a0e" : "rgba(255,255,255,0.2)",
            marginTop: 24,
          }}>Continue →</button>
        </div>
      )}

      {/* Step 2: Repository */}
      {step === 2 && (
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>
            Repository URL
          </label>
          <input value={repo} onChange={e => setRepo(e.target.value)}
            placeholder="https://github.com/username/repo" autoFocus
            style={{ marginBottom: 16 }} />

          <label style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.6)", display: "block", marginBottom: 8 }}>
            Branch
          </label>
          <input value={branch} onChange={e => setBranch(e.target.value)} placeholder="main" />

          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <button onClick={() => setStep(1)} style={{
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

      {/* Step 3: Success */}
      {step === 3 && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{
            width: 60, height: 60, borderRadius: "50%", margin: "0 auto 18px",
            background: "rgba(62,207,180,0.1)", border: "1px solid rgba(62,207,180,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
          }}>🚀</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "Manrope, sans-serif", marginBottom: 8 }}>
            {name} is deploying!
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 28 }}>
            Your project has been created and deployment has started.
          </p>
          <button onClick={() => router.push("/dashboard")} style={{
            width: "100%", padding: "14px", borderRadius: 10, border: "none", fontSize: 14.5, fontWeight: 700,
            background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)", color: "#070a0e",
          }}>Go to Dashboard</button>
        </div>
      )}
    </div>
  );
}
