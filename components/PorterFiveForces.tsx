"use client";

import React from "react";
import { ShieldAlert, Users, Truck, Shuffle, Swords, ShieldBan } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const ForceCard = ({ data, className }: { data: any, className?: string }) => {
    const Icon = data.icon;
    const isHigh = data.intensity === "High";
    const isMed = data.intensity === "Medium";

    return (
        <div className={cn(
            "relative group p-5 rounded-2xl border transition-all duration-300",
            isHigh ? "bg-red-500/5 hover:bg-red-500/10 border-red-500/20" :
                isMed ? "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20" :
                    "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20",
            className
        )}>
            <div className="flex justify-between items-start mb-3">
                <div className={cn(
                    "p-2 rounded-lg",
                    isHigh ? "bg-red-500/10 text-red-500" :
                        isMed ? "bg-amber-500/10 text-amber-500" :
                            "bg-emerald-500/10 text-emerald-500"
                )}>
                    <Icon size={18} />
                </div>
                <div className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
                    isHigh ? "bg-red-500/10 text-red-600 dark:text-red-400" :
                        isMed ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                )}>
                    {data.intensity}
                </div>
            </div>
            <h4 className="text-sm font-bold text-foreground mb-1 tracking-tight">{data.title}</h4>
            <p className="text-[11px] text-muted leading-relaxed font-medium">{data.desc}</p>
        </div>
    );
};

export const PorterFiveForces = () => {
    const forces = {
        rivalry: { title: "Industry Rivalry", intensity: "High", icon: Swords, desc: "Intense consolidation phase. Aggressive capacity expansion via M&A by Adani (Ambuja/ACC) directly challenges UltraTech's apex position." },
        entrants: { title: "Threat of New Entrants", intensity: "Low", icon: ShieldBan, desc: "Massive capex requirements, regulatory hurdles for limestone mining, and required distribution networks create insurmountable moats." },
        substitutes: { title: "Threat of Substitutes", intensity: "Low", icon: Shuffle, desc: "No viable ubiquitous alternative to cement in structural construction. Emerging green-cement tech is largely co-opted by incumbents." },
        suppliers: { title: "Power of Suppliers", intensity: "Medium", icon: Truck, desc: "Highly dependent on energy (coal/petcoke) and logistics. UltraTech hedges via captive power plants but remains exposed to global crude." },
        buyers: { title: "Power of Buyers", intensity: "Medium", icon: Users, desc: "B2B (Infra/Real Estate) buyers have high negotiation power on volume. B2C (Retail) buyers are highly fragmented and brand-loyal." }
    };

    return (
        <div className="apple-surface p-6 sm:p-8 rounded-2xl border border-border/50 h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <ShieldAlert className="text-muted" size={24} />
                    Porter's Five Forces
                </h3>
                <p className="text-sm text-muted font-medium mt-1">Structural analysis of the Indian cement industry's competitive intensity and profit potential.</p>
            </div>

            <div className="flex-1 relative flex flex-col items-center justify-center p-4">

                {/* Desktop Grid Layout (Cross structure) */}
                <div className="hidden lg:grid grid-cols-3 gap-6 w-full max-w-4xl relative z-10">
                    {/* Top Row: Entrants */}
                    <div className="col-start-2">
                        <ForceCard data={forces.entrants} />
                    </div>

                    {/* Middle Row: Suppliers, Rivalry, Buyers */}
                    <div className="col-start-1 mt-6">
                        <ForceCard data={forces.suppliers} />
                    </div>
                    <div className="col-start-2 mt-6 transform scale-105 z-20 shadow-apple-lg rounded-2xl">
                        <ForceCard data={forces.rivalry} className="bg-surface shadow-md" />
                    </div>
                    <div className="col-start-3 mt-6">
                        <ForceCard data={forces.buyers} />
                    </div>

                    {/* Bottom Row: Substitutes */}
                    <div className="col-start-2 mt-6">
                        <ForceCard data={forces.substitutes} />
                    </div>
                </div>

                {/* Mobile/Tablet Stack */}
                <div className="lg:hidden flex flex-col gap-4 w-full">
                    <ForceCard data={forces.rivalry} className="bg-surface shadow-md border-foreground/20" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ForceCard data={forces.entrants} />
                        <ForceCard data={forces.substitutes} />
                        <ForceCard data={forces.suppliers} />
                        <ForceCard data={forces.buyers} />
                    </div>
                </div>

            </div>
        </div>
    );
};
