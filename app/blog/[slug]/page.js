import { cache } from "react";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SmartImage from "../../components/SmartImage";
import { getCanonicalUrl } from "@/lib/pageMeta";
import { normalizeImage } from "@/lib/validators";
import { supabaseAdmin } from "@/lib/supabase";

export async function generateStaticParams() {
  return [];
}

const getBlog = cache(async (slug) => {
  try {
    let { data, error } = await supabaseAdmin
      .from("blogs")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .is("deleted_at", null)
      .limit(1)
      .maybeSingle();

    if (error && error.message?.includes("deleted_at")) {
      const result = await supabaseAdmin
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .limit(1)
        .maybeSingle();
      data = result.data;
      error = result.error;
    }

    if (error || !data) return null;

    return {
      ...data,
      featuredImage: normalizeImage(data.featuredImage).url,
    };
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return {};
  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || "",
    alternates: { canonical: getCanonicalUrl(`/blog/${slug}`) },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || "",
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-dark pt-32 pb-20">
        {blog.featuredImage && (
          <div className="w-full aspect-[4/3] lg:aspect-[12/5] overflow-hidden mb-12">
            <SmartImage src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="max-w-3xl mx-auto px-6">
          {blog.created_at && (
            <p className="text-xs text-muted uppercase tracking-widest mb-4">
              {new Date(blog.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          )}
          <h1 className="text-[26px] md:text-[44px] font-black text-white mb-10 leading-tight">{blog.title}</h1>
          <article
            className="prose prose-invert prose-lg max-w-none text-slate-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
