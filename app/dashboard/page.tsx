'use client'

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getProjects } from '@/lib/getProjects'
import { Badge, Button, Input, CircularProgress } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"; //For 툴팁
import { Bell, ChevronDown, Search, Users, Calendar, Plus as PlusIcon } from 'lucide-react';
import Link from "next/link"; //페이지 라우팅
import { types, ProjectType, Project } from "@/types/project";
import { UserProfile } from '@/types/profile';
import { useAuth } from "@clerk/nextjs";

const dashboard = () => {
    const [filter, setFilter] = useState("Category");

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
    //Login
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const { userId, isLoaded } = useAuth();

    //Filtering project
    let filteredProjects: Project[] = [];
    if (filter === "Category" || filter === "All") {
        filteredProjects = projects;
    } else {
        filteredProjects = projects.filter((project) => project.type === filter);
    }

    //Adding Project into DB and Frontend
    const addNewProject = async () => {
        if (!userProfile) return; //No User? No Return

        if (newProjectType && modalValue.trim()) {
            const newProject: Omit<Project, "id"> = {
                name: modalValue.trim(),
                type: newProjectType,
                members: [],
                progress: "0",
                badgeColor: "bg-gray-200 text-gray-600",
                image: userProfile.image || "/assets/defaultimg.jpg",
            };

            const { data, error } = await supabase
                .from("projects")
                .insert([{
                    ...newProject,
                    user_id: userProfile.id,
                }])
                .select("*");

            if (error) {
                console.error("Failed to add project:", error);
                return;
            }

            if (data && data.length > 0) {
                setProjects((prev) => [...prev, data[0]]);
            }
        }
    };

    //Deleting Project from DB and Frontend
    const handleDeleteProject = async () => {
        if (deleteProjectIndex === null) return;

        const projectToDelete = projects[deleteProjectIndex];

        const { error } = await supabase
            .from("projects")                     // 테이블 이름
            .delete()                            // 삭제 쿼리
            .eq("id", projectToDelete.id);      // 해당 id와 일치하는 row 삭제

        if (error) {
            console.error("Delete failed:", error);
            return;
        }
        //frontend Deletion
        setProjects((prev) =>
            prev.filter((_, i) => i !== deleteProjectIndex)
        );
        //Reinitialize state
        setDeleteProjectIndex(null);
        setShowDeleteModal(false);
    };


    const openAddModal = (type: ProjectType) => {
        setNewProjectType(type);
        setModalMode("add");
        setModalValue("");
        setShowModal(true);
    };

    const openRenameModal = (index: number) => {
        setEditProjectIndex(index);
        setModalMode("rename");
        setModalValue(projects[index].name);
        setShowModal(true);
    };

    const openProgressModal = (index: number) => {
        setEditProjectIndex(index);
        setModalMode("progress");
        setModalValue(projects[index].progress);
        setShowModal(true);
    };

    const handleModalConfirm = async () => {
        if (modalMode === "add") {
            await addNewProject();
        }

        if (modalMode === "rename" && editProjectIndex !== null) {
            const project = projects[editProjectIndex];

            const { error } = await supabase
                .from("projects")
                .update({ name: modalValue.trim() })
                .eq("id", project.id);

            if (error) {
                console.error("Rename failed:", error);
                return;
            }

            setProjects((prev) => {
                const updated = [...prev];
                updated[editProjectIndex] = {
                    ...updated[editProjectIndex],
                    name: modalValue.trim(),
                };
                return updated;
            });
        }

        if (modalMode === "progress" && editProjectIndex !== null) {
            const project = projects[editProjectIndex];

            const { error } = await supabase
                .from("projects")
                .update({ progress: modalValue.trim() })
                .eq("id", project.id);

            if (error) {
                console.error("Update progress failed:", error);
                return;
            }

            setProjects((prev) => {
                const updated = [...prev];
                updated[editProjectIndex] = {
                    ...updated[editProjectIndex],
                    progress: modalValue.trim(),
                };
                return updated;
            });
        }

        setShowModal(false);
        setModalMode(null);
        setModalValue("");
        setEditProjectIndex(null);
        setNewProjectType(null);
    };

    //Right Click Context Menu
    useEffect(() => {
        const handleClick = () => {
            setContextMenu({ visible: false, x: 0, y: 0, projectIndex: null });
        };
        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    //Supabase DB 
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (err) {
                console.error("Failed to fetch projects:", err);
            }
        };

        fetchProjects();
    }, []);

    const isModalActive = showModal && modalMode === "add";

    const BUCKET = 'profileimages';

    // 최신 파일 경로 찾기
    async function findLatestAvatarPath(userId: string) {
        const folder = userId; // 예: user_31WhkFNDWJD6tfd1A6yM1cJzxu5
        const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
            limit: 50,
            sortBy: { column: 'updated_at', order: 'desc' },
        });
        if (error || !data?.length) return undefined;
        return `${folder}/${data[0].name}`;
    }

    // 항상 사인드 URL로 생성 (24시간 유효)
    async function getAvatarSignedUrl(path?: string | null, ttlSec = 60 * 60 * 24) {
        if (!path) return undefined;
        const { data, error } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(path, ttlSec);
        if (error) return undefined;
        // 캐시 무효화 쿼리 추가(이미지 교체 즉시 반영)
        return `${data.signedUrl}${data.signedUrl.includes('?') ? '&' : '?'}v=${Date.now()}`;
    }

    useEffect(() => {
        (async () => {
            if (!isLoaded) return;
            if (!userId) { setUserProfile(null); return; }

            // 1) 텍스트 프로필
            const { data: profileRow, error: profileErr } = await supabase
                .from('profiles')
                .select('id, firstname, lastname')
                .eq('id', userId)
                .maybeSingle();

            if (profileErr || !profileRow) {
                setUserProfile(null);
                return;
            }

            // 2) 스토리지에서 최신 이미지 경로
            const latestPath = await findLatestAvatarPath(userId);

            // 3) 항상 사인드 URL 사용
            const imageUrl = await getAvatarSignedUrl(latestPath);

            setUserProfile({
                ...(profileRow as UserProfile),
                image: imageUrl ?? '/assets/defaultimg.jpg',
            });
        })();
    }, [userId, isLoaded]);

    //rendering 
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
                        <Link href={`/profile/${userProfile?.id}`}>
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
                <main className="flex-1 p-6 overflow-x-auto" style={{ backgroundColor: 'bg-gray-50' }}>
                    <div className="flex flex-col xl:flex-row xl:items-start gap-6 min-w-[1024px]">
                        {/* Your Artists */}
                        <div className="w-full xl:w-1/3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-3">
                                        <Users className="h-5 w-5" />
                                        <span>Your Artists</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-1">
                                    <Link href="/dashboard/artists">
                                        <div className="flex items-center space-x-3 min-h-[64px] hover:bg-gray-100 rounded-md p-1 cursor-pointer">
                                            <Avatar>
                                                <AvatarImage src="/assets/jacksonwang.jpg" />
                                                <AvatarFallback>JW</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">Jackson Wang</span>
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Notifications */}
                        <div className="w-full xl:w-1/3">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Bell className="h-5 w-5" />
                                            <span>Notifications</span>
                                        </div>
                                        <Badge className="text-white bg-red-500 px-2 py-0.5 rounded-full text-xs min-w-[20px] text-center leading-none">4</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {/* adding card content */}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Projects */}
                        <div className="w-full xl:w-1/3">
                            <Card>
                                <CardHeader>
                                    <div className="w-full flex flex-wrap items-center sm:flex-nowrap sm:justify-between gap-2">
                                        {/* Recent project title + "Category button" dropdown */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <div className="text-lg font-semibold flex items-center gap-2">
                                                <Calendar className="h-5 w-5" />
                                                <span>Recent Projects</span>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="!w-[110px] !min-w-[110px] !max-w-[140px] px-3 py-1 text-sm text-black font-normal bg-white rounded-full border border-gray-100 hover:bg-gray-100 flex items-center justify-between outline outline-1 outline-black">
                                                        <span className="truncate">{filter}</span>
                                                        <ChevronDown className="w-4 h-4 mt-[1px]" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="center" className="!w-[160px] !min-w-[160px] !max-w-[160px]">
                                                    {types.map((type) => (
                                                        <DropdownMenuItem
                                                            key={type}
                                                            onClick={() => setFilter(type)}
                                                            className="cursor-pointer text-sm"
                                                            inset={false}
                                                        >
                                                            {type}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        {/* "Add Project" Button */}
                                        <div className="shrink-0 ml-25">
                                            <DropdownMenu>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        {/* Tooltip Trigger */}
                                                        <TooltipTrigger asChild>
                                                            {/* Dropdown Trigger */}
                                                            <DropdownMenuTrigger asChild>
                                                                <button
                                                                    className="px-3 py-1 text-sm text-black font-normal bg-white rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center outline outline-1 outline-black shrink-0"
                                                                >
                                                                    <PlusIcon className="w-4 h-4" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top">
                                                            <p>Add Project</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                                {/* Dropdown menu content */}
                                                <DropdownMenuContent align="end" className="w-32">
                                                    {types
                                                        .filter((type) => type !== "All")
                                                        .map((type) => (
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
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-4">
                                        {/* Dynamic user-added projects */}
                                        {filteredProjects.map((project, index) => (
                                            <Link key={index} href={`/dashboard/projects/${project.id}`} className="block">
                                                <div
                                                    onContextMenu={(e) => {
                                                        e.preventDefault();
                                                        setContextMenu({ visible: true, x: e.clientX, y: e.clientY, projectIndex: index });
                                                    }}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                                                >
                                                    <div>
                                                        <div className="font-medium">{project.name}</div>
                                                        <div className="text-sm text-gray-500">({project.type})</div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={project.image} />
                                                            <AvatarFallback>PR</AvatarFallback>
                                                        </Avatar>
                                                        <CircularProgress progress={parseInt(project.progress)} />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Click Menu Modal on the Project*/}
                        {contextMenu.visible && (
                            <div
                                className="absolute z-50 bg-white shadow-md rounded border"
                                style={{ top: contextMenu.y, left: contextMenu.x }}
                            >
                                {/* Rename */}
                                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => openRenameModal(contextMenu.projectIndex!)}>Rename</div>
                                {/* Progress Change */}
                                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => openProgressModal(contextMenu.projectIndex!)}>Update Progress</div>
                                {/* Delete */}
                                <div
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        if (contextMenu.projectIndex !== null) {
                                            setDeleteProjectIndex(contextMenu.projectIndex);
                                            setShowDeleteModal(true);
                                        }
                                        setContextMenu({ visible: false, x: 0, y: 0, projectIndex: null });
                                    }}
                                >
                                    Delete
                                </div>
                            </div>
                        )}

                        {/* User Input Interface Modal */}
                        {showModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                                    <h2 className="text-lg font-semibold mb-4">
                                        {modalMode === "add" && `New ${newProjectType} Project`}
                                        {modalMode === "rename" && `Rename Project`}
                                        {modalMode === "progress" && `Update Progress`}
                                    </h2>
                                    <Input
                                        value={modalValue}
                                        onChange={(e) => setModalValue(e.target.value)}
                                        placeholder={modalMode === "progress" ? "Enter new progress (0~100)" : "Enter name"}
                                        className="w-full mb-4"
                                    />
                                    <div className="flex justify-end space-x-2">
                                        <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                        <Button onClick={handleModalConfirm}>
                                            {
                                                (() => {
                                                    if (modalMode === "add") return "Create";
                                                    if (modalMode === "rename") return "Rename";
                                                    return "Update";
                                                })()
                                            }
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Delete Confirmation Check Modal */}
                        {showDeleteModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
                                    <h2 className="text-lg font-semibold mb-4">Delete Project</h2>
                                    <p className="mb-4 text-gray-600">
                                        Are you sure you want to delete this project? This action cannot be undone.
                                    </p>
                                    <div className="flex justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowDeleteModal(false);
                                                setDeleteProjectIndex(null);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button variant="destructive" onClick={handleDeleteProject}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div
                        className="w-full h-[200px] mt-6 rounded-xl overflow-hidden"
                        style={{
                            backgroundImage: "url('/assets/viola.jpg')",
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center 20%',
                        }}
                    />
                </main>
            </div >
        </div >
    );
};

export default dashboard;