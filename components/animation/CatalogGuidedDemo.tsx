"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Play, Pause, Search, X, ListMusic } from "lucide-react";

function GenreTag({
    children,
    tone = "light",
}: {
    children: React.ReactNode;
    tone?: "light" | "dark";
}) {
    const base = "inline-flex items-center rounded-full px-3 py-1 text-[14px] font-semibold";
    const style = tone === "dark" ? "bg-black text-white" : "bg-slate-100 text-slate-800";
    return <span className={`${base} ${style}`}>{children}</span>;
}

export default function Row2CatalogDemo({
    autoRun = true,
    loop = true,
    className = "",
}: {
    autoRun?: boolean;
    loop?: boolean;
    className?: string;
}) {
    const [openAll, setOpenAll] = useState(false);
    const [query, setQuery] = useState("");
    const [isPlaying, setIsPlaying] = useState(false);

    const runningRef = useRef(false);
    const aliveRef = useRef(true);

    const listControls = useAnimation();
    const haloControls = useAnimation();

    const haloRef = useRef<HTMLDivElement | null>(null);
    const firstRowRef = useRef<HTMLDivElement | null>(null);
    const viewAllBtnRef = useRef<HTMLButtonElement | null>(null);
    const searchRef = useRef<HTMLInputElement | null>(null);

    const D = { catalogNudge: 1.1, catalogPulse: 1.0, playerHold: 1.4, openDelay: 0.65, typePerChar: 0.11, cyclePause: 1.2 };

    useEffect(() => {
        aliveRef.current = true;
        if (autoRun) runLoop();
        return () => {
            aliveRef.current = false;
        };
    }, []);

    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    async function pulseEl(el: HTMLElement | null, pad = 8, duration = D.catalogPulse) {
        if (!el || !haloRef.current) return;
        const r = el.getBoundingClientRect();
        const halo = haloRef.current!;
        halo.style.left = `${r.left + window.scrollX - pad}px`;
        halo.style.top = `${r.top + window.scrollY - pad}px`;
        halo.style.width = `${r.width + pad * 2}px`;
        halo.style.height = `${r.height + pad * 2}px`;
        await haloControls.start({
            opacity: [0, 1, 1, 0],
            boxShadow: [
                "0 0 0 0 rgba(139,92,246,0.00)",
                "0 0 0 10px rgba(139,92,246,0.35)",
                "0 0 0 10px rgba(139,92,246,0.35)",
                "0 0 0 0 rgba(139,92,246,0.00)",
            ],
            transition: { duration, ease: "easeInOut" },
        });
    }

    async function runOnce() {
        runningRef.current = true;
        setOpenAll(false);
        setQuery("");
        setIsPlaying(false);

        await listControls.start({ y: [0, -18, 0], transition: { duration: D.catalogNudge, ease: "easeInOut" } });
        await pulseEl(firstRowRef.current);

        setIsPlaying(true);
        await wait(D.playerHold * 1000);

        await pulseEl(viewAllBtnRef.current, 8, 0.8);
        setOpenAll(true);
        await wait(D.openDelay * 1000);

        await pulseEl(searchRef.current, 8, 0.8);
        setQuery("");
        for (const ch of "DEAR HANNA") {
            setQuery((p) => p + ch);
            await wait(D.typePerChar * 1000);
        }

        runningRef.current = false;
    }

    async function runLoop() {
        while (aliveRef.current) {
            if (!runningRef.current) {
                await runOnce();
                if (!aliveRef.current) break;
                await wait(D.cyclePause * 1000);
            } else {
                await wait(200);
            }
            if (!loop) break;
        }
    }

    return (
        <div className={`relative h-full w-full bg-white rounded-xl shadow-sm ring-1 ring-black/10 overflow-hidden ${className}`}>
            <div className="h-10 px-3 flex items-center justify-between bg-white/90 backdrop-blur border-b">
                <div className="font-semibold tracking-wide text-slate-800 flex items-center gap-2">
                    <span className="text-slate-600">VIOLA</span>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 top-10 grid grid-cols-12">
                <div className="hidden md:block col-span-4 p-3 space-y-3 bg-slate-50 border-r">
                    <div className="h-28 rounded-xl bg-white shadow-inner" />
                    <div className="h-40 rounded-xl bg-white shadow-inner" />
                </div>
                <div className="col-span-12 md:col-span-8 p-3">
                    <div className="h-full rounded-xl bg-white ring-1 ring-black/5 overflow-hidden">
                        <div className="h-9 px-3 flex items-center justify-between border-b">
                            <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <ListMusic className="w-4 h-4" /> Catalog
                            </div>
                            <button
                                ref={viewAllBtnRef}
                                className="text-[12px] px-3 py-1 rounded-md bg-white shadow-sm ring-1 ring-black/10 hover:bg-slate-50"
                            >
                                View All
                            </button>
                        </div>
                        <div className="relative h-[calc(100%-2.25rem)] overflow-hidden">
                            <motion.div animate={listControls} className="absolute inset-x-0 top-0 space-y-2 p-3">
                                {["DEAR HANNA", "Endless Sky (feat. JT)", "JOHN WICK", "UP THE SCORE"].map((title, i) => (
                                    <div
                                        key={i}
                                        ref={i === 0 ? firstRowRef : undefined}
                                        className={`flex items-center gap-3 rounded-lg border p-3 bg-white ${i === 0 ? "ring-2 ring-violet-300" : ""}`}
                                    >
                                        <img src="/assets/heresi.jpg" alt="thumb" className="w-10 h-10 rounded object-cover ring-1 ring-black/10" />
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-slate-800 truncate">{title}</div>
                                            <div className="text-[11px] text-slate-500">Producer • Heresi</div>
                                            <div className="mt-2 flex gap-2">
                                                <GenreTag tone="light">Hip Hop</GenreTag>
                                                <GenreTag tone="dark">Upbeat Pop</GenreTag>
                                            </div>
                                        </div>
                                        <span className="text-xs text-violet-700 font-medium select-none">Play</span>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isPlaying && (
                    <motion.div
                        initial={{ y: 90, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 90, opacity: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="absolute left-0 right-0 bottom-0 z-[50] h-16 bg-white/95 backdrop-blur border-t flex items-center px-4 gap-3"
                    >
                        <img src="/assets/heresi.jpg" alt="thumb" className="w-8 h-8 rounded object-cover ring-1 ring-black/10" />
                        <div className="mr-auto">
                            <div className="text-[12px] font-medium text-slate-800">DEAR HANNA</div>
                            <div className="text-[11px] text-slate-500">Heresi • Hip Hop</div>
                        </div>
                        <button className="p-2 rounded hover:bg-slate-100">
                            <Play className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded hover:bg-slate-100">
                            <Pause className="w-4 h-4" />
                        </button>
                        <div className="mx-3 w-[32%]">
                            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                    key={Number(isPlaying)}
                                    initial={{ width: "0%" }}
                                    animate={{ width: "60%" }}
                                    transition={{ duration: 2.8, ease: "linear" }}
                                    className="h-full bg-violet-500"
                                />
                            </div>
                            <div className="text-[10px] text-slate-500 mt-1 text-center">0:03 — 3:15</div>
                        </div>
                        <div className="w-24">
                            <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full w-[70%] bg-violet-500" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {openAll && (
                    <motion.div
                        className="absolute inset-0 z-[60] bg-black/25 backdrop-blur-[2px] flex items-start justify-end p-4 md:p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ x: 20, opacity: 0, scale: 0.98 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: 10, opacity: 0, scale: 0.99 }}
                            transition={{ type: "spring", stiffness: 260, damping: 22 }}
                            className="w-[360px] max-h-[68vh] rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 overflow-hidden flex flex-col"
                        >
                            <div className="p-4 border-b flex items-center justify-between">
                                <div className="text-sm font-semibold">All Demos</div>
                                <button onClick={() => setOpenAll(false)} className="p-1 rounded hover:bg-slate-100">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="sticky top-0 z-10 bg-white p-4 border-b">
                                <div className="flex items-center gap-2 border-2 border-violet-300 rounded-lg px-3 py-2">
                                    <Search className="w-4 h-4 text-violet-500" />
                                    <input
                                        ref={searchRef}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search by title, producer, genre, mood…"
                                        className="flex-1 outline-none text-sm"
                                    />
                                </div>
                            </div>
                            <div className="p-4 space-y-2 overflow-auto">
                                {SEARCH_RESULTS(query).map((t) => (
                                    <div
                                        key={t}
                                        className={`flex items-center gap-3 rounded-lg border p-3 bg-white ${t === "DEAR HANNA" && query.trim() ? "ring-2 ring-violet-300" : ""
                                            }`}
                                    >
                                        <img src="/assets/heresi.jpg" alt="thumb" className="w-10 h-10 rounded object-cover ring-1 ring-black/10" />
                                        <div className="flex-1">
                                            <div className="text-sm font-semibold text-slate-800">{t}</div>
                                            <div className="text-[11px] text-slate-500">Producer • Heresi</div>
                                            <div className="mt-2 flex gap-2">
                                                <GenreTag tone="light">Hip Hop</GenreTag>
                                                <GenreTag tone="dark">Upbeat Pop</GenreTag>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t flex justify-end">
                                <button
                                    onClick={() => setOpenAll(false)}
                                    className="text-sm px-3 py-1.5 rounded-md bg-white shadow-sm ring-1 ring-black/10 hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div ref={haloRef} animate={haloControls} className="fixed z-50 pointer-events-none rounded-2xl border-2 border-transparent" />
        </div>
    );
}

function SEARCH_RESULTS(q: string) {
    const base = ["DEAR HANNA", "Endless Sky (feat. JT)", "JOHN WICK", "UP THE SCORE"];
    const s = q.trim().toLowerCase();
    if (!s) return base;
    return base.filter((t) => t.toLowerCase().includes(s));
}
