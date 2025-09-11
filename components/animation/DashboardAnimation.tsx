'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function DashboardAnimation() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = videoRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => {
            setVisible(entry.isIntersecting);
            if (entry.isIntersecting) {
                el.play().catch(() => { });
            } else {
                el.pause();
            }
        }, { threshold: 0.25 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div className="w-full aspect-video overflow-hidden bg-white rounded-xl ring-1 ring-black/10 shadow-xl">
            <video
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
                muted
                loop
                autoPlay
                preload="metadata"
            >
                <source src="/dashboarddemo.mp4" type="video/mp4" />
            </video>
        </div>
    );
}
