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

    if (loading) {
        return (
            <div className="apple-surface p-10 rounded-3xl h-full flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <TrendingUp className="w-8 h-8 text-muted" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Calculating Momentum...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="apple-surface p-10 rounded-3xl h-full flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group">
            {/* Left side: Text & Analysis */}
            <div className="flex-1 flex flex-col justify-center h-full">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-foreground text-surface rounded-xl">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-foreground text-xl font-bold tracking-tight mb-1">Market Momentum</h2>
                        <p className="consulting-label opacity-60">Real-time sentiment vector</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-foreground uppercase font-black tracking-tighter text-5xl leading-none mb-3"
                >
                    {label}
                </motion.div>

                <div className="pt-6 mt-6 border-t border-border">
                    <p className="text-foreground/80 text-lg font-medium leading-relaxed italic border-l-2 border-foreground/20 pl-4 py-1">
                        "{analysis}"
                    </p>
                </div>
            </div>

            {/* Right side: Compact Gauge */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center p-10 bg-black/5 dark:bg-white/5 rounded-[2rem] border border-border min-w-[300px]">
                <div className="relative w-40 h-20 overflow-hidden mb-6">
                    <div className="absolute top-0 left-0 w-40 h-40 border-[4px] border-border rounded-full"></div>
                    <motion.div
                        initial={{ rotate: -180 }}
                        animate={{ rotate: (score * 180) - 180 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className="absolute top-0 left-0 w-40 h-40 border-[10px] border-foreground rounded-full clip-half-gauge origin-center"
                    />
                </div>
                <div className="text-center">
                    <div className="text-4xl font-black text-foreground tracking-tighter tabular-nums">
                        {(score * 100).toFixed(1)}<span className="text-2xl text-muted font-bold">%</span>
                    </div>
                    <div className="consulting-label mt-2 opacity-60">Confidence Score</div>
                </div>
            </div>
        </div>
    );
};
