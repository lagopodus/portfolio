import React from "react";
import { motion } from "framer-motion";

export default function YouTubeCard() {
    const videos = [
        { id: "IMXX7rM4kaw", title: "Drachenlord vs. Regenbogenschaf XXL" },
        { id: "sIjkkXX29Ss", title: "Top 10 Spongebob Hintergrund Fische" },
        { id: "BRlyeKBjaaw", title: "Das Drachengame vs. Bibelchannel" },
    ];

    return (
   <div>
            <h2 className="card-title gradient-text">Recommended Videos</h2>
            <div className="video-row">
                {videos.map((video) => (
                    <motion.div
                        key={video.id}
                        className="video-item"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                        <iframe
                            src={`https://www.youtube.com/embed/${video.id}`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <p>{video.title}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
