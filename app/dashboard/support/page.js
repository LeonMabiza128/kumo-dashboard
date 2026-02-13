"use client";
import { useState } from "react";

const INITIAL = [
  { id: 1, from: "support", text: "Welcome to Kumo Support! 👋 How can we help you today?", time: "Now" },
];

export default function SupportPage() {
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), from: "user", text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(m => [...m, userMsg]);
    const q = input;
    setInput("");

    // Auto-reply logic
    setTimeout(() => {
      let reply = "Thanks for reaching out! A team member will get back to you shortly.";
      const lower = q.toLowerCase();
      if (lower.includes("deploy") || lower.includes("build")) {
        reply = "For deployment issues, check that your repository URL is correct and the branch exists. You can also check the Logs tab in your project for build errors. Need more help?";
      } else if (lower.includes("domain") || lower.includes("ssl") || lower.includes("https")) {
        reply = "To add a domain, go to your Project → Settings → Domain field. Enter it with https:// prefix. SSL certificates are issued automatically within 2-3 minutes. Make sure your DNS A record points to 154.66.198.81.";
      } else if (lower.includes("database") || lower.includes("postgres") || lower.includes("mysql")) {
        reply = "You can create databases from the Databases page. We support PostgreSQL, MySQL, MongoDB, and Redis. Each database gets its own connection string you can use in your app's environment variables.";
      } else if (lower.includes("price") || lower.includes("plan") || lower.includes("billing")) {
        reply = "Our plans start from Free (1 project) up to Government (unlimited). Visit getkumo.org for full pricing. Need a custom plan? Let us know!";
      }
      setMessages(m => [...m, {
        id: Date.now(), from: "support", text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1200);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }} className="animate-in">
      <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, fontFamily: "Manrope, sans-serif" }}>Support</h1>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>We typically reply within 5 minutes</p>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map(m => (
          <div key={m.id} style={{ alignSelf: m.from === "user" ? "flex-end" : "flex-start", maxWidth: "70%" }}>
            <div style={{
              padding: "11px 16px", borderRadius: 14, fontSize: 13.5, lineHeight: 1.65,
              background: m.from === "user" ? "rgba(62,207,180,0.1)" : "rgba(255,255,255,0.04)",
              color: m.from === "user" ? "#3ecfb4" : "rgba(255,255,255,0.8)",
              borderBottomRightRadius: m.from === "user" ? 4 : 14,
              borderBottomLeftRadius: m.from === "user" ? 14 : 4,
            }}>{m.text}</div>
            <div style={{
              fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 4,
              textAlign: m.from === "user" ? "right" : "left",
            }}>{m.from === "support" ? "Kumo Support · " : ""}{m.time}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask about deployments, domains, databases..."
          style={{ flex: 1, borderRadius: 10 }} />
        <button onClick={send} style={{
          padding: "10px 22px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 700,
          background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)", color: "#070a0e",
        }}>Send</button>
      </div>
    </div>
  );
}
