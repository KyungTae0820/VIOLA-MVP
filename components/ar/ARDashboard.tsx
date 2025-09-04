'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge, Input, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AudioPlayer } from "./AudioPlayer";
import { ArrowLeft, Search, Clock, CheckCircle, XCircle, Filter, User, Music, ChevronRight, ChevronDown } from "lucide-react";
import ReelVideo from "@/components/ui/ReelVideo";

/* ---------------- Utils ---------------- */

const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

/* ---------------- Props/Types ---------------- */

interface ARDashboardProps {
  onBack: () => void;
}

type Status = 'pending' | 'approved' | 'rejected';

type Submission = {
  id: number;
  artistName: string;
  trackTitle: string;
  genre: string;
  email: string;
  description: string;
  socialMedia: string;
  submittedAt: string;
  status: Status;
  audioSrc: string;
  videoSrc?: string;
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
  ethnicity?: string;
  avatar?: string;
};

/* ---------------- Mock Data ---------------- */

const mockSubmissions: Submission[] = [
  {
    id: 1, artistName: "Jackson Wang", trackTitle: "GBAD", genre: "Hip Hop", email: "jacksonwang@email.com",
    description: "A dreamy electronic track with ethereal vocals and atmospheric synths. Inspired by late night city walks and neon lights.",
    socialMedia: "@jacksonwang", submittedAt: "2024-01-15", status: "pending", audioSrc: "/api/placeholder-audio", videoSrc: "https://music.youtube.com/watch?v=KEYpNZLotMs&feature=shared&feature=xapp_share"
  },
  {
    id: 2, artistName: "Jackson Wang", trackTitle: "Made Me a Man", genre: "Hip Hop", email: "jacksonwang@email.com",
    description: "Upbeat electronic anthem with pulsing beats and soaring melodies. Perfect for late night drives.",
    socialMedia: "@jacksonwang", submittedAt: "2024-01-10", status: "approved", audioSrc: "/api/placeholder-audio", videoSrc: "https://youtu.be/Zh6W6zOl4kY?feature=shared"
  },
  {
    id: 3, artistName: "Big Naughty", trackTitle: "Beyond Love", genre: "Hip Hop", email: "bignaughty@email.com",
    description: "Hard-hitting hip hop track with conscious lyrics about city life. Features live instrumentation mixed with modern production.",
    socialMedia: "@bignaughtyboi", submittedAt: "2024-01-14", status: "approved", audioSrc: "/api/placeholder-audio", videoSrc: "https://youtube.com/shorts/F3zpQMFC2g8?feature=shared"
  },
  {
    id: 4, artistName: "Big Naughty", trackTitle: "Vancouver", genre: "Hip Hop", email: "bignaughty@email.com",
    description: "Raw storytelling over boom-bap beats. A tribute to underground hip hop culture.",
    socialMedia: "@bignaughtyboi", submittedAt: "2024-01-14", status: "approved", audioSrc: "/api/placeholder-audio", videoSrc: "https://www.youtube.com/watch?v=WxM0qO29RM8"
  },
  {
    id: 5, artistName: "Indie Rose", trackTitle: "Sunset Drive", genre: "Indie", email: "rose@email.com",
    description: "Nostalgic indie rock anthem perfect for summer road trips. Guitar-driven with heartfelt vocals.",
    socialMedia: "@indierose", submittedAt: "2024-01-13", status: "rejected", audioSrc: "/api/placeholder-audio"
  },
  {
    id: 6, artistName: "Velvet Sound", trackTitle: "Golden Hour", genre: "R&B", email: "velvet@email.com",
    description: "Smooth R&B with soulful vocals and rich harmonies. A love song that captures the magic of golden hour.",
    socialMedia: "velvetsound.com", submittedAt: "2024-01-12", status: "pending", audioSrc: "/api/placeholder-audio"
  },
  {
    id: 7, artistName: "Velvet Sound", trackTitle: "Midnight Groove", genre: "R&B", email: "velvet@email.com",
    description: "Sultry late-night R&B track with jazz influences and silky smooth production.",
    socialMedia: "velvetsound.com", submittedAt: "2024-01-05", status: "approved", audioSrc: "/api/placeholder-audio"
  },
  {
    id: 8, artistName: "Velvet Sound", trackTitle: "City Lights", genre: "R&B", email: "velvet@email.com",
    description: "Modern R&B with electronic elements. A celebration of urban nightlife and romance.",
    socialMedia: "velvetsound.com", submittedAt: "2024-01-02", status: "pending", audioSrc: "/api/placeholder-audio"
  },
];

