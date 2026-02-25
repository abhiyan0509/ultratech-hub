"use client";

import React from "react";
import { Calculator, Zap, Truck, Factory, Activity } from "lucide-react";
import { motion } from "framer-motion";

export const UnitEconomics = () => {
    // FY24 / Q3FY25 verified estimates
    const metrics = [
        { label: "Net Sales Realization (NSR)", value: 6050, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Raw Material Cost", value: 950, icon: Factory, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Power & Fuel Cost", value: 1450, icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Freight & Forwarding", value: 1350, icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10" },
    ];

    const ebitdaPerTon = 1100; // Calculated approximation based on fixed/variable costs

    return (
        <div className="apple-surface p-10 rounded-3xl h-full flex flex-col justify-between">
            <div className="mb-8 border-b border-border/50 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Calculator className="w-5 h-5 text-muted" />
                    <h3 className="text-foreground text-xl font-black tracking-tight">Per-Ton Unit Economics</h3>
                </div>
                <p className="consulting-label opacity-60">Operational Cost Curve (₹ / Metric Ton) - FY24 Base</p>
            </div>

            {/* Waterfall / Progress Visualization */}
            <div className="flex-grow flex flex-col justify-center space-y-6">
                {metrics.map((m, i) => (
                    <div key={i} className="group cursor-default relative">
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-md ${m.bg}`}>
                                    <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                                </div>
                                <span className="font-bold text-[13px] text-foreground/80">{m.label}</span>
                            </div>
                            <span className="font-mono font-bold text-[15px] tracking-tight text-foreground group-hover:text-emerald-500 transition-colors">
                                ₹{m.value.toLocaleString()}
                            </span>
                        </div>
                        <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(m.value / 6500) * 100}%` }}
                                transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                className={`h-full rounded-full bg-current ${m.color}`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Golden Metric Box */}
            <div className="mt-8 pt-6 border-t border-border/50">
                <div className="bg-foreground text-surface p-6 rounded-2xl flex items-center justify-between shadow-apple-md">
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-70 block mb-1">The Golden Metric</span>
                        <span className="text-xl font-black tracking-tight">EBITDA per Ton</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-sm font-bold opacity-70">₹</span>
                        <span className="text-4xl font-black tracking-tighter">{ebitdaPerTon.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
