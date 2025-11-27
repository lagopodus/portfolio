import React, { createContext, useContext, useState, useEffect } from "react";

const AchievementContext = createContext();

export function AchievementsProvider({ children, initialAchievements }) {
    const [achievements, setAchievements] = useState(() => {
        const stored = JSON.parse(localStorage.getItem("achievements"));
        if (!stored) return initialAchievements;

        const storedById = Object.fromEntries(stored.map((a) => [a.id, a]));
        return initialAchievements.map((ach) => storedById[ach.id] ? { ...ach, ...storedById[ach.id] } : ach);
    });
    const [lastUnlocked, setLastUnlocked] = useState(null);

    const unlock = (id) => {
        setAchievements((prev) => {
            const updated = prev.map((a) =>
                a.id === id && !a.unlocked ? { ...a, unlocked: true } : a
            );
            const justUnlocked = updated.find((a) => a.id === id && a.unlocked);
            const alreadyUnlocked = prev.find((a) => a.id === id && a.unlocked);

            if (justUnlocked && !alreadyUnlocked) {
                setLastUnlocked(justUnlocked);
            }
            return updated;
        });
    };


    useEffect(() => {
        localStorage.setItem("achievements", JSON.stringify(achievements));
    }, [achievements]);

    return (
        <AchievementContext.Provider value={{ achievements, unlock, lastUnlocked, setLastUnlocked }}>
            {children}
        </AchievementContext.Provider>
    );
}

export function useAchievements() {
    return useContext(AchievementContext);
}
