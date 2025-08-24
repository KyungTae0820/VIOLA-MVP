"use client"

import { useMemo, useRef, useEffect, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Upload, User, Calendar, Globe, Instagram, Building } from "lucide-react";

interface FormData {
    name: string;
    age: string;
    genre: string;
    company: string;       
    spotifyUrl: string;
    instagramHandle: string;
    demos: File[];
}

const genres = [
    "Pop", "Rock", "Hip Hop", "R&B", "Electronic", "Country", "Jazz", "Blues",
    "Folk", "Indie", "Alternative", "Classical", "Reggae", "Punk", "Metal", "Other"
];

const companies = [
    "88rising", "H1ghr Music", "88rsigng", "SM Entertainment", "Other"
];

export default function DemoSubmissionForm() {
    const { toast } = useToast();

    // 폼 상태
    const [formData, setFormData] = useState<FormData>({
        name: "",
        age: "",
        genre: "",
        company: "",
        spotifyUrl: "",
        instagramHandle: "",
        demos: []
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

    // 필터 결과
    const filteredCompanies = useMemo(() => {
        const q = labelQuery.trim().toLowerCase();
        if (!q) return companies; // 입력이 비어도 화살표로 전체 펼칠 수 있게 전체 반환
        return companies.filter((c) => c.toLowerCase().includes(q));
    }, [labelQuery]);

    const noMatches = showList && labelQuery.trim().length > 0 && filteredCompanies.length === 0;

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 10) {
            toast({
                title: "Too many files",
                description: "Please select up to 10 demo files only.",
                variant: "destructive"
            });
            return;
        }
        setFormData(prev => ({ ...prev, demos: files }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.age || !formData.genre) {
            toast({
                title: "Missing required fields",
                description: "Please fill in name, age, and genre.",
                variant: "destructive"
            });
            return;
        }

        if (!formData.company) {
            toast({
                title: "Select a record label",
                description: "Type to search and then pick one from the list.",
                variant: "destructive"
            });
            return;
        }

        if (formData.demos.length === 0) {
            toast({
                title: "No demos uploaded",
                description: "Please upload at least one demo file.",
                variant: "destructive"
            });
            return;
        }

        // 여기에 백엔드 전송 로직
        console.log("Form submitted:", formData);

        toast({
            title: "Demo submitted successfully!",
            description: "We&apos;ll review your submission and get back to you soon.",
        });

        // 폼 리셋
        setFormData({
            name: "",
            age: "",
            genre: "",
            company: "",
            spotifyUrl: "",
            instagramHandle: "",
            demos: []
        });
        setLabelQuery("");
        (document.getElementById("demos") as HTMLInputElement | null)?.value && ((document.getElementById("demos") as HTMLInputElement).value = "");
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    {/* <div className="mb-4">
                        <Image
                            src="/assets/viola.jpg"
                            alt="Viola"
                            width={300}
                            height={200}
                            className="mx-auto object-contain"
                        />
                    </div> */}

                    <h1 className="text-4xl font-bold mb-1">Submit Your Demo</h1>
                    <p className="text-muted-foreground text-md">
                        Share your music with us. We're looking for the next big talent.
                    </p>
                </div>

                <Card className="shadow-elegant">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Artist Information
                        </CardTitle>
                        <CardDescription>
                            Tell us about yourself and your music
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* === Company Selection: 입력창 + 추천 리스트 === */}
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
                                            setLabelQuery(v);
                                            setShowList(true);              // 타이핑하면 자동으로 리스트 오픈
                                            if (formData.company && v !== formData.company) {
                                                setFormData((p) => ({ ...p, company: "" })); // 입력 바꾸면 확정 해제
                                            }
                                        }}
                                        onFocus={() => setShowList(true)}
                                        required
                                        aria-autocomplete="list"
                                        aria-expanded={showList}
                                        aria-controls="company-listbox"
                                        role="combobox"
                                    />

                                    {/* 우측 아이콘 버튼들 */}
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        {formData.company && (
                                            <button
                                                type="button"
                                                onClick={() => {
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
                                                // 화살표를 누르면 전체 리스트 토글 (입력 비워도 전체가 열림)
                                                setShowList((s) => !s);
                                                if (!showList && labelQuery === "") {
                                                    // 처음 열 때 전체 보여주기
                                                    // (filteredCompanies는 labelQuery가 빈 문자열이면 전체 반환)
                                                }
                                            }}
                                            className="p-1 rounded hover:bg-gray-100"
                                            aria-label="Toggle label list"
                                            title="Show all labels"
                                        >
                                            <ChevronDown className={`w-4 h-4 transition-transform ${showList ? "rotate-180" : ""}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* 결과 리스트 (아코디언 헤더 없이 바로 표시) */}
                                {showList && filteredCompanies.length > 0 && (
                                    <div className="border rounded-md overflow-hidden">
                                        <ul className="max-h-56 overflow-auto divide-y">
                                            {filteredCompanies.map((c) => (
                                                <li key={c}>
                                                    <button
                                                        type="button"
                                                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${formData.company === c ? "bg-gray-50" : ""
                                                            }`}
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

                                {/* 미선택 안내 */}
                                {!formData.company && (
                                    <p className={`text-xs ${noMatches ? "text-red-600" : "text-orange-600"}`}>
                                        {noMatches
                                            ? "No labels found. Try another keyword."
                                            : "* Type or open the list, then pick one."}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Artist Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Your stage name or real name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="age" className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Age *
                                    </Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="Your age"
                                        value={formData.age}
                                        onChange={(e) => handleInputChange("age", e.target.value)}
                                        required
                                        min="13"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="genre">Genre *</Label>
                                <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your primary genre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {genres.map((genre) => (
                                            <SelectItem key={genre} value={genre}>
                                                {genre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="spotify" className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        Spotify URL
                                    </Label>
                                    <Input
                                        id="spotify"
                                        placeholder="https://open.spotify.com/artist/..."
                                        value={formData.spotifyUrl}
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
                                        value={formData.instagramHandle}
                                        onChange={(e) => handleInputChange("instagramHandle", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="demos" className="flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Demo Files * (Up to 10 files)
                                </Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                                    <Input
                                        id="demos"
                                        type="file"
                                        multiple
                                        accept="audio/*"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <Label
                                        htmlFor="demos"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-sm font-medium">
                                            {formData.demos.length > 0
                                                ? `${formData.demos.length} file(s) selected`
                                                : "Click to upload your demo files"
                                            }
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            MP3, WAV, FLAC supported • Max 10 files
                                        </span>
                                    </Label>
                                </div>
                                {formData.demos.length > 0 && (
                                    <div className="text-xs text-muted-foreground">
                                        Files: {formData.demos.map(file => file.name).join(", ")}
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 via-violet-500 to-pink-400 hover:opacity-90 transition-opacity"
                                size="lg"
                            >
                                Submit Demo
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}