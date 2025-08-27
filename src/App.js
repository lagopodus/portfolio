import React, { useState, useEffect } from "react";
import {
  Github,
  User,
  Code,
  ExternalLink,
  Linkedin,
  Youtube,
  Twitch,
  Twitter,
  BookOpen,
  Calendar,
  MapPin,
  Star,
  Gamepad2,
  Trophy,
  Zap,
  Target,
    Crosshair,
    CircleUserRound,
    Clock,
    CircleDollarSign
} from "lucide-react";

/**
 * Dark-only portfolio App
 * - Leetify tile moved into a normal section with other content
 * - Tile improved: avatar, badges, recent match, link, attribution
 * - Adds K/D and Renown (elo) badges
 */

const ACCENT = "#8b5cf6"; // purple
const BG = "#071029";
const CARD = "#071827";
const MUTED = "#9aa6bf";
const TEXT = "#e6eef8";
const CARD_ALT = "#0b1a2b";

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
    desc: "GrowGreen is a 2D gardening game made with Godot, featuring virtual plant care and fun mini-games. ",
    link: "https://github.com/AlexInABox/grow-green",
  },
  {
    title: "Portfolio",
    desc: "The page you are viewing right now.",
    link: "https://github.com/lagopodus/portfolio",
  },
  {
    title: "Unreal Engine FPS Game",
    desc: "Secret!!!!",
    link: "https://github.com/lagopodus/ue5-fps-shooter",
  },
];

const blogPosts = [
  {
    title: "How I optimize React builds",
    excerpt: "Small config changes that saved minutes on each CI build.",
    link: "#",
  },
  {
    title: "From zero to streaming",
    excerpt: "Setting up OBS, alerts and overlays for clean streams.",
    link: "#",
  },
];
const RENOWN_RANKS = [
  { name: "Bronze", min: 3000, max: 6999, color: "#a16207" },     // brown
  { name: "Silver", min: 7000, max: 10999, color: "#94a3b8" },    // light gray/blue
  { name: "Gold", min: 11000, max: 14999, color: "#f59e0b" },     // gold / orange
  { name: "Platinum", min: 15000, max: 18999, color: "#06b6d4" }, // teal
  { name: "Diamond", min: 19000, max: 21999, color: "#3b82f6" },  // blue
  { name: "Master", min: 22000, max: 24999, color: "#a855f7" },   // purple
  { name: "Renowned", min: 25000, max: Infinity, color: "#16a34a" }, // green
];


const videos = [
  {
    title: "alexinabox",
    link: "https://alexinabox.de/",
  },
  {
    title: "Theo",
    link: "https://theocloud.dev/",
  },
];

const streams = [
  { day: "Tue", time: "19:00 CEST", title: "Frontend tinkering" },
  { day: "Fri", time: "20:00 CEST", title: "Project showcase + Q&A" },
];

/* ---------- Helpers for K/D extraction & formatting ---------- */

