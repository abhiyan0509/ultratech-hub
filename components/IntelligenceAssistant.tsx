"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Zap, MessageSquare } from "lucide-react";

interface IntelligenceAssistantProps {
    isOpen: boolean;
    onClose: () => void;
}

export const IntelligenceAssistant = ({ isOpen, onClose }: IntelligenceAssistantProps) => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Welcome to the V9 Intelligence Assistant. Strategic datasets are synchronized. How can I facilitate your analysis?" }
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
            setMessages(prev => [...prev, { role: 'bot', text: "⚠️ Intelligence bridge disrupted. Model recalibrating." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-obsidian-card z-[100] border-l border-obsidian-border shadow-surface-high flex flex-col"
                    >
                        <div className="p-8 pb-6 border-b border-obsidian-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-khaki/10 rounded-lg">
                                    <Zap className="w-5 h-5 text-khaki" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-xs uppercase tracking-extra-wide leading-tight">Intelligence Assistant</h3>
                                    <span className="text-slate-600 text-[9px] uppercase font-black tracking-extra-wide">UltraTech Asset Interrogator</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-all">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-5 rounded-xl text-[13px] leading-relaxed tracking-tight ${msg.role === 'user'
                                            ? 'bg-khaki text-obsidian font-bold rounded-tr-none shadow-sm'
                                            : 'bg-obsidian-depth border border-obsidian-border text-slate-200 rounded-tl-none font-medium'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-obsidian-depth border border-obsidian-border px-5 py-4 rounded-xl rounded-tl-none flex gap-1.5 shadow-inner">
                                        <div className="w-1 h-1 bg-khaki/40 rounded-full animate-bounce"></div>
                                        <div className="w-1 h-1 bg-khaki/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1 h-1 bg-khaki/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 border-t border-obsidian-border/50 bg-obsidian-depth/50">
                            <div className="relative">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="Interrogate data assets..."
                                    className="w-full bg-black border border-obsidian-border rounded-xl py-4.5 pl-6 pr-14 text-[13px] text-white placeholder-slate-700 focus:outline-none focus:border-khaki/40 transition-all font-medium"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-khaki text-black hover:bg-white transition-all rounded-lg active:scale-90"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar pb-2">
                                {["M&A Synthesis", "Risk Vectors", "Equity Forecast"].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => handleSend(q)}
                                        className="whitespace-nowrap px-4 py-2 border border-obsidian-border rounded-full text-[9px] font-black uppercase tracking-extra-wide text-slate-500 hover:text-khaki hover:border-khaki/20 transition-all"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};
