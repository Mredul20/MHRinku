import { NextResponse } from "next/server";
import { revalidatePublicPages } from "@/lib/publicCache";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { sanitizeProjectPayload, validateProjectForPublish } from "@/lib/validators";

function isMissingColumn(error, column) {
  return error?.message?.includes(column) || error?.details?.includes(column);
}

async function getProjects({ isAdmin, category, service, tag }) {
  let query = supabaseAdmin
    .from("projects")
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!isAdmin) query = query.eq("status", "published");
  if (category) query = query.ilike("category", `%${category}%`);
  if (service) query = query.contains("service", [service]);
  if (tag) query = query.contains("tags", [tag]);

  const result = await query;
  if (!result.error) return result;

  if (isMissingColumn(result.error, "status") && !isAdmin) {
    return { data: [], error: null };
  }

  if (isMissingColumn(result.error, "deleted_at") || isMissingColumn(result.error, "status") || isMissingColumn(result.error, "sort_order") || isMissingColumn(result.error, "tags")) {
    let fallback = supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (!isAdmin) fallback = fallback.eq("status", "published");
    if (category) fallback = fallback.ilike("category", `%${category}%`);
    if (service) fallback = fallback.contains("service", [service]);
    return fallback;
  }

  return result;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const service = searchParams.get("service");
    const tag = searchParams.get("tag");
    const auth = await requireAdmin(request);
    const isAdmin = auth.ok;

    const { data, error } = await getProjects({ isAdmin, category, service, tag });
    if (error) throw error;

    return NextResponse.json(data || [], { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch projects" }, { status: 500 });
  }
}

function validateIfPublished(fields) {
  if (fields.status !== "published") return [];
  return validateProjectForPublish(fields);
}

export async function POST(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const fields = sanitizeProjectPayload(body);
    const missingFields = validateIfPublished(fields);
    if (missingFields.length) {
      return NextResponse.json({ error: "Missing required fields before publishing.", missingFields }, { status: 400 });
    }

    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .insert([fields])
      .select()
      .single();
    if (error) throw error;

    revalidatePublicPages();
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: "ID is required for update" }, { status: 400 });

    const fields = sanitizeProjectPayload(body);
    const missingFields = validateIfPublished(fields);
    if (missingFields.length) {
      return NextResponse.json({ error: "Missing required fields before publishing.", missingFields }, { status: 400 });
    }

    const { data: project, error } = await supabaseAdmin
      .from("projects")
      .update(fields)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;

    revalidatePublicPages();
    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("projects")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error && error.message?.includes("deleted_at")) {
      const { error: delErr } = await supabaseAdmin.from("projects").delete().eq("id", id);
      if (delErr) throw delErr;
    } else if (error) {
      throw error;
    }

    revalidatePublicPages();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
