"use client";

import React from "react";
import { MetricCard } from "./MetricCard";

interface MetricsGridProps {
    data: any;
    loading: boolean;
}

export const MetricsGrid = ({ data, loading }: MetricsGridProps) => {
    const company = data?.financials?.companies?.['UltraTech Cement'] || {};
    const quant = data?.quant_metrics?.['UltraTech Cement'] || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
                label="Return on Equity"
                value={quant?.roe?.value || "12.8%"}
                sub="Profitability Yield"
                trend={1.2}
                rationale="Measures a corporation's profitability in relation to stockholders' equity."
                quantNode={quant?.roe}
                loading={loading}
            />
            <MetricCard
                label="Return on Capital"
                value={quant?.roce?.value || "10.4%"}
                sub="ROCE (LTM)"
                trend={-0.4}
                rationale="The ultimate efficiency ratio. Evaluates how much operating income is generated for every rupee of capital employed."
                quantNode={quant?.roce}
                loading={loading}
            />
            <MetricCard
                label="Current Ratio"
                value={quant?.current_ratio?.value || "1.1x"}
                sub="Liquidity Margin"
                rationale="Measures the company's ability to pay short-term obligations or those due within one year."
                quantNode={quant?.current_ratio}
                loading={loading}
            />
            <MetricCard
                label="Debt to Equity"
                value={quant?.debt_equity?.value || "0.2x"}
                sub="Financial Leverage"
                rationale="A strict evaluation of the firm's capital structure and reliance on external creditors."
                quantNode={quant?.debt_equity}
                loading={loading}
            />
        </div>
    );
};
