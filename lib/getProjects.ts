import { supabase } from "./supabaseClient";

export const getProjects = async () => {
  const { data, error } = await supabase.from("projects").select("*");
  if (error) {
    console.error("Supabase error:", error);
    return [];
  }
  return data;
};
