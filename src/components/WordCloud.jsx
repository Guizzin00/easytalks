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
    const sizeMultiplier = 360 / maxVal; // 120 * 3 para suportar a tela 3x maior (Alta Resolução)

    const list = processedData.map(item => [
      item.text, 
      Math.max(48, item.value * sizeMultiplier), // Tamanhos nativos 3x maiores
      item.value,
      item.percentage
    ]);

    const colors = ["#00A6B9", "#72BF44", "#FDC500", "#006EA0"];

    WordCloudLib(canvasRef.current, {
      list: list,
      fontFamily: '"Inter", sans-serif',
      fontWeight: 'bold',
      color: () => colors[Math.floor(Math.random() * colors.length)],
      backgroundColor: 'transparent',
      minRotation: -Math.PI / 2, /* Permite rotação de -90 graus */
      maxRotation: Math.PI / 2,  /* Permite rotação de 90 graus */
      rotationSteps: 2, /* Força a ser apenas Horizontal ou Vertical perfeito (sem diagonais bagunçadas) */
      rotateRatio: 0.4, /* 40% das palavras vão ficar na vertical para dar o charme clássico da nuvem */
      gridSize: 30, /* Ajustado para a resolução 3x */
      shape: 'circle',
      ellipticity: 0.5, /* Como o canvas é retangular (900x400), o círculo vira um oval longo que preenche tudo! */
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
    
    // Simula a largura de tela de um computador (Desktop) no html2canvas
    // Isso impede que o design se quebre ou "junte tudo" ao baixar pelo celular.
    const canvasObj = await html2canvas(containerRef.current, { 
      scale: 3, 
      backgroundColor: "#ffffff",
      windowWidth: 1200
    });

    canvasObj.toBlob((blob) => {
      saveAs(blob, "easyplan_nuvem_de_palavras.png");
    }, "image/png");
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
          <DownloadCloud size={16} /> Baixar PNG
        </button>
      </div>
      
      <div className="wordcloud-canvas-wrapper" ref={containerRef}>
         {/* Resolução nativa 3x maior (2700x1200) comprimida via CSS para super nitidez */}
         <canvas ref={canvasRef} width={2700} height={1200} style={{ width: '100%', maxWidth: '900px', height: 'auto' }} className="wordcloud-canvas-element" />
         <div className="wordcloud-watermark">
          <img src="/Ativo%2020.svg" alt="EasyPlan Logo" />
        </div>
      </div>
    </div>
  );
}
