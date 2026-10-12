import { getRobotsText } from "@/lib/seoFiles";

export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(await getRobotsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
}
