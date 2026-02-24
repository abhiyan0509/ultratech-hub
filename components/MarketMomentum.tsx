"use client";

import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

interface MarketMomentumProps {
    data: any;
    loading: boolean;
}

export const MarketMomentum = ({ data, loading }: MarketMomentumProps) => {
    const score = data?.outlook?.mood_score || 0.84;
    const label = data?.outlook?.mood_label || "BULLISH";
    const analysis = data?.outlook?.sentiment_analysis || "Macro momentum remains resilient against cyclical sector headwinds.";

    return (
        <div className="apple-surface p-8 rounded-3xl h-full flex flex-col justify-between overflow-hidden relative group">
            <div className="flex justify-between items-center relative z-10">
                <h2 className="consulting-label text-foreground">Market Momentum</h2>
                <Activity className="w-4 h-4 text-foreground/40" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-8">
                <div className="relative w-56 h-28 overflow-hidden">
                    <div className="absolute top-0 left-0 w-56 h-56 border-[4px] border-border rounded-full"></div>
                    <motion.div
                        initial={{ rotate: -180 }}
                        animate={{ rotate: (score * 180) - 180 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        className="absolute top-0 left-0 w-56 h-56 border-[12px] border-foreground rounded-full clip-half-gauge origin-center"
                    />
                </div>
                <div className="text-center mt-6">
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-foreground uppercase font-black tracking-widest text-3xl leading-none"
                    >
                        {label}
                    </motion.div>
                    <div className="consulting-label mt-2">Confidence: {(score * 100).toFixed(1)}%</div>
                </div>
            </div>

            <div className="pt-6 border-t border-border relative z-10">
                <p className="text-foreground/70 text-sm font-medium leading-relaxed italic text-center">
                    "{analysis}"
                </p>
            </div>
        </div>
    );
};
