'use client'

import React, { useState } from 'react';
import { Card, CardContent, ListenerGrowthChart, Badge } from "@/components/ui";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { FaInstagram } from "react-icons/fa6";
import { Pencil, ChevronRight, Edit3, Plus as PlusIcon, Unlock } from "lucide-react";
import { ProjectCard } from "@/components/profile/ProjectCard";
import Link from "next/link";
import { types, ProjectType, Project } from "@/types/project";

export default function ArtistDetailPage() {
    const numbersData = [
        { value: '3.91', label: 'Click Through Ratio' },
        { value: '3.91', label: 'Click Through Ratio' },
        { value: '52%', label: 'Audience Gender F-M' },
        { value: '52%', label: 'Audience Gender F-M' },
    ];
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "rename" | "progress" | null>(null);
    const [newProjectType, setNewProjectType] = useState<ProjectType | null>(null);

    const openAddModal = (type: ProjectType) => {
        setNewProjectType(type);
        setModalMode("add");
        setShowModal(true);
    };

    return (
        <div className="mx-auto max-w-screen-lg px-4">
            {/* Page header (can be removed if using a layout header) */}
            <header className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/dashboard" className="text-4xl font-bold hover:opacity-80">VIOLA.</Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                {/* Artist profile section */}
                <section className="col-span-12">
                    <h2 className="text-2xl font-bold mb-6">Your Artists</h2>
                    <div className="bg-card rounded-xl p-6 border">
                        <div className="flex items-start gap-4">
                            <img src="/assets/heresi.jpg" alt="Heresi"
                                className="w-28 h-28 md:w-50 md:h-50 rounded-full object-cover" />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl md:text-3xl font-bold">Heresi</h3>
                                    {/* <img src="/assets/88rising.jpg" alt="88rising"
                                        className="h-10 w-10 md:h-16 md:w-16 ml-2 object-cover rounded-full" /> */}
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="artist">Artist</Badge>
                                    <a href="https://open.spotify.com/artist/3qPFPc3haFWgSUty6yT67l"
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-muted-foreground hover:underline hover:text-green-600 transition">
                                        @heresi
                                    </a>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Heresi is a singer–producer crafting hazy, mood-driven songs where minimal drums, 
                                    layered synths, and intimate vocals meet. Blending R&B grooves with electronic/alt-pop textures, 
                                    Heresi turns night-time cityscapes and fragmented memories into cinematic, slow-burn melodies. On stage, 
                                    sampler-driven performances and live looping bring studio detail to life, leaving a quiet yet resonant afterglow.
                                    <Edit3 className="inline-block w-3 h-3 ml-1" />
                                </p>
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <h4 className="font-semibold">Key Team Contacts</h4>
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                    <div className="flex gap-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="relative w-10 h-10 md:w-12 md:h-12">
                                                <img src="/assets/defaultimg.jpg" alt={`Contact ${i}`} className="w-full h-full rounded-full object-cover" />
                                                {/* <img src="/assets/88rising.jpg" alt="88rising Logo"
                                                    className="absolute w-4 h-4 md:w-5 md:h-5 rounded-full object-cover bottom-0 left-0 border-2 border-white" /> */}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== MOBILE STACK ORDER =====
             1) Discography
             2) Recent Projects
             3) Listener Growth
             4) The Numbers
        ================================= */}
                {/* Upper section: Discography + Recent Projects */}
                <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
                    {/* Discography */}
                    <div className="order-1 md:order-none md:col-span-4">
                        <h3 className="text-xl font-semibold mb-4">Discography</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map(i => (
                                <a key={i}
                                    href="https://open.spotify.com/artist/3qPFPc3haFWgSUty6yT67l"
                                    target="_blank" rel="noopener noreferrer"
                                    className="block rounded-lg overflow-hidden">
                                    <img src={`/assets/heresi.jpg`} alt={`Album ${i}`}
                                        className="w-full aspect-square object-cover" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Recent Projects */}
                    <div className="order-2 md:order-none md:col-span-8">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold">Recent Projects
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black text-white text-xs font-medium ml-2">3</span>
                                </h3>
                                <span className="hidden sm:flex items-center gap-2 text-sm font-medium text-black px-2 py-1 rounded-full bg-gradient-to-l from-green-50 to-green-300">
                                    <Unlock className="w-4 h-4 text-green-800" /> You Have Edit Access
                                </span>
                            </div>
                            <DropdownMenu>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <DropdownMenuTrigger asChild>
                                                <button className="px-3 py-1 text-sm text-black bg-gray-100 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center">
                                                    <PlusIcon className="w-4 h-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent side="top"><p>Add Project</p></TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <DropdownMenuContent align="end" className="w-36">
                                    {types.filter(t => t !== "All").map(t => (
                                        <DropdownMenuItem key={t} onClick={() => openAddModal(t)} className="cursor-pointer text-sm" inset={false}>
                                            {t}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* On mobile: no max-height restriction. On desktop: enable max-h with scroll */}
                        <div className="relative">
                            <div className="rounded-2xl px-1 py-1 space-y-3 max-h-none md:max-h-[310px] md:overflow-y-auto md:overscroll-contain">
                                <ProjectCard projectName="Project Name" type="Single" progress={90} />
                                <ProjectCard projectName="Project Name" type="Single" progress={75} />
                                <ProjectCard projectName="Project Name" type="Album" progress={50} />
                                <ProjectCard projectName="Project Name" type="Single" progress={35} />
                            </div>
                            <div className="hidden md:block pointer-events-none absolute bottom-0 left-0 w-full h-4">
                                <div className="w-full h-full bg-gradient-to-t from-black/40 to-transparent" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lower section: Listener Growth + The Numbers */}
                <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
                    {/* Listener Growth */}
                    <div className="order-3 md:order-none md:col-span-6">
                        <h3 className="text-xl font-semibold mb-4">Listener Growth</h3>
                        <Card>
                            <CardContent className="p-4">
                                <ListenerGrowthChart />
                            </CardContent>
                        </Card>
                    </div>

                    {/* The Numbers */}
                    <div className="order-4 md:order-none md:col-span-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-semibold">The Numbers</h3>
                                <Pencil className="w-4 h-4" />
                            </div>
                            <button className="flex items-center px-4 py-2 bg-white text-black text-sm rounded-full border border-gray-300 hover:bg-gray-100 shadow">
                                View Details <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                            {numbersData.map((item, i) => (
                                <div key={i} className="text-center">
                                    <div className="flex items-center justify-center text-4xl md:text-[64px] font-light mb-1 leading-none">
                                        {item.value}
                                        <FaInstagram className="w-5 h-5 md:w-8 md:h-8 ml-2" />
                                    </div>
                                    <p className="text-sm md:text-[15px] text-muted-foreground">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
