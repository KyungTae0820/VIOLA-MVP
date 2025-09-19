'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge, Input, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { ArrowLeft, Search, Clock, CheckCircle, XCircle, Filter, User, Music, ChevronRight, ChevronDown, Play, Pause, Download, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

/* ---------------- Utils ---------------- */

const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
const fmtDate = (d?: string | null) => (d ? new Date(d).toISOString().slice(0, 10) : "-");
const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const mmss = (t: number) => {
  if (!isFinite(t) || t < 0) return "00:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${pad(m)}:${pad(s)}`;
};

/* ---------------- Types ---------------- */

interface ARDashboardProps { onBack: () => void; }
type Status = 'pending' | 'approved' | 'rejected';

type Submission = {
  id: string;
  artistName: string;
  trackTitle: string;
  genre: string;
  email: string;
  description: string;
  socialMedia: string;
  submittedAt: string;
  status: Status;
  audioSrc?: string;
  videoSrc?: string;
  coverSrc?: string;
};

type ArtistProfile = {
  artistName: string;
  email: string;
  socialMedia: string;
  submissions: Submission[];
  genres: Set<string>;
  latestSubmission: string;
  statuses: Record<Status, number>;
  age?: number;
  nationality?: string;
  avatar?: string;
};

/* ---------------- Mock Artists (좌측 카드용) ---------------- */

const mockArtists: Array<{
  artistName: string;
  email: string;
  socialMedia: string;
  age?: number;
  nationality?: string;
  avatar?: string;
  genre?: string;
}> = [
    {
      artistName: "Daniel Caesar",
      email: "danielcaesar@email.com",
      socialMedia: "@daniel",
      age: 30,
      nationality: "Canadian",
      avatar: "/assets/daniel.jpg",
      genre: "R&B",
    },
    {
      artistName: "Big Naughty",
      email: "bignaughty@email.com",
      socialMedia: "@bignaughtyboi",
      age: 22,
      nationality: "Korean",
      avatar: "/assets/bignaughty.jpg",
      genre: "Hip Hop",
    },
  ];

/* ---------------- Chat Box (Ask VIOLA) ---------------- */

