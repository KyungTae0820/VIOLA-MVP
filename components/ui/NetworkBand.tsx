'use client';

import React, { useEffect, useRef } from 'react';

type Node = { x: number; y: number; vx: number; vy: number };

export default function NetworkBand({
  nodeCount = 100,
  linkDistance = 170,
  highlightEveryMs = 2600,
  beamDurationMs = 2000,
  nodeRadius = 5,
  hubRadius = 14,
  stretchX = 1.4,
  verticalSpread = 0.22,
  marginX,
  linkWidth = 2.0,
  beamWidth = 4.5,
}: {
  nodeCount?: number;
  linkDistance?: number;
  highlightEveryMs?: number;
  beamDurationMs?: number;
  nodeRadius?: number;
  hubRadius?: number;
  stretchX?: number;
  verticalSpread?: number;
  marginX?: number;
  linkWidth?: number;
  beamWidth?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const lastHighlightRef = useRef(0);
  const rippleBaseRef = useRef(0);
  const targetsRef = useRef<number[]>([]);

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // 캔버스 크기 & 리시드
  useEffect(() => {
    const canvas = canvasRef.current!;
    const parent = canvas.parentElement!;

    const reseed = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = Math.floor(parent.clientWidth * dpr);
      const h = Math.floor(parent.clientHeight * dpr);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = parent.clientWidth + 'px';
      canvas.style.height = parent.clientHeight + 'px';

      // 노드 분포를 "가로로 넓은 밴드"로 시드
      const cx = w / 2;
      const cy = h * 0.6; // 기존 위치 느낌(조금 아래쪽)
      const halfV = Math.max(6, (h * verticalSpread) / 2);
      const mx = marginX ?? Math.max(24 * (w / parent.clientWidth), Math.floor(w * 0.02));

      const nodes: Node[] = [];
      for (let i = 0; i < nodeCount; i++) {
        const t = nodeCount === 1 ? 0.5 : i / (nodeCount - 1); // 0..1 균등
        // 균등 분포 + 약한 지터
        let x = mx + t * (w - 2 * mx) + (Math.random() - 0.5) * (w * 0.01);
        // 중심 기준 stretchX로 가로 확대
        x = (x - cx) * stretchX + cx;
        // 좌우 여백 내로 클램프
        x = Math.max(mx, Math.min(w - mx, x));

        const y = cy + (Math.random() - 0.5) * 2 * halfV;
        nodes.push({ x, y, vx: 0, vy: 0 });
      }
      nodesRef.current = nodes;
    };

    reseed();
    const ro = new ResizeObserver(reseed);
    ro.observe(parent);
    return () => ro.disconnect();
  }, [nodeCount, stretchX, verticalSpread, marginX]);

  // 메인 렌더 루프
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const white = (a: number) => `rgba(255,255,255,${a})`;

    const chooseTargets = () => {
      const nodes = nodesRef.current;
      if (nodes.length < 2) return;

      const w = canvas.width;
      const leftIdx = nodes
        .map((n, i) => [n.x, i] as const)
        .filter(([x]) => x < w * 0.33)
        .map(([, i]) => i);
      const rightIdx = nodes
        .map((n, i) => [n.x, i] as const)
        .filter(([x]) => x > w * 0.67)
        .map(([, i]) => i);

      const pick = (arr: number[]) => arr[Math.floor(Math.random() * arr.length)];
      if (leftIdx.length && rightIdx.length) {
        targetsRef.current = [pick(leftIdx), pick(rightIdx)];
      } else {
        // 좌/우가 충분치 않은 경우 임의 쌍
        const all = nodes.map((_, i) => i);
        const a = pick(all);
        let b = pick(all);
        if (a === b && all.length > 1) b = pick(all.filter((i) => i !== a));
        targetsRef.current = [a, b];
      }
    };

    const step = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h * 0.6;

      ctx.clearRect(0, 0, w, h);

      if (!reduce && t - lastHighlightRef.current > highlightEveryMs) {
        lastHighlightRef.current = t;
        rippleBaseRef.current = t;
        chooseTargets();
      }

      // 링크
      const nodes = nodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        const ni = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const nj = nodes[j];
          const dx = ni.x - nj.x;
          const dy = ni.y - nj.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const a = (1 - dist / linkDistance) * (reduce ? 0.2 : 0.32);
            ctx.strokeStyle = white(a);
            ctx.lineWidth = linkWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(ni.x, ni.y);
            ctx.lineTo(nj.x, nj.y);
            ctx.stroke();
          }
        }
      }

      // 노드
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.beginPath();
        ctx.fillStyle = white(0.98);
        ctx.arc(n.x, n.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 중앙 허브 + 텍스트
      ctx.beginPath();
      ctx.fillStyle = white(1);
      ctx.arc(cx, cy, hubRadius, 0, Math.PI * 2);
      ctx.fill();

      const centerSize = Math.max(18, Math.floor(h / 24));
      ctx.font = `${centerSize}px Inter, ui-sans-serif, system-ui`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = white(1);
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 10;
      ctx.fillText('A&R', cx, cy + hubRadius + 6);
      ctx.shadowBlur = 0;

      // 하이라이트 빔
      if (!reduce && targetsRef.current.length === 2) {
        const [i1, i2] = targetsRef.current;
        const prog = Math.min(1, (t - lastHighlightRef.current) / beamDurationMs);
        const drawBeam = (tx: number, ty: number) => {
          const hx = cx + (tx - cx) * prog;
          const hy = cy + (ty - cy) * prog;
          ctx.strokeStyle = white(0.98);
          ctx.lineWidth = 3.6;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(hx, hy);
          ctx.stroke();
          ctx.shadowColor = white(1);
          ctx.shadowBlur = 18;
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(hx, hy, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        };
        const n1 = nodes[i1];
        const n2 = nodes[i2];
        if (n1 && n2) {
          drawBeam(n1.x, n1.y);
          drawBeam(n2.x, n2.y);
        }
      }

      // 허브 리플
      const base = rippleBaseRef.current;
      const waves = 3;
      const gap = 360;
      for (let k = 0; k < waves; k++) {
        const dt = (t - (base + k * 260)) / 1000;
        const r = dt * gap;
        if (r <= 0) continue;
        const alpha = Math.max(0, 0.4 - dt * 0.26);
        if (alpha <= 0) continue;
        ctx.beginPath();
        ctx.strokeStyle = white(alpha);
        ctx.lineWidth = 2.4;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [linkDistance, highlightEveryMs, beamDurationMs, nodeRadius, hubRadius, reduce]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full mix-blend-screen" />;
}
