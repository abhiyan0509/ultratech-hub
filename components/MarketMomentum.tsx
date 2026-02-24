"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface MarketMomentumProps {
    data: any;
    loading: boolean;
}

export const MarketMomentum = ({ data, loading }: MarketMomentumProps) => {
    const score = data?.outlook?.mood_score || 0.84;
    const label = data?.outlook?.mood_label || "BULLISH";
    const analysis = data?.outlook?.sentiment_analysis || "Macro momentum remains resilient against cyclical sector headwinds.";

    return (
        <div className="v9-surface p-10 rounded-3xl h-full flex flex-col justify-between overflow-hidden relative group shadow-sm">
            <div className="flex justify-between items-center relative z-10">
                <h2 className="executive-label opacity-60">Market Momentum</h2>
                <Zap className="w-4 h-4 text-khaki animate-pulse" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-6">
                <div className="relative w-48 h-24 overflow-hidden">
                    <div className="absolute top-0 left-0 w-48 h-48 border-[12px] border-obsidian-border/30 rounded-full"></div>
                    <motion.div
                        initial={{ rotate: -180 }}
                        animate={{ rotate: (score * 180) - 180 }}
                        transition={{ type: "spring", damping: 30, stiffness: 100, delay: 0.5 }}
                        className="absolute top-0 left-0 w-48 h-48 border-[12px] border-khaki rounded-full clip-half-gauge origin-center"
                    />
                </div>
                <div className="text-center mt-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-white uppercase font-black tracking-extra-wide text-2xl leading-none"
                    >
                        {label}
                    </motion.div>
                    <div className="text-slate-500 text-[9px] font-black uppercase tracking-extra-wide mt-2 opacity-40">Confidence: {(score * 100).toFixed(1)}%</div>
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-obsidian-depth border border-obsidian-border/50 relative z-10">
                <p className="text-slate-400 text-[11px] italic font-medium leading-relaxed text-center opacity-80">
                    "{analysis}"
                </p>
            </div>
        </div>
    );
};