function ChatBox() {
  const [prompt, setPrompt] = useState("");
  return (
    <div className="mt-3">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-3 text-slate-900">
        <h4 className="font-semibold mb-2">Ask VIOLA</h4>
        <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
          <input
            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-400"
            placeholder={`Try: "dark hip hop", "upbeat R&B", "surreal indie"`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-md bg-violet-600 px-3 py-2 text-white text-sm hover:bg-violet-700"
            disabled
          >
            Ask AI
          </button>
        </form>
        <p className="mt-2 text-xs text-slate-600">
          Enter a genre, mood, or vibe, and the demos will be ranked from best to worst fit
        </p>
      </div>
    </div>
  );
}

/* ---------------- Reels Autoplay Hook ---------------- */
/** 뷰포트에서 60%+ 보이는 섹션만 재생. 사용자 일시정지 시 자동재생 무시. 비활성 섹션은 0초로 리셋. */
function useReelsAutoplay() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mediaMap = useRef<Map<string, HTMLMediaElement>>(new Map());
  const indexMap = useRef<Map<string, number>>(new Map());
  const [activeId, setActiveId] = useState<string | null>(null);
  const pausedByUser = useRef<Set<string>>(new Set());
  const [soundOn, setSoundOn] = useState(false);
  const toggleSound = () => setSoundOn((v) => !v);

  const applyMuteState = (el: HTMLMediaElement) => {
    (el as any).playsInline = true;
    (el as HTMLVideoElement).loop = true as any;
    el.muted = !soundOn;
  };

  const pauseOthersAndReset = (keepId: string) => {
    for (const [id, el] of mediaMap.current.entries()) {
      if (id === keepId) continue;
      try { el.pause(); el.currentTime = 0; } catch { }
    }
  };

  const playActive = (id: string) => {
    const el = mediaMap.current.get(id);
    if (!el) return;
    pauseOthersAndReset(id);
    applyMuteState(el);
    if (!pausedByUser.current.has(id)) {
      el.play().catch(() => { });
    }
    setActiveId(id);
  };

  const register = (id: string, idx: number, el: HTMLMediaElement | null) => {
    if (!el) return;
    mediaMap.current.set(id, el);
    indexMap.current.set(id, idx);
    el.onended = () => {
      const nextIdx = (indexMap.current.get(id) ?? idx) + 1;
      const next = containerRef.current?.querySelector<HTMLElement>(
        `section[data-reel="true"][data-idx="${nextIdx}"]`
      );
      if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (activeId === id) applyMuteState(el);
  };

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const onFirstPointer = () => {
      if (activeId) {
        const el = mediaMap.current.get(activeId);
        if (el) applyMuteState(el);
      }
    };

    root.addEventListener('pointerdown', onFirstPointer, { once: true, passive: true });
    return () => root.removeEventListener('pointerdown', onFirstPointer);
  }, [activeId]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const e of entries) {
          const id = e.target.getAttribute("id") || "";
          if (!id) continue;
          if (!best || e.intersectionRatio > best.ratio) best = { id, ratio: e.intersectionRatio };
        }
        if (!best) return;

        const media = mediaMap.current.get(best.id);
        if (!media) return;

        if (best.ratio >= 0.6) {
          playActive(best.id);
        } else {
          try { media.pause(); media.currentTime = 0; } catch { }
        }
      },
      { root, threshold: [0, 0.25, 0.6, 0.9] }
    );

    const observeAll = () => {
      io.disconnect();
      const sections = Array.from(root.querySelectorAll<HTMLElement>('section[data-reel="true"]'));
      sections.forEach((s) => io.observe(s));
    };

    observeAll();
    const mo = new MutationObserver(() => observeAll());
    mo.observe(root, { childList: true, subtree: true });

    return () => { io.disconnect(); mo.disconnect(); };
  }, [soundOn]);

  useEffect(() => {
    if (!activeId) return;
    const el = mediaMap.current.get(activeId);
    if (!el) return;
    applyMuteState(el);
    if (!pausedByUser.current.has(activeId)) {
      el.play().catch(() => { });
    }
  }, [soundOn, activeId]);

  const getMedia = (id: string) => mediaMap.current.get(id) ?? null;

  const markPaused = (id: string) => {
    pausedByUser.current.add(id);
    const el = mediaMap.current.get(id);
    if (el) { try { el.pause(); } catch { } }
  };
  const markResumed = (id: string) => {
    pausedByUser.current.delete(id);
    const el = mediaMap.current.get(id);
    if (el) { applyMuteState(el); el.play().catch(() => { }); }
  };

  return {
    containerRef,
    register,
    getMedia,
    activeId,
    soundOn,
    toggleSound,
    markPaused,
    markResumed,
  };
}

/* ---------------- Supabase helpers ---------------- */

type DemoRow = {
  id: string;
  title: string | null;
  producer: string | null;
  genre: string | null;
  mood: string | null;
  cover_path: string | null;
  audio_path: string | null;
  owner_id: string | null;
  created_at: string | null;
};

async function signUrl(bucket: string, path: string | null | undefined, expiresInSec = 60 * 60) {
  if (!path) return undefined;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresInSec);
  if (error) {
    console.warn(`[signedUrl error] ${bucket}/${path}:`, error.message);
    return undefined;
  }
  return data?.signedUrl;
}

/* ---------------- Right-side track controls ---------------- */

