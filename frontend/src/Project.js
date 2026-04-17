import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// ❌ Removed Avatar import

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
const res = await axios.post(
`${API_URL}/api/projects/${project._id}/members`,
{ email: emailInput.trim() }
);
onUpdate(res.data);
setSuccess(`Added successfully!`);
setEmailInput("");
} catch (err) {
setError(err.response?.data?.message || "Failed to add member.");
} finally {
setLoading(false);
}
};

const removeMember = async (userId) => {
try {
const res = await axios.delete(
`${API_URL}/api/projects/${project._id}/members/${userId}`
);
onUpdate(res.data);
} catch (err) {
setError("Failed to remove member.");
}
};

return (
<div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}> <div className="modal"> <h3>Team Members</h3>


    <input
      placeholder="Add by email"
      value={emailInput}
      onChange={e => setEmailInput(e.target.value)}
    />
    <button onClick={addMember}>Add</button>

    {error && <p>{error}</p>}
    {success && <p>{success}</p>}

    {(project.members || []).map(m => (
      <div key={m._id}>
        {m.name} ({m.email})
        <button onClick={() => removeMember(m._id)}>Remove</button>
      </div>
    ))}

    <button onClick={onClose}>Close</button>
  </div>
</div>


);
}

function CreateModal({ onClose, onCreate }) {
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");

const handleCreate = async () => {
const userId = localStorage.getItem("userId");
const res = await axios.post(`${API_URL}/api/projects/create`, {
title,
description,
userId
});
onCreate(res.data);
onClose();
};

return ( <div>
<input
placeholder="Project title"
value={title}
onChange={e => setTitle(e.target.value)}
/>
<input
placeholder="Description"
value={description}
onChange={e => setDescription(e.target.value)}
/> <button onClick={handleCreate}>Create</button> </div>
);
}

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
} catch (err) {
console.log(err);
} finally {
setLoading(false);
}
};

useEffect(() => {
load();
}, []);

const handleCreate = (proj) =>
setProjects(prev => [proj, ...prev]);

const handleUpdate = (updated) =>
setProjects(prev =>
prev.map(p => (p._id === updated._id ? updated : p))
);

return ( <div> <h1>Projects</h1>


  <button onClick={() => setShowCreate(true)}>
    New Project
  </button>

  {loading ? (
    <p>Loading...</p>
  ) : (
    projects.map(p => (
      <div key={p._id}>
        <h3>{p.title}</h3>
        <p>{p.description}</p>

        <button onClick={() => navigate(`/tickets?projectId=${p._id}`)}>
          Open
        </button>

        <button onClick={() => setTeamModal(p)}>
          Team
        </button>
      </div>
    ))
  )}

  {showCreate && (
    <CreateModal
      onClose={() => setShowCreate(false)}
      onCreate={handleCreate}
    />
  )}

  {teamModal && (
    <TeamModal
      project={teamModal}
      onClose={() => setTeamModal(null)}
      onUpdate={handleUpdate}
    />
  )}
</div>


);
}
