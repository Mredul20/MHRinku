import { NextResponse } from "next/server";
import { getCanonicalUrl } from "@/lib/pageMeta";
import { getPageHtml, isValidPageSlug } from "@/lib/pageHtml";

function withCanonical(html, slug) {
  const canonicalPath = slug === "index" ? "/" : `/${slug}.html`;
  const canonicalTag = `<link rel="canonical" href="${getCanonicalUrl(canonicalPath)}">`;

  if (/<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(html)) {
    return html.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, canonicalTag);
  }

  return html.replace(/<\/head>/i, `  ${canonicalTag}\n</head>`);
}

export async function GET(_request, { params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }
  if (!isValidPageSlug(slug)) {
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });
  }

  try {
    const { html } = await getPageHtml(slug);
    return new NextResponse(withCanonical(html, slug), {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch {
    return new NextResponse("Page not found", { status: 404 });
  }
}
