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
const aboutTexts = [
  {
    quote: "„Ich fahr nicht gerne Motorrad, weil es cool ist, ich fahr gerne Motorrad, weil ich es gerne fahr. Basta. Abgesehen davon, fahr ich kein Motorrad.“",
    author: "Rainer Winkler"
  },
  {
    quote: "„Meddler sind wesentlich stärker als billiche, kleine Kaggnadsis.g“",
    author: "Meddl Lord"
  },
  {
    quote: "„Ich bin ned der Drache ferdammde Aggsd!“",
    author: "Der Drache"
  },
  {
    quote: "„Ich bin alleine wie das Mammut... aber... es ist völlig irrelevant, denn, ob ihr 5 Menschen seid oder " +
        "100 oder 1.000 oder 10.000, 100.000 oder Millionen. das Mammut hier steht noch.“",
    author: "Mammut Lord"
  },
  {
    quote: "„Das is mein Ferd der Blu.“",
    author: "Rainer"
  },
  {
    quote: "„Blu gehört mir ned, hat mir noch nie gehört. Das war noch nie mein Ferd.“",
    author: "Rainer"
  },
  {
    quote: "„So jetzt habt ihr richtig Scheiße am Arsch. Die ham jetz hier n Großalarm bei mir ausgerufne, etzala fliegt ihr raus.“",
    author: "Drachenlord"
  }

];


