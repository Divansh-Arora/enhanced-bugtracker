import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function Login() {
const [mode, setMode] = useState("login");
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [showPass, setShowPass] = useState(false);
const navigate = useNavigate();

const reset = () => {
setName("");
setEmail("");
setPassword("");
setConfirmPassword("");
setError("");
setSuccess("");
};

const switchMode = (m) => {
setMode(m);
reset();
};

// ✅ FIXED LOGIN API
const handleLogin = async () => {
if (!email || !password) return setError("Please fill in all fields.");
setLoading(true);
setError("");


try {
  const res = await axios.post(
    `${API_URL}/api/auth/login`, // ✅ FIXED
    { email, password }
  );

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("userId", res.data.userId);
  localStorage.setItem("email", res.data.email);
  localStorage.setItem("name", res.data.name);

  navigate("/projects");
} catch (err) {
  setError(err.response?.data?.message || "Invalid credentials.");
} finally {
  setLoading(false);
}


};

// ✅ FIXED REGISTER API
const handleSignup = async () => {
if (!name || !email || !password || !confirmPassword)
return setError("Please fill in all fields.");


if (password !== confirmPassword)
  return setError("Passwords do not match.");

if (password.length < 6)
  return setError("Password must be at least 6 characters.");

setLoading(true);
setError("");

try {
  await axios.post(
    `${API_URL}/api/auth/register`, // ✅ FIXED
    { name, email, password }
  );

  setSuccess("Account created! Please sign in.");
  setTimeout(() => switchMode("login"), 1500);
} catch (err) {
  setError(err.response?.data?.message || "Registration failed.");
} finally {
  setLoading(false);
}


};

const onKey = (e) => {
if (e.key === "Enter") {
mode === "login" ? handleLogin() : handleSignup();
}
};

return (
<div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}>


  {/* LEFT PANEL */}
  <div style={{
    flex: 1,
    background: "var(--sidebar-bg)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px 40px",
    borderRight: "1px solid var(--border)"
  }}>
    <h1 style={{ color: "white" }}>BugTracker</h1>
    <p style={{ color: "gray" }}>
      Track bugs, manage projects, and ship software faster.
    </p>
  </div>

  {/* RIGHT PANEL */}
  <div style={{
    width: 460,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px"
  }}>
    <div style={{ width: "100%" }}>

      {/* Tabs */}
      <div style={{ display: "flex", marginBottom: 20 }}>
        <button onClick={() => switchMode("login")}>Sign In</button>
        <button onClick={() => switchMode("signup")}>Create Account</button>
      </div>

      <h2 style={{ color: "white" }}>
        {mode === "login" ? "Welcome back" : "Create account"}
      </h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

        {mode === "signup" && (
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={onKey}
        />

        <input
          type={showPass ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={onKey}
        />

        {mode === "signup" && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}

        <button
          onClick={mode === "login" ? handleLogin : handleSignup}
          disabled={loading}
        >
          {loading ? "Loading..." : mode === "login" ? "Login" : "Register"}
        </button>
      </div>

    </div>
  </div>
</div>


);
}
