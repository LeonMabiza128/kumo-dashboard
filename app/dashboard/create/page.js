"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

var TEMPLATES = [
  { icon: "🍽️", label: "Restaurant", prompt: "A modern restaurant website with menu, about section, location map, and online reservation form" },
  { icon: "🏢", label: "Business", prompt: "A professional corporate website with services, team, testimonials, and contact form" },
  { icon: "🛍️", label: "Online Store", prompt: "An e-commerce landing page with featured products, categories, shopping cart icon, and newsletter signup" },
  { icon: "💼", label: "Portfolio", prompt: "A creative portfolio website with project gallery, about me, skills section, and contact form" },
  { icon: "🏥", label: "Medical", prompt: "A healthcare clinic website with services, doctor profiles, appointment booking, and patient testimonials" },
  { icon: "🎓", label: "Education", prompt: "A school or online course website with course listings, instructor profiles, pricing, and enrollment form" },
  { icon: "🏘️", label: "Real Estate", prompt: "A property listing website with featured properties, search filters, agent profiles, and contact form" },
  { icon: "⚖️", label: "Law Firm", prompt: "A professional law firm website with practice areas, attorney profiles, case results, and consultation form" },
];

var STEPS = [
  { key: "thinking", label: "Understanding your requirements...", icon: "🧠" },
  { key: "generating", label: "Generating code with AI...", icon: "⚡" },
  { key: "repo", label: "Creating repository...", icon: "📦" },
  { key: "pushing", label: "Pushing code to GitHub...", icon: "🚀" },
  { key: "deploying", label: "Deploying to Kumo...", icon: "☁️" },
  { key: "live", label: "Your site is live!", icon: "✅" },
];

