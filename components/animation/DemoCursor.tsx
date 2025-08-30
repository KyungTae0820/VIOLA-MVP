"use client";
import { useEffect, useRef } from "react";

type CursorStyle = "mac" | "hand";

export const DemoCursorAPI = {
  _el: null as HTMLDivElement | null,
  _svg: null as SVGSVGElement | null,
  _style: "mac" as CursorStyle,
  _visible: true,
  _anim: 0 as number,
  _x: -100,
  _y: -100,

  bind(el: HTMLDivElement, svg: SVGSVGElement) {
    this._el = el;
    this._svg = svg;
    this.applyStyle();
    el.style.display = this._visible ? "block" : "none";
  },

  moveTo(x: number, y: number, opts?: { duration?: number }): Promise<void> {
    const el = this._el;
    if (!el) return Promise.resolve();

    cancelAnimationFrame(this._anim);

    const sx = this._x, sy = this._y;
    const dx = x - sx, dy = y - sy;
    const dist = Math.hypot(dx, dy);
    const dur = Math.max(220, Math.min(opts?.duration ?? (180 + dist * 0.6), 900));
    const t0 = performance.now();

    return new Promise<void>((resolve) => {
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        const nx = sx + dx * e;
        const ny = sy + dy * e;
        el.style.transform = `translate(${Math.round(nx)}px, ${Math.round(ny)}px)`;
        if (p < 1) {
          this._anim = requestAnimationFrame(step);
        } else {
          this._x = x; this._y = y;
          this._anim = 0;
          resolve();
        }
      };
      this._anim = requestAnimationFrame(step);
    });
  },

  click(x?: number, y?: number) {
    const el = this._el; if (!el) return;
    if (typeof x === "number" && typeof y === "number") {
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
      this._x = x; this._y = y;
    }
    el.animate(
      [
        { transform: el.style.transform + " scale(1)" },
        { transform: el.style.transform + " scale(0.92)" },
        { transform: el.style.transform + " scale(1)" }
      ],
      { duration: 220, easing: "ease-out" }
    );
    const ring = document.createElement("span");
    ring.className = "demo-cursor-ring";
    el.appendChild(ring);
    ring.animate(
      [
        { opacity: 0.35, transform: "translate(-50%,-50%) scale(0.5)" },
        { opacity: 0,    transform: "translate(-50%,-50%) scale(2.2)" }
      ],
      { duration: 420, easing: "ease-out" }
    ).finished.finally(() => ring.remove());
  },

  show(v: boolean) { this._visible = v; if (this._el) this._el.style.display = v ? "block" : "none"; },
  setStyle(s: CursorStyle) { this._style = s; this.applyStyle(); },

  applyStyle() {
    const svg = this._svg; if (!svg) return;
    if (this._style === "mac") {
      svg.innerHTML =
        `<path d="M2 1 L18 11 L12 12 L15 20 L12.7 21 L9.7 13.3 L6 17 Z"
                fill="white" stroke="#111827" stroke-width="1.25"
                filter="url(#ds)"/>`;
    } else {
      svg.innerHTML =
        `<path d="M10 2c2 0 3 2 3 4v4h2c1 0 2 1 2 2v6c0 2-2 3-3 3H8c-2 0-3-1-3-3v-8c0-2 1-3 3-3h2V6c0-2 1-4 3-4z"
                fill="white" stroke="#111827" stroke-width="1.25"
                filter="url(#ds)"/>`;
    }
  }
};

export default function DemoCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (ref.current && svgRef.current) DemoCursorAPI.bind(ref.current, svgRef.current);
  }, []);

  return (
    <div
      id="demo-cursor"
      ref={ref}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: 24, height: 24,
        transform: "translate(-100px,-100px)",
        zIndex: 2147483647,
        pointerEvents: "none",
        display: "block"
      }}
    >
      <svg
        ref={svgRef}
        width="24" height="24" viewBox="0 0 24 24"
        style={{ position: "absolute", top: "-8px", left: "-4px" }}
      >
        <defs>
          <filter id="ds" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1.2" stdDeviation="1.2"
              floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>
      </svg>

      <style jsx global>{`
        #demo-cursor .demo-cursor-ring{
          position:absolute;
          left:0; top:0;
          width:12px; height:12px;
          border-radius:9999px;
          border:2px solid #6366f1;
          opacity:.35;
          transform:translate(-50%,-50%);
        }
      `}</style>
    </div>
  );
}
