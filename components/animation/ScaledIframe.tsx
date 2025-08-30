"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Props = {
  src: string;
  width?: number;   // 원래 데스크톱 너비
  height?: number;  // 원래 데스크톱 높이
  className?: string;
  rounded?: string; // tailwind radius e.g. "rounded-xl"
};

export default function ScaledIframe({
  src,
  width = 1280,
  height = 800,
  className = "",
  rounded = "rounded-xl",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      // 컨테이너에 맞춰 가로/세로 중 더 작은 비율로 스케일 결정
      const s = Math.min(w / width, h / height);
      setScale(s);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);

  // 스케일 후에도 컨테이너 중앙 정렬
  const scaledW = width * scale;
  const scaledH = height * scale;

  return (
    <div
      ref={wrapRef}
      className={`relative w-full h-full bg-white ${rounded} overflow-hidden ${className}`}
      // 배경/테두리 느낌
    >
      <div
        className="absolute inset-0 grid place-items-center"
        style={{ padding: 0 }}
      >
        <div
          className="shadow-xl ring-1 ring-black/10 overflow-hidden"
          style={{
            width: scaledW,
            height: scaledH,
            borderRadius: 12,
            transform: `translateZ(0)`,
            willChange: "transform",
          }}
        >
          <iframe
            src={src}
            width={width}
            height={height}
            style={{
              width, height,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              border: "0",
              pointerEvents: "none", // 랜딩에서 클릭 방지(흐름 고정)
            }}
          />
        </div>
      </div>
    </div>
  );
}
