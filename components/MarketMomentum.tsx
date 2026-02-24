"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface MarketMomentumProps {
    data: any;
    loading: boolean;
}

export const MarketMomentum = ({ data, loading }: MarketMomentumProps) => {
    const score = data?.outlook?.mood_score || 0.84;
    const label = data?.outlook?.mood_label || "BULLISH";
    const analysis = data?.outlook?.sentiment_analysis || "Macro momentum remains resilient against cyclical sector headwinds.";

    return (
        <div className="glass-panel p-10 rounded-3xl h-full flex flex-col justify-between overflow-hidden relative shadow-sm group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <h2 className="text-white text-xl font-black flex justify-between items-center relative z-10">
                <span className="tracking-tight uppercase text-sm">Market Momentum</span>
                <TrendingUp className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </h2>

            <div className="flex-1 flex flex-col items-center justify-center pt-2">
                <div className="relative w-48 h-24 overflow-hidden">
                    <div className="absolute top-0 left-0 w-48 h-48 border-[20px] border-obsidian-border/50 rounded-full"></div>
                    <motion.div
                        initial={{ rotate: -180 }}
                        animate={{ rotate: (score * 180) - 180 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute top-0 left-0 w-48 h-48 border-[20px] border-emerald-500 rounded-full clip-half-gauge origin-center"
                    />
                </div>
                <div className="text-center mt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-emerald-500 uppercase font-black tracking-[0.4em] text-2xl"
                    >
                        {label}
                    </motion.div>
                    <div className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mt-1">Confidence Spectrum: 84.2%</div>
                </div>
            </div>

            <div className="p-5 rounded-2xl bg-gold/5 border border-gold/10 backdrop-blur-sm relative z-10">
                <p className="text-slate-400 text-[10px] italic font-bold leading-relaxed text-center">
                    "{analysis}"
                </p>
            </div>
        </div>
    );
};
