"use client";

import React from "react";
import { Calculator, Zap, Truck, Factory, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface UnitEconomicsProps {
    data: any;
    loading: boolean;
}

export const UnitEconomics = ({ data, loading }: UnitEconomicsProps) => {
    // If loading or no data, use fallback data
    const uecData = data?.mba_metrics?.unit_economics || [
        { "category": "Net Sales Realization (NSR)", "value": 5250, "metric": "INR / Ton", "color": "#3b82f6" },
        { "category": "Raw Material & Consumables", "value": -950, "metric": "INR / Ton", "color": "#ef4444" },
        { "category": "Power & Fuel Costs", "value": -1450, "metric": "INR / Ton", "color": "#f97316" },
        { "category": "Freight & Forwarding", "value": -1250, "metric": "INR / Ton", "color": "#eab308" },
        { "category": "Employee & Other Opex", "value": -500, "metric": "INR / Ton", "color": "#a855f7" },
        { "category": "EBITDA", "value": 1100, "metric": "INR / Ton", "color": "#10b981", "highlight": true }
    ];

    // Filter out EBITDA for the waterfall items and find the Golden Metric
    const metrics = uecData.filter((m: any) => !m.highlight);
    const goldenMetric = uecData.find((m: any) => m.highlight) || { value: 1100 };

    // Map icons manually since JSON can't pass icon components
    const iconMap: { [key: string]: any } = {
        "Net Sales Realization (NSR)": Activity,
        "Raw Material & Consumables": Factory,
        "Power & Fuel Costs": Zap,
        "Freight & Forwarding": Truck,
        "Employee & Other Opex": Calculator
    };

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
                {metrics.map((m: any, i: number) => {
                    const Icon = iconMap[m.category] || Calculator;
                    // Provide safe Tailwind equivalents for the dynamic hex colors
                    const twColor = m.category.includes("NSR") ? "text-blue-500" :
                        m.category.includes("Material") ? "text-red-500" :
                            m.category.includes("Power") ? "text-orange-500" :
                                m.category.includes("Freight") ? "text-yellow-500" :
                                    m.category.includes("Employee") ? "text-purple-500" : "text-emerald-500";
                    const twBg = twColor.replace("text-", "bg-") + "/10";

                    return (
                        <div key={i} className="group cursor-default relative">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-md ${twBg}`}>
                                        <Icon className={`w-3.5 h-3.5 ${twColor}`} />
                                    </div>
                                    <span className="font-bold text-[13px] text-foreground/80">{m.category}</span>
                                </div>
                                <span className={`font-mono font-bold text-[15px] tracking-tight text-foreground group-hover:${twColor} transition-colors`}>
                                    ₹{Math.abs(m.value).toLocaleString()}
                                </span>
                            </div>
                            <div className="w-full bg-black/5 dark:bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Math.abs(m.value) / 6000) * 100}%` }}
                                    transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                    className={`h-full rounded-full bg-current ${twColor}`}
                                />
                            </div>
                        </div>
                    );
                })}
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
                        <span className="text-4xl font-black tracking-tighter">{goldenMetric.value.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
