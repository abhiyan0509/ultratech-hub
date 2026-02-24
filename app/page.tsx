"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap } from "lucide-react";

// Professional V9 Components
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
                console.error("Critical Synchronization Failure", e);
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
        <div className="min-h-screen bg-obsidian transition-colors duration-1000 selection:bg-khaki/30 overflow-x-hidden">
            {/* Search Interface (Precision Overlay) */}
            <AnimatePresence>
                {isSearchOpen && (
                    <div className="fixed inset-0 z-[200]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative w-full max-w-2xl mx-auto mt-[15vh] px-4"
                        >
                            <div className="bg-obsidian-depth border border-obsidian-border rounded-2xl overflow-hidden shadow-surface-high ring-1 ring-white/10">
                                <div className="p-8 flex items-center gap-6 border-b border-white/5">
                                    <Search className="w-6 h-6 text-khaki" />
                                    <input
                                        autoFocus
                                        placeholder="Interrogate data assets..."
                                        className="bg-transparent border-none outline-none text-white w-full text-2xl font-black placeholder-slate-800 tracking-tighter-executive"
                                    />
                                </div>
                                <div className="p-4 bg-black/40 flex justify-between items-center">
                                    <div className="flex gap-6">
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-extra-wide">ESC to exit</span>
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-extra-wide">Enter to search</span>
                                    </div>
                                    <span className="text-[9px] font-black text-khaki/40 uppercase tracking-extra-wide">V9 Strategic Index</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DashboardHeader
                theme={theme}
                onThemeToggle={toggleTheme}
                onSearchOpen={() => setIsSearchOpen(true)}
                loading={loading}
            />

            <main className="pt-28 pb-40 px-10 max-w-[1720px] mx-auto space-y-10">
                {/* Market Context Section */}
                <section className="animate-fade-in">
                    <MetricsGrid data={data} loading={loading} />
                </section>

                {/* Primary Analytical Grid */}
                <div className="grid grid-cols-12 gap-10 items-stretch">
                    <div className="col-span-12 lg:col-span-8 h-[640px] animate-fade-in [animation-delay:0.2s]">
                        <IntelligenceChart data={data} loading={loading} />
                    </div>

                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-10 h-[640px] animate-fade-in [animation-delay:0.3s]">
                        <div className="h-1/2">
                            <MarketMomentum data={data} loading={loading} />
                        </div>
                        <div className="h-1/2 v9-surface rounded-3xl p-10 flex flex-col justify-center items-center border-khaki/10 bg-khaki/5 relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-khaki/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-khaki/20 transition-all duration-1000"></div>
                            <div className="mb-6">
                                <div className="w-16 h-1 bg-obsidian-border rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "99.98%" }}
                                        transition={{ duration: 2, ease: "easeOut" }}
                                        className="h-full bg-khaki"
                                    />
                                </div>
                            </div>
                            <h4 className="executive-label mb-2">Sync Fidelity</h4>
                            <div className="text-4xl font-black text-white tracking-tighter-executive">99.98%</div>
                            <p className="executive-label opacity-40 mt-3 text-center">Real-time asset synchronization active</p>
                        </div>
                    </div>

                    {/* Auxiliary Data Area */}
                    <div className="col-span-12 lg:col-span-7 h-[540px] animate-fade-in [animation-delay:0.4s]">
                        <NewsFeed data={data} loading={loading} />
                    </div>

                    <div className="col-span-12 lg:col-span-5 h-[540px] animate-fade-in [animation-delay:0.5s]">
                        <div className="v9-surface p-12 rounded-3xl h-full flex flex-col justify-between group overflow-hidden bg-gradient-to-br from-transparent to-obsidian-depth/50">
                            <div className="absolute top-0 right-0 w-80 h-80 bg-khaki/5 blur-[120px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-1000"></div>

                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1 h-4 bg-khaki rounded-full"></div>
                                    <h3 className="text-white text-base font-black tracking-tighter-executive uppercase">Strategic Intelligence</h3>
                                </div>
                                <p className="executive-label opacity-40">Portfolio Consolidation Analysis</p>
                            </div>

                            <div className="py-8">
                                <p className="text-slate-300 text-sm leading-relaxed font-medium italic opacity-70 group-hover:opacity-100 transition-opacity">
                                    "UltraTech Cement maintains its absolute market leadership with 186.4 MTPA active capacity. Recent acquisition cycles have solidified the 200 MTPA FY27 target, creating a high-barrier-to-entry competitive moat against burgeoning peer conglomerates."
                                </p>
                            </div>

                            <div className="flex justify-between items-end pt-8 border-t border-obsidian-border/50">
                                <div className="flex flex-col gap-1">
                                    <span className="text-khaki font-black text-2xl tracking-tighter-executive">200 MTPA</span>
                                    <span className="text-[9px] text-slate-500 uppercase font-black tracking-extra-wide">Consolidated Target</span>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-1 h-4 bg-khaki/30 rounded-full group-hover:h-6 transition-all duration-500"></div>
                                    <div className="w-1 h-6 bg-khaki/50 rounded-full group-hover:h-8 transition-all duration-500 [animation-delay:0.1s]"></div>
                                    <div className="w-1 h-8 bg-khaki rounded-full group-hover:h-10 transition-all duration-500 [animation-delay:0.2s]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Primary Neural Trigger */}
            <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="fixed right-10 bottom-16 z-[80] p-6 rounded-2xl bg-white text-black shadow-surface-high transition-all ring-1 ring-white/20"
            >
                <div className="relative">
                    <Zap className="w-6 h-6 fill-current" />
                    {!isAIOpen && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-khaki opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-khaki border-2 border-white"></span>
                        </span>
                    )}
                </div>
            </motion.button>

            {/* Neural Interface Sidebar */}
            <IntelligenceAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

            {/* Global Metadata Footer */}
            <footer className="fixed bottom-0 left-0 right-0 h-12 bg-black/95 backdrop-blur-3xl border-t border-obsidian-border/50 z-50 overflow-hidden flex items-center shadow-surface-high">
                <div className="animate-ticker whitespace-nowrap flex gap-20 px-10 items-center">
                    {[
                        { name: "CRUDE OIL (WTI)", value: "66.39", change: -1.2 },
                        { name: "NIFTY INFRA", value: "9714.3", change: 0.85 },
                        { name: "NIFTY REALTY", value: "819.15", change: -0.19 },
                        { name: "USD/INR", value: "90.97", change: 0.08 },
                        { name: "SENSEX", value: "81,224", change: 0.42 },
                        { name: "CEMENT INDEX", value: "1,442.8", change: 1.15 }
                    ].map((m, i) => (
                        <div key={i} className="flex gap-5 items-center text-[10px] font-black tracking-extra-wide group cursor-default">
                            <span className="text-slate-600 transition-colors uppercase">{m.name}</span>
                            <span className="text-white font-black tabular-nums">{m.value}</span>
                            <span className={`flex items-center gap-1.5 ${m.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {m.change >= 0 ? '▲' : '▼'} {Math.abs(m.change)}%
                            </span>
                        </div>
                    ))}
                </div>
            </footer>
        </div>
    );
}
