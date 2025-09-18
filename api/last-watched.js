export default async function handler(req, res) {
    try {
        const response = await fetch(
            "https://api.trakt.tv/users/<YOUR_TRAKT_USERNAME>/history?limit=1",
            {
                headers: {
                    "Content-Type": "application/json",
                    "trakt-api-version": "2",
                    "trakt-api-key": process.env.TRAKT_API_KEY,
                },
            }
        );

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch from Trakt" });
        }

        const data = await response.json();
        res.status(200).json(data[0]); // send the last watched item only
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
