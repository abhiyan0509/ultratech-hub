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
    trend?: number;
    loading?: boolean;
}

export const MetricCard = ({ label, value, sub, trend, loading }: MetricCardProps) => {
    const isPositive = trend && trend > 0;

    return (
        <div className="apple-surface p-6 rounded-2xl flex flex-col justify-between h-36 relative overflow-hidden">
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
