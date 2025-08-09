'use client';

import { useRouter } from 'next/navigation';
import { useSignIn, useAuth, useClerk } from '@clerk/nextjs';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { FaGoogle, FaLinkedin } from 'react-icons/fa';
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
    const router = useRouter();
    const { signIn, setActive } = useSignIn();
    const { userId } = useAuth();
    const { signOut } = useClerk();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        signOut().finally(() => setChecking(false));
    }, []);

    useEffect(() => {
        if (checking || !userId) return;

        const checkProfile = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("onboarded")
                .eq("id", userId)
                .single();

            if (error || !data) {
                router.replace("/completeProfile");
            } else {
                router.replace(data.onboarded ? "/dashboard" : "/completeProfile");
            }
        };

        checkProfile();
    }, [checking, userId]);

    if (checking || userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-gray-500">Redirecting...</p>
            </div>
        );
    }

    const handleLogin = async () => {
        try {
            if (!signIn) {
                setErrorMsg("SignIn not ready");
                return;
            }

            const result = await signIn.create({
                identifier: username,
                password,
            });

            if (result.status === "complete" && result.createdSessionId) {
                await setActive({ session: result.createdSessionId });
            } else {
                setErrorMsg("Login not complete.");
            }
        } catch (err: any) {
            setErrorMsg(err.errors?.[0]?.message || err.message || "Login failed.");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-5xl bg-white rounded-xl shadow-md flex flex-col lg:flex-row overflow-hidden">
                {/* Left image logo */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-purple-400 to-yellow-200 items-center justify-center">
                    <img
                        src="/assets/viola.jpg"
                        alt="The Viola"
                        className="w-[80%] max-w-[400px] rounded-2xl shadow-lg"
                    />
                </div>

                {/* Right login section */}
                <div className="w-full lg:w-1/2 p-8 space-y-6 flex flex-col justify-center">
                    <h1 className="text-2xl font-bold text-center">Sign in to VIOLA</h1>
                    <p className="text-sm text-center text-gray-500">
                        Welcome back! Please sign in to continue
                    </p>

                    {/* Social login */}
                    <div className="flex space-x-4 justify-center">
                        <SignInButton mode="redirect">
                            <button className="flex items-center justify-center gap-2 border w-full px-4 py-2 rounded-md hover:bg-gray-100">
                                <FaGoogle className="text-lg" />
                                Google
                            </button>
                        </SignInButton>
                        <SignInButton mode="redirect">
                            <button className="flex items-center justify-center gap-2 border w-full px-4 py-2 rounded-md hover:bg-gray-100">
                                <FaLinkedin className="text-lg text-blue-700" />
                                LinkedIn
                            </button>
                        </SignInButton>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-2">
                        <div className="flex-grow border-t border-gray-200" />
                        <span className="mx-2 text-gray-400 text-sm">or</span>
                        <div className="flex-grow border-t border-gray-200" />
                    </div>

                    {/* Username/password login */}
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

                    {/* Bottom signup link */}
                    <div className="text-center text-sm text-gray-600">
                        Don’t have an account?{' '}
                        <SignUpButton mode="modal">
                            <span className="text-black font-medium cursor-pointer hover:underline">
                                Sign up
                            </span>
                        </SignUpButton>
                    </div>

                    {/* Forgot username/password */}
                    <p className="text-center text-sm text-gray-500 hover:text-gray-600 underline cursor-pointer">
                        Forgot username or password?
                    </p>
                </div>
            </div>
        </div>
    );
}