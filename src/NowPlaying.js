import React, { useEffect, useState } from "react";
import { Music } from "lucide-react";

export default function NowPlaying({ username, apiKey }) {
    const [track, setTrack] = useState(null);

    useEffect(() => {
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

                    setTrack({
                        name: current.name,
                        artist: current.artist["#text"],
                        album: current.album["#text"],
                        image: current.image?.[2]?.["#text"],
                        url: current.url,
                        nowPlaying: isNowPlaying,
                    });
                }
            } catch (err) {
                console.error("Error fetching now playing:", err);
            }
        }

        fetchNowPlaying();
        const interval = setInterval(fetchNowPlaying, 10_000);
        return () => clearInterval(interval);
    }, [username, apiKey]);

    if (!track) return null;

    return (
        <div
            className="card"
            style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 14,
            }}
        >
            {/* Album art */}
            <div
                style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {track.image ? (
                    <img
                        src={track.image}
                        alt={track.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <Music size={28} style={{ color: "var(--accent)" }} />
                )}
            </div>

            {/* Track info */}
            <div style={{ flex: 1 }}>
                <a
                    href={track.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        fontWeight: 700,
                        color: "var(--text)",
                        textDecoration: "none",
                    }}
                >
                    {track.name}
                </a>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    {track.artist} {track.album ? `· ${track.album}` : ""}
                </div>

                {track.nowPlaying ? (
                    <div
                        style={{
                            fontSize: 12,
                            fontWeight: 700,
                            marginTop: 2,
                            color: "var(--accent)",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        ▶ Now Playing
                        <div className="equalizer">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            fontSize: 12,
                            fontWeight: 700,
                            marginTop: 2,
                            color: "var(--muted)",
                        }}
                    >
                        ⏸ Last Listened
                    </div>
                )}
            </div>

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
