"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ChevronRight, ArrowUpRight, Zap } from "lucide-react";

interface IntelligenceAssistantProps {
    isOpen: boolean;
    onClose: () => void;
}

export const IntelligenceAssistant = ({ isOpen, onClose }: IntelligenceAssistantProps) => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Welcome to the Research Assistant. I have interrogated UltraTech's operational, financial, and macro intelligence feeds. How can I assist your analysis?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://abhiyan1021-ultratech-hub.hf.space";

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const handleSend = async (customMsg?: string) => {
        const userMsg = customMsg || input;
        if (!userMsg.trim()) return;

        setInput("");
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsTyping(true);

        try {
            const res = await fetch(`${API_BASE}/api/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMsg })
            });
            const result = await res.json();
            setMessages(prev => [...prev, { role: 'bot', text: result.answer }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'bot', text: "⚠️ Intelligence engine offline. Please retry." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.aside
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 right-0 w-[450px] glass-panel z-[100] shadow-2xl flex flex-col border-l border-obsidian-border"
                >
                    <div className="p-6 border-b border-obsidian-border flex items-center justify-between bg-obsidian-card/40 backdrop-blur-3xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gold/10 rounded-xl">
                                <MessageSquare className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-sm tracking-tight uppercase">Intelligence Assistant</h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Model 1.5 Live</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-obsidian-hover rounded-full transition-colors group">
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-gold transition-colors" />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent to-obsidian/40">
                        {messages.map((msg, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[90%] p-4 rounded-2xl text-[13px] leading-relaxed shadow-sm font-medium ${msg.role === 'user'
                                        ? 'bg-gold text-obsidian font-bold rounded-br-none'
                                        : 'bg-obsidian-card border border-obsidian-border text-slate-300 rounded-bl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-obsidian-card border border-obsidian-border p-5 rounded-2xl rounded-bl-none shadow-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce delay-150"></div>
                                        <div className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce delay-300"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-obsidian-border bg-obsidian-card/60 backdrop-blur-2xl">
                        <div className="relative group">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Interrogate intelligence assets..."
                                className="w-full bg-obsidian border border-obsidian-border rounded-xl py-4 pl-4 pr-12 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold/50 transition-all shadow-inner"
                            />
                            <button
                                onClick={() => handleSend()}
                                className="absolute right-2 top-2 p-2 bg-gold text-obsidian hover:bg-obsidian-hover hover:text-white rounded-lg transition-all active:scale-90 shadow-md"
                            >
                                <ArrowUpRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="mt-5 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {["M&A Outlook", "Risk Analysis", "ESG Scorecard"].map(chip => (
                                <button
                                    key={chip}
                                    onClick={() => handleSend(chip)}
                                    className="whitespace-nowrap px-4 py-2 rounded-xl border border-obsidian-border text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-gold hover:border-gold/30 hover:bg-obsidian-hover transition-all shadow-sm"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};
