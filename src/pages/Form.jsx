import React, { useState } from "react";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import "./Form.css";

export default function FormPage() {
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !department || !text) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (!consent) {
      alert("Você precisa autorizar o uso do seu depoimento para participar.");
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          { 
            name, 
            department, 
            text, 
            consent 
          }
        ]);

      if (error) {
        console.error("Erro ao salvar no Supabase:", error);
        alert("Ocorreu um erro ao enviar seu depoimento. Verifique a configuração do banco de dados.");
        return;
      }
      
      setSubmitted(true);
    } catch (err) {
      console.error("Erro:", err);
      alert("Falha na comunicação com o servidor.");
    }
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main className="main-content form-main">
          <div className="form-container animate-fade-in delay-1" style={{ textAlign: "center", paddingTop: "4rem" }}>
            <h1 className="form-title">Obrigado pelo seu depoimento!</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Sua mensagem foi enviada com sucesso.</p>
            <button className="btn-primary" onClick={() => window.location.href = "/"}>Voltar ao início</button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-content form-main">
        <div className="form-container animate-fade-in delay-1">
          <div className="form-label">PERGUNTA</div>
          <h1 className="form-title">O que a EasyPlan significa para você?</h1>

          <form className="testimonial-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>NOME COMPLETO *</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>DEPARTAMENTO *</label>
                <select 
                  className="form-input form-select"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="diretoria">Diretoria</option>
                  <option value="comercial">Comercial</option>
                  <option value="marketing">Marketing</option>
                  <option value="operacoes">Operações</option>
                  <option value="cx">CX</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="rh">RH</option>
                  <option value="ti">TI</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>SUA RESPOSTA *</label>
              <div className="textarea-wrapper">
                <textarea
                  placeholder="Escreva em até 300 caracteres..."
                  className="form-input form-textarea"
                  maxLength={300}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
                <div className="char-count">
                  {300 - text.length} caracteres restantes
                </div>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <span className="checkbox-text">
                  Autorizo a EasyPlan a utilizar minha resposta em comunicações
                  internas, apresentações corporativas e materiais
                  institucionais. *
                </span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Enviar depoimento
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
