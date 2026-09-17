import { NextResponse } from "next/server";
import { revalidatePublicPages } from "@/lib/publicCache";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

const TABLE = "service_certifications";

function cleanCertificate(body) {
  return {
    service: String(body.service || "").trim(),
    title: String(body.title || "").trim(),
    image: String(body.image || "").trim(),
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const service = searchParams.get("service");

    let query = supabaseAdmin
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (service) query = query.eq("service", service);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const fields = cleanCertificate(await request.json());
    if (!fields.service) return NextResponse.json({ error: "service is required" }, { status: 400 });
    if (!fields.title) return NextResponse.json({ error: "title is required" }, { status: 400 });
    if (!fields.image) return NextResponse.json({ error: "image is required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .insert([fields])
      .select()
      .single();

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
    const id = body.id;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const fields = cleanCertificate(body);
    if (!fields.service) return NextResponse.json({ error: "service is required" }, { status: 400 });
    if (!fields.title) return NextResponse.json({ error: "title is required" }, { status: 400 });
    if (!fields.image) return NextResponse.json({ error: "image is required" }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from(TABLE)
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    revalidatePublicPages();
    return NextResponse.json(data, { status: 200 });
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
