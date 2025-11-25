import React, { useState, useEffect, useRef } from "react";
import { useAchievements } from "./AchievementContext";
import NowPlaying from "./NowPlaying";
import ChatBot from "./ChatBot";
import responses from "./stuff/botResponses"
import aboutTexts  from "./stuff/quotes"
import GlobalVisitsCounter from "./GlobalVisitsCounter";
import {
    Github,
    User,
    Code,
    ExternalLink,
    Linkedin,
    Youtube,
    Twitch,
    Instagram,
    MapPin,
    Star,
    Trophy,
    Zap,
    Crosshair,
    CircleUserRound,
    Clock,
    CircleDollarSign,
    Monitor,
    Cpu,
    Gpu,
    Keyboard,
    Mouse,
    Headphones,
    Lock,
    BookHeart,
    BadgeQuestionMark,
    MapPinned
} from "lucide-react";
import "./App.css";
import BurgerMenu from "./BurgerMenu";
import { motion, useMotionValue, useTransform, animate  } from "framer-motion";
const getPremierColor = (rank) => {
    if (rank < 5000) return "grey";
    if (rank < 10000) return "lightblue";
    if (rank < 15000) return "darkblue";
    if (rank < 20000) return "purple";
    if (rank < 25000) return "pink";
    if (rank < 30000) return "red";
    return "gold";
};

const projects = [
    {
        title: "Grow Green",
        desc: "GrowGreen is a 2D gardening game made with Godot, featuring virtual plant care and fun mini-games.",
        link: "https://github.com/AlexInABox/grow-green",
        progress: 100,
    },
    {
        title: "Portfolio",
        desc: "The page you are viewing right now.",
        link: "https://github.com/lagopodus/portfolio",
        progress: 90,
    },
    {
        title: "Unreal Engine FPS Game",
        desc: "Secret!!!!",
        link: "https://github.com/lagopodus/ue5-fps-shooter",
        progress: 33,
    },
];

const RENOWN_RANKS = [
    { name: "Bronze", min: 3000, max: 6999, color: "#a16207" },
    { name: "Silver", min: 7000, max: 10999, color: "#94a3b8" },
    { name: "Gold", min: 11000, max: 14999, color: "#f59e0b" },
    { name: "Platinum", min: 15000, max: 18999, color: "#06b6d4" },
    { name: "Diamond", min: 19000, max: 21999, color: "#3b82f6" },
    { name: "Master", min: 22000, max: 24999, color: "#a855f7" },
    { name: "Renowned", min: 25000, max: Infinity, color: "#16a34a" },
];

const MotionCard = ({ children, className = "", ...props }) => (
    <motion.section
        className={className}   // 🔥 no default "card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{
            scale: 1.03,
            transition: { duration: 0.1, ease: "easeOut" }
        }}
        {...props}
    >
        <motion.div
        >
            {children}
        </motion.div>
    </motion.section>
);

const videos = [
    {title: "alexinabox", link: "https://alexinabox.de/"},
    {title: "Theo", link: "https://theocloud.dev/"},
    {title: "Domi", link: "https://github.com/AuriomTex"},
];

const warmupRoutine = [
    {
        name: "AIMBOTZ — baseline clears",
        focus: "Snappy taps + counter-strafes at multiple ranges",
        minutes: 10,
        tip: "Run 180/360 sweeps and burst-fire for head level discipline.",
        icon: "crosshair",
        workshopLink: "https://steamcommunity.com/sharedfiles/filedetails/?id=3070758981",
        workshopLabel: "AIMBOTZ - Training"
    },
    {
        name: "Dust 2 utility reps",
        focus: "Lineup muscle memory + fast exec pacing",
        minutes: 8,
        tip: "Cycle long/short smokes, flashes, and one-ways until they're automatic.",
        icon: "map",
        workshopLink: "https://steamcommunity.com/sharedfiles/filedetails/?id=3360435602",
        workshopLabel: "Dust2 Utility Practice"
    },
    {
        name: "Reflex Trainer — flicks",
        focus: "Fast target acquisition + micro-adjust recovery",
        minutes: 7,
        tip: "Treat it like intervals: burst of speed, then reset stance and breathing.",
        icon: "zap",
        workshopLink: "https://steamcommunity.com/sharedfiles/filedetails/?id=3070244462",
        workshopLabel: "CS2 Reflex Flick Trainer"
    }
];