function computeKillsDeathsFromProfile(profile) {
  // 1) direct KD fields (many APIs use several names)
  const kdCandidates = [
    profile.kd,
    profile.kdr,
    profile.kill_death_ratio,
    profile.kd_ratio,
    profile.kdratio,
    profile.kd_value,
    profile.stats?.kd,
    profile.stats?.kdr,
    profile.stats?.kill_death_ratio,
  ];
  for (const v of kdCandidates) {
    if (v != null && !Number.isNaN(Number(v))) {
      return { kd: Number(v) };
    }
  }

  // 2) direct totals (preferred if present)
  if (profile.total_kills != null || profile.total_deaths != null) {
    const kills = Number(profile.total_kills ?? 0);
    const deaths = Number(profile.total_deaths ?? 0);
    return { kills, deaths };
  }
  if (profile.stats?.total_kills != null || profile.stats?.total_deaths != null) {
    const kills = Number(profile.stats.total_kills ?? 0);
    const deaths = Number(profile.stats.total_deaths ?? 0);
    return { kills, deaths };
  }

  // 3) sum recent_matches if they include kills/deaths per match
  if (Array.isArray(profile.recent_matches) && profile.recent_matches.length > 0) {
    let sumKills = 0;
    let sumDeaths = 0;
    let found = false;
    for (const m of profile.recent_matches) {
      const k = m.kills ?? m.kd_kills ?? m.player_kills ?? null;
      const d = m.deaths ?? m.kd_deaths ?? m.player_deaths ?? null;
      if (k != null && d != null) {
        found = true;
        sumKills += Number(k);
        sumDeaths += Number(d);
      }
    }
    if (found) return { kills: sumKills, deaths: sumDeaths, fromRecentCount: profile.recent_matches.length };
  }

  // 4) nothing reliable found
  return null;
}
function formatKDObj(obj) {
  if (!obj) return "—";
  if (obj.kd != null) {
    // kd provided directly
    const v = Number(obj.kd);
    return Number.isFinite(v) ? v.toFixed(2) : "—";
  }
  if (obj.kills != null && obj.deaths != null) {
    const kills = Number(obj.kills);
    const deaths = Number(obj.deaths);
    if (deaths === 0) return kills > 0 ? kills.toFixed(2) : "—";
    return (kills / deaths).toFixed(2);
  }
  return "—";
}
function formatKD(kills, deaths) {
  if (kills == null || deaths == null) return "—";
  if (deaths === 0) return kills > 0 ? kills.toFixed(2) : "—";
  return (kills / deaths).toFixed(2);
}

/* ---------- App ---------- */

