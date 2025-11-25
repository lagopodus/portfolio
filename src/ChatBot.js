import React, { useMemo, useState, useRef, useEffect } from "react";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatbotWidget({ responses, actions = {} }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi 👋 I’m your site assistant! Type 'help' to see what I can do." },
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const [toasts, setToasts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestion, setActiveSuggestion] = useState(0);

    const endRef = useRef(null);

    // Auto scroll to bottom when messages or typing changes
    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, typing]);

    const actionIntents = useMemo(() => ([
        {
            label: "toggle theme",
            keywords: ["theme", "dark", "light"],
            execute: actions.toggleTheme,
            response: "Swapped the theme for you.",
            toast: "Theme toggled",
        },
        {
            label: "jump to about",
            keywords: ["about", "profile", "bio"],
            execute: actions.scrollToAbout,
            response: "Heading to the About section.",
            toast: "Jumped to About",
        },
        {
            label: "open github",
            keywords: ["github", "repo", "code"],
            execute: actions.openGithub,
            response: "Opening GitHub in a new tab.",
            toast: "GitHub opened",
        },
        {
            label: "play/pause music",
            keywords: ["music", "play", "pause", "song"],
            execute: actions.toggleMusic,
            response: "Toggled the music vibe.",
            toast: "Music state changed",
        }
    ]), [actions]);

    const allCommands = useMemo(() => {
        const responseCommands = Object.keys(responses || {}).map((key) => ({
            label: key,
            type: "text",
        }));
        const actionCommands = actionIntents.map((intent) => ({
            label: intent.label,
            type: "action",
        }));
        return [...actionCommands, ...responseCommands];
    }, [actionIntents, responses]);

    useEffect(() => {
        const query = input.toLowerCase();
        if (!query) {
            setSuggestions(allCommands.slice(0, 5));
            setActiveSuggestion(0);
            return;
        }

        const filtered = allCommands
            .filter((cmd) => cmd.label.toLowerCase().includes(query))
            .slice(0, 5);
        setSuggestions(filtered);
        setActiveSuggestion(0);
    }, [input, allCommands]);

    const addToast = (message) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        const normalized = input.toLowerCase();
        const matchedAction = actionIntents.find((intent) =>
            intent.keywords.some((kw) => normalized.includes(kw)) && typeof intent.execute === "function"
        );

        const key = Object.keys(responses).find((k) =>
            normalized.includes(k)
        );

        let reply = key ? responses[key] : "🤔 I don’t know that one. Try 'help'.";

        const finalizeReply = (message, type = "text") => {
            setTyping(false);
            setMessages((prev) => [...prev, { sender: "bot", text: message, type }]);
        };

        setTyping(true); // show typing
        setInput("");

        if (matchedAction) {
            matchedAction.execute();
            addToast(matchedAction.toast || matchedAction.response);
            setTimeout(() => finalizeReply(matchedAction.response, "action"), 800);
            return;
        }

        if (Array.isArray(reply)) {
            reply = reply[Math.floor(Math.random() * reply.length)];
        }

        setTimeout(() => finalizeReply(reply), 1500);
    };

    const handleSuggestionSelect = (value) => {
        setInput(value);
        setSuggestions([]);
    };

    const renderBubbleStyle = (msg) => {
        if (msg.sender === "user") {
            return {
                background: "var(--accent)",
                color: "white",
            };
        }

        if (msg.type === "action") {
            return {
                background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.4)",
                color: "var(--text)",
            };
        }

        return {
            background: "rgba(255,255,255,0.08)",
            color: "var(--text)",
        };
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSend();
            return;
        }

        if (suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveSuggestion((prev) => Math.min(prev + 1, suggestions.length - 1));
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveSuggestion((prev) => Math.max(prev - 1, 0));
        }

        if (e.key === "Tab") {
            e.preventDefault();
            const choice = suggestions[activeSuggestion] || suggestions[0];
            if (choice) {
                setInput(choice.label);
                setSuggestions([]);
            }
        }
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
                            height: 430,
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
                                aria-label="Chatbot"
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
                            {messages.map((msg, i) => {
                                const bubbleStyle = renderBubbleStyle(msg);
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                            ...bubbleStyle,
                                            padding: "6px 10px",
                                            borderRadius: 8,
                                            maxWidth: "80%",
                                            fontSize: 13,
                                            whiteSpace: "pre-wrap",
                                            border: msg.sender === "user" ? "none" : bubbleStyle.border,
                                        }}
                                    >
                                        {msg.type === "action" && (
                                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, color: "var(--accent)", fontWeight: 700 }}>
                                                <Sparkles size={14} /> Action executed
                                            </div>
                                        )}
                                        {msg.text}
                                    </div>
                                );
                            })}

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
                                flexDirection: "column",
                                padding: 8,
                                borderTop: "1px solid rgba(255,255,255,0.08)",
                                gap: 6,
                            }}
                        >
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
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
                                        background: "var(--accent)",
                                        border: "none",
                                        color: "white",
                                        borderRadius: 6,
                                        padding: "8px 12px",
                                        cursor: "pointer",
                                        fontFamily: "'Fira Code', monospace",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        minWidth: 70,
                                    }}
                                >
                                    Send
                                </button>
                            </div>

                            {suggestions.length > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 6,
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                        color: "var(--muted)",
                                        fontSize: 12,
                                    }}
                                >
                                    {suggestions.map((s, idx) => (
                                        <button
                                            key={s.label}
                                            onClick={() => handleSuggestionSelect(s.label)}
                                            style={{
                                                background: idx === activeSuggestion ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.04)",
                                                color: "var(--text)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                borderRadius: 14,
                                                padding: "6px 10px",
                                                cursor: "pointer",
                                                fontFamily: "'Fira Code', monospace",
                                                fontSize: 12,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 6,
                                            }}
                                        >
                                            <span>{s.label}</span>
                                            <span style={{
                                                fontSize: 10,
                                                color: "var(--muted)",
                                                background: "rgba(255,255,255,0.05)",
                                                padding: "2px 6px",
                                                borderRadius: 10,
                                            }}>
                                                {s.type}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toasts */}
            <div
                style={{
                    position: "fixed",
                    bottom: open ? 520 : 140,
                    right: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    zIndex: 1001,
                }}
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        style={{
                            background: "rgba(139,92,246,0.95)",
                            color: "white",
                            padding: "10px 12px",
                            borderRadius: 10,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                            fontSize: 13,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <Sparkles size={16} /> {toast.message}
                    </div>
                ))}
            </div>

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
