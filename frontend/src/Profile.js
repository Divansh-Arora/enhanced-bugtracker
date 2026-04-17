import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./App";

const API_URL = process.env.REACT_APP_API_URL;
const STATUS_COLORS = {
  "To Do": "var(--text-muted)",
  "In Progress": "var(--blue)",
  "Done": "var(--green)",
};

function StatCard({ label, value, sub, color = "var(--accent)" }) {
  return (
    <div className="card" style={{ padding: "18px 20px", flex: 1 }}>
      <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "var(--font-display)", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{sub}</div>}
    </div>
  );
}

export default function Profile() {
  const [projects, setProjects] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name") || email?.split("@")[0] || "User";

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/projects`),
      axios.get(`${API_URL}/api/tickets/all`)
    ]).then(([pRes, tRes]) => {
      setProjects(pRes.data);
      setTickets(tRes.data || []);
    }).catch(console.log).finally(() => setLoading(false));
  }, []);

  const myProjects = projects.filter(p =>
    p.members?.some(m => (m._id || m) === userId) || p.userId?._id === userId || p.userId === userId
  );

  const totalTickets = tickets.length;
  const done = tickets.filter(t => t.status === "Done").length;
  const inProgress = tickets.filter(t => t.status === "In Progress").length;
  const toDo = tickets.filter(t => t.status === "To Do").length;

  const completionRate = totalTickets > 0 ? Math.round((done / totalTickets) * 100) : 0;

  const recentTickets = tickets.slice(0, 8);

  const joinDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)" }}>
      <div className="spinner" style={{ width: 24, height: 24 }} />
    </div>
  );

  return (
    <div style={{ padding: "36px 40px", maxWidth: 900, margin: "0 auto" }} className="fade-up">
      {/* Profile header card */}
      <div className="card" style={{ padding: "28px 28px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        {/* Background gradient */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          background: "linear-gradient(135deg, var(--accent) 0%, transparent 60%)",
          pointerEvents: "none"
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, position: "relative" }}>
          <Avatar name={name} size={72} style={{ boxShadow: "0 8px 24px rgba(108,99,255,0.3)" }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 4 }}>{name}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginBottom: 8 }}>{email}</p>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 11.5, background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid rgba(108,99,255,0.25)", borderRadius: 6, padding: "3px 10px", fontWeight: 500 }}>
                Member since {joinDate}
              </span>
              <span style={{ fontSize: 11.5, background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 10px" }}>
                {myProjects.length} Project{myProjects.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => { localStorage.clear(); navigate("/"); }}
            style={{ color: "var(--red)", borderColor: "rgba(255,77,109,0.2)" }}>
            Sign out
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <StatCard label="Total Tickets" value={totalTickets} sub="across all projects" color="var(--accent)" />
        <StatCard label="In Progress" value={inProgress} sub="being worked on" color="var(--blue)" />
        <StatCard label="Completed" value={done} sub={`${completionRate}% completion rate`} color="var(--green)" />
        <StatCard label="To Do" value={toDo} sub="not yet started" color="var(--yellow)" />
      </div>

      {/* Progress bar */}
      {totalTickets > 0 && (
        <div className="card" style={{ padding: "18px 20px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text)" }}>Overall Progress</span>
            <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>{completionRate}%</span>
          </div>
          <div style={{ height: 8, background: "var(--surface-2)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ display: "flex", height: "100%", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${(done / totalTickets) * 100}%`, background: "var(--green)", transition: "width 0.6s ease" }} />
              <div style={{ width: `${(inProgress / totalTickets) * 100}%`, background: "var(--blue)", transition: "width 0.6s ease" }} />
              <div style={{ width: `${(toDo / totalTickets) * 100}%`, background: "var(--surface-3)", transition: "width 0.6s ease" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
            {[["Done", "var(--green)"], ["In Progress", "var(--blue)"], ["To Do", "var(--text-subtle)"]].map(([label, color]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
                <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* My Projects */}
        <div>
          <div className="section-label" style={{ marginBottom: 12 }}>My Projects</div>
          {myProjects.length === 0 ? (
            <div className="card" style={{ padding: 20 }}>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No projects yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {myProjects.map((p, i) => (
                <div key={p._id} className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                  onClick={() => navigate(`/tickets?projectId=${p._id}`)}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: ["rgba(108,99,255,0.15)","rgba(59,158,255,0.15)","rgba(45,212,160,0.15)","rgba(255,140,66,0.15)"][i % 4],
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16
                  }}>
                    {["📱","🌐","⚙️","🎯"][i % 4]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                    <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{p.members?.length || 0} members</div>
                  </div>
                  <span style={{ color: "var(--text-subtle)", fontSize: 13 }}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tickets */}
        <div>
          <div className="section-label" style={{ marginBottom: 12 }}>Recent Tickets</div>
          {recentTickets.length === 0 ? (
            <div className="card" style={{ padding: 20 }}>
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No tickets yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {recentTickets.map(t => (
                <div key={t._id} className="card" style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: STATUS_COLORS[t.status] || "var(--text-muted)" }} />
                  <span style={{ fontSize: 13, color: "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                  <span style={{ fontSize: 10.5, color: STATUS_COLORS[t.status], flexShrink: 0, fontWeight: 500 }}>{t.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
