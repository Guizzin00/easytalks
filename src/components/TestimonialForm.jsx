import React, { useState } from "react";
import { Send } from "lucide-react";
import "./TestimonialForm.css";

export default function TestimonialForm() {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    // Mock submission logic
    console.log("Testimonial submitted:", text);
    setText("");
    alert("Depoimento enviado com sucesso! Muito obrigado.");
  };

  return (
    <div className="testimonial-section animate-fade-in delay-4">
      <form
        className={`testimonial-form glass-panel ${isFocused ? "focused" : ""}`}
        onSubmit={handleSubmit}
      >
        <textarea
          className="testimonial-input"
          placeholder="O que a EasyPlan significa para você?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={5}
        ></textarea>

        <div className="form-footer">
          <span className="char-count">{text.length} caracteres</span>
          <button type="submit" className="submit-btn" disabled={!text.trim()}>
            <span>Enviar</span>
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
