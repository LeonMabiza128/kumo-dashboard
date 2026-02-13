"use client";
import { useState, useEffect } from "react";

export default function DatabasesPage() {
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [dbType, setDbType] = useState("postgresql");
  const [dbName, setDbName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/databases")
      .then(r => r.json())
      .then(d => { setDatabases(d.databases || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function createDb() {
    setCreating(true);
    try {
      const res = await fetch("/api/databases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: dbType, name: dbName }),
      });
      if (res.ok) {
        setShowNew(false);
        setDbName("");
        // Refresh
        const d = await fetch("/api/databases").then(r => r.json());
        setDatabases(d.databases || []);
      }
    } catch (err) { console.error(err); }
    setCreating(false);
  }

  const types = [
    { id: "postgresql", name: "PostgreSQL", icon: "🐘" },
    { id: "mysql", name: "MySQL", icon: "🐬" },
    { id: "mongodb", name: "MongoDB", icon: "🍃" },
    { id: "redis", name: "Redis", icon: "🔴" },
  ];

  return (
    <div style={{ padding: 28 }} className="animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif" }}>Databases</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 4 }}>{databases.length} database{databases.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowNew(true)} style={{
          padding: "10px 22px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700,
          background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)", color: "#070a0e",
        }}>+ New Database</button>
      </div>

      {showNew && (
        <div style={{
          padding: 24, borderRadius: 14, background: "#0e1117", border: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 20,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, fontFamily: "Manrope, sans-serif" }}>Create Database</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
            {types.map(t => (
              <div key={t.id} onClick={() => setDbType(t.id)} style={{
                padding: "14px 12px", borderRadius: 10, textAlign: "center", cursor: "pointer",
                background: dbType === t.id ? "rgba(62,207,180,0.08)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${dbType === t.id ? "rgba(62,207,180,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: dbType === t.id ? "#3ecfb4" : "rgba(255,255,255,0.5)" }}>{t.name}</div>
              </div>
            ))}
          </div>
          <input value={dbName} onChange={e => setDbName(e.target.value)} placeholder="Database name" style={{ marginBottom: 14 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowNew(false)} style={{
              padding: "10px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)",
              background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 13,
            }}>Cancel</button>
            <button onClick={createDb} disabled={creating || !dbName.trim()} style={{
              padding: "10px 24px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 700,
              background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)", color: "#070a0e",
            }}>{creating ? "Creating..." : "Create"}</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} /></div>
      ) : databases.length === 0 && !showNew ? (
        <div style={{ padding: 60, borderRadius: 14, border: "1px dashed rgba(255,255,255,0.08)", textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🗃️</div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 16 }}>No databases yet</p>
          <button onClick={() => setShowNew(true)} style={{
            padding: "10px 24px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700,
            background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)", color: "#070a0e",
          }}>Create your first database</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {databases.map((db, i) => (
            <div key={db.uuid || i} style={{
              padding: "16px 20px", borderRadius: 10, background: "#0e1117",
              border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ fontSize: 20 }}>{types.find(t => db.type?.includes(t.id))?.icon || "🗃️"}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{db.name || 'Database'}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{db.type || 'Unknown'}</div>
              </div>
              <span style={{
                padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                background: "rgba(34,197,94,0.1)", color: "#22c55e",
              }}>Running</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
