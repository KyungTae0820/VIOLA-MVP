"use client";
import type { JSX } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DemoCursorAPI } from "./DemoCursor";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const waitFor = async (cond: () => boolean, timeout = 25000, step = 60) => {
    const t0 = performance.now();
    while (!cond()) { if (performance.now() - t0 > timeout) throw new Error("waitFor"); await sleep(step); }
};
const center = (el: Element) => {
    const r = (el as HTMLElement).getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
};
const ensureVisible = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    const inView = r.top >= 0 && r.bottom <= window.innerHeight;
    if (!inView) el.scrollIntoView({ block: "center", behavior: "smooth" });
};
async function moveCursorTo(el: HTMLElement, dwell: number) {
    ensureVisible(el);
    const { x, y } = center(el);
    await DemoCursorAPI.moveTo(x, y);
    await sleep(dwell);
}
function pathOf(url: URL) { return url.pathname + (url.search ? url.search : ""); }
async function clickWithNavigate(
    el: HTMLElement,
    pre: number,
    post: number,
    router: ReturnType<typeof useRouter>,
    extraQuery?: Record<string, string>
) {
    const { x, y } = center(el);
    DemoCursorAPI.moveTo(x, y);
    await sleep(pre);
    DemoCursorAPI.click(x, y);
    if (el.tagName === "A") {
        const href = (el as HTMLAnchorElement).getAttribute("href") || "/";
        const url = new URL(href, window.location.origin);
        if (extraQuery) {
            const sp = new URLSearchParams(url.search);
            Object.entries(extraQuery).forEach(([k, v]) => sp.set(k, v));
            url.search = sp.toString();
        }
        router.replace(pathOf(url));
    } else {
        el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));
    }
    await sleep(post);
}
function reelsScroll(el: HTMLElement, px: number, dur: number) {
    const start = el.scrollTop, end = start + px, t0 = performance.now();
    return new Promise<void>(resolve => {
        const step = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            const e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
            el.scrollTop = start + (end - start) * e;
            p < 1 ? requestAnimationFrame(step) : resolve();
        };
        requestAnimationFrame(step);
    });
}
async function preShow(el: HTMLElement, ms: number) {
    const r = el.getBoundingClientRect();
    const x = r.left + r.width * 0.2;
    const y = r.top + r.height * 0.35;
    DemoCursorAPI.moveTo(x, y);
    await sleep(ms);
}

export default function DemoTour(): JSX.Element | null {
    const router = useRouter();
    const sp = useSearchParams();

    const demoOn = sp.get("demo") === "1";
    const embedded = sp.get("embed") === "1";
    const reduced = typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const tempo = Number(sp.get("tempo") ?? "1");
    const T = {
        move: 1000 * tempo,
        hoverBeforeClick: 1000 * tempo,
        afterClick: 800 * tempo,
        waitAfterRoute: 900 * tempo,
        beforeScroll: 900 * tempo,
        scrollDur: 2800 * tempo,
        afterScrollPause: 1500 * tempo,
        loopPause: 1200 * tempo,
        preRoll: 800 * tempo,
        preShow: 500 * tempo,
    };

    useEffect(() => {
        if (!demoOn || reduced) return;

        DemoCursorAPI.show?.(true);
        DemoCursorAPI.setStyle?.("mac");

        let stopped = false;
        const stopOnUser = () => { if (!embedded) stopped = true; };
        window.addEventListener("pointerdown", stopOnUser, { once: true });
        window.addEventListener("keydown", stopOnUser, { once: true });

        (async () => {
            try {
                let primed = false;
                while (!stopped) {
                    if (!primed) {
                        const sx = Math.max(16, Math.round((window.innerWidth || 0) * 0.08));
                        const sy = Math.max(16, Math.round((window.innerHeight || 0) * 0.14));
                        DemoCursorAPI.moveTo(sx, sy);
                        await sleep(T.preRoll);
                        primed = true;
                    }

                    const path = location.pathname;
                    const qs = new URLSearchParams(location.search);

                    if (path === "/dashboard") {
                        await waitFor(() => document.querySelector('[data-tour="go-anr"]') !== null);
                        const go = document.querySelector('[data-tour="go-anr"]') as HTMLElement;
                        await preShow(go, T.preShow);
                        await moveCursorTo(go, T.move);
                        await clickWithNavigate(go, T.hoverBeforeClick, T.afterClick, router, {
                            demo: "1", embed: embedded ? "1" : "0", tempo: String(tempo)
                        });
                        await waitFor(() => location.pathname.startsWith("/dashboard/ardashboard"));
                        await sleep(T.waitAfterRoute);
                        continue;
                    }

                    if (path.startsWith("/dashboard/ardashboard") && !qs.has("artist")) {
                        const cardSel = '[data-tour="artist-card"][data-artist="jackson-wang"]';
                        await waitFor(() => document.querySelector(cardSel) !== null);
                        const card = document.querySelector(cardSel) as HTMLElement;
                        await preShow(card, T.preShow);
                        await moveCursorTo(card, T.move);
                        await clickWithNavigate(card, T.hoverBeforeClick, T.afterClick, router);

                        if (!new URLSearchParams(location.search).has("artist")) {
                            const url = new URL(location.href);
                            const usp = new URLSearchParams(url.search);
                            usp.set("artist", "Jackson Wang");
                            usp.set("demo", "1");
                            usp.set("embed", embedded ? "1" : "0");
                            usp.set("tempo", String(tempo));
                            url.search = usp.toString();
                            router.replace(pathOf(url));
                        }
                        await waitFor(() => new URLSearchParams(location.search).get("artist") === "Jackson Wang");
                        await sleep(T.waitAfterRoute);
                        continue;
                    }

                    if (path.startsWith("/dashboard/ardashboard") && qs.has("artist")) {
                        await waitFor(() => document.querySelector('[data-tour="reels"]') !== null);
                        const reels = document.querySelector('[data-tour="reels"]') as HTMLElement;
                        reels.scrollTo({ top: 0 });
                        await sleep(T.beforeScroll);

                        const maxDown = Math.max(0, reels.scrollHeight - reels.clientHeight - reels.scrollTop);
                        const dy = Math.min(reels.clientHeight * 0.9, maxDown);
                        await reelsScroll(reels, dy, T.scrollDur);
                        await sleep(T.afterScrollPause);

                        const back = new URL(location.origin + "/dashboard");
                        back.search = new URLSearchParams({
                            demo: "1",
                            embed: embedded ? "1" : "0",
                            tempo: String(tempo),
                        }).toString();

                        router.replace(back.pathname + "?" + back.search);
                        await waitFor(() => location.pathname === "/dashboard");
                        await sleep(T.loopPause);
                        continue;
                    }

                    router.replace(`/dashboard?demo=1&embed=${embedded ? "1" : "0"}&tempo=${tempo}`);
                    await waitFor(() => location.pathname === "/dashboard");
                    await sleep(400 * tempo);
                }
            } finally {
                window.removeEventListener("pointerdown", stopOnUser);
                window.removeEventListener("keydown", stopOnUser);
                DemoCursorAPI.show?.(false);
            }
        })();
    }, [demoOn, embedded, tempo, reduced, router]);

    return null;
}
