import React from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from "react-router-dom";
import Login from "./Login";
import Project from "./Project";
import Ticket from "./Ticket";
import Profile from "./Profile";
import Team from "./Team";

const AVATAR_COLORS = [
  ["#6c63ff","#3d3799"],["#2dd4a0","#1a7a5e"],["#3b9eff","#1a5ea3"],
  ["#ff8c42","#a3521e"],["#ff4d6d","#a3213d"],["#fbbf24","#a37a0d"],
];

export function getAvatarColor(str = "") {
  const i = str.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[i];
}

export function Avatar({ name = "", size = 32, style = {} }) {
  const initials = name.trim().split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() || "?";
  const [bg, shadow] = getAvatarColor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${bg}, ${shadow})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: "white",
      fontFamily: "var(--font-display)", flexShrink: 0,
      boxShadow: `0 2px 8px ${bg}44`,
      ...style
    }}>
      {initials}
    </div>
  );
}

const NAV = [
  { to: "/projects", label: "Projects", icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  )},
  { to: "/tickets", label: "Tickets", icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  )},
  { to: "/team", label: "Team", icon: (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )},
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  if (location.pathname === "/") return null;

  const name = localStorage.getItem("name") || localStorage.getItem("email") || "User";

  return (
    <aside style={{
      width: 220, minWidth: 220, background: "var(--sidebar-bg)",
      height: "100vh", display: "flex", flexDirection: "column",
      position: "sticky", top: 0, borderRight: "1px solid var(--border)",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: "var(--accent)", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            boxShadow: "0 4px 12px rgba(108,99,255,0.4)"
          }}>🐛</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "white", fontFamily: "var(--font-display)" }}>BugTracker</div>
            <div style={{ fontSize: 10, color: "var(--sidebar-muted)", letterSpacing: "0.05em" }}>v2.0 · Enhanced</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "16px 10px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <div className="section-label" style={{ padding: "0 10px", marginBottom: 8 }}>Workspace</div>
        {NAV.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 8, textDecoration: "none",
            fontSize: 13.5, fontWeight: isActive ? 600 : 400,
            color: isActive ? "white" : "var(--sidebar-muted)",
            background: isActive ? "rgba(108,99,255,0.18)" : "transparent",
            transition: "all 0.15s",
            borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
          })}>
            {icon} {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 6 }}>
        <NavLink to="/profile" style={({ isActive }) => ({
          display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
          borderRadius: 8, textDecoration: "none",
          background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
          transition: "background 0.15s",
        })}>
          <Avatar name={name} size={28} />
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--text)" }}>{name.split(" ")[0]}</div>
            <div style={{ fontSize: 10.5, color: "var(--sidebar-muted)" }}>View profile</div>
          </div>
        </NavLink>
        <button className="btn btn-ghost btn-sm" onClick={() => { localStorage.clear(); navigate("/"); }}
          style={{ width: "100%", justifyContent: "center", color: "var(--red)", borderColor: "rgba(255,77,109,0.2)" }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  );
}

function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: "auto" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/tickets" element={<Ticket />} />
          <Route path="/team" element={<Team />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return <BrowserRouter><Layout /></BrowserRouter>;
}
