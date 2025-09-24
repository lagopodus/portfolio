// BurgerMenu.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    X,
    Sun,
    Moon,
    Trophy,
    User,
    Music,
    Folders,
    ChartLine,
    Users,
    Laptop,
    Gamepad2
} from "lucide-react";

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

    const ICONS = {
        about: <User size={20} />,   // GitHub purple
        music: <Music size={20} />,      // stays gold
        projects: <Folders size={20}  />, // keep red
        stats: <ChartLine size={20}  />, // light blue (accuracy vibe)
        friends: <Users size={20}  />,       // green (friendly)
        setup: <Laptop size={20} />, // violet/purple (taste/favorites)
        achievements: <Trophy size={20} />,        // locked = gray
        games: <Gamepad2 size={20}  />,   // yellow/golden star
    };

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
                                <X size={28}/>
                            </button>
                        </div>

                        {/* Animated nav */}
                        {/* Animated nav */}
                        <motion.nav className="menu-nav">
                            {/* Headline */}
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="menu-headline"
                            >
                                Navigator
                            </motion.div>

                            {sections.map((s, i) => (
                                <React.Fragment key={s.id}>
                                    <motion.button
                                        onClick={() => handleScroll(s.id)}
                                        className="menu-link"
                                        variants={linkVariants}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8, // 👈 space between icon & text
                                        }}
                                    >
        <span style={{ fontSize: 16, display: "flex", alignItems: "center" }}>
          {React.cloneElement(ICONS[s.id], { size: 16 })}
        </span>
                                        <span>{s.label}</span>
                                    </motion.button>

                                    {/* Premium separator */}
                                    {i < sections.length - 1 && (
                                        <motion.div
                                            className="menu-separator"
                                            initial={{ opacity: 0, scaleX: 0 }}
                                            animate={{ opacity: 1, scaleX: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        </motion.nav>



                        {/* Spacer pushes theme button down */}
                        <div className="menu-spacer"/>

                        {/* Theme toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className="theme-btn"
                            variants={linkVariants}
                        >
                            {theme === "dark" ? <Sun size={22}/> : <Moon size={22}/>}
                        </motion.button>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