const artistMeta: Record<string, { age?: number; ethnicity?: string; avatar?: string }> = {
  "Jackson Wang": { age: 31, ethnicity: "Chinese", avatar: "/assets/jacksonwang.jpg", },
  "Big Naughty": { age: 22, ethnicity: "Korean", avatar: "/assets/bignaughty.jpg", },
  "Indie Rose": { age: 27, ethnicity: "Chinese", avatar: "/images/indie.jpg", },
  "Velvet Sound": { age: 31, ethnicity: "Latino", avatar: "/images/velvet.jpg", },
};

/* ---------------- Chat Box ---------------- */

function ChatBox({ submissions }: { submissions: Submission[] }) {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  // 임시 추천: 키워드 매칭 기반 Top 1–5
  const recommend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    const q = prompt.trim().toLowerCase();

    const ranked = submissions
      .map((s) => {
        const hay = [s.trackTitle, s.genre ?? "", s.description ?? ""].join(" ").toLowerCase();
        const score =
          (s.genre?.toLowerCase().includes(q) ? 2 : 0) +
          (hay.includes(q) ? 1 : 0);
        return { s, score };
      })
      .sort((a, b) => b.score - a.score)
      .filter((r) => r.score > 0)
      .slice(0, 5)
      .map((r) => r.s);

    setResults(ranked);
    setLoading(false);
  };

  const scrollToDemo = (id: number) => {
    const el = document.getElementById(`demo-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mt-3">
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-3 text-slate-900">
        <h4 className="font-semibold mb-2">AI Demo Finder</h4>

        <form onSubmit={recommend} className="flex gap-2">
          <input
            className="flex-1 rounded-md border border-slate-300 bg-white
                   px-3 py-2 text-sm text-slate-900
                   placeholder:text-slate-400
                   outline-none focus:ring-2 focus:ring-violet-400"
            placeholder={`Try: "dark hip hop", "upbeat R&B", "surreal indie"`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-md bg-violet-600 px-3 py-2 text-white text-sm
                   hover:bg-violet-700 disabled:opacity-60"
            disabled={!prompt.trim() || loading}
          >
            {loading ? "Finding..." : "Ask AI"}
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-3 space-y-2">
            {results.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => scrollToDemo(r.id)}
                className="w-full flex items-center justify-between rounded-lg
                       border border-slate-200 px-3 py-2 text-left
                       hover:bg-neutral-50"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{r.trackTitle}</div>
                  <div className="text-xs text-slate-500">{r.genre}</div>
                </div>
                <span className="text-xs font-semibold text-violet-700">View</span>
              </button>
            ))}
          </div>
        )}

        {results.length === 0 && !loading && (
          <p className="mt-2 text-xs text-slate-600">
            Enter a genre, mood, or vibe, and up to 5 matching demos will be shown.
          </p>
        )}
      </div>
    </div>
  );
}

/* ---------------- Component ---------------- */

export const ARDashboard = ({ onBack }: ARDashboardProps) => {
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

  const setSelectedArtist = (name: string | null) => {
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    if (name) p.set("artist", name);
    else p.delete("artist");
    ["demo", "embed", "tempo"].forEach((k) => {
      const v = searchParams.get(k);
      if (v !== null) p.set(k, v);
    });
    router.replace(`/dashboard/ardashboard?${p.toString()}`);
    _setSelectedArtist(name);
  };

  const artistProfiles: Record<string, ArtistProfile> = mockSubmissions.reduce((acc, submission) => {
    if (!acc[submission.artistName]) {
      const meta = artistMeta[submission.artistName] || {};
      acc[submission.artistName] = {
        artistName: submission.artistName,
        email: submission.email,
        socialMedia: submission.socialMedia,
        submissions: [],
        genres: new Set<string>(),
        latestSubmission: submission.submittedAt,
        statuses: { pending: 0, approved: 0, rejected: 0 },
        age: meta.age,
        ethnicity: meta.ethnicity,
        avatar: meta.avatar,
      };
    }
    const p = acc[submission.artistName];
    p.submissions.push(submission);
    p.genres.add(submission.genre);
    p.statuses[submission.status] += 1;
    if (new Date(submission.submittedAt) > new Date(p.latestSubmission)) {
      p.latestSubmission = submission.submittedAt;
    }
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
              <h1 className="text-3xl font-bold text-transparent bg-clip-text
              bg-[linear-gradient(90deg,_#7C3AED_0%,_#8B5CF6_50%,_#C084FC_100%)] drop-shadow-sm">
                {selectedArtistData.artistName}
              </h1>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-6">
            {/* LEFT: Artist Info (sticky) + ChatBox */}
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
                          <p className="md:whitespace-nowrap">Ethnicity: {selectedArtistData.ethnicity ?? "-"}</p>
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

                    {/* ▼ AI Chat Box (Contact Info 아래) */}
                    <ChatBox submissions={selectedArtistData.submissions} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT: Reels feed (Demos) */}
            <div className="order-3 md:order-none md:col-span-8">
              <Card className="shadow-lg border-slate-200 bg-white">
                <CardHeader className="pb-1">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Music className="w-5 h-5" />
                    Demo Submissions ({selectedArtistData.submissions.length})
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-2 px-2 md:px-3 md:pt-2">
                  <div
                    data-tour="reels"
                    className="relative h-[80vh] md:h-[calc(100vh-260px)] overflow-y-auto
                    snap-y snap-mandatory scroll-smooth"
                  >
                    {selectedArtistData.submissions.map((submission, idx) => (
                      <section
                        id={`demo-${submission.id}`}
                        key={submission.id}
                        className={`snap-start snap-always
                          h-full flex items-center justify-center
                          p-2 md:p-3
                          ${idx !== 0 ? "border-t border-slate-200" : ""}  
                        `}
                      >
                        <div className="grid md:grid-cols-2 gap-4 w-full max-w-4xl h-full">
                          {/* Video / Audio */}
                          <div className="relative rounded-xl overflow-hidden bg-black h-full">
                            {submission.videoSrc ? (
                              <ReelVideo src={submission.videoSrc} className="absolute inset-0 w-full h-full" />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 p-6">
                                <AudioPlayer
                                  src={submission.audioSrc}
                                  title={submission.trackTitle}
                                  artist={submission.artistName}
                                />
                              </div>
                            )}
                            <div className="absolute top-2 left-2 flex gap-2">
                              <Badge variant="secondary">{submission.genre}</Badge>
                              <Badge className={getStatusColor(submission.status)}>
                                {getStatusIcon(submission.status)}
                                <span className="ml-1 capitalize">{submission.status}</span>
                              </Badge>
                            </div>
                          </div>

                          {/* Meta + Actions */}
                          <div className="flex flex-col justify-center space-y-2">
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">{submission.trackTitle}</h3>
                              <p className="text-slate-600 text-xs">Submitted: {submission.submittedAt}</p>
                            </div>
                            <p className="text-sm leading-relaxed text-slate-700">{submission.description}</p>
                            {submission.status === "pending" && (
                              <div className="flex gap-2 pt-1">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="w-4 h-4 mr-1" /> Approve
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <XCircle className="w-4 h-4 mr-1" /> Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </section>
                    ))}
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

          <h1 className="text-3xl font-bold text-transparent bg-clip-text
            bg-[linear-gradient(90deg,_#7C3AED_0%,_#8B5CF6_50%,_#C084FC_100%)] drop-shadow-sm">
            A&R Dashboard
          </h1>
        </div>

        <Card className="shrink-0 relative mb-4 shadow-lg border-slate-200 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#FDE68A]" />
          <div className="pointer-events-none absolute inset-0 z-0
            sm:bg-[radial-gradient(900px_300px_at_65%_50%,rgba(255,255,255,0.35),transparent)]
            md:bg-[radial-gradient(1200px_360px_at_80%_50%,rgba(255,255,255,0.35),transparent)]" />
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

              {/* Status */}
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

              {/* Genre */}
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

        {/* Artist Profiles Grid */}
        <section className="flex-1 min-h-0 overflow-auto overscroll-contain pr-1">
          {filteredArtists.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
              {filteredArtists.map((artist) => (
                <li key={artist.artistName} className="min-w-0">
                  <button
                    type="button"
                    data-tour="artist-card"
                    data-artist={toSlug("Jackson Wang")}
                    onClick={() => setSelectedArtist(artist.artistName)}
                    className="group w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-2xl"
                  >
                    <div className="flex gap-6 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm transition group-hover:shadow-md min-h-[200px]">
                      <div className="h-32 w-36 shrink-0 rounded-xl overflow-hidden bg-slate-200 flex items-center justify-center">
                        {artist.avatar ? (
                          <img src={artist.avatar} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs text-slate-500">Thumbnail</span>
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
                            <span className="text-slate-500">Ethnicity:</span>{' '}
                            <span className="text-slate-900">{artist.ethnicity ?? '-'}</span>
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

                          <div className="mt-1 text-[15px]">
                            <span className="text-slate-500">Demos Submitted:</span>{' '}
                            <span className="text-slate-900">{artist.submissions.length}</span>
                          </div>

                          <p className="mt-2 text-xs text-slate-500">Latest: {artist.latestSubmission}</p>
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
