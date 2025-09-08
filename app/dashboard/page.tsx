'use client';

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge, Button } from "@/components/ui";
import { Users, Calendar, Workflow, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import Link from "next/link";
import { UserProfile } from '@/types/profile';
import { useAuth } from "@clerk/nextjs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

/* =====================================================================================
 * LOGIN & PROFILE (Clerk + Supabase Storage: profileimages)
 * ===================================================================================== */

const BUCKET_PROFILE = "profileimages";

async function findLatestAvatarPath(userId: string) {
    const folder = userId;
    const { data } = await supabase.storage.from(BUCKET_PROFILE).list(folder, {
        limit: 50,
        sortBy: { column: "updated_at", order: "desc" },
    });
    if (!data?.length) return undefined;
    return `${folder}/${data[0].name}`;
}

async function getAvatarSignedUrl(path?: string | null, ttlSec = 60 * 60 * 24) {
    if (!path) return undefined;
    const { data, error } = await supabase.storage
        .from(BUCKET_PROFILE)
        .createSignedUrl(path, ttlSec);
    if (error || !data?.signedUrl) return undefined;
    return `${data.signedUrl}${data.signedUrl.includes("?") ? "&" : "?"}v=${Date.now()}`;
}

/* =====================================================================================
 * DEMOS (public.demos + Storage buckets: demos_covers, demos_audio)
 * ===================================================================================== */

const DEMO_COVER_BUCKET = "demos_covers";
const DEMO_AUDIO_BUCKET = "demos_audio";

type DemoRow = {
    id: string;
    title: string;
    producer: string | null;
    genre: string | null;
    mood: string | null;
    cover_path: string | null;
    audio_path: string | null;
    owner_id: string | null;
    created_at: string;
};

async function getSignedUrlFromPath(bucket: string, path?: string | null, ttlSec = 60 * 60 * 24) {
    if (!path) return undefined;
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, ttlSec);
    if (error || !data?.signedUrl) return undefined;
    return `${data.signedUrl}${data.signedUrl.includes("?") ? "&" : "?"}v=${Date.now()}`;
}

