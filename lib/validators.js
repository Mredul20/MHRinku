const PLACEHOLDER_RE = /^(lorem ipsum|placeholder|test|sample|todo|n\/a|na|xxx)$/i;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function isMissingText(value) {
  const text = String(value || "").trim();
  return !text || PLACEHOLDER_RE.test(text);
}

export function normalizeImage(img) {
  if (!img) return { url: "", alt_text: "" };
  if (typeof img === "string") return { url: img, alt_text: "" };
  return {
    url: String(img.url || img.src || "").trim(),
    alt_text: String(img.alt_text || img.alt || "").trim(),
  };
}

export const normalizeImageRef = normalizeImage;

export function normalizeImageRefs(images) {
  return Array.isArray(images) ? images.map(normalizeImage).filter((image) => image.url) : [];
}

export function getProjectImages(project) {
  const imageRefs = normalizeImageRefs(project?.image_refs);
  const legacyImages = normalizeImageRefs(project?.images);
  const images = imageRefs.length ? imageRefs : legacyImages;
  const thumbnail = normalizeImageRef(
    project?.thumbnail && typeof project.thumbnail === "string"
      ? { url: project.thumbnail, alt_text: project.thumbnail_alt_text || "" }
      : project?.thumbnail
  );
  return thumbnail.url ? [thumbnail, ...images.filter((image) => image.url !== thumbnail.url)] : images;
}

function pushImageAltMissing(missing, image, label) {
  if (image.url && isMissingText(image.alt_text)) missing.push(label);
}

function validateBlock(block, index, missing) {
  const type = block?.type;
  const prefix = `Content block ${index + 1}`;

  if (type === "image") {
    const image = normalizeImageRef(block.image || block);
    if (!image.url) missing.push(`${prefix} image`);
    pushImageAltMissing(missing, image, `${prefix} image alt text`);
  }

  if (type === "image_gallery") {
    const images = normalizeImageRefs(block.images);
    if (!images.length) missing.push(`${prefix} gallery images`);
    images.forEach((image, imageIndex) => pushImageAltMissing(missing, image, `${prefix} gallery image ${imageIndex + 1} alt text`));
  }

  if (type === "before_after") {
    const beforeImage = normalizeImageRef(block.before);
    const afterImage = normalizeImageRef(block.after);
    if (!beforeImage.url) missing.push(`${prefix} before image`);
    if (!afterImage.url) missing.push(`${prefix} after image`);
    pushImageAltMissing(missing, beforeImage, `${prefix} before image alt text`);
    pushImageAltMissing(missing, afterImage, `${prefix} after image alt text`);
  }
}

export function validateProjectForPublish(project) {
  const missing = [];

  if (isMissingText(project?.title)) missing.push("Title");
  if (isMissingText(project?.description)) missing.push("Description");
  if (isMissingText(project?.category)) missing.push("Category");

  const images = getProjectImages(project);
  if (!images.length) missing.push("At least one project image");
  images.forEach((image, index) => pushImageAltMissing(missing, image, `Project image ${index + 1} alt text`));

  const blocks = Array.isArray(project?.content_blocks) ? project.content_blocks : [];
  blocks.forEach((block, index) => validateBlock(block, index, missing));

  if (project?.slug && !SLUG_RE.test(project.slug)) missing.push("Slug must use lowercase letters, numbers, and hyphens only");

  return missing;
}

export function sanitizeProjectPayload(body = {}) {
  const status = body.status === "published" ? "published" : "draft";
  const title = String(body.title || "").trim();
  const slug = slugify(body.slug || title);

  return {
    title,
    description: String(body.description || "").trim(),
    category: String(body.category || "").trim(),
    service: Array.isArray(body.service) ? body.service.filter(Boolean) : [],
    images: Array.isArray(body.images) ? body.images : [],
    image_refs: Array.isArray(body.image_refs) ? body.image_refs : [],
    thumbnail: body.thumbnail || "",
    thumbnail_alt_text: String(body.thumbnail_alt_text || "").trim(),
    externalLink: String(body.externalLink || "").trim(),
    additionalFields: body.additionalFields && typeof body.additionalFields === "object" ? body.additionalFields : {},
    status,
    content_blocks: Array.isArray(body.content_blocks) ? body.content_blocks : [],
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0,
    tags: Array.isArray(body.tags) ? body.tags.map((tag) => String(tag).trim()).filter(Boolean) : [],
    meta_title: String(body.meta_title || "").trim(),
    meta_description: String(body.meta_description || "").trim(),
    og_image: String(body.og_image || "").trim(),
    slug,
  };
}
