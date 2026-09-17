import { NextResponse } from "next/server";
import { revalidatePublicPages } from "@/lib/publicCache";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

const TABLES = {
  blogs:    { table: "blogs",        labelField: "title" },
  projects: { table: "projects",     labelField: "title" },
  reviews:  { table: "reviews",      labelField: "name"  },
  team:     { table: "team_members", labelField: "name"  },
};

/** GET — list every soft-deleted item across all tables */
export async function GET(request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const results = await Promise.all(
      Object.entries(TABLES).map(async ([type, { table, labelField }]) => {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select("*")
          .not("deleted_at", "is", null)
          .order("deleted_at", { ascending: false });

        if (error || !data) return [];
        return data.map((row) => ({
          ...row,
          _type:  type,
          _table: table,
          _label: row[labelField] || row.id,
        }));
      })
    );

    const flat = results.flat().sort(
      (a, b) => new Date(b.deleted_at) - new Date(a.deleted_at)
    );

    return NextResponse.json(flat);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/** PATCH — restore an item (clear deleted_at) */
export async function PATCH(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { id, type } = await req.json();
    if (!id || !type) return NextResponse.json({ error: "id and type required" }, { status: 400 });

    const { table } = TABLES[type] ?? {};
    if (!table) return NextResponse.json({ error: "Unknown type" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from(table)
      .update({ deleted_at: null })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePublicPages();
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/** DELETE — permanently delete an item */
export async function DELETE(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { id, type } = await req.json();
    if (!id || !type) return NextResponse.json({ error: "id and type required" }, { status: 400 });

    const { table } = TABLES[type] ?? {};
    if (!table) return NextResponse.json({ error: "Unknown type" }, { status: 400 });

    const { error } = await supabaseAdmin.from(table).delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePublicPages();
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
