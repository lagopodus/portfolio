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
    Gamepad2,
    Flame,
    Joystick,
    Youtube
} from "lucide-react";

export default function BurgerMenu({ toggleTheme, theme }) {
    const [open, setOpen] = useState(false);

    const sections = [
        { id: "about", label: "About" },
        { id: "music", label: "Music" },
        { id: "projects", label: "Projects" },
        { id: "stats", label: "Stats" },
        { id: "warmup", label: "Warmup Routine" },
        { id: "arcade", label: "Arcade" },
        { id: "friends", label: "Friends" },
        { id: "youtube", label: "Latest YouTube videos" },
        { id: "setup", label: "Setup" },
        { id: "achievements", label: "Achievements" },
        { id: "games", label: "Favourite Games" },
    ];

    const ICONS = {
        about: <User size={16} />,   // GitHub purple
        music: <Music size={16} />,      // stays gold
        projects: <Folders size={16}  />, // keep red
        stats: <ChartLine size={16}  />, // light blue (accuracy vibe)
        warmup: <Flame size={16} />, // warmup heat
        arcade: <Joystick size={16}  />, // arcade vibes
        friends: <Users size={16}  />,       // green (friendly)
        youtube: <Youtube size={16} />, // video feed
        setup: <Laptop size={16} />, // violet/purple (taste/favorites)
        achievements: <Trophy size={16} />,        // locked = gray
        games: <Gamepad2 size={16}  />,   // yellow/golden star
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
                                    >
                                        <span className="menu-icon">
                                            {ICONS[s.id]}
                                        </span>
                                        <span className="menu-text">{s.label}</span>
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
                        <div className="theme-section">
                            <div className="theme-copy">
                                <span className="theme-label">Theme</span>
                                <span className="theme-helper">Switch between vibes</span>
                            </div>
                            <motion.button
                                onClick={toggleTheme}
                                className="theme-btn"
                                variants={linkVariants}
                            >
                                <span className="theme-icon">
                                    {theme === "dark" ? <Sun size={22}/> : <Moon size={22}/>}
                                </span>
                                <span className="theme-text">{theme === "dark" ? "Light" : "Dark"}</span>
                            </motion.button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
