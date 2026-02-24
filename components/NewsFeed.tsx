"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Clock } from "lucide-react";

interface NewsFeedProps {
    data: any;
    loading: boolean;
}

export const NewsFeed = ({ data, loading }: NewsFeedProps) => {
    const news = Array.isArray(data?.news) ? data.news : [];

    return (
        <div className="glass-panel p-8 rounded-3xl h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-gold/10 transition-all duration-700"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className="text-white text-lg font-black tracking-tight uppercase flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-gold rounded-full"></div>
                        Intelligence Stream
                    </h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mt-1 font-bold">Real-Time Strategic News-Flow</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 relative z-10">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-obsidian-card/40 border border-obsidian-border p-5 rounded-2xl animate-shimmer opacity-10 h-32"></div>
                    ))
                ) : (
                    news.slice(0, 10).map((item: any, i: number) => (
                        <motion.a
                            key={i}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="block bg-obsidian-card/40 border border-obsidian-border p-5 rounded-2xl hover:border-gold/30 hover:bg-obsidian-hover/50 transition-all group/card shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[9px] font-black text-gold uppercase tracking-[0.2em] bg-gold/10 px-2 py-0.5 rounded-full border border-gold/10 overflow-hidden relative">
                                    {item.source || "Intelligence"}
                                </span>
                                <Clock className="w-3 h-3 text-slate-500" />
                            </div>
                            <h4 className="text-[13px] font-bold text-slate-200 leading-snug group-hover/card:text-white transition-colors line-clamp-2">
                                {item.title}
                            </h4>
                            <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <span>Interrogate Dataset</span>
                                <ExternalLink className="w-3 h-3 group-hover/card:translate-x-1 group-hover/card:-translate-y-1 transition-transform" />
                            </div>
                        </motion.a>
                    ))
                )}
            </div>
        </div>
    );
};
