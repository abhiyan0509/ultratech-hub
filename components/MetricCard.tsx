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
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="v9-surface p-6 rounded-2xl flex flex-col justify-between h-36 group relative overflow-hidden"
        >
            <div className="flex justify-between items-start relative z-10">
                <span className="executive-label">{label}</span>
                {trend !== undefined && (
                    <div className={cn(
                        "flex items-center gap-1 font-black text-[10px] tracking-tight px-2 py-0.5 rounded-full",
                        isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                        {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <div className={cn(
                    "text-3xl font-black text-white tracking-tighter-executive mb-0.5 leading-none",
                    loading && "animate-pulse rounded h-8 w-2/3 bg-obsidian-border"
                )}>
                    {!loading && value}
                </div>
                <div className="text-slate-500 text-[9px] font-bold uppercase tracking-extra-wide opacity-50">{sub}</div>
            </div>
        </motion.div>
    );
};
