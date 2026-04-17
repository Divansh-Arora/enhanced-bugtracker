import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Avatar } from "./App";

const API_URL = process.env.REACT_APP_API_URL;

const STATUSES = ["To Do", "In Progress", "Done"];

export default function Ticket() {
const [tickets, setTickets] = useState([]);
const [members, setMembers] = useState([]);
const [projectInfo, setProjectInfo] = useState(null);
const [loading, setLoading] = useState(true);
const location = useLocation();
const projectId = new URLSearchParams(location.search).get("projectId");

// ✅ FIX: wrapped in useCallback
const loadTickets = useCallback(async () => {
if (!projectId) {
setLoading(false);
return;
}

try {
  const [tRes, pRes] = await Promise.all([
    axios.get(`${API_URL}/api/tickets/${projectId}`),
    axios.get(`${API_URL}/api/projects/${projectId}`)
  ]);

  setTickets(tRes.data);
  setProjectInfo(pRes.data);
  setMembers(pRes.data.members || []);
} catch (err) {
  console.log(err);
} finally {
  setLoading(false);
}

}, [projectId]);

// ✅ FIXED dependency
useEffect(() => {
loadTickets();
}, [loadTickets]);

const onStatusChange = async (id, status) => {
try {
const res = await axios.put(`${API_URL}/api/tickets/${id}`, { status });
setTickets(prev => prev.map(t => t._id === id ? res.data : t));
} catch (err) {
console.log(err);
}
};

const onDelete = async (id) => {
try {
await axios.delete(`${API_URL}/api/tickets/${id}`);
setTickets(prev => prev.filter(t => t._id !== id));
} catch (err) {
console.log(err);
}
};

if (!projectId) return <p>No project selected</p>;

return ( <div> <h1>Tickets - {projectInfo?.title}</h1>


  {loading ? (
    <p>Loading...</p>
  ) : (
    tickets.map(t => (
      <div key={t._id}>
        <h4>{t.title}</h4>
        <p>{t.description}</p>

        <select
          value={t.status}
          onChange={(e) => onStatusChange(t._id, e.target.value)}
        >
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>

        <button onClick={() => onDelete(t._id)}>Delete</button>
      </div>
    ))
  )}
</div>


);
}
