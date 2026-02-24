"use client";

import React from "react";
import { MetricCard } from "./MetricCard";

interface MetricsGridProps {
    data: any;
    loading: boolean;
}

export const MetricsGrid = ({ data, loading }: MetricsGridProps) => {
    const company = data?.financials?.companies?.['UltraTech Cement'] || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
                label="Market Capitalization"
                value={company.market_cap || "₹3.82T"}
                sub="INR (Consolidated)"
                trend={2.4}
                loading={loading}
            />
            <MetricCard
                label="Spot Exchange Price"
                value={company.current_price || "₹12,976"}
                sub="NSE: ULTRACEMCO"
                trend={company.ytd_return_raw || 1.2}
                loading={loading}
            />
            <MetricCard
                label="Operational Baseline"
                value={data?.company_info?.capacity_mtpa || "186.4"}
                sub="MTPA Capacity (FY26 Forecast)"
                loading={loading}
            />
            <MetricCard
                label="Premium Valuation"
                value={company.pe_ratio || "51.2"}
                sub="P/E Multiplier (LTM)"
                loading={loading}
            />
        </div>
    );
};