const favouriteGames = [
    {
        id: "counter-strike-2",
        name: "Counter Strike 2",
        tagline: "Tactical FPS comfort pick",
        review: "Live servers are the best and worst classroom — every round is a case study in spacing, utility and tempo. CS2 keeps the discipline sharp.",
        loadout: "AK-47 / HE + flash for instant retakes",
        tip: "Play for early space with a late lurk; the round flips when you break the defender crossfire.",
        url: "https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/"
    },
    {
        id: "elden-ring",
        name: "Elden Ring",
        tagline: "Open-world boss routing",
        review: "FromSoftware finally let me get lost. I love sprinting past a dragon at level 10, then returning much later with a polished build and a grudge.",
        loadout: "Double Katana",
        tip: "Stack stance breaks with jump-heavy attacks, then punish with a charged R2.",
        url: "https://store.steampowered.com/app/1245620/ELDEN_RING/"
    },
    {
        id: "dark-souls",
        name: "Dark Souls",
        tagline: "Where patience became muscle memory",
        review: "Bonfire to boss is a meditative loop. No fast travel in the early game makes every shortcut you unlock feel like mastery.",
        loadout: "Claymore + Grass Crest Shield",
        tip: "Shield for parry, then swap to Two-Hand for crit.",
        url: "https://store.steampowered.com/app/570940/DARK_SOULS_REMASTERED/"
    },
    {
        id: "hollow-knight",
        name: "Hollow Knight",
        tagline: "Metroidvania precision",
        review: "Hallownest rewards curiosity. Movement upgrades stack into this elegant dance — wall jumps, dash cancels and nail arts feel buttery smooth.",
        loadout: "Nailmaster’s Glory + Mark of Pride",
        tip: "Pre-charge Great Slash before re-engaging; it wins trades without costing extra soul.",
        url: "https://store.steampowered.com/app/367520/Hollow_Knight/"
    },
    {
        id: "hearthstone",
        name: "Hearthstone",
        tagline: "Card gaming between queues",
        review: "A perfect palette cleanser. I theorycraft during CS2 queues, then stress-test lists on ladder — discovering greedy lines is the fun part.",
        loadout: "Highlander Mage / Hyper Aggro Shadow Priest",
        tip: "Bank cheap discovers for swing turns; holding one mana spell generators keeps secrets and combos flexible.",
        url: "https://hearthstone.blizzard.com/"
    },
    {
        id: "witcher-3",
        name: "The Witcher III",
        tagline: "Story pacing masterclass",
        review: "Side quests feel like novellas. I replay to chase the quiet character beats — contracts, taverns, Gwent in the rain.",
        loadout: "Ursine gear + Igni / Quen focus",
        tip: "Prep oils and decoctions before every contract; igni melt plus heavy armor = comfy boss deletes.",
        url: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/"
    },
    {
        id: "remnant",
        name: "Remnant: From the Ashes",
        tagline: "Co-op rolls and roguelite spice",
        review: "Procedural worlds keep co-op fresh. It’s the perfect middle ground between Souls combat and looter excitement.",
        loadout: "Hunting Pistol + Devastator + Void armor",
        tip: "Dodge diagonally through boss swipes; stagger windows open up when you mix mod power with weak-spot discipline.",
        url: "https://store.steampowered.com/app/617290/Remnant_From_the_Ashes/"
    }
];

export const ACHIEVEMENTS = [
    {
        id: "visit-github",
        title: "GitHub Explorer",
        desc: "Visited my GitHub profile",
        icon: "github",
        unlocked: false
    },
    {
        id: "scroll-bottom",
        title: "Deep Diver",
        desc: "Scrolled to the bottom of the page",
        icon: "trophy",
        unlocked: false
    },
    {
        id: "watched-youtube",
        title: "Video Enjoyer",
        desc: "Clicked on one of my YouTube videos",
        icon: "youtube",
        unlocked: false
    },
    {
        id: "visit-leetify",
        title: "Stats Enjoyer",
        desc: "Visited my Leetify profile",
        icon: "crosshair",
        unlocked: false
    },
    {
        id: "visit-friend",
        title: "Friendly",
        desc: "Opened one of my friends pages",
        icon: "user",
        unlocked: false
    },
    {
        id: "visit-steam",
        title: "Good Taste",
        desc: "Checked out one of my favourite games",
        icon: "bookheart",
        unlocked: false
    },
    {
        id: "lore-hunter",
        title: "Lore Hunter",
        desc: "Opened multiple favourite game breakdowns",
        icon: "map",
        unlocked: false
    },
    {
        id: "ten-visits",
        title: "Regular Visitor",
        desc: "Visited the site 10 times",
        icon: "star",
        unlocked: false
    },
    {
        id: "afk",
        title: "AFK",
        desc: "Stayed idle on the site for 2+ minutes",
        icon: "clock",
        unlocked: false
    },
    {
        id: "secret",
        title: "Secret",
        desc: "???",
        icon: "question",
        unlocked: false
    }
];

const ICONS = {
    github: <Github size={20} style={{ color: "#6e5494" }} />,   // GitHub purple
    trophy: <Trophy size={20} style={{ color: "gold" }} />,      // stays gold
    youtube: <Youtube size={20} style={{ color: "#f87171" }} />, // keep red
    crosshair: <Crosshair size={20} style={{ color: "#60a5fa" }} />, // light blue (accuracy vibe)
    user: <User size={20} style={{ color: "#22c55e" }} />,       // green (friendly)
    bookheart: <BookHeart size={20} style={{ color: "#a855f7" }} />, // violet/purple (taste/favorites)
    map: <MapPinned size={20} style={{ color: "#22d3ee" }} />,
    locked: <Lock size={20} style={{ color: "gray" }} />,        // locked = gray
    star: <Star size={20} style={{ color: "#facc15" }} />,   // yellow/golden star
    clock: <Clock size={20} style={{ color: "#60a5fa" }} />, // blue clock
    question: <BadgeQuestionMark size={20} style={{ color: "#fff" }} />, // blue clock

};

const routineIcons = {
    crosshair: <Crosshair size={18} style={{ color: "var(--accent)" }} />,
    zap: <Zap size={18} style={{ color: "var(--accent)" }} />,
    clock: <Clock size={18} style={{ color: "var(--accent)" }} />,
    map: <MapPinned size={18} style={{ color: "var(--accent)" }} />
};

