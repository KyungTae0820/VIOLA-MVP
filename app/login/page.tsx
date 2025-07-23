'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error || !data?.user) {
            setErrorMsg(error?.message || "Login failed.");
            return;
        }

        router.push(`/dashboard`);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Top header */}
            <header className="border-b bg-white px-6 py-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition">
                            <span className="text-4xl font-bold">VIOLA.</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main login section with image and form */}
            <div className="flex flex-col lg:flex-row items-center justify-center px-4 py-50 space-y-12 lg:space-y-0 lg:space-x-16">
                {/* Left image */}
                <div className="w-full lg:w-[400px]">
                    <img
                        src="/assets/viola.jpg"
                        alt="The Viola"
                        className="w-full h-auto rounded-2xl shadow-md"
                    />
                </div>

                {/* Right login form */}
                <div className="flex flex-col items-center space-y-6">
                    <h1 className="text-3xl font-bold">Welcome to VIOLA!</h1>
                    <h2 className="text-2xl font-semibold">Login</h2>
                    <input
                        className="border px-4 py-2 rounded w-64"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="border px-4 py-2 rounded w-64"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className="bg-black text-white px-4 py-2 rounded w-64"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                    <button
                        className="border border-black px-6 py-3 rounded w-72 hover:bg-gray-100"
                        onClick={() => router.push('/createProfile')}
                    >
                        Create New Account
                    </button>
                    {errorMsg && <p className="text-red-500">{errorMsg}</p>}
                </div>
            </div>
        </div>
    );
}
