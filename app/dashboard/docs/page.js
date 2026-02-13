"use client";

const GUIDES = [
  { icon: "🚀", title: "Quick Start", desc: "Deploy your first project in under 2 minutes", steps: [
    "Click '+ New Project' in the sidebar",
    "Enter your project name",
    "Paste your GitHub repository URL",
    "Click Deploy — that's it!",
  ]},
  { icon: "🌐", title: "Custom Domain", desc: "Point your domain to Kumo", steps: [
    "Add an A record in your DNS pointing to 154.66.198.81",
    "Go to your Project → Settings",
    "Enter your domain with https:// prefix",
    "Save — SSL is issued automatically in 2-3 minutes",
  ]},
  { icon: "🗃️", title: "Databases", desc: "Set up a database for your app", steps: [
    "Go to Databases → + New Database",
    "Choose PostgreSQL, MySQL, MongoDB, or Redis",
    "Give it a name and click Create",
    "Copy the connection string to your app's environment variables",
  ]},
  { icon: "🔄", title: "Auto Deploy", desc: "Deploy on every git push", steps: [
    "Your app auto-deploys when you push to the configured branch",
    "Every push triggers a new build",
    "Preview branches get their own unique URLs",
    "Monitor builds in the Deployments tab",
  ]},
  { icon: "🔐", title: "SSL & HTTPS", desc: "Free SSL for every project", steps: [
    "SSL certificates are issued automatically via Let's Encrypt",
    "No configuration needed — just set your domain with https://",
    "Certificates auto-renew before expiry",
    "All traffic is encrypted end-to-end",
  ]},
  { icon: "📊", title: "Monitoring", desc: "Keep an eye on your apps", steps: [
    "Check Analytics for overview stats",
    "View real-time logs in Project → Logs tab",
    "Status badges show live/building/failed at a glance",
    "Server health is visible in Settings",
  ]},
];

export default function DocsPage() {
  return (
    <div style={{ padding: 28 }} className="animate-in">
      <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "Manrope, sans-serif", marginBottom: 6 }}>Documentation</h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>Everything you need to get started with Kumo</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
        {GUIDES.map(g => (
          <div key={g.title} style={{
            padding: "22px 24px", borderRadius: 12, background: "#0e1117",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{g.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "Manrope, sans-serif" }}>{g.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{g.desc}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {g.steps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  <span style={{ color: "#3ecfb4", fontSize: 12, fontWeight: 700, flexShrink: 0, width: 16 }}>{i + 1}.</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
