"use client";
import { useRef } from "react";
import AutoSubmitDemo from "@/components/animation/AutoSubmitDemo";

export default function AutoSubmitDemoPreview() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative aspect-video bg-gray-50 overflow-hidden">
      <div
        ref={scrollRef}
        className="absolute inset-0 mx-auto w-full max-w-[1024px] overflow-y-auto scroll-smooth"
        style={{ transform: "scale(0.8)", transformOrigin: "top center" }}
      >
        <AutoSubmitDemo demoMode />
      </div>
    </div>
  );
}
