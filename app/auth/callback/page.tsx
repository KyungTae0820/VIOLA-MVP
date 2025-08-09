'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("⏳ Waiting for email verification...");

  useEffect(() => {
    const interval = setInterval(async () => {
      const { data, error } = await supabase.auth.getSession();

      if (data?.session?.user && !error) {
        setStatus("✅ Email Verified! 🥳🎉");
        clearInterval(interval);

        setTimeout(() => {
          router.replace('/completeProfile');
        }, 2000);
      }
    }, 3000); // 3초마다 상태 확인

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-2xl font-bold mb-2">{status}</h1>
        <p className="text-gray-500">
          Please confirm your email in your other device. This page will update automatically.
        </p>
      </div>
    </div>
  );
}