function App() {
  return (
      <div style={styles.page}>
        <main style={styles.container}>
          {/* Header / Hero */}
          <section style={styles.hero}>
            <div style={styles.heroLeft}>
              <User
                  size={56}
                  style={{
                    color: ACCENT,
                    background: "rgba(139,92,246,0.08)",
                    borderRadius: 10,
                    padding: 8,
                  }}
              />
              <div style={{ marginLeft: 14 }}>
                <h1 style={styles.name}>
                  Josh <span style={{ color: ACCENT }}>lagopodus</span>
                </h1>
                <p style={styles.tagline}>Counter Strike • Computer Scienece • Car Stuff</p>
                <p style={styles.location}>
                  <MapPin size={14} style={{ marginRight: 8 }} /> Berlin
                </p>
              </div>
            </div>

            {/* CONTACTS moved to the top (no email) */}
            <div style={styles.contactsTop}>
              <a
                  style={styles.contactTopBtn}
                  href="https://github.com/lagopodus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
              >
                <Github size={16} /> <span style={{ marginLeft: 8 }}>GitHub</span>
              </a>

              <a
                  style={styles.contactTopBtn}
                  href="https://www.linkedin.com/in/josh-tischer-80b891349/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
              >
                <Linkedin size={16} /> <span style={{ marginLeft: 8 }}>LinkedIn</span>
              </a>

              <a
                  style={styles.contactTopBtn}
                  href="https://www.youtube.com/@lagopodus_"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
              >
                <Youtube size={16} /> <span style={{ marginLeft: 8 }}>YouTube</span>
              </a>

              <a
                  style={styles.contactTopBtn}
                  href="https://www.twitch.tv/lagopodus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitch"
              >
                <Twitch size={16} /> <span style={{ marginLeft: 8 }}>Twitch</span>
              </a>

              <a
                  style={styles.contactTopBtn}
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
              >
                <Twitter size={16} /> <span style={{ marginLeft: 8 }}>Twitter</span>
              </a>
            </div>
          </section>

          {/* About + CTA */}
          <section style={styles.card}>
            <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 20,
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                <h2 style={styles.sectionTitle}>About</h2>
                <p style={styles.text}>
                    <i>„Ich fahr nicht gerne Motorrad, weil es cool ist, ich fahr gerne Motorrad, weil ich es gerne fahr.
                    Basta. Abgesehen davon, fahr ich kein Motorrad.“<br /></i>
                    <b>- Rainer Winkler</b>
                </p>

                <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <a
                      href="https://github.com/lagopodus"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.ctaPrimary}
                  >
                    <Github size={14} /> <span style={{ marginLeft: 8 }}>View GitHub</span>
                  </a>
                </div>
              </div>

              <div style={{ width: 320, minWidth: 260 }}>
                <h3 style={{ ...styles.sectionTitle, marginBottom: 10 }}>Quick stats</h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Stat title="Hours played" value="2000+" icon={<Clock size={16} />} />
                  <Stat title="Inventory worth" value="~3000$" icon={<CircleDollarSign size={16} />} />
                </div>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Featured projects</h2>
            <div style={styles.projectsGrid}>
              {projects.map((p) => (
                  <a key={p.title} href={p.link} target="_blank" rel="noopener noreferrer" style={styles.projectCard}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Code size={18} style={{ color: ACCENT }} />
                      <div>
                        <div style={{ color: TEXT, fontWeight: 700 }}>{p.title}</div>
                        <div style={{ color: MUTED, fontSize: 13 }}>{p.desc}</div>
                      </div>
                    </div>
                    <ExternalLink size={14} style={{ color: MUTED }} />
                  </a>
              ))}
            </div>
          </section>

          {/* Gaming & Stats section - Leetify card moved here as a normal tile */}
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Gaming & stats</h2>
            <div style={styles.projectsGrid}>
              {/* Leetify tile */}
              <LeetifyCard />
              {/* You can add more tiles here (Faceit / Twitch embed / streams preview) */}
            </div>
          </section>

          {/* Videos + Streams */}
          <section style={styles.gridTwo}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Freunde</h2>
              <div style={{ display: "grid", gap: 10 }}>
                {videos.map((v) => (
                    <a key={v.title} href={v.link} target="_blank" rel="noopener noreferrer" style={styles.videoRow}>
                      <CircleUserRound size={18} style={{ color: ACCENT }} />
                      <div style={{ marginLeft: 10 }}>
                        <div style={{ color: TEXT, fontWeight: 600 }}>{v.title}</div>
                        <div style={{ color: MUTED, fontSize: 13 }}>Click!!</div>
                      </div>
                    </a>
                ))}
              </div>
              <a
                  href="https://www.youtube.com/@lagopodus_"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.linkInline, marginTop: 12 }}
              >
                <ExternalLink size={14} /> <span style={{ marginLeft: 8 }}>Visit YouTube channel</span>
              </a>
            </div>

            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Upcoming streams</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {streams.map((s) => (
                    <div key={s.day} style={styles.streamRow}>
                      <div style={{ fontWeight: 700 }}>{s.day}</div>
                      <div style={{ color: MUTED }}>{s.time}</div>
                      <div style={{ marginLeft: "auto", color: TEXT }}>{s.title}</div>
                    </div>
                ))}
              </div>

              <a href="https://www.twitch.tv/" target="_blank" rel="noopener noreferrer" style={{ ...styles.linkInline, marginTop: 12 }}>
                <Twitch size={14} /> <span style={{ marginLeft: 8 }}>Follow on Twitch</span>
              </a>
            </div>
          </section>

          {/* Blog + Experience */}
          <section style={styles.card}>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <h2 style={styles.sectionTitle}>Latest blog</h2>
                {blogPosts.map((b) => (
                    <a key={b.title} href={b.link} style={styles.blogRow}>
                      <BookOpen size={18} style={{ color: ACCENT }} />
                      <div style={{ marginLeft: 10 }}>
                        <div style={{ color: TEXT, fontWeight: 700 }}>{b.title}</div>
                        <div style={{ color: MUTED, fontSize: 13 }}>{b.excerpt}</div>
                      </div>
                    </a>
                ))}
              </div>

              <div style={{ width: 360, minWidth: 260 }}>
                <h2 style={styles.sectionTitle}>Experience</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Experience role="Frontend Engineer" place="Startup A" period="2023 — Present" desc="Working on product UI, performance and dev tooling." />
                  <Experience role="Web Developer" place="Freelance" period="2020 — 2023" desc="Built sites & small apps for clients." />
                </div>
              </div>
            </div>
          </section>





          {/* Skills */}
          <section style={styles.card}>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 260 }}>
                <h2 style={styles.sectionTitle}>Skills</h2>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {["React", "TypeScript", "Vite", "Node.js", "CSS", "Testing"].map((s) => (
                      <span key={s} style={styles.skillPill}>{s}</span>
                  ))}
                </div>
              </div>

              <div style={{ width: 320, minWidth: 240 }}>
                <h2 style={styles.sectionTitle}>Get in touch</h2>
                <p style={{ color: MUTED }}>All contact links are now available at the top of the page for quick access.</p>
              </div>
            </div>
          </section>

          <footer style={styles.footer}>
            <div>Built with React • Purple vibes ✨</div>
            <div style={{ color: MUTED, fontSize: 13 }}>© {new Date().getFullYear()} Josh</div>
          </footer>
        </main>
      </div>
  );
}

