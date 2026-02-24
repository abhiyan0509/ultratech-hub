"use client";

import React from "react";
import {
    Search,
    RotateCw,
    FileDown,
    Moon,
    Sun
} from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
    theme: "dark" | "light";
    onThemeToggle: () => void;
    onSearchOpen: () => void;
    loading: boolean;
}

export const DashboardHeader = ({ theme, onThemeToggle, onSearchOpen, loading }: DashboardHeaderProps) => {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 glass-panel z-50 px-6 flex items-center justify-between border-b border-obsidian-border/50">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gold p-1.5 rounded-lg shadow-premium cursor-pointer"
                    >
                        <div className="text-obsidian font-black italic text-xl tracking-tighter">UT</div>
                    </motion.div>
                    <div className="flex flex-col">
                        <h1 className="text-white font-bold text-sm tracking-wide uppercase leading-tight">Executive Intelligence</h1>
                        <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">UltraTech V8 Dashboard</span>
                    </div>
                </div>

                <button
                    onClick={onSearchOpen}
                    className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-obsidian-border/30 border border-obsidian-border text-slate-500 text-xs hover:border-gold/30 transition-all group shadow-inner"
                >
                    <Search className="w-4 h-4 group-hover:text-gold transition-colors" />
                    <span>Search Intelligence Assets...</span>
                    <span className="ml-8 px-1.5 py-0.5 rounded bg-obsidian border border-obsidian-border text-[10px] font-mono">⌘K</span>
                </button>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase font-black tracking-wider">
                        {loading ? "Synchronizing" : "Live Intelligence"}
                    </span>
                </div>

                <button
                    onClick={onThemeToggle}
                    className="p-2 rounded-xl border border-obsidian-border text-slate-400 hover:text-gold transition-all active:scale-95"
                    title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-obsidian-border text-slate-400 hover:text-white transition-all text-xs font-bold shadow-sm">
                    <FileDown size={16} />
                    Export Intelligence
                </button>

                <button
                    onClick={() => window.location.reload()}
                    className="p-2 rounded-xl border border-obsidian-border text-slate-400 hover:text-gold group transition-all"
                >
                    <RotateCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                </button>
            </div>
        </header>
    );
};
