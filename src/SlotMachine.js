import React, { useState, useEffect, useMemo, useCallback } from "react";

const SYMBOLS = [
    { id: "10", label: "10", color: "#fcd34d", payout: { 3: 1, 4: 4, 5: 8 } },
    { id: "J", label: "J", color: "#fb923c", payout: { 3: 2, 4: 6, 5: 10 } },
    { id: "Q", label: "Q", color: "#f472b6", payout: { 3: 3, 4: 8, 5: 15 } },
    { id: "K", label: "K", color: "#a855f7", payout: { 3: 5, 4: 12, 5: 25 } },
    { id: "A", label: "A", color: "#60a5fa", payout: { 3: 6, 4: 14, 5: 30 } },
    { id: "WILD", label: "Wild", color: "#facc15", payout: { 3: 10, 4: 25, 5: 60 }, isWild: true },
    { id: "BONUS", label: "Bonus", color: "#38bdf8", isBonus: true },
    { id: "SCARAB", label: "Relic", color: "#f97316", payout: { 3: 20, 4: 60, 5: 200 }, isSpecial: true },
];

const COLUMNS = 5;
const ROWS = 3;
const PAYLINES = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
];

const randomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

const createReels = () =>
    Array.from({ length: COLUMNS }, () =>
        Array.from({ length: ROWS }, () => randomSymbol())
    );

