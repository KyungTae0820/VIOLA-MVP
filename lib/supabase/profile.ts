import { supabase } from "@/lib/supabaseClient"; // 기존에 만들었던 supabase client 사용

export const fetchProfileById = async (id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id) // filtered by user ID that added on the supabase profile DB
    .single();

  if (error) {
    console.error("Failed to fetch profile:", error.message);
    return null;
  }

  return data;
};