'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, ListenerGrowthChart, Badge } from "@/components/ui";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"; //For 툴팁
import { FaInstagram } from "react-icons/fa6";
import { Pencil, ChevronRight, Edit3, Plus as PlusIcon, Unlock } from "lucide-react";
import { ProjectCard } from "@/components/profile/ProjectCard";
import Link from "next/link";
import { types, ProjectType, Project } from "@/types/project";

const ArtistDetailPage = () => {
    const numbersData = [
        { value: '3.91', label: 'Click Through Ratio' },
        { value: '3.91', label: 'Click Through Ratio' },
        { value: '52%', label: 'Audience Gender F-M' },
        { value: '52%', label: 'Audience Gender F-M' },
    ];
    const [projects, setProjects] = useState<Project[]>([]);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, projectIndex: null as number | null });

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "rename" | "progress" | null>(null);
    const [newProjectType, setNewProjectType] = useState<ProjectType | null>(null);
    const [modalValue, setModalValue] = useState("");
    const [editProjectIndex, setEditProjectIndex] = useState<number | null>(null);
    //Delete function from Supabase
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteProjectIndex, setDeleteProjectIndex] = useState<number | null>(null);
    const openAddModal = (type: ProjectType) => {
        setNewProjectType(type);
        setModalMode("add");
        setModalValue("");
        setShowModal(true);
    };

    return (
        <div className="mx-auto max-w-screen-lg px-4">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition">
                                <span className="text-4xl font-bold">VIOLA.</span>
                            </Link>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <Link href="/profile">
                        <div className="flex items-center bg-white shadow-md rounded-full px-4 py-2 space-x-3">
                            {/* Profile Image + 88rising Logo */}
                            <div className="relative w-12 h-12">
                                <img
                                    src="/assets/ryan.jpg"
                                    alt="Ryan Chan"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <img
                                    src="/assets/88rising.jpg"
                                    alt="88rising Logo"
                                    className="absolute w-5 h-5 rounded-full object-cover bottom-0 left-0 border-2 border-white"
                                />
                            </div>
                            {/* Name + Badge */}
                            <div>
                                <div className="font-bold text-gray-900">Ryan Chan</div>
                                <Badge variant="ar" className="mt-1">A&R</Badge>
                            </div>
                        </div>
                    </Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12">
                        <h2 className="text-2xl font-bold mb-6">Your Artists</h2>
                        <div className="bg-card rounded-xl p-6 border">
                            <div className="flex items-start gap-4">
                                <img src="/assets/jacksonwang.jpg" alt="Jackson Wang" className="w-50 h-50 rounded-full object-cover" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-3xl font-bold">Jackson Wang</h3>
                                        <img src="/assets/88rising.jpg" alt="88rising" className="h-16 w-16 ml-2 object-cover rounded-full border-none" />
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="artist">Artist</Badge>
                                        <span className="text-muted-foreground">
                                            <a
                                                href="https://open.spotify.com/artist/1kfWoWgCugPkyxQP8lkRlY"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground hover:underline hover:text-green-600 transition"
                                            >
                                                @jacksonwang
                                            </a>
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Jackson Wang, born in Hong Kong, is a solo artist at 88Rising and also part of the Korean boy band GOT7...
                                        <Edit3 className="inline-block w-3 h-3 ml-1" />
                                    </p>
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <h4 className="font-semibold">Key Team Contacts</h4>
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                        <div className="flex gap-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="relative w-12 h-12">
                                                    <img src="/assets/ryan.jpg" alt={`Contact ${i}`} className="w-12 h-12 rounded-full object-cover" />
                                                    <img src="/assets/88rising.jpg" alt="88rising Logo" className="absolute w-5 h-5 rounded-full object-cover bottom-0 left-0 border-2 border-white" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upper */}
                        <div className="flex gap-6 mt-10">
                            {/* Discography */}
                            <div className="w-4/12">
                                <h3 className="text-xl font-semibold mb-4">Discography</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-36 h-36 rounded-lg overflow-hidden">
                                            <a
                                                href="https://open.spotify.com/artist/1kfWoWgCugPkyxQP8lkRlY"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground hover:underline hover:text-green-600 transition"
                                            >
                                                <img src={`/assets/album-${i}.jpg`} alt={`Album ${i}`} className="w-full h-full object-cover" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Recent Project */}
                            <div className="w-8/12">
                                {/* Header Row */}
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-semibold ml-4">
                                            Recent Projects
                                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-black text-white text-sm font-medium ml-1">
                                                3
                                            </span>
                                        </h3>

                                        <div className="flex items-center gap-2 text-sm font-medium text-black px-2 py-1 rounded-full bg-gradient-to-l from-green-50 to-green-300">
                                            <Unlock className="w-4 h-4 text-green-800" />
                                            You Have Edit Access
                                        </div>
                                    </div>

                                    {/* Add Project Button */}
                                    <DropdownMenu>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="px-3 py-1 text-sm text-black font-normal bg-gray-100 rounded-full border border-gray-300 hover:bg-gray-200 flex items-center justify-center mr-5">
                                                            <PlusIcon className="w-4 h-4" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>Add Project</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <DropdownMenuContent align="end" className="w-32">
                                            {types.filter((type) => type !== "All").map((type) => (
                                                <DropdownMenuItem
                                                    key={type}
                                                    onClick={() => openAddModal(type)}
                                                    className="cursor-pointer text-sm"
                                                    inset={false}
                                                >
                                                    {type}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Project Cards Scroll */}
                                <div className="relative">
                                    {/* Example Project Cards: Need to be changed with Supabase, actual user info */}
                                    <div className="max-h-[310px] overflow-y-auto overscroll-contain bg-transparent rounded-2xl px-4 py-2 space-y-3">
                                        <ProjectCard projectName="Project Name" type="Single" progress={90} />
                                        <ProjectCard projectName="Project Name" type="Single" progress={75} />
                                        <ProjectCard projectName="Project Name" type="Album" progress={50} />
                                        <ProjectCard projectName="Project Name" type="Single" progress={35} />
                                    </div>

                                    {/* Fade Shadow*/}
                                    <div className="pointer-events-none absolute bottom-0 left-0 w-full h-4 overflow-hidden z-10 rounded-sm">
                                        <div className="w-full h-full bg-gradient-to-t from-black/40 to-transparent" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lower */}
                        <div className="flex gap-6 mt-5">
                            <div className="flex justify-between items-start gap-16 w-full mt-10">
                                {/* Listener Growth */}
                                <div className="w-1/2">
                                    <h3 className="text-xl font-semibold mb-4">Listener Growth</h3>
                                    <Card>
                                        <CardContent className="p-4">
                                            <ListenerGrowthChart />
                                        </CardContent>
                                    </Card>
                                </div>
                                {/* The Numbers */}
                                <div className="w-full md:w-1/2 px-6 py-4">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-semibold">The Numbers</h3>
                                            <Pencil className="w-4 h-4" />
                                        </div>
                                        <button className="flex items-center px-5 py-2 bg-white text-black text-sm rounded-full border border-gray-300 hover:bg-gray-100 shadow transition">
                                            View Details
                                            <ChevronRight className="w-4 h-4 ml-1" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                                        {numbersData.map((item, i) => (
                                            <div key={i} className="text-center">
                                                <div className="flex items-center justify-center text-[64px] font-light mb-1 leading-none">
                                                    {item.value}
                                                    <FaInstagram className="w-8 h-8 ml-2" />
                                                </div>
                                                <p className="text-[15px] text-muted-foreground">{item.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
};

export default ArtistDetailPage;
