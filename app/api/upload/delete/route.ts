import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path } = await req.json().catch(() => ({}));
  if (!path || typeof path !== "string") {
    return NextResponse.json({ error: "path required" }, { status: 400 });
  }

  // 소유자 폴더 확인
  if (!path.startsWith(`${userId}/`)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.storage.from("profileimages").remove([path]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