/* small subcomponents */
function Stat({ title, value, icon }) {
  return (
      <div style={{ padding: 12, borderRadius: 10, background: CARD_ALT, minWidth: 120 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(139,92,246,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
          >
            {icon}
          </div>
          <div>
            <div style={{ color: TEXT, fontWeight: 700 }}>{value}</div>
            <div style={{ color: MUTED, fontSize: 13 }}>{title}</div>
          </div>
        </div>
      </div>
  );
}


/* polished Leetify tile (improved visuals) */
function LeetifyCard() {
  const [profile, setProfile] = useState(null);
  const steamId = "76561199146483679"; // your Steam64 ID

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      try {
        const res = await fetch(`https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steamId}`);
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
        <div style={{ ...styles.projectCard, padding: 24, minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: MUTED }}>Loading Leetify stats…</div>
        </div>
    );
  }

  // core values
  const winPct = typeof profile.winrate === "number" ? (profile.winrate * 100).toFixed(1) : "—";
  const leetRating = profile.ranks?.leetify ?? "—";
  const faceit = profile.ranks?.faceit ?? "—";
  const renown = profile.ranks?.renown ?? null;
  const recentMatches = Array.isArray(profile.recent_matches) ? profile.recent_matches : [];
  const recent = recentMatches.length ? recentMatches[0] : null;

  // K/D
  const kdData = computeKillsDeathsFromProfile(profile);
  const kdLabel = kdData ? formatKD(kdData.kills, kdData.deaths) : null;
  const kdNum = kdLabel && kdLabel !== "—" ? Number(kdLabel) : null;
  const kdColor = kdNum == null ? "#8b5cf6" : kdNum >= 1.15 ? "#16a34a" : kdNum >= 0.95 ? "#f59e0b" : "#ef4444";

  // renown rank
  const renownRank = getRenownRank(renown);
  const renownProgress = renown != null && renownRank ? renownProgressInTier(renown) : 0;

  // sparkline data (take leetify_rating from recent matches if available)
  const sparkData = recentMatches
      .map((m) => (m.leetify_rating != null ? Number(m.leetify_rating) : null))
      .filter((v) => v != null)
      .slice(-12);

  return (
      <article
          style={{
            ...styles.projectCard,
            minHeight: 240,
            padding: 22,
            borderRadius: 16,
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            gap: 18,
          }}
      >
        {/* Left: big avatar + name */}
        <div
            style={{
              width: 140,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              paddingRight: 18,
              borderRight: "1px solid rgba(255,255,255,0.05)", // vertical divider
            }}
        >
          <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 14,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(180deg, rgba(139,92,246,0.14), rgba(139,92,246,0.04))",
                border: "1px solid rgba(255,255,255,0.02)",
              }}
          >
            {profile.avatar ? (
                <img
                    src={profile.avatar}
                    alt={profile.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
            ) : (
                <Gamepad2 size={44} style={{ color: ACCENT }} />
            )}
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ color: TEXT, fontWeight: 900, fontSize: 18 }}>
              {profile.name}
            </div>
            <div style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>
              Leetify profile
            </div>
          </div>

          {/* action link */}
          <a
              href={`https://leetify.com/app/profile/${profile.steam64_id ?? profile.steamId ?? ""}`}
              target="_blank"
              rel="noreferrer"
              style={{
                marginTop: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.02)",
                color: ACCENT,
                textDecoration: "none",
                fontWeight: 800,
                fontSize: 13,
              }}
          >
            <ExternalLink size={14} /> View
          </a>
        </div>

        {/* Middle: main big stats */}
        <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
        >
          {/* Header badges (big) */}
          <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
                paddingBottom: 12,
                borderBottom: "1px solid rgba(255,255,255,0.05)", // divider under badges
              }}
          >
            {/* Winrate */}
            {/* Example: win percentage pill */}
            <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  background: winPct > 50 ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", // green vs red background
                  padding: "10px 14px",
                  borderRadius: 12,
                  color: winPct > 50 ? "#22c55e" : "#ef4444", // optional: text color
                  fontWeight: 900,
                }}
            >
              <Trophy size={18} style={{ color: winPct > 50 ? "#22c55e" : "#ef4444" }} />
              <div>{winPct}%</div>
              <div style={{ fontSize: 13, color: MUTED }}>winrate</div>
            </div>

            {/* Matches */}
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
              <Zap size={18} style={{ color: ACCENT }} />
              <div style={{ fontWeight: 900, color: TEXT }}>
                {profile.total_matches ?? "—"}
              </div>
              <div style={{ color: MUTED, fontSize: 13 }}>matches</div>
            </div>

            {/* Leetify rating */}
            {/* Leetify rating */}
            {(() => {
              let ratingColor = TEXT; // default
              if (leetRating <= -1.5) {
                ratingColor = "#ef4444"; // deep red
              } else if (leetRating <= -0.5) {
                ratingColor = "#f97316"; // orange
              } else if (leetRating <= 0.5) {
                ratingColor = "#eab308"; // yellow
              } else if (leetRating <= 1.5) {
                ratingColor = "#86efac"; // light green
              } else {
                ratingColor = "#22c55e"; // full green
              }

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
                              ? (leetRating > 0 ? `+${leetRating.toFixed(2)}` : leetRating.toFixed(2))
                              : leetRating
                          }
                      </div>

                      <div style={{color: MUTED, fontSize: 13}}>leetify</div>
                  </div>
              );
            })()}


              {/* Aim */}
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
                  <Crosshair size={18} style={{ color: "#f87171" }} />
                  <div style={{ fontWeight: 900, color: TEXT }}>
                    {profile.rating.aim.toFixed(1)}
                  </div>
                  <div style={{ color: MUTED, fontSize: 13 }}>aim</div>
                </div>
            )}
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
                  <Crosshair size={18} style={{ color: "#f87171" }} />
                  <div style={{ fontWeight: 900, color: TEXT }}>
                    {profile.rating.positioning.toFixed(1)}
                  </div>
                  <div style={{ color: MUTED, fontSize: 13 }}>positioning</div>
                </div>
            )}
          </div>



          {/* Renown / rank + Recent match panel */}
          <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "stretch",
                justifyContent: "space-between",
                flexWrap: "wrap",
                paddingBottom: 12,
                borderBottom: "1px solid rgba(255,255,255,0.05)", // divider under rank panel
              }}
          >
            {/* Renown */}
            <div style={{display: "flex", gap: 12, alignItems: "center"}}>
              <div style={{display: "flex", flexDirection: "column", gap: 10}}>
                {/* Headline */}
                <div
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      letterSpacing: "0.3px",
                      color: TEXT,
                      marginBottom: 2,
                    }}
                >
                  Renown
                </div>

                {/* Rank + values */}
                <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                  <div
                      style={{
                        padding: "8px 14px",
                        borderRadius: 12,
                        background: renownRank
                            ? renownRank.color
                            : "rgba(255,255,255,0.02)",
                        color: renownRank ? "#071827" : TEXT,
                        fontWeight: 900,
                        fontSize: 14,
                        boxShadow: renownRank
                            ? "0 2px 6px rgba(0,0,0,0.15)"
                            : "none",
                      }}
                  >
                    {renownRank ? renownRank.name : "Unranked"}
                  </div>

                  <div style={{display: "flex", flexDirection: "column"}}>
                    <div
                        style={{color: TEXT, fontWeight: 900, fontSize: 16}}
                    >
                      {renown != null ? Number(renown).toLocaleString() : "—"}
                    </div>
                    <div style={{color: MUTED, fontSize: 12}}>
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

                {/* Progress */}
                {renown != null && renownRank && isFinite(renownRank.max) && (
                    <div
                        style={{
                          width: 420,
                          maxWidth: "100%",
                          height: 12,
                          background: "rgba(255,255,255,0.04)",
                          borderRadius: 999,
                        }}
                    >
                      <div
                          style={{
                            width: `${Math.round(renownProgress * 100)}%`,
                            height: "100%",
                            background: renownRank.color,
                            borderRadius: 999,
                            transition: "width 400ms ease",
                          }}
                      />
                    </div>
                )}
                {renown != null && renownRank && !isFinite(renownRank.max) && (
                    <div style={{color: MUTED, fontSize: 12}}>
                      Top tier — keep going!
                    </div>
                )}
              </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: 6}}>
              <div
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    letterSpacing: "0.3px",
                    color: TEXT,
                  }}
              >
                Premier
              </div>
              <div
                  style={{
                    margin: "10px",
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: getPremierColor(profile.ranks.premier), // optional green background
                    color: `rgba(0, 0, 0, 0.5)`,
                    fontSize: 20,
                    fontWeight: 900,
                    textAlign: "center",
                    minWidth: 80,
                  }}
              >
                {profile.ranks.premier}
              </div>
            </div>

            {/* Recent match */}
            <div
                style={{
                  minWidth: 220,
                  borderLeft: "1px solid rgba(255,255,255,0.05)", // divider between renown + recent
                  paddingLeft: 14,
                }}
            >
              <div style={{color: MUTED, fontSize: 12}}>Latest match</div>
              {recent ? (
                  <div
                      style={{
                        marginTop: 8,
                        background: CARD_ALT,
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
                          <div style={{color: TEXT, fontWeight: 800}}>
                              {recent.map_name ?? "—"}
                          </div>
                          <div
                              style={{
                                  color: recent.outcome === "win"
                                      ? "#16a34a"       // green for win
                                      : recent.outcome === "tie"
                                          ? "#9ca3af"     // grey for tie
                                          : "#ef4444",    // red for loss
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
                  <div style={{marginTop: 8, color: MUTED}}>No recent matches</div>
              )}
            </div>
          </div>

          {/* bottom note */}
          <div
              style={{
                color: MUTED,
                fontSize: 12,
                marginTop: 6,
                paddingTop: 10,
              }}
          >
            Data updated from Leetify ·{" "}
            <a
                href="https://leetify.com"
                target="_blank"
                rel="noreferrer"
                style={{color: ACCENT}}
            >
              View on Leetify
            </a>
          </div>
        </div>
      </article>
  );


}

/* Sparkline component (small inline SVG) */
function Sparkline({data = [], color = ACCENT, width = 200, height = 44}) {
  if (!data || !data.length) return (
      <div style={{width, height, background: "rgba(255,255,255,0.02)", borderRadius: 8}}/>
  );

  const padding = 6;
  const plotW = width - padding * 2;
  const plotH = height - padding * 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = data.length > 1 ? plotW / (data.length - 1) : 0;

  const points = data.map((v, i) => {
    const x = padding + i * step;
    const y = padding + (plotH - ((v - min) / range) * plotH);
    return {x, y, v};
  });

  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `${padding + 0},${padding + plotH} ${pointsStr} ${padding + plotW},${padding + plotH}`;

  return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg"
           preserveAspectRatio="none">
        {/* dark block behind the sparkline (subtle) */}
        <rect x="0" y="0" width={width} height={height} rx="8" ry="8" fill="rgba(0,0,0,0.18)"/>

        {/* subtle area fill */}
        <polygon points={areaPoints} fill={`${color}18`}/>

        {/* line */}
        <polyline points={pointsStr} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round"
                  strokeLinejoin="round"/>

        {/* small dots */}
        {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={2.4} fill={color}/>
        ))}
      </svg>
  );
}

