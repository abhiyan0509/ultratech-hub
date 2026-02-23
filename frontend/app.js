import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  BarChart3,
  Users,
  MessageSquare,
  FileDown,
  RotateCw,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Zap,
  ShieldCheck,
  Target,
  Maximize2,
  Moon,
  Sun,
  Handshake,
  X
} from 'lucide-react';

const html = htm.bind(React.createElement);

// --- Global UI Components ---

const Icon = ({ name: IconComp, className = "w-5 h-5" }) => {
  return html`<${IconComp} className=${className} />`;
};

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return html`
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" 
      style=${{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', zIndex: 300 }}
      onClick=${onClose}
    >
      <div 
        className="w-full max-w-5xl glass-panel relative rounded-3xl overflow-hidden shadow-premium transition-all duration-500 scale-100" 
        style=${{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(212, 175, 55, 0.2)' }}
        onClick=${e => e.stopPropagation()}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="p-6 border-b border-slate-200 dark:border-obsidian-border flex items-center justify-between bg-white/80 dark:bg-obsidian-card/80 backdrop-blur-xl relative z-10">
          <h3 className="text-xl font-bold dark:text-white capitalize-first">${title}</h3>
          <button onClick=${onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-obsidian-hover rounded-xl transition-colors">
            <${Icon} name=${X} className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50/50 dark:bg-obsidian/40 flex-1">
          ${children}
        </div>
      </div>
    </div>
  `;
};

// --- SUBSIDIARY COMPONENTS ---

