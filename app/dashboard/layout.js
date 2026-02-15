"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";

var UserContext = createContext(null);
export function useUser() { return useContext(UserContext); }

function Logo(props) {
  var size = props.size || 26;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="kgl" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#2ba8e0" /><stop offset="50%" stopColor="#3ecfb4" /><stop offset="100%" stopColor="#2ba8e0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="#0a0c10" />
      <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="url(#kgl)" strokeOpacity="0.25" />
      <path d="M14 30c-2.2 0-4-1.8-4-4s1.8-4 4-4c.3 0 .6 0 .9.1C15.5 19.2 18.4 17 22 17c3.1 0 5.7 1.7 7 4.2.5-.1 1-.2 1.5-.2 3.3 0 6 2.7 6 6s-2.7 6-6 6H14z"
        fill="url(#kgl)" fillOpacity="0.12" stroke="url(#kgl)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M24 33V23m0 0l-3.5 3.5M24 23l3.5 3.5" stroke="url(#kgl)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NavItem(props) {
  var router = useRouter();
  return (
    <div onClick={function() { router.push(props.href); }} style={{
      display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
      borderRadius: 8, cursor: "pointer", fontSize: 13.5, fontWeight: 500,
      background: props.active ? "rgba(62,207,180,0.08)" : "transparent",
      color: props.active ? "#3ecfb4" : "rgba(255,255,255,0.5)",
      transition: "all 0.15s", position: "relative",
    }}>
      <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{props.icon}</span>
      {props.label}
      {props.badge && (
        <span style={{
          marginLeft: "auto", padding: "1px 7px", borderRadius: 100, fontSize: 10, fontWeight: 700,
          background: "rgba(244,63,94,0.15)", color: "#f43f5e",
        }}>{props.badge}</span>
      )}
      {props.isNew && (
        <span style={{
          marginLeft: "auto", padding: "1px 7px", borderRadius: 100, fontSize: 9, fontWeight: 700,
          background: "rgba(62,207,180,0.12)", color: "#3ecfb4",
        }}>AI</span>
      )}
    </div>
  );
}

export default function DashboardLayout(props) {
  var pathname = usePathname();
  var router = useRouter();
  var [user, setUser] = useState(null);
  var [loading, setLoading] = useState(true);

  useEffect(function() {
    fetch("/api/auth")
      .then(function(r) { return r.json(); })
      .then(function(d) { setUser(d.user); setLoading(false); })
      .catch(function() { router.push("/login"); });
  }, []);

  async function logout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/login");
  }

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#070a0e" }}>
        <div className="spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
      </div>
    );
  }

  var initials = user?.name ? user.name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase() : 'K';

  return (
    <UserContext.Provider value={user}>
      <div style={{ display: "flex", height: "100vh", background: "#070a0e" }}>
        {/* Sidebar */}
        <div style={{
          width: 230, background: "#0a0d12", borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex", flexDirection: "column", padding: "16px 12px", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "4px 8px", marginBottom: 24 }}>
            <Logo />
            <span style={{ fontSize: 17, fontWeight: 700, fontFamily: "Manrope, sans-serif" }}>kumo</span>
          </div>

          {/* AI Create button - primary action */}
          <button onClick={function() { router.push("/dashboard/create"); }} style={{
            width: "100%", padding: "11px", borderRadius: 8, border: "none",
            background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)",
            color: "#070a0e", fontSize: 13, fontWeight: 700,
            marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            ⚡ Create with AI
          </button>

          {/* Import from Git button - secondary */}
          <button onClick={function() { router.push("/dashboard/new"); }} style={{
            width: "100%", padding: "10px", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.1)",
            background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600,
            marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            + Import from Git
          </button>

          <NavItem icon="📁" label="Projects" href="/dashboard" active={pathname === "/dashboard"} />
          <NavItem icon="🚀" label="Deployments" href="/dashboard/deployments" active={pathname === "/dashboard/deployments"} />
          <NavItem icon="🗃️" label="Databases" href="/dashboard/databases" active={pathname === "/dashboard/databases"} />
          <NavItem icon="🌐" label="Domains" href="/dashboard/domains" active={pathname === "/dashboard/domains"} />
          <NavItem icon="📊" label="Analytics" href="/dashboard/analytics" active={pathname === "/dashboard/analytics"} />

          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 0" }} />

          <NavItem icon="💬" label="Support" href="/dashboard/support" active={pathname === "/dashboard/support"} badge="1" />
          <NavItem icon="📖" label="Docs" href="/dashboard/docs" active={pathname === "/dashboard/docs"} />

          <div style={{ marginTop: "auto" }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "12px 0" }} />
            <NavItem icon="⚙️" label="Settings" href="/dashboard/settings" active={pathname === "/dashboard/settings"} />
            <div style={{
              display: "flex", alignItems: "center", gap: 9, padding: "10px 14px", marginTop: 4,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg, #3ecfb4, #2ba8e0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#070a0e",
              }}>{initials}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>Pro Plan</div>
              </div>
              <button onClick={logout} style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 14,
                padding: 4, cursor: "pointer",
              }} title="Logout">⏻</button>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, overflow: "auto" }}>
          {props.children}
        </div>
      </div>
    </UserContext.Provider>
  );
}
