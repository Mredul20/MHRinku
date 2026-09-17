import { NextResponse } from "next/server";
import { revalidatePublicPages } from "@/lib/publicCache";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "1";
  if (admin) {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;
  }

  let query = supabaseAdmin
    .from("team_members")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (!admin) query = query.eq("published", true);

  let { data, error } = await query;

  // Graceful fallback if deleted_at column doesn't exist yet (migration not run)
  if (error && error.message?.includes("deleted_at")) {
    let fallback = supabaseAdmin
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: false });
    if (!admin) fallback = fallback.eq("published", true);
    const result = await fallback;
    if (result.error) return NextResponse.json([], { status: 200 });
    data = result.data;
    error = null;
  }

  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data ?? []);
}


export async function POST(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { name, role, photo_url, bio, published } = body;
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .insert([{ name, role, photo_url: photo_url || "", bio: bio || "", published: published ?? true }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublicPages();
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const body = await req.json();
  const { id, created_at, ...fields } = body;
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("team_members")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublicPages();
  return NextResponse.json(data);
}

export async function PATCH(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const { id, published } = await req.json();
  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("team_members")
    .update({ published })
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

  // Try soft-delete first; fall back to hard delete if column missing
  const { error } = await supabaseAdmin
    .from("team_members")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error && error.message?.includes("deleted_at")) {
    const { error: delErr } = await supabaseAdmin.from("team_members").delete().eq("id", id);
    if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });
  } else if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePublicPages();
  return NextResponse.json({ success: true });
}
