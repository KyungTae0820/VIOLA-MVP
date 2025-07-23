import { fetchProfileById } from "@/lib/supabase/profile";
import ProfileCard from "@/components/ProfileCard";
import ProjectsSection from "@/components/ProjectsSection";
import { LogoutButton } from "@/components/ui";

import Link from "next/link"; //페이지 라우팅

interface ProfilePageProps {
    params: { id: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const profile = await fetchProfileById(params.id);

    if (!profile) {
        return <div className="p-8 text-lg">Profile not found</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-white px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition">
                                <span className="text-4xl font-bold">VIOLA.</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
            <div className="min-h-screen bg-background p-6">
                <ProfileCard {...profile} />
                <ProjectsSection />
                <div className="absolute left-50 bottom-2">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}