/* helper UI pieces used in Leetify tile */
function getRenownRank(renown) {
  if (renown == null || isNaN(Number(renown))) return null;
  const n = Number(renown);
  return RENOWN_RANKS.find(r => n >= r.min && n <= r.max) || null;
}

function renownProgressInTier(renown) {
  // returns 0..1 progress inside current tier (for infinite top tier => 1)
  const rank = getRenownRank(renown);
  if (!rank) return 0;
  if (!isFinite(rank.max)) return 1;
  const n = Number(renown);
  const span = rank.max - rank.min + 1;
  const progress = (n - rank.min) / span;
  return Math.max(0, Math.min(1, progress));
}

function Badge({ icon, label, style }) {
  return (
      <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 10px",
            borderRadius: 999,
            background: "rgba(139,92,246,0.06)",
            border: "1px solid transparent",
            ...style,
          }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
        <div style={{ color: TEXT, fontWeight: 700, fontSize: 13 }}>{label}</div>
      </div>
  );
}

function MiniStat({ label, value }) {
  return (
      <div style={{ background: CARD_ALT, padding: 10, borderRadius: 10, minWidth: 110 }}>
        <div style={{ color: MUTED, fontSize: 12 }}>{label}</div>
        <div style={{ color: TEXT, fontWeight: 800, marginTop: 6 }}>{value}</div>
      </div>
  );
}

