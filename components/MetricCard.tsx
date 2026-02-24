"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface MetricCardProps {
    label: string;
    value: string | number;
    sub: string;
    trend?: number;
    loading?: boolean;
}

export const MetricCard = ({ label, value, sub, trend, loading }: MetricCardProps) => {
    const isPositive = trend && trend > 0;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-40 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-gold/15 transition-all duration-700"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">{label}</span>
                {trend !== undefined && (
                    <div className={cn(
                        "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black",
                        isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                        {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <div className={cn(
                    "text-3xl font-black text-white mb-1.5 tracking-tighter",
                    loading && "animate-shimmer rounded h-9 w-2/3 opacity-10 bg-gold/10"
                )}>
                    {!loading && value}
                </div>
                <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest opacity-60">{sub}</div>
            </div>
        </motion.div>
    );
};
