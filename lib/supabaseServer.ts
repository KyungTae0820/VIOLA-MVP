import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase"; // Supabase 타입 지정 파일

export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({
    cookies,
  });
};