const Header = ({ onRefresh, onExport, status, onSearchOpen, theme, onThemeToggle }) => {
  return html`
    <header className="fixed top-0 left-0 right-0 h-16 glass-panel z-50 px-6 flex items-center justify-between border-b border-slate-200/50 dark:border-obsidian-border/50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-gold p-1.5 rounded-lg shadow-[0_4px_12px_rgba(212,175,55,0.2)]">
             <div className="text-obsidian font-black italic text-xl tracking-tighter">UT</div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 dark:text-white font-bold text-sm tracking-wide uppercase leading-tight">Executive Intelligence</h1>
            <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">UltraTech Cement Platform</span>
          </div>
        </div>
        <button 
          onClick=${onSearchOpen}
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100/50 dark:bg-obsidian-border/30 border border-slate-200 dark:border-obsidian-border text-slate-500 text-xs hover:border-gold/30 transition-all group shadow-sm"
        >
          <${Icon} name=${Search} className="w-4 h-4 group-hover:text-gold transition-colors" />
          <span>Search Intelligence Assets...</span>
          <span className="ml-8 px-1.5 py-0.5 rounded bg-white dark:bg-obsidian border border-slate-200 dark:border-obsidian-border text-[10px] italic font-mono">Ctrl+K</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] uppercase font-black tracking-wider">${status}</span>
        </div>

        <button 
          onClick=${onThemeToggle}
          className="p-2 rounded-xl border border-slate-200 dark:border-obsidian-border text-slate-500 dark:text-slate-400 hover:text-gold dark:hover:text-gold hover:bg-slate-100 dark:hover:bg-obsidian-hover transition-all active:scale-95 shadow-sm"
          title=${`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          <${Icon} name=${theme === 'dark' ? Sun : Moon} className="w-4.5 h-4.5" />
        </button>
        
        <button onClick=${onExport} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-obsidian-border text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-hover transition-all text-xs font-bold shadow-sm">
           <${Icon} name=${FileDown} className="w-4 h-4" />
           Export
        </button>
        
        <button onClick=${onRefresh} className="p-2 rounded-xl border border-slate-200 dark:border-obsidian-border text-slate-500 dark:text-slate-400 hover:text-gold hover:bg-slate-100 dark:hover:bg-obsidian-hover transition-all group active:scale-90 shadow-sm">
           <${Icon} name=${RotateCw} className="w-4.5 h-4.5 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </header>
  `;
};

const MetricCard = ({ label, value, sub, trend, loading }) => {
  const isPositive = trend > 0;
  return html`
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between group hover:border-gold/40 transition-all duration-500 shadow-sm hover:shadow-premium h-36 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-gold/15 transition-all duration-700"></div>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">${label}</span>
        ${trend && html`
          <div className=${`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black ${isPositive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' : 'bg-rose-500/10 text-rose-600 dark:text-rose-500'}`}>
            <${Icon} name=${isPositive ? ArrowUpRight : ArrowDownRight} className="w-3 h-3" />
            ${Math.abs(trend)}%
          </div>
        `}
      </div>
      <div className="relative z-10">
        <div className=${`text-3xl font-black text-slate-900 dark:text-white mb-1.5 tracking-tighter ${loading ? 'animate-shimmer rounded h-9 w-2/3 opacity-10 bg-gold/10' : ''}`}>
           ${!loading && value}
        </div>
        <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest opacity-60">${sub}</div>
      </div>
    </div>
  `;
};

const ChartCard = ({ title, subtitle, loading, data, config = {}, onExpand, activeTimeframe, onTimeframeChange }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (loading || !chartRef.current || !data || !Array.isArray(data.labels)) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d');
    const isDark = document.documentElement.classList.contains('dark');
    const accentColor = '#d4af37';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    const textColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

    chartInstance.current = new window.Chart(ctx, {
      type: config.type || 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: { left: 0, right: 10, top: 10, bottom: 0 }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111114',
            titleColor: accentColor,
            bodyColor: '#fff',
            borderColor: 'rgba(212,175,55,0.2)',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            bodyFont: { family: 'Inter', size: 10 }
          }
        },
        scales: {
          x: {
            display: true,
            grid: { display: false },
            ticks: {
              display: true,
              color: textColor,
              font: { size: 9, weight: 'bold' },
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6
            }
          },
          y: {
            display: true,
            position: 'right',
            grid: { color: gridColor },
            ticks: {
              display: true,
              color: textColor,
              font: { size: 9, weight: 'bold' },
              callback: (value) => '₹' + (value / 1000).toFixed(1) + 'k'
            }
          }
        },
        interaction: { intersect: false, mode: 'index' },
        elements: {
          line: {
            tension: 0.4,
            borderColor: accentColor,
            borderWidth: 2,
            fill: true,
            backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return null;
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, 'rgba(212, 175, 55, 0.15)');
              gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
              return gradient;
            }
          },
          point: { radius: 0, hoverRadius: 5, hoverBackgroundColor: accentColor, hoverBorderColor: '#fff', hoverBorderWidth: 2 }
        }
      }
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [loading, data]);

  return html`
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col group hover:border-gold/30 transition-all shadow-sm bg-white/40 dark:bg-obsidian-card/40 relative overflow-hidden">
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-gold/10 transition-all duration-700"></div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
           <h3 className="text-slate-900 dark:text-white text-sm font-black tracking-tight uppercase">${title}</h3>
           <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-bold opacity-70">${subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          ${onTimeframeChange && html`
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-obsidian-border/30 rounded-lg shadow-inner">
               ${['1M', '6M', '1Y'].map(t => html`
                  <button 
                    key=${t} 
                    onClick=${() => onTimeframeChange(t)}
                    className=${`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${activeTimeframe === t ? 'bg-gold text-obsidian shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    ${t}
                  </button>
               `)}
            </div>
          `}
          ${onExpand && html`
            <button onClick=${onExpand} className="p-2 text-slate-400 hover:text-gold transition-colors active:scale-90" title="Expand View">
              <${Icon} name=${Maximize2} className="w-3.5 h-3.5" />
            </button>
          `}
        </div>
      </div>
      <div className="flex-1 min-h-[180px] relative overflow-hidden">
        ${loading && html`<div className="absolute inset-0 animate-shimmer rounded-xl opacity-10 bg-gold/5 z-10"></div>`}
        <canvas ref=${chartRef} className="absolute inset-0 w-full h-full"></canvas>
      </div>
    </div>
  `;
};

// ... Module components remain same but I'll export them later ...

const NewsModule = ({ data, loading }) => {
  const newsItems = Array.isArray(data) ? data : (data?.news || []);
  const safeNews = Array.isArray(newsItems) ? newsItems : [];

  return html`
    <div className="glass-panel p-7 rounded-3xl h-full flex flex-col shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-gold/10 transition-all duration-700 translate-x-1/2 -translate-y-1/2"></div>
      <div className="flex justify-between items-center mb-7 relative z-10">
        <h2 className="text-slate-900 dark:text-white text-lg font-black flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gold rounded-full shadow-[0_0_12px_rgba(212,175,55,0.4)]"></div>
            Market Intelligence
        </h2>
        <span className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] opacity-60">Live Signals</span>
      </div>
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
        ${loading ? html`
          ${[1, 2, 3, 4, 5].map(i => html`<div key=${i} className="animate-shimmer h-20 w-full rounded-2xl mb-4 opacity-5 bg-gold/5"></div>`)}
        ` : safeNews.slice(0, 10).map((item, i) => html`
          <a key=${i} href=${item.url || item.link} target="_blank" className="block p-4 rounded-2xl bg-white/50 dark:bg-obsidian-card/40 border border-slate-200 dark:border-obsidian-border hover:border-gold/30 hover:bg-slate-50 dark:hover:bg-obsidian-hover transition-all group relative overflow-hidden shadow-sm">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
            <div className="flex justify-between items-start mb-2">
               <span className="text-[10px] text-gold font-black uppercase tracking-widest">${item.source || 'Standard'}</span>
               <span className="text-[10px] text-slate-500 font-medium">${item.date}</span>
            </div>
            <h3 className="text-slate-700 dark:text-slate-200 text-xs font-bold leading-relaxed group-hover:text-slate-900 dark:group-hover:text-white transition-colors line-clamp-2">
              ${item.title}
            </h3>
          </a>
        `)}
      </div>
    </div>
  `;
};

const M_A_Module = ({ data, loading }) => {
  const deals = Array.isArray(data) ? data : (data?.deals || []);

  return html`
    <div className="glass-panel p-7 rounded-3xl h-full flex flex-col shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700 translate-x-1/2 -translate-y-1/2"></div>
      <div className="flex justify-between items-center mb-7 relative z-10">
        <h2 className="text-slate-900 dark:text-white text-lg font-black flex items-center gap-3">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
            M&A Pipeline
        </h2>
        <span className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] opacity-60">Transaction Flow</span>
      </div>
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
        ${loading ? html`
          ${[1, 2, 3].map(i => html`<div key=${i} className="animate-shimmer h-28 rounded-2xl bg-emerald-500/5 opacity-10"></div>`)}
        ` : (deals || []).map((deal, i) => html`
          <div key=${i} className="p-4 rounded-2xl bg-white/50 dark:bg-obsidian-card/40 border border-slate-200 dark:border-obsidian-border relative group shadow-sm transition-all hover:border-emerald-500/30">
            <div className="flex justify-between items-start mb-2">
               <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest">${deal.status || 'Active'}</span>
               <span className="text-[10px] text-slate-500 font-medium">${deal.date}</span>
            </div>
            <h3 className="text-slate-900 dark:text-white text-xs font-black mb-2">${deal.target || deal.title}</h3>
            <div className="flex items-center gap-4">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Value: <span className="text-emerald-600 dark:text-emerald-400 font-black">${deal.value}</span></div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium italic">${deal.advisor || 'Multi-Source'}</div>
            </div>
            <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">
              ${deal.impact || deal.details}
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
};

const CompetitorGrid = ({ data, loading }) => {
  const compData = data?.competitors || data;
  const compItems = useMemo(() => {
    if (Array.isArray(compData)) return compData;
    if (compData && typeof compData === 'object') {
      return Object.entries(compData).sort((a, b) => (b[1].capacity_mtpa || 0) - (a[1].capacity_mtpa || 0)).map(([name, profile]) => ({
        name: name,
        ...profile
      }));
    }
    return [];
  }, [compData]);

  return html`
    <div className="glass-panel p-7 rounded-3xl h-full flex flex-col shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-gold/10 transition-all duration-700 translate-x-1/2 -translate-y-1/2"></div>
      <div className="flex justify-between items-center mb-7 relative z-10">
        <h2 className="text-slate-900 dark:text-white text-lg font-black flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gold rounded-full shadow-[0_0_12px_rgba(212,175,55,0.4)]"></div>
            Sector Landscape
        </h2>
        <span className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em] opacity-60">Benchmark Analysis</span>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        ${loading ? html`
          ${[1, 2, 3, 4, 5, 6].map(i => html`<div key=${i} className="animate-shimmer h-24 rounded-2xl bg-gold/5 opacity-5"></div>`)}
        ` : compItems.map((comp, i) => html`
          <div key=${i} className="p-4 rounded-2xl bg-white/50 dark:bg-obsidian-card/40 border border-slate-200 dark:border-obsidian-border flex flex-col justify-between group hover:bg-slate-50 dark:hover:bg-obsidian-hover hover:border-emerald-500/20 transition-all duration-500 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
               <${Icon} name=${Target} className="w-8 h-8 text-slate-400 dark:text-white" />
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-black tracking-tight mb-2 group-hover:text-gold transition-colors">${comp.name}</div>
            <div>
              <div className="text-slate-900 dark:text-white font-black text-lg leading-none group-hover:scale-105 transition-transform origin-left lowercase tabular-nums">${comp.capacity_mtpa || comp.capacity || 'N/A'} <span className="text-[11px] text-slate-500 font-medium uppercase">MTPA</span></div>
              <div className="text-[10px] text-slate-500 mt-2 font-bold tracking-wide">
                ${comp.market_share ? comp.market_share + ' Market Share' : comp.valuation || 'Cement Sector'}
              </div>
            </div>
          </div>
        `)}
      </div>
    </div>
  `;
};

