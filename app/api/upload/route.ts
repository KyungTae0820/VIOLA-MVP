import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(url, serviceKey);

    // 1) Clerk 인증
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2) multipart/form-data
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "file missing" }, { status: 400 });

    // 3) 서버에서 '본인 폴더' 경로 강제 생성 (클라가 path를 주입 못 하게)
    const rawExt = (file.name.split(".").pop() || "jpg").toLowerCase();
    const allowed = ["jpg","jpeg","png","webp","gif"];
    const ext = allowed.includes(rawExt) ? rawExt : "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    // 4) 업로드 (service_role)
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error: uploadError } = await supabase
      .storage.from("profileimages")
      .upload(path, bytes, {
        contentType: file.type || "application/octet-stream",
        cacheControl: "3600",
        upsert: false,
      });
    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    // 5) 공개 URL 반환 (버킷이 private이면 대신 signed URL 생성)
    const { data } = supabase.storage.from("profileimages").getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl, path }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "unknown server error" }, { status: 500 });
  }
}
