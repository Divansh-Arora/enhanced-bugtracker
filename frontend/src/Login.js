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

  const reset = () => { setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); setError(""); setSuccess(""); };
  const switchMode = (m) => { setMode(m); reset(); };

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    setLoading(true); setError("");
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.name);
      navigate("/projects");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
    } finally { setLoading(false); }
  };

  const handleSignup = async () => {
  if (!name || !email || !password || !confirmPassword)
    return setError("Please fill in all fields.");
  if (password !== confirmPassword)
    return setError("Passwords do not match.");
  if (password.length < 6)
    return setError("Password must be at least 6 characters.");

  setLoading(true); setError("");
  try {
    await axios.post(`${API_URL}/api/users/register`, {
  name,
  email,
  password
});

    setSuccess("Account created! Please sign in.");
    setTimeout(() => switchMode("login"), 1500);
  } catch (err) {
    setError(err.response?.data?.message || "Registration failed.");
  } finally {
    setLoading(false);
  }
};

  const onKey = (e) => { if (e.key === "Enter") mode === "login" ? handleLogin() : handleSignup(); };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}>
      {/* Left panel */}
      <div style={{
        flex: 1, background: "var(--sidebar-bg)", display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", padding: "60px 40px",
        borderRight: "1px solid var(--border)", position: "relative", overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
          top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none"
        }}/>
        <div style={{ position: "relative", textAlign: "center", maxWidth: 360 }}>
          <div style={{
            width: 56, height: 56, background: "var(--accent)", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 24px", boxShadow: "0 8px 24px rgba(108,99,255,0.4)"
          }}>🐛</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "white", marginBottom: 12 }}>
            BugTracker
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            Track bugs, manage projects, and ship software faster — together.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "⚡", text: "Real-time ticket management" },
              { icon: "👥", text: "Team collaboration & assignments" },
              { icon: "📊", text: "Project progress tracking" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px" }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ color: "var(--text-muted)", fontSize: 13.5 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 460, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px" }}>
        <div style={{ width: "100%" }} className="fade-up">
          {/* Tab switcher */}
          <div style={{ display: "flex", background: "var(--surface-2)", borderRadius: 10, padding: 4, marginBottom: 28, border: "1px solid var(--border)" }}>
            {["login","signup"].map(m => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex: 1, padding: "9px 0", borderRadius: 8, border: "none", cursor: "pointer",
                fontSize: 13.5, fontWeight: 500, transition: "all 0.2s",
                background: mode === m ? "var(--accent)" : "transparent",
                color: mode === m ? "white" : "var(--text-muted)",
                boxShadow: mode === m ? "0 2px 8px rgba(108,99,255,0.35)" : "none",
              }}>{m === "login" ? "Sign In" : "Create Account"}</button>
            ))}
          </div>

          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "white", marginBottom: 6 }}>
            {mode === "login" ? "Welcome back" : "Get started"}
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13.5, marginBottom: 24 }}>
            {mode === "login" ? "Sign in to your workspace" : "Create your free account"}
          </p>

          {error && (
            <div style={{ background: "rgba(255,77,109,0.1)", border: "1px solid rgba(255,77,109,0.25)", borderRadius: 8, padding: "10px 14px", color: "var(--red)", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: "rgba(45,212,160,0.1)", border: "1px solid rgba(45,212,160,0.25)", borderRadius: 8, padding: "10px 14px", color: "var(--green)", fontSize: 13, marginBottom: 16 }}>
              {success}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Full Name</label>
                <input className="input" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} onKeyDown={onKey} />
              </div>
            )}
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Email</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={onKey} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input className="input" type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={onKey} style={{ paddingRight: 42 }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 14 }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Confirm Password</label>
                <input className="input" type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onKeyDown={onKey} />
              </div>
            )}

            <button className="btn btn-primary" onClick={mode === "login" ? handleLogin : handleSignup}
              disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14, marginTop: 4 }}>
              {loading ? <div className="spinner" /> : (mode === "login" ? "Sign In →" : "Create Account →")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
