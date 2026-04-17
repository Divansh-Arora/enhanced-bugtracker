import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Avatar } from "./App";

const API_URL = process.env.REACT_APP_API_URL;

const STATUSES = ["To Do", "In Progress", "Done"];
const STATUS_STYLES = {
  "To Do": { badge: "badge-todo", icon: "○", color: "var(--text-muted)" },
  "In Progress": { badge: "badge-inprogress", icon: "◑", color: "var(--blue)" },
  "Done": { badge: "badge-done", icon: "●", color: "var(--green)" },
};
const PRIORITY_STYLES = {
  low: { badge: "badge-low", label: "Low", icon: "▼" },
  medium: { badge: "badge-medium", label: "Medium", icon: "▶" },
  high: { badge: "badge-high", label: "High", icon: "▲" },
};

function TicketCard({ ticket, members, onStatusChange, onAssign, onDelete }) {
  const [showActions, setShowActions] = useState(false);
  const p = PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.low;
  const s = STATUS_STYLES[ticket.status] || STATUS_STYLES["To Do"];
  const assignee = ticket.assignedTo;

  return (
    <div className="card" style={{ padding: "14px 16px", marginBottom: 8, position: "relative" }}
      onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span className={`badge ${p.badge}`}>{p.icon} {p.label}</span>
        {showActions && (
          <button className="btn btn-danger btn-sm" style={{ padding: "2px 6px", fontSize: 11 }} onClick={() => onDelete(ticket._id)}>✕</button>
        )}
      </div>
      <h4 style={{ fontSize: 13.5, fontWeight: 600, color: "white", marginBottom: 5, lineHeight: 1.4 }}>{ticket.title}</h4>
      {ticket.description && (
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10, lineHeight: 1.5 }}>{ticket.description}</p>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
        {/* Assignee picker */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {assignee ? (
            <div style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }} title={assignee.name} onClick={() => onAssign(ticket._id, null)}>
              <Avatar name={assignee.name} size={20} />
              <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{assignee.name.split(" ")[0]}</span>
            </div>
          ) : (
            <select
              value=""
              onChange={e => { if (e.target.value) onAssign(ticket._id, e.target.value); }}
              style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text-muted)", fontSize: 11.5, padding: "2px 6px", cursor: "pointer" }}
            >
              <option value="">+ Assign</option>
              {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          )}
        </div>

        {/* Status picker */}
        <select value={ticket.status} onChange={e => onStatusChange(ticket._id, e.target.value)}
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, color: s.color, fontSize: 11.5, padding: "3px 8px", cursor: "pointer", fontWeight: 500 }}>
          {STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
        </select>
      </div>
    </div>
  );
}

