import { NextResponse } from "next/server";
import { supabaseAdmin } from "./supabase";

export async function requireAdmin(request) {
  const authHeader = request?.headers?.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  const user = data?.user;

  if (error || !user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Invalid session." }, { status: 401 }),
    };
  }

  if (user.app_metadata?.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Admin access required." }, { status: 403 }),
    };
  }

  return { ok: true, user };
}
