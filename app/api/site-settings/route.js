import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { revalidatePublicPages } from "@/lib/publicCache";

// GET /api/site-settings – fetch all settings (or a specific key via ?key=xxx)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key) {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("*")
      .eq("key", key)
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("*")
    .order("key");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PUT /api/site-settings – upsert a setting { key, value }
export async function PUT(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const { key, value } = body;

  if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .upsert(
      { key, value: value || "", updated_at: new Date().toISOString() },
      { onConflict: "key" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePublicPages();
  return NextResponse.json(data);
}
