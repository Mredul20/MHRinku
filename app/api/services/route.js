import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/validators";
import { NextResponse } from "next/server";
import { revalidatePublicPages } from "@/lib/publicCache";

const TABLE = "services";

function cleanService(body = {}) {
  const title = String(body.title || "").trim();
  return {
    icon: String(body.icon || "").trim(),
    title,
    short_description: String(body.short_description || "").trim(),
    bullet_points: Array.isArray(body.bullet_points) ? body.bullet_points.map((item) => String(item).trim()).filter(Boolean) : [],
    slug: slugify(body.slug || title),
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
    published: body.published ?? true,
    meta_title: String(body.meta_title || "").trim(),
    meta_description: String(body.meta_description || "").trim(),
    og_image: String(body.og_image || "").trim(),
  };
}

function validate(fields) {
  if (!fields.title) return "title is required";
  if (!fields.slug) return "slug is required";
  return "";
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const auth = await requireAdmin(request);
  const isAdmin = auth.ok;

  try {
    let query = supabaseAdmin
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!isAdmin) query = query.eq("published", true);
    if (slug) query = query.eq("slug", slug);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(slug ? data?.[0] || null : data || []);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const fields = cleanService(await request.json());
    const validationError = validate(fields);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const { data, error } = await supabaseAdmin.from(TABLE).insert([fields]).select().single();
    if (error) throw error;
    revalidatePublicPages();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const fields = cleanService(body);
    const validationError = validate(fields);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", body.id)
      .select()
      .single();
    if (error) throw error;
    revalidatePublicPages();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const { error } = await supabaseAdmin.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    revalidatePublicPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
