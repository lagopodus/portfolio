import React, { useEffect, useState } from "react";

function LeetifyProfile() {
    const [profile, setProfile] = useState(null);
    const steamId = "76561199146483679"; // your steam64 id

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch(
                    `https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${steamId}`
                );
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchProfile();
    }, [steamId]);

    if (!profile) return <p>Loading Leetify stats…</p>;

    return (
        <div style={styles.card}>
            <h2>{profile.name} (Leetify)</h2>
            <p>Total Matches: {profile.total_matches}</p>
            <p>Winrate: {(profile.winrate * 100).toFixed(2)}%</p>
            <p>Leetify Rating: {profile.ranks.leetify}</p>
            <p>Faceit Rank: {profile.ranks.faceit}</p>
            <p>Premier: {profile.ranks.premier}</p>
        </div>
    );
}

const styles = {
    card: {
        background: "#1f2937",
        color: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
        textAlign: "left",
    },
};

export default LeetifyProfile;
