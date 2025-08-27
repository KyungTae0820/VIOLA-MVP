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
};

// Mock data for demo submissions - Extended with multiple submissions per artist
const mockSubmissions: Submission[] = [
  {
    id: 1,
    artistName: "Luna Waves",
    trackTitle: "Midnight Echo",
    genre: "Electronic",
    email: "luna@email.com",
    description: "A dreamy electronic track with ethereal vocals and atmospheric synths. Inspired by late night city walks and neon lights.",
    socialMedia: "@lunawaves_music",
    submittedAt: "2024-01-15",
    status: "pending",
    audioSrc: "/api/placeholder-audio",
  },
  {
    id: 2,
    artistName: "Luna Waves",
    trackTitle: "Digital Dreams",
    genre: "Electronic",
    email: "luna@email.com",
    description: "Upbeat electronic anthem with pulsing beats and soaring melodies. Perfect for late night drives.",
    socialMedia: "@lunawaves_music",
    submittedAt: "2024-01-10",
    status: "approved",
    audioSrc: "/api/placeholder-audio",
  },
  {
    id: 3,
    artistName: "Rhythm Collective",
    trackTitle: "Urban Pulse",
    genre: "Hip Hop",
    email: "collective@email.com",
    description: "Hard-hitting hip hop track with conscious lyrics about city life. Features live instrumentation mixed with modern production.",
    socialMedia: "rhythmcollective.com",
    submittedAt: "2024-01-14",
    status: "approved",
    audioSrc: "/api/placeholder-audio",
  },
  {
    id: 4,
    artistName: "Rhythm Collective",
    trackTitle: "Street Poetry",
    genre: "Hip Hop",
    email: "collective@email.com",
    description: "Raw storytelling over boom-bap beats. A tribute to underground hip hop culture.",
    socialMedia: "rhythmcollective.com",
    submittedAt: "2024-01-08",
    status: "pending",
    audioSrc: "/api/placeholder-audio",
  },
  {
    id: 5,
    artistName: "Indie Rose",
    trackTitle: "Sunset Drive",
    genre: "Indie",
    email: "rose@email.com",
    description: "Nostalgic indie rock anthem perfect for summer road trips. Guitar-driven with heartfelt vocals.",
    socialMedia: "@indierose",
    submittedAt: "2024-01-13",
    status: "rejected",
    audioSrc: "/api/placeholder-audio",
  },
  {
    id: 6,
    artistName: "Velvet Sound",
    trackTitle: "Golden Hour",
    genre: "R&B",
    email: "velvet@email.com",
    description: "Smooth R&B with soulful vocals and rich harmonies. A love song that captures the magic of golden hour.",
    socialMedia: "velvetsound.com",
    submittedAt: "2024-01-12",
    status: "pending",
    audioSrc: "/api/placeholder-audio",
  },
  {
    id: 7,
    artistName: "Velvet Sound",
    trackTitle: "Midnight Groove",
    genre: "R&B",
    email: "velvet@email.com",
    description: "Sultry late-night R&B track with jazz influences and silky smooth production.",
    socialMedia: "velvetsound.com",
    submittedAt: "2024-01-05",
    status: "approved",
    audioSrc: "/api/placeholder-audio",
  },
  {
    id: 8,
    artistName: "Velvet Sound",
    trackTitle: "City Lights",
    genre: "R&B",
    email: "velvet@email.com",
    description: "Modern R&B with electronic elements. A celebration of urban nightlife and romance.",
    socialMedia: "velvetsound.com",
    submittedAt: "2024-01-02",
    status: "pending",
    audioSrc: "/api/placeholder-audio",
  },
];

