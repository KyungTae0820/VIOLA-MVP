'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectAfterAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data?.session && !error) {
        // Login Success
        router.replace('/completeProfile');
      } else {
        // Login Failed
        router.replace('/login');
      }
    };

    redirectAfterAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg">
      Redirecting...
    </div>
  );
}
