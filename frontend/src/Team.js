import React, { useState, useEffect } from "react";
import axios from "axios";
import { Avatar } from "./App";

const API_URL = process.env.REACT_APP_API_URL;
export default function Team() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/users`),
      axios.get(`${API_URL}/api/projects`)
    ]).then(([uRes, pRes]) => {
      setUsers(uRes.data);
      setProjects(pRes.data);
    }).catch(console.log).finally(() => setLoading(false));
  }, []);

  const getUserProjects = (userId) =>
    projects.filter(p => p.members?.some(m => m._id === userId || m === userId));

  const ROLE_COLORS = ["#6c63ff", "#3b9eff", "#2dd4a0", "#ff8c42", "#ff4d6d", "#fbbf24"];

  return (
    <div style={{ padding: "32px 36px" }} className="fade-up">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "white", marginBottom: 4 }}>Team</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{users.length} member{users.length !== 1 ? "s" : ""} across your workspace</p>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ height: 140, background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", animation: "pulse 1.5s ease infinite" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {users.map((u, i) => {
            const userProjects = getUserProjects(u._id);
            const accentColor = ROLE_COLORS[i % ROLE_COLORS.length];
            return (
              <div key={u._id} className="card" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                  <Avatar name={u.name} size={44} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "white", marginBottom: 2 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                  </div>
                </div>
                <div className="divider" style={{ margin: "12px 0" }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div className="section-label">Projects</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "white", fontFamily: "var(--font-display)" }}>
                      {userProjects.length}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 140, justifyContent: "flex-end" }}>
                    {userProjects.slice(0, 3).map(p => (
                      <span key={p._id} style={{ fontSize: 10.5, background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}30`, borderRadius: 6, padding: "2px 7px", whiteSpace: "nowrap", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis" }}>
                        {p.title}
                      </span>
                    ))}
                    {userProjects.length > 3 && (
                      <span style={{ fontSize: 10.5, background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 7px" }}>
                        +{userProjects.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
