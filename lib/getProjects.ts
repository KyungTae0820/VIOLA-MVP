import { supabase } from "./supabaseClient";

export const getProjects = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select(`
      *,
      profiles (
        image
      )
    `);

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  // profiles 테이블에서 조인한 image 값을 project.image로 매핑
  const projects = data.map((project) => ({
    ...project,
    image: project.profiles?.image || "/assets/defaultimg.jpg",
  }));

  return projects;
};
