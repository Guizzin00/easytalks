import React from 'react';
import Header from '../components/Header';
import './Auth.css';

export default function AuthPage() {
  return (
    <>
      <Header />
      <main className="main-content auth-main">
        <div className="auth-container animate-fade-in delay-1">
          <h1 className="auth-title">Acesso interno</h1>
          <p className="auth-subtitle">Entre para visualizar os depoimentos.</p>
          
          <form className="auth-form">
            <div className="form-group">
              <label>EMAIL</label>
              <input type="email" className="form-input" />
            </div>
            
            <div className="form-group">
              <label>SENHA</label>
              <input type="password" className="form-input" />
            </div>

            <button type="submit" className="btn-primary auth-submit-btn">
              Entrar
            </button>
            
            <div className="auth-footer">
              <a href="#" className="create-account-link">
                CRIAR PRIMEIRA CONTA
              </a>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