export const ARDashboard = ({ onBack }: ARDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedFromUrl = searchParams.get('artist');
  const [selectedArtist, _setSelectedArtist] = useState<string | null>(selectedFromUrl);

  useEffect(() => {
    if (selectedFromUrl !== selectedArtist) {
      _setSelectedArtist(selectedFromUrl);
    }
  }, [selectedFromUrl]);

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

  // Group submissions by artist
  const artistProfiles: Record<string, ArtistProfile> = mockSubmissions.reduce(
    (acc, submission) => {
      if (!acc[submission.artistName]) {
        acc[submission.artistName] = {
          artistName: submission.artistName,
          email: submission.email,
          socialMedia: submission.socialMedia,
          submissions: [],
          genres: new Set<string>(),
          latestSubmission: submission.submittedAt,
          statuses: { pending: 0, approved: 0, rejected: 0 },
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
    },
    {} as Record<string, ArtistProfile>
  );

  const filteredArtists = Object.values(artistProfiles).filter((artist) => {
    const matchesSearch = artist.artistName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre =
      genreFilter === 'all' ||
      [...artist.genres].some(
        (g) => g.toLowerCase() === genreFilter.toLowerCase()
      );

    const matchesStatus =
      statusFilter === 'all' ||
      artist.statuses[statusFilter as Status] > 0;

    return matchesSearch && matchesGenre && matchesStatus;
  });


  const selectedArtistData = selectedArtist ? artistProfiles[selectedArtist] : null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  if (selectedArtist && selectedArtistData) {
    // Artist Detail View with Demo Carousel
    return (
      <div className="min-h-screen bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              onClick={() => setSelectedArtist(null)}
              className="text-slate-600 hover:text-slate-900"
            >
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
            <div className="pointer-events-none absolute inset-0 z-0
                          bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#FDE68A]"/>
            <div className="pointer-events-none absolute inset-0 z-0
                          sm:bg-[radial-gradient(900px_300px_at_65%_50%,rgba(255,255,255,0.30),transparent)]
                          md:bg-[radial-gradient(1200px_360px_at_80%_50%,rgba(255,255,255,0.30),transparent)]"/>
            <CardContent className="relative z-10 p-3 md:p-4 text-white">
              <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                <div className="ml-2 md:ml-3">
                  <h3 className="font-semibold text-white mb-2 text-lg md:text-xl leading-tight">
                    Contact Info
                  </h3>
                  <p className="text-white text-base md:text-lg leading-snug">
                    Email: {selectedArtistData.email}
                  </p>
                  <p className="text-white text-base md:text-lg leading-snug">
                    Social: {selectedArtistData.socialMedia}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 text-lg md:text-xl leading-tight">Genres</h3>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(selectedArtistData.genres).map((genre: string) => (
                      <Badge key={genre} variant="secondary">{genre}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-full pl-0 md:pl-1">
                    <h3 className="font-semibold text-white mb-1 text-lg md:text-xl leading-tight">Submission Stats</h3>
                    <div className="mt-2 w-full max-w-[200px] rounded-xl 
                                bg-white/90 backdrop-blur-sm shadow-sm p-2">
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
                  {selectedArtistData.submissions.map((submission: any) => (
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

                          <div>
                            <p className="text-slate-600 text-sm">Submitted: {submission.submittedAt}</p>
                          </div>

                          {submission.status === "pending" && (
                            <div className="flex gap-2 pt-4">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive">
                                <XCircle className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>

                        <div>
                          <AudioPlayer
                            src={submission.audioSrc}
                            title={submission.trackTitle}
                            artist={submission.artistName}
                          />
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
      </div >
    );
  }

  // Artist List View
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text
             bg-[linear-gradient(90deg,_#7C3AED_0%,_#8B5CF6_50%,_#C084FC_100%)] drop-shadow-sm">
              A&R Dashboard
            </h1>
          </div>
        </div>

        {/* Filters */}
        <Card className="relative mb-8 shadow-lg border-slate-200 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 z-0
                      bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#FDE68A]"/>
          <div className="pointer-events-none absolute inset-0 z-0
                      sm:bg-[radial-gradient(900px_300px_at_65%_50%,rgba(255,255,255,0.35),transparent)]
                      md:bg-[radial-gradient(1200px_360px_at_80%_50%,rgba(255,255,255,0.35),transparent)]"/>
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search by artist name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white text-slate-900 shadow-sm ring-1 ring-black/5"
                  />
                </div>
              </div>

              <Select value={genreFilter} onValueChange={setGenreFilter}>
                <SelectTrigger
                  className="w-full md:w-48 relative z-20
                     bg-white text-slate-900 shadow-sm ring-1 ring-black/5
                     data-[placeholder]:text-slate-900
                     data-[state=open]:bg-white data-[state=open]:ring-black/10"
                >
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip hop">Hip Hop</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="r&b">R&B</SelectItem>
                  <SelectItem value="indie">Indie</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  className="w-full md:w-48 relative z-20
                     bg-white text-slate-900 shadow-sm ring-1 ring-black/5
                     data-[placeholder]:text-slate-900
                     data-[state=open]:bg-white data-[state=open]:ring-black/10"
                >
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Artist Profiles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <Card
              key={artist.artistName}
              className="shadow-lg border-slate-200 bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedArtist(artist.artistName)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-full bg-primary/20">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{artist.artistName}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">
                      {artist.email}
                    </p>
                    <p className="text-sm text-slate-600">
                      {artist.socialMedia}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Genres:</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.from(artist.genres).slice(0, 2).map((genre: string) => (
                        <Badge key={genre} variant="secondary" className="text-xs">{genre}</Badge>
                      ))}
                      {artist.genres.size > 2 && (
                        <Badge variant="secondary" className="text-xs">+{artist.genres.size - 2}</Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-1">Submissions:</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-green-400">{artist.statuses.approved} Approved</span>
                      <span className="text-yellow-400">{artist.statuses.pending} Pending</span>
                      <span className="text-red-400">{artist.statuses.rejected} Rejected</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Latest: {artist.latestSubmission}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArtists.length === 0 && (
          <Card className="text-center py-12 shadow-lg border-slate-200 bg-white">
            <CardContent>
              <p className="text-slate-600 text-lg">No artists found matching your filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};