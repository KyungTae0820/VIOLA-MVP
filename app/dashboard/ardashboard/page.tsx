import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { ARDashboard } from "@/components/ar/ARDashboard";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Client />
    </Suspense>
  );
}

function Client() {
  "use client";
  const router = useRouter();
  return <ARDashboard onBack={() => router.push("/dashboard")} />;
}