export default function CreatePage() {
  var router = useRouter();
  var [prompt, setPrompt] = useState("");
  var [name, setName] = useState("");
  var [phase, setPhase] = useState("input");
  var [currentStep, setCurrentStep] = useState(0);
  var [error, setError] = useState("");
  var [result, setResult] = useState(null);

  async function generate() {
    if (!prompt.trim() || !name.trim()) return;
    setPhase("building");
    setCurrentStep(0);
    setError("");

    // Simulate step progression
    var stepTimer = setInterval(function() {
      setCurrentStep(function(s) {
        if (s < 3) return s + 1;
        return s;
      });
    }, 3000);

    try {
      var res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt, name: name }),
      });
      var data = await res.json();

      clearInterval(stepTimer);

      if (!res.ok) throw new Error(data.error || "Generation failed");

      setCurrentStep(4);
      setTimeout(function() { setCurrentStep(5); }, 2000);
      setResult(data);
      setPhase("done");
    } catch (err) {
      clearInterval(stepTimer);
      setError(err.message);
      setPhase("input");
    }
  }

  function selectTemplate(t) {
    setPrompt(t.prompt);
    if (!name) setName(t.label.toLowerCase() + "-site");
  }

  return (
    <div style={{ padding: 28, maxWidth: 720 }} className="animate-in">
      <button onClick={function() { router.push("/dashboard"); }} style={{
        background: "none", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6,
        color: "rgba(255,255,255,0.5)", padding: "5px 12px", fontSize: 12, marginBottom: 24,
      }}>← Back</button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "linear-gradient(135deg, rgba(62,207,180,0.15), rgba(43,168,224,0.1))",
          border: "1px solid rgba(62,207,180,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
        }}>⚡</div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif" }}>Create with AI</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Describe your website and we will build it</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: "12px 16px", borderRadius: 8, marginTop: 18, marginBottom: 18,
          background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)",
          color: "#f43f5e", fontSize: 13, lineHeight: 1.6,
        }}>
          {error}
        </div>
      )}

      {/* Input Phase */}
      {phase === "input" && (
        <div style={{ marginTop: 28 }}>
          {/* Templates */}
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Quick Templates
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
            {TEMPLATES.map(function(t) {
              var isActive = prompt === t.prompt;
              return (
                <div key={t.label} onClick={function() { selectTemplate(t); }} style={{
                  padding: "14px 10px", borderRadius: 10, textAlign: "center", cursor: "pointer",
                  background: isActive ? "rgba(62,207,180,0.08)" : "rgba(255,255,255,0.02)",
                  border: "1px solid " + (isActive ? "rgba(62,207,180,0.2)" : "rgba(255,255,255,0.06)"),
                  transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? "#3ecfb4" : "rgba(255,255,255,0.4)" }}>{t.label}</div>
                </div>
              );
            })}
          </div>

          {/* Project Name */}
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Project Name
          </label>
          <input value={name} onChange={function(e) { setName(e.target.value); }}
            placeholder="my-awesome-site" style={{ marginBottom: 18 }} />

          {/* Prompt */}
          <label style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Describe Your Website
          </label>
          <textarea value={prompt} onChange={function(e) { setPrompt(e.target.value); }}
            placeholder={"Describe what you want...\n\nExample: A modern coffee shop website with a warm brown color scheme, menu with prices, about us story, location with opening hours, and a contact form."}
            rows={5}
            style={{
              resize: "vertical", minHeight: 120, lineHeight: 1.6,
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 6, marginBottom: 24 }}>
            Be specific about colors, sections, and features you want. The more detail, the better.
          </p>

          <button onClick={generate} disabled={!prompt.trim() || !name.trim()} style={{
            width: "100%", padding: "16px", borderRadius: 12, border: "none", fontSize: 15, fontWeight: 700,
            background: (prompt.trim() && name.trim()) ? "linear-gradient(135deg, #3ecfb4, #2ba8e0)" : "rgba(255,255,255,0.05)",
            color: (prompt.trim() && name.trim()) ? "#070a0e" : "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            ⚡ Generate and Deploy
          </button>
        </div>
      )}

      {/* Building Phase */}
      {phase === "building" && (
        <div style={{ marginTop: 32 }}>
          <div style={{
            padding: "20px 24px", borderRadius: 14, background: "#0e1117",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2.5 }} />
              <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "Manrope, sans-serif" }}>
                Building {name}...
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {STEPS.map(function(s, i) {
                var isDone = i < currentStep;
                var isCurrent = i === currentStep;
                var isPending = i > currentStep;
                return (
                  <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", position: "relative" }}>
                    {/* Connector line */}
                    {i < STEPS.length - 1 && (
                      <div style={{
                        position: "absolute", left: 15, top: 36, width: 2, height: 24,
                        background: isDone ? "#3ecfb4" : "rgba(255,255,255,0.06)",
                        transition: "background 0.5s",
                      }} />
                    )}
                    {/* Icon */}
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16,
                      background: isDone ? "rgba(62,207,180,0.1)" : isCurrent ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.02)",
                      border: "1px solid " + (isDone ? "rgba(62,207,180,0.2)" : isCurrent ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.04)"),
                    }}>
                      {isDone ? "✓" : s.icon}
                    </div>
                    <span style={{
                      fontSize: 14, fontWeight: isCurrent ? 600 : 400,
                      color: isDone ? "#3ecfb4" : isCurrent ? "#fff" : "rgba(255,255,255,0.2)",
                      transition: "all 0.3s",
                    }}>
                      {s.label}
                    </span>
                    {isCurrent && (
                      <span className="spinner" style={{ marginLeft: "auto", width: 14, height: 14, borderWidth: 2 }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terminal preview */}
          <div style={{
            marginTop: 16, background: "#0a0c10", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 12, overflow: "hidden",
          }}>
            <div style={{
              padding: "8px 14px", background: "rgba(255,255,255,0.03)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {["#ff5f57", "#febc2e", "#28c840"].map(function(c) {
                return <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, opacity: 0.6 }} />;
              })}
              <span style={{ marginLeft: 8, fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "JetBrains Mono, monospace" }}>
                {"kumo generate — " + name}
              </span>
            </div>
            <div style={{
              padding: 16, fontFamily: "JetBrains Mono, monospace", fontSize: 12,
              lineHeight: 1.8, color: "rgba(255,255,255,0.4)", minHeight: 100,
            }}>
              <div><span style={{ color: "#3ecfb4" }}>$</span> kumo generate --name {name}</div>
              {currentStep >= 0 && <div style={{ color: "rgba(255,255,255,0.3)" }}>Analyzing prompt...</div>}
              {currentStep >= 1 && <div style={{ color: "#3ecfb4" }}>Generating Next.js application...</div>}
              {currentStep >= 2 && <div style={{ color: "#3ecfb4" }}>Creating GitHub repository...</div>}
              {currentStep >= 3 && <div style={{ color: "#3ecfb4" }}>Pushing 5 files to kumo-{name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}...</div>}
              {currentStep >= 4 && <div style={{ color: "#3ecfb4" }}>Triggering deployment on Kumo Cloud...</div>}
              {currentStep >= 5 && <div style={{ color: "#22c55e", fontWeight: 600 }}>Done! Your site is deploying.</div>}
              {currentStep < 5 && (
                <div style={{ color: "#f59e0b", animation: "pulse 1.5s ease infinite" }}>Working...</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Done Phase */}
      {phase === "done" && result && (
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <div style={{
            width: 70, height: 70, borderRadius: "50%", margin: "0 auto 20px",
            background: "rgba(62,207,180,0.1)", border: "1px solid rgba(62,207,180,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34,
          }}>🚀</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", marginBottom: 8 }}>
            {name} is deploying!
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginBottom: 8 }}>
            AI generated your website and deployment has started.
          </p>
          {result.repository && (
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 28 }}>
              Repository: <a href={result.repository} target="_blank" rel="noopener" style={{ color: "#3ecfb4" }}>{result.repository}</a>
            </p>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={function() { router.push("/dashboard"); }} style={{
              flex: 1, padding: "14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)",
              background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600,
            }}>Dashboard</button>
            {result.uuid && (
              <button onClick={function() { router.push("/dashboard/project/" + result.uuid); }} style={{
                flex: 2, padding: "14px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 700,
                background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)", color: "#070a0e",
              }}>View Project →</button>
            )}
          </div>

          <div style={{ marginTop: 24, padding: "14px 18px", borderRadius: 10, background: "rgba(62,207,180,0.04)", border: "1px solid rgba(62,207,180,0.1)", textAlign: "left" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#3ecfb4", marginBottom: 4 }}>Build in progress</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              Your site is building on Kumo Cloud. This usually takes 1-3 minutes. Check the project page for live status.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
