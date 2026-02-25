"use client";

import React from "react";
import { Info, Calculator, X as Multiply, Pause as Equals } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface QuantNode {
    value: string;
    raw: number;
    formula: string;
    calculation: string;
}

interface DuPontAnalysisProps {
    data: {
        roe?: QuantNode;
        profit_margin?: QuantNode;
        asset_turnover?: QuantNode;
        equity_multiplier?: QuantNode;
    };
    loading?: boolean;
}

const FormulaCard = ({
    title,
    node,
    loading,
    highlight = false
}: {
    title: string;
    node?: QuantNode;
    loading?: boolean;
    highlight?: boolean;
}) => {
    return (
        <div className={cn(
            "relative group flex-1 p-4 rounded-xl border border-border/50 transition-all",
            highlight ? "bg-foreground text-surface border-transparent" : "bg-surface hover:bg-black/5 dark:hover:bg-white/5"
        )}>
            <div className="flex justify-between items-start mb-2">
                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    highlight ? "text-surface/70" : "text-muted"
                )}>{title}</span>
                <Info size={12} className={highlight ? "text-surface/50" : "text-muted"} />
            </div>

            <div className={cn(
                "text-2xl font-mono tracking-tighter mb-1",
                highlight ? "text-surface font-black" : "text-foreground font-bold",
                loading && "animate-pulse h-8 w-1/2 bg-current/20 rounded"
            )}>
                {!loading && (node?.value || "N/A")}
            </div>

            {/* Hidden rigorous tooltip */}
            {node && (
                <div className="absolute top-[110%] left-1/2 -translate-x-1/2 bg-foreground text-surface px-4 py-3 rounded-xl shadow-apple-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap hidden md:flex flex-col gap-2 min-w-[200px]">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-surface/50 font-mono">FORMULA ({title})</span>
                        <span className="text-[11px] font-mono tracking-tight font-bold border-b border-surface/20 pb-1">{node.formula}</span>
                        <span className="text-[9px] text-surface/50 font-mono mt-1">CALCULATION</span>
                        <span className="text-[11px] font-mono tracking-tight font-bold">{node.calculation}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export const DuPontAnalysis = ({ data, loading }: DuPontAnalysisProps) => {
    return (
        <div className="apple-surface p-6 sm:p-8 rounded-2xl mb-8 border border-border/50">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Calculator className="text-muted" size={24} />
                        DuPont Analysis
                    </h3>
                    <p className="text-sm text-muted font-medium mt-1">Rigorous breakdown of Return on Equity (ROE) into operational and financial drivers.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-4 w-full">

                {/* 1. Profit Margin */}
                <FormulaCard
                    title="Profit Margin"
                    node={data?.profit_margin}
                    loading={loading}
                />

                <div className="text-muted/50 hidden lg:block"><Multiply size={20} strokeWidth={3} /></div>

                {/* 2. Asset Turnover */}
                <FormulaCard
                    title="Asset Turnover"
                    node={data?.asset_turnover}
                    loading={loading}
                />

                <div className="text-muted/50 hidden lg:block"><Multiply size={20} strokeWidth={3} /></div>

                {/* 3. Equity Multiplier */}
                <FormulaCard
                    title="Equity Multiplier"
                    node={data?.equity_multiplier}
                    loading={loading}
                />

                <div className="text-muted/50 hidden lg:block"><Equals size={20} strokeWidth={3} className="rotate-90" /></div>

                {/* = ROE */}
                <FormulaCard
                    title="Return on Equity"
                    node={data?.roe}
                    loading={loading}
                    highlight={true}
                />
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 text-[12px] leading-relaxed text-muted">
                <strong className="text-foreground">Strategic Implication:</strong> UltraTech's structural ROE is predominantly driven by its <strong className="text-foreground">Profit Margin</strong> (pricing power & cost efficiency) and <strong className="text-foreground">Asset Turnover</strong> (capacity utilization), rather than artificial financial leverage (<strong className="text-foreground">Equity Multiplier</strong>). This indicates a highly sustainable organic growth model. Hover over each node to verify the exact mathematical calculation.
            </div>
        </div>
    );
};
