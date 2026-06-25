import React, { useEffect, useRef, useState, useMemo } from 'react';
import WordCloudLib from 'wordcloud';
import { processWordCloudData } from '../lib/wordCloudEngine';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { DownloadCloud } from 'lucide-react';
import './WordCloud.css';

export default function WordCloud({ messages }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });

  // 1. Extrair strings das mensagens
  const statements = useMemo(() => messages.map(m => m.text), [messages]);
  
  // 2. Processar via Motor NLP
  const processedData = useMemo(() => processWordCloudData(statements).slice(0, 50), [statements]);

  useEffect(() => {
    if (!canvasRef.current || processedData.length === 0) return;

    // A biblioteca espera a lista no formato [ ['palavra', tamanho], ... ]
    // Definimos o peso com base no valor máximo para não estourar a tela.
    const maxVal = processedData[0].value;
    const sizeMultiplier = 90 / maxVal; // Peso visual no canvas

    const list = processedData.map(item => [
      item.text, 
      Math.max(16, item.value * sizeMultiplier), // Tamanho em pixels
      item.value, // Guarda a frequência original na posição 2
      item.percentage // Guarda o percentual na posição 3
    ]);

    const colors = ["#00A6B9", "#72BF44", "#FDC500", "#1a1a1a", "#008b9b", "#22c55e"];

    WordCloudLib(canvasRef.current, {
      list: list,
      fontFamily: '"Playfair Display", serif',
      fontWeight: 'bold',
      color: () => colors[Math.floor(Math.random() * colors.length)],
      backgroundColor: 'transparent',
      rotateRatio: 0.2,
      rotationSteps: 2,
      gridSize: 12,
      shrinkToFit: true,
      hover: (item, dimension, event) => {
        if (!item) {
          setTooltip({ show: false, text: '', x: 0, y: 0 });
          return;
        }
        // item = [text, size, freq, percent]
        setTooltip({
          show: true,
          text: `"${item[0]}": ${item[2]} repetições (${item[3]}%)`,
          x: event.clientX,
          y: event.clientY
        });
      }
    });

  }, [processedData]);

  const handleDownload = async () => {
    if (!containerRef.current) return;
    const canvasObj = await html2canvas(containerRef.current, { scale: 2, backgroundColor: "#ffffff" });
    canvasObj.toBlob((blob) => {
      saveAs(blob, "easyplan_nuvem_de_palavras.jpg");
    }, "image/jpeg", 0.95);
  };

  if (!processedData || processedData.length === 0) {
    return (
      <div className="wordcloud-empty">
        <p>Aguardando mensagens para gerar a Nuvem de Palavras.</p>
      </div>
    );
  }

  return (
    <div className="wordcloud-container">
      {tooltip.show && (
        <div className="wordcloud-tooltip" style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}>
          {tooltip.text}
        </div>
      )}
      
      <div className="wordcloud-header">
        <div>
          <h2>Nuvem de Palavras</h2>
          <p>Motor de Processamento de Linguagem Natural (NLP) ativo. Analisando todos os depoimentos.</p>
        </div>
        <button className="btn-export btn-export-highlight" onClick={handleDownload}>
          <DownloadCloud size={16} /> Baixar JPG
        </button>
      </div>
      
      <div className="wordcloud-canvas-wrapper" ref={containerRef}>
         {/* O width/height determina o espaço de "desenho" físico da lib */}
         <canvas ref={canvasRef} width={900} height={400} className="wordcloud-canvas-element" />
         <div className="wordcloud-watermark">
          <img src="/logo.png" alt="EasyPlan" />
        </div>
      </div>
    </div>
  );
}
