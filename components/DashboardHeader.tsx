"use client";

import React from "react";
import {
    Search,
    RotateCw,
    FileDown,
    Moon,
    Sun
} from "lucide-react";

interface DashboardHeaderProps {
    theme: "dark" | "light";
    onThemeToggle: () => void;
    onSearchOpen: () => void;
    loading: boolean;
}

export const DashboardHeader = ({ theme, onThemeToggle, onSearchOpen, loading }: DashboardHeaderProps) => {
    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl z-50 px-10 flex items-center justify-between border-b border-border transition-colors">
            <div className="flex items-center gap-12">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-foreground text-surface rounded-lg flex items-center justify-center shadow-apple-sm">
                        <span className="font-display font-black text-xl italic tracking-tighter">UT</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-foreground font-black text-sm tracking-widest uppercase leading-tight">UltraTech Executive</h1>
                        <span className="consulting-label mt-0.5">V10 Structural Intelligence</span>
                    </div>
                </div>

                <button
                    onClick={onSearchOpen}
                    className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-border text-muted text-[11px] font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors w-80 shadow-inner"
                >
                    <Search className="w-4 h-4" />
                    <span>Search Intelligence Index...</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded-md bg-surface border border-border text-[9px] font-mono shadow-sm">⌘K</span>
                </button>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/5 text-foreground dark:bg-white/10 dark:text-white">
                    <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                    <span className="text-[10px] uppercase font-bold tracking-widest">
                        {loading ? "Sync Active" : "Live Feed"}
                    </span>
                </div>

                <div className="h-4 w-px bg-border"></div>

                <button
                    onClick={onThemeToggle}
                    className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    {theme === "dark" ? <Sun size={18} strokeWidth={2.5} /> : <Moon size={18} strokeWidth={2.5} />}
                </button>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[11px] font-bold uppercase tracking-widest shadow-apple-sm">
                    <FileDown size={14} strokeWidth={2.5} />
                    Export
                </button>

                <button
                    onClick={() => window.location.reload()}
                    className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors group"
                >
                    <RotateCw size={18} strokeWidth={2.5} className="group-hover:rotate-180 transition-transform duration-500" />
                </button>
            </div>
        </header>
    );
};
