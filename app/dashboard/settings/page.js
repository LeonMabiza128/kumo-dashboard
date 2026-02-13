"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth").then(r => r.json()).then(d => setUser(d.user)).catch(() => {});
  }, []);

  async function logout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/login");
  }

  return (
    <div style={{ padding: 28, maxWidth: 560 }} className="animate-in">
      <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", marginBottom: 6 }}>Settings</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>Manage your account</p>

      <div style={{
        padding: 22, borderRadius: 12, background: "#0e1117", border: "1px solid rgba(255,255,255,0.06)",
        marginBottom: 16,
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: "Manrope, sans-serif" }}>Profile</h3>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 5 }}>Name</label>
          <input defaultValue={user?.name || ''} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 5 }}>Email</label>
          <input defaultValue={user?.email || ''} readOnly style={{ opacity: 0.6 }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 5 }}>Plan</label>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px",
            borderRadius: 8, background: "rgba(62,207,180,0.06)", border: "1px solid rgba(62,207,180,0.12)",
          }}>
            <span style={{ color: "#3ecfb4", fontSize: 13, fontWeight: 700 }}>Pro Plan</span>
          </div>
        </div>
        <button style={{
          padding: "10px 24px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 700,
          background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)", color: "#070a0e",
        }}>Save Profile</button>
      </div>

      <div style={{
        padding: 22, borderRadius: 12, background: "#0e1117", border: "1px solid rgba(255,255,255,0.06)",
        marginBottom: 16,
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, fontFamily: "Manrope, sans-serif" }}>Server Status</h3>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Server IP</span>
          <span style={{ fontSize: 13, fontFamily: "JetBrains Mono, monospace", color: "#fff" }}>154.66.198.81</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Location</span>
          <span style={{ fontSize: 13, color: "#fff" }}>Johannesburg, ZA 🇿🇦</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Platform</span>
          <span style={{ fontSize: 13, color: "#fff" }}>Kumo v1.0</span>
        </div>
      </div>

      <div style={{
        padding: 22, borderRadius: 12, background: "rgba(244,63,94,0.03)", border: "1px solid rgba(244,63,94,0.1)",
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: "#f43f5e" }}>Account</h3>
        <button onClick={logout} style={{
          padding: "10px 22px", borderRadius: 8, fontSize: 12, fontWeight: 600,
          background: "rgba(244,63,94,0.08)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.2)",
        }}>Sign Out</button>
      </div>
    </div>
  );
}