function CreateTicketForm({ projectId, members, onCreated, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/tickets/create`, {
        title, description, priority, projectId,
        assignedTo: assignedTo || undefined
      });
      onCreated(res.data);
      setTitle(""); setDescription(""); setPriority("medium"); setAssignedTo("");
    } catch (err) { console.log(err); } finally { setLoading(false); }
  };

  return (
    <div className="card" style={{ padding: 20, marginBottom: 20 }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 600, color: "white", marginBottom: 14 }}>New Ticket</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input className="input" placeholder="Ticket title *" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        <textarea className="input" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} rows={2} style={{ resize: "vertical" }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>Priority</label>
            <select className="input" value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: "8px 12px" }}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 5 }}>Assign to</label>
            <select className="input" value={assignedTo} onChange={e => setAssignedTo(e.target.value)} style={{ padding: "8px 12px" }}>
              <option value="">Unassigned</option>
              {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={loading || !title.trim()}>
            {loading ? <div className="spinner" style={{ width: 13, height: 13 }} /> : "Create Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Ticket() {
  const [tickets, setTickets] = useState([]);
  const [members, setMembers] = useState([]);
  const [projectInfo, setProjectInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState("kanban");
  const location = useLocation();
  const projectId = new URLSearchParams(location.search).get("projectId");

  const loadTickets = async () => {
    if (!projectId) { setLoading(false); return; }
    try {
      const [tRes, pRes] = await Promise.all([
        axios.get(`${API_URL}/api/tickets/${projectId}`),
        axios.get(`${API_URL}/api/projects/${projectId}`)
      ]);
      setTickets(tRes.data);
      setProjectInfo(pRes.data);
      setMembers(pRes.data.members || []);
    } catch (err) { console.log(err); } finally { setLoading(false); }
  };

  useEffect(() => { loadTickets(); }, [projectId]);

  const onStatusChange = async (id, status) => {
    try {
      const res = await axios.put(`${API_URL}/api/tickets/${id}`, { status });
      setTickets(prev => prev.map(t => t._id === id ? res.data : t));
    } catch (err) { console.log(err); }
  };

  const onAssign = async (id, userId) => {
    try {
      const res = await axios.put(`${API_URL}/api/tickets/${id}`, { assignedTo: userId });
      setTickets(prev => prev.map(t => t._id === id ? res.data : t));
    } catch (err) { console.log(err); }
  };

  const onDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tickets/${id}`);
      setTickets(prev => prev.filter(t => t._id !== id));
    } catch (err) { console.log(err); }
  };

  if (!projectId) return (
    <div className="empty" style={{ marginTop: 80 }}>
      <div className="empty-icon">🎫</div>
      <h3>No project selected</h3>
      <p>Open a project from the Projects page to view its tickets.</p>
    </div>
  );

  const byStatus = STATUSES.reduce((acc, s) => ({ ...acc, [s]: tickets.filter(t => t.status === s) }), {});

  const COLUMN_STYLES = {
    "To Do": { header: "var(--text-muted)", bg: "rgba(122,125,142,0.06)" },
    "In Progress": { header: "var(--blue)", bg: "rgba(59,158,255,0.05)" },
    "Done": { header: "var(--green)", bg: "rgba(45,212,160,0.05)" },
  };

  return (
    <div style={{ padding: "32px 36px" }} className="fade-up">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Projects</span>
            <span style={{ fontSize: 12, color: "var(--text-subtle)" }}>›</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{projectInfo?.title || "..."}</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "white" }}>Tickets</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
            {members.slice(0, 5).map((m, i) => (
              <div key={m._id} data-tooltip={m.name} style={{ marginLeft: i > 0 ? -6 : 0 }}>
                <Avatar name={m.name} size={22} style={{ border: "2px solid var(--bg)" }} />
              </div>
            ))}
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>{tickets.length} ticket{tickets.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, padding: 3 }}>
            {[["kanban","⊞"],["list","☰"]].map(([mode, icon]) => (
              <button key={mode} onClick={() => setViewMode(mode)} className="btn btn-sm" style={{
                padding: "5px 10px", background: viewMode === mode ? "var(--accent)" : "transparent",
                color: viewMode === mode ? "white" : "var(--text-muted)", border: "none"
              }}>{icon}</button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancel" : "+ New Ticket"}
          </button>
        </div>
      </div>

      {showForm && (
        <CreateTicketForm projectId={projectId} members={members}
          onCreated={t => { setTickets(prev => [t, ...prev]); setShowForm(false); }}
          onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <div style={{ color: "var(--text-muted)", textAlign: "center", padding: 60 }}>Loading tickets…</div>
      ) : viewMode === "kanban" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {STATUSES.map(status => {
            const col = COLUMN_STYLES[status];
            const colTickets = byStatus[status] || [];
            return (
              <div key={status} style={{ background: col.bg, border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: col.header }}>● </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{status}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 99, padding: "1px 8px", color: "var(--text-muted)" }}>
                    {colTickets.length}
                  </span>
                </div>
                {colTickets.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "24px 0", color: "var(--text-subtle)", fontSize: 12 }}>No tickets</div>
                ) : colTickets.map(t => (
                  <TicketCard key={t._id} ticket={t} members={members} onStatusChange={onStatusChange} onAssign={onAssign} onDelete={onDelete} />
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {tickets.length === 0 ? (
            <div className="empty"><div className="empty-icon">🎫</div><h3>No tickets yet</h3><p>Create your first ticket.</p></div>
          ) : tickets.map(t => (
            <div key={t._id} className="card" style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 14, borderRadius: 8 }}>
              <span className={`badge ${PRIORITY_STYLES[t.priority]?.badge}`} style={{ flexShrink: 0 }}>{PRIORITY_STYLES[t.priority]?.icon}</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 500, color: "var(--text)", fontSize: 13.5 }}>{t.title}</span>
                {t.description && <span style={{ color: "var(--text-muted)", fontSize: 12, marginLeft: 8 }}>{t.description}</span>}
              </div>
              {t.assignedTo && <Avatar name={t.assignedTo.name} size={22} data-tooltip={t.assignedTo.name} />}
              <select value={t.status} onChange={e => onStatusChange(t._id, e.target.value)}
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, color: STATUS_STYLES[t.status]?.color, fontSize: 12, padding: "4px 8px" }}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn btn-danger btn-sm" onClick={() => onDelete(t._id)} style={{ padding: "4px 8px" }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
