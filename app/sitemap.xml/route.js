import { getSitemapXml } from "@/lib/seoFiles";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(await getSitemapXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}
