"use client";

import React from "react";
import { Leaf, Wind, Sun, Factory } from "lucide-react";

interface ESGScorecardProps {
    data: any;
    loading: boolean;
}

export const ESGScorecard = ({ data, loading }: ESGScorecardProps) => {
    const esgData = data?.mba_metrics?.esg_scorecard || [
        { "metric": "Green Power Mix", "current": 25.4, "target": 60.0, "deadline": "FY26", "unit": "%", "status": "on_track", "icon": "wind" },
        { "metric": "WHRS Capacity", "current": 296, "target": 425, "deadline": "FY26", "unit": "MW", "status": "on_track", "icon": "factory" },
        { "metric": "Net CO2 Intensity", "current": 546, "target": 462, "deadline": "FY32", "unit": "kg/t", "status": "in_progress", "icon": "cloud-off" },
        { "metric": "Water Positivity", "current": 4.5, "target": 5.0, "deadline": "FY30", "unit": "x", "status": "achieved", "icon": "droplet" }
    ];

    const iconMap: { [key: string]: any } = {
        "wind": Wind,
        "sun": Sun,
        "factory": Factory,
        "cloud-off": Wind,
        "droplet": Leaf
    };

    return (
        <div className="apple-surface p-10 rounded-3xl h-full flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-bl-[100px] -mr-10 -mt-10 blur-3xl pointer-events-none"></div>

            <div className="mb-8 border-b border-border/50 pb-6 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                    <Leaf className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-foreground text-xl font-black tracking-tight">ESG & Sustainability Scorecard</h3>
                </div>
                <p className="consulting-label opacity-60">Decarbonization Targets & The Green Transition</p>
            </div>

            <div className="flex-grow grid grid-cols-2 gap-6 relative z-10">
                {esgData.map((item: any, i: number) => {
                    const Icon = iconMap[item.icon] || Leaf;
                    const isPositive = item.status === "on_track" || item.status === "achieved";

                    return (
                        <div key={i} className={`border rounded-2xl p-6 flex flex-col justify-between ${isPositive ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-black/5 dark:bg-white/5 border-border/50'}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Icon className={`w-4 h-4 ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted'}`} />
                                <span className={`text-[11px] font-bold uppercase tracking-widest ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted'}`}>
                                    {item.metric}
                                </span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-1 mb-1">
                                    <span className="text-3xl font-black tracking-tighter text-foreground">{item.current}</span>
                                    <span className={`font-bold text-xs ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted'}`}>{item.unit}</span>
                                </div>
                                <span className={`text-[10px] font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-500' : 'text-muted'}`}>
                                    Target {item.target} by {item.deadline}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 relative z-10">
                <p className="text-[11px] font-medium text-foreground/70 leading-relaxed italic">
                    "UltraTech is committed to reducing its carbon footprint through extensive investments in Waste Heat Recovery Systems (WHRS) and renewable power, aligning with global Net Zero 2050 ambitions."
                </p>
            </div>
        </div>
    );
};
