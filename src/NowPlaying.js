import React, { useEffect, useMemo, useRef, useState } from "react";
import { Music, Heart, Sparkles, Layers } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const LOCAL_STORAGE_KEY = "np:favorites";

const sanitizeSummary = (summary) => summary?.replace(/<[^>]*>/g, "").trim();

export default function NowPlaying({ username, apiKey }) {
    const [track, setTrack] = useState(null);
    const [meta, setMeta] = useState({ tags: [], lyricSnippet: "" });
    const [showOverlay, setShowOverlay] = useState(false);
    const [favorites, setFavorites] = useState(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (err) {
            console.warn("Unable to read favorites", err);
            return [];
        }
    });
    const lastTrackIdRef = useRef(null);
    const [changeCount, setChangeCount] = useState(0);

    const activeTrackId = useMemo(() => {
        if (!track) return null;
        return `${track.artist} - ${track.name}`;
    }, [track]);

    useEffect(() => {
        async function fetchTrackMeta(artist, name) {
            try {
                const res = await fetch(
                    `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(name)}&api_key=${apiKey}&format=json`
                );
                const data = await res.json();
                const tags = (data?.track?.toptags?.tag || []).slice(0, 4).map((t) => t.name);
                const lyricSnippet = sanitizeSummary(data?.track?.wiki?.summary)
                    ?.split(". ")
                    .slice(0, 2)
                    .join(". ") || "";

                setMeta({ tags, lyricSnippet });
            } catch (err) {
                console.warn("Unable to fetch track info", err);
                setMeta({ tags: [], lyricSnippet: "" });
            }
        }

        async function fetchNowPlaying() {
            try {
                const res = await fetch(
                    `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=2`
                );
                const data = await res.json();
                const tracks = data?.recenttracks?.track || [];

                if (tracks.length > 0) {
                    const current = tracks[0];
                    const isNowPlaying = current["@attr"]?.nowplaying === "true";
                    const nextTrack = {
                        name: current.name,
                        artist: current.artist["#text"],
                        album: current.album["#text"],
                        image: current.image?.[2]?.["#text"],
                        url: current.url,
                        nowPlaying: isNowPlaying,
                    };

                    const nextId = `${nextTrack.artist} - ${nextTrack.name}`;

                    if (nextId !== lastTrackIdRef.current) {
                        lastTrackIdRef.current = nextId;
                        setChangeCount((c) => c + 1);
                        fetchTrackMeta(nextTrack.artist, nextTrack.name);
                    }

                    setTrack(nextTrack);
                }
            } catch (err) {
                console.error("Error fetching now playing:", err);
            }
        }

        fetchNowPlaying();
        const interval = setInterval(fetchNowPlaying, 10_000);
        return () => clearInterval(interval);
    }, [apiKey, username]);

    const handleToggleFavorite = () => {
        if (!track) return;
        const exists = favorites.some((f) => f.id === activeTrackId);

        if (exists) {
            const updated = favorites.filter((f) => f.id !== activeTrackId);
            setFavorites(updated);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
            return;
        }

        const updated = [...favorites, { id: activeTrackId, ...track }];
        setFavorites(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    };

    const handleRemoveFavorite = (id) => {
        const updated = favorites.filter((f) => f.id !== id);
        setFavorites(updated);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    };

    const isActiveTrackFavorite = useMemo(
        () => favorites.some((f) => f.id === activeTrackId),
        [favorites, activeTrackId]
    );

    if (!track) return null;

    return (
        <div className="music-card">
            <motion.div
                key={`${activeTrackId}-${changeCount}`}
                className="music-main"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
            >
                <div className="music-cover">
                    {track.image ? (
                        <img src={track.image} alt={track.name} />
                    ) : (
                        <Music size={28} style={{ color: "var(--accent)" }} />
                    )}
                </div>

                <div className="music-body">
                    <div className="music-title-row">
                        <a href={track.url} target="_blank" rel="noreferrer" className="music-title">
                            {track.name}
                        </a>
                        <AnimatePresence>
                            {track.nowPlaying && (
                                <motion.span
                                    key="pulse"
                                    className="music-reaction"
                                    initial={{ scale: 0.6, opacity: 0 }}
                                    animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                >
                                    <Sparkles size={16} /> Live
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="music-subtitle">
                        {track.artist} {track.album ? `· ${track.album}` : ""}
                    </div>

                    {track.nowPlaying ? (
                        <div className="music-status now">
                            ▶ Now Playing
                            <div className="equalizer">
                                <span />
                                <span />
                                <span />
                            </div>
                        </div>
                    ) : (
                        <div className="music-status muted">⏸ Last Listened</div>
                    )}
                </div>
            </motion.div>

            <AnimatePresence>
                {showOverlay && (meta.tags.length > 0 || meta.lyricSnippet) && (
                    <motion.div
                        key={`${activeTrackId}-overlay`}
                        className="music-overlay"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <div className="overlay-label">
                            <Layers size={14} /> Details
                        </div>
                        {meta.lyricSnippet && <p className="overlay-lyrics">“{meta.lyricSnippet}”</p>}
                        {meta.tags.length > 0 && (
                            <div className="overlay-tags">
                                {meta.tags.map((tag) => (
                                    <span key={tag} className="overlay-tag">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="music-controls">
                <button className="ghost-btn" onClick={() => setShowOverlay((v) => !v)}>
                    <Layers size={14} /> {showOverlay ? "Hide details" : "Show details"}
                </button>
                <button
                    className={`favorite-btn ${isActiveTrackFavorite ? "favorite-btn--active" : ""}`}
                    onClick={handleToggleFavorite}
                    disabled={!track}
                >
                    <Heart size={14} /> {isActiveTrackFavorite ? "Unfavorite" : "Save track"}
                </button>
            </div>

            {favorites.length > 0 && (
                <div className="favorite-row">
                    <span className="favorite-label">Favorites:</span>
                    <div className="favorite-list">
                        {favorites.map((fav) => (
                            <span key={fav.id} className="favorite-chip">
                                {fav.artist} — {fav.name}
                                <button
                                    className="favorite-chip-remove"
                                    aria-label={`Remove ${fav.name} from favorites`}
                                    onClick={() => handleRemoveFavorite(fav.id)}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                .equalizer {
                    display: flex;
                    gap: 2px;
                    height: 12px;
                    align-items: flex-end;
                }
                .equalizer span {
                    display: block;
                    width: 2px;
                    background: var(--accent);
                    border-radius: 1px;
                    animation: bounce 1.2s infinite ease-in-out;
                }
                .equalizer span:nth-child(1) { animation-delay: 0s; height: 20%; }
                .equalizer span:nth-child(2) { animation-delay: 0.2s; height: 50%; }
                .equalizer span:nth-child(3) { animation-delay: 0.4s; height: 35%; }

                @keyframes bounce {
                    0%, 100% { transform: scaleY(0.6); }
                    50% { transform: scaleY(1.0); }
                }
            `}</style>
        </div>
    );
}
