import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

const CONTACT_SERVICES = new Set([
  "Graphic Design",
  "Web Design",
  "Ads Management",
  "SEO",
  "Full Package",
]);
const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_RATE_LIMIT_ENTRIES = 1000;
const rateLimitEntries = new Map();

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip")?.trim() || "";
}

function checkRateLimit(ip) {
  if (!ip) return { allowed: true };

  const now = Date.now();
  let entry = rateLimitEntries.get(ip);

  if (!entry || now >= entry.resetAt) {
    if (rateLimitEntries.size >= MAX_RATE_LIMIT_ENTRIES) {
      for (const [key, value] of rateLimitEntries) {
        if (now >= value.resetAt) rateLimitEntries.delete(key);
      }
      if (rateLimitEntries.size >= MAX_RATE_LIMIT_ENTRIES) {
        rateLimitEntries.delete(rateLimitEntries.keys().next().value);
      }
    }

    entry = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitEntries.set(ip, entry);
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { allowed: true };
}

async function readJsonBody(request) {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return { error: "Request body is too large.", status: 413 };
  }

  const reader = request.body?.getReader();
  if (!reader) return { error: "Invalid JSON body.", status: 400 };

  const decoder = new TextDecoder();
  let bytesRead = 0;
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    bytesRead += value.byteLength;
    if (bytesRead > MAX_BODY_BYTES) {
      await reader.cancel().catch(() => {});
      return { error: "Request body is too large.", status: 413 };
    }
    text += decoder.decode(value, { stream: true });
  }

  text += decoder.decode();

  try {
    return { body: JSON.parse(text) };
  } catch {
    return { error: "Invalid JSON body.", status: 400 };
  }
}

function validateContact(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Invalid contact form data." };
  }

  const fields = ["name", "email", "service", "message", "website"];
  if (fields.some((field) => body[field] !== undefined && typeof body[field] !== "string")) {
    return { error: "Invalid contact form data." };
  }

  const website = (body.website || "").trim();
  if (website) return { spam: true };

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const service = (body.service || "").trim();
  const message = (body.message || "").trim();

  if (!name || !email || !message) {
    return { error: "Name, email and message are required." };
  }
  if (name.length < 2 || name.length > 100) {
    return { error: "Name must be between 2 and 100 characters." };
  }
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!CONTACT_SERVICES.has(service)) {
    return { error: "Select a valid service." };
  }
  if (message.length < 10 || message.length > 5000) {
    return { error: "Message must be between 10 and 5000 characters." };
  }

  return { fields: { name, email, service, message } };
}

function submissionAccepted() {
  return NextResponse.json({ success: true }, { status: 201 });
}

// GET all contact submissions
export async function GET(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const { data, error } = await supabaseAdmin
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST new contact submission
export async function POST(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.split(";")[0].trim().toLowerCase() !== "application/json") {
    return NextResponse.json({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  const parsed = await readJsonBody(req);
  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status });
  }

  const validated = validateContact(parsed.body);
  if (validated.spam) return submissionAccepted();
  if (validated.error) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  // Best-effort protection per running instance. Use edge/provider limits for distributed enforcement.
  const rateLimit = checkRateLimit(getClientIp(req));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfter) },
      }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("contacts")
    .insert([{ ...validated.fields, read: false }])
    .select()
    .single();

  if (error) {
    console.error("Contact submission failed:", error);
    return NextResponse.json(
      { error: "Could not send message. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 });
}

// PATCH mark as read/unread
export async function PATCH(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const { id, read } = await req.json();
  const { data, error } = await supabaseAdmin
    .from("contacts")
    .update({ read })
    .eq("id", id)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

// DELETE a contact
export async function DELETE(req) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("contacts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
