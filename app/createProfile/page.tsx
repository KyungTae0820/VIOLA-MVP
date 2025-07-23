"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const CreateProfile = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrorMsg("");

    // 1. Password match check
    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    // 2. Password length check
    if (form.password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    // 3. Username duplication check
    const { data: existingUsernames, error: usernameCheckError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", form.username);

    if (usernameCheckError) {
      setErrorMsg("Failed to check username availability.");
      return;
    }

    if (existingUsernames && existingUsernames.length > 0) {
      setErrorMsg("Username is already taken.");
      return;
    }

    // 4. Signup with Supabase
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setErrorMsg("Signup failed: " + signUpError.message);
      return;
    }

    alert("Signup successful! Please check your email to verify your account.");
    router.push("/login");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Sign Up</h1>

      {/* Error Message */}
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      {/* Email */}
      <div>
        <label className="block mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Username */}
      <div>
        <label className="block mb-1">Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block mb-1">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleInputChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
      >
        Sign Up
      </button>
    </div>
  );
};

export default CreateProfile;
