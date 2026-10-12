import { getSiteUrl } from "./pageMeta";
import { supabaseAdmin } from "./supabase";

const staticPages = [
  { path: "/", priority: "1.0", changeFrequency: "weekly" },
  { path: "/about", priority: "0.8", changeFrequency: "monthly" },
  { path: "/blog", priority: "0.7", changeFrequency: "weekly" },
  { path: "/graphic-design-services-bangladesh", priority: "0.8", changeFrequency: "monthly" },
  { path: "/ui-design", priority: "0.8", changeFrequency: "monthly" },
  { path: "/ads-expert-bangladesh", priority: "0.8", changeFrequency: "monthly" },
  { path: "/web-design-services-bangladesh", priority: "0.8", changeFrequency: "monthly" },
  { path: "/wordpress-web-design-bangladesh", priority: "0.7", changeFrequency: "monthly" },
  { path: "/shopify-website-design-bangladesh", priority: "0.7", changeFrequency: "monthly" },
  { path: "/seo", priority: "0.8", changeFrequency: "monthly" },
];

function escapeXml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function absoluteUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized === "/" ? "/" : normalized.replace(/\/+$/, "")}`;
}

async function getSetting(key) {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error) return "";
    return data?.value || "";
  } catch {
    return "";
  }
}

async function getDynamicUrls() {
  const urls = [];

  try {
    const { data } = await supabaseAdmin
      .from("blogs")
      .select("slug,updated_at,created_at")
      .eq("published", true)
      .is("deleted_at", null);

    (data || []).forEach((blog) => {
      if (blog.slug) {
        urls.push({ path: `/blog/${blog.slug}`, lastModified: blog.updated_at || blog.created_at, priority: "0.6", changeFrequency: "monthly" });
      }
    });
  } catch {}

  try {
    const { data } = await supabaseAdmin
      .from("projects")
      .select("id,slug,updated_at,created_at")
      .eq("status", "published")
      .is("deleted_at", null);

    (data || []).forEach((project) => {
      const idOrSlug = project.slug || project.id;
      if (idOrSlug) {
        urls.push({ path: `/projects/${idOrSlug}`, lastModified: project.updated_at || project.created_at, priority: "0.6", changeFrequency: "monthly" });
      }
    });
  } catch {}

  try {
    const { data } = await supabaseAdmin
      .from("team_members")
      .select("id,updated_at,created_at")
      .eq("published", true);

    (data || []).forEach((member) => {
      if (member.id) {
        urls.push({ path: `/team/${member.id}`, lastModified: member.updated_at || member.created_at, priority: "0.4", changeFrequency: "monthly" });
      }
    });
  } catch {}

  return urls;
}

export async function getRobotsText() {
  const override = (await getSetting("robots_txt_override")).trim();
  if (override) return override;

  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api",
    "Disallow: /login",
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
  ].join("\n");
}

export async function getSitemapXml() {
  const override = (await getSetting("sitemap_xml_override")).trim();
  if (override) return override;

  const now = new Date().toISOString();
  const urls = [
    ...staticPages.map((page) => ({ ...page, lastModified: now })),
    ...(await getDynamicUrls()),
  ];

  const entries = urls.map((url) => [
    "  <url>",
    `    <loc>${escapeXml(absoluteUrl(url.path))}</loc>`,
    `    <lastmod>${escapeXml(toIsoDate(url.lastModified))}</lastmod>`,
    `    <changefreq>${escapeXml(url.changeFrequency || "monthly")}</changefreq>`,
    `    <priority>${escapeXml(url.priority || "0.5")}</priority>`,
    "  </url>",
  ].join("\n"));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
  ].join("\n");
}