const ResearchAssistant = ({ isOpen, onClose, data }) => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Welcome to the Research Assistant. I have interrogated UltraTech's operational, financial, and macro intelligence feeds. How can I assist your analysis?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (customMsg) => {
    const userMsg = customMsg || input;
    if (!userMsg.trim()) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const res = await fetch(`${window.API_BASE || ''}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg })
      });
      const result = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: result.answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "⚠️ Intelligence engine offline. Please retry." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return html`
    <div className=${`fixed inset-y-0 right-0 w-[450px] glass-panel z-[100] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl flex flex-col border-l border-slate-200 dark:border-obsidian-border ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 border-b border-slate-200 dark:border-obsidian-border/50 flex items-center justify-between bg-white dark:bg-obsidian-card/40 backdrop-blur-3xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold/10 rounded-xl">
             <${Icon} name=${MessageSquare} className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="text-slate-900 dark:text-white font-black text-sm tracking-tight uppercase">Intelligence Assistant</h3>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_#d4af37]"></div>
               <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Model 1.5 Live</span>
            </div>
          </div>
        </div>
        <button onClick=${onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-obsidian-hover rounded-full transition-colors group">
          <${Icon} name=${ChevronRight} className="w-5 h-5 text-slate-500 group-hover:text-gold transition-colors" />
        </button>
      </div>

      <div ref=${scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-slate-100/50 dark:to-obsidian/40">
        ${messages.map((msg, i) => html`
          <div key=${i} className=${`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className=${`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm font-medium ${msg.role === 'user'
      ? 'bg-gold text-obsidian font-bold rounded-br-none'
      : 'bg-white dark:bg-obsidian-card border border-slate-200 dark:border-obsidian-border text-slate-700 dark:text-slate-300 rounded-bl-none'
    }`}>
              ${msg.text}
            </div>
          </div>
        `)}
        ${isTyping && html`
          <div className="flex justify-start">
             <div className="bg-white dark:bg-obsidian-card border border-slate-200 dark:border-obsidian-border p-5 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex gap-1.5">
                   <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce delay-150"></div>
                   <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce delay-300"></div>
                </div>
             </div>
          </div>
        `}
      </div>

      <div className="p-6 border-t border-slate-200 dark:border-obsidian-border/50 bg-white/80 dark:bg-obsidian-card/60 backdrop-blur-2xl">
        <div className="relative group">
          <input 
            value=${input}
            onChange=${e => setInput(e.target.value)}
            onKeyDown=${e => e.key === 'Enter' && handleSend()}
            placeholder="Interrogate intelligence assets..." 
            className="w-full bg-slate-100 dark:bg-obsidian border border-slate-200 dark:border-obsidian-border rounded-xl py-4 pl-4 pr-12 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-gold/50 transition-all shadow-inner"
          />
          <button onClick=${() => handleSend()} className="absolute right-2 top-2 p-2 bg-gold text-obsidian hover:bg-obsidian-hover hover:text-white rounded-lg transition-all active:scale-90 shadow-md">
            <${Icon} name=${ArrowUpRight} className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          ${["M&A Outlook", "Risk Analysis", "ESG Scorecard", "Market Pulse"].map(chip => html`
             <button key=${chip} onClick=${() => handleSend(chip)} className="whitespace-nowrap px-4 py-2 rounded-xl border border-slate-200 dark:border-obsidian-border text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-gold hover:border-gold/30 hover:bg-slate-50 dark:hover:bg-obsidian-hover transition-all shadow-sm">
               ${chip}
             </button>
          `)}
        </div>
      </div>
    </div>
  `;
};

const CommandK = ({ isOpen, onClose, onAction }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const items = [
    { id: 'overview', icon: LayoutDashboard, label: 'Executive Overview', sub: 'Aggregated Portfolio Dossier', color: 'text-gold' },
    { id: 'outlook', icon: TrendingUp, label: 'Strategic Outlook', sub: 'Market Mood & Signals', color: 'text-emerald-500' },
    { id: 'financials', icon: BarChart3, label: 'LTM Financials', sub: 'Peer Benchmarking Scorecards', color: 'text-blue-500' },
    { id: 'assistant', icon: MessageSquare, label: 'Interrogate AI Assistant', sub: 'Contextual Research Feed', color: 'text-orange-500' }
  ];

  return html`
    <div className="fixed inset-0 z-[110] flex items-start justify-center pt-[15vh] px-4" onClick=${onClose}>
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-obsidian/80 backdrop-blur-md"></div>
      <div className="w-full max-w-2xl glass-panel bg-white dark:bg-obsidian-card relative rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300" onClick=${e => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-200 dark:border-obsidian-border/50 flex items-center gap-4">
          <${Icon} name=${Search} className="w-6 h-6 text-gold" />
          <input 
            autoFocus
            placeholder="Search Intelligence Assets (Ctrl+K)..." 
            className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full text-lg font-bold placeholder-slate-400 dark:placeholder-slate-600"
            value=${query}
            onChange=${e => setQuery(e.target.value)}
          />
        </div>
        <div className="p-2 max-h-[450px] overflow-y-auto custom-scrollbar">
           <div className="px-4 py-3 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">Platform Actions</div>
           ${items.map((item, i) => html`
             <button key=${item.id} onClick=${() => onAction(item.id)} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-slate-50 dark:hover:bg-obsidian-hover transition-all group text-left">
                <div className=${`p-2.5 bg-slate-100 dark:bg-obsidian rounded-xl border border-slate-200 dark:border-obsidian-border group-hover:scale-110 transition-transform ${item.color}`}>
                   <${Icon} name=${item.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1">
                   <div className="text-slate-900 dark:text-slate-200 text-sm font-black group-hover:text-gold transition-colors">${item.label}</div>
                   <div className="text-slate-500 text-[10px] tracking-widest uppercase font-bold mt-0.5">${item.sub}</div>
                </div>
                <${Icon} name=${ChevronRight} className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-gold group-hover:translate-x-1 transition-all" />
             </button>
           `)}
        </div>
        <div className="p-4 bg-slate-50 dark:bg-obsidian-border/20 border-t border-slate-200 dark:border-obsidian-border text-[10px] font-black text-slate-400 dark:text-slate-600 flex justify-between items-center tracking-widest uppercase">
           <span>Select Item with ↑↓ and Enter</span>
           <span className="flex gap-4">
              <span className="flex items-center gap-1.5 font-mono"><span className="px-1.5 py-0.5 rounded bg-white dark:bg-obsidian border border-slate-200 dark:border-obsidian-border text-slate-400 uppercase">ESC</span> to Close</span>
           </span>
        </div>
      </div>
    </div>
  `;
};

const BentoGrid = ({ data, loading, onShowChart }) => {
  const [timeframe, setTimeframe] = useState('1M');

  const stockChartData = useMemo(() => {
    const history = data?.financials?.companies?.['UltraTech Cement']?.price_history;
    if (!Array.isArray(history)) return null;

    // Define slice sizes: 1M ~ 30, 6M ~ 180, 1Y ~ 365
    let slice = 30;
    if (timeframe === '6M') slice = 180;
    if (timeframe === '1Y') slice = 365;

    const recent = history.slice(-slice);
    return {
      labels: recent.map(d => d.date),
      datasets: [{
        data: recent.map(d => d.close),
        label: 'Price (NSE)'
      }]
    };
  }, [data, timeframe]);

  const pills = useMemo(() => {
    const p = data?.company_info?.strategic_focus || data?.company_info?.strategic_pillars || data?.company_info?.competitive_advantages;
    return Array.isArray(p) ? p : [];
  }, [data]);

  const company = data?.financials?.companies?.['UltraTech Cement'] || {};

  return html`
    <div className="mt-20 p-6 grid grid-cols-12 gap-6 max-w-[1700px] mx-auto pb-32">
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <${MetricCard} label="Market Capitalization" value=${company.market_cap || '₹3.75T'} sub="INR (Consolidated)" trend=${2.4} loading=${loading} />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <${MetricCard} label="Spot Exchange Price" value=${company.current_price || '₹12,748'} sub="NSE: ULTRACEMCO" trend=${company.ytd_return_raw || 1.2} loading=${loading} />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <${MetricCard} label="Operational Baseline" value=${data?.company_info?.capacity_mtpa || '183.1'} sub="MTPA Capacity (FY25)" loading=${loading} />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <${MetricCard} label="Premium Valuation" value=${company.pe_ratio || '48.9'} sub="P/E Multiplier (LTM)" loading=${loading} />
        </div>

        <!-- Strategic Dossier -->
        <div className="col-span-12 lg:col-span-9 glass-panel p-10 rounded-3xl min-h-[500px] shadow-sm relative overflow-hidden group/dossier">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none group-hover/dossier:bg-gold/10 transition-all duration-1000 -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none group-hover/dossier:bg-emerald-500/10 transition-all duration-1000 translate-y-1/2 -translate-x-1/4"></div>
            <div className="flex justify-between items-center mb-10 relative z-10">
                <h2 className="text-slate-900 dark:text-white text-xl font-black flex items-center gap-4">
                   <div className="w-2 h-8 bg-gold rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
                   Strategic Asset Dossier
                </h2>
                <div className="flex items-center gap-4">
                   <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-[0.4em] opacity-50">Confidential | V7.5 Intelligence</span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 h-full relative z-10">
                <div className="md:col-span-4 flex flex-col gap-6">
                    <div className=${`text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-bold italic border-l-2 border-gold/40 pl-4 py-1 ${loading ? 'animate-shimmer h-32 w-full rounded-xl opacity-5' : ''}`}>
                        "${!loading && (data?.outlook?.executive_summary || data?.company_info?.description || 'Synchronizing platform assets...')}"
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-auto">
                        ${pills.slice(0, 3).map(pill => html`
                            <div key=${pill.title || pill} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-card/40 border border-slate-200 dark:border-obsidian-border group/pill hover:border-gold/30 transition-all cursor-default shadow-sm shadow-emerald-500/5">
                                <div className="text-gold group-hover/pill:scale-110 transition-transform"><${Icon} name=${TrendingUp} className="w-4 h-4" /></div>
                                <div className="text-slate-900 dark:text-white font-black text-[9px] uppercase tracking-[0.2em] line-clamp-1">${pill.title || pill}</div>
                            </div>
                        `)}
                    </div>
                </div>
                <div className="md:col-span-8 h-full min-h-[350px]">
                    <${ChartCard} 
                        title="Equity Performance" 
                        subtitle="Relative Returns Spectrum"
                        loading=${loading}
                        data=${stockChartData}
                        activeTimeframe=${timeframe}
                        onTimeframeChange=${setTimeframe}
                        onExpand=${() => onShowChart('equity', 'Equity Performance Spectrum', stockChartData)}
                    />
                </div>
            </div>
        </div>

        <!-- Sentiment Card -->
        <div className="col-span-12 lg:col-span-3 glass-panel p-10 rounded-3xl min-h-[500px] flex flex-col justify-between overflow-hidden relative shadow-sm group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <h2 className="text-slate-900 dark:text-white text-xl font-black flex justify-between items-center relative z-10">
                <span className="tracking-tight">Market Momentum</span>
                <${Icon} name=${TrendingUp} className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </h2>
            <div className="flex-1 flex flex-col items-center justify-center pt-2">
                <div className="relative w-48 h-24 overflow-hidden">
                    <div className="absolute top-0 left-0 w-48 h-48 border-[20px] border-slate-200 dark:border-obsidian-border/50 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-48 h-48 border-[20px] border-emerald-500 rounded-full clip-half-gauge transition-all duration-1000 ease-out" 
                         style=${{ transform: `rotate(${(data?.outlook?.mood_score || 0.65) * 180 - 180}deg)` }}></div>
                </div>
                <div className="text-center mt-6">
                    <div className="text-emerald-600 dark:text-emerald-400 uppercase font-black tracking-[0.4em] text-2xl">
                        ${data?.outlook?.mood_label || 'BULLISH'}
                    </div>
                    <div className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Confidence: 84.2%</div>
                </div>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-sm shadow-sm">
                <p className="text-slate-600 dark:text-slate-400 text-[10px] italic font-bold leading-relaxed text-center">
                    "${data?.outlook?.sentiment_analysis || 'Macro momentum remains resilient against cyclical sector headwinds.'}"
                </p>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-4 h-[550px] shadow-sm"><${NewsModule} data=${data?.news} loading=${loading} /></div>
        <div className="col-span-12 lg:col-span-4 h-[550px] shadow-sm"><${M_A_Module} data=${data?.ma_deals} loading=${loading} /></div>
        <div className="col-span-12 lg:col-span-4 h-[550px] shadow-sm"><${CompetitorGrid} data=${data?.competitors} loading=${loading} /></div>
    </div>
    `;
};

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('ut-theme') || 'light');
  const [modal, setModal] = useState({ isOpen: false, type: null, title: '', extra: null });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setModal(m => ({ ...m, isOpen: false }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('ut-theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const datasets = ['company_info', 'financials', 'ma_deals', 'competitors', 'news', 'outlook', 'macro'];
        const results = await Promise.all(
          datasets.map(ds => fetch(`${window.API_BASE || ''}/api/data/${ds}`).then(r => r.json()))
        );
        const combined = {};
        datasets.forEach((ds, i) => combined[ds] = results[i]);
        setData(combined);
        setLoading(false);
      } catch (e) {
        console.error("Data load error", e);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleSearchAction = (id) => {
    console.log('Action Triggered:', id);
    setIsSearchOpen(false); // Close search immediately

    if (id === 'assistant') {
      setIsAIOpen(true);
      return;
    }

    const titles = {
      'overview': 'Executive Performance Overview',
      'financials': 'LTM Competitive Benchmark',
      'outlook': 'Strategic Market Outlook',
      'equity': 'Equity Performance Spectrum'
    };

    setModal({
      isOpen: true,
      type: id,
      title: titles[id] || 'Intelligence Analysis',
      extra: null
    });
  };

  const showExpandedChart = (id, title, chartData) => {
    setModal({
      isOpen: true,
      type: 'chart',
      title: title,
      extra: chartData
    });
  };

  const renderModalContent = () => {
    if (!data) return html`<div className="p-12 text-center text-slate-500 font-bold uppercase tracking-[0.2em] animate-pulse">Synchronizing intelligence assets...</div>`;

    try {
      switch (modal.type) {
        case 'overview': {
          const company = data?.financials?.companies?.['UltraTech Cement'] || {};
          const focus = Array.isArray(data?.company_info?.strategic_focus) ? data.company_info.strategic_focus :
            Array.isArray(data?.company_info?.strategic_pillars) ? data.company_info.strategic_pillars :
              Array.isArray(data?.company_info?.competitive_advantages) ? data.company_info.competitive_advantages : [];

          return html`
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 rounded-2xl bg-gold/5 border border-gold/20">
                      <h4 className="text-gold font-black uppercase text-[10px] mb-3 tracking-widest">Market Position</h4>
                      <div className="text-3xl font-black dark:text-white tabular-nums">${company.market_cap || '₹3.75T'}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Consolidated Valuation</div>
                   </div>
                   <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                      <h4 className="text-emerald-500 font-black uppercase text-[10px] mb-3 tracking-widest">Operational Efficiency</h4>
                      <div className="text-3xl font-black dark:text-white tabular-nums">${data?.company_info?.capacity_mtpa || '183.1'}</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-widest">MTPA Active Capacity</div>
                   </div>
                </div>
                <div className="p-6 rounded-2xl bg-white dark:bg-obsidian-border/20 border border-slate-200 dark:border-obsidian-border shadow-sm">
                  <h4 className="text-slate-900 dark:text-white font-black uppercase text-[10px] mb-4 tracking-widest">Strategic Pillar Analysis</h4>
                  <div className="grid grid-cols-3 gap-4">
                     ${focus.slice(0, 6).map(f => html`
                       <div key=${f.title || f} className="text-center p-4 rounded-xl bg-slate-50 dark:bg-obsidian-card shadow-inner border border-slate-100 dark:border-obsidian-border">
                          <div className="text-gold mb-2 flex justify-center"><${Icon} name=${TrendingUp} className="w-5 h-5"/></div>
                          <div className="text-[10px] font-black uppercase tracking-tighter dark:text-slate-200">${f.title || f}</div>
                       </div>
                     `)}
                  </div>
                </div>
              </div>
            `;
        }

        case 'financials': {
          const companies = data?.financials?.companies || {};
          const peers = Object.entries(companies).slice(0, 10);
          return html`
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-obsidian-border">
                <table className="w-full text-left border-collapse bg-white dark:bg-obsidian-card">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-obsidian-border bg-slate-50 dark:bg-obsidian">
                      <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Corporation</th>
                      <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Market Cap</th>
                      <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">P/E Ratio</th>
                      <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">YTD Performance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-obsidian-border">
                    ${peers.map(([name, stats]) => html`
                      <tr key=${name} className="hover:bg-slate-50 dark:hover:bg-obsidian-hover transition-colors">
                        <td className="py-4 px-6 font-black text-xs dark:text-white">${name}</td>
                        <td className="py-4 px-6 text-[11px] font-bold dark:text-slate-300 tabular-nums">${stats.market_cap}</td>
                        <td className="py-4 px-6 text-[11px] font-bold dark:text-slate-300 tabular-nums">${stats.pe_ratio}</td>
                        <td className=${`py-4 px-6 text-[11px] font-black text-right ${parseFloat(stats.ytd_return) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          ${stats.ytd_return}
                        </td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            `;
        }

        case 'outlook': {
          const outlook = data?.outlook || {};
          const forecasts = Array.isArray(outlook.future_outlook) ? outlook.future_outlook : [];
          const risks = Array.isArray(outlook.risk_factors) ? outlook.risk_factors : [];

          return html`
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm">
                  <h4 className="text-emerald-700 dark:text-emerald-400 font-black uppercase text-[10px] mb-3 tracking-widest">Executive Summary</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                      ${outlook.executive_summary || 'Synchronizing outlook details...'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 rounded-xl bg-white dark:bg-obsidian-card border border-slate-200 dark:border-obsidian-border shadow-sm">
                      <h5 className="text-gold font-black uppercase text-[10px] mb-4 tracking-widest">Forward Forecasts</h5>
                      <div className="space-y-4">
                         ${forecasts.slice(0, 4).map((f, i) => html`
                           <div key=${i} className="flex flex-col gap-1 border-l-2 border-slate-100 dark:border-obsidian-border pl-3">
                              <div className="text-[11px] font-black dark:text-slate-200 uppercase tracking-tighter">${f.title || f}</div>
                              <div className="text-[10px] text-slate-500 line-clamp-2">${f.description || ''}</div>
                           </div>
                         `)}
                      </div>
                   </div>
                   <div className="p-5 rounded-xl bg-white dark:bg-obsidian-card border border-slate-200 dark:border-obsidian-border shadow-sm">
                      <h5 className="text-rose-500 font-black uppercase text-[10px] mb-4 tracking-widest">Strategic Risks</h5>
                      <div className="space-y-4">
                         ${risks.slice(0, 4).map((r, i) => html`
                           <div key=${i} className="flex flex-col gap-1 border-l-2 border-rose-500/20 pl-3">
                              <div className="text-[11px] font-black dark:text-rose-400/80 uppercase tracking-tighter">${r.risk || r}</div>
                              <div className="text-[10px] text-slate-500 line-clamp-2">${r.severity ? `[${r.severity}] ` : ''}${r.rationale || r.mitigation || ''}</div>
                           </div>
                         `)}
                      </div>
                   </div>
                </div>
              </div>
            `;
        }

        case 'chart':
          return html`
              <div className="h-[500px] w-full relative">
                <${ChartCard} title=${modal.title} subtitle="Deep Intelligence Spectrum" data=${modal.extra} loading=${false} />
              </div>
            `;

        default:
          return null;
      }
    } catch (e) {
      console.error("Modal Render Error:", e);
      return html`<div className="p-8 text-rose-500 font-bold text-center">Intelligence processing error. Assets recalibrating...</div>`;
    }
  };

  return html`
    <div className="min-h-screen bg-slate-50 dark:bg-obsidian selection:bg-gold/30 transition-colors duration-500">
      <${Header} onRefresh=${() => window.location.reload()} onExport=${() => window.print()} onSearchOpen=${() => setIsSearchOpen(true)} status=${loading ? 'Synchronizing' : 'Live Intelligence'} theme=${theme} onThemeToggle=${toggleTheme} />
      
      <main className=${`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isAIOpen ? 'mr-[450px]' : ''}`}>
        <${BentoGrid} data=${data} loading=${loading} onShowChart=${showExpandedChart} />
      </main>

      <${ResearchAssistant} isOpen=${isAIOpen} onClose=${() => setIsAIOpen(false)} data=${data} />
      <${CommandK} isOpen=${isSearchOpen} onClose=${() => setIsSearchOpen(false)} onAction=${handleSearchAction} />

      <${Modal} isOpen=${modal.isOpen} onClose=${() => setModal({ ...modal, isOpen: false })} title=${modal.title}>
        ${modal.isOpen && renderModalContent()}
      <//>

      <button onClick=${() => setIsAIOpen(!isAIOpen)} className=${`fixed right-6 bottom-16 z-50 p-5 rounded-2xl bg-gold text-obsidian shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ${isAIOpen ? 'translate-x-[500px]' : 'translate-x-0'}`}>
        <${Icon} name=${MessageSquare} className="w-6 h-6" />
      </button>

      <div className="fixed bottom-0 left-0 right-0 h-10 bg-white/95 dark:bg-obsidian/95 backdrop-blur-xl border-t border-slate-200 dark:border-obsidian-border z-40 overflow-hidden flex items-center shadow-lg transition-colors duration-500">
        <div className="animate-ticker whitespace-nowrap flex gap-12 px-8">
           ${Array.isArray(data?.macro?.data) ? data.macro.data.map((m, i) => html`
                <div key=${i} className="flex gap-4 items-center text-[10px] font-black tracking-[0.1em] uppercase group">
                    <span className="text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">${m.name}</span>
                    <span className="text-slate-900 dark:text-white">${m.value}</span>
                    <span className=${`flex items-center gap-0.5 ${m.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>${m.change >= 0 ? '▲' : '▼'} ${Math.abs(m.change)}%</span>
                </div>
             `) : null}
        </div>
      </div>
    </div>
  `;
};

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
