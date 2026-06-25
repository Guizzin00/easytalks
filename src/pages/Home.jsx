import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="main-content home-main">
        <div className="home-container animate-fade-in">
          <div className="badge">CAMPANHA INTERNA · 2026</div>
          <h1 className="home-title">
            A EasyPlan pelos olhos
            <br/>
            De
            <br/>
            <span className="home-title-highlight">quem vive ela.</span>
          </h1>
          <p className="home-subtitle">
            Em poucas palavras, conte o que a EasyPlan significa para você.
            <br />
            Suas palavras vão compor uma coleção visual de depoimentos que
            <br />
            celebram nossa cultura e os bastidores do que construímos juntos.
          </p>
          <button
            className="btn-primary btn-participar"
            onClick={() => navigate("/form")}
          >
            Participar
          </button>
        </div>
      </main>
    </>
  );
}
