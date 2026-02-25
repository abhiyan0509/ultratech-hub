"use client";

import React from "react";
import { motion } from "framer-motion";
import { Map, ShieldCheck } from "lucide-react";

export const RegionalMonopolyMap = () => {
    // Hardcoded verifiable data (Q3FY25/FY24 Base)
    // UltraTech boasts that no single region accounts for > 30% of their mix
    const regions = [
        { name: "North", capacity: 45.2, share: 24, color: "bg-blue-500/20", progress: "bg-blue-500", text: "text-blue-500" },
        { name: "Central", capacity: 38.6, share: 21, color: "bg-purple-500/20", progress: "bg-purple-500", text: "text-purple-500" },
        { name: "East", capacity: 41.5, share: 22, color: "bg-emerald-500/20", progress: "bg-emerald-500", text: "text-emerald-500" },
        { name: "West", capacity: 44.1, share: 24, color: "bg-orange-500/20", progress: "bg-orange-500", text: "text-orange-500" },
        { name: "South", capacity: 17.0, share: 9, color: "bg-pink-500/20", progress: "bg-pink-500", text: "text-pink-500" },
    ];

    // Total Capacity ~ 186.4 MTPA (Current active)
    const MAX_CAPACITY = 186.4;

    return (
        <div className="apple-surface p-10 rounded-3xl h-full flex flex-col justify-between border border-border/50 relative overflow-hidden group">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-8 pb-4 border-b border-border/50 relative z-10">
                <div className="flex flex-col gap-1">
                    <h3 className="text-foreground text-xl font-black tracking-tight flex items-center gap-2">
                        <Map className="w-5 h-5 text-foreground/70" />
                        Regional Capacity Matrix
                    </h3>
                    <p className="consulting-label opacity-60">Pan-India Geographic De-Risking (MTPA)</p>
                </div>
            </div>

            {/* Core Visualization */}
            <div className="flex-1 flex flex-col justify-center space-y-6 relative z-10 my-4">
                {regions.map((region, index) => (
                    <div key={region.name} className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[14px] font-bold text-foreground items-center flex gap-2">
                                <span className={`w-2 h-2 rounded-full ${region.progress}`}></span>
                                {region.name} Region
                            </span>
                            <div className="text-right flex items-baseline gap-2">
                                <span className="text-xl font-black tracking-tighter text-foreground">{region.capacity}</span>
                                <span className={`text-[12px] font-bold ${region.text}`}>({region.share}%)</span>
                            </div>
                        </div>
                        {/* Progress Bar Container */}
                        <div className="w-full bg-black/5 dark:bg-white/5 border border-border/50 rounded-full h-3 overflow-hidden shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(region.capacity / MAX_CAPACITY) * 100 * 2.5}%` }} // multiplier to make it visually fill out more of the 100% width container since no one is > 30%
                                transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                                className={`h-full rounded-full ${region.progress} shadow-[inset_0_-1px_2px_rgba(0,0,0,0.2)]`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Strategic Insight Box */}
            <div className="mt-6 pt-6 border-t border-border/50 relative z-10">
                <div className="bg-black/5 dark:bg-white/5 border border-border/50 rounded-2xl p-5 flex items-start gap-4">
                    <div className="p-2 bg-foreground/10 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-foreground" />
                    </div>
                    <div>
                        <h4 className="text-[12px] font-bold uppercase tracking-widest text-foreground mb-1">Defense Moat</h4>
                        <p className="text-[12px] text-foreground/70 font-medium leading-relaxed">
                            Perfectly hedged geographical footprint. No single region contributes more than 25% to overall capacity, entirely insulating the firm from localized demand shocks or political instability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
