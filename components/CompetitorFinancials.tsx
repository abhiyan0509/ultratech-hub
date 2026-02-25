"use client";

import React from "react";
import { DollarSign, Percent, Scale, Activity } from "lucide-react";

interface CompetitorFinancialsProps {
    data: any;
    loading: boolean;
}

export const CompetitorFinancials = ({ data, loading }: CompetitorFinancialsProps) => {

    if (loading || !data?.financials?.comparison_metrics) {
        return (
            <div className="w-full flex-col gap-6 apple-surface rounded-3xl p-10 min-h-[400px] flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-muted animate-pulse mb-4" />
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest animate-pulse">
                    Synchronizing Financial Benchmarks...
                </div>
            </div>
        );
    }

    const { comparison_metrics, companies } = data.financials;

    // Filter to core strategic metrics to avoid clutter
    const coreMetrics = ["Market Cap", "Stock Price", "P/E Ratio", "EV/EBITDA", "Operating Margin", "Debt/Equity", "1Y Return"];

    // Safety check if comparison_metrics exists and is an array
    const filteredMetrics = Array.isArray(comparison_metrics)
        ? comparison_metrics.filter((m: any) => coreMetrics.includes(m.metric))
        : [];

    // Identify peers (excluding UT) for the summary engine
    const ultraTechPE = parseFloat(companies?.["UltraTech Cement"]?.pe_ratio || "0");
    const shreePE = parseFloat(companies?.["Shree Cement"]?.pe_ratio || "0");
    const adaniPE = parseFloat(companies?.["Ambuja Cements"]?.pe_ratio || "0");

    return (
        <div className="w-full h-full flex flex-col gap-6 animate-fade-in [animation-delay:0.2s]">

            <div className="apple-surface rounded-3xl p-10 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-black/5 dark:bg-white/5 text-foreground rounded-xl flex items-center justify-center">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-foreground text-xl font-bold tracking-tight mb-1">Financial Benchmarking</h3>
                            <p className="consulting-label opacity-60">Valuation & Profitability Matrix</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left relative">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="pb-4 pt-2 font-bold text-[10px] uppercase tracking-widest text-muted whitespace-nowrap">Key Metric</th>
                                <th className="pb-4 pt-2 font-bold text-[10px] uppercase tracking-widest text-muted whitespace-nowrap text-right">UltraTech</th>
                                <th className="pb-4 pt-2 font-bold text-[10px] uppercase tracking-widest text-muted whitespace-nowrap text-right">Ambuja (Adani)</th>
                                <th className="pb-4 pt-2 font-bold text-[10px] uppercase tracking-widest text-muted whitespace-nowrap text-right">Shree Cement</th>
                                <th className="pb-4 pt-2 font-bold text-[10px] uppercase tracking-widest text-muted whitespace-nowrap text-right">Dalmia Bharat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredMetrics.map((row: any, i: number) => {
                                const isValuation = row.metric === "P/E Ratio" || row.metric === "EV/EBITDA";

                                // Map string metric names to our quant agent keys to pull the math formulas
                                const quantKeyMap: Record<string, string> = {
                                    "P/E Ratio": "pe_ratio",
                                    "EV/EBITDA": "ev_ebitda",
                                    "Operating Margin": "profit_margin", // Approximation for tooltip demo
                                    "Debt/Equity": "debt_equity",
                                };
                                const mappedKey = quantKeyMap[row.metric as string];
                                const quantNode = mappedKey && data?.quant_metrics?.["UltraTech Cement"]?.[mappedKey];

                                return (
                                    <tr key={i} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors group relative cursor-default">
                                        <td className="py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 relative">
                                                <span className="text-[12px] font-bold text-foreground/80 tracking-tight border-b border-dashed border-foreground/30 hover:border-foreground transition-colors">
                                                    {row.metric}
                                                </span>
                                                {/* In-Table Math Tooltip */}
                                                {quantNode && (
                                                    <div className="absolute left-[110%] top-1/2 -translate-y-1/2 ml-2 bg-foreground text-surface px-4 py-3 rounded-xl shadow-apple-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 whitespace-nowrap hidden md:flex flex-col gap-2 min-w-[220px]">
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[9px] text-surface/50 font-mono">FORMULA ({row.metric})</span>
                                                            <span className="text-[11px] font-mono tracking-tight font-bold">{quantNode.formula}</span>
                                                            <span className="text-[9px] text-surface/50 font-mono mt-1">ULTRATECH CALCULATION</span>
                                                            <span className="text-[11px] font-mono tracking-tight font-bold">{quantNode.calculation}</span>
                                                        </div>
                                                        <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-foreground rotate-45"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`text-[14px] font-mono tracking-tight ${isValuation ? 'text-foreground font-bold' : 'text-foreground/80'}`}>
                                                {row["UltraTech Cement"] || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`text-[13px] font-mono tracking-tight text-muted group-hover:text-foreground/70 transition-colors`}>
                                                {row["Ambuja Cements"] || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`text-[13px] font-mono tracking-tight text-muted group-hover:text-foreground/70 transition-colors`}>
                                                {row["Shree Cement"] || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={`text-[13px] font-mono tracking-tight text-muted group-hover:text-foreground/70 transition-colors`}>
                                                {row["Dalmia Bharat"] || 'N/A'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Synthesis Output */}
                <div className="mt-8 pt-6 border-t border-border bg-black/5 dark:bg-white/5 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <Scale className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">A.I. Financial Synthesis</span>
                            <p className="text-[13px] text-foreground/80 leading-relaxed font-medium">
                                UltraTech commands a strategic premium ({ultraTechPE}x P/E) reflective of its undisputed scale. However, Shree Cement retains industry-leading operating margins, while Adani's aggressive capital allocation signals an impending compression in Tier 1 valuation spreads over the next 24 months.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
