"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface NewsFeedProps {
    data: any;
    loading: boolean;
}

export const NewsFeed = ({ data, loading }: NewsFeedProps) => {
    // The crawler agent nests the articles array inside a `news` or `feed` property within the main `data.news` payload
    const rawNews = data?.news?.news || data?.news?.feed || data?.news;
    const news = Array.isArray(rawNews) ? rawNews : [];

    return (
        <div className="apple-surface px-10 py-8 rounded-3xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-10 border-b border-border pb-6">
                <div>
                    <h3 className="text-foreground text-xl font-bold tracking-tight mb-1">Intelligence Stream</h3>
                    <p className="consulting-label opacity-60">Tactical Market News-Flow</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-0 custom-scrollbar pr-6">
                {loading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="py-6 border-b border-border animate-pulse h-24"></div>
                    ))
                ) : (
                    news.slice(0, 12).map((item: any, i: number) => (
                        <a
                            key={i}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col gap-2 py-6 border-b border-border first:pt-0 last:border-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors -mx-4 px-4 rounded-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-[10px] font-bold text-foreground bg-border/50 px-2 py-0.5 rounded uppercase tracking-widest">
                                    {item.source?.substring(0, 3) || "INT"}
                                </div>
                                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Live</span>
                            </div>
                            <h4 className="text-[15px] font-semibold text-foreground leading-snug">
                                {item.title}
                            </h4>
                            <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-muted uppercase tracking-widest group-hover:text-foreground transition-colors">
                                <span>Read Brief</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </a>
                    ))
                )}
            </div>
        </div>
    );
};