function formatNumber(n) {
  if (n == null || n === undefined) return "—";
  if (typeof n === "number") return Number.isInteger(n) ? n : n.toFixed(1);
  return n;
}

function Experience({ role, place, period, desc }) {
  return (
      <div style={{ padding: 12, borderRadius: 10, background: CARD_ALT }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ color: TEXT, fontWeight: 700 }}>{role}</div>
            <div style={{ color: MUTED, fontSize: 13 }}>{place}</div>
          </div>
          <div style={{ color: MUTED, fontSize: 13 }}>{period}</div>
        </div>
        <div style={{ marginTop: 8, color: MUTED, fontSize: 13 }}>{desc}</div>
      </div>
  );
}

/* styles (unchanged except projectsGrid min width) */
const styles = {
  page: {
    background: BG,
    minHeight: "100vh",
    padding: 28,
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto",
    color: TEXT,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  container: {
    width: "100%",
    maxWidth: 1100,
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  heroLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  name: {
    margin: 0,
    fontSize: 24,
    fontWeight: 800,
    color: TEXT,
  },
  tagline: {
    margin: "6px 0",
    color: MUTED,
  },
  location: {
    margin: 0,
    color: MUTED,
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
  },
  socialsRow: {
    display: "flex",
    gap: 8,
  },
  contactsTop: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "nowrap",
    justifyContent: "flex-end",
    overflowX: "auto",
  },
  contactTopBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 8,
    background: CARD,
    color: TEXT,
    textDecoration: "none",
    border: `1px solid rgba(255,255,255,0.02)`,
    fontWeight: 700,
    fontSize: 12,
    whiteSpace: "nowrap",
  },
  card: {
    padding: 16,
    borderRadius: 14,
    background: CARD,
    border: `1px solid rgba(255,255,255,0.02)`,
  },
  sectionTitle: {
    margin: "0 0 12px 0",
    color: TEXT,
    fontSize: 18,
  },
  text: {
    color: MUTED,
    lineHeight: 1.5,
  },
  ctaPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    background: ACCENT,
    color: "white",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 700,
  },
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 12,
  },
  projectCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    background: CARD_ALT,
    textDecoration: "none",
    color: TEXT,
    alignItems: "center",
    transition: "transform 160ms ease, box-shadow 160ms ease",
    minHeight: 140,
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  videoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderRadius: 10,
    background: CARD_ALT,
    textDecoration: "none",
    color: TEXT,
  },
  linkInline: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: ACCENT,
    textDecoration: "none",
    fontWeight: 700,
  },
  streamRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    background: CARD_ALT,
  },
  blogRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    textDecoration: "none",
    color: TEXT,
    background: CARD_ALT,
    marginBottom: 8,
  },
  skillPill: {
    padding: "8px 10px",
    borderRadius: 999,
    background: "rgba(139,92,246,0.06)",
    color: MUTED,
    fontWeight: 700,
    fontSize: 13,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.02)",
    color: "inherit",
    textDecoration: "none",
  },
  footer: {
    marginTop: 8,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: MUTED,
    fontSize: 13,
  },
  footerIcon: {
    color: MUTED,
    textDecoration: "none",
  },
};

export default App;
