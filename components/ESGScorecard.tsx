"use client";

import React from "react";
import { Leaf, Wind, Sun, Factory } from "lucide-react";

export const ESGScorecard = () => {
    return (
        <div className="apple-surface p-10 rounded-3xl h-full flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-bl-[100px] -mr-10 -mt-10 blur-3xl pointer-events-none"></div>

            <div className="mb-8 border-b border-border/50 pb-6 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <Leaf className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-foreground text-xl font-black tracking-tight">ESG & Sustainability Scorecard</h3>
                </div>
                <p className="consulting-label opacity-60">Decarbonization Targets & The Green Transition</p>
            </div>

            <div className="flex-grow grid grid-cols-2 gap-6 relative z-10">
                {/* WHRS Metric */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-4">
                        <Wind className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">WHRS Capacity</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-3xl font-black tracking-tighter text-foreground">26</span>
                            <span className="font-bold text-muted">%</span>
                        </div>
                        <span className="text-[10px] font-bold text-muted">Waste Heat Recovery</span>
                    </div>
                </div>

                {/* Green Energy Target */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-4">
                        <Sun className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Green Power</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-3xl font-black tracking-tighter text-foreground">60</span>
                            <span className="font-bold text-muted">%</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500">Target by FY26</span>
                    </div>
                </div>

                {/* AFR Usage */}
                <div className="bg-black/5 dark:bg-white/5 border border-border/50 rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-4">
                        <Factory className="w-4 h-4 text-muted" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-muted">AFR Usage (TSR)</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-3xl font-black tracking-tighter text-foreground">~7.0</span>
                            <span className="font-bold text-muted">%</span>
                        </div>
                        <span className="text-[10px] font-bold text-muted">Alternative Fuels</span>
                    </div>
                </div>

                {/* CO2 Emissions */}
                <div className="bg-black/5 dark:bg-white/5 border border-border/50 rounded-2xl p-6 flex flex-col justify-between group">
                    <div className="flex items-center gap-2 mb-4">
                        <Wind className="w-4 h-4 text-muted" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-muted">Net CO₂ Emissions</span>
                    </div>
                    <div>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-3xl font-black tracking-tighter text-foreground">550</span>
                            <span className="font-bold text-muted text-xs">kg/eq. ton</span>
                        </div>
                        <span className="text-[10px] font-bold text-muted">Per ton of cementitious product</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 relative z-10">
                <p className="text-[11px] font-medium text-foreground/70 leading-relaxed italic">
                    "UltraTech is committed to reducing its carbon footprint through extensive investments in Waste Heat Recovery Systems (WHRS) and renewable power, aligning with global Net Zero 2050 ambitions."
                </p>
            </div>
        </div>
    );
};
