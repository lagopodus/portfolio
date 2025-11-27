// RippleEffect.js
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./ripple.css";

export default function RippleEffect({ children }) {
    const [ripples, setRipples] = useState([]);
    const lastClickRef = useRef(0); // track last ripple time

    const handleClick = (e) => {
        const now = Date.now();

        // only allow every 3 seconds
        if (now - lastClickRef.current < 3000) return;
        lastClickRef.current = now;

        // ignore interactive elements
        if (
            e.target.closest("button") ||
            e.target.closest("a") ||
            e.target.closest(".no-ripple")
        ) {
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newRipple = { id: now, x, y };
        setRipples((prev) => [...prev, newRipple]);

        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 4000); // let ripples live longer
    };

    return (
        <div className="ripple-container" onClick={handleClick}>
            {children}

            <AnimatePresence>
                {ripples.map((r) => (
                    <>
                        <motion.div
                            key={r.id}
                            initial={{ scale: 0.1, opacity: 0.25 }}
                            animate={{ scale: 4, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2.5, ease: "easeOut" }}
                            className="ripple ripple-ring"
                            style={{ top: r.y - 50, left: r.x - 50 }}
                        />
                        <motion.div
                            key={r.id + "-2"}
                            initial={{ scale: 0.2, opacity: 0.2 }}
                            animate={{ scale: 5, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 3, ease: "easeOut", delay: 0.2 }}
                            className="ripple ripple-ring"
                            style={{ top: r.y - 60, left: r.x - 60 }}
                        />
                        <motion.div
                            key={r.id + "-3"}
                            initial={{ scale: 0.3, opacity: 0.15 }}
                            animate={{ scale: 6, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 3.5, ease: "easeOut", delay: 0.4 }}
                            className="ripple ripple-ring"
                            style={{ top: r.y - 70, left: r.x - 70 }}
                        />
                    </>
                ))}
            </AnimatePresence>
        </div>
    );
}