function TrackControls({
  mediaId,
  getMedia,
  title,
  artist,
  submittedAt,
  mood,
  genre,
  onDownload,
  isActive,
  onUserPause,
  onUserPlay,
}: {
  mediaId: string;
  getMedia: (id: string) => HTMLMediaElement | null;
  title: string;
  artist: string;
  submittedAt: string;
  mood?: string;
  genre?: string;
  onDownload: () => void;
  isActive: boolean;
  onUserPause: (id: string) => void;
  onUserPlay: (id: string) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = getMedia(mediaId);
    if (!el) return;

    const onTime = () => setCurrent(el.currentTime || 0);
    const onLoaded = () => setDuration(el.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onLoaded);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);

    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onLoaded);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
    };
  }, [mediaId, getMedia, isActive]);

  const toggle = () => {
    const el = getMedia(mediaId);
    if (!el) return;
    if (el.paused) onUserPlay(mediaId);
    else onUserPause(mediaId);
  };

  const seek = (v: number) => {
    const el = getMedia(mediaId);
    if (!el) return;
    el.currentTime = v;
  };

  return (
    <div className="flex flex-col gap-2 h-full justify-start mt-50">
      <div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-slate-600 text-xs">Submitted: {submittedAt}</p>
        {mood && <p className="text-slate-600 text-xs mt-1">Mood: {mood}</p>}
        {genre && <p className="text-slate-600 text-xs">Genre: {genre}</p>}
      </div>

      <div className="mt-2 rounded-xl border border-slate-200 p-3 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={toggle} className="border border-slate-300">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(current, duration || 0)}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>{mmss(current)}</span>
              <span>{mmss(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          className="bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-sm hover:shadow"
          onClick={onDownload}
        >
          <Download className="w-4 h-4 mr-1" />
          Download
        </Button>
      </div>
    </div>
  );
}

/* ---------------- 중앙 Mute/Unmute 오버레이 ---------------- */
function MuteOverlay({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  const [visible, setVisible] = useState(false);
  const [icon, setIcon] = useState<'mute' | 'unmute'>('unmute');
  const timerRef = useRef<number | null>(null);
  const suppressUntilRef = useRef<number>(0);
  const firstClickDoneRef = useRef(false);

  const showForASecond = (which: 'mute' | 'unmute') => {
    setIcon(which);
    setVisible(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setVisible(false), 1000);
  };

  const handleClick = () => {
    if (!firstClickDoneRef.current && muted) {
      showForASecond('unmute');
      firstClickDoneRef.current = true;
    } else {
      const nextMuted = !muted;
      showForASecond(nextMuted ? 'mute' : 'unmute');
    }
    suppressUntilRef.current = Date.now() + 1000;
    onToggle();
  };

  useEffect(() => {
    if (Date.now() < suppressUntilRef.current) return;
    showForASecond(muted ? 'mute' : 'unmute');
  }, [muted]);

  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current); }, []);

  const stopAllPropagation = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.nativeEvent?.stopImmediatePropagation?.();
  };

  return (
    <button
      type="button"
      onPointerDownCapture={stopAllPropagation}
      onClick={handleClick}
      aria-label={icon === 'mute' ? 'Mute' : 'Unmute'}
      className="absolute inset-0 z-40 grid place-items-center"
    >
      <span
        className={`rounded-full bg-black/60 backdrop-blur p-4 shadow-lg border border-white/20 transition-all duration-300
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        style={{ pointerEvents: 'none' }}
      >
        {icon === 'mute'
          ? <VolumeX className="w-8 h-8 text-white" />
          : <Volume2 className="w-8 h-8 text-white" />}
      </span>
    </button>
  );
}


/* ---------------- Component ---------------- */

export const ARDashboard = ({ onBack }: ARDashboardProps) => {
  const {
    containerRef,
    register,
    getMedia,
    activeId,
    soundOn,
    toggleSound,
    markPaused,
    markResumed,
  } = useReelsAutoplay();

  const [heresiTracks, setHeresiTracks] = useState<Submission[] | null>(null);
  const [loadingTracks, setLoadingTracks] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedFromUrl = searchParams.get('artist');
  const [selectedArtist, _setSelectedArtist] = useState<string | null>(selectedFromUrl);

  useEffect(() => {
    if (selectedFromUrl !== selectedArtist) _setSelectedArtist(selectedFromUrl);
  }, [selectedFromUrl, selectedArtist]);

  useEffect(() => {
    (async () => {
      setLoadingTracks(true);

      const { data, error } = await supabase
        .from("demos")
        .select("id,title,producer,genre,mood,cover_path,audio_path,owner_id,created_at")
        .eq("producer", "Heresi")
        .order("created_at", { ascending: false })
        .returns<DemoRow[]>();

      if (error) {
        console.error("supabase demos error:", error.message);
        setHeresiTracks([]);
        setLoadingTracks(false);
        return;
      }

      const mapped: Submission[] = await Promise.all(
        (data ?? []).map(async (row) => {
          const audioUrl = await signUrl("demos_audio", row.audio_path);
          const coverUrl = (await signUrl("demos_covers", row.cover_path)) || "/assets/heresi.jpg";
          return {
            id: row.id,
            artistName: "Heresi",
            trackTitle: row.title ?? "Untitled",
            genre: row.genre ?? "Hip Hop",
            email: "contact@heresi.com",
            description: row.mood ?? "",
            socialMedia: "@heresi",
            submittedAt: fmtDate(row.created_at),
            status: "approved",
            audioSrc: audioUrl,
            coverSrc: coverUrl,
          };
        })
      );

      setHeresiTracks(mapped);
      setLoadingTracks(false);
    })();
  }, []);

  const setSelectedArtist = (name: string | null) => {
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    if (name) p.set("artist", name); else p.delete("artist");
    ["demo", "embed", "tempo"].forEach((k) => {
      const v = searchParams.get(k);
      if (v !== null) p.set(k, v);
    });
    router.replace(`/dashboard/ardashboard?${p.toString()}`);
    _setSelectedArtist(name);
  };

  const artistProfiles: Record<string, ArtistProfile> = mockArtists.reduce((acc, a) => {
    const tracks = heresiTracks ?? [];

    const latest = tracks
      .map(t => t.submittedAt)
      .sort((x, y) => +new Date(y) - +new Date(x))[0] ?? "";

    const statuses: Record<Status, number> = { approved: 0, pending: 0, rejected: 0 };
    tracks.forEach(t => { statuses[t.status] += 1 as any; });

    const genres = new Set<string>();
    if (a.genre) genres.add(a.genre);       
    //tracks.forEach(t => { if (t.genre) genres.add(t.genre); });

    acc[a.artistName] = {
      artistName: a.artistName,
      email: a.email,
      socialMedia: a.socialMedia,
      submissions: tracks,
      genres,
      latestSubmission: latest,
      statuses,
      age: a.age,
      nationality: a.nationality,
      avatar: a.avatar,
    };
    return acc;
  }, {} as Record<string, ArtistProfile>);

  const filteredArtists = Object.values(artistProfiles).filter((artist) => {
    const matchesSearch = artist.artistName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre =
      genreFilter === 'all' ||
      [...artist.genres].some((g) => g.toLowerCase() === genreFilter.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      artist.statuses[statusFilter as Status] > 0;
    return matchesSearch && matchesGenre && matchesStatus;
  });

  const selectedArtistData = selectedArtist ? artistProfiles[selectedArtist] : null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-400";
      case "rejected": return "bg-red-500/20 text-red-400";
      default: return "bg-yellow-500/20 text-yellow-400";
    }
  };

  const [infoOpen, setInfoOpen] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) setInfoOpen(true);
  }, []);

  /* ---------- Detail Page (Artist Selected) ---------- */

  if (selectedArtist && selectedArtistData) {
    return (
      <div className="min-h-screen bg-white px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" onClick={() => setSelectedArtist(null)} className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Artists
            </Button>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-[linear-gradient(90deg,_#7C3AED_0%,_#8B5CF6_50%,_#C084FC_100%)] drop-shadow-sm">
                {selectedArtistData.artistName}
              </h1>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            {/* LEFT: Artist Info + Chat */}
            <div className="order-1 md:order-none md:col-span-4">
              <Card className="relative shadow-lg overflow-hidden min-h-[144px] md:sticky md:top-4">
                <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#FDE68A]" />
                <div className="pointer-events-none absolute inset-0 z-0 sm:bg-[radial-gradient(900px_300px_at_65%_50%,rgba(255,255,255,0.30),transparent)] md:bg-[radial-gradient(1200px_360px_at_80%_50%,rgba(255,255,255,0.30),transparent)]" />
                <CardContent className="relative z-10 p-4 text-white">
                  <div className="grid grid-cols-3 gap-3 items-start">
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="h-24 w-24 rounded-xl overflow-hidden bg-slate-200 shadow-md">
                        {selectedArtistData.avatar ? (
                          <img src={selectedArtistData.avatar} alt={`${selectedArtistData.artistName} thumbnail`} className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center h-full w-full text-slate-500 text-sm">Thumbnail</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setInfoOpen(v => !v)}
                        className="md:hidden inline-flex items-center gap-1 rounded-md px-2 py-1 text-white/90 bg-white/10 hover:bg-white/20 transition"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${infoOpen ? "rotate-180" : ""}`} />
                        <span className="text-sm">{infoOpen ? "Hide" : "Show"}</span>
                      </button>
                    </div>
                  </div>

                  <div className={`${infoOpen ? "block" : "hidden"} md:block`}>
                    <div className="grid grid-cols-3 gap-3 items-start mt-3">
                      <div className="col-span-3 md:col-span-3">
                        <h4 className="font-semibold text-white mb-1 text-lg leading-tight">Contact Info</h4>
                        <div className="space-y-1 text-sm text-white">
                          <p className="md:whitespace-nowrap">Nationality: {selectedArtistData.nationality ?? "-"}</p>
                          <p className="md:whitespace-nowrap">Age: {selectedArtistData.age ?? "-"}</p>
                          <p className="md:whitespace-nowrap">Email: {selectedArtistData.email}</p>
                          <p className="md:whitespace-nowrap">Social: {selectedArtistData.socialMedia}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h4 className="font-semibold text-white mb-1 text-lg leading-tight">Genres</h4>
                      <div className="flex flex-wrap gap-1">
                        {Array.from(selectedArtistData.genres).map((g) => (
                          <Badge key={g} variant="secondary">{g}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3">
                      <h4 className="font-semibold text-white mb-1 text-lg leading-tight">Submission Stats</h4>
                      <div className="mt-2 w-full rounded-xl bg-white/90 backdrop-blur-sm shadow-sm p-2">
                        <div className="space-y-1 text-sm">
                          <p className="text-green-600">{selectedArtistData.statuses.approved} Approved</p>
                          <p className="text-yellow-600">{selectedArtistData.statuses.pending} Pending</p>
                          <p className="text-red-600">{selectedArtistData.statuses.rejected} Rejected</p>
                        </div>
                      </div>
                    </div>

                    <ChatBox />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT: Reels feed (Heresi demos) */}
            <div className="order-3 md:order-none md:col-span-8">
              <Card className="shadow-lg border-slate-200 bg-white">
                <CardHeader className="pb-1">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Music className="w-5 h-5" />
                    Demo Submissions ({loadingTracks ? "…" : selectedArtistData.submissions.length})
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-2 px-2 md:px-3 md:pt-2">
                  <div
                    ref={containerRef}
                    data-tour="reels"
                    className="relative h-[80vh] md:h-[calc(100vh-260px)] overflow-y-auto snap-y snap-mandatory scroll-smooth"
                  >
                    {(loadingTracks ? [] : selectedArtistData.submissions).map((submission, idx) => {
                      const id = `demo-${submission.id}`;
                      const cover = submission.coverSrc || "/assets/heresi.jpg";
                      const hasVideo = Boolean(submission.videoSrc && submission.videoSrc.trim() !== "");

                      return (
                        <section
                          id={id}
                          data-reel="true"
                          data-idx={idx}
                          key={submission.id}
                          className={`snap-start snap-always h-full flex items-center justify-center p-2 md:p-3 ${idx !== 0 ? "border-t border-slate-200" : ""}`}
                        >
                          <div className="grid md:grid-cols-2 gap-4 w-full max-w-4xl h-full">
                            {/* Media (왼쪽) */}
                            <div className="relative rounded-xl overflow-hidden bg-black h-full">
                              {hasVideo ? (
                                <video
                                  ref={(el) => register(id, idx, el)}
                                  src={submission.videoSrc}
                                  className="absolute inset-0 w-full h-full object-cover"
                                  muted
                                  playsInline
                                  loop
                                />
                              ) : (
                                <>
                                  {submission.audioSrc && (
                                    <audio
                                      ref={(el) => register(id, idx, el)}
                                      src={submission.audioSrc}
                                      preload="metadata"
                                    />
                                  )}
                                  <img
                                    src={cover}
                                    alt={`${submission.trackTitle} cover`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                  />
                                </>
                              )}

                              <div className="absolute top-2 left-2 flex gap-2">
                                <Badge variant="secondary">{submission.genre}</Badge>
                                <Badge className={getStatusColor(submission.status)}>
                                  {getStatusIcon(submission.status)}
                                  <span className="ml-1 capitalize">{submission.status}</span>
                                </Badge>
                              </div>

                              {/* 중앙 Mute/Unmute 오버레이 */}
                              <MuteOverlay muted={!soundOn} onToggle={toggleSound} />
                            </div>

                            {/* Meta + Controls (오른쪽) */}
                            <TrackControls
                              mediaId={id}
                              getMedia={getMedia}
                              title={submission.trackTitle}
                              artist={submission.artistName}
                              submittedAt={submission.submittedAt}
                              mood={submission.description}
                              genre={submission.genre}
                              isActive={activeId === id}
                              onUserPause={markPaused}
                              onUserPlay={markResumed}
                              onDownload={() => {
                                const href = submission.audioSrc || submission.videoSrc;
                                if (!href) return;
                                const a = document.createElement("a");
                                a.href = href;
                                a.download = "";
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                              }}
                            />
                          </div>
                        </section>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- List Page (Artist Grid) ---------- */

  const GENRE_LABELS: Record<string, string> = {
    all: "All Genres",
    pop: "Pop",
    rock: "Rock",
    "hip hop": "Hip Hop",
    electronic: "Electronic",
    "r&b": "R&B",
    indie: "Indie",
  };
  const STATUS_LABELS: Record<string, string> = {
    all: "All Status",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };

  return (
    <main className="h-[100dvh] bg-white md:fixed md:inset-x-0 md:bottom-0 md:top-[80px] md:overflow-hidden [scrollbar-gutter:stable_both-edges]">
      <div className="max-w-7xl mx-auto h-full flex min-h-0 flex-col">
        <div className="shrink-0 flex items-center justify-between mb-2">
          <Button variant="ghost" onClick={onBack} className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-[linear-gradient(90deg,_#7C3AED_0%,_#8B5CF6_50%,_#C084FC_100%)] drop-shadow-sm">
            A&R Dashboard
          </h1>
        </div>

        <Card className="shrink-0 relative mb-4 shadow-lg border-slate-200 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#FDE68A]" />
          <div className="pointer-events-none absolute inset-0 z-0 sm:bg-[radial-gradient(900px_300px_at_65%_50%,rgba(255,255,255,0.35),transparent)] md:bg-[radial-gradient(1200px_360px_at_80%_50%,rgba(255,255,255,0.35),transparent)]" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-white drop-shadow">
              <Filter className="w-5 h-5 text-white" />
              Filter Artists
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by artist name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white text-slate-900 shadow-sm ring-1 ring-black/5 relative z-10">
                  <span className="truncate">{STATUS_LABELS[statusFilter] ?? "All Status"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger className="w-full md:w-48 bg-white text-slate-900 shadow-sm ring-1 ring-black/5 relative z-10">
                  <span className="truncate">{GENRE_LABELS[genreFilter] ?? "All Genres"}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip hop">Hip Hop</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="r&b">R&amp;B</SelectItem>
                  <SelectItem value="indie">Indie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <section className="flex-1 min-h-0 overflow-auto overscroll-contain pr-1">
          {Object.values(artistProfiles).length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
              {Object.values(artistProfiles).filter((artist) => {
                const matchesSearch = artist.artistName.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesGenre =
                  genreFilter === 'all' ||
                  [...artist.genres].some((g) => g.toLowerCase() === genreFilter.toLowerCase());
                const matchesStatus =
                  statusFilter === 'all' ||
                  artist.statuses[statusFilter as Status] > 0;
                return matchesSearch && matchesGenre && matchesStatus;
              }).map((artist) => (
                <li key={artist.artistName} className="min-w-0">
                  <button
                    type="button"
                    data-tour="artist-card"
                    data-artist={toSlug(artist.artistName)}
                    onClick={() => setSelectedArtist(artist.artistName)}
                    className="group w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-2xl"
                  >
                    <div className="flex gap-6 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition group-hover:shadow-md min-h-[200px]">
                      <div className="h-32 w-36 shrink-0 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center">
                        {artist.avatar ? (
                          <img src={artist.avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs text-slate-507">Thumbnail</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl md:text-2xl font-semibold text-slate-900">
                            {artist.artistName}
                          </h3>
                          <ChevronRight className="w-5 h-5 text-slate-400 shrink-0 mt-1" />
                        </div>

                        <div className="mt-3 space-y-1 text-[15px] leading-6">
                          <div>
                            <span className="text-slate-500">Nationality:</span>{' '}
                            <span className="text-slate-900">{artist.nationality ?? '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Age:</span>{' '}
                            <span className="text-slate-900">{artist.age ?? '-'}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-slate-500">Genres:</span>{' '}
                            <span className="text-slate-900">
                              {Array.from(artist.genres).join(', ')}
                            </span>
                          </div>
                          <div className="mt-2 text-[15px] min-w-0">
                            <span className="text-slate-500">Social:</span>{' '}
                            <span className="text-slate-900 break-words">{artist.socialMedia}</span>
                          </div>
                          <p className="mt-2 text-xs text-slate-500">Latest: {artist.latestSubmission || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="grid place-items-center h-full">
              <Card className="text-center py-12 shadow-lg border-slate-200 bg-white">
                <CardContent>
                  <p className="text-slate-600 text-lg">No artists found matching your filters.</p>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
