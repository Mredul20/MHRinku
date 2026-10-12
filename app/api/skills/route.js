import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { revalidatePublicPages } from "@/lib/publicCache";

const TABLE = "skills";

function cleanRow(body = {}) {
  const percentage = Number(body.percentage);
  return {
    label: String(body.label || "").trim(),
    percentage: Number.isFinite(percentage) ? Math.max(0, Math.min(100, percentage)) : 0,
    icon: String(body.icon || "").trim(),
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
    published: body.published ?? true,
  };
}

function validate(fields) {
  if (!fields.label) return "label is required";
  return "";
}

export async function GET(request) {
  const auth = await requireAdmin(request);
  const isAdmin = auth.ok;

  try {
    let query = supabaseAdmin.from(TABLE).select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
    if (!isAdmin) query = query.eq("published", true);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const fields = cleanRow(await request.json());
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
    const fields = cleanRow(body);
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
