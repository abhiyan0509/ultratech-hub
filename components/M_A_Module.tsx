"use client";

import React from "react";
import { Handshake, ArrowRight, ShieldCheck } from "lucide-react";

interface M_A_ModuleProps {
    data: any;
    loading: boolean;
}

export const M_A_Module = ({ data, loading }: M_A_ModuleProps) => {
    const deals = Array.isArray(data?.deals) ? data.deals : [];

    return (
        <div className="apple-surface px-10 py-8 rounded-3xl h-full flex flex-col group relative overflow-hidden">
            {/* Subtle highlight matching V10 aesthetic */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/10 transition-all duration-700 translate-x-1/2 -translate-y-1/2"></div>

            <div className="flex justify-between items-start mb-8 relative z-10 border-b border-border pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-foreground text-surface rounded-xl flex items-center justify-center">
                        <Handshake className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-foreground text-xl font-bold tracking-tight">M&A Pipeline</h2>
                        <p className="consulting-label opacity-60 mt-1">Strategic Transaction Flow</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-4 relative z-10">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="animate-pulse h-28 rounded-2xl bg-black/5 dark:bg-white/5 border border-border"></div>
                    ))
                ) : (
                    deals.slice(0, 5).map((deal: any, i: number) => {
                        const isActive = deal.status === "In Discussions" || deal.status === "Stake Acquired";

                        return (
                            <div key={i} className="p-5 rounded-2xl bg-white/50 dark:bg-obsidian-card/40 border border-border relative group/card shadow-sm transition-all hover:bg-black/5 dark:hover:bg-white/5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${isActive ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-foreground/10 text-foreground'}`}>
                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>}
                                        {deal.status || 'Active'}
                                    </div>
                                    <span className="text-[10px] text-muted font-bold tracking-wider">{deal.year}</span>
                                </div>

                                <h3 className="text-foreground text-[16px] font-bold tracking-tight mb-2 group-hover/card:text-foreground/80 transition-colors">
                                    {deal.target || deal.title}
                                </h3>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-[10px] text-muted font-bold uppercase tracking-tighter mb-0.5">Valuation</div>
                                        <div className={`text-[13px] font-bold ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                                            {deal.deal_value}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-muted font-bold uppercase tracking-tighter mb-0.5">Capacity Added</div>
                                        <div className="text-[13px] font-bold text-foreground">
                                            {deal.capacity_added_mtpa ? `+${deal.capacity_added_mtpa} MTPA` : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-border/50 text-[12px] text-foreground/80 font-medium leading-relaxed">
                                    {deal.strategic_impact || deal.rationale?.[0] || deal.details}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
