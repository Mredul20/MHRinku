import Image from "next/image";
import { normalizeImage } from "@/lib/validators";

export default function SmartImage({
  alt = "",
  className = "",
  height = 600,
  sizes = "100vw",
  src,
  width = 800,
  ...props
}) {
  const image = normalizeImage(src);
  if (!image.url) return null;

  return (
    <Image
      src={image.url}
      alt={alt || image.alt_text || ""}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      unoptimized
      {...props}
    />
  );
}
