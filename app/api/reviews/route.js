import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { revalidatePublicPages } from "@/lib/publicCache";

function cleanReview(body = {}) {
  const ratingIsEmpty = body.rating == null || (typeof body.rating === "string" && body.rating.trim() === "");
  const rating = ratingIsEmpty ? Number.NaN : Number(body.rating);

  return {
    name: String(body.name || "").trim(),
    role: String(body.role || "").trim(),
    message: String(body.message || "").trim(),
    avatar_url: String(body.avatar_url || "").trim(),
    rating: Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating * 10) / 10)) : 4.9,
    published: body.published ?? true,
    project_id: body.project_id || null,
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
  };
}

function isMissingColumn(error, column) {
  return error?.message?.includes(column) || error?.details?.includes(column);
}

export async function GET(request) {
  const auth = await requireAdmin(request);
  const isAdmin = auth.ok;

  let query = supabaseAdmin
    .from("reviews")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!isAdmin) query = query.eq("published", true);

  let { data, error } = await query;

  if (error && (isMissingColumn(error, "deleted_at") || isMissingColumn(error, "sort_order"))) {
    let fallback = supabaseAdmin.from("reviews").select("*").order("created_at", { ascending: false });
    if (!isAdmin) fallback = fallback.eq("published", true);
    const result = await fallback;
    if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
    data = result.data;
    error = null;
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const fields = cleanReview(await req.json());
  if (!fields.name) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (!fields.message) return NextResponse.json({ error: "message is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin.from("reviews").insert([fields]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublicPages();
  return NextResponse.json(data);
}

export async function PUT(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const fields = cleanReview(body);
  if (!fields.name) return NextResponse.json({ error: "name is required" }, { status: 400 });
  if (!fields.message) return NextResponse.json({ error: "message is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("reviews")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublicPages();
  return NextResponse.json(data);
}

export async function DELETE(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const { error } = await supabaseAdmin.from("reviews").update({ deleted_at: new Date().toISOString() }).eq("id", id);

  if (error && error.message?.includes("deleted_at")) {
    const { error: delErr } = await supabaseAdmin.from("reviews").delete().eq("id", id);
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
  } else if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePublicPages();
  return NextResponse.json({ success: true });
}

export async function PATCH(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const { id, published } = await req.json();
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
  const { data, error } = await supabaseAdmin.from("reviews").update({ published }).eq("id", id).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublicPages();
  return NextResponse.json(data[0]);
}
