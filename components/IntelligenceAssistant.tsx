"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";

interface IntelligenceAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    initialQuery?: string;
    onQueryProcessed?: () => void;
}

const renderMessageText = (text: string) => {
    // Basic markdown parser for **bold** text
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={index} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
        }
        return <span key={index}>{part}</span>;
    });
};

export const IntelligenceAssistant = ({ isOpen, onClose, initialQuery, onQueryProcessed }: IntelligenceAssistantProps) => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hello! I am your UltraTech Intelligence Assistant. I can help analyze UltraTech's financials, supply chain, and growth targets. I am also trained on the broader cement manufacturing industry, housing sector dynamics, and relevant Government of India policies. How can I assist you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);



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
            const res = await fetch(`/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMsg })
            });
            const result = await res.json();

            if (res.ok) {
                setMessages(prev => [...prev, { role: 'bot', text: result.answer }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: `Error: ${result.error}` }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'bot', text: "System Error: Connection to backend intelligence failed." }]);
        } finally {
            setIsTyping(false);
            if (onQueryProcessed) onQueryProcessed();
        }
    };

    useEffect(() => {
        if (initialQuery && isOpen) {
            handleSend(initialQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuery, isOpen]);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-[90]"
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                        className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-surface z-[100] border-l border-border shadow-apple-lg flex flex-col"
                    >
                        <div className="p-8 pb-6 border-b border-border flex items-center justify-between bg-surface">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-foreground text-surface rounded-lg">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-foreground font-bold text-[15px] tracking-tight leading-tight">Query Intelligence</h3>
                                    <span className="consulting-label text-[9px]">V10 Natural Language Interface</span>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-muted hover:text-foreground transition-colors bg-black/5 dark:bg-white/5 rounded-md">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>

                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-background/50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed tracking-tight ${msg.role === 'user'
                                        ? 'bg-foreground text-surface font-medium rounded-tr-sm shadow-sm'
                                        : 'bg-surface border border-border text-foreground rounded-tl-sm shadow-sm whitespace-pre-wrap'
                                        }`}>
                                        {renderMessageText(msg.text)}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-surface border border-border px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                                        <div className="flex space-x-1.5 items-center h-4">
                                            <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                            <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                            <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 border-t border-border bg-surface">
                            <div className="relative">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask a question..."
                                    className="w-full bg-background border border-border rounded-xl py-4 flex pl-5 pr-14 text-[14px] text-foreground placeholder-muted focus:outline-none focus:border-foreground/30 transition-all shadow-sm"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-foreground text-surface hover:opacity-80 transition-opacity rounded-lg"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {["Summarize M&A", "Key Risks", "Provide Outlook"].map(q => (
                                    <button
                                        key={q}
                                        onClick={() => handleSend(q)}
                                        className="whitespace-nowrap px-3 py-1.5 border border-border rounded-lg text-[10px] font-bold uppercase tracking-wider text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground transition-colors"
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