function MainApp() {
    const [aboutText, setAboutText] = useState(null);
    const { achievements, unlock, lastUnlocked, setLastUnlocked } = useAchievements();
    const allUnlocked = achievements.every((a) => a.unlocked);
    const [theme, setTheme] = useState("dark");
    const [openedGames, setOpenedGames] = useState([]);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((t) => (t === "dark" ? "light" : "dark"));
    };

    const handleGameOpen = (id) => {
        setOpenedGames((prev) => {
            if (prev.includes(id)) return prev;

            const next = [...prev, id];
            if (next.length >= 3) {
                unlock("lore-hunter");
            }

            return next;
        });
    };


    const unlockRef = useRef(unlock);
    useEffect(() => { unlockRef.current = unlock; }, [unlock]);

    useEffect(() => {
        const seq = [
            "ArrowUp", "ArrowUp",
            "ArrowDown", "ArrowDown",
            "ArrowLeft", "ArrowRight",
            "ArrowLeft", "ArrowRight",
            "b", "a"
        ];
        let index = 0;

        const onKeyDown = (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key; // normalize
            if (key === seq[index]) {
                index += 1;
                if (index === seq.length) {
                    // unlock once
                    unlockRef.current("secret");
                    index = 0;
                }
            } else {
                // smart reset: if current key equals first key, start from 1, else 0
                index = key === seq[0] ? 1 : 0;
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []); // runs once

    useEffect(() => {
        let timer;

        const triggerIdle = () => {
            unlock("afk");
        };

        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(triggerIdle, 120000);
        };

        const events = ["mousemove", "keydown", "click", "scroll"];
        events.forEach((ev) => window.addEventListener(ev, resetTimer));

        resetTimer();

        return () => {
            clearTimeout(timer);
            events.forEach((ev) => window.removeEventListener(ev, resetTimer));
        };
        // ✅ don’t include unlock in deps
    }, []);
    useEffect(() => {
        const visits = parseInt(localStorage.getItem("visits") || "0", 10) + 1;
        localStorage.setItem("visits", visits);

        if (visits >= 10) {
            unlock("ten-visits");
        }
    }, []);
    useEffect(() => {
        const random = aboutTexts[Math.floor(Math.random() * aboutTexts.length)];
        setAboutText(random);
    }, []);
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                unlock("scroll-bottom");
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    useEffect(() => {
        if (lastUnlocked) {
            const timer = setTimeout(() => setLastUnlocked(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [lastUnlocked, setLastUnlocked]);
    useEffect(() => {
        const handleMouseMove = (e) => {
            document.documentElement.style.setProperty("--x", `${e.clientX}px`);
            document.documentElement.style.setProperty("--y", `${e.clientY}px`);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);


    return (
        <div className="page">
            <div className="particles"></div>
            <div className="spotlight"></div>
            <ChatBot responses={responses} />
            <BurgerMenu toggleTheme={toggleTheme} theme={theme} />


            <main className="container">
                <section className="hero"
                         style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                    <div className="hero-left">
                        <User
                            size={56}
                            style={{
                                color: "var(--accent)",
                                background: "rgba(139,92,246,0.08)",
                                borderRadius: 10,
                                padding: 8,
                            }}
                        />
                        <div style={{marginLeft: 14}}>
                            <h1 className="name">
                                Josh <span style={{color: "var(--accent)"}}>lagopodus</span>
                            </h1>
                            <p className="tagline">Counter Strike • Computer Science • Car Stuff</p>
                            <p className="location">
                                <MapPin size={14} style={{marginRight: 8}}/> Berlin
                            </p>
                        </div>
                    </div>


                    <GlobalVisitsCounter/>


                    <div className="contacts-top">
                        <a className="contact-btn" href="https://github.com/lagopodus" target="_blank"
                           rel="noopener noreferrer"
                           onClick={() => unlock("visit-github")}>
                            <Github size={16}/> <span style={{marginLeft: 8}}>GitHub</span>
                        </a>
                        <a className="contact-btn" href="https://www.linkedin.com/in/josh-tischer-80b891349/"
                           target="_blank" rel="noopener noreferrer">
                            <Linkedin size={16}/> <span style={{marginLeft: 8}}>LinkedIn</span>
                        </a>
                        <a className="contact-btn" href="https://www.youtube.com/@lagopodus_" target="_blank"
                           rel="noopener noreferrer">
                            <Youtube size={16}/> <span style={{marginLeft: 8}}>YouTube</span>
                        </a>
                        <a className="contact-btn" href="https://www.twitch.tv/lagopodus" target="_blank"
                           rel="noopener noreferrer">
                            <Twitch size={16}/> <span style={{marginLeft: 8}}>Twitch</span>
                        </a>
                        <a className="contact-btn" href="https://instagram.com/yoschi.bln" target="_blank"
                           rel="noopener noreferrer">
                            <Instagram size={16}/> <span style={{marginLeft: 8}}>Instagram</span>
                        </a>
                    </div>
                </section>
                <AchievementPopup
                    achievement={lastUnlocked}
                    onClose={() => setLastUnlocked(null)}
                />

                {/* About */}
                <MotionCard id="about" className="card">
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 20,
                        alignItems: "flex-start",
                        flexWrap: "wrap"
                    }}>
                        <div style={{flex: 1, minWidth: 280}}>
                            <h3 className="section-title gradient-text">About</h3>
                            {aboutText && (
                                <p className="text">
                                    <i>{aboutText.quote}<br/></i>
                                    <b>- {aboutText.author}</b>
                                </p>
                            )}
                        </div>
                        <div style={{width: 320, minWidth: 260}}>
                            <h3 className="section-title" style={{marginBottom: 10}}>Quick stats</h3>
                            <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                                <Stat title="Hours played" value="2000+" icon={<Clock size={16}/>}/>
                                <Stat title="Inventory worth" value="~3000$" icon={<CircleDollarSign size={16}/>}/>
                            </div>
                        </div>
                    </div>
                </MotionCard>

                <MotionCard id="music" className="card">
                    <h2 className="section-title gradient-text">Music</h2>

                    <NowPlaying
                        username="lagopodus"
                        apiKey="64c8ea82a1994cddc375f2f7550e31c8"
                    />

                </MotionCard>

                {/* Projects */}
                <MotionCard id="projects" className="card">
                    <h2 className="section-title gradient-text">My Projects</h2>
                    <div className="projects-grid">
                        {projects.map((p) => (
                            <a
                                key={p.title}
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-card"
                            >
                                <div className="project-info">
                                    <Code size={18} style={{color: "var(--accent)"}}/>
                                    <div className="project-body">
                                        <div className="project-text">
                                            <div style={{color: "var(--text)", fontWeight: 700}}>{p.title}</div>
                                            <div style={{color: "var(--muted)", fontSize: 13}}>{p.desc}</div>
                                        </div>

                                        {/* Progress pinned to bottom */}
                                        <div className="project-progress">
                                            <ProjectProgress progress={p.progress}/>

                                        </div>
                                    </div>
                                </div>

                                <ExternalLink size={14} style={{color: "var(--muted)"}}/>
                            </a>
                        ))}

                        <div style={{marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap"}}>
                            <a href="https://github.com/lagopodus" target="_blank" rel="noopener noreferrer"
                               className="cta-primary"
                               onMouseDown={(e) => handleUnlockClick(e, "visit-github", unlock)}
                               onClick={(e) => handleUnlockClick(e, "visit-github", unlock)}>
                                <Github size={14}/> <span style={{marginLeft: 8}}>View GitHub</span>
                            </a>
                        </div>
                    </div>
                </MotionCard>


                {/* Leetify Stats */}
                <MotionCard id="stats" className="card">
                    <h2 className="section-title gradient-text">Gaming Stats</h2>
                    <div className="projects-grid">
                        <LeetifyCard/>
                    </div>
                </MotionCard>

                <MotionCard className="card routine-card">
                    <h2 className="section-title gradient-text">Warmup Routine</h2>
                    <div className="routine-steps">
                        {warmupRoutine.map((step) => (
                            <div className="routine-step" key={step.name}>
                                <div className="routine-left">
                                    <div className="routine-icon">
                                        {routineIcons[step.icon]}
                                    </div>
                                    <div>
                                        <div className="routine-title">{step.name}</div>
                                        <div className="routine-subtext">{step.focus}</div>
                                        {step.tip && <div className="routine-tip">{step.tip}</div>}
                                    </div>
                                </div>
                                <div className="routine-meta">
                                    <span className="routine-chip">
                                        <Clock size={14} style={{ color: "var(--muted)" }} />
                                        <span>{step.minutes} min</span>
                                    </span>
                                    {step.icon !== "clock" && (
                                        <span className="routine-chip">
                                            {routineIcons[step.icon]}
                                            <span>Lock-in</span>
                                        </span>
                                    )}
                                    {step.workshopLink && (
                                        <a
                                            href={step.workshopLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="routine-chip routine-link"
                                        >
                                            <MapPinned size={14} style={{ color: "var(--muted)" }} />
                                            <span>{step.workshopLabel || "Workshop map"}</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </MotionCard>

                {/* Friends + YouTube */}
                <section className="grid-two">
                    <MotionCard id="friends" className="card">
                        <h2 className="section-title gradient-text">Friends</h2>
                        <div style={{display: "grid", gap: 10}}>
                            {videos.map((v) => (
                                <a
                                    key={v.title}
                                    href={v.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="video-row"
                                    onMouseDown={(e) => handleUnlockClick(e, "visit-friend", unlock)}
                                    onClick={(e) => handleUnlockClick(e, "visit-friend", unlock)}
                                >
                                    <CircleUserRound size={18} style={{color: "var(--accent)"}}/>
                                    <div style={{marginLeft: 10}}>
                                        <div style={{color: "var(--text)", fontWeight: 600}}>{v.title}</div>
                                        <div style={{color: "var(--muted)", fontSize: 13}}>Click!!</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </MotionCard>
                    <LatestYouTube/>
                </section>

                <MotionCard id="setup" className="card">
                    <h2 className="section-title gradient-text">My Setup</h2>
                    <div className="setup-grid">
                        {/* Monitors */}
                        <a
                            href="https://www.asus.com/us/displays-desktops/monitors/tuf-gaming/tuf-gaming-vg259qm/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="setup-item"
                        >
                            <Monitor size={20} style={{color: "var(--accent)"}}/>
                            <div>
                                <div className="setup-title">Monitor 1</div>
                                <div className="setup-text">24" 1080p 380Hz</div>
                            </div>
                        </a>

                        <a
                            href="https://www.lg.com/de/monitore/lg-27gp850-b"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="setup-item"
                        >
                            <Monitor size={20} style={{color: "var(--accent)"}}/>
                            <div>
                                <div className="setup-title">Monitor 2</div>
                                <div className="setup-text">27" 1440p 170Hz</div>
                            </div>
                        </a>

                        <a
                            href="https://www.acer.com/de-de/monitors/nitro/vg240y"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="setup-item"
                        >
                            <Monitor size={20} style={{color: "var(--accent)"}}/>
                            <div>
                                <div className="setup-title">Monitor 3</div>
                                <div className="setup-text">24" 1080p 60Hz</div>
                            </div>
                        </a>

                        {/* CPU */}
                        <a
                            href="https://www.amd.com/de/products/processors/desktops/ryzen/7000-series/amd-ryzen-7-7800x3d.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="setup-item"
                        >
                            <Cpu size={20} style={{color: "var(--accent)"}}/>
                            <div>
                                <div className="setup-title">CPU</div>
                                <div className="setup-text">Ryzen 7 7800X3D</div>
                            </div>
                        </a>

                        {/* GPU */}
                        <a
                            href="https://marketplace.nvidia.com/de-de/consumer/graphics-cards/?locale=de-de&page=1&limit=12&gpu=RTX%204070%20Ti%20SUPER&gpu_filter=RTX%205090~27,RTX%205080~34,RTX%205070%20Ti~29,RTX%205070~43,RTX%205060%20Ti~53,RTX%205060~32,RTX%204070%20Ti%20SUPER~9,RTX%205050~15,RTX%204090~2,RTX%204080%20SUPER~3,RTX%204070%20Ti~8,RTX%204070%20SUPER~13,RTX%204070~10,RTX%204060%20Ti~14,RTX%204060~14,RTX%203050~18"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="setup-item"
                        >
                            <Gpu size={20} style={{color: "var(--accent)"}}/>
                            <div>
                                <div className="setup-title">GPU</div>
                                <div className="setup-text">NVIDIA RTX 4070 Ti Super</div>
                            </div>
                        </a>

                        {/* Keyboard */}
                        <a
                            href="https://de.turtlebeach.com/products/vulcan-tkl-keyboard?Layout=FR&Switch=Linear"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="setup-item"
                        >
                            <Keyboard size={20} style={{color: "var(--accent)"}}/>
                            <div>
                                <div className="setup-title">Keyboard</div>
                                <div className="setup-text">Roccat Vulcan TKL</div>
                            </div>
                        </a>

                        {/* Mouse */}
                        <a
                            href="https://www.logitechg.com/de-de/shop/p/pro-x2-superlight-wireless-mouse"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="setup-item"
                        >
                            <Mouse size={20} style={{color: "var(--accent)"}}/>
                            <div>
                                <div className="setup-title">Mouse</div>
                                <div className="setup-text">Logitech PRO X Superlight 2</div>
                            </div>
                        </a>

                        {/* Headphones */}
                        <a
                            href="https://www.logitechg.com/de-de/shop/p/pro-x-2-wireless-headset.981-001263"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="setup-item"
                        >
                            <Headphones size={20} style={{color: "var(--accent)"}}/>
                            <div>
                                <div className="setup-title">Audio</div>
                                <div className="setup-text">Logitech PRO X 2 LIGHTSPEED</div>
                            </div>
                        </a>
                    </div>
                </MotionCard>


                <MotionCard id="achievements" className={`card ${allUnlocked ? "achievements-complete" : ""}`}>
                    <h2 className="section-title gradient-text">Website Achievements</h2>
                    <div className="achievements-grid">
                        {achievements.map((a) => (
                            <div
                                key={a.id}
                                className={`achievement-card ${!a.unlocked ? "achievement-locked" : ""}`}
                            >
                                {a.unlocked ? (ICONS[a.icon] || ICONS.locked) : ICONS.locked}
                                <div className="achievement-title">{a.title}</div>
                                <div className="achievement-desc">{a.desc}</div>
                            </div>
                        ))}
                    </div>
                </MotionCard>





                {/* Favourite Games */}
                <MotionCard id="games" className="card">
                    <h2 className="section-title gradient-text">Favourite Games</h2>
                    <p className="section-subtext">Click a card to see a mini-review, favourite loadout, and a quick strategy note.</p>
                    <div className="game-grid">
                        {favouriteGames.map((game) => (
                            <GameCard key={game.id} game={game} onOpen={handleGameOpen}/>
                        ))}
                    </div>
                </MotionCard>

                <AchievementPopup achievement={lastUnlocked}/>


                <footer className="footer">
                    <div>Built with React</div>
                    <div>© {new Date().getFullYear()} Josh</div>
                </footer>
            </main>
        </div>
    );
}

/* ---------- Subcomponents ---------- */

function handleUnlockClick(e, id, unlock) {
    if (e.button === 0 || e.button === 1 || e.ctrlKey || e.metaKey) {
        unlock(id);
    }
}

function GameCard({ game, onOpen }) {
    const [open, setOpen] = useState(false);
    const { unlock } = useAchievements();

    const toggleOpen = () => {
        setOpen((prev) => {
            const next = !prev;
            if (next) {
                onOpen?.(game.id);
            }
            return next;
        });
    };

    const handleSteamClick = (e) => {
        handleUnlockClick(e, "visit-steam", unlock);
    };

    return (
        <div className={`game-card ${open ? "open" : ""}`}>
            <button
                className="game-card-header"
                onClick={toggleOpen}
                aria-expanded={open}
                aria-controls={`${game.id}-details`}
            >
                <div>
                    <div className="game-card-title">{game.name}</div>
                    <div className="game-card-tagline">{game.tagline}</div>
                </div>
                <span className="game-card-chevron" aria-hidden="true">{open ? "−" : "+"}</span>
            </button>
            <div
                className="game-card-body"
                id={`${game.id}-details`}
                aria-hidden={!open}
            >
                <div className="game-card-content">
                    <p className="game-card-review">{game.review}</p>
                    <div className="game-card-meta-grid">
                        <div>
                            <div className="meta-label">Favorite Loadout</div>
                            <div className="meta-value">{game.loadout}</div>
                        </div>
                        <div>
                            <div className="meta-label">Strategy Tip</div>
                            <div className="meta-value">{game.tip}</div>
                        </div>
                    </div>
                    <a
                        className="game-card-link"
                        href={game.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseDown={handleSteamClick}
                        onClick={handleSteamClick}
                    >
                        View store page <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
}

function AchievementPopup({ achievement }) {
    if (!achievement) return null;

    return (
        <div className="achievement-popup">
            {ICONS[achievement.icon] || ICONS.locked}
            <div>
                <div style={{ fontWeight: 700, color: "var(--text)" }}>
                    Achievement Unlocked!
                </div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    {achievement.title}
                </div>
            </div>
        </div>
    );
}

function Counter({ value, duration = 2000 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const end = parseInt(value.toString().replace(/\D/g, ""), 10);
        if (isNaN(end)) return;

        const frameRate = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameRate);
        const increment = end / totalFrames;

        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                clearInterval(timer);
                setCount(end);
            } else {
                setCount(Math.floor(current));
            }
        }, frameRate);

        return () => clearInterval(timer);
    }, [value, duration]);

    // Extract prefix/suffix
    const match = value.match(/^(\D*)(\d+)(\D*)$/);
    const prefix = match ? match[1] : "";
    const suffix = match ? match[3] : "";

    return (
        <span>
      {prefix}
            {count.toLocaleString()}
            {suffix}
    </span>
    );
}

function Stat({ title, value, icon }) {
    return (
        <div style={{ padding: 12, borderRadius: 10, background: "var(--card-alt)", minWidth: 120 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(139,92,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {icon}
                </div>
                <div>
                    <div style={{ color: "var(--text)", fontWeight: 700 }}>
                        <Counter value={value} duration={4000} />
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>{title}</div>
                </div>
            </div>
        </div>
    );
}

function LatestYouTube() {
    const [videos, setVideos] = React.useState([]);
    const { unlock } = useAchievements();
    useEffect(() => {
        async function fetchVideos() {
            try {
                const res = await fetch(
                    "https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCwXnuUrX5WpWTWJhgoRRJcQ"
                );
                const data = await res.json();
                setVideos(data.items.slice(0, 2));
            } catch (err) {
                console.error("Failed to fetch YouTube feed", err);
            }
        }
        fetchVideos();
    }, []);

    return (
        <MotionCard id = "youtube" className="card">
            <h2 className="section-title gradient-text">Latest YouTube videos</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {videos.map((v) => (
                    <a
                        key={v.guid}
                        href={v.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className = "youtube-row"
                        onMouseDown={(e) => handleUnlockClick(e, "watched-youtube", unlock)}
                        onClick={(e) => handleUnlockClick(e, "watched-youtube", unlock)}                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            textDecoration: "none",
                        }}
                    >
                        <img
                            src={v.thumbnail}
                            alt={v.title}
                            style={{
                                width: 120,
                                height: 70,
                                borderRadius: 8,
                                objectFit: "cover",
                            }}
                        />
                        <div>
                            <div
                                style={{
                                    color: "var(--text)",
                                    fontWeight: 700,
                                    fontSize: 14,
                                }}
                            >
                                {v.title}
                            </div>
                            <div style={{ color: "var(--muted)", fontSize: 12 }}>
                                {new Date(v.pubDate).toLocaleDateString()}
                            </div>
                        </div>
                    </a>
                ))}
            </div>
            <a
                href="https://www.youtube.com/@lagopodus_"
                target="_blank"
                rel="noopener noreferrer"
                className="link-inline"
                style={{ marginTop: 12 }}
            >
                <Youtube size={14} />{" "}
                <span style={{ marginLeft: 8 }}>Visit YouTube channel</span>
            </a>
        </MotionCard>
    );
}


function LeetifyCard() {
    const [profile, setProfile] = useState(null);
    const { unlock } = useAchievements();
    const steamId = "76561199146483679"; // your Steam64 ID

    useEffect(() => {
        let mounted = true;
        async function fetchProfile() {
            try {
                const res = await fetch(
                    `https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steamId}`
                );
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                if (mounted) setProfile(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchProfile();
        return () => (mounted = false);
    }, [steamId]);

    if (!profile) {
        return (
            <div
                style={{
                    padding: 24,
                    minHeight: 220,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--card-alt)",
                    borderRadius: 12,
                }}
            >
                <div style={{ color: "var(--muted)" }}>Loading Leetify stats…</div>
            </div>
        );
    }

    // core values
    const winPct =
        typeof profile.winrate === "number"
            ? (profile.winrate * 100).toFixed(1)
            : "—";
    const leetRating = profile.ranks?.leetify ?? "—";
    const renown = profile.ranks?.renown ?? null;
    const recentMatches = Array.isArray(profile.recent_matches)
        ? profile.recent_matches
        : [];
    const recent = recentMatches.length ? recentMatches[0] : null;

    // renown rank
    const renownRank = getRenownRank(renown);
    const renownProgress =
        renown != null && renownRank ? renownProgressInTier(renown) : 0;


    return (
        <article className="leetify-card">
            {/* Left: avatar + name */}
            <div className="leetify-left">
                <div className="leetify-avatar">
                    <img src="/gomme.jpg" alt="leetify" />
                </div>

                <div style={{ textAlign: "center" }}>
                    <div className="leetify-name">{profile.name}</div>
                    <div className="leetify-sub">Leetify profile</div>
                </div>

                <a
                    href={`https://leetify.com/app/profile/${
                        profile.steam64_id ?? profile.steamId ?? ""
                    }`}
                    target="_blank"
                    rel="noreferrer"
                    onMouseDown={(e) => handleUnlockClick(e, "visit-leetify", unlock)}
                    onClick={(e) => handleUnlockClick(e, "visit-leetify", unlock)}
                    className="leetify-link"
                >
                    <ExternalLink size={14} /> View
                </a>
            </div>

            {/* Right: stats (your full existing code goes here) */}
            <div className="leetify-right">
                {/* Header badges */}
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        flexWrap: "wrap",
                        paddingBottom: 12,
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    {/* Winrate pill */}
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            background:
                                winPct > 50
                                    ? "rgba(34,197,94,0.1)"
                                    : "rgba(239,68,68,0.1)",
                            padding: "10px 14px",
                            borderRadius: 12,
                            color: winPct > 50 ? "#22c55e" : "#ef4444",
                            fontWeight: 900,
                        }}
                    >
                        <Trophy
                            size={18}
                            style={{color: winPct > 50 ? "#22c55e" : "#ef4444"}}
                        />
                        <div>{winPct}%</div>
                        <div style={{fontSize: 13, color: "var(--muted)"}}>winrate</div>
                    </div>

                    {/* Matches pill */}
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            alignItems: "center",
                            background: "rgba(255,255,255,0.02)",
                            padding: "10px 14px",
                            borderRadius: 12,
                        }}
                    >
                        <Zap size={18} style={{color: "var(--accent)"}}/>
                        <div style={{fontWeight: 900, color: "var(--text)"}}>
                            {profile.total_matches ?? "—"}
                        </div>
                        <div style={{color: "var(--muted)", fontSize: 13}}>matches</div>
                    </div>

                    {/* Leetify rating pill */}
                    {(() => {
                        let ratingColor = "var(--text)";
                        if (leetRating <= -1.5) ratingColor = "#ef4444";
                        else if (leetRating <= -0.5) ratingColor = "#f97316";
                        else if (leetRating <= 0.5) ratingColor = "#eab308";
                        else if (leetRating <= 1.5) ratingColor = "#86efac";
                        else ratingColor = "#22c55e";

                        return (
                            <div
                                style={{
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "center",
                                    background: "rgba(255,255,255,0.02)",
                                    padding: "10px 14px",
                                    borderRadius: 12,
                                }}
                            >
                                <Star size={18} style={{color: "#60a5fa"}}/>
                                <div style={{fontWeight: 900, color: ratingColor}}>
                                    {typeof leetRating === "number"
                                        ? leetRating > 0
                                            ? `+${leetRating.toFixed(2)}`
                                            : leetRating.toFixed(2)
                                        : leetRating}
                                </div>
                                <div style={{color: "var(--muted)", fontSize: 13}}>
                                    leetify
                                </div>
                            </div>
                        );
                    })()}

                    {/* Aim rating pill */}
                    {profile.rating?.aim && (
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                                background: "rgba(255,255,255,0.02)",
                                padding: "10px 14px",
                                borderRadius: 12,
                            }}
                        >
                            <Crosshair size={18} style={{color: "#f87171"}}/>
                            <div style={{fontWeight: 900, color: "var(--text)"}}>
                                {profile.rating.aim.toFixed(1)}
                            </div>
                            <div style={{color: "var(--muted)", fontSize: 13}}>aim</div>
                        </div>
                    )}

                    {/* Positioning rating pill */}
                    {profile.rating?.positioning && (
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
                                background: "rgba(255,255,255,0.02)",
                                padding: "10px 14px",
                                borderRadius: 12,
                            }}
                        >
                            <MapPinned size={18} style={{color: "#fabf2c"}}/>
                            <div style={{fontWeight: 900, color: "var(--text)"}}>
                                {profile.rating.positioning.toFixed(1)}
                            </div>
                            <div style={{color: "var(--muted)", fontSize: 13}}>
                                positioning
                            </div>
                        </div>
                    )}
                </div>

                {/* Renown / Premier / Recent match */}
                <div
                    style={{
                        display: "flex",
                        gap: 14,
                        alignItems: "stretch",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        paddingBottom: 12,
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                >
                    {/* Renown */}
                    <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                        <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                            <div
                                style={{
                                    fontSize: 18,
                                    fontWeight: 900,
                                    color: "var(--text)",
                                    marginBottom: 2,
                                }}
                            >
                                Renown
                            </div>
                            <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                                <div
                                    style={{
                                        padding: "10px 16px",
                                        borderRadius: 999,
                                        background: renownRank
                                            ? `linear-gradient(135deg, ${renownRank.color}, #0f172a)`
                                            : "rgba(255,255,255,0.05)",
                                        color: "white",
                                        fontWeight: 900,
                                        fontSize: 14,
                                        textShadow: "0 1px 3px rgba(0,0,0,0.6)",
                                        boxShadow: `0 0 10px ${renownRank ? renownRank.color : "transparent"}44`,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    {renownRank ? renownRank.name : "Unranked"}
                                </div>

                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <div
                                        style={{
                                            color: "var(--text)",
                                            fontWeight: 900,
                                            fontSize: 16,
                                        }}
                                    >
                                        {renown != null ? Number(renown).toLocaleString() : "—"}
                                    </div>
                                    <div style={{color: "var(--muted)", fontSize: 12}}>
                                        {renownRank
                                            ? `${renownRank.min.toLocaleString()} — ${
                                                isFinite(renownRank.max)
                                                    ? renownRank.max.toLocaleString()
                                                    : "∞"
                                            }`
                                            : ""}
                                    </div>
                                </div>
                            </div>
                            {renown != null && renownRank && isFinite(renownRank.max) && (
                                <div
                                    style={{
                                        width: 420,
                                        maxWidth: "100%",
                                        height: 14,
                                        background: "rgba(255,255,255,0.08)",
                                        borderRadius: 999,
                                        overflow: "hidden",
                                        boxShadow: "inset 0 1px 4px rgba(0,0,0,0.6)",
                                    }}
                                >
                                    <motion.div
                                        initial={{width: 0}}
                                        animate={{width: `${Math.round(renownProgress * 100)}%`}}
                                        transition={{duration: 0.6, ease: "easeOut"}}
                                        style={{
                                            height: "100%",
                                            background: `linear-gradient(90deg, ${renownRank.color}, #ffffff33)`,
                                            borderRadius: 999,
                                        }}
                                    />
                                </div>

                            )}
                            {renown != null && renownRank && !isFinite(renownRank.max) && (
                                <div style={{color: "var(--muted)", fontSize: 12}}>
                                    Top tier — keep going!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Premier */}
                    <div style={{display: "flex", flexDirection: "column", gap: 6}}>
                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 900,
                                color: "var(--text)",
                            }}
                        >
                            Premier
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "14px 22px",
                                borderRadius: "999px", // pill shape
                                background: `linear-gradient(135deg, ${getPremierColor(
                                    profile.ranks.premier
                                )}, #1e293b)`,
                                color: "white",
                                fontSize: 20,
                                fontWeight: 900,
                                textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                                boxShadow: "0 0 8px rgba(139, 92, 246, 0.4)", // glow
                                minWidth: 100,
                            }}
                        >
                            {profile.ranks.premier}
                        </div>

                    </div>

                    {/* Recent match */}
                    <div
                        style={{
                            minWidth: 220,
                            borderLeft: "1px solid rgba(255,255,255,0.05)",
                            paddingLeft: 14,
                        }}
                    >
                        <div style={{color: "var(--muted)", fontSize: 12}}>
                            Latest match
                        </div>
                        {recent ? (
                            <div
                                style={{
                                    marginTop: 8,
                                    background: "var(--card-alt)",
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            color: "var(--text)",
                                            fontWeight: 800,
                                        }}
                                    >
                                        {recent.map_name ?? "—"}
                                    </div>
                                    <div
                                        style={{
                                            color:
                                                recent.outcome === "win"
                                                    ? "#16a34a"
                                                    : recent.outcome === "tie"
                                                        ? "#9ca3af"
                                                        : "#ef4444",
                                            fontWeight: 900,
                                        }}
                                    >
                                        {recent.outcome}
                                    </div>
                                </div>
                                <div>
                                    Score:{" "}
                                    {Array.isArray(recent.score)
                                        ? `${recent.score[0]} – ${recent.score[1]}`
                                        : "—"}
                                </div>
                                <div>
                                    Rating:{" "}
                                    {recent.leetify_rating > 0
                                        ? `+${(recent.leetify_rating * 100).toFixed(1)}`
                                        : (recent.leetify_rating * 100).toFixed(1)}
                                </div>
                            </div>
                        ) : (
                            <div style={{marginTop: 8, color: "var(--muted)"}}>
                                No recent matches
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer note */}
                <div
                    style={{
                        color: "var(--muted)",
                        fontSize: 12,
                        marginTop: 6,
                        paddingTop: 10,
                    }}
                >
                    Data updated from{" "}
                    <a
                        href="https://leetify.com"
                        target="_blank"
                        rel="noreferrer"
                        style={{color: "var(--accent)"}}
                    >
                        Leetify
                    </a>
                </div>
            </div>
        </article>
    );
}

function getRenownRank(renown) {
    if (renown == null || isNaN(Number(renown))) return null;
    const n = Number(renown);
    return RENOWN_RANKS.find((r) => n >= r.min && n <= r.max) || null;
}

function renownProgressInTier(renown) {
    const rank = getRenownRank(renown);
    if (!rank) return 0;
    if (!isFinite(rank.max)) return 1;
    const n = Number(renown);
    const span = rank.max - rank.min + 1;
    return Math.max(0, Math.min(1, (n - rank.min) / span));
}

function ProjectProgress({progress}) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        // animate number
        const controls = animate(count, progress, {
            duration: 3,
            ease: "easeOut",
        });

        // subscribe to motion value updates
        const unsubscribe = rounded.on("change", (v) => {
            setDisplayValue(v);
        });

        return () => {
            controls.stop();
            unsubscribe();
        };
    }, [progress, count, rounded]);

    return (
        <div className="project-progress">
            <div className="progress-bar">
                <motion.div
                    className="progress-fill"
                    initial={{width: 0}}
                    whileInView={{width: `${progress}%`}}
                    transition={{duration: 3, ease: "easeOut"}}
                    viewport={{once: true}}
                />
            </div>
            <div className="progress-label">{displayValue}%</div>
        </div>
    );
}

export default MainApp;
