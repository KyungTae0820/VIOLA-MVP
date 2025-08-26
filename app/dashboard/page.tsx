'use client';

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from "@/components/ui/button";
import { Users, Calendar, Workflow } from 'lucide-react';
import Link from "next/link"; //페이지 라우팅
import { UserProfile } from '@/types/profile';
import { useAuth } from "@clerk/nextjs";

const Dashboard = () => {
    //Login
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { userId, isLoaded } = useAuth();

    const BUCKET = 'profileimages';

    async function findLatestAvatarPath(userId: string) {
        const folder = userId; //ex: user_31WhkFNDWJD6tfd1A6yM1cJzxu5 from Clerk
        const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
            limit: 50,
            sortBy: { column: 'updated_at', order: 'desc' },
        });
        if (error || !data?.length) return undefined;
        return `${folder}/${data[0].name}`;
    }

    async function getAvatarSignedUrl(path?: string | null, ttlSec = 60 * 60 * 24) {
        if (!path) return undefined;
        const { data, error } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(path, ttlSec);
        if (error) return undefined;
        return `${data.signedUrl}${data.signedUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
    }

    useEffect(() => {
        (async () => {
            if (!isLoaded) return;
            if (!userId) { setUserProfile(null); return; }

            // Text Profile
            const { data: profileRow, error: profileErr } = await supabase
                .from('profiles')
                .select('id, firstname, lastname')
                .eq('id', userId)
                .maybeSingle();

            if (profileErr || !profileRow) {
                setUserProfile(null);
                return;
            }

            const latestPath = await findLatestAvatarPath(userId);
            const imageUrl = await getAvatarSignedUrl(latestPath);

            setUserProfile({
                ...(profileRow as UserProfile),
                image: imageUrl ?? '/assets/defaultimg.jpg',
            });
        })();
    }, [userId, isLoaded]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-4xl font-bold">VIOLA.</span>
                            {/* <img
                                src="" //나중에 회사 생기면 따로 넣어야함.
                                alt=""
                                className="h-16 w-16 ml-2 object-cover rounded-full border-none"
                            /> */}
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
                                                    <AvatarImage src="/assets/jacksonwang.jpg" />
                                                    <AvatarFallback>JW</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-neutral-800">Jackson Wang</span>
                                            </div>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Demo Submission */}
                            <Card className="h-full">
                                <CardHeader className="pb-3">
                                    <div className="w-full flex flex-wrap items-center sm:flex-nowrap sm:justify-between gap-2">
                                        {/* Recent project title + "Category button" dropdown */}
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
                                    <div
                                        className="absolute inset-4 md:inset-6 rounded-xl overflow-hidden
                                        flex items-center justify-center
                                        bg-[linear-gradient(135deg,_#7C3AED_0%,_#8B5CF6_15%,_#A78BFA_30%,_#C4B5FD_48%,_#E9D5FF_65%,_#FDE68A_100%)]
                                        text-white font-semibold tracking-wide
                                        ring-1 ring-neutral-300/70 shadow-md
                                        transition-all duration-200 hover:shadow-xl hover:brightness-105"
                                    >
                                        <span className="whitespace-nowrap text-lg md:text-2xl lg:text-3xl font-semibold leading-none">
                                            Go to A&R Dashboard
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Project Development */}
                            <Card className="h-full">
                                <CardHeader className="pb-3">
                                    <div className="w-full flex flex-wrap items-center sm:flex-nowrap sm:justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <CardTitle className="flex items-center space-x-3">
                                                <Workflow className="h-5 w-5" />
                                                <span>Project Development</span>
                                            </CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="relative p-6 overflow-hidden">
                                    <div className="min-h-[clamp(240px,22vw,300px)]" />
                                    <div className="absolute inset-4 md:inset-6 rounded-xl overflow-hidden
                                        flex items-center justify-center ring-1 ring-neutral-300/70 shadow-md pointer-events-none">
                                        <div
                                            aria-hidden
                                            className="absolute inset-0 bg-center bg-cover blur-[30px] scale-110"
                                            style={{ backgroundImage: "url('/assets/project.jpg')" }}
                                        />
                                        <div aria-hidden className="absolute inset-0 bg-white/5 mix-blend-screen" />
                                        <span className="relative z-10 text-sm font-semibold text-neutral-700">
                                            Unavailable now
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* viola logo */}
                    <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen mt-4 select-none">
                        <div className="relative h-[200px] md:h-[300px]">
                            <div className="absolute inset-0 bg-[linear-gradient(135deg,_#7C3AED_0%,_#8B5CF6_15%,_#A78BFA_30%,_#C4B5FD_48%,_#E9D5FF_65%,_#FDE68A_100%)]" />
                            <div className="absolute inset-0 opacity-50
                                bg-[radial-gradient(1200px_400px_at_80%_120%,rgba(255,255,255,0.5),transparent)]" />
                            {/* Center Text */}
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
            </div >
        </div >
    );
};

export default Dashboard;