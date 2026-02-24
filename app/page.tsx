"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, Clock, Activity, Eye, Layers, Target, Users } from "lucide-react";

// Professional V10 Components
import { DashboardHeader } from "@/components/DashboardHeader";
import { MetricsGrid } from "@/components/MetricsGrid";
import { IntelligenceChart } from "@/components/IntelligenceChart";
import { MarketMomentum } from "@/components/MarketMomentum";
import { NewsFeed } from "@/components/NewsFeed";
import { IntelligenceAssistant } from "@/components/IntelligenceAssistant";
import { CompetitorAnalysis } from "@/components/CompetitorAnalysis";
import { CompetitorFinancials } from "@/components/CompetitorFinancials";
import { M_A_Module } from "@/components/M_A_Module";
import { StrategicOutlook } from "@/components/StrategicOutlook";

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
    const [theme, setTheme] = useState<"dark" | "light">("light");
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // V15 Tri-Modal Active Tab State
    const [activeTab, setActiveTab] = useState<'past' | 'current' | 'future'>('current');

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://abhiyan1021-ultratech-hub.hf.space";

    // Force Light mode initially for the true "Consulting Firm" default Look
    useEffect(() => {
        document.documentElement.classList.remove("dark");
    }, []);

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
        <div className="min-h-screen bg-background transition-colors duration-500 selection:bg-black/10 dark:selection:bg-white/20 overflow-x-hidden font-sans">

            {/* Search Interface (Minimal Overlay) */}
            <AnimatePresence>
                {isSearchOpen && (
                    <div className="fixed inset-0 z-[200]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSearchOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.99 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-2xl mx-auto mt-[15vh] px-4"
                        >
                            <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-apple-lg">
                                <div className="p-6 flex items-center gap-4 border-b border-border">
                                    <Search className="w-5 h-5 text-muted" />
                                    <input
                                        autoFocus
                                        value={searchInput}
                                        onChange={e => setSearchInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && searchInput.trim()) {
                                                setSearchQuery(searchInput);
                                                setSearchInput("");
                                                setIsSearchOpen(false);
                                                setIsAIOpen(true);
                                            }
                                        }}
                                        placeholder="Search intelligence..."
                                        className="bg-transparent border-none outline-none text-foreground w-full text-xl font-medium placeholder-muted"
                                    />
                                </div>
                                <div className="p-3 bg-black/5 dark:bg-white/5 flex justify-between items-center text-[10px] uppercase font-bold text-muted tracking-widest">
                                    <span>ESC to exit</span>
                                    <span>Enterprise Search V10</span>
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
                onExport={() => window.print()}
                loading={loading}
            />

            <main className="pt-28 pb-40 px-10 max-w-[1600px] mx-auto min-h-screen">

                {/* --- TRI-MODAL NAVIGATION --- */}
                <div className="flex z-40 sticky top-24 justify-center mb-16">
                    <div className="flex p-1.5 bg-surface/80 backdrop-blur-xl rounded-2xl border border-border shadow-apple-sm">
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all ${activeTab === 'past' ? 'bg-foreground text-surface shadow-md' : 'text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            <Clock className="w-4 h-4" />
                            Past Performance
                        </button>
                        <button
                            onClick={() => setActiveTab('current')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all ${activeTab === 'current' ? 'bg-foreground text-surface shadow-md' : 'text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            <Activity className="w-4 h-4" />
                            Current Scenario
                        </button>
                        <button
                            onClick={() => setActiveTab('future')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all ${activeTab === 'future' ? 'bg-foreground text-surface shadow-md' : 'text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            <Eye className="w-4 h-4" />
                            Future Outlook
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* --- TAB 1: PAST PERFORMANCE --- */}
                    {activeTab === 'past' && (
                        <motion.div
                            key="past"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-16"
                        >
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <Layers className="w-6 h-6 text-foreground" />
                                    <h2 className="text-3xl font-black tracking-tight text-foreground">Historical Execution</h2>
                                </div>
                                <MetricsGrid data={data} loading={loading} />
                                <div className="mt-8 h-[600px]">
                                    <IntelligenceChart data={data} loading={loading} />
                                </div>
                            </section>

                            <hr className="border-border/60" />

                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <Target className="w-6 h-6 text-foreground" />
                                    <h2 className="text-3xl font-black tracking-tight text-foreground">Financial Benchmarking</h2>
                                </div>
                                <div className="h-[450px]">
                                    <CompetitorFinancials data={data} loading={loading} />
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {/* --- TAB 2: CURRENT SCENARIO --- */}
                    {activeTab === 'current' && (
                        <motion.div
                            key="current"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-16"
                        >
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <Activity className="w-6 h-6 text-foreground" />
                                    <h2 className="text-3xl font-black tracking-tight text-foreground">Tactical Market Awareness</h2>
                                </div>

                                <div className="grid grid-cols-12 gap-8 items-stretch mb-8">
                                    <div className="col-span-12 lg:col-span-5 flex flex-col gap-8 h-[500px]">
                                        <MarketMomentum data={data} loading={loading} />
                                    </div>
                                    <div className="col-span-12 lg:col-span-7 apple-surface rounded-3xl p-10 flex flex-col justify-center items-center relative overflow-hidden group h-[500px]">
                                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 pointer-events-none"></div>
                                        <div className="mb-6 w-full flex justify-center">
                                            <div className="w-32 h-1 bg-border rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "99.98%" }}
                                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                                />
                                            </div>
                                        </div>
                                        <h4 className="consulting-label mb-2">Platform Integrity</h4>
                                        <div className="text-6xl font-black text-foreground tracking-tighter">99.98<span className="text-3xl font-bold text-muted">%</span></div>
                                        <p className="consulting-label opacity-60 mt-4 text-center">Data node synchronization verified against live market feeds.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-12 gap-8 items-stretch pt-4">
                                    {/* News Feed */}
                                    <div className="col-span-12 lg:col-span-6 h-[700px]">
                                        <NewsFeed data={data} loading={loading} />
                                    </div>

                                    {/* M&A Module */}
                                    <div className="col-span-12 lg:col-span-6 h-[700px]">
                                        <M_A_Module data={data} loading={loading} />
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {/* --- TAB 3: FUTURE OUTLOOK --- */}
                    {activeTab === 'future' && (
                        <motion.div
                            key="future"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-16"
                        >
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <Eye className="w-6 h-6 text-foreground" />
                                    <h2 className="text-3xl font-black tracking-tight text-foreground">Strategic Trajectory</h2>
                                </div>

                                <div className="grid grid-cols-12 gap-8 items-stretch mb-16">
                                    <div className="col-span-12 xl:col-span-7 flex flex-col gap-6 h-[650px]">
                                        <div className="apple-surface p-10 rounded-3xl h-full flex flex-col justify-between relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-foreground/5 dark:bg-foreground/10 rounded-bl-[100px] -mr-10 -mt-10 blur-3xl pointer-events-none"></div>
                                            <div>
                                                <h3 className="text-foreground text-2xl font-black tracking-tight mb-1">Vision 2030 Overview</h3>
                                                <p className="consulting-label opacity-60">Consolidated Pathway to Dominance</p>
                                            </div>
                                            <div className="py-8 border-y border-border/50 my-auto z-10">
                                                <p className="text-foreground/90 text-[18px] leading-relaxed font-medium">
                                                    "UltraTech Cement retains its defensive market-leader position with a confirmed 186.4 MTPA active capacity. The current capital expenditure cycle and inorganic acquisition strategy effectively isolates the firm from peer conglomerate expansion, securing the trajectory toward the 200 MTPA FY27 milestone."
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-end pt-8 mt-auto z-10">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-foreground font-black text-6xl tracking-tighter">200<span className="text-4xl text-foreground/50">m</span></span>
                                                    <span className="consulting-label text-foreground/70">Target Capacity (MTPA) by FY27</span>
                                                </div>
                                                <Target className="w-16 h-16 text-foreground/20" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-12 xl:col-span-5 flex h-[650px]">
                                        <StrategicOutlook data={data} loading={loading} />
                                    </div>
                                </div>
                            </section>

                            <hr className="border-border/60" />

                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <Users className="w-6 h-6 text-foreground" />
                                    <h2 className="text-3xl font-black tracking-tight text-foreground">Strategic Positioning & Peer Threats</h2>
                                </div>
                                <CompetitorAnalysis data={data} loading={loading} />
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>

            {/* Floating Action Elements (Austere Design) */}
            <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsAIOpen(!isAIOpen)}
                className="fixed right-10 bottom-16 z-[80] p-5 rounded-full bg-foreground text-surface shadow-apple-lg transition-transform flex items-center justify-center group"
            >
                <Plus className={`w-6 h-6 transition-transform duration-300 ${isAIOpen ? "rotate-45" : ""}`} />
            </motion.button>

            {/* Neural Interface Sidebar */}
            <IntelligenceAssistant
                isOpen={isAIOpen}
                onClose={() => setIsAIOpen(false)}
                initialQuery={searchQuery}
                onQueryProcessed={() => setSearchQuery("")}
            />

            {/* Corporate Footer (Minimal) */}
            <footer className="fixed bottom-0 left-0 right-0 h-10 bg-surface/90 backdrop-blur-md border-t border-border z-50 overflow-hidden flex items-center">
                <div className="animate-ticker whitespace-nowrap flex gap-12 px-8 items-center">
                    {data?.macro?.data ? data.macro.data.map((m: any, i: number) => (
                        <div key={i} className="flex gap-3 items-center text-[10px] font-bold tracking-widest uppercase group cursor-default">
                            <span className="text-muted">{m.name}</span>
                            <span className="text-foreground">{m.value}</span>
                            <span className={m.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                                {m.change >= 0 ? '▲' : '▼'} {Math.abs(m.change)}%
                            </span>
                        </div>
                    )) : (
                        <div className="flex gap-3 items-center text-[10px] font-bold tracking-widest uppercase text-muted">Awaiting Macro Indices...</div>
                    )}
                </div>
            </footer>
        </div>
    );
}
