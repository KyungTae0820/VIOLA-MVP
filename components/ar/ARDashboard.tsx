'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { Badge, Input, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AudioPlayer } from "./AudioPlayer";
import { ArrowLeft, Search, Clock, CheckCircle, XCircle, Filter, User, Music, ChevronRight } from "lucide-react";

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
    id: 1, artistName: "Luna Waves", trackTitle: "Midnight Echo", genre: "Electronic", email: "luna@email.com",
    description: "A dreamy electronic track with ethereal vocals and atmospheric synths. Inspired by late night city walks and neon lights.",
    socialMedia: "@lunawaves_music", submittedAt: "2024-01-15", status: "pending", audioSrc: "/api/placeholder-audio"
  },
  {
    id: 2, artistName: "Luna Waves", trackTitle: "Digital Dreams", genre: "Electronic", email: "luna@email.com",
    description: "Upbeat electronic anthem with pulsing beats and soaring melodies. Perfect for late night drives.",
    socialMedia: "@lunawaves_music", submittedAt: "2024-01-10", status: "approved", audioSrc: "/api/placeholder-audio"
  },
  {
    id: 3, artistName: "Rhythm Collective", trackTitle: "Urban Pulse", genre: "Hip Hop", email: "collective@email.com",
    description: "Hard-hitting hip hop track with conscious lyrics about city life. Features live instrumentation mixed with modern production.",
    socialMedia: "rhythmcollective.com", submittedAt: "2024-01-14", status: "approved", audioSrc: "/api/placeholder-audio"
  },
  {
    id: 4, artistName: "Rhythm Collective", trackTitle: "Street Poetry", genre: "Hip Hop", email: "collective@email.com",
    description: "Raw storytelling over boom-bap beats. A tribute to underground hip hop culture.",
    socialMedia: "rhythmcollective.com", submittedAt: "2024-01-08", status: "pending", audioSrc: "/api/placeholder-audio"
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
  "Luna Waves": { age: 24, ethnicity: "Korean-American", avatar: "/images/luna.jpg", },
  "Rhythm Collective": { age: 29, ethnicity: "African-American", avatar: "/images/rhythm.jpg", },
  "Indie Rose": { age: 27, ethnicity: "Chinese", avatar: "/images/indie.jpg", },
  "Velvet Sound": { age: 31, ethnicity: "Latino", avatar: "/images/velvet.jpg", },
};

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
    if (name) {
      const p = new URLSearchParams(searchParams);
      p.set('artist', name);
      router.push(`/dashboard/ardashboard?${p.toString()}`);
    } else {
      router.push('/dashboard/ardashboard');
    }
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

  if (selectedArtist && selectedArtistData) {
    return (
      <div className="min-h-screen bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
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

          {/* Artist Info */}
          <Card className="relative mb-8 shadow-lg overflow-hidden min-h-[144px]">
            <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#FDE68A]" />
            <div className="pointer-events-none absolute inset-0 z-0
    sm:bg-[radial-gradient(900px_300px_at_65%_50%,rgba(255,255,255,0.30),transparent)]
    md:bg-[radial-gradient(1200px_360px_at_80%_50%,rgba(255,255,255,0.30),transparent)]" />
            <CardContent className="relative z-10 p-3 md:p-4 text-white">
              <div className="grid md:grid-cols-4 gap-3 md:gap-4 items-start content-start">
                <div className="flex items-center justify-center">
                  <div className="h-28 w-28 rounded-xl overflow-hidden bg-slate-200 shadow-md">
                    {selectedArtistData.avatar ? (
                      <img
                        src={selectedArtistData.avatar}
                        alt={`${selectedArtistData.artistName} thumbnail`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex items-center justify-center h-full w-full text-slate-500 text-sm">
                        Thumbnail
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="ml-2 md:ml-3">
                  <h3 className="font-semibold text-white mb-2 text-lg md:text-xl leading-tight">Contact Info</h3>
                  <p className="text-white text-base md:text-lg leading-snug">Email: {selectedArtistData.email}</p>
                  <p className="text-white text-base md:text-lg leading-snug">Social: {selectedArtistData.socialMedia}</p>
                  <p className="text-white text-base md:text-lg leading-snug">Ethnicity: {selectedArtistData.ethnicity ?? "-"}</p>
                  <p className="text-white text-base md:text-lg leading-snug">Age: {selectedArtistData.age ?? "-"}</p>
                </div>

                {/* Genres */}
                <div>
                  <h3 className="font-semibold text-white mb-1 text-lg md:text-xl leading-tight">Genres</h3>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(selectedArtistData.genres).map((genre) => (
                      <Badge key={genre} variant="secondary">{genre}</Badge>
                    ))}
                  </div>
                </div>

                {/* Submission Stats */}
                <div className="flex items-start">
                  <div className="w-full pl-0 md:pl-1">
                    <h3 className="font-semibold text-white mb-1 text-lg md:text-xl leading-tight">Submission Stats</h3>
                    <div className="mt-2 w-full max-w-[200px] rounded-xl bg-white/90 backdrop-blur-sm shadow-sm p-2">
                      <div className="space-y-1 text-md">
                        <p className="text-green-500">{selectedArtistData.statuses.approved} Approved</p>
                        <p className="text-yellow-500">{selectedArtistData.statuses.pending} Pending</p>
                        <p className="text-red-500">{selectedArtistData.statuses.rejected} Rejected</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Demo Carousel */}
          <Card className="shadow-lg border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                Demo Submissions ({selectedArtistData.submissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Carousel className="w-full">
                <CarouselContent>
                  {selectedArtistData.submissions.map((submission) => (
                    <CarouselItem key={submission.id}>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900">{submission.trackTitle}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">{submission.genre}</Badge>
                              <Badge className={getStatusColor(submission.status)}>
                                {getStatusIcon(submission.status)}
                                <span className="ml-1 capitalize">{submission.status}</span>
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <p className="text-slate-600 text-sm mb-2">Description:</p>
                            <p className="text-sm leading-relaxed text-slate-700">{submission.description}</p>
                          </div>

                          <p className="text-slate-600 text-sm">Submitted: {submission.submittedAt}</p>

                          {submission.status === "pending" && (
                            <div className="flex gap-2 pt-4">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="destructive">
                                <XCircle className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                        </div>

                        <div>
                          <AudioPlayer src={submission.audioSrc} title={submission.trackTitle} artist={submission.artistName} />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
    <div className="h-[100dvh] overflow-hidden bg-white">
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

        {/* Artist Profiles Grid – bigger cards + vertical details */}
        <section className="flex-1 min-h-0 overflow-auto overscroll-contain pr-1">
          {filteredArtists.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
              {filteredArtists.map((artist) => (
                <li key={artist.artistName} className="min-w-0">
                  <button
                    type="button"
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
    </div>
  );
};
