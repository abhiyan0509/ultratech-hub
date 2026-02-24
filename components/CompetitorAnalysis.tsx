"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Target, Activity, Zap, ShieldAlert, ArrowUpRight } from "lucide-react";

interface CompetitorAnalysisProps {
    data: any;
    loading: boolean;
}

export const CompetitorAnalysis = ({ data, loading }: CompetitorAnalysisProps) => {

    // Fallback or empty state while loading
    if (loading || !data?.competitors) {
        return (
            <div className="w-full flex-col gap-6 apple-surface rounded-3xl p-10 min-h-[500px] flex items-center justify-center">
                <Users className="w-8 h-8 text-muted animate-pulse mb-4" />
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest animate-pulse">
                    Synchronizing Competitor Intelligence...
                </div>
            </div>
        );
    }

    const { competitors, strategic_comparison } = data.competitors;

    // Extract top competitors for the primary table
    const topPeers = competitors ? Object.entries(competitors).slice(0, 5) : [];
    // Extract strategic SWOT matchups
    const matchUps = strategic_comparison ? Object.entries(strategic_comparison).filter(([key]) => key.startsWith('ultratech_vs')) : [];

    return (
        <div className="flex flex-col gap-8">
            <div className="w-full flex flex-col xl:flex-row gap-8 min-h-[500px]">

                {/* Primary Competitor Grid (Left Column) */}
                <div className="flex-1 apple-surface rounded-3xl p-10 flex flex-col h-full animate-fade-in">
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-border">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-foreground text-surface rounded-xl flex items-center justify-center">
                                <Target className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-foreground text-2xl font-black tracking-tighter">Strategic Positioning</h2>
                                <p className="consulting-label opacity-60 mt-1">Tier 1 National Competitor Matrix</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto no-scrollbar">
                        <table className="w-full text-left relative">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="pb-4 pt-2 font-bold text-[10px] uppercase tracking-widest text-muted whitespace-nowrap">Entity</th>
                                    <th className="pb-4 pt-2 font-bold text-[10px] uppercase tracking-widest text-muted whitespace-nowrap text-right">Current MTPA</th>
                                    <th className="pb-4 pt-2 font-bold text-[10px] uppercase tracking-widest text-muted whitespace-nowrap text-right pr-6">Target MTPA</th>
                                    <th className="pb-4 pt-2 font-bold text-[10px] uppercase tracking-widest text-muted whitespace-nowrap">Parentage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {topPeers.map(([name, profile]: [string, any], index: number) => {
                                    const isUT = name.includes("UltraTech");
                                    return (
                                        <tr key={name} className={`hover:bg-black/5 dark:hover:bg-white/5 transition-colors group ${isUT ? "bg-black/5 dark:bg-white/5" : ""}`}>
                                            <td className="py-6 min-w-[200px]">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[13px] font-black tracking-tight ${isUT ? "text-foreground" : "text-foreground/80 group-hover:text-foreground transition-colors"}`}>
                                                            {name}
                                                        </span>
                                                        {isUT && <span className="px-1.5 py-0.5 bg-foreground text-surface text-[8px] font-bold uppercase rounded-sm tracking-wider">Lead</span>}
                                                    </div>
                                                    <span className="text-[10px] font-mono text-muted group-hover:text-foreground/60 transition-colors">
                                                        {profile.ticker}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-6 text-right">
                                                <div className={`text-[15px] font-bold tabular-nums ${isUT ? "text-foreground" : "text-foreground/70"}`}>
                                                    {profile.capacity_mtpa}
                                                </div>
                                            </td>
                                            <td className="py-6 text-right pr-6">
                                                <div className="flex flex-col items-end gap-1">
                                                    <div className={`text-[15px] font-bold tabular-nums ${isUT ? "text-foreground" : "text-foreground/70"}`}>
                                                        {profile.target_capacity_mtpa || 'N/A'}
                                                    </div>
                                                    {profile.target_year && (
                                                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted">By {profile.target_year}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <div className="text-[12px] font-medium text-foreground/80 tracking-tight">
                                                    {profile.parent_group}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Strategic SWOT & Commentary (Right Column) */}
                <div className="w-full xl:w-[500px] flex flex-col gap-8 flex-shrink-0 animate-fade-in [animation-delay:0.1s]">

                    {/* Dynamic SWOT Comparisons */}
                    {matchUps.slice(0, 2).map(([key, swot]: [string, any], index: number) => {
                        return (
                            <div key={key} className="flex-1 apple-surface rounded-3xl p-8 flex flex-col relative overflow-hidden group border border-border min-h-[250px]">
                                {/* Accent Line */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-foreground/10 group-hover:bg-foreground/20 transition-colors"></div>

                                <div className="flex items-start justify-between mb-6 pt-2">
                                    <div className="flex flex-col gap-1">
                                        <h4 className="text-[13px] font-black tracking-tight text-foreground leading-tight max-w-[280px]">
                                            {swot.comparison}
                                        </h4>
                                        <span className="consulting-label opacity-60">Strategic Matchup</span>
                                    </div>
                                    <Activity className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
                                </div>

                                <div className="flex-1 flex flex-col gap-4 mt-2">
                                    <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-border group-hover:border-foreground/20 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-3 h-3 text-foreground" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-foreground">UT Advantage</span>
                                        </div>
                                        <p className="text-[12px] text-foreground/80 leading-snug">{swot.ultratech_advantage}</p>
                                    </div>

                                    <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-border group-hover:border-foreground/20 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <ShieldAlert className="w-3 h-3 text-muted" />
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-muted">Peer Edge</span>
                                        </div>
                                        <p className="text-[12px] text-muted leading-snug">{swot.shree_advantage || swot.adani_advantage || swot.dalmia_advantage}</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border flex items-start gap-3">
                                    <ArrowUpRight className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
                                    <p className="text-[11px] font-bold text-foreground leading-normal tracking-tight">
                                        {swot.verdict}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};
