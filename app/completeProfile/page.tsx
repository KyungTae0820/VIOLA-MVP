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
    username: "",
    bio: "",
    phone: "",
    instagramUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    tag: "", // A&R, producer, artist 등
  });

  // 1. 프로필 기존 데이터 불러오기
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
          username: data.username || "",
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

  // 2. 기존 로그인/온보딩 체크(useAuth isLoaded, userId 체크는 login 페이지에서)
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
    if (!userId || !user) {
      alert("User not found.");
      return;
    }

    let imageUrl = form.image || "";

    if (imageFile) {
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `${form.username}-${Date.now()}.${fileExtension}`;
      const { error: uploadError } = await supabase.storage
        .from("profileimages")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("profileimages")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("profiles").upsert(
      [
        {
          id: userId,
          firstname: form.firstname,
          lastname: form.lastname,
          username: form.username,
          bio: form.bio,
          phone: form.phone,
          instagramUrl: form.instagramUrl,
          twitterUrl: form.twitterUrl,
          linkedinUrl: form.linkedinUrl,
          image: imageUrl,
          email: user.primaryEmailAddress?.emailAddress || "",
          tag: form.tag || null,
          onboarded: true,
        },
      ],
      {
        onConflict: "id",
      }
    );

    if (error) {
      alert("Failed to save profile: " + error.message);
    } else {
      router.push("/dashboard");
    }
  };

  if (!isLoaded || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Redirecting...</p>
      </div>
    );
  }

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
          <label className="block mb-1">First Name</label>
          <input
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Last Name</label>
          <input
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Other Inputs */}
      {[
        "username",
        "bio",
        "phone",
        "instagramUrl",
        "twitterUrl",
        "linkedinUrl",
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
