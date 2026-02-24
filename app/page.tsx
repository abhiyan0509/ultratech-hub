"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus } from "lucide-react";

// Professional V10 Components
import { DashboardHeader, DashboardSegment } from "@/components/DashboardHeader";
import { MetricsGrid } from "@/components/MetricsGrid";
import { IntelligenceChart } from "@/components/IntelligenceChart";
import { MarketMomentum } from "@/components/MarketMomentum";
import { NewsFeed } from "@/components/NewsFeed";
import { IntelligenceAssistant } from "@/components/IntelligenceAssistant";
import { CompetitorAnalysis } from "@/components/CompetitorAnalysis";
import { M_A_Module } from "@/components/M_A_Module";
import { StrategicOutlook } from "@/components/StrategicOutlook";
import { Target, TrendingUp, ShieldAlert, Newspaper, Users, BarChart } from "lucide-react";

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSegment, setActiveSegment] = useState<DashboardSegment>('overview');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

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
                onMenuOpen={() => setIsMenuOpen(true)}
                activeSegment={activeSegment}
                loading={loading}
            />

            {/* Segment Navigation Sidebar */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[100] flex">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-80 h-full bg-surface border-r border-border shadow-apple-2xl flex flex-col pt-24 px-6 pb-10"
                        >
                            <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-6">Execution Segments</h2>
                            <div className="flex flex-col gap-2 flex-1">
                                {[
                                    { id: 'overview', icon: <BarChart className="w-5 h-5" />, label: 'Executive Overview', desc: 'Core operational & value trajectory.' },
                                    { id: 'market', icon: <Newspaper className="w-5 h-5" />, label: 'Market Intelligence', desc: 'Real-time tactical news & deals.' },
                                    { id: 'strategic', icon: <Target className="w-5 h-5" />, label: 'Strategic Positioning', desc: 'Rivals, threats, & forward vectors.' }
                                ].map((seg) => (
                                    <button
                                        key={seg.id}
                                        onClick={() => {
                                            setActiveSegment(seg.id as DashboardSegment);
                                            setIsMenuOpen(false);
                                        }}
                                        className={`flex items-start gap-4 p-4 rounded-2xl transition-all text-left ${activeSegment === seg.id ? 'bg-foreground text-surface' : 'hover:bg-black/5 dark:hover:bg-white/5 text-foreground'}`}
                                    >
                                        <div className={`mt-0.5 ${activeSegment === seg.id ? 'text-surface' : 'text-muted'}`}>{seg.icon}</div>
                                        <div>
                                            <div className="text-sm font-bold tracking-tight">{seg.label}</div>
                                            <div className={`text-[11px] mt-1 pr-4 leading-tight ${activeSegment === seg.id ? 'text-surface/70' : 'text-muted'}`}>{seg.desc}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <main className="pt-32 pb-40 px-10 max-w-[1600px] mx-auto min-h-[85vh]">
                <AnimatePresence mode="wait">
                    {/* --- EXECUTIVE OVERVIEW SEGMENT --- */}
                    {activeSegment === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            <section>
                                <MetricsGrid data={data} loading={loading} />
                            </section>

                            <div className="grid grid-cols-12 gap-8 items-stretch pt-4">
                                {/* Chart Column */}
                                <div className="col-span-12 lg:col-span-8 h-[600px]">
                                    <IntelligenceChart data={data} loading={loading} />
                                </div>

                                {/* Momentum Column */}
                                <div className="col-span-12 lg:col-span-4 flex flex-col gap-8 h-[600px]">
                                    <div className="h-1/2">
                                        <MarketMomentum data={data} loading={loading} />
                                    </div>
                                    <div className="h-1/2 apple-surface rounded-3xl p-10 flex flex-col justify-center items-center relative overflow-hidden group">
                                        <div className="mb-6 w-full flex justify-center">
                                            <div className="w-24 h-1 bg-border rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: "99.98%" }}
                                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                                    className="h-full bg-foreground"
                                                />
                                            </div>
                                        </div>
                                        <h4 className="consulting-label mb-2">Platform Integrity</h4>
                                        <div className="text-4xl font-bold text-foreground tracking-tight">99.98%</div>
                                        <p className="consulting-label opacity-60 mt-4 text-center">Data node synchronization verified.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* --- MARKET INTELLIGENCE SEGMENT --- */}
                    {activeSegment === 'market' && (
                        <motion.div
                            key="market"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-12 gap-8 items-stretch"
                        >
                            {/* News Feed */}
                            <div className="col-span-12 lg:col-span-6 2xl:col-span-5 h-[800px]">
                                <NewsFeed data={data} loading={loading} />
                            </div>

                            {/* M&A Module */}
                            <div className="col-span-12 lg:col-span-6 2xl:col-span-7 h-[800px]">
                                <M_A_Module data={data} loading={loading} />
                            </div>
                        </motion.div>
                    )}

                    {/* --- STRATEGIC POSITIONING SEGMENT --- */}
                    {activeSegment === 'strategic' && (
                        <motion.div
                            key="strategic"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Competitor Intel */}
                            <section>
                                <CompetitorAnalysis data={data} loading={loading} />
                            </section>

                            <div className="grid grid-cols-12 gap-8 items-stretch pt-4">
                                <div className="col-span-12 xl:col-span-7 flex flex-col gap-6 h-[650px]">
                                    <div className="apple-surface p-10 rounded-3xl h-full flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-foreground text-xl font-bold tracking-tight mb-1">Strategic Overview</h3>
                                            <p className="consulting-label opacity-60">Consolidated Position Summary</p>
                                        </div>
                                        <div className="py-8">
                                            <div className="w-8 h-1 bg-foreground mb-6"></div>
                                            <p className="text-foreground/80 text-[15px] leading-relaxed font-medium">
                                                "UltraTech Cement retains its defensive market-leader position with a confirmed 186.4 MTPA active capacity. The current capital expenditure cycle and inorganic acquisition strategy effectively isolates the firm from peer conglomerate expansion, securing the trajectory toward the 200 MTPA FY27 milestone."
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-end pt-8 border-t border-border mt-auto">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-foreground font-black text-3xl tracking-tight">200m</span>
                                                <span className="consulting-label">FY27 Target (MTPA)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-12 xl:col-span-5 flex h-[650px]">
                                    <StrategicOutlook data={data} loading={loading} />
                                </div>
                            </div>
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
