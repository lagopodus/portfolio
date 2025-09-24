import React, { useEffect, useState } from "react";

export default function GlobalVisitsCounter() {
    const [count, setCount] = useState(null);
    const [display, setDisplay] = useState("00000");
    const [locked, setLocked] = useState([]); // track finalized digits

    useEffect(() => {
        async function fetchVisits() {
            try {
                const res = await fetch(
                    `https://api.counterapi.dev/v1/laopodus/visits-lagopodus/up?ts=${Date.now()}`
                );
                const data = await res.json();
                setCount(data.count);
            } catch (err) {
                console.error("CounterAPI error:", err);
            }
        }

        fetchVisits();
    }, []);

    // Sequential digit rolling
    useEffect(() => {
        if (count === null) return;

        const padded = String(count).padStart(5, "0").split("");
        let current = Array(5).fill("0");
        setLocked([]); // reset

        let i = 0;
        const animateDigit = () => {
            let ticks = 0;
            const interval = setInterval(() => {
                ticks++;
                current[i] = String(Math.floor(Math.random() * 10));
                setDisplay(current.join(""));

                if (ticks >= 10) {
                    clearInterval(interval);
                    current[i] = padded[i]; // lock
                    setDisplay(current.join(""));
                    setLocked((prev) => [...prev, i]);
                    i++;
                    if (i < padded.length) animateDigit();
                }
            }, 80);
        };

        animateDigit();
    }, [count]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                marginLeft: "auto",
            }}
        >
            {/* Counter box */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    background: "#111",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    boxShadow:
                        "0 0 20px rgba(168,85,247,0.3), inset 0 0 8px rgba(255,255,255,0.05)",
                }}
            >
                {display.split("").map((digit, i) => {
                    const isLocked = locked.includes(i);
                    const isLeadingZero =
                        digit === "0" && i < 5 - String(count ?? 0).length;

                    // ✅ keep rolling + unused digits the same dim grey
                    const color = isLocked
                        ? "#a855f7"
                        : "#222"; // darker grey like real StatTrak off segments

                    const glow = isLocked
                        ? "0 0 6px #a855f7, 0 0 12px #a855f7"
                        : "none";

                    return (
                        <span
                            key={i}
                            style={{
                                fontFamily: "'Digital-7 Mono', monospace",
                                fontSize: 36,
                                width: 28,
                                textAlign: "center",
                                color,
                                textShadow: glow,
                                opacity: isLeadingZero ? 0.15 : 1,
                                transition: "color 0.2s ease, text-shadow 0.2s ease",
                            }}
                        >
                            {digit}
                        </span>
                    );
                })}
            </div>

            {/* Label */}
            <span
                style={{
                    marginTop: 6,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#a855f7",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    textShadow: "0 0 4px rgba(168,85,247,0.6), 0 0 8px rgba(168,85,247,0.4)",
                    fontFamily: "'Orbitron', sans-serif", // digital sci-fi vibe
                }}
            >
    Total Visits
</span>

        </div>
    );
}
