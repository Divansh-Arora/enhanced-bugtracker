import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./App";

const API_URL = process.env.REACT_APP_API_URL;

function TeamModal({ project, onClose, onUpdate }) {
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const addMember = async () => {
    if (!emailInput.trim()) return;
    setLoading(true); setError(""); setSuccess("");
    try {
      const res = await axios.post(`${API_URL}/api/projects/${project._id}/members`, { email: emailInput.trim() });
      onUpdate(res.data);
      setSuccess(`Added successfully!`);
      setEmailInput("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member.");
    } finally { setLoading(false); }
  };

  const removeMember = async (userId) => {
    try {
      const res = await axios.delete(`${API_URL}/api/projects/${project._id}/members/${userId}`);
      onUpdate(res.data);
    } catch (err) { setError("Failed to remove member."); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "white" }}>Team Members</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 12.5, marginTop: 2 }}>{project.title}</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: "6px 10px" }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input className="input" placeholder="Add by email address..." value={emailInput} onChange={e => setEmailInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addMember()} style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={addMember} disabled={loading} style={{ flexShrink: 0 }}>
            {loading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : "+ Add"}
          </button>
        </div>
        {error && <p style={{ color: "var(--red)", fontSize: 12.5, marginBottom: 12 }}>{error}</p>}
        {success && <p style={{ color: "var(--green)", fontSize: 12.5, marginBottom: 12 }}>{success}</p>}

        <div className="divider" style={{ margin: "16px 0" }}/>
        <p className="section-label">Members ({project.members?.length || 0})</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 260, overflowY: "auto" }}>
          {(project.members || []).length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 13, padding: "12px 0" }}>No members yet.</p>
          ) : (project.members || []).map(m => (
            <div key={m._id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--surface-2)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <Avatar name={m.name} size={30} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text)" }}>{m.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{m.email}</div>
              </div>
              {m._id !== project.userId?._id && (
                <button className="btn btn-danger btn-sm" onClick={() => removeMember(m._id)} style={{ padding: "4px 8px" }}>Remove</button>
              )}
              {m._id === project.userId?._id && (
                <span style={{ fontSize: 11, color: "var(--text-muted)", padding: "4px 8px" }}>Owner</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateModal({ onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.post(`${API_URL}/api/projects/create`, { title, description, userId });
      onCreate(res.data);
      onClose();
    } catch (err) { console.log(err); } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "white" }}>New Project</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: "6px 10px" }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Project Name *</label>
            <input className="input" placeholder="e.g. Mobile App v2" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleCreate()} autoFocus />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Description</label>
            <textarea className="input" placeholder="What is this project about?" value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate} disabled={loading || !title.trim()}>
              {loading ? <div className="spinner" style={{ width: 14, height: 14 }} /> : "Create Project"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const PROJECT_COLORS = ["#6c63ff","#3b9eff","#2dd4a0","#ff8c42","#ff4d6d","#fbbf24"];

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [teamModal, setTeamModal] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`);
      setProjects(res.data);
    } catch (err) { console.log(err); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = (proj) => setProjects(prev => [proj, ...prev]);
  const handleUpdate = (updated) => setProjects(prev => prev.map(p => p._id === updated._id ? updated : p));

  const currentUserId = localStorage.getItem("userId");

  return (
    <div style={{ padding: "36px 40px", maxWidth: 1100, margin: "0 auto" }} className="fade-up">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "white", marginBottom: 4 }}>Projects</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{projects.length} project{projects.length !== 1 ? "s" : ""} in your workspace</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Project
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: 180, background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", animation: "pulse 1.5s ease infinite" }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">📁</div>
          <h3>No projects yet</h3>
          <p>Create your first project to get started tracking bugs.</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)} style={{ marginTop: 16 }}>Create Project</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {projects.map((p, i) => {
            const color = PROJECT_COLORS[i % PROJECT_COLORS.length];
            const memberCount = p.members?.length || 0;
            return (
              <div key={p._id} className="card" style={{ padding: 0, overflow: "hidden", cursor: "default", animationDelay: `${i * 0.06}s` }}>
                {/* Color bar */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
                <div style={{ padding: "20px 20px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                      background: `${color}20`, fontSize: 18, border: `1px solid ${color}30`
                    }}>
                      {["📱","🌐","⚙️","🎯","🔧","📊"][i % 6]}
                    </div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, padding: "3px 8px" }}>
                      {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "white", marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 13, lineHeight: 1.5, marginBottom: 16, minHeight: 40 }}>
                    {p.description || "No description provided."}
                  </p>

                  {/* Members row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ display: "flex" }}>
                        {(p.members || []).slice(0, 4).map((m, idx) => (
                          <div key={m._id} data-tooltip={m.name} style={{ marginLeft: idx > 0 ? -8 : 0, zIndex: 4 - idx, position: "relative" }}>
                            <Avatar name={m.name} size={24} style={{ border: "2px solid var(--surface)" }} />
                          </div>
                        ))}
                        {memberCount > 4 && (
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--surface-2)", border: "2px solid var(--surface)", marginLeft: -8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "var(--text-muted)", zIndex: 0 }}>
                            +{memberCount - 4}
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                        {memberCount} member{memberCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center" }}
                      onClick={() => navigate(`/tickets?projectId=${p._id}`)}>
                      Open Tickets →
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setTeamModal(p)}
                      style={{ padding: "6px 10px" }} data-tooltip="Manage team">
                      👥
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
      {teamModal && <TeamModal project={teamModal} onClose={() => setTeamModal(null)} onUpdate={(updated) => { handleUpdate(updated); setTeamModal(updated); }} />}
    </div>
  );
}
