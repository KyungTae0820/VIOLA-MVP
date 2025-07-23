import { createServerSupabaseClient } from "@/lib/supabaseServer"; 
import { fetchProfileById } from "@/lib/supabase/profile";
import ProfileCard from "@/components/ProfileCard";
import ProjectsSection from "@/components/ProjectsSection";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui";
import Link from "next/link";

const Index = async () => {
    const supabase = createServerSupabaseClient(); 
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const profileData = await fetchProfileById(user.id);

    if (!profileData) {
        redirect("/createProfile");
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
                            <img
                                src="/assets/88rising.jpg"
                                alt="88rising"
                                className="h-16 w-16 ml-2 object-cover rounded-full border-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-end w-full space-x-4">
                        <div className="flex items-center bg-white shadow-md rounded-full px-4 py-2 space-x-3">
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
                            <div>
                                <div className="font-bold text-gray-900">Ryan Chan</div>
                                <Badge variant="ar" className="mt-1">A&R</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="min-h-screen bg-profile-bg">
                <div className="bg-profile-card">
                    <ProfileCard {...profileData} />
                    <ProjectsSection />
                </div>
            </div>
        </div>
    );
};

export default Index;
