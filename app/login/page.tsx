'use client';

import { useRouter } from 'next/navigation';
import { useSignIn, useClerk } from '@clerk/nextjs';
import { SignUpButton } from '@clerk/nextjs';
import { useState, useEffect, useRef } from 'react';
import type { IconType } from 'react-icons';
import { FaGoogle, FaLinkedin } from 'react-icons/fa';
import { supabase } from "@/lib/supabaseClient";

function SocialDisabledBtn({
    icon: Icon,
    label,
    message = 'Social sign-in is unavailable right now. Please use email & password or Sign up below.',
}: {
    icon: IconType;
    label: string;
    message?: string;
}) {
    const [show, setShow] = useState(false);
    const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const timer = useRef<number | null>(null);

    useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

    const revealAt = (x: number, y: number, autoHide = true) => {
        setShow(true);
        setPos({ x, y });
        if (autoHide) {
            if (timer.current) window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setShow(false), 2000);
        }
    };

    return (
        <>
            <button
                type="button"
                aria-disabled="true"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
                onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
                onClick={(e) => { e.preventDefault(); revealAt(e.clientX, e.clientY); }}
                onTouchStart={(e) => {
                    e.preventDefault(); const t = e.touches[0];
                    if (t) revealAt(t.clientX, t.clientY);
                }}
                className="w-full flex items-center justify-center gap-2 border px-4 py-2.5 rounded-md opacity-60 grayscale cursor-not-allowed select-none" title="Unavailable now" >
                <Icon className="text-lg" /> {label} </button>
            <div
                className={`fixed z-[9999] pointer-events-none transition-opacity duration-150 ${show ? 'opacity-100' : 'opacity-0'}`}
                style={{ left: pos.x, top: pos.y, transform: 'translate(-50%, -130%)' }}
                role="tooltip"
            >
                <div className="rounded-md bg-gray-100 text-red-600 text-xs px-3 py-1 shadow border border-gray-300 whitespace-nowrap">
                    {message}
                </div>
            </div>
        </>
    );
}

export default function LoginPage() {
    const router = useRouter();
    const { signIn, setActive } = useSignIn();
    const { signOut } = useClerk();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                await (window as any).Clerk?.load?.();
                await (window as any).Clerk?.session?.end?.();
            } finally {
                setChecking(false);
            }
        })();
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-500">Redirecting...</p>
            </div>
        );
    }

    const handleLogin = async () => {
        try {
            setErrorMsg('');
            if (!signIn) { setErrorMsg("SignIn not ready"); return; }

            const result = await signIn.create({ identifier: username, password });
            if (result.status === "complete" && result.createdSessionId) {
                await setActive({ session: result.createdSessionId });

                await (window as any).Clerk?.load?.();
                const clerkUserId: string | undefined = (window as any).Clerk?.user?.id;

                if (!clerkUserId) {
                    router.replace("/completeProfile");
                    return;
                }

                const { data, error } = await supabase
                    .from("profiles")
                    .select("onboarded")
                    .eq("id", clerkUserId)
                    .single();

                if (error || !data) {
                    router.replace("/completeProfile");
                } else {
                    router.replace(data.onboarded ? "/dashboard" : "/completeProfile");
                }
            } else {
                setErrorMsg("Login not complete.");
            }
        } catch (err: any) {
            setErrorMsg(err?.errors?.[0]?.message || err?.message || "Login failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-md flex flex-col lg:flex-row overflow-hidden">
                <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-purple-400 to-yellow-200 items-center justify-center">
                    <img src="/assets/viola.jpg" alt="The Viola" className="w-[80%] max-w-[400px] rounded-2xl shadow-lg" />
                </div>

                <div className="w-full lg:w-1/2 p-8 space-y-6 flex flex-col justify-center">
                    <h1 className="text-2xl font-bold text-center">Sign in to VIOLA</h1>
                    <p className="text-sm text-center text-gray-500">Welcome back! Please sign in to continue</p>

                    <div className="flex gap-4 w-full">
                        <div className="flex-1 min-w-[160px]">
                            <SocialDisabledBtn icon={FaGoogle} label="Google" />
                        </div>
                        <div className="flex-1 min-w-[160px]">
                            <SocialDisabledBtn icon={FaLinkedin} label="LinkedIn" />
                        </div>
                    </div>

                    <div className="flex items-center my-2">
                        <div className="flex-grow border-t border-gray-200" />
                        <span className="mx-2 text-gray-400 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-200" />
                    </div>

                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full border px-4 py-2 rounded-md"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border px-4 py-2 rounded-md"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={handleLogin}
                        className="w-full bg-black text-white py-2 rounded-md hover:opacity-90"
                    >
                        Continue
                    </button>

                    {errorMsg && (
                        <p className="text-center text-red-500 text-sm">{errorMsg}</p>
                    )}

                    <div className="text-center text-sm text-gray-600">
                        Don’t have an account{' '}
                        <SignUpButton mode="modal">
                            <span className="text-black font-medium cursor-pointer hover:underline">
                                Sign up
                            </span>
                        </SignUpButton>
                    </div>

                    <p className="text-center text-sm text-gray-500 hover:text-gray-600 underline cursor-pointer">
                        Forgot username or password?
                    </p>
                </div>
            </div>
        </div>
    );
}


