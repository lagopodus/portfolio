import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";

const SYMBOLS = [
    {
        id: "10",
        label: "10",
        rune: "✦",
        primary: "#f9e8ff",
        secondary: "#c084fc",
        accent: "#fff7ff",
        payout: { 3: 1, 4: 4, 5: 8 },
    },
    {
        id: "J",
        label: "J",
        rune: "𓂀",
        primary: "#f5d0fe",
        secondary: "#a855f7",
        accent: "#fff0ff",
        payout: { 3: 2, 4: 6, 5: 10 },
    },
    {
        id: "Q",
        label: "Q",
        rune: "☽",
        primary: "#ffe4f4",
        secondary: "#ec4899",
        accent: "#fff0f7",
        payout: { 3: 3, 4: 8, 5: 15 },
    },
    {
        id: "K",
        label: "K",
        rune: "☥",
        primary: "#ede9fe",
        secondary: "#7c3aed",
        accent: "#f5f3ff",
        payout: { 3: 5, 4: 12, 5: 25 },
    },
    {
        id: "A",
        label: "A",
        rune: "⚜",
        primary: "#e0e7ff",
        secondary: "#6366f1",
        accent: "#eef2ff",
        payout: { 3: 6, 4: 14, 5: 30 },
    },
    {
        id: "WILD",
        label: "Wild",
        rune: "★",
        primary: "#fdf2f8",
        secondary: "#fb7185",
        accent: "#ffe4e6",
        payout: { 3: 10, 4: 25, 5: 60 },
        isWild: true,
    },
    {
        id: "BONUS",
        label: "Book",
        rune: "📖",
        primary: "#f5f3ff",
        secondary: "#a855f7",
        accent: "#ede9fe",
        isBonus: true,
    },
    {
        id: "SCARAB",
        label: "Relic",
        rune: "🪲",
        primary: "#fef3c7",
        secondary: "#f472b6",
        accent: "#fff7ed",
        payout: { 3: 20, 4: 60, 5: 200 },
        isSpecial: true,
    },
];

const COLUMNS = 5;
const ROWS = 3;
const PAYLINES = [
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2],
];

const TOPPER_LIGHTS = Array.from({ length: 7 });

const randomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

const COLUMN_STOP_DELAY = 240;
const SPIN_INTRO_DELAY = 450;
const RESULT_BUFFER = 420;

const createReels = () =>
    Array.from({ length: COLUMNS }, () =>
        Array.from({ length: ROWS }, () => randomSymbol())
    );

const SPIN_TRACK_LENGTH = ROWS * 4;

