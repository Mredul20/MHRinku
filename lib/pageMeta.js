import { cache } from "react";
import { supabaseAdmin } from "./supabase";
import { DEFAULT_PAGE_META } from "./cmsFallbacks";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://mhrinku.com").replace(/\/+$/, "");
}

export function getCanonicalUrl(pathname = "/") {
  if (/^https?:\/\//i.test(pathname)) return pathname;

  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getSiteUrl()}${normalizedPath === "/" ? "/" : normalizedPath.replace(/\/+$/, "")}`;
}

export function cleanGtmId(value = "") {
  const id = String(value).trim().toUpperCase();
  return /^GTM-[A-Z0-9]+$/.test(id) ? id : "";
}

export const getSeoIntegrations = cache(async () => {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("key,value")
      .in("key", ["gtm_container_id", "google_site_verification"]);

    if (error) return { gtmId: "", searchConsoleVerification: "" };

    const settings = Object.fromEntries((data || []).map((item) => [item.key, item.value]));
    return {
      gtmId: cleanGtmId(settings.gtm_container_id),
      searchConsoleVerification: settings.google_site_verification || "",
    };
  } catch {
    return { gtmId: "", searchConsoleVerification: "" };
  }
});

export async function getPageMeta(slug, fallback = {}) {
  const defaults = DEFAULT_PAGE_META[slug] || {};
  const base = { ...defaults, ...fallback };

  try {
    const { data, error } = await supabaseAdmin
      .from("page_meta")
      .select("meta_title,meta_description,og_image")
      .eq("slug", slug)
      .maybeSingle();

    if (error) return base;

    return {
      meta_title: data?.meta_title || base.meta_title || base.title || "",
      meta_description: data?.meta_description || base.meta_description || base.description || "",
      og_image: data?.og_image || base.og_image || "",
    };
  } catch {
    return base;
  }
}

export function toMetadata(meta = {}, pathname) {
  const title = meta.meta_title || meta.title || "";
  const description = meta.meta_description || meta.description || "";
  const images = meta.og_image ? [meta.og_image] : undefined;

  return {
    title,
    description,
    ...(pathname ? { alternates: { canonical: getCanonicalUrl(pathname) } } : {}),
    openGraph: {
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}
