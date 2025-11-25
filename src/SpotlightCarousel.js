import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const SpotlightCarousel = ({ items = [], interval = 5200 }) => {
    const [index, setIndex] = useState(0);
    const pauseRef = useRef(false);
    const touchStartX = useRef(null);

    useEffect(() => {
        if (!items.length) return;

        const id = setInterval(() => {
            if (!pauseRef.current) {
                setIndex((prev) => (prev + 1) % items.length);
            }
        }, interval);

        return () => clearInterval(id);
    }, [items.length, interval]);

    const handlePrev = () => {
        setIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const handleNext = () => {
        setIndex((prev) => (prev + 1) % items.length);
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(deltaX) > 30) {
            if (deltaX > 0) handlePrev();
            else handleNext();
        }
        touchStartX.current = null;
    };

    if (!items.length) return null;

    return (
        <div
            className="spotlight-carousel"
            onMouseEnter={() => { pauseRef.current = true; }}
            onMouseLeave={() => { pauseRef.current = false; }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <button className="spotlight-nav prev" onClick={handlePrev} aria-label="Previous spotlight">
                <ChevronLeft size={18} />
            </button>

            <div className="spotlight-window">
                <div
                    className="spotlight-track"
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {items.map((item, i) => (
                        <div className="spotlight-slide" key={item.title + i}>
                            <div className="spotlight-header">
                                <div className="spotlight-badge">
                                    {item.icon && <span className="spotlight-icon">{item.icon}</span>}
                                    <span>{item.tag}</span>
                                </div>
                                <div className="spotlight-position">{i + 1} / {items.length}</div>
                            </div>
                            <h3 className="spotlight-title">{item.title}</h3>
                            <p className="spotlight-description">{item.description}</p>
                            <a className="spotlight-cta" href={item.link} target="_blank" rel="noreferrer">
                                {item.cta}
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            <button className="spotlight-nav next" onClick={handleNext} aria-label="Next spotlight">
                <ChevronRight size={18} />
            </button>

            <div className="spotlight-dots">
                {items.map((_, i) => (
                    <button
                        key={i}
                        className={`spotlight-dot ${i === index ? "active" : ""}`}
                        onClick={() => setIndex(i)}
                        aria-label={`Go to spotlight ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SpotlightCarousel;
