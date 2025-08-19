"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabaseClient";

const CompleteProfile = () => {
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    image: "",
    firstname: "",
    lastname: "",
    bio: "",
    phone: "",
    instagramUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    tag: "", // A&R, producer, artist 등
  });

  // 1. 기존 프로필 데이터 불러오기
  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.warn("Failed to fetch profile:", error.message);
        return;
      }

      if (data) {
        setForm({
          image: data.image || "",
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          bio: data.bio || "",
          phone: data.phone || "",
          instagramUrl: data.instagramUrl || "",
          twitterUrl: data.twitterUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          tag: data.tag || "",
        });

        if (data.image) {
          setImagePreview(data.image);
        }
      }
    };

    fetchProfile();
  }, [userId]);

  // 2. 로그인 및 인증 체크
  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      router.push("/login");
      return;
    }
  }, [isLoaded, userId, router]);

  // 3. 폼 필드 변경 이벤트
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 4. 이미지 변경 핸들러
  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 5. 폼 제출 핸들러
  const handleSubmit = async () => {
    if (!form.firstname.trim() || !form.lastname.trim()) {
      alert("First Name and Last Name are required.");
      return;
    }

    if (!userId || !user) {
      alert("User not found.");
      return;
    }

    let imageUrl = form.image || "";

    // ✅ 여기서 기존 Supabase Storage 업로드 로직 대신 API 호출
    if (imageFile) {
      const ext = imageFile.name.split(".").pop() || "jpg";
      const safeFirst = form.firstname.trim().replace(/\s+/g, "-");
      const path = `${userId}/${Date.now()}-${safeFirst}.${ext}`;

      const fd = new FormData();
      fd.append("file", imageFile);
      fd.append("path", path);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert("Image upload failed: " + (json?.error || `HTTP ${res.status}`));
        return;
      }
      imageUrl = json.url as string;
    }

    // 이후 프로필 DB 업서트
    const { error } = await supabase.from("profiles").upsert(
      [
        {
          id: userId,
          firstname: form.firstname,
          lastname: form.lastname,
          bio: form.bio,
          phone: form.phone,
          instagram_url: form.instagramUrl,
          twitter_url: form.twitterUrl,
          linkedin_url: form.linkedinUrl,
          image: imageUrl,
          email: user.primaryEmailAddress?.emailAddress || "",
          tag: form.tag || null,
          onboarded: true,
        },
      ],
      { onConflict: "id" }
    );

    if (error) {
      alert("Failed to save profile: " + error.message);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Complete Your Profile</h1>

      {/* Image Upload */}
      <div
        className="w-full h-48 border-dashed border-2 flex items-center justify-center rounded-lg cursor-pointer"
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="preview"
            className="h-full object-cover rounded"
          />
        ) : (
          <span className="text-gray-500">Click or drag image here</span>
        )}
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          className="hidden"
          onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
        />
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">First Name *</label>
          <input
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Last Name *</label>
          <input
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
      </div>

      {/* Other Inputs */}
      {[
        "bio",
        "phone",
        "instagramUrl",
        "twitterUrl",
        "linkedinUrl",
        "tag",
      ].map((field) => (
        <div key={field}>
          <label className="block mb-1 capitalize">{field}</label>
          {field === "bio" ? (
            <textarea
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          ) : (
            <input
              name={field}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Save Profile
      </button>
    </div>
  );
};

export default CompleteProfile;
