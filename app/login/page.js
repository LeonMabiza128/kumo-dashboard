"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="kg" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#2ba8e0" /><stop offset="50%" stopColor="#3ecfb4" /><stop offset="100%" stopColor="#2ba8e0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="#0a0c10" />
      <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="url(#kg)" strokeOpacity="0.25" />
      <path d="M14 30c-2.2 0-4-1.8-4-4s1.8-4 4-4c.3 0 .6 0 .9.1C15.5 19.2 18.4 17 22 17c3.1 0 5.7 1.7 7 4.2.5-.1 1-.2 1.5-.2 3.3 0 6 2.7 6 6s-2.7 6-6 6H14z"
        fill="url(#kg)" fillOpacity="0.12" stroke="url(#kg)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M24 33V23m0 0l-3.5 3.5M24 23l3.5 3.5" stroke="url(#kg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode, email, password: pass, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#070a0e",
    }}>
      <div style={{ width: 400, padding: "44px 36px", borderRadius: 18, background: "#0e1117", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <Logo size={34} />
          <span style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "Manrope, sans-serif" }}>kumo</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 28 }}>
          {mode === "login" ? "Sign in to your dashboard" : "Create your Kumo account"}
        </p>

        {error && (
          <div style={{
            padding: "10px 14px", borderRadius: 8, marginBottom: 16,
            background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)",
            color: "#f43f5e", fontSize: 13,
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 5 }}>Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 5 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.co.za" required />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 5 }}>Password</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "13px", borderRadius: 10, border: "none", fontSize: 14.5, fontWeight: 700,
            background: loading ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #3ecfb4, #2ba8e0)",
            color: loading ? "rgba(255,255,255,0.3)" : "#070a0e",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {loading && <span className="spinner" />}
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
            style={{ color: "#3ecfb4", cursor: "pointer", fontWeight: 600 }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </span>
        </p>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.15)" }}>
          Hosted on South African infrastructure 🇿🇦
        </p>
      </div>
    </div>
  );
}
