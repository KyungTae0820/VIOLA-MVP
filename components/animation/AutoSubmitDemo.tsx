"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { ChevronDown, X, Upload, User, Calendar, Globe, Instagram, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface FormData {
    name: string;
    age: string;
    genre: string;
    company: string;
    spotifyUrl: string;
    instagramHandle: string;
    demos: File[];
}

const genres = ["Pop", "Rock", "Hip Hop", "R&B", "Electronic", "Country", "Jazz", "Blues", "Folk", "Indie", "Alternative", "Classical", "Reggae", "Punk", "Metal", "Other"];
const companies = ["88rising", "H1ghr Music", "SM Entertainment", "Other"];

function useScramble(target: string, speed = 85, startKey = 0) {
    const [value, setValue] = useState("");
    useEffect(() => {
        let i = 0;
        const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789";
        const id = setInterval(() => {
            const head = target.slice(0, i);
            const tail = Array.from({ length: Math.max(target.length - i, 0) }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
            setValue(head + tail);
            i++;
            if (i > target.length) clearInterval(id);
        }, speed);
        return () => clearInterval(id);
    }, [target, speed, startKey]);
    return value;
}

export default function AutoSubmitDemo({
    demoMode = true,
    preview = false,
    shrink = 0.75,
    autoScroll = true,
    interactive = false, 
}: {
    demoMode?: boolean;
    preview?: boolean;
    shrink?: number;
    autoScroll?: boolean;
    interactive?: boolean; 
}) {
    const { toast } = useToast();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        age: "",
        genre: "",
        company: "",
        spotifyUrl: "",
        instagramHandle: "",
        demos: [],
    });

    const [labelQuery, setLabelQuery] = useState("");
    const [showList, setShowList] = useState(false);
    const companyBoxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function onClickOutside(e: MouseEvent) {
            if (companyBoxRef.current && !companyBoxRef.current.contains(e.target as Node)) {
                setShowList(false);
            }
        }
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const filteredCompanies = useMemo(() => {
        const q = labelQuery.trim().toLowerCase();
        if (!q) return companies;
        return companies.filter((c) => c.toLowerCase().includes(q));
    }, [labelQuery]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        if (demoMode) return;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (demoMode) return;
        const files = Array.from(e.target.files || []);
        if (files.length > 10) {
            toast({ title: "Too many files", description: "Please select up to 10 demo files only.", variant: "destructive" });
            return;
        }
        setFormData((prev) => ({ ...prev, demos: files }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (demoMode) return;

        if (!formData.name || !formData.age || !formData.genre) {
            toast({ title: "Missing required fields", description: "Please fill in name, age, and genre.", variant: "destructive" });
            return;
        }
        if (!formData.company) {
            toast({ title: "Select a record label", description: "Type to search and then pick one from the list.", variant: "destructive" });
            return;
        }
        if (formData.demos.length === 0) {
            toast({ title: "No demos uploaded", description: "Please upload at least one demo file.", variant: "destructive" });
            return;
        }

        console.log("Form submitted:", formData);
        toast({ title: "Demo submitted successfully!", description: "We'll review your submission and get back to you soon." });

        setFormData({ name: "", age: "", genre: "", company: "", spotifyUrl: "", instagramHandle: "", demos: [] });
        setLabelQuery("");
        const demosEl = document.getElementById("demos") as HTMLInputElement | null;
        if (demosEl) demosEl.value = "";
    };

    /* ===== 데모 애니메이션 ===== */
    const [loopKey, setLoopKey] = useState(0);
    const [phase, setPhase] = useState<"typing" | "files" | "press" | "done">("typing");
    const [showGenre, setShowGenre] = useState(false);

    const demoName = useScramble("Ryan Chan", 200, loopKey);
    const demoAge = useScramble("20", 400, loopKey);
    const demoGenre = "Hip Hop";
    const demoSpotify = useScramble("https://open.spotify.com/artist/ryanchan", 140, loopKey);
    const demoInsta = useScramble("@ryan", 400, loopKey);

    useEffect(() => {
        if (!demoMode) return;
        setLabelQuery("VIOLA");
        setFormData((p) => ({ ...p, company: "VIOLA" }));
    }, [demoMode, loopKey]);

    const display = {
        name: demoMode ? demoName : formData.name,
        age: demoMode ? demoAge : formData.age,
        genre: demoMode ? (showGenre ? demoGenre : "") : formData.genre,
        spotifyUrl: demoMode ? demoSpotify : formData.spotifyUrl,
        instagramHandle: demoMode ? demoInsta : formData.instagramHandle,
        demosCount: demoMode ? (phase === "files" || phase === "press" || phase === "done" ? 1 : 0) : formData.demos.length,
    };

    useEffect(() => {
        if (!demoMode) return;
        const g = setTimeout(() => setShowGenre(true), 4500);
        const t1 = setTimeout(() => setPhase("files"), 6000);
        const t2 = setTimeout(() => setPhase("press"), 7000);
        const t3 = setTimeout(() => setPhase("done"), 8000);
        const t4 = setTimeout(() => {
            setLoopKey((k) => k + 1);
            setPhase("typing");
        }, 7800);
        return () => [g, t1, t2, t3, t4].forEach(clearTimeout);
    }, [demoMode, loopKey]);

    /* ===== 프리뷰 자동 스크롤 ===== */
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!preview || !autoScroll) return;
        const el = scrollRef.current;
        if (!el) return;

        const timeouts: Array<ReturnType<typeof setTimeout>> = [];

        const scrollToViewTop = (targetSel: string, delay: number, offset = 0) => {
            const id = setTimeout(() => {
                const target = el.querySelector<HTMLElement>(targetSel);
                if (!target) return;

                const elRect = el.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();

                const visualTop = el.scrollTop + (targetRect.top - elRect.top) + offset;
                el.scrollTo({ top: Math.max(visualTop, 0), behavior: "smooth" });
            }, delay);
            timeouts.push(id);
        };

        const scrollFilesAndSubmitTogether = (delay = 5000) => {
            const id = setTimeout(() => {
                const files = el.querySelector<HTMLElement>("#sec-files");
                const submit = el.querySelector<HTMLElement>("#sec-submit");
                if (!files || !submit) return;

                const elRect = el.getBoundingClientRect();
                const filesRect = files.getBoundingClientRect();
                theSubmit: {
                    const submitRect = submit.getBoundingClientRect();
                    const viewportH = elRect.height;
                    const bottomPad = 160;
                    const topPad = 12;

                    const wantSubmitTop = el.scrollTop + (submitRect.bottom - elRect.top) - (viewportH - bottomPad);
                    const wantFilesTop = el.scrollTop + (filesRect.top - elRect.top) - topPad;
                    const top = Math.min(Math.max(wantSubmitTop, 0), wantFilesTop);

                    el.scrollTo({ top, behavior: "smooth" });
                }
            }, delay);
            timeouts.push(id);
        };

        el.scrollTo({ top: 0, behavior: "auto" });
        scrollToViewTop("#sec-genre", 3000, -140);
        scrollFilesAndSubmitTogether(5200);

        return () => timeouts.forEach(clearTimeout);
    }, [preview, autoScroll, loopKey]);

    // 본문
    const Body = (
        <div className={preview ? "min-h-[900px] bg-background py-12 px-4" : "min-h-screen bg-background py-12 px-4"} id="sec-root">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8" id="sec-header">
                    <h1 className="text-4xl font-bold mb-1">Submit Your Demo</h1>
                    <p className="text-muted-foreground text-md">
                        Share your music with us. We&apos;re looking for the next big talent.
                    </p>
                </div>

                <Card className="shadow-elegant" id="sec-artist">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Artist Information
                        </CardTitle>
                        <CardDescription>Tell us about yourself and your music</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2" ref={companyBoxRef}>
                                <Label className="flex items-center gap-2">
                                    <Building className="w-4 h-4" />
                                    Choose a record label *
                                </Label>

                                <div className="relative">
                                    <Input
                                        placeholder="Search Labels"
                                        value={labelQuery}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (demoMode) return;
                                            setLabelQuery(v);
                                            setShowList(true);
                                            if (formData.company && v !== formData.company) {
                                                setFormData((p) => ({ ...p, company: "" }));
                                            }
                                        }}
                                        onFocus={() => setShowList(true)}
                                        required
                                        aria-autocomplete="list"
                                        aria-expanded={showList}
                                        aria-controls="company-listbox"
                                        role="combobox"
                                        readOnly={demoMode}
                                    />

                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        {formData.company && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (demoMode) return;
                                                    setFormData((p) => ({ ...p, company: "" }));
                                                    setLabelQuery("");
                                                    setShowList(false);
                                                }}
                                                className="p-1 rounded hover:bg-gray-100"
                                                title="Clear selection"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!demoMode) setShowList((s) => !s);
                                            }}
                                            className="p-1 rounded hover:bg-gray-100"
                                            aria-label="Toggle label list"
                                            title="Show all labels"
                                        >
                                            <ChevronDown className={`w-4 h-4 transition-transform ${showList ? "rotate-180" : ""}`} />
                                        </button>
                                    </div>
                                </div>

                                {showList && filteredCompanies.length > 0 && !demoMode && (
                                    <div className="border rounded-md overflow-hidden">
                                        <ul className="max-h-56 overflow-auto divide-y">
                                            {filteredCompanies.map((c) => (
                                                <li key={c}>
                                                    <button
                                                        type="button"
                                                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${formData.company === c ? "bg-gray-50" : ""}`}
                                                        onClick={() => {
                                                            setFormData((p) => ({ ...p, company: c }));
                                                            setLabelQuery(c);
                                                            setShowList(false);
                                                        }}
                                                        role="option"
                                                        aria-selected={formData.company === c}
                                                    >
                                                        {c}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {!formData.company && (
                                    <p
                                        className={`text-xs ${!demoMode && showList && labelQuery.trim() && filteredCompanies.length === 0
                                                ? "text-red-600"
                                                : "text-orange-600"
                                            }`}
                                    >
                                        {!demoMode && showList && labelQuery.trim() && filteredCompanies.length === 0
                                            ? "No labels found. Try another keyword."
                                            : "* Type or open the list, then pick one."}
                                    </p>
                                )}
                            </div>

                            <div className={preview ? "grid grid-cols-2 gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
                                <div className="space-y-2" id="sec-name">
                                    <Label htmlFor="name">Artist Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Your stage name or real name"
                                        value={display.name}
                                        readOnly={demoMode}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2" id="sec-age">
                                    <Label htmlFor="age" className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Age *
                                    </Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="Your age"
                                        value={display.age}
                                        readOnly={demoMode}
                                        onChange={(e) => handleInputChange("age", e.target.value)}
                                        required
                                        min="13"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2" id="sec-genre">
                                <Label htmlFor="genre">Genre *</Label>
                                <Select value={display.genre} onValueChange={(value) => handleInputChange("genre", value)} disabled={demoMode}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your primary genre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {genres.map((g) => (
                                            <SelectItem key={g} value={g}>
                                                {g}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className={preview ? "grid grid-cols-2 gap-6" : "grid grid-cols-1 md:grid-cols-2 gap-6"}>
                                <div className="space-y-2">
                                    <Label htmlFor="spotify" className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        Spotify URL
                                    </Label>
                                    <Input
                                        id="spotify"
                                        placeholder="https://open.spotify.com/artist/..."
                                        value={display.spotifyUrl}
                                        readOnly={demoMode}
                                        onChange={(e) => handleInputChange("spotifyUrl", e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="instagram" className="flex items-center gap-2">
                                        <Instagram className="w-4 h-4" />
                                        Instagram Handle
                                    </Label>
                                    <Input
                                        id="instagram"
                                        placeholder="@yourusername"
                                        value={display.instagramHandle}
                                        readOnly={demoMode}
                                        onChange={(e) => handleInputChange("instagramHandle", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2" id="sec-files">
                                <Label htmlFor="demos" className="flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Demo Files * (Up to 10 files)
                                </Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                                    <Input id="demos" type="file" multiple accept="audio/*" onChange={handleFileUpload} className="hidden" />
                                    <Label htmlFor="demos" className="cursor-pointer flex flex-col items-center gap-2">
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            {display.demosCount > 0 ? `${display.demosCount} file(s) selected` : "Click to upload your demo files"}
                                        </span>
                                        <span className="text-xs text-muted-foreground">MP3, WAV, FLAC supported • Max 10 files</span>
                                    </Label>
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: phase === "files" || phase === "press" || phase === "done" ? 1 : 0, y: phase === "files" || phase === "press" || phase === "done" ? 0 : 8 }}
                                        transition={{ type: "spring", stiffness: 320, damping: 30, delay: 0.1 }}
                                        className="mt-3 inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-slate-900 shadow-sm"
                                        aria-hidden
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
                                            <path fill="currentColor" d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" />
                                        </svg>
                                        Orion_Demo.wav
                                    </motion.div>
                                </div>
                            </div>

                            <div id="sec-submit" className="pt-6 pb-8">
                                <motion.div animate={phase === "press" ? { scale: [1, 0.94, 1] } : undefined} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                                    <Button
                                        type={demoMode ? "button" : "submit"}
                                        className="w-full bg-gradient-to-r from-purple-600 via-violet-500 to-pink-400 hover:opacity-90 transition-opacity"
                                        size="lg"
                                        onClick={(e) => demoMode && e.preventDefault()}
                                    >
                                        {demoMode ? "Submit Demo" : "Submit Demo"}
                                    </Button>
                                </motion.div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    if (preview) {
        const content = (
            <div style={{ transform: `scale(${shrink})`, transformOrigin: "top center" }}>
                {Body}
            </div>
        );

        if (!interactive) {
            return (
                <div
                    className="h-full w-full overflow-hidden relative"
                    aria-label="Demo preview (non-interactive)"
                    onFocusCapture={(e) => {
                        (e.target as HTMLElement).blur();
                        e.preventDefault();
                    }}
                >
                    <div className="absolute inset-0 z-10 cursor-not-allowed" role="presentation" />

                    <div
                        ref={scrollRef}
                        className="h-full w-full overflow-y-auto scroll-smooth pointer-events-none select-none"
                        style={{
                            WebkitUserSelect: "none",
                            userSelect: "none",
                            touchAction: "none",
                            WebkitOverflowScrolling: "touch",
                            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 100px)",
                        }}
                    >
                        {content}
                    </div>
                </div>
            );
        }

        return (
            <div className="h-full w-full overflow-hidden">
                <div
                    ref={scrollRef}
                    className="h-full w-full overflow-y-auto scroll-smooth"
                    style={{
                        WebkitOverflowScrolling: "touch",
                        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 100px)",
                    }}
                >
                    {content}
                </div>
            </div>
        );
    }

    return Body;
}
