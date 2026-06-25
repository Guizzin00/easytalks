import React from "react";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-badge animate-fade-in delay-1 glass-panel">
        ✨ Nossa Cultura
      </div>
      <h1 className="hero-title animate-fade-in delay-2">
        A EasyPlan pelos olhos <br />
        <span className="text-gradient">de quem vive ela.</span>
      </h1>
      <p className="hero-subtitle animate-fade-in delay-3">
        Compartilhe sua percepção, sentimento ou experiência em relação à
        EasyPlan.
      </p>
      <p className="hero-description animate-fade-in delay-4">
        Em poucas palavras, conte o que a EasyPlan significa para você. Suas
        palavras vão compor uma coleção visual de depoimentos que celebram nossa
        cultura e os bastidores do que construímos juntos.
      </p>
    </section>
  );
}
