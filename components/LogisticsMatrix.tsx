"use client";

import React from "react";
import { Map, Train, Navigation, Anchor, Building2, Warehouse } from "lucide-react";

export const LogisticsMatrix = () => {
    return (
        <div className="apple-surface p-10 rounded-3xl h-full flex flex-col justify-between">
            <div className="mb-8 border-b border-border/50 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Map className="w-5 h-5 text-muted" />
                    <h3 className="text-foreground text-xl font-black tracking-tight">Logistics & Distribution Matrix</h3>
                </div>
                <p className="consulting-label opacity-60">Asset-Heavy Infrastructure & Freight Moat</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 border border-border/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-4">Average Lead Distance</span>
                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-4xl font-black tracking-tighter text-foreground">~400</span>
                        <span className="font-bold text-muted">km</span>
                    </div>
                    <p className="text-[11px] font-medium text-foreground/70 leading-relaxed">
                        Optimized hub-and-spoke model reduces average freight travel, defending margins in high-fuel cost environments.
                    </p>
                </div>

                <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 border border-border/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-4">Freight Mix</span>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Navigation className="w-3.5 h-3.5 text-blue-500" /><span className="text-xs font-bold text-foreground/80">Road</span></div>
                            <span className="text-sm font-mono font-bold">65%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Train className="w-3.5 h-3.5 text-emerald-500" /><span className="text-xs font-bold text-foreground/80">Rail</span></div>
                            <span className="text-sm font-mono font-bold">30%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Anchor className="w-3.5 h-3.5 text-indigo-500" /><span className="text-xs font-bold text-foreground/80">Sea (Coastal)</span></div>
                            <span className="text-sm font-mono font-bold">5%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-border/50 pt-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-6">Manufacturing Footprint</span>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-surface shadow-md">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-foreground">24</span>
                        <span className="text-[10px] uppercase font-bold text-muted">Integrated<br />Units</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-surface border-2 border-border flex items-center justify-center text-foreground shadow-sm">
                            <Warehouse className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-foreground">33</span>
                        <span className="text-[10px] uppercase font-bold text-muted">Grinding<br />Units</span>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-surface border border-border bg-black/5 dark:bg-white/5 flex items-center justify-center text-foreground shadow-sm">
                            <Anchor className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter text-foreground">8</span>
                        <span className="text-[10px] uppercase font-bold text-muted">Bulk<br />Terminals</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
