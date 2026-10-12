import { cache } from "react";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SmartImage from "../../components/SmartImage";
import { getCanonicalUrl } from "@/lib/pageMeta";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeImageRef, normalizeImageRefs } from "@/lib/validators";

const getProject = cache(async (idOrSlug) => {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    let query = supabaseAdmin.from("projects").select("*").limit(1);
    query = isUuid ? query.eq("id", idOrSlug) : query.eq("slug", idOrSlug);

    const { data, error } = await query;
    if (error && error.message?.includes("slug")) {
      const fallback = await supabaseAdmin.from("projects").select("*").eq("id", idOrSlug).limit(1);
      if (fallback.error) return null;
      return fallback.data?.[0] || null;
    }
    if (error) return null;

    return data?.[0] || null;
  } catch {
    return null;
  }
});

export async function generateStaticParams() {
  return [];
}

function getImages(project) {
  const refs = normalizeImageRefs(project.image_refs);
  const legacy = normalizeImageRefs(project.images);
  return refs.length ? refs : legacy;
}

function ProjectImage({ image, className }) {
  const ref = normalizeImageRef(image);
  if (!ref.url) return null;
  return <SmartImage src={ref.url} alt={ref.alt_text || "Project image"} className={className} />;
}

function ContentBlock({ block, index }) {
  if (!block?.type) return null;

  if (block.type === "heading") {
    return <h2 className="mt-12 text-3xl font-black text-white md:text-4xl">{block.text}</h2>;
  }

  if (block.type === "paragraph") {
    return <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">{block.text}</p>;
  }

  if (block.type === "quote") {
    return (
      <blockquote className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-xl font-medium leading-relaxed text-white">
        “{block.text}”
        {block.cite && <cite className="mt-4 block text-sm not-italic text-primary">— {block.cite}</cite>}
      </blockquote>
    );
  }

  if (block.type === "image") {
    return (
      <div className="mt-8 overflow-hidden rounded-2xl border border-white/5 bg-surface">
        <ProjectImage image={block.image || block} className="w-full object-contain max-h-[70vh]" />
      </div>
    );
  }

  if (block.type === "image_gallery") {
    const images = normalizeImageRefs(block.images);
    if (!images.length) return null;
    return (
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {images.map((image, imageIndex) => (
          <div key={`${image.url}-${imageIndex}`} className="overflow-hidden rounded-2xl border border-white/5 bg-surface">
            <ProjectImage image={image} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    );
  }

  if (block.type === "before_after") {
    return (
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {[{ label: "Before", image: block.before }, { label: "After", image: block.after }].map((item) => (
          <div key={item.label} className="overflow-hidden rounded-2xl border border-white/5 bg-surface">
            <div className="border-b border-white/5 px-5 py-3 text-xs font-bold uppercase tracking-widest text-primary">{item.label}</div>
            <ProjectImage image={item.image} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) return {};

  const images = getImages(project);
  const heroImage = normalizeImageRef(project.og_image || project.thumbnail || images[0]);
  const title = project.meta_title || project.title;
  const description = project.meta_description || project.description;

  return {
    title,
    description,
    alternates: { canonical: getCanonicalUrl(`/projects/${project.slug || id}`) },
    openGraph: {
      title,
      description,
      images: heroImage.url ? [heroImage.url] : [],
    },
  };
}

export default async function ProjectCaseStudyPage({ params }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project || project.status === "draft") notFound();

  const images = getImages(project);
  const serviceLabels = Array.isArray(project.service) ? project.service : [];
  const heroImage = project.thumbnail ? { url: project.thumbnail, alt_text: project.thumbnail_alt_text || project.title } : images[0] || null;
  const blocks = Array.isArray(project.content_blocks) ? project.content_blocks : [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-dark pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mb-12">
            <p className="text-xs text-muted uppercase tracking-widest mb-4">Case Study</p>
            <h1 className="text-[32px] md:text-[56px] font-black text-white leading-tight mb-6">{project.title}</h1>
            <p className="text-lg text-slate-300 leading-relaxed">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {serviceLabels.length > 0 ? (
                serviceLabels.map((service) => (
                  <span key={service} className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                    {service}
                  </span>
                ))
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/10">
                  {project.category}
                </span>
              )}
              {Array.isArray(project.tags) && project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold bg-white/5 text-slate-300 border border-white/10">#{tag}</span>
              ))}
            </div>
            {project.externalLink && (
              <a
                href={project.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 bg-primary text-background-dark font-bold px-6 py-3 rounded-lg"
              >
                View Live Project
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </a>
            )}
          </div>

          {heroImage?.url && (
            <div className="mb-12 overflow-hidden rounded-3xl border border-white/5 bg-surface">
              <ProjectImage image={heroImage} className="w-full object-contain max-h-[70vh]" />
            </div>
          )}

          {blocks.length > 0 ? (
            <section className="mt-12">
              {blocks.map((block, index) => <ContentBlock key={block.id || index} block={block} index={index} />)}
            </section>
          ) : images.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {images.slice(1).map((image, index) => (
                <div key={`${image.url}-${index}`} className="overflow-hidden rounded-2xl border border-white/5 bg-surface">
                  <ProjectImage image={image} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {project.additionalFields && Object.keys(project.additionalFields).length > 0 && (
            <section className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(project.additionalFields).map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-white/5 bg-surface p-6">
                  <p className="text-xs uppercase tracking-widest text-muted mb-2">{key}</p>
                  <p className="text-white leading-relaxed">{typeof value === "string" ? value : JSON.stringify(value)}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
