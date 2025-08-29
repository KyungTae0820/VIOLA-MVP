"use client";
import { useEffect, useMemo, useRef, useState } from "react";

function extractYoutubeId(url: string) {
  const patterns = [
    /youtu\.be\/([^#&?]{11})/,
    /youtube\.com\/.*v=([^#&?]{11})/,
    /youtube\.com\/shorts\/([^#&?]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return "";
}

function getScrollParent(el: HTMLElement | null): HTMLElement | null {
  let node: HTMLElement | null = el;
  while (node) {
    const style = window.getComputedStyle(node);
    const oy = style.overflowY;
    if (/(auto|scroll)/.test(oy) && node.scrollHeight > node.clientHeight) return node;
    node = node.parentElement;
  }
  return null;
}

export default function ReelVideo({
  src,
  poster,
  className,
  loop = true,
}: {
  src: string;
  poster?: string;
  className?: string;
  loop?: boolean;
}) {
  const isYouTube = /youtu\.?be|youtube\.com/.test(src);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [active, setActive] = useState(false);
  const [muted, setMuted] = useState(true);

  const hostRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [interactable, setInteractable] = useState(false);
  const scrollParentRef = useRef<HTMLElement | null>(null);
  const touchYRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    scrollParentRef.current = getScrollParent(hostRef.current);
  }, [hostRef.current]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting && entry.intersectionRatio > 0.6;
          setActive(visible);
          if (videoRef.current) {
            if (visible) videoRef.current.play().catch(() => {});
            else videoRef.current.pause();
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ytSrc = useMemo(() => {
    if (!mounted || !isYouTube) return "";
    const id = extractYoutubeId(src);
    const params = new URLSearchParams({
      autoplay: active ? "1" : "0",
      mute: muted ? "1" : "0",
      playsinline: "1",
      loop: "1",
      playlist: id,
      controls: "0",
      modestbranding: "1",
      rel: "0",
      enablejsapi: "1",
      origin: typeof window !== "undefined" ? window.location.origin : "",
    });
    return `https://www.youtube.com/embed/${id}?${params.toString()}`;
  }, [src, isYouTube, mounted, active, muted]);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (!isYouTube && videoRef.current) {
      videoRef.current.muted = next;
      if (!next) videoRef.current.play().catch(() => {});
    }
    if (isYouTube && iframeRef.current?.contentWindow) {
      const cmd = next ? "mute" : "unMute";
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: cmd, args: [] }),
        "*"
      );
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*"
      );
    }
  };

  const onWheelCapture: React.WheelEventHandler<HTMLDivElement> = (e) => {
    if (interactable) return;
    const parent = scrollParentRef.current;
    if (!parent) return;
    e.preventDefault();
    parent.scrollBy({ top: e.deltaY, behavior: "smooth" });
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (interactable) return;
    touchYRef.current = e.touches[0].clientY;
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (interactable) return;
    const parent = scrollParentRef.current;
    if (!parent || touchYRef.current == null) return;
    const y = e.touches[0].clientY;
    const dy = touchYRef.current - y;
    if (Math.abs(dy) > 0) {
      e.preventDefault();
      parent.scrollBy({ top: dy, behavior: "auto" });
      touchYRef.current = y;
    }
  };
  const onTouchEnd = () => {
    touchYRef.current = null;
  };

  useEffect(() => {
    if (!interactable) return;
    const t = setTimeout(() => setInteractable(false), 6000);
    return () => clearTimeout(t);
  }, [interactable]);

  return (
    <div
      ref={hostRef}
      className={className ?? "w-full h-full rounded-xl overflow-hidden relative"}
    >
      {isYouTube ? (
        mounted ? (
          <iframe
            ref={iframeRef}
            key={ytSrc}
            src={ytSrc}
            className="w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen={false}
          />
        ) : (
          <div className="w-full h-full bg-black" />
        )
      ) : (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={muted}
          playsInline
          loop={loop}
          autoPlay
          className="w-full h-full object-cover"
        />
      )}

      {!interactable && (
        <div
          className="absolute inset-0 z-10"
          onWheel={onWheelCapture}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        />
      )}

      <div className="absolute bottom-3 right-3 z-20 flex gap-2">
        <button
          onClick={toggleMute}
          className="rounded-full bg-black/60 text-white px-3 py-1.5 text-xs backdrop-blur hover:bg-black/70"
        >
          {muted ? "Tap to unmute 🔊" : "Mute 🔇"}
        </button>
        <button
          onClick={() => setInteractable((v) => !v)}
          className="rounded-full bg-black/60 text-white px-3 py-1.5 text-xs backdrop-blur hover:bg-black/70"
        >
          {interactable ? "Lock scroll" : "Interact"}
        </button>
      </div>
    </div>
  );
}
