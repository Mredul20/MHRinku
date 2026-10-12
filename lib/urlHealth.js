import { access } from "fs/promises";
import path from "path";
import { normalizeImage } from "@/lib/validators";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export function cleanSocialUrl(value, allowedHosts = []) {
  try {
    const url = new URL(String(value || "").trim());
    if (!/^https?:$/.test(url.protocol)) return "";

    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    const allowed = allowedHosts.some((host) => {
      const normalizedHost = host.toLowerCase().replace(/^www\./, "");
      return hostname === normalizedHost || hostname.endsWith(`.${normalizedHost}`);
    });

    return allowed ? url.toString() : "";
  } catch {
    return "";
  }
}

async function isReachableHttpUrl(url, timeoutMs = 2500) {
  for (const method of ["HEAD", "GET"]) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        redirect: "follow",
        cache: "no-store",
        headers: method === "GET" ? { Range: "bytes=0-0" } : undefined,
        signal: controller.signal,
      });

      if (response.status < 400) return true;
    } catch {
      // Try the next method. Some hosts reject HEAD but allow GET.
    } finally {
      clearTimeout(timeout);
    }
  }

  return false;
}

export async function cleanReachableSocialUrl(value, allowedHosts = []) {
  const url = cleanSocialUrl(value, allowedHosts);
  if (!url) return "";
  return (await isReachableHttpUrl(url)) ? url : "";
}

async function localPublicImageExists(src) {
  try {
    const pathname = decodeURIComponent(src.split("?")[0]);
    if (!pathname.startsWith("/") || pathname.startsWith("//")) return false;

    const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));
    if (!filePath.startsWith(PUBLIC_DIR)) return false;

    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function cleanReachableImageSrc(src) {
  const image = normalizeImage(src);
  const url = image.url;
  if (!url) return "";

  if (url.startsWith("/")) return (await localPublicImageExists(url)) ? url : "";

  try {
    const parsed = new URL(url);
    if (!/^https?:$/.test(parsed.protocol)) return "";
    return (await isReachableHttpUrl(parsed.toString())) ? parsed.toString() : "";
  } catch {
    return "";
  }
}
