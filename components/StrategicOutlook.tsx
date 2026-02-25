"use client";

import React from "react";
import { TrendingUp, ShieldAlert, Target } from "lucide-react";

interface StrategicOutlookProps {
    data: any;
    loading: boolean;
}

export const StrategicOutlook = ({ data, loading }: StrategicOutlookProps) => {

    // Prepare fallback or empty state while loading
    if (loading || !data?.outlook) {
        return (
            <div className="w-full flex-col gap-6 apple-surface rounded-3xl p-10 min-h-[350px] flex items-center justify-center border border-border">
                <Target className="w-8 h-8 text-muted animate-pulse mb-4" />
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest animate-pulse">
                    Computing Strategic Vectors...
                </div>
            </div>
        );
    }

    const { outlook } = data;
    const forecasts = Array.isArray(outlook.future_outlook) ? outlook.future_outlook : [];
    const risks = Array.isArray(outlook.risk_factors) ? outlook.risk_factors : [];

    return (
        <div className="w-full flex flex-col gap-6 flex-shrink-0 min-h-[350px]">
            {/* Forward Forecasts Card */}
            <div className="flex-1 apple-surface rounded-3xl p-8 flex flex-col relative overflow-hidden group border border-border transition-all hover:bg-black/5 dark:hover:bg-white/5">
                <div className="flex items-start justify-between mb-8 pb-4 border-b border-border/50">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-[15px] font-black tracking-tight text-foreground leading-tight uppercase flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Forward Forecasts
                        </h4>
                        <span className="consulting-label opacity-60">Projected Growth Vectors</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2">
                    {forecasts.map((forecast: any, i: number) => (
                        <div key={i} className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/40 dark:bg-obsidian-card/40 border border-border group-hover:border-foreground/20 transition-colors shadow-sm">
                            <h5 className="text-[12px] font-bold uppercase tracking-tight text-foreground">
                                {forecast.topic || forecast.title || forecast}
                            </h5>
                            <p className="text-[12px] text-foreground/80 leading-relaxed font-medium">
                                {forecast.description || forecast.insight || ""}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Strategic Risks Card */}
            <div className="flex-1 apple-surface rounded-3xl p-8 flex flex-col relative overflow-hidden group border border-border border-l-4 border-l-red-500/20 hover:border-l-red-500/50 transition-all bg-red-50/10 dark:bg-red-950/10">
                <div className="flex items-start justify-between mb-8 pb-4 border-b border-border/50">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-[15px] font-black tracking-tight text-red-700 dark:text-red-400 leading-tight uppercase flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4" />
                            Strategic Risks
                        </h4>
                        <span className="consulting-label opacity-60">Vulnerability Assessment</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-5 overflow-y-auto custom-scrollbar pr-2">
                    {risks.map((risk: any, i: number) => (
                        <div key={i} className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/40 dark:bg-obsidian-card/40 border border-red-500/10 transition-colors shadow-sm">
                            <div className="flex items-center justify-between">
                                <h5 className="text-[12px] font-bold uppercase tracking-tight text-red-700 dark:text-red-400/80">
                                    {risk.risk || risk.factor || risk}
                                </h5>
                                {risk.severity && (
                                    <span className="text-[9px] font-bold text-red-600/60 uppercase tracking-widest px-2- py-0.5 bg-red-500/10 rounded">
                                        {risk.severity} Severity
                                    </span>
                                )}
                            </div>
                            <p className="text-[12px] text-foreground/80 leading-relaxed font-medium">
                                {risk.rationale || risk.mitigation || risk.description || ""}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
