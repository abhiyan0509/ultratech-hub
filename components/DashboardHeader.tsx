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
        <header className="fixed top-0 left-0 right-0 h-16 bg-obsidian/40 backdrop-blur-3xl z-50 px-8 flex items-center justify-between border-b border-obsidian-border/40">
            <div className="flex items-center gap-10">
                <div className="flex items-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 bg-white rounded-xl shadow-surface-medium cursor-pointer flex items-center justify-center p-2"
                    >
                        <div className="text-black font-black italic text-xl tracking-tighter transform -skew-x-6">UT</div>
                    </motion.div>
                    <div className="flex flex-col">
                        <h1 className="text-white font-black text-xs tracking-extra-wide uppercase leading-tight">Executive Intelligence</h1>
                        <span className="text-slate-600 text-[9px] uppercase font-black tracking-extra-wide mt-0.5">V9 Portfolio Platform</span>
                    </div>
                </div>

                <button
                    onClick={onSearchOpen}
                    className="hidden lg:flex items-center gap-4 px-5 py-2 rounded-full bg-obsidian-depth border border-obsidian-border/50 text-slate-500 text-[10px] uppercase font-bold hover:border-khaki/30 transition-all group ring-1 ring-white/5 shadow-inner w-72"
                >
                    <Search className="w-3.5 h-3.5 group-hover:text-khaki transition-colors" />
                    <span>Search Intelligence Assets...</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded-md bg-obsidian border border-obsidian-border text-[9px] font-mono opacity-40">⌘K</span>
                </button>
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-khaki/5 border border-khaki/10 text-khaki">
                    <div className="w-1 h-1 rounded-full bg-khaki animate-pulse shadow-[0_0_8px_rgba(180,160,118,0.4)]"></div>
                    <span className="text-[9px] uppercase font-black tracking-extra-wide">
                        {loading ? "Sync Active" : "Intelligence Live"}
                    </span>
                </div>

                <div className="h-6 w-px bg-obsidian-border mx-1"></div>

                <button
                    onClick={onThemeToggle}
                    className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-obsidian-hover transition-all active:scale-90"
                >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-obsidian-border text-slate-400 hover:text-white hover:bg-obsidian-hover transition-all text-[10px] font-black uppercase tracking-widest">
                    <FileDown size={14} />
                    Export Report
                </button>

                <button
                    onClick={() => window.location.reload()}
                    className="p-2 rounded-lg text-slate-500 hover:text-khaki hover:bg-obsidian-hover group transition-all"
                >
                    <RotateCw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
                </button>
            </div>
        </header>
    );
};
