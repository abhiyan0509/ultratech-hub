"use client";

import React from "react";
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
    rationale?: string;
    trend?: number;
    loading?: boolean;
    quantNode?: { formula: string, calculation: string };
}

export const MetricCard = ({ label, value, sub, rationale, trend, loading, quantNode }: MetricCardProps) => {
    const isPositive = trend && trend > 0;

    return (
        <div className="apple-surface p-6 rounded-2xl flex flex-col justify-between h-36 relative overflow-visible group cursor-default">
            {/* Tooltip Rationale & Math */}
            {(rationale || quantNode) && (
                <div className="absolute -top-4 -translate-y-full left-1/2 -translate-x-1/2 bg-foreground text-surface px-4 py-3 rounded-xl shadow-apple-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap hidden md:flex flex-col gap-2 min-w-[220px]">
                    {rationale && <span className="text-[11px] font-medium leading-relaxed">{rationale}</span>}

                    {quantNode && (
                        <div className="flex flex-col gap-1 pt-2 border-t border-surface/20">
                            <span className="text-[9px] text-surface/50 font-mono">FORMULA</span>
                            <span className="text-[11px] font-mono tracking-tight font-bold">{quantNode.formula}</span>
                            <span className="text-[9px] text-surface/50 font-mono mt-1">CALCULATION</span>
                            <span className="text-[11px] font-mono tracking-tight font-bold">{quantNode.calculation}</span>
                        </div>
                    )}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground rotate-45"></div>
                </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <span className="consulting-label">{label}</span>
                {trend !== undefined && (
                    <div className={cn(
                        "flex items-center gap-1 font-bold text-[10px] tracking-tight px-2 py-0.5 rounded-md",
                        isPositive ? "bg-black/5 dark:bg-white/10 text-black dark:text-white" : "bg-red-500/10 text-red-600 dark:text-red-400"
                    )}>
                        {isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div>
                <div className={cn(
                    "consulting-value mb-1",
                    loading && "animate-pulse rounded h-8 w-2/3 bg-border"
                )}>
                    {!loading && value}
                </div>
                <div className="text-muted text-[11px] font-medium tracking-wide">{sub}</div>
            </div>
        </div>
    );
};
