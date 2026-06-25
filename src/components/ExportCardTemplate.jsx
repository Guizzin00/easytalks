import React, { forwardRef } from 'react';
import './ExportCardTemplate.css';

const ExportCardTemplate = forwardRef(({ message }, ref) => {
  if (!message) return null;

  return (
    <div className="export-wrapper" style={{ position: "absolute", top: "-9999px", left: "-9999px", opacity: 0, zIndex: -1 }}>
      <div ref={ref} className="export-card">
        <div className="export-card-content">
          <div className="quote-mark">"</div>
          <p className="export-text">{message.text}</p>
          <div className="export-footer">
            <div className="export-logo-area" style={{ width: "100%", display: "flex", justifyContent: "flex-start" }}>
              <img src="/ativo21.svg" alt="EasyPlan Logo" className="export-logo-large" />
            </div>
          </div>
        </div>
        <div className="export-bottom-bar"></div>
      </div>
    </div>
  );
});

export default ExportCardTemplate;
