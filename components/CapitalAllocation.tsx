"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart, Line, Bar } from "recharts";
import { Coins, TrendingUp } from "lucide-react";

export const CapitalAllocation = () => {
    // Hardcoded static data demonstrating how Capex is funded via pure OCF (Operating Cash Flow)
    // without blowing up Debt levels.
    const allocationData = [
        { year: "FY20", ocf: 6500, capex: 1500, fcf: 5000, debtToEbitda: 1.4 },
        { year: "FY21", ocf: 8800, capex: 1200, fcf: 7600, debtToEbitda: 0.6 },
        { year: "FY22", ocf: 9200, capex: 5200, fcf: 4000, debtToEbitda: 0.3 },
        { year: "FY23", ocf: 8500, capex: 5600, fcf: 2900, debtToEbitda: 0.4 },
        { year: "FY24", ocf: 12500, capex: 8900, fcf: 3600, debtToEbitda: 0.4 },
        { year: "FY25E", ocf: 14000, capex: 10500, fcf: 3500, debtToEbitda: 0.5 },
    ];

    return (
        <div className="apple-surface p-10 rounded-3xl h-full flex flex-col justify-between border border-border/50 relative overflow-hidden group">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-8 pb-4 border-b border-border/50 relative z-10">
                <div className="flex flex-col gap-1">
                    <h3 className="text-foreground text-xl font-black tracking-tight flex items-center gap-2">
                        <Coins className="w-5 h-5 text-emerald-500" />
                        Capital Allocation Engine
                    </h3>
                    <p className="consulting-label opacity-60">Funding 200 MTPA via Internal Accruals (₹ Crores)</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[12px] font-bold text-foreground/50 uppercase tracking-widest">Target Net Debt / EBITDA</span>
                    <span className="text-xl font-black text-emerald-500">&lt; 0.5x</span>
                </div>
            </div>

            {/* Core Visualization */}
            <div className="flex-1 w-full min-h-[300px] relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={allocationData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="ocfGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="capexGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="year"
                            stroke="rgba(255,255,255,0.2)"
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="rgba(255,255,255,0.2)"
                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 600 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => `₹${val / 1000}k`}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                                color: '#fff',
                                padding: '12px 16px'
                            }}
                            itemStyle={{
                                fontSize: '14px',
                                fontWeight: 600
                            }}
                            labelStyle={{
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '12px',
                                fontWeight: 700,
                                marginBottom: '8px',
                                textTransform: 'uppercase'
                            }}
                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                            formatter={(value: number, name: string) => {
                                if (name === 'Net Debt / EBITDA (x)') return [value + 'x', name];
                                return ['₹' + value.toLocaleString() + ' Cr', name];
                            }}
                        />

                        {/* Capex - Bar */}
                        <Bar
                            yAxisId="left"
                            dataKey="capex"
                            name="Capital Expenditure"
                            fill="#f59e0b"
                            radius={[4, 4, 0, 0]}
                            barSize={30}
                        />

                        {/* OCF - Area */}
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="ocf"
                            name="Operating Cash Flow"
                            stroke="#10b981"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#ocfGradient)"
                        />

                        {/* FCF - Line */}
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="fcf"
                            name="Free Cash Flow"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ r: 4, fill: '#000', stroke: '#3b82f6', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#3b82f6', stroke: '#000' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Strategic Insight Box */}
            <div className="mt-6 pt-6 border-t border-border/50 relative z-10 flex gap-4">
                <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-center">
                    <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Capital Strategy</span>
                    <span className="text-sm font-semibold text-emerald-400">Zero Equity Dilution</span>
                    <span className="text-xs text-foreground/60 mt-1">Growth funded entirely via OCF.</span>
                </div>
                <div className="flex-1 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col justify-center">
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mb-1">Growth Runway</span>
                    <span className="text-sm font-semibold text-amber-400">Aggressive Capex</span>
                    <span className="text-xs text-foreground/60 mt-1">Sustaining ₹10k+ Cr annual run-rate.</span>
                </div>
            </div>
        </div>
    );
};
