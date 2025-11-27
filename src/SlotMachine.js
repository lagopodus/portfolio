import React, { useEffect, useRef, useState } from "react";
import {
    Gem,
    Star,
    Grape,
    Crown,
    Bell,
    Moon,
} from "lucide-react";
import { useAchievements } from "./AchievementContext";

const SYMBOLS = [
    { icon: Gem, label: "Gem" },
    { icon: Star, label: "Star" },
    { icon: Grape, label: "Grape" },
    { icon: Crown, label: "Crown" },   // or CircleNumber7 if you have it
    { icon: Bell, label: "Bell" },
    { icon: Moon, label: "Moon" },
];


const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

export default function SlotMachine() {
    const [reels, setReels] = useState(() => Array(3).fill(null).map(getRandomSymbol));
    const [spinning, setSpinning] = useState(false);
    const [message, setMessage] = useState("Tap spin to light up the reels");
    const [result, setResult] = useState(null);
    const { unlock } = useAchievements();
    const timersRef = useRef({ intervals: [], timeouts: [] });

    const clearTimers = () => {
        timersRef.current.intervals.forEach(clearInterval);
        timersRef.current.timeouts.forEach(clearTimeout);
        timersRef.current = { intervals: [], timeouts: [] };
    };

    useEffect(() => clearTimers, []);

    const spin = () => {
        if (spinning) return;

        clearTimers();
        setSpinning(true);
        setResult(null);
        setMessage("Cranking the lever...");

        const finalSymbols = Array(3).fill(null).map(getRandomSymbol);
        const stopDurations = [900, 1200, 1500];

        stopDurations.forEach((duration, index) => {
            const intervalId = setInterval(() => {
                setReels((prev) => {
                    const next = [...prev];
                    next[index] = getRandomSymbol();
                    return next;
                });
            }, 70 + index * 20);
            timersRef.current.intervals.push(intervalId);

            const timeoutId = setTimeout(() => {
                clearInterval(intervalId);
                setReels((prev) => {
                    const next = [...prev];
                    next[index] = finalSymbols[index];
                    return next;
                });

                if (index === stopDurations.length - 1) {
                    const allSame = finalSymbols.every((s) => s.icon === finalSymbols[0].icon);
                    const twoSame = new Set(finalSymbols.map((s) => s.icon)).size === 2;

                    if (allSame) {
                        setResult("win");
                        setMessage("JACKPOT! Triple glow-up ✨");
                        unlock("jackpot");
                    } else if (twoSame) {
                        setResult("near");
                        setMessage("Close! Two of a kind flickered on.");
                    } else {
                        setResult("loss");
                        setMessage("No match — but the LEDs looked cool, right?");
                    }

                    setSpinning(false);
                }
            }, duration);

            timersRef.current.timeouts.push(timeoutId);
        });
    };

    return (
        <div className="slot-machine">
            <div className="slot-header">
                <span className="slot-led">ARCADE MACHINE</span>
                <div className="slot-status">
                    <span className="slot-pip" data-active={spinning}></span>
                </div>
            </div>

            <div
                className={`slot-frame ${
                    result === "win"
                        ? "slot-frame--win"
                        : result === "near"
                            ? "slot-frame--near"
                            : ""
                }`}
            >
                <div className="slot-reels">
                    {reels.map((symbol, i) => (
                        <div
                            key={i}
                            className={`slot-reel ${spinning ? "slot-reel--spinning" : ""}`}
                        >
                            <div className="slot-cell">
                                <symbol.icon className="slot-icon"/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="slot-controls">
                <button className="slot-button" onClick={spin} disabled={spinning}>
                    {spinning ? "Rolling..." : "Spin"}
                </button>
                <div className="slot-message">{message}</div>
            </div>
        </div>
    );
}
