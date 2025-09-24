import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatbotWidget({ responses }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi 👋 I’m your site assistant! Type 'help' to see what I can do." },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);

    const endRef = useRef(null);

    // Auto scroll to bottom when messages or typing changes
    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, typing]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        const key = Object.keys(responses).find((k) =>
            input.toLowerCase().includes(k)
        );

        let reply = key ? responses[key] : "🤔 I don’t know that one. Try 'help'.";
        if (Array.isArray(reply)) {
            reply = reply[Math.floor(Math.random() * reply.length)];
        }

        setTyping(true); // show typing
        setInput("");

        setTimeout(() => {
            setTyping(false);
            setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
        }, 1500);
    };

    return (
        <>
            {/* Floating Button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    style={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        borderRadius: "50%",
                        width: 56,
                        height: 56,
                        background: "rgba(139,92,246,0.15)",
                        color: "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(255,255,255,0.2)",
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                        cursor: "pointer",
                        zIndex: 1000,
                        transition: "all 0.3s ease",
                    }}
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: "fixed",
                            bottom: 80,
                            right: 20,
                            width: 320,
                            height: 400,
                            background: "rgba(7,16,41,0.85)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            borderRadius: 14,
                            boxShadow: "0 8px 20px rgba(0,0,0,0.5)",
                            display: "flex",
                            flexDirection: "column",
                            overflow: "hidden",
                            zIndex: 1000,
                            fontFamily: "'Fira Code', monospace",
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                background: "var(--accent)",
                                color: "white",
                                padding: "10px 14px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontWeight: 700,
                            }}
                        >
                            TerminalBot
                            <button
                                onClick={() => setOpen(false)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "white",
                                    cursor: "pointer",
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            style={{
                                flex: 1,
                                padding: "10px",
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                background: "rgba(255,255,255,0.02)",
                            }}
                            className="chat-scroll"
                        >
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    style={{
                                        alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                        background:
                                            msg.sender === "user"
                                                ? "var(--accent)"
                                                : "rgba(255,255,255,0.08)",
                                        color: msg.sender === "user" ? "white" : "var(--text)",
                                        padding: "6px 10px",
                                        borderRadius: 8,
                                        maxWidth: "80%",
                                        fontSize: 13,
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {msg.text}
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {typing && (
                                <div
                                    style={{
                                        alignSelf: "flex-start",
                                        background: "rgba(255,255,255,0.08)",
                                        color: "var(--text)",
                                        padding: "6px 10px",
                                        borderRadius: 8,
                                        fontSize: 13,
                                        display: "flex",
                                        gap: 4,
                                        fontFamily: "'Fira Code', monospace",
                                    }}
                                >
                                    <span className="dot">.</span>
                                    <span className="dot">.</span>
                                    <span className="dot">.</span>
                                </div>
                            )}
                            <div ref={endRef} />
                        </div>

                        {/* Input */}
                        <div
                            style={{
                                display: "flex",
                                padding: 8,
                                borderTop: "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="> Type a command..."
                                style={{
                                    flex: 1,
                                    padding: "8px",
                                    borderRadius: 6,
                                    border: "none",
                                    outline: "none",
                                    background: "rgba(255,255,255,0.06)",
                                    color: "var(--text)",
                                    fontSize: 13,
                                    fontFamily: "'Fira Code', monospace",
                                }}
                            />
                            <button
                                onClick={handleSend}
                                style={{
                                    marginLeft: 8,
                                    background: "var(--accent)",
                                    border: "none",
                                    color: "white",
                                    borderRadius: 6,
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    fontFamily: "'Fira Code', monospace",
                                    fontSize: 13,
                                    fontWeight: 600,
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Typing Animation */}
            <style>{`
                .dot {
                  animation: blink 1.4s infinite;
                }
                .dot:nth-child(2) {
                  animation-delay: 0.2s;
                }
                .dot:nth-child(3) {
                  animation-delay: 0.4s;
                }
                @keyframes blink {
                  0% { opacity: 0.2; }
                  20% { opacity: 1; }
                  100% { opacity: 0.2; }
                }
            `}</style>
        </>
    );
}