function SlotMachine() {
    const [reels, setReels] = useState(createReels);
    const [bet, setBet] = useState(5);
    const [balance, setBalance] = useState(500);
    const [spinning, setSpinning] = useState(false);
    const [message, setMessage] = useState("Spin the reels and seek the relic!");
    const [autoplay, setAutoplay] = useState(false);
    const [freeSpins, setFreeSpins] = useState(0);
    const [lastWin, setLastWin] = useState(0);
    const [winningCells, setWinningCells] = useState([]);

    const symbolMap = useMemo(() => {
        const map = new Map();
        SYMBOLS.forEach((symbol) => map.set(symbol.id, symbol));
        return map;
    }, []);

    const evaluateLine = (lineSymbols) => {
        const baseSymbol = lineSymbols.find((symbol) => symbol.id !== "WILD");
        const candidate = baseSymbol && !baseSymbol.isBonus ? baseSymbol : lineSymbols.every((s) => s.id === "WILD")
            ? symbolMap.get("WILD")
            : null;

        if (!candidate || candidate.isBonus) {
            return null;
        }

        const highlightedCells = [];
        let count = 0;
        for (let col = 0; col < lineSymbols.length; col += 1) {
            const symbol = lineSymbols[col];
            if (symbol.id === candidate.id || symbol.id === "WILD") {
                count += 1;
                highlightedCells.push(col);
            } else {
                break;
            }
        }

        if (count < 3) {
            return null;
        }

        const payoutTable = candidate.payout;
        if (!payoutTable || !payoutTable[count]) {
            return null;
        }

        return {
            symbol: candidate,
            count,
            payout: payoutTable[count],
            highlightedCells,
        };
    };

    const calculateWins = useCallback(
        (grid) => {
            let totalWin = 0;
            const highlights = [];
            const lines = [];
            const flatSymbols = grid.flat();
            const bonusCount = flatSymbols.filter((symbol) => symbol.id === "BONUS").length;

            PAYLINES.forEach((line, lineIndex) => {
                const lineSymbols = line.map((rowIndex, columnIndex) => grid[columnIndex][rowIndex]);
                const result = evaluateLine(lineSymbols);
                if (result) {
                    totalWin += result.payout * bet;
                    lines.push({
                        line: lineIndex + 1,
                        symbol: result.symbol.label,
                        count: result.count,
                        payout: result.payout * bet,
                    });
                    result.highlightedCells.forEach((column) => {
                        highlights.push({ column, row: line[column] });
                    });
                }
            });

            return { totalWin, highlights, lines, bonusCount };
        },
        [bet]
    );

    const spin = useCallback(() => {
        if (spinning) return;
        const cost = freeSpins > 0 ? 0 : bet;
        if (balance < cost) {
            setMessage("Not enough credits for that bet.");
            setAutoplay(false);
            return;
        }

        setSpinning(true);
        setWinningCells([]);
        if (cost > 0) {
            setBalance((prev) => prev - cost);
        }

        const newReels = createReels();
        setTimeout(() => {
            setReels(newReels);
            const { totalWin, highlights, lines, bonusCount } = calculateWins(newReels);
            setWinningCells(highlights);
            setLastWin(totalWin);
            setBalance((prev) => prev + totalWin);
            const messageParts = [];
            if (lines.length > 0) {
                messageParts.push(
                    lines
                        .map((line) => `Line ${line.line}: ${line.count} ${line.symbol}s = +${line.payout}`)
                        .join(" \u2022 ")
                );
            }
            if (bonusCount >= 3) {
                messageParts.push("The temple trembles... bonus triggered!");
            }
            setMessage(messageParts.length > 0 ? messageParts.join(" \u2022 ") : "Nothing this time.");

            setFreeSpins((prev) => {
                let updated = prev;
                if (prev > 0) {
                    updated -= 1;
                }
                if (bonusCount >= 3) {
                    updated += 10;
                }
                return updated;
            });

            setSpinning(false);
        }, 500);
    }, [balance, bet, calculateWins, freeSpins, spinning]);

    useEffect(() => {
        if (autoplay && !spinning) {
            const timer = setTimeout(() => {
                spin();
            }, 1200);
            return () => clearTimeout(timer);
        }
    }, [autoplay, spin, spinning]);

    const handleBetChange = (event) => {
        setBet(Number(event.target.value));
    };

    const toggleAutoplay = () => {
        setAutoplay((prev) => !prev);
    };

    const isWinningCell = (columnIndex, rowIndex) =>
        winningCells.some((cell) => cell.column === columnIndex && cell.row === rowIndex);

    return (
        <div className="slot-machine">
            <div className="slot-machine__header">
                <div>
                    <h2>Book of Josh</h2>
                    <p className="slot-machine__subtitle">Inspired by classic desert slots. Land three bonus books to earn 10 free spins.</p>
                </div>
                <div className="slot-machine__balances">
                    <div>Balance: <span>{balance}</span></div>
                    <div>Last win: <span>{lastWin}</span></div>
                    {freeSpins > 0 && (
                        <div className="slot-machine__freespins">Free spins left: {freeSpins}</div>
                    )}
                </div>
            </div>

            <div className="slot-grid">
                {reels.map((column, columnIndex) => (
                    <div key={`col-${columnIndex}`} className="slot-column">
                        {column.map((symbol, rowIndex) => (
                            <div
                                key={`cell-${columnIndex}-${rowIndex}`}
                                className={`slot-symbol ${symbol.id.toLowerCase()} ${isWinningCell(columnIndex, rowIndex) ? "slot-symbol--win" : ""}`}
                                style={{ borderColor: symbol.color }}
                            >
                                <span>{symbol.label}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="slot-machine__controls">
                <label className="slot-machine__bet">
                    Bet: <strong>{bet}</strong>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        step="1"
                        value={bet}
                        onChange={handleBetChange}
                    />
                </label>
                <button
                    className="spin-button"
                    onClick={spin}
                    disabled={spinning}
                >
                    {freeSpins > 0 ? "Play Free Spin" : spinning ? "Spinning..." : "Spin"}
                </button>
                <button
                    className={`autoplay-button ${autoplay ? "autoplay-button--active" : ""}`}
                    onClick={toggleAutoplay}
                >
                    {autoplay ? "Stop Autoplay" : "Autoplay"}
                </button>
            </div>

            <div className="slot-machine__message">{message}</div>
        </div>
    );
}

export default SlotMachine;
