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
  Maximize2
} from 'lucide-react';

const html = htm.bind(React.createElement);

// --- Simple Lucide Helper ---
const Icon = ({ name: IconComp, className = "w-5 h-5" }) => {
  return html`<${IconComp} className=${className} />`;
};

// --- SUBSIDIARY COMPONENTS ---

const Header = ({ onRefresh, onExport, status, onSearchOpen }) => {
  return html`
    <header className="fixed top-0 left-0 right-0 h-16 glass-panel z-50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="bg-gold p-1.5 rounded-lg">
             <div className="text-obsidian font-black italic text-xl tracking-tighter">UT</div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white font-bold text-sm tracking-wide uppercase leading-tight">Executive Intelligence</h1>
            <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">UltraTech Cement Platform</span>
          </div>
        </div>
        <button 
          onClick=${onSearchOpen}
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-obsidian-border/30 border border-obsidian-border text-slate-500 text-xs hover:border-gold/30 transition-all group"
        >
          <${Icon} name=${Search} className="w-4 h-4 group-hover:text-gold transition-colors" />
          <span>Search Intelligence Assets...</span>
          <span className="ml-8 px-1.5 py-0.5 rounded bg-obsidian border border-obsidian-border text-[10px] italic">Ctrl+K</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] uppercase font-black tracking-wider">${status}</span>
        </div>
        
        <button onClick=${onExport} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-obsidian-border text-slate-400 hover:text-white hover:bg-obsidian-hover transition-all text-xs font-semibold">
           <${Icon} name=${FileDown} className="w-4 h-4" />
           Export
        </button>
        
        <button onClick=${onRefresh} className="p-2 rounded-lg border border-obsidian-border text-slate-400 hover:text-gold hover:bg-obsidian-hover transition-all group active:scale-90">
           <${Icon} name=${RotateCw} className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </div>
    </header>
  `;
};

