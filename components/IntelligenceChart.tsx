"use client";

import React from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

interface IntelligenceChartProps {
    data: any;
    loading: boolean;
}

export const IntelligenceChart = ({ data, loading }: IntelligenceChartProps) => {
    const history = data?.financials?.companies?.['UltraTech Cement']?.price_history || [];
    const chartData = history.slice(-30).map((d: any) => ({
        date: d.date,
        price: d.close
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-obsidian-card border border-gold/20 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">{label}</p>
                    <p className="text-sm font-black text-gold">₹{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="glass-panel p-8 rounded-3xl h-full flex flex-col relative overflow-hidden group">
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-gold/10 transition-all duration-700"></div>

            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <h3 className="text-white text-lg font-black tracking-tight uppercase flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-gold rounded-full"></div>
                        Equity Performance
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-bold">Relative Market Return Spectrum</p>
                </div>
            </div>

            <div className="flex-1 min-h-[300px] w-full relative">
                {loading ? (
                    <div className="absolute inset-0 animate-shimmer rounded-xl opacity-10 bg-gold/5"></div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f1f23" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                minTickGap={30}
                            />
                            <YAxis
                                hide
                                domain={['auto', 'auto']}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#d4af37"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPrice)"
                                animationDuration={2000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
