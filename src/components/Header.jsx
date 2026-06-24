import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-dot">●</span>
          <span className="logo-text">EASYPLAN</span>
        </Link>
        <Link to="/auth" className="login-link">
          ACESSO INTERNO
        </Link>
      </div>
    </header>
  );
}