const projects = [
  {
    title: "Grow Green",
    desc: "GrowGreen is a 2D gardening game made with Godot, featuring virtual plant care and fun mini-games.",
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
  {
    title: "Domi",
    link: "https://github.com/AuriomTex",
  }
];


/* ---------- App ---------- */

function App() {
  const [aboutText, setAboutText] = useState(null);

  useEffect(() => {
    const random = aboutTexts[Math.floor(Math.random() * aboutTexts.length)];
    setAboutText(random);
  }, []);
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
              <div style={{marginLeft: 14}}>
                <h1 style={styles.name}>
                  Josh <span style={{color: ACCENT}}>lagopodus</span>
                </h1>
                <p style={styles.tagline}>Counter Strike • Computer Scienece • Car Stuff</p>
                <p style={styles.location}>
                  <MapPin size={14} style={{marginRight: 8}}/> Berlin
                </p>
              </div>
            </div>
            <div style={styles.contactsTop}>
              <a
                  style={styles.contactTopBtn}
                  href="https://github.com/lagopodus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
              >
                <Github size={16}/> <span style={{marginLeft: 8}}>GitHub</span>
              </a>

              <a
                  style={styles.contactTopBtn}
                  href="https://www.linkedin.com/in/josh-tischer-80b891349/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
              >
                <Linkedin size={16}/> <span style={{marginLeft: 8}}>LinkedIn</span>
              </a>

              <a
                  style={styles.contactTopBtn}
                  href="https://www.youtube.com/@lagopodus_"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
              >
                <Youtube size={16}/> <span style={{marginLeft: 8}}>YouTube</span>
              </a>

              <a
                  style={styles.contactTopBtn}
                  href="https://www.twitch.tv/lagopodus"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitch"
              >
                <Twitch size={16}/> <span style={{marginLeft: 8}}>Twitch</span>
              </a>

              <a
                  style={styles.contactTopBtn}
                  href="https://twitter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
              >
                <Twitter size={16}/> <span style={{marginLeft: 8}}>Twitter</span>
              </a>
            </div>
          </section>
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
              <div style={{flex: 1, minWidth: 280}}>
                <h2 style={styles.sectionTitle}>About</h2>
                {aboutText && (
                    <p style={styles.text}>
                      <i>{aboutText.quote}<br/></i>
                      <b>- {aboutText.author}</b>
                    </p>
                )}
              </div>


              <div style={{width: 320, minWidth: 260}}>
                <h3 style={{...styles.sectionTitle, marginBottom: 10}}>Quick stats</h3>
                <div style={{display: "flex", gap: 10, flexWrap: "wrap"}}>
                  <Stat title="Hours played" value="2000+" icon={<Clock size={16}/>}/>
                  <Stat title="Inventory worth" value="~3000$" icon={<CircleDollarSign size={16}/>}/>
                </div>
              </div>
            </div>
          </section>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>My Projects</h2>
            <div style={styles.projectsGrid}>
              {projects.map((p) => (
                  <a key={p.title} href={p.link} target="_blank" rel="noopener noreferrer"
                     style={styles.projectCard}>
                    <div style={{display: "flex", alignItems: "center", gap: 12}}>
                      <Code size={18} style={{color: ACCENT}}/>
                      <div>
                        <div style={{color: TEXT, fontWeight: 700}}>{p.title}</div>
                        <div style={{color: MUTED, fontSize: 13}}>{p.desc}</div>
                      </div>
                    </div>
                    <ExternalLink size={14} style={{color: MUTED}}/>
                  </a>
              ))}
              <div style={{marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap"}}>
                <a
                    href="https://github.com/lagopodus"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.ctaPrimary}
                >
                  <Github size={14}/> <span style={{marginLeft: 8}}>View GitHub</span>
                </a>
              </div>
            </div>
          </section>
          <section style={styles.card}>
            <h2 style={styles.sectionTitle}>Gaming Stats</h2>
            <div style={styles.projectsGrid}>
              <LeetifyCard/>
            </div>
          </section>
          <section style={styles.gridTwo}>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>Friends</h2>
              <div style={{display: "grid", gap: 10}}>
                {videos.map((v) => (
                    <a key={v.title} href={v.link} target="_blank" rel="noopener noreferrer"
                       style={styles.videoRow}>
                      <CircleUserRound size={18} style={{color: ACCENT}}/>
                      <div style={{marginLeft: 10}}>
                        <div style={{color: TEXT, fontWeight: 600}}>{v.title}</div>
                        <div style={{color: MUTED, fontSize: 13}}>Click!!</div>
                      </div>
                    </a>
                ))}
              </div>
            </div>

            <LatestYouTube/>
          </section>

          <section style={styles.card}>
            <div style={{display: "flex", gap: 18, flexWrap: "wrap"}}>
              <div style={{flex: 1, minWidth: 260}}>
                <h2 style={styles.sectionTitle}>Favourite Games</h2>
                <div style={{display: "flex", gap: 8, flexWrap: "wrap"}}>
                  {[
                    {
                      name: "Counter Strike 2",
                      url: "https://store.steampowered.com/app/730/CounterStrike_Global_Offensive/"
                    },
                    {
                      name: "Elden Ring",
                      surl: "https://store.steampowered.com/app/1245620/ELDEN_RING/"},
                    {
                      name: "Dark Souls",
                      url: "https://store.steampowered.com/app/570940/DARK_SOULS_REMASTERED/"
                    },
                    {
                      name: "Hollow Knight",
                      url: "https://store.steampowered.com/app/367520/Hollow_Knight/"
                    },
                    {
                      name: "Hearthstone",
                      url: "https://hearthstone.blizzard.com/"
                    },
                    {
                      name: "The Witcher III",
                      url: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/"
                    },
                    {
                      name: "Remnant: From the Ashes",
                      url: "https://store.steampowered.com/app/617290/Remnant_From_the_Ashes/"
                    },
                  ].map((game) => (
                      <a
                          key={game.name}
                          href={game.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{...styles.skillPill, textDecoration: "none", display: "inline-block"}}
                      >
                        {game.name}
                      </a>
                  ))}
                </div>
              </div>
            </div>
          </section>


          <footer style={styles.footer}>
            <div>Built with React</div>
            <div style={{color: MUTED, fontSize: 13}}>© {new Date().getFullYear()} Josh</div>
          </footer>
        </main>
      </div>
  );
}

/* small subcomponents */
function LatestYouTube() {
  const [videos, setVideos] = React.useState([]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch(
            "https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCwXnuUrX5WpWTWJhgoRRJcQ"
        );
        const data = await res.json();
        console.log("YouTube RSS feed:", data); // 👈 debug
        setVideos(data.items.slice(0, 2)); // take latest 5
      } catch (err) {
        console.error("Failed to fetch YouTube feed", err);
      }
    }

    fetchVideos();
  }, []);

  return (
      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Latest YouTube videos</h2>
        <div style={{display: "flex", flexDirection: "column", gap: 12}}>
          {videos.map((v) => (
              <a
                  key={v.guid}
                  href={v.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
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
                  <div style={{ color: TEXT, fontWeight: 700, fontSize: 14 }}>
                    {v.title}
                  </div>
                  <div style={{ color: MUTED, fontSize: 12 }}>
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
            style={{ ...styles.linkInline, marginTop: 12 }}
        >
          <Youtube size={14} />{" "}
          <span style={{ marginLeft: 8 }}>Visit YouTube channel</span>
        </a>
      </div>
  );
}

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
  const renown = profile.ranks?.renown ?? null;
  const recentMatches = Array.isArray(profile.recent_matches) ? profile.recent_matches : [];
  const recent = recentMatches.length ? recentMatches[0] : null;


  // renown rank
  const renownRank = getRenownRank(renown);
  const renownProgress = renown != null && renownRank ? renownProgressInTier(renown) : 0;

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
            Data updated from {" "}
            <a
                href="https://leetify.com"
                target="_blank"
                rel="noreferrer"
                style={{color: ACCENT}}
            >
              Leetify            </a>
          </div>
        </div>
      </article>
  );


}

function getRenownRank(renown) {
  if (renown == null || isNaN(Number(renown))) return null;
  const n = Number(renown);
  return RENOWN_RANKS.find(r => n >= r.min && n <= r.max) || null;
}

function renownProgressInTier(renown) {
  const rank = getRenownRank(renown);
  if (!rank) return 0;
  if (!isFinite(rank.max)) return 1;
  const n = Number(renown);
  const span = rank.max - rank.min + 1;
  const progress = (n - rank.min) / span;
  return Math.max(0, Math.min(1, progress));
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
