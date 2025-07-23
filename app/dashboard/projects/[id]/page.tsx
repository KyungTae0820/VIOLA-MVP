"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge, Card, CardContent } from '@/components/ui';
import {
  Calendar,
  ChevronDown,
  Coffee,
  Copy,
  FileText,
  Folder,
  RotateCcw,
  RotateCw,
  Shield,
  Users,
  Camera,
  Video,
  Mic,
  Music,
  Headphones,
  Building,
  Settings
} from 'lucide-react';
import Link from "next/link";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).single();
      if (error) {
        console.error("Error fetching project:", error);
      } else {
        setProject(data);
      }
    };

    if (id) fetchProject();
  }, [id]);

  if (!project) return <div className="p-6">Loading...</div>;

  return (
    <div className="h-screen w-screen overflow-hidden relative bg-grid bg-fixed">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition">
                <span className="text-4xl font-bold">VIOLA.</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
              <Calendar className="h-4 w-4" />
              <Folder className="h-4 w-4" />
              <RotateCcw className="h-4 w-4" />
              <RotateCw className="h-4 w-4" />
            </div>

            {/* Collaborators */}
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="/assets/jacksonwang.jpg" />
                  <AvatarFallback>JW</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="/assets/bumzu.jpg" className="object-cover w-full h-full object-[80%_center]" />
                  <AvatarFallback>BZ</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                  <AvatarFallback>RC</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-sm text-gray-600">+3 others</span>
            </div>

            {/* Project Info */}
            <div className="flex items-center space-x-4 bg-gray-50 rounded-lg px-4 py-2">
              <FileText className="h-4 w-4" />
              <span className="font-medium">{project.name || "Untitled Song Plan"}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{project.type || "Single"}</span>
                <ChevronDown className="h-4 w-4" />
              </div>
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

      <div className="h-screen w-full relative overflow-hidden">
        {/* Tool Library (floating sidebar) */}
        <aside className="fixed top-[150px] left-6 w-72 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 z-20">
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-5">
              <Settings className="h-5 w-5 mr-2" />
              Tool Library
            </h2>

            <div className="space-y-6">
              {/* Song Development */}
              <div>
                <h3 className="text-sm text-gray-500 uppercase mb-2">Song Development</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <Coffee className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Talent</span>
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <Music className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Producer</span>
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <Mic className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Sound Engineer</span>
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <Headphones className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Mixing Engineer</span>
                  </div>
                </div>
              </div>

              {/* Song Promotion */}
              <div>
                <h3 className="text-sm text-gray-500 uppercase mb-2">Song Promotion</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <Building className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Venue Management</span>
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Photography</span>
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <Video className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Music Video</span>
                  </div>
                </div>
              </div>

              {/* General */}
              <div>
                <h3 className="text-sm text-gray-500 uppercase mb-2">General</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Artist Security</span>
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-lg cursor-pointer">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-800">Management</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workflow Area */}
        <main className="absolute inset-0 overflow-hidden p-8 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:20px_20px] bg-[#fdf6e3]">
          {/* Artist/Producer Workflow */}
          <div className="relative w-full h-full">
            {/* Jackson Wang - Artist */}
            <div className="absolute top-20 left-100">
              <div className="flex items-center space-x-3 bg-white rounded-full p-3 shadow-lg border">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/assets/jacksonwang.jpg" />
                  <AvatarFallback>JW</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Jackson Wang</div>
                  <div className="text-sm text-gray-500">Artist</div>
                </div>
              </div>
              {/* Yellow dot */}
              <div className="absolute top-10 right-5 w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>

            {/* BUMZU - Producer */}
            <div className="absolute top-20 right-80">
              <div className="flex items-center space-x-3 bg-white rounded-full p-3 shadow-lg border w-50">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/assets/bumzu.jpg" className="object-cover w-full h-full object-[80%_center]" />
                  <AvatarFallback>BZ</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">BUMZU</div>
                  <div className="text-sm text-gray-500">Producer</div>
                </div>
              </div>
            </div>

            {/* Song Title Card */}
            <div className="absolute top-64 left-1/2 transform -translate-x-1/2">
              <Card className="w-80 bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-light text-gray-400">Song Title</h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Release Date</span>
                      <span>07/07/2025</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Label</span>
                      <img src="/assets/88rising.jpg" alt="88rising" className="h-4 w-auto" />
                    </div>
                    <div>
                      <span className="text-gray-600">Credits</span>
                      <div className="flex space-x-2 mt-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/assets/jacksonwang.jpg" />
                          <AvatarFallback>JW</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/assets/bumzu.jpg" className="object-cover w-full h-full object-[80%_center]" />
                          <AvatarFallback>BZ</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Roles</span>
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Jackson Wang</span>
                          <span className="text-pink-500">51.4 Artist</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>BUMZU</span>
                          <span className="text-yellow-500">48.6 Producer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notification Card */}
            <div className="absolute top-140 right-60">
              <div className="bg-white rounded-lg p-4 shadow-lg border border-red-200 max-w-xs">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <div className="font-semibold text-red-600">Needs a Title!!</div>
                    <div className="text-sm text-gray-600 mt-1">Marked for Review by
                      <Badge className="ml-1 bg-green-100 text-green-600 text-xs">A&R</Badge>
                    </div>
                    <Avatar className="h-6 w-6 mt-2">
                      <AvatarImage src="/assets/ryan.jpg" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-white rounded-full px-6 py-3 shadow-lg border">
                <RotateCcw className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-800" />
                <Copy className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-800" />
                <FileText className="h-5 w-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
