'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  items: Array<string | React.ReactNode>;
  speed?: number;               
  gapClassName?: string;         
  className?: string;          
  itemClassName?: string;        
};

export default function InfiniteCarousel({
  items,
  speed = 22,
  gapClassName = 'gap-12 md:gap-16',
  className,
  itemClassName = 'text-white text-base md:text-lg font-semibold whitespace-nowrap',
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);
  const [copies, setCopies] = useState(1);

  useEffect(() => {
    const calc = () => {
      const wrapW = wrapRef.current?.clientWidth ?? 0;
      const seqW  = seqRef.current?.scrollWidth ?? 0;
      if (!wrapW || !seqW) return;

      const need = Math.max(1, Math.ceil(wrapW / seqW) + 1);
      setCopies(need);
    };
    calc();

    const ro = new ResizeObserver(calc);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [items]);

  const oneSequence = Array.from({ length: copies })
    .flatMap((_, c) => items.map((it, i) => ({ key: `s-${c}-${i}`, node: it })));

  return (
    <div ref={wrapRef} className={cn('relative w-full overflow-hidden', className)}>
      <div
        className={cn(
          'ic-strip flex items-center list-none pl-0 m-0 will-change-transform',
          gapClassName,
        )}
        style={{ ['--dur' as any]: `${speed}s` }}
      >
        <ul
          ref={seqRef}
          className={cn('flex items-center list-none pl-0 m-0', gapClassName)}
        >
          {oneSequence.map(({ key, node }) => (
            <li key={key} className={cn('shrink-0 m-0', itemClassName)}>
              {node}
            </li>
          ))}
        </ul>

        <ul
          aria-hidden="true"
          className={cn('flex items-center list-none pl-0 m-0', gapClassName)}
        >
          {oneSequence.map(({ key, node }) => (
            <li key={`dup-${key}`} className={cn('shrink-0 m-0', itemClassName)}>
              {node}
            </li>
          ))}
        </ul>
      </div>

      <style jsx>{`
        /* strip 전체가 자기 너비의 50%만큼만 이동 → 정확히 한 시퀀스 길이 */
        .ic-strip {
          width: max-content;
          animation: ic-scroll var(--dur) linear infinite;
        }
        @keyframes ic-scroll {
          from { transform: translate3d(0,0,0); }
          to   { transform: translate3d(-50%,0,0); }
        }

        /* 모션 민감 모드 */
        @media (prefers-reduced-motion: reduce) {
          .ic-strip { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
