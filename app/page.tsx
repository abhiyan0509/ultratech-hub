"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

// Individual Professional Components
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsGrid } from "@/components/MetricsGrid";
import { IntelligenceChart } from "@/components/IntelligenceChart";
import { MarketMomentum } from "@/components/MarketMomentum";
import { NewsFeed } from "@/components/NewsFeed";
import { IntelligenceAssistant } from "@/components/IntelligenceAssistant";

// Types
interface DashboardData {
    company_info?: any;
    financials?: any;
    ma_deals?: any;
    competitors?: any;
    news?: any;
    outlook?: any;
    macro?: any;
}

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://abhiyan1021-ultratech-hub.hf.space";

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const datasets = ['company_info', 'financials', 'ma_deals', 'competitors', 'news', 'outlook', 'macro'];
                const results = await Promise.all(
                    datasets.map(ds => fetch(`${API_BASE}/api/data/${ds}`).then(r => r.json()))
                );
                const combined: DashboardData = {};
                datasets.forEach((ds, i) => (combined as any)[ds] = results[i]);
                setData(combined);
            } catch (e) {
                console.error("Platform Synchronization Error", e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [API_BASE]);

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-obsidian transition-colors duration-700 font-sans">
            <DashboardHeader
                theme={theme}
                onThemeToggle={toggleTheme}
                onSearchOpen={() => setIsSearchOpen(true)}
                loading={loading}
            />

            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-obsidian/80 backdrop-blur-xl flex items-start justify-center pt-[15vh] px-4"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-2xl glass-panel rounded-2x overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 flex items-center gap-4 border-b border-obsidian-border/50">
                                <Search className="w-6 h-6 text-gold" />
                                <input
                                    autoFocus
                                    placeholder="Interrogate Intelligence Assets..."
                                    className="bg-transparent border-none outline-none text-white w-full text-xl font-black placeholder-slate-600 tracking-tight"
                                />
                            </div>
                            <div className="p-4 bg-obsidian-border/20 text-[10px] font-black text-slate-500 flex justify-between uppercase tracking-[0.2em]">
                                <div className="flex gap-4">
                                    <span>Enter to Select</span>
                                    <span>Esc to Exit</span>
                                </div>
                                <div className="text-gold opacity-60">Neural Search Active</div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="pt-24 pb-32 px-6 max-w-[1700px] mx-auto">
                {/* Top-Level High-Density Metrics */}
                <MetricsGrid data={data} loading={loading} />

                <div className="grid grid-cols-12 gap-6 items-stretch">
                    {/* Primary Visual Intelligence */}
                    <div className="col-span-12 lg:col-span-8 h-[600px]">
                        <IntelligenceChart data={data} loading={loading} />
                    </div>

                    {/* Secondary Strategic Assets */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-[600px]">
                        <div className="flex-1 min-h-[50%]">
                            <MarketMomentum data={data} loading={loading} />
                        </div>
                        <div className="flex-1 min-h-[50%]">
                            <div className="glass-panel p-8 rounded-3xl h-full flex flex-col justify-center items-center border-emerald-500/10 bg-emerald-500/5 group transition-all duration-700">
                                <div className="p-4 bg-emerald-500/10 rounded-full mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    <div className="w-4 h-4 bg-emerald-500 rounded-full animate-v7-pulse"></div>
                                </div>
                                <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px] mb-2">Platform Integrity</h4>
                                <div className="text-2xl font-black text-emerald-500 tracking-tighter">99.98%</div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Intelligence Sync Fidelity</p>
                            </div>
                        </div>
                    </div>

                    {/* Full-Width Secondary Analysis Area */}
                    <div className="col-span-12 lg:col-span-7 h-[500px]">
                        <NewsFeed data={data} loading={loading} />
                    </div>

                    <div className="col-span-12 lg:col-span-5 h-[500px]">
                        <div className="glass-panel p-10 rounded-3xl h-full flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] rounded-full group-hover:bg-gold/10 transition-all duration-1000"></div>
                            <div>
                                <h3 className="text-white text-lg font-black tracking-tight uppercase flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-gold rounded-full"></div>
                                    Strategic Asset Dossier
                                </h3>
                                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-bold">Confidential Intelligence Summary</p>
                            </div>

                            <div className="py-6 flex-1 flex items-center">
                                <p className="text-slate-300 text-sm leading-relaxed font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                                    "UltraTech Cement is India's largest cement manufacturer with 186.4 MTPA capacity. Strategic consolidation via M&A (Kesoram, India Cements) maintains market dominance against the aggressive expansion of the Adani-Ambuja conglomerate. Capital allocation remains prioritized for the 200 MTPA FY27 target."
                                </p>
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-obsidian-border/50">
                                <div className="flex flex-col">
                                    <span className="text-gold font-black text-xl tracking-tighter">200 MTPA</span>
                                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Target Expansion</span>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gold"></div>
                                    <div className="w-2 h-2 rounded-full bg-gold/50"></div>
                                    <div className="w-2 h-2 rounded-full bg-gold/20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Action Elements */}
            <button
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="fixed right-6 bottom-16 z-50 p-5 rounded-2xl bg-gold text-obsidian shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-gold/20"
            >
                <div className="relative">
                    <Zap className="w-6 h-6" />
                    {!isAIOpen && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-obsidian"></span>
                        </span>
                    )}
                </div>
            </button>

            {/* Integration Layer */}
            <IntelligenceAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

            {/* Footer Ticker */}
            <div className="fixed bottom-0 left-0 right-0 h-10 bg-white/95 dark:bg-obsidian/95 backdrop-blur-3xl border-t border-slate-200 dark:border-obsidian-border z-40 overflow-hidden flex items-center shadow-lg transition-colors duration-500">
                <div className="animate-ticker whitespace-nowrap flex gap-16 px-8 items-center">
                    {[
                        { name: "CRUDE OIL (WTI)", value: "66.39", change: -1.2 },
                        { name: "NIFTY INFRA", value: "9714.3", change: 0.85 },
                        { name: "NIFTY REALTY", value: "819.15", change: -0.19 },
                        { name: "USD/INR", value: "90.97", change: 0.08 }
                    ].map((m, i) => (
                        <div key={i} className="flex gap-4 items-center text-[10px] font-black tracking-[0.2em] uppercase group cursor-default">
                            <span className="text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors uppercase">{m.name}</span>
                            <span className="text-slate-900 dark:text-white font-black tabular-nums">{m.value}</span>
                            <span className={`flex items-center gap-1 ${m.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {m.change >= 0 ? '▲' : '▼'} {Math.abs(m.change)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
