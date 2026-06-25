import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";
import { MessageSquare, Calendar, Building2, UserCircle, CheckCircle2, LogOut, Download, Search, Filter, FileText, FileSpreadsheet, Image as ImageIcon, Archive } from "lucide-react";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ExportCardTemplate from "../components/ExportCardTemplate";
import WordCloud from "../components/WordCloud";
import "./Admin.css";

export default function AdminPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States para Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [departments, setDepartments] = useState([]);

  // States para Exportação
  const [exportingMessage, setExportingMessage] = useState(null);
  const exportCardRef = useRef(null);
  const [isExportingZip, setIsExportingZip] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("easyplan_auth") !== "true") {
      navigate("/auth");
      return;
    }
    fetchMessages();
  }, [navigate]);

  useEffect(() => {
    // Aplicar filtros
    let result = messages;
    if (searchTerm) {
      result = result.filter(msg => 
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (departmentFilter) {
      result = result.filter(msg => msg.department === departmentFilter);
    }
    setFilteredMessages(result);
  }, [messages, searchTerm, departmentFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error("Credenciais do Supabase ausentes no .env");
      }
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMessages(data || []);
      
      // Extrair departamentos únicos
      if (data) {
        const uniqueDepts = [...new Set(data.map(msg => msg.department))].filter(Boolean);
        setDepartments(uniqueDepts.sort());
      }
      
    } catch (err) {
      console.error("Erro ao carregar:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (window.confirm("Atenção: Isso vai deletar todos os depoimentos do banco de dados permanentemente. Continuar?")) {
      try {
        const { error } = await supabase
          .from('messages')
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); 
          
        if (error) throw error;
        setMessages([]);
      } catch (err) {
        alert("Não foi possível apagar as mensagens. Verifique as políticas do RLS.");
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("easyplan_auth");
    navigate("/auth");
  };

  // Funções de Exportação
  const exportTXT = () => {
    let content = "DEPOIMENTOS EASYPLAN\n\n";
    filteredMessages.forEach(msg => {
      content += `Nome: ${msg.name}\n`;
      content += `Departamento: ${msg.department}\n`;
      content += `Data: ${new Date(msg.created_at).toLocaleString('pt-BR')}\n`;
      content += `Mensagem: "${msg.text}"\n`;
      content += `Autorizou Uso: ${msg.consent ? 'Sim' : 'Não'}\n`;
      content += `-------------------------------------------------\n\n`;
    });
    
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "depoimentos_easyplan.txt");
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredMessages.map(msg => ({
      Nome: msg.name,
      Departamento: msg.department,
      Mensagem: msg.text,
      Autorizou: msg.consent ? 'Sim' : 'Não',
      Data: new Date(msg.created_at).toLocaleString('pt-BR')
    })));
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "depoimentos_easyplan.csv");
  };

  const exportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(filteredMessages.map(msg => ({
      Nome: msg.name,
      Departamento: msg.department,
      Mensagem: msg.text,
      Autorizou: msg.consent ? 'Sim' : 'Não',
      Data: new Date(msg.created_at).toLocaleString('pt-BR')
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Depoimentos");
    XLSX.writeFile(wb, "depoimentos_easyplan.xlsx");
  };

  const captureCardJPG = async (msg) => {
    setExportingMessage(msg);
    // Aguardar o react renderizar o card escondido
    setTimeout(async () => {
      if (exportCardRef.current) {
        const canvas = await html2canvas(exportCardRef.current, { scale: 3, useCORS: true, logging: false });
        canvas.toBlob((blob) => {
          saveAs(blob, `card_easyplan_${msg.name.replace(/\s+/g, '_')}.png`);
          setExportingMessage(null);
        }, "image/png");
      }
    }, 500);
  };

  const exportAllZip = async () => {
    if (filteredMessages.length === 0) return;
    setIsExportingZip(true);
    const zip = new JSZip();
    const folder = zip.folder("cards_easyplan");

    for (let i = 0; i < filteredMessages.length; i++) {
      const msg = filteredMessages[i];
      setExportingMessage(msg);
      
      await new Promise(resolve => setTimeout(resolve, 300)); // wait render
      
      if (exportCardRef.current) {
        const canvas = await html2canvas(exportCardRef.current, { scale: 3, useCORS: true, logging: false });
        const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
        folder.file(`card_${msg.name.replace(/\s+/g, '_')}.png`, blob);
      }
    }

    setExportingMessage(null);
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "todos_cards_easyplan.zip");
    setIsExportingZip(false);
  };

  return (
    <div className="admin-wrapper">
      <Header />
      <main className="admin-main">
        <div className="admin-container">
          <header className="admin-header animate-fade-in">
            <div className="admin-header-content">
              <h1 className="admin-title">
                Coleção Visual de Depoimentos
              </h1>
              <p className="admin-subtitle">
                "Em poucas palavras, conte o que a EasyPlan significa para você. 
                Suas palavras vão compor uma coleção visual de depoimentos que 
                celebram nossa cultura e os bastidores do que construímos juntos."
              </p>
            </div>
            <div className="admin-header-actions">
              <button className="btn-glass btn-danger" onClick={handleClear}>
                Limpar Banco
              </button>
              <button className="btn-glass" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={16} />
                Sair
              </button>
            </div>
          </header>

          <WordCloud messages={messages} />

          {/* Barra de Filtros e Exportação */}
          <div className="admin-toolbar animate-fade-in delay-1">
            <div className="toolbar-filters">
              <div className="filter-input-wrapper">
                <Search className="filter-icon" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar por nome..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="filter-input"
                />
              </div>
              <div className="filter-input-wrapper">
                <Filter className="filter-icon" size={18} />
                <select 
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Todos os Departamentos</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="toolbar-exports">
              <button className="btn-export" onClick={exportTXT} title="Exportar para Bloco de Notas"><FileText size={16} /> TXT</button>
              <button className="btn-export" onClick={exportCSV} title="Exportar para Excel (CSV)"><FileSpreadsheet size={16} /> CSV</button>
              <button className="btn-export" onClick={exportXLSX} title="Exportar Planilha Excel"><FileSpreadsheet size={16} /> XLSX</button>
              <button className="btn-export btn-export-highlight" onClick={exportAllZip} disabled={isExportingZip}>
                {isExportingZip ? (
                  <><span className="spinner-small"></span> Processando...</>
                ) : (
                  <><Archive size={16} /> ZIP (Todos JPG)</>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="admin-error-banner animate-fade-in delay-1">
              <strong>Erro de Conexão:</strong> {error}. Verifique se você adicionou as chaves no .env.
            </div>
          )}

          {loading ? (
            <div className="admin-loading">
              <div className="spinner"></div>
              <p>Carregando depoimentos...</p>
            </div>
          ) : (
            <div className="messages-grid">
              {filteredMessages.length === 0 ? (
                <div className="empty-state animate-fade-in delay-2">
                  <div className="empty-icon-wrapper">
                    <MessageSquare size={48} strokeWidth={1.5} />
                  </div>
                  <h3>Nenhum depoimento encontrado</h3>
                  <p>Não há depoimentos compatíveis com seus filtros atuais.</p>
                </div>
              ) : (
                filteredMessages.map((msg, index) => (
                  <div 
                    key={msg.id} 
                    className="premium-card animate-fade-in"
                    style={{ animationDelay: `${0.05 * index}s` }}
                  >
                    <div className="card-top-accent"></div>
                    <div className="card-content">
                      <div className="card-header">
                        <div className="card-user-info">
                          <UserCircle className="user-icon" />
                          <h3 className="card-name">{msg.name}</h3>
                        </div>
                        {msg.consent && (
                          <div className="consent-badge" title="Autorizou uso da imagem/depoimento">
                            <CheckCircle2 size={16} />
                            <span>Aprovado</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="card-meta">
                        <span className="meta-item">
                          <Building2 size={14} />
                          {msg.department.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="card-body">
                        <p className="card-text">"{msg.text}"</p>
                      </div>
                      
                      <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="meta-item">
                          <Calendar size={14} />
                          <time>{new Date(msg.created_at).toLocaleDateString('pt-BR')}</time>
                        </div>
                        <button 
                          className="btn-download-jpg" 
                          onClick={() => captureCardJPG(msg)}
                          title="Gerar Imagem JPG deste depoimento"
                        >
                          <ImageIcon size={16} />
                          JPG
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Componente Invisível para Renderização JPG */}
      <ExportCardTemplate ref={exportCardRef} message={exportingMessage} />
    </div>
  );
}
