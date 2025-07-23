"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const CompleteProfile = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    phone: "",
    instagramUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    let imageUrl = "";

    if (imageFile) {
      const fileName = `${form.username}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from("profileimages")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        return;
      }

      const { data } = supabase.storage.from("profileimages").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("profiles").insert([
      {
        id: user.id,
        name: form.name,
        username: form.username,
        bio: form.bio,
        phone: form.phone,
        instagramUrl: form.instagramUrl,
        twitterUrl: form.twitterUrl,
        linkedinUrl: form.linkedinUrl,
        image: imageUrl,
        email: user.email,
      },
    ]);

    if (error) {
      alert("Failed to save profile: " + error.message);
    } else {
      router.push(`/dashboard`);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Complete Your Profile</h1>

      <div className="w-full h-48 border-dashed border-2 flex items-center justify-center rounded-lg cursor-pointer" onClick={() => document.getElementById("fileInput")?.click()}>
        {imagePreview ? (
          <img src={imagePreview} alt="preview" className="h-full object-cover rounded" />
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

      {["name", "username", "bio", "phone", "instagramUrl", "twitterUrl", "linkedinUrl"].map((field) => (
        <div key={field}>
          <label className="block mb-1 capitalize">{field}</label>
          {field === "bio" ? (
            <textarea name={field} value={form[field as keyof typeof form]} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          ) : (
            <input name={field} value={form[field as keyof typeof form]} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          )}
        </div>
      ))}

      <button onClick={handleSubmit} className="bg-black text-white px-6 py-2 rounded">
        Save Profile
      </button>
    </div>
  );
};

export default CompleteProfile;
