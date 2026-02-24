"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Clock, ChevronRight } from "lucide-react";

interface NewsFeedProps {
    data: any;
    loading: boolean;
}

export const NewsFeed = ({ data, loading }: NewsFeedProps) => {
    const news = Array.isArray(data?.news) ? data.news : [];

    return (
        <div className="v9-surface p-8 rounded-3xl h-full flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-khaki rounded-full"></div>
                        <h3 className="text-white text-base font-black tracking-tighter-executive uppercase">Intelligence Stream</h3>
                    </div>
                    <p className="executive-label opacity-40">Tactical Market News-Flow</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-0 custom-scrollbar pr-4">
                {loading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className="py-6 border-b border-obsidian-border animate-pulse h-24"></div>
                    ))
                ) : (
                    news.slice(0, 12).map((item: any, i: number) => (
                        <motion.a
                            key={i}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="group/item flex items-start gap-6 py-6 border-b border-obsidian-border/50 first:pt-0 last:border-none transition-all"
                        >
                            <div className="flex flex-col items-center">
                                <div className="text-[9px] font-black text-khaki uppercase tracking-widest bg-khaki/5 border border-khaki/10 px-2 py-1 rounded">
                                    {item.source?.substring(0, 3) || "INT"}
                                </div>
                                <div className="w-px h-full bg-obsidian-border group-last/item:hidden mt-2"></div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1.5 opacity-40 group-hover/item:opacity-70 transition-opacity">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Asset Update</span>
                                </div>
                                <h4 className="text-[14px] font-bold text-slate-200 leading-snug group-hover/item:text-khaki-light transition-colors line-clamp-2 pr-4">
                                    {item.title}
                                </h4>
                                <div className="mt-2 flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-extra-wide group-hover/item:text-slate-300 transition-colors">
                                    <span>Deep Insight Reference</span>
                                    <ChevronRight className="w-3 h-3 group-hover/item:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </motion.a>
                    ))
                )}
            </div>
        </div>
    );
};
