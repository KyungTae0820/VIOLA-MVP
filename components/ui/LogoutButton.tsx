'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/landing");
    };

    return (
        <Button
            className="w-full mt-4 bg-red-100 text-red-600 hover:bg-red-200"
            onClick={handleLogout}
        >
            Logout
        </Button>
    );
}