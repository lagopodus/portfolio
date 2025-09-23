// BurgerMenu.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";

export default function BurgerMenu({ toggleTheme, theme }) {
    const [open, setOpen] = useState(false);

    const sections = [
        { id: "about", label: "About" },
        { id: "music", label: "Music" },
        { id: "projects", label: "Projects" },
        { id: "stats", label: "Stats" },
        { id: "friends", label: "Friends" },
        { id: "setup", label: "Setup" },
        { id: "achievements", label: "Achievements" },
        { id: "games", label: "Favourite Games" },
    ];

    const handleScroll = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setOpen(false);
    };

    // animation variants
    const menuVariants = {
        hidden: { x: -260 },
        visible: {
            x: 0,
            transition: {
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.08, // delay between links
            },
        },
        exit: { x: -260, transition: { duration: 0.3 } },
    };

    const linkVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <>
            {/* Burger button (only when menu is closed) */}
            {!open && (
                <button
                    className="burger-btn"
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu size={28} />
                </button>
            )}

            {/* Slideout menu */}
            <AnimatePresence>
                {open && (
                    <motion.aside
                        className="burger-menu"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={menuVariants}
                    >
                        {/* Header with close button */}
                        <div className="menu-header">
                            <button
                                className="burger-btn close-btn"
                                onClick={() => setOpen(false)}
                                aria-label="Close menu"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Animated nav */}
                        <motion.nav className="menu-nav">
                            {sections.map((s) => (
                                <motion.button
                                    key={s.id}
                                    onClick={() => handleScroll(s.id)}
                                    className="menu-link"
                                    variants={linkVariants}
                                >
                                    {s.label}
                                </motion.button>
                            ))}
                        </motion.nav>

                        {/* Spacer pushes theme button down */}
                        <div className="menu-spacer" />

                        {/* Theme toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className="theme-btn"
                            variants={linkVariants}
                        >
                            {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
                        </motion.button>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