function fmtTime(sec: number) {
    if (!isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function stopAndDisposeAudio(el?: HTMLAudioElement | null) {
    if (!el) return;
    try {
        el.pause();
        el.removeAttribute("src");
        el.load();
    } catch { }
}

/* =====================================================================================
 * Catalog List Item
 * ===================================================================================== */
function DemoRowItem({
    demo,
    coverUrl,
    onPlay,
}: {
    demo: DemoRow;
    coverUrl?: string;
    onPlay: (demo: DemoRow) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onPlay(demo)}
            className="group grid grid-cols-[56px_1fr_auto] gap-3 items-center w-full text-left
                 rounded-lg border border-transparent px-2.5 py-2
                 hover:bg-neutral-50 hover:border-violet-300 transition-colors"
        >
            <img
                src={coverUrl || "/assets/defmusimg.jpg"}
                alt={`${demo.title} cover`}
                className="h-14 w-14 rounded-md object-cover shadow-sm"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/assets/defmusimg.jpg"; }}
            />

            <div className="flex flex-col min-w-0">
                <div className="truncate font-medium text-neutral-900">{demo.title}</div>
                <div className="text-xs text-neutral-500">Producer • {demo.producer || "Unknown"}</div>
                <div className="mt-1 flex flex-wrap gap-1.5">
                    {demo.genre && <Badge variant="secondary" className="h-5 px-2 text-[11px]">{demo.genre}</Badge>}
                    {demo.mood && <Badge className="h-5 px-2 text-[11px]">{demo.mood}</Badge>}
                </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-violet-700 font-semibold pr-1">
                Play
            </div>
        </button>
    );
}

function DemoRowWithSignedCover({
    demo,
    onPlay,
}: {
    demo: DemoRow;
    onPlay: (demo: DemoRow) => void;
}) {
    const [coverUrl, setCoverUrl] = useState<string | undefined>();
    useEffect(() => {
        (async () => {
            const url = await getSignedUrlFromPath(DEMO_COVER_BUCKET, demo.cover_path);
            setCoverUrl(url);
        })();
    }, [demo.cover_path]);
    return <DemoRowItem demo={demo} coverUrl={coverUrl} onPlay={onPlay} />;
}

/* =====================================================================================
 * Player Under the Viola
 * ===================================================================================== */
function PlayerBar({
    track,
    audioUrl,
    onPrev,
    onNext,
    onToggle,
    isPlaying,
    onSeek,
    onVolume,
    currentTime,
    duration,
    volume,
    coverUrl,
}: {
    track: DemoRow | null;
    audioUrl?: string;
    onPrev: () => void;
    onNext: () => void;
    onToggle: () => void;
    isPlaying: boolean;
    onSeek: (sec: number) => void;
    onVolume: (v: number) => void;
    currentTime: number;
    duration: number;
    volume: number;
    coverUrl?: string;
}) {
    if (!track) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur">
            <div className="mx-auto max-w-screen-2xl px-4 py-2 grid grid-cols-12 gap-4 items-center">
                {/* Album Cover + Title */}
                <div className="col-span-12 sm:col-span-4 flex items-center gap-3 min-w-0">
                    <img
                        src={coverUrl || "/assets/defmusimg.jpg"}
                        alt="cover"
                        className="h-12 w-12 rounded-md object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/assets/defmusimg.jpg"; }}
                    />
                    <div className="min-w-0">
                        <div className="truncate font-medium text-sm">{track.title}</div>
                        <div className="text-xs text-neutral-500 truncate">
                            {track.producer || "Unknown"} • {track.genre || "—"}
                        </div>
                    </div>
                </div>

                {/* Control + Progress Bar */}
                <div className="col-span-12 sm:col-span-5 flex flex-col items-center gap-1">
                    <div className="flex items-center gap-4">
                        <button onClick={onPrev} className="p-1.5 rounded hover:bg-neutral-100"><SkipBack className="h-5 w-5" /></button>
                        <button
                            onClick={onToggle}
                            className="p-2 rounded-full border bg-white shadow hover:bg-neutral-50"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                        </button>
                        <button onClick={onNext} className="p-1.5 rounded hover:bg-neutral-100"><SkipForward className="h-5 w-5" /></button>
                    </div>

                    <div className="flex items-center gap-3 w-full">
                        <span className="text-[11px] tabular-nums text-neutral-500 w-10 text-right">{fmtTime(currentTime)}</span>
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            step={0.1}
                            value={Math.min(currentTime, duration || 0)}
                            onChange={(e) => onSeek(parseFloat(e.target.value))}
                            className="w-full accent-violet-600"
                        />
                        <span className="text-[11px] tabular-nums text-neutral-500 w-10">
                            {fmtTime(Math.max((duration || 0) - currentTime, 0))}
                        </span>
                    </div>
                </div>

                {/* Volume*/}
                <div className="col-span-12 sm:col-span-3 flex items-center justify-end gap-2">
                    <Volume2 className="h-4 w-4 text-neutral-600" />
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(e) => onVolume(parseFloat(e.target.value))}
                        className="w-28 accent-violet-600"
                        aria-label="Volume"
                    />
                </div>
            </div>
        </div>
    );
}

/* =====================================================================================
 * DASHBOARD
 * ===================================================================================== */

