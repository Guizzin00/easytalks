import React, { useState } from 'react';
import Header from '../components/Header';
import './Form.css';

export default function FormPage() {
  const [text, setText] = useState('');

  return (
    <>
      <Header />
      <main className="main-content form-main">
        <div className="form-container animate-fade-in delay-1">
          <div className="form-label">PERGUNTA</div>
          <h1 className="form-title">O que a EasyPlan significa para você?</h1>
          
          <form className="testimonial-form">
            <div className="form-row">
              <div className="form-group">
                <label>NOME COMPLETO</label>
                <input type="text" placeholder="Seu nome" className="form-input" />
              </div>
              <div className="form-group">
                <label>DEPARTAMENTO</label>
                <select className="form-input form-select">
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
              <label>SUA RESPOSTA</label>
              <div className="textarea-wrapper">
                <textarea 
                  placeholder="Escreva em até 300 caracteres..."
                  className="form-input form-textarea"
                  maxLength={300}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                ></textarea>
                <div className="char-count">{300 - text.length} caracteres restantes</div>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkbox-text">
                  Autorizo a EasyPlan a utilizar minha resposta em comunicações internas, apresentações corporativas e materiais institucionais.
                </span>
              </label>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Enviar depoimento</button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
