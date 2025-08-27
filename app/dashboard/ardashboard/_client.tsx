"use client";

import { useRouter } from "next/navigation";
import { ARDashboard } from "@/components/ar/ARDashboard";

export default function Client() {
  const router = useRouter();
  return <ARDashboard onBack={() => router.push("/dashboard")} />;
}
