import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Auth.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    
    const adminUser = import.meta.env.VITE_ADMIN_USER || 'admin';
    const adminPass = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

    if (username === adminUser && password === adminPass) {
      sessionStorage.setItem("easyplan_auth", "true");
      navigate("/admin");
    } else {
      setError("Usuário ou senha inválidos.");
    }
  };

  return (
    <>
      <Header />
      <main className="main-content auth-main">
        <div className="auth-container animate-fade-in delay-1">
          <h1 className="auth-title">Acesso interno</h1>
          <p className="auth-subtitle">Entre para visualizar os depoimentos.</p>

          <form className="auth-form" onSubmit={handleLogin}>
            {error && <div style={{ color: "#ef4444", fontSize: "0.9rem", textAlign: "center", marginBottom: "1rem" }}>{error}</div>}
            
            <div className="form-group">
              <label>USUÁRIO</label>
              <input 
                type="text" 
                className="form-input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>SENHA</label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary auth-submit-btn">
              Entrar
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
