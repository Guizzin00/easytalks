import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

import logoImg from "../assets/logo.png";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logoImg} alt="EasyPlan" className="logo-img" />
        </Link>
        <Link to="/auth" className="login-link">
          ACESSO INTERNO
        </Link>
      </div>
    </header>
  );
}
