import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/validators";
import { NextResponse } from "next/server";
import { revalidatePublicPages } from "@/lib/publicCache";

const TABLE = "page_meta";

function cleanMeta(body = {}) {
  return {
    slug: slugify(body.slug),
    meta_title: String(body.meta_title || "").trim(),
    meta_description: String(body.meta_description || "").trim(),
    og_image: String(body.og_image || "").trim(),
    updated_at: new Date().toISOString(),
  };
}

export async function GET(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const { searchParams } = new URL(request.url);
  const slug = slugify(searchParams.get("slug"));
  if (!slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });

  try {
    const { data, error } = await supabaseAdmin.from(TABLE).select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return NextResponse.json(data || { slug, meta_title: "", meta_description: "", og_image: "" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const fields = cleanMeta(await request.json());
    if (!fields.slug) return NextResponse.json({ error: "slug is required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .upsert(fields, { onConflict: "slug" })
      .select()
      .single();
    if (error) throw error;
    revalidatePublicPages();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
