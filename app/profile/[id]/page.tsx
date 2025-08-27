import { fetchProfileById } from "@/lib/supabase/profile";
import ProfileCard from "@/components/profile/ProfileCard";
import ProjectsSection from "@/components/profile/ProjectsSection";
import { LogoutButton } from "@/components/ui";
import Link from "next/link";

export default async function ProfilePage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const profile = await fetchProfileById(id);

    if (!profile) {
        return <div className="p-8 text-lg">Profile not found</div>;
    }

    return (
        <div className="min-h-screen bg-background">
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
                <div className="mb-12">
                    <ProjectsSection />
                </div>
                <div className="w-fit mx-auto md:mx-0 md:ml-6 mb-6">
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}
