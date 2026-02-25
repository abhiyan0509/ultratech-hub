"use client";

import React, { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface IntelligenceChartProps {
    data: any;
    loading: boolean;
}

export const IntelligenceChart = ({ data, loading }: IntelligenceChartProps) => {
    const [period, setPeriod] = useState('1Y');
    const history = data?.financials?.companies?.['UltraTech Cement']?.price_history || [];

    const getSliceCount = (p: string) => {
        switch (p) {
            case '1M': return -22;
            case '6M': return -130;
            case '1Y': return -252;
            case '5Y': return -1260;
            default: return -252;
        }
    };

    const chartData = history.slice(getSliceCount(period)).map((d: any) => ({
        date: d.date,
        price: d.close
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-border px-4 py-3 rounded-xl shadow-apple-lg">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">{label}</p>
                    <p className="text-xl font-bold text-foreground tracking-tight">₹{payload[0].value.toLocaleString()}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="apple-surface p-8 rounded-3xl h-full flex flex-col transition-all duration-300">
            <div className="flex justify-between items-start mb-10 border-b border-border pb-6">
                <div>
                    <h3 className="text-foreground text-xl font-bold tracking-tight mb-1">Equity Performance</h3>
                    <p className="consulting-label opacity-60">Consolidated Market Value Trajectory</p>
                </div>
                <div className="flex gap-2">
                    {['1M', '6M', '1Y', '5Y'].map(t => (
                        <button
                            key={t}
                            onClick={() => setPeriod(t)}
                            className={`px-3 py-1.5 rounded-md text-[11px] font-bold tracking-widest uppercase transition-colors ${period === t ? 'bg-foreground text-surface' : 'bg-transparent text-muted hover:bg-black/5 dark:hover:bg-white/5'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-[350px] w-full pt-4">
                {loading ? (
                    <div className="w-full h-full animate-pulse bg-black/5 dark:bg-white/5 rounded-2xl" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.5} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted)', fontSize: 10, fontWeight: 600 }}
                                minTickGap={50}
                                dy={15}
                            />
                            <YAxis
                                domain={['auto', 'auto']}
                                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                                tick={{ fill: 'var(--muted)', fontSize: 10, fontWeight: 600 }}
                                axisLine={false}
                                tickLine={false}
                                width={65}
                                dx={-10}
                            />
                            <Tooltip cursor={{ stroke: 'var(--muted)', strokeWidth: 1, strokeDasharray: '4 4' }} content={<CustomTooltip />} />
                            <Area
                                type="step"
                                dataKey="price"
                                stroke="var(--foreground)"
                                strokeWidth={2}
                                fill="transparent"
                                animationDuration={1000}
                                activeDot={{ r: 5, fill: 'var(--surface)', stroke: 'var(--foreground)', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
