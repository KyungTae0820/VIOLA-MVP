"use client";
import { useRef } from "react";
import AutoSubmitDemo from "@/components/animation/AutoSubmitDemo";

export default function AutoSubmitDemoPreview() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative aspect-video bg-gray-50 overflow-hidden">
      {/* 내부 스크롤 컨테이너 (여기가 움직여요) */}
      <div
        ref={scrollRef}
        className="absolute inset-0 mx-auto w-full max-w-[1024px] overflow-y-auto scroll-smooth"
        // 미세하게 더 작게 보이고 싶으면 scale 조정
        style={{ transform: "scale(0.8)", transformOrigin: "top center" }}
      >
        {/* 실제 폼을 그대로 렌더 (demoMode 켜기) */}
        <AutoSubmitDemo demoMode />
      </div>
    </div>
  );
}