const Dashboard = () => {
    /* ----- Login/Profile ----- */
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { userId, isLoaded } = useAuth();

    useEffect(() => {
        (async () => {
            if (!isLoaded) return;
            if (!userId) { setUserProfile(null); return; }

            const { data: profileRow, error: profileErr } = await supabase
                .from("profiles")
                .select("id, firstname, lastname")
                .eq("id", userId)
                .maybeSingle();

            if (profileErr || !profileRow) { setUserProfile(null); return; }

            const latestPath = await findLatestAvatarPath(userId);
            const imageUrl = await getAvatarSignedUrl(latestPath);

            setUserProfile({
                ...(profileRow as UserProfile),
                image: imageUrl ?? "/assets/defaultimg.jpg",
            });
        })();
    }, [userId, isLoaded]);

    /* ----- Demos List State ----- */
    const [demos, setDemos] = useState<DemoRow[]>([]);
    const [loadingDemos, setLoadingDemos] = useState(true);

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                setLoadingDemos(true);
                const { data, error } = await supabase
                    .from("demos")
                    .select("id,title,producer,genre,mood,cover_path,audio_path,owner_id,created_at")
                    .order("created_at", { ascending: false })
                    .limit(50);
                if (error) throw error;
                if (!ignore) setDemos(data || []);
            } catch (e) {
                console.error("load demos error", e);
                if (!ignore) setDemos([]);
            } finally {
                if (!ignore) setLoadingDemos(false);
            }
        })();
        return () => { ignore = true; };
    }, []);

    /* ----- Global Player State ----- */
    const [currentIndex, setCurrentIndex] = useState<number>(-1);
    const currentTrack = currentIndex >= 0 ? demos[currentIndex] : null;

    const [audioUrl, setAudioUrl] = useState<string | undefined>();
    const [coverForPlayer, setCoverForPlayer] = useState<string | undefined>();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.9);

    useEffect(() => {
        (async () => {
            if (!currentTrack) return;
            const [aUrl, cUrl] = await Promise.all([
                getSignedUrlFromPath(DEMO_AUDIO_BUCKET, currentTrack.audio_path),
                getSignedUrlFromPath(DEMO_COVER_BUCKET, currentTrack.cover_path),
            ]);
            setAudioUrl(aUrl);
            setCoverForPlayer(cUrl);
            setCurrentTime(0);
            setDuration(0);
            setIsPlaying(true);
        })();
    }, [currentTrack?.id]);

    // 오디오 엘리먼트 생성/바인딩
    useEffect(() => {
        if (!audioRef.current) {
            const el = new Audio();
            audioRef.current = el;
            el.preload = "metadata";
            el.addEventListener("timeupdate", () => setCurrentTime(el.currentTime));
            el.addEventListener("loadedmetadata", () => setDuration(el.duration || 0));
            el.addEventListener("ended", () => handleNext());
            el.volume = volume;
        }
    }, []);

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        if (audioUrl) {
            el.src = audioUrl;
            if (isPlaying) {
                el.play().catch(() => setIsPlaying(false));
            }
        }
    }, [audioUrl]);

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        el.volume = volume;
    }, [volume]);

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        if (isPlaying) el.play().catch(() => setIsPlaying(false));
        else el.pause();
    }, [isPlaying]);

    useEffect(() => {
        return () => {
            stopAndDisposeAudio(audioRef.current);
        };
    }, []);

    useEffect(() => {
        function onVisibility() {
            if (document.hidden) {
                const el = audioRef.current;
                if (el && !el.paused) el.pause();
                setIsPlaying(false);
            }
        }
        document.addEventListener("visibilitychange", onVisibility);
        return () => document.removeEventListener("visibilitychange", onVisibility);
    }, []);

    function handlePlayFromRow(demo: DemoRow) {
        const idx = demos.findIndex(d => d.id === demo.id);
        if (idx >= 0) setCurrentIndex(idx);
    }

    function handleToggle() { setIsPlaying(p => !p); }
    function handleSeek(sec: number) {
        const el = audioRef.current; if (!el) return;
        el.currentTime = sec; setCurrentTime(sec);
    }
    function handleVolume(v: number) { setVolume(v); }

    function handlePrev() {
        if (!demos.length) return;
        setCurrentIndex(i => (i <= 0 ? demos.length - 1 : i - 1));
    }
    function handleNext() {
        if (!demos.length) return;
        setCurrentIndex(i => (i < 0 ? 0 : (i + 1) % demos.length));
    }

    /* ----- Catalog All Vie Modal ----- */
    const [isCatalogOpen, setIsCatalogOpen] = useState(false)
    const [catalogQuery, setCatalogQuery] = useState("")

    /* ----- UI ----- */
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <header className="border-b bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-4xl font-bold">VIOLA.</span>
                        </div>
                    </div>

                    {/* Right Top Profile Card */}
                    <div className="flex items-center space-x-4">
                        <p className="text-base italic font-light text-black">
                            Welcome {userProfile?.firstname}!
                        </p>
                        <Link href={`/profile/${userId}`}>
                            <div className="flex items-center bg-white shadow-sm rounded-full px-3 py-1.5 space-x-3 hover:cursor-pointer hover:opacity-80 transition">
                                <img
                                    src={userProfile?.image || "/assets/defaultimg.jpg"}
                                    alt="Profile"
                                    className="w-11 h-11 rounded-full object-cover shadow-sm"
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/assets/defaultimg.jpg"; }}
                                />
                                <div className="flex flex-col justify-center">
                                    <span className="text-sm font-semibold text-black">
                                        {userProfile?.firstname} {userProfile?.lastname}
                                    </span>
                                    <div className="flex items-center gap-0 -ml-1">
                                        <Badge variant="ar" className="px-2 py-0.5 text-xs rounded-full">A&amp;R</Badge>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Main Content */}
                <main className="flex-1 bg-gray-50 px-4 md:px-6 py-4 md:py-6 overflow-x-hidden">
                    <div className="w-full mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {/* Your Artists */}
                            <Card className="h-full">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center space-x-3">
                                        <Users className="h-5 w-5" />
                                        <span>Your Artists</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="relative p-6 overflow-hidden">
                                    <div className="min-h-[clamp(240px,22vw,300px)]" />
                                    <div className="absolute inset-4 md:inset-6 flex flex-col gap-2">
                                        <Link href="/dashboard/artists" className="block">
                                            <div
                                                className="flex items-center gap-3 min-h-[50px]
                                   rounded-lg border border-neutral-200/80 bg-white/60
                                   px-3 py-2 shadow-sm
                                   hover:bg-neutral-50 hover:border-violet-300 transition-colors
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                                            >
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src="/assets/heresi.jpg" />
                                                    <AvatarFallback>JW</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-neutral-800">Heresi</span>
                                            </div>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Demo Submission */}
                            <Card className="h-full">
                                <CardHeader className="pb-3">
                                    <div className="w-full flex flex-wrap items-center sm:flex-nowrap sm:justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <CardTitle className="flex items-center space-x-3">
                                                <Calendar className="h-5 w-5" />
                                                <span>Demo Submissions</span>
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="relative p-6 overflow-hidden">
                                    <div className="min-h-[clamp(240px,22vw,300px)]" />
                                    <Link
                                        href="/dashboard/ardashboard"
                                        data-tour="go-anr"
                                        className="absolute inset-4 md:inset-6 rounded-xl overflow-hidden
                               flex items-center justify-center
                               bg-[linear-gradient(135deg,_#7C3AED_0%,_#8B5CF6_15%,_#A78BFA_30%,_#C4B5FD_48%,_#E9D5FF_65%,_#FDE68A_100%)]
                               text-white font-semibold tracking-wide
                               ring-1 ring-neutral-300/70 shadow-md
                               transition-all duration-200 hover:shadow-xl hover:brightness-105"
                                    >
                                        <span className="whitespace-nowrap text-lg md:text-2xl lg:text-3xl font-semibold leading-none">
                                            Go to A&amp;R Dashboard
                                        </span>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Catalog */}
                            <Card className="h-full">
                                <CardHeader className="pb-3">
                                    <div className="w-full flex flex-wrap items-center sm:flex-nowrap sm:justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <CardTitle className="flex items-center space-x-3">
                                                <Workflow className="h-5 w-5" />
                                                <span>Catalog</span>
                                            </CardTitle>
                                        </div>

                                        <Dialog open={isCatalogOpen} onOpenChange={setIsCatalogOpen}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" className="ml-auto">
                                                    View All
                                                </Button>
                                            </DialogTrigger>

                                            <DialogContent className="max-w-3xl">
                                                <DialogHeader>
                                                    <DialogTitle>All Demos</DialogTitle>
                                                </DialogHeader>
                                                <div className="mb-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Search by title, producer, genre, mood…"
                                                        value={catalogQuery}
                                                        onChange={(e) => setCatalogQuery(e.target.value)}
                                                        className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-400"
                                                    />
                                                </div>

                                                <div className="max-h-[60vh] overflow-y-auto pr-1">
                                                    {loadingDemos && (
                                                        <div className="text-sm text-neutral-500 px-1 py-2">Loading demos…</div>
                                                    )}

                                                    {!loadingDemos && demos.length > 0 && (
                                                        <div className="space-y-2">
                                                            {(catalogQuery
                                                                ? demos.filter(d => {
                                                                    const q = catalogQuery.toLowerCase();
                                                                    return (
                                                                        d.title.toLowerCase().includes(q) ||
                                                                        (d.producer ?? "").toLowerCase().includes(q) ||
                                                                        (d.genre ?? "").toLowerCase().includes(q) ||
                                                                        (d.mood ?? "").toLowerCase().includes(q)
                                                                    );
                                                                })
                                                                : demos
                                                            ).map((demo) => (
                                                                <DemoRowWithSignedCover
                                                                    key={demo.id}
                                                                    demo={demo}
                                                                    onPlay={(d) => {
                                                                        handlePlayFromRow(d);
                                                                        // 재생과 동시에 모달 닫고 싶다면 주석 해제
                                                                        // setIsCatalogOpen(false);
                                                                    }}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}

                                                    {!loadingDemos && demos.length === 0 && (
                                                        <div className="h-full min-h-[180px] flex items-center justify-center">
                                                            <div className="text-sm text-neutral-500">No demos available.</div>
                                                        </div>
                                                    )}
                                                </div>

                                                <DialogFooter>
                                                    <Button variant="secondary" onClick={() => setIsCatalogOpen(false)}>
                                                        Close
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="h-[clamp(240px,22vw,300px)] overflow-y-auto px-4 pb-3">
                                        {loadingDemos && (
                                            <div className="text-xs text-neutral-500 px-4 py-2">Loading demos…</div>
                                        )}

                                        {!loadingDemos && demos.length > 0 && (
                                            <div className="space-y-2">
                                                {demos.map((demo) => (
                                                    <DemoRowWithSignedCover key={demo.id} demo={demo} onPlay={handlePlayFromRow} />
                                                ))}
                                            </div>
                                        )}

                                        {!loadingDemos && demos.length === 0 && (
                                            <div className="h-full min-h-[180px] flex items-center justify-center">
                                                <div className="text-sm text-neutral-500">
                                                    No demos available.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* VIOLA hero */}
                    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mt-4 select-none">
                        <div className="relative h-[200px] md:h-[300px]">
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,_#7C3AED_0%,_#8B5CF6_15%,_#A78BFA_30%,_#C4B5FD_48%,_#E9D5FF_65%,_#FDE68A_100%)]" />
                            <div className="absolute inset-0 opacity-50 bg-[radial-gradient(1200px_400px_at_80%_120%,rgba(255,255,255,0.5),transparent)]" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span
                                    className="whitespace-nowrap leading-none text-white/60 font-extrabold
                             tracking-[0.28em]
                             text-[clamp(4rem,14vw,18rem)]
                             drop-shadow-[0_3px_14px_rgba(0,0,0,0.28)]">
                                    VIOLA
                                </span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Music Player */}
            <PlayerBar
                track={currentTrack}
                audioUrl={audioUrl}
                onPrev={handlePrev}
                onNext={handleNext}
                onToggle={handleToggle}
                isPlaying={isPlaying}
                onSeek={handleSeek}
                onVolume={handleVolume}
                currentTime={currentTime}
                duration={duration}
                volume={volume}
                coverUrl={coverForPlayer}
            />
        </div>
    );
};

export default Dashboard;
