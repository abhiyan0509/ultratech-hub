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
    const chartData = history.slice(-45).map((d: any) => ({
        date: d.date,
        price: d.close
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-obsidian/95 border border-khaki/20 p-4 rounded-xl shadow-surface-high backdrop-blur-2xl ring-1 ring-white/5">
                    <p className="executive-label mb-1 text-slate-400">{label}</p>
                    <p className="text-lg font-black text-khaki-light tracking-tighter">₹{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="v9-surface p-8 rounded-3xl h-full flex flex-col group transition-all duration-700">
            <div className="flex justify-between items-start mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-khaki rounded-full"></div>
                        <h3 className="text-white text-base font-black tracking-tighter-executive uppercase">Equity Performance</h3>
                    </div>
                    <p className="executive-label opacity-40">Relative Strategic Market Value</p>
                </div>
                <div className="flex gap-1.5">
                    {['1M', '6M', '1Y', '5Y'].map(t => (
                        <button key={t} className={`px-2 py-1 rounded text-[9px] font-black tracking-widest uppercase transition-colors ${t === '1Y' ? 'bg-khaki/10 text-khaki' : 'text-slate-500 hover:text-slate-300'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-[350px] w-full mt-4">
                {loading ? (
                    <div className="w-full h-full animate-pulse bg-obsidian-depth/50 rounded-2xl" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="v9Gold" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#b4a076" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#b4a076" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#1a1a1a" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#525252', fontSize: 9, fontWeight: 900, textTransform: 'uppercase' }}
                                minTickGap={40}
                                dy={10}
                            />
                            <YAxis
                                hide
                                domain={['auto', 'auto']}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#b4a076', strokeWidth: 1 }} />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#b4a076"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#v9Gold)"
                                animationDuration={1500}
                                dot={false}
                                activeDot={{ r: 4, fill: '#fff', stroke: '#b4a076', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
