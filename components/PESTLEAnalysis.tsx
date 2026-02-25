"use client";

import React from "react";
import { Landmark, TrendingUp, Users2, Cpu, Scale, Leaf, Globe2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const PESTLEAnalysis = () => {
    // Hardcoded context for UltraTech / Indian Cement Industry
    const factors = [
        {
            category: "Political",
            icon: Landmark,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            title: "Infrastructure Push",
            desc: "Government's massive Rs.11万 Crore (3.4% of GDP) capex outlay directly translates to cement demand for roads, railways, and defense infrastructure."
        },
        {
            category: "Economic",
            icon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            title: "Inflation & Rates",
            desc: "High interest rates temporarily cool affordable housing demand, while volatile energy costs (petcoke/coal) pressure short-term EBITDA margins."
        },
        {
            category: "Social",
            icon: Users2,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            title: "Urbanization Surge",
            desc: "Rapid rural-to-urban migration drives vertical housing and Tier-2 city expansion, creating structural, multi-decade demand."
        },
        {
            category: "Technological",
            icon: Cpu,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            title: "Smart Manufacturing",
            desc: "AI-driven kilns, automated logistics, and predictive maintenance reduce energy intensity by 12% and enhance production uptime."
        },
        {
            category: "Legal",
            icon: Scale,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            border: "border-rose-500/20",
            title: "Mining Regulations",
            desc: "Stricter limestone auction rules and land acquisition laws create entry barriers, heavily favoring incumbents with existing reserves."
        },
        {
            category: "Environmental",
            icon: Leaf,
            color: "text-teal-500",
            bg: "bg-teal-500/10",
            border: "border-teal-500/20",
            title: "Decarbonization",
            desc: "Intense pressure to reach Net Zero. Accelerating focus on blended cement, green energy targets (60% by 2030), and WHRS (Waste Heat Recovery)."
        }
    ];

    return (
        <div className="apple-surface p-6 sm:p-8 rounded-2xl border border-border/50 h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Globe2 className="text-muted" size={24} />
                    Macro-Environmental Analysis (PESTLE)
                </h3>
                <p className="text-sm text-muted font-medium mt-1">Evaluating external systemic factors shaping UltraTech's operational theater.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
                {factors.map((f, i) => {
                    const Icon = f.icon;
                    return (
                        <div key={i} className={cn(
                            "p-5 rounded-2xl border transition-colors hover:shadow-apple-md",
                            "bg-surface hover:bg-black/5 dark:hover:bg-white/5",
                            f.border
                        )}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className={cn("p-2.5 rounded-xl", f.bg, f.color)}>
                                    <Icon size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted">{f.category}</div>
                                    <div className="text-sm font-black tracking-tight text-foreground">{f.title}</div>
                                </div>
                            </div>
                            <p className="text-[12px] text-muted font-medium leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