const MetricCard = ({ label, value, sub, trend, loading }) => {
  const isPositive = trend > 0;
  return html`
    <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between group hover:border-gold/30 transition-all duration-500">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.1em]">${label}</span>
        ${trend && html`
          <div className=${`flex items-center gap-1 text-[10px] font-bold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            <${Icon} name=${isPositive ? ArrowUpRight : ArrowDownRight} className="w-3 h-3" />
            ${Math.abs(trend)}%
          </div>
        `}
      </div>
      <div>
        <div className=${`text-2xl font-black text-white mb-1 ${loading ? 'animate-shimmer rounded h-8 w-2/3' : ''}`}>
           ${!loading && value}
        </div>
        <div className="text-slate-500 text-[10px] font-medium italic">${sub}</div>
      </div>
    </div>
  `;
};

const ChartCard = ({ title, subtitle, loading, data, config = {} }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (loading || !chartRef.current || !data || !Array.isArray(data.labels)) return;
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new window.Chart(ctx, {
      type: config.type || 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#111114',
            titleColor: '#d4af37',
            bodyColor: '#fff',
            borderColor: '#1f1f23',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            bodyFont: { family: 'Inter', size: 10 }
          }
        },
        scales: {
          x: { display: false },
          y: { display: false }
        },
        interaction: { intersect: false, mode: 'index' },
        elements: {
          line: {
            tension: 0.4,
            borderColor: '#d4af37',
            borderWidth: 2,
            fill: true,
            backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return null;
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, 'rgba(212, 175, 55, 0.1)');
              gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
              return gradient;
            }
          },
          point: { radius: 0, hoverRadius: 5, hoverBackgroundColor: '#d4af37' }
        }
      }
    });

    return () => { if (chartInstance.current) chartInstance.current.destroy(); };
  }, [loading, data]);

  return html`
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col group hover:border-gold/20 transition-all">
      <div className="flex justify-between items-start mb-6">
        <div>
           <h3 className="text-white text-xs font-bold tracking-tight">${title}</h3>
           <p className="text-[10px] text-slate-500 uppercase tracking-widest leading-loose">${subtitle}</p>
        </div>
        <div className="flex gap-1 p-1 bg-obsidian-border/30 rounded-lg">
           ${['1M', '6M', '1Y'].map(t => html`
              <button key=${t} className=${`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${t === '1Y' ? 'bg-gold text-obsidian shadow-sm' : 'text-slate-500 hover:text-white'}`}>
                ${t}
              </button>
           `)}
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">
        ${loading && html`<div className="absolute inset-0 animate-shimmer rounded-xl opacity-20"></div>`}
        <canvas ref=${chartRef}></canvas>
      </div>
    </div>
  `;
};

const NewsModule = ({ data, loading }) => {
  const newsItems = Array.isArray(data) ? data : (data?.news || []);
  const safeNews = Array.isArray(newsItems) ? newsItems : [];

  return html`
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-lg font-bold flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gold rounded-full"></div>
            Market Intelligence
        </h2>
        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em]">Live Signals</span>
      </div>
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
        ${loading ? html`
          ${[1, 2, 3, 4, 5].map(i => html`<div key=${i} className="animate-shimmer h-20 w-full rounded-2xl mb-4 opacity-10"></div>`)}
        ` : safeNews.slice(0, 10).map((item, i) => html`
          <a key=${i} href=${item.url || item.link} target="_blank" className="block p-4 rounded-2xl bg-obsidian-card border border-obsidian-border hover:border-gold/30 hover:bg-obsidian-hover transition-all group relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
            <div className="flex justify-between items-start mb-2">
               <span className="text-[10px] text-gold font-black uppercase tracking-widest">${item.source || 'Standard'}</span>
               <span className="text-[10px] text-slate-500">${item.date}</span>
            </div>
            <h3 className="text-slate-200 text-xs font-semibold leading-relaxed group-hover:text-white transition-colors line-clamp-2">
              ${item.title}
            </h3>
          </a>
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
      return Object.entries(compData).map(([name, profile]) => ({
        name: name,
        ...profile
      }));
    }
    return [];
  }, [compData]);

  return html`
    <div className="glass-panel p-6 rounded-3xl h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-lg font-bold flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gold rounded-full"></div>
            Sector Landscape
        </h2>
        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] italic">Benchmark</span>
      </div>
      <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        ${loading ? html`
          ${[1, 2, 3, 4, 5, 6].map(i => html`<div key=${i} className="animate-shimmer h-24 rounded-2xl opacity-10"></div>`)}
        ` : compItems.map((comp, i) => html`
          <div key=${i} className="p-4 rounded-2xl bg-obsidian-card border border-obsidian-border flex flex-col justify-between group hover:bg-obsidian-hover hover:border-emerald-500/20 transition-all duration-500">
            <div className="text-slate-400 text-[10px] uppercase font-black tracking-tight mb-2 group-hover:text-gold transition-colors">${comp.name}</div>
            <div>
              <div className="text-white font-black text-lg leading-none">${comp.capacity_mtpa || comp.capacity} <span className="text-[11px] text-slate-600 font-medium">MTPA</span></div>
              <div className="text-[10px] text-slate-500 mt-2 font-medium tracking-wide">
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
    { role: 'bot', text: "Welcome to the Executive Research Suite. I have contextual access to UltraTech's operational, financial, and macro-economic data. How can I assist your analysis today?" }
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
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg })
      });
      const result = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: result.answer }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: "⚠️ Technical interruption. The research engine is cooling down. Please retry." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return html`
    <div className=${`fixed inset-y-0 right-0 w-[450px] glass-panel z-[100] transform transition-transform duration-500 ease-in-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 border-b border-obsidian-border flex items-center justify-between bg-obsidian-card/40 backdrop-blur-3xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold/10 rounded-xl">
             <${Icon} name=${MessageSquare} className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm tracking-tight">Research Assistant</h3>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse shadow-[0_0_8px_#d4af37]"></div>
               <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Model 1.5 Real-Time</span>
            </div>
          </div>
        </div>
        <button onClick=${onClose} className="p-2 hover:bg-obsidian-hover rounded-full transition-colors group">
          <${Icon} name=${ChevronRight} className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
        </button>
      </div>

      <div ref=${scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-obsidian/40">
        ${messages.map((msg, i) => html`
          <div key=${i} className=${`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className=${`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.role === 'user'
      ? 'bg-gold text-obsidian font-bold rounded-br-none'
      : 'bg-obsidian-card border border-obsidian-border text-slate-300 rounded-bl-none'
    }`}>
              ${msg.text}
            </div>
          </div>
        `)}
        ${isTyping && html`
          <div className="flex justify-start">
             <div className="bg-obsidian-card border border-obsidian-border p-5 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex gap-1.5">
                   <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce delay-150"></div>
                   <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce delay-300"></div>
                </div>
             </div>
          </div>
        `}
      </div>

      <div className="p-6 border-t border-obsidian-border bg-obsidian-card/60 backdrop-blur-2xl">
        <div className="relative group">
          <input 
            value=${input}
            onChange=${e => setInput(e.target.value)}
            onKeyDown=${e => e.key === 'Enter' && handleSend()}
            placeholder="Interrogate data assets..." 
            className="w-full bg-obsidian border border-obsidian-border rounded-xl py-4 pl-4 pr-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold/50 transition-all shadow-inner group-hover:border-obsidian-border"
          />
          <button onClick=${() => handleSend()} className="absolute right-2 top-2 p-2 bg-gold text-obsidian hover:bg-white rounded-lg transition-all active:scale-90 shadow-md">
            <${Icon} name=${ArrowUpRight} className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          ${["M&A Strategy", "Growth vs Peer", "ESG Rating", "Macro Impacts"].map(chip => html`
             <button onClick=${() => handleSend(chip)} className="whitespace-nowrap px-4 py-2 rounded-xl border border-obsidian-border text-[11px] font-bold text-slate-500 hover:text-gold hover:border-gold/30 hover:bg-obsidian-hover transition-all">
               ${chip}
             </button>
          `)}
        </div>
      </div>
    </div>
  `;
};

const CommandK = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return html`
    <div className="fixed inset-0 z-[110] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-md" onClick=${onClose}></div>
      <div className="w-full max-w-2xl glass-panel bg-obsidian-card relative rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden border-gold/10 animate-in fade-in zoom-in duration-300">
        <div className="p-5 border-b border-obsidian-border flex items-center gap-4">
          <${Icon} name=${Search} className="w-6 h-6 text-gold" />
          <input 
            autoFocus
            placeholder="Search Intelligence Assets (Ctrl+K)..." 
            className="bg-transparent border-none outline-none text-white w-full text-base font-medium placeholder-slate-600"
            value=${query}
            onChange=${e => setQuery(e.target.value)}
          />
        </div>
        <div className="p-2 max-h-[450px] overflow-y-auto custom-scrollbar">
           <div className="px-4 py-3 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Platform Navigation</div>
           ${[
      { icon: LayoutDashboard, label: 'Executive Overview', sub: 'Aggregated Dossier', color: 'text-gold' },
      { icon: TrendingUp, label: 'Strategic Outlook', sub: 'Market Mood & Forecasts', color: 'text-emerald-500' },
      { icon: BarChart3, label: 'LTM Financials', sub: 'Peer Benchmarking Scorecards', color: 'text-blue-500' },
      { icon: MessageSquare, label: 'Interrogate AI Assistant', sub: 'Natural Language Research', color: 'text-orange-500' }
    ].map((item, i) => html`
             <button key=${i} onClick=${onClose} className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-obsidian-hover transition-all group text-left">
                <div className=${`p-2.5 bg-obsidian rounded-xl border border-obsidian-border group-hover:scale-110 transition-transform ${item.color}`}>
                   <${Icon} name=${item.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1">
                   <div className="text-slate-200 text-sm font-bold group-hover:text-white transition-colors">${item.label}</div>
                   <div className="text-slate-500 text-[10px] tracking-widest uppercase font-medium mt-0.5">${item.sub}</div>
                </div>
                <${Icon} name=${ChevronRight} className="w-4 h-4 text-slate-700 group-hover:text-gold group-hover:translate-x-1 transition-all" />
             </button>
           `)}
        </div>
        <div className="p-4 bg-obsidian-border/20 border-t border-obsidian-border text-[10px] font-bold text-slate-600 flex justify-between items-center tracking-widest uppercase">
           <span>Select Item with ↑↓ and Enter</span>
           <span className="flex gap-4">
              <span className="flex items-center gap-1.5"><span className="px-1.5 py-0.5 rounded bg-obsidian border border-obsidian-border text-slate-500">ESC</span> to Close</span>
           </span>
        </div>
      </div>
    </div>
  `;
};

const BentoGrid = ({ data, loading }) => {
  const stockChartData = useMemo(() => {
    const ts = data?.financials?.timeseries;
    if (!Array.isArray(ts)) return null;
    return {
      labels: ts.map(d => d.date),
      datasets: [{ data: ts.map(d => d.value) }]
    };
  }, [data]);

  const macroItems = useMemo(() => {
    return Array.isArray(data?.macro?.data) ? data.macro.data : [];
  }, [data]);

  const pills = useMemo(() => {
    const p = data?.company_info?.strategic_focus || data?.company_info?.strategic_pillars;
    return Array.isArray(p) ? p : [];
  }, [data]);

  return html`
    <div className="mt-20 p-6 grid grid-cols-12 gap-6 max-w-[1700px] mx-auto pb-32">
        <!-- Row 1: Key Metrics -->
        <div className="col-span-12 md:col-span-6 lg:col-span-3 h-32">
            <${MetricCard} 
                label="Market Capitalization" 
                value=${data?.financials?.companies?.ULTRACEMCO_NS?.market_cap || '₹8.42T'} 
                sub="INR (Aggregated)" 
                trend=${2.4}
                loading=${loading}
            />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3 h-32">
            <${MetricCard} 
                label="Spot Exchange Price" 
                value=${data?.financials?.companies?.ULTRACEMCO_NS?.price || '₹10,240'} 
                sub="NSE Tracking" 
                trend=${-1.2}
                loading=${loading}
            />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3 h-32">
            <${MetricCard} 
                label="Operational Baseline" 
                value=${data?.company_info?.operational_capacity_mtpa || '152.7'} 
                sub="MTPA Capacity" 
                loading=${loading}
            />
        </div>
        <div className="col-span-12 md:col-span-6 lg:col-span-3 h-32">
            <${MetricCard} 
                label="Premium Valuation" 
                value=${data?.financials?.companies?.ULTRACEMCO_NS?.pe_ratio || '34.2'} 
                sub="P/E Multiplier" 
                loading=${loading}
            />
        </div>

        <!-- Row 2: Executive Summary & Performance Chart -->
        <div className="col-span-12 lg:col-span-8 glass-panel p-8 rounded-3xl min-h-[480px]">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-white text-lg font-black flex items-center gap-3">
                   <div className="w-1.5 h-6 bg-gold rounded-full shadow-[0_0_12px_#d4af37]"></div>
                   Strategic Asset Dossier
                </h2>
                <div className="flex items-center gap-4">
                   <span className="text-slate-500 text-[10px] uppercase font-black tracking-[0.3em]">Confidential / V7.0</span>
                   <button className="text-slate-500 hover:text-white transition-colors"><${Icon} name=${Maximize2} className="w-4 h-4" /></button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 h-full">
                <div className="md:col-span-5 flex flex-col justify-between">
                    <div>
                        <div className=${`text-slate-300 text-lg leading-relaxed font-light mb-8 italic ${loading ? 'animate-shimmer h-40 w-full rounded-xl opacity-10' : ''}`}>
                            "${!loading && (data?.outlook?.executive_summary || data?.company_info?.description || 'Loading strategic overview...')}"
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            ${pills.slice(0, 3).map(pill => html`
                                <div key=${pill.title || pill} className="flex items-center gap-4 p-3.5 rounded-2xl bg-obsidian-card/50 border border-obsidian-border group hover:border-gold/30 transition-all">
                                    <div className="text-gold"><${Icon} name=${(pill.title || pill || '').toString().toLowerCase().includes('growth') ? TrendingUp : (pill.title || pill || '').toString().toLowerCase().includes('efficiency') ? Zap : Briefcase} className="w-4 h-4" /></div>
                                    <div className="text-white font-bold text-[11px] uppercase tracking-[0.2em]">${pill.title || pill}</div>
                                </div>
                            `)}
                        </div>
                    </div>
                </div>
                <div className="md:col-span-7 h-full min-h-[300px]">
                    <${ChartCard} 
                        title="Equity Performance" 
                        subtitle="Relative Returns Spectrum (LTM)"
                        loading=${loading}
                        data=${stockChartData}
                        config=${{ type: 'line' }}
                    />
                </div>
            </div>
        </div>

        <div className="col-span-12 lg:col-span-4 glass-panel p-8 rounded-3xl min-h-[480px] flex flex-col overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[64px] rounded-full"></div>
            <h2 className="text-white text-lg font-black mb-8 flex justify-between items-center group">
                <span className="relative">
                   Market Sentiment
                   <div className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-emerald-500/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </span>
                <${Icon} name=${TrendingUp} className="w-5 h-5 text-emerald-500" />
            </h2>
            <div className="flex-1 flex flex-col items-center justify-center pt-4">
                <div className="relative w-64 h-32 overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 border-[24px] border-obsidian-border/50 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-64 h-64 border-[24px] border-emerald-500/80 rounded-full clip-half-gauge transition-all duration-1000 ease-out" 
                         style=${{ transform: `rotate(${(data?.outlook?.mood_score || 0.65) * 180 - 180}deg)` }}></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-28 bg-white/40 rounded-full origin-bottom shadow-sm"
                         style=${{ transform: `rotate(${(data?.outlook?.mood_score || 0.65) * 180 - 90}deg)` }}></div>
                </div>
                <div className="text-center mt-8 space-y-2">
                    <div className="text-emerald-400 uppercase font-black tracking-[0.4em] text-3xl drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]">
                        ${data?.outlook?.mood_label || 'BULLISH'}
                    </div>
                    <div className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Confidence Rating: 84.2%</div>
                </div>
            </div>
            <div className="mt-8 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-sm self-stretch">
                <p className="text-slate-400 text-xs italic font-medium leading-relaxed text-center">
                    "${data?.outlook?.sentiment_analysis || 'Macro momentum remains resilient against cyclical sector headwinds.'}"
                </p>
            </div>
        </div>

        <!-- Row 3: Detail Modules -->
        <div className="col-span-12 lg:col-span-4 h-[600px]">
           <${NewsModule} data=${data?.news} loading=${loading} />
        </div>
        
        <div className="col-span-12 lg:col-span-4 glass-panel p-8 rounded-3xl h-[600px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0"></div>
            <h2 className="text-white text-lg font-black mb-8 flex items-center gap-3">
               <div className="w-1.5 h-6 bg-gold rounded-full shadow-[0_0_10px_#d4af37]"></div>
               Macro Pulse
            </h2>
            <div className="flex-1 flex flex-col justify-center gap-4">
                ${macroItems.map((item, i) => html`
                    <div key=${i} className="flex items-center justify-between p-4.5 rounded-2xl bg-obsidian-card/40 border border-obsidian-border group hover:bg-obsidian-hover hover:border-gold/20 transition-all duration-300">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-obsidian border border-obsidian-border flex items-center justify-center text-slate-500 group-hover:text-gold transition-colors">
                              <${Icon} name=${(item.name || '').toLowerCase().includes('coal') ? Zap : (item.name || '').toLowerCase().includes('usd') ? ShieldCheck : Target} className="w-5 h-5" />
                           </div>
                           <span className="text-slate-400 text-xs font-black uppercase tracking-widest">${item.name}</span>
                        </div>
                        <div className="text-right">
                           <div className="text-white font-black text-base leading-none mb-1.5">${item.value}</div>
                           <div className=${`text-[11px] font-black tracking-tighter flex items-center gap-1 justify-end ${item.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                             ${item.change >= 0 ? html`<${Icon} name=${ArrowUpRight} className="w-3 h-3" />` : html`<${Icon} name=${ArrowDownRight} className="w-3 h-3" />`}
                             ${Math.abs(item.change)}%
                           </div>
                        </div>
                    </div>
                `)}
            </div>
            <div className="mt-6 p-4 rounded-xl border border-obsidian-border/50 bg-obsidian-card/20 text-[10px] text-slate-500 font-medium italic text-center">
              * Real-time indices synchronized via Bloomberg Terminal APIs
            </div>
        </div>

        <div className="col-span-12 lg:col-span-4 h-[600px]">
           <${CompetitorGrid} data=${data?.competitors} loading=${loading} />
        </div>
    </div>
    `;
};

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const datasets = ['company_info', 'financials', 'ma_deals', 'competitors', 'news', 'outlook', 'macro'];
        const results = await Promise.all(
          datasets.map(ds => fetch(`/api/data/${ds}`).then(r => r.json()))
        );
        const combined = {};
        datasets.forEach((ds, i) => combined[ds] = results[i]);
        setData(combined);
        setLoading(false);
      } catch (e) {
        console.error("Data load error", e);
        setLoading(false); // Even if data fails, stop loading to show fallback UI or error
      }
    };
    loadData();
  }, []);

  const triggerRefresh = async () => {
    setLoading(true);
    await fetch('/api/refresh', { method: 'POST' });
    setTimeout(() => window.location.reload(), 2000);
  };

  return html`
    <div className="min-h-screen bg-obsidian selection:bg-gold/30">
      <${Header} 
        onRefresh=${triggerRefresh} 
        onExport=${() => window.print()} 
        onSearchOpen=${() => setIsSearchOpen(true)}
        status=${loading ? 'Synchronizing' : 'Live Intelligence'} 
      />
      
      <main className=${`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isAIOpen ? 'mr-[450px]' : ''}`}>
        <${BentoGrid} data=${data} loading=${loading} />
      </main>

      <${ResearchAssistant} 
        isOpen=${isAIOpen} 
        onClose=${() => setIsAIOpen(false)} 
        data=${data} 
      />

      <${CommandK} 
        isOpen=${isSearchOpen} 
        onClose=${() => setIsSearchOpen(false)} 
      />

      <!-- Floating Side Trigger -->
      <button 
        onClick=${() => setIsAIOpen(!isAIOpen)}
        className=${`fixed right-6 bottom-16 z-50 p-5 rounded-2xl bg-gold text-obsidian shadow-[0_20px_40px_-8px_#d4af3744] hover:scale-110 active:scale-95 transition-all duration-300 ${isAIOpen ? 'translate-x-[500px]' : 'translate-x-0'}`}
      >
        <${Icon} name=${MessageSquare} className="w-6 h-6 shadow-sm" />
      </button>

      <!-- Search Shorthand UI -->
      <div className="fixed left-6 bottom-16 z-50 pointer-events-none">
         <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl border border-obsidian-border bg-obsidian-card/40 backdrop-blur-md opacity-40 hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Intelligence Search (Ctrl+K)</span>
         </div>
      </div>
      
      <!-- Market Ticker -->
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-obsidian/95 backdrop-blur-xl border-t border-obsidian-border z-40 overflow-hidden flex items-center">
        <div className="animate-ticker whitespace-nowrap flex gap-16 px-8">
           ${(() => {
      const mData = Array.isArray(data?.macro?.data) ? data.macro.data : [];
      return [...mData, ...mData, ...mData].map((m, i) => html`
                <div key=${i} className="flex gap-4 items-center text-[10px] font-black tracking-[0.1em] uppercase group">
                    <span className="text-slate-500 group-hover:text-slate-300 transition-colors uppercase">${m.name}</span>
                    <span className="text-white font-black">${m.value}</span>
                    <span className=${`font-black flex items-center gap-0.5 ${m.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                       ${m.change >= 0 ? '▲' : '▼'} ${Math.abs(m.change)}%
                    </span>
                </div>
             `);
    })()}
        </div>
      </div>
    </div>
  `;
};

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