const generateSpinTrack = () => {
    const base = Array.from({ length: SPIN_TRACK_LENGTH }, () => randomSymbol());
    return [...base, ...base.slice(0, ROWS)];
};

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
    const [showWinBanner, setShowWinBanner] = useState(false);
    const [spinningColumns, setSpinningColumns] = useState(() => Array(COLUMNS).fill(false));
    const [celebration, setCelebration] = useState(null);
    const [spinTracks, setSpinTracks] = useState(() =>
        Array.from({ length: COLUMNS }, () => generateSpinTrack())
    );

    const timeoutRef = useRef([]);

    const clearPendingTimeouts = useCallback(() => {
        timeoutRef.current.forEach(clearTimeout);
        timeoutRef.current = [];
    }, []);

    useEffect(() => () => clearPendingTimeouts(), [clearPendingTimeouts]);

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

        clearPendingTimeouts();
        setSpinning(true);
        setCelebration(null);
        setWinningCells([]);
        if (cost > 0) {
            setBalance((prev) => prev - cost);
        }

        setSpinningColumns(Array(COLUMNS).fill(true));
        setSpinTracks(Array.from({ length: COLUMNS }, () => generateSpinTrack()));

        const newReels = createReels();

        const scheduleTimeout = (callback, delay) => {
            const id = setTimeout(callback, delay);
            timeoutRef.current.push(id);
        };

        scheduleTimeout(() => {
            setReels(newReels);
        }, SPIN_INTRO_DELAY);

        for (let columnIndex = 0; columnIndex < COLUMNS; columnIndex += 1) {
            scheduleTimeout(() => {
                setSpinningColumns((prev) => {
                    const next = [...prev];
                    next[columnIndex] = false;
                    return next;
                });
            }, SPIN_INTRO_DELAY + columnIndex * COLUMN_STOP_DELAY);
        }

        const resolutionDelay = SPIN_INTRO_DELAY + COLUMNS * COLUMN_STOP_DELAY + RESULT_BUFFER;

        scheduleTimeout(() => {
            const { totalWin, highlights, lines, bonusCount } = calculateWins(newReels);
            setWinningCells(highlights);
            setLastWin(totalWin);
            setBalance((prev) => prev + totalWin);
            setSpinningColumns(Array(COLUMNS).fill(false));

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

            setCelebration(() => {
                if (bonusCount >= 3) {
                    return { type: "bonus", freeSpins: 10 };
                }
                if (totalWin >= bet * 30) {
                    return { type: "epic", amount: totalWin };
                }
                if (totalWin >= bet * 12) {
                    return { type: "big", amount: totalWin };
                }
                return null;
            });

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
        }, resolutionDelay);
    }, [balance, bet, calculateWins, clearPendingTimeouts, freeSpins, spinning]);

    useEffect(() => {
        if (lastWin > 0) {
            setShowWinBanner(true);
            const timeout = setTimeout(() => setShowWinBanner(false), 2000);
            return () => clearTimeout(timeout);
        }
        setShowWinBanner(false);
        return undefined;
    }, [lastWin]);

    useEffect(() => {
        if (celebration) {
            const timeout = setTimeout(() => setCelebration(null), 4500);
            return () => clearTimeout(timeout);
        }
        return undefined;
    }, [celebration]);

    useEffect(() => {
        if (!spinningColumns.some(Boolean)) {
            return undefined;
        }
        const interval = setInterval(() => {
            setSpinTracks((prev) =>
                prev.map((track, columnIndex) =>
                    spinningColumns[columnIndex] ? generateSpinTrack() : track
                )
            );
        }, 220);
        return () => clearInterval(interval);
    }, [spinningColumns]);

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

    const getSymbolStyle = (symbol) => ({
        "--symbol-primary": symbol.primary,
        "--symbol-secondary": symbol.secondary,
        "--symbol-accent": symbol.accent || symbol.primary,
    });

    return (
        <div className={`slot-machine ${spinning ? "slot-machine--active" : ""}`}>
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

            <div className="slot-machine__cabinet">
                <div className="slot-machine__handle" aria-hidden="true">
                    <span className="slot-machine__handle-bar" />
                    <span className="slot-machine__handle-knob" />
                </div>
                <div className="slot-machine__topper">
                    <div className="slot-machine__logo">Book of Josh</div>
                    <div className="slot-machine__lights">
                        {TOPPER_LIGHTS.map((_, index) => (
                            <span key={`light-${index}`} className="slot-machine__light" />
                        ))}
                    </div>
                </div>

                <div className="slot-machine__screen">
                    <div className="slot-machine__reel-window">
                        {celebration && (
                            <div className={`slot-machine__mega-banner slot-machine__mega-banner--${celebration.type}`}>
                                <span>
                                    {celebration.type === "bonus"
                                        ? "FREE SPINS UNLOCKED"
                                        : celebration.type === "epic"
                                            ? "EPIC WIN"
                                            : "BIG WIN"}
                                </span>
                                <strong>
                                    {celebration.type === "bonus"
                                        ? `+${celebration.freeSpins} Spins`
                                        : `+${celebration.amount}`}
                                </strong>
                            </div>
                        )}
                        {showWinBanner && (
                            <div className="slot-machine__win-banner">
                                <span>WIN</span>
                                <strong>+{lastWin}</strong>
                            </div>
                        )}
                        <div className={`slot-grid ${spinning ? "slot-grid--spinning" : ""}`}>
                            {reels.map((column, columnIndex) => {
                                const columnSpinning = spinningColumns[columnIndex];
                                const symbolsToRender = columnSpinning
                                    ? spinTracks[columnIndex] || []
                                    : column;
                                return (
                                    <div
                                        key={`col-${columnIndex}`}
                                        className={`slot-column ${columnSpinning ? "slot-column--spinning" : ""}`}
                                    >
                                        <div className="slot-column__mask">
                                            <div
                                                className={`slot-column__track ${columnSpinning ? "slot-column__track--spinning" : ""}`}
                                                style={{
                                                    "--spin-speed": columnSpinning
                                                        ? `${0.6 + columnIndex * 0.05}s`
                                                        : undefined,
                                                    animationDelay: columnSpinning
                                                        ? `${columnIndex * 0.08}s`
                                                        : undefined,
                                                }}
                                            >
                                                {symbolsToRender.map((symbol, rowIndex) => {
                                                    const showWin = !spinning && isWinningCell(columnIndex, rowIndex);
                                                    const cellKey = columnSpinning
                                                        ? `spin-${columnIndex}-${rowIndex}`
                                                        : `cell-${columnIndex}-${rowIndex}`;
                                                    return (
                                                        <div
                                                            key={cellKey}
                                                            className={`slot-symbol slot-symbol--${symbol.id.toLowerCase()} ${showWin ? "slot-symbol--win" : ""} ${columnSpinning ? "slot-symbol--ghost" : ""}`}
                                                            style={getSymbolStyle(symbol)}
                                                        >
                                                            <div className="slot-symbol__halo" aria-hidden="true" />
                                                            <div className="slot-symbol__inner">
                                                                <span className="slot-symbol__rune">{symbol.rune}</span>
                                                                <span className="slot-symbol__label">{symbol.label}</span>
                                                                {(symbol.isBonus || symbol.isWild || symbol.isSpecial) && (
                                                                    <span
                                                                        className={`slot-symbol__tag ${
                                                                            symbol.isBonus
                                                                                ? "slot-symbol__tag--bonus"
                                                                                : symbol.isWild
                                                                                    ? "slot-symbol__tag--wild"
                                                                                    : "slot-symbol__tag--relic"
                                                                        }`}
                                                                    >
                                                                        {symbol.isBonus
                                                                            ? "Bonus"
                                                                            : symbol.isWild
                                                                                ? "Wild"
                                                                                : "Relic"}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="slot-machine__status">
                        <span className="slot-machine__status-label">Temple Log</span>
                        <p>{message}</p>
                    </div>
                </div>

                <div className="slot-machine__panel">
                    <div className="slot-machine__meters">
                        <div className="slot-machine__meter">
                            <span>Balance</span>
                            <strong>{balance}</strong>
                        </div>
                        <div className="slot-machine__meter">
                            <span>Last Win</span>
                            <strong>{lastWin}</strong>
                        </div>
                        <div className={`slot-machine__meter ${freeSpins > 0 ? "slot-machine__meter--active" : ""}`}>
                            <span>Free Spins</span>
                            <strong>{freeSpins}</strong>
                        </div>
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
                </div>
                <div className="slot-machine__base" aria-hidden="true" />
            </div>
        </div>
    );
}

export default SlotMachine;
