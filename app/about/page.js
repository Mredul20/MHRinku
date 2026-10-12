import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SmartImage from "../components/SmartImage";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import JsonLdScript from "../components/JsonLdScript";
import { supabaseAdmin } from "@/lib/supabase";
import { getPageMeta, toMetadata } from "@/lib/pageMeta";

export async function generateMetadata() {
  return toMetadata(await getPageMeta("about", {
    meta_title: "About Mobarak Hossain Rinku | Web Designer & Ads Expert in Dhaka",
    meta_description: "Meet Mobarak Hossain Rinku (MHRinku), a Dhaka-based web designer, graphic designer, and ads expert helping businesses in Bangladesh grow with websites, brand design, and paid ads.",
  }), "/about");
}

async function getAboutSettings() {
  try {
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .select("key,value")
      .in("key", ["about_hero_image", "about_video_url", "about_video_title"]);

    if (error) return {};
    return Object.fromEntries((data || []).map((item) => [item.key, item.value]));
  } catch {
    return {};
  }
}

async function getReviews() {
  try {
    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("published", true)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

async function getCertificates() {
  try {
    const { data, error } = await supabaseAdmin
      .from("service_certifications")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

const services = [
  { href: "/web-design-services-bangladesh", icon: "language", title: "Web Design", text: "Fast, mobile-friendly business websites and landing pages built on WordPress or Shopify, structured so you can edit content yourself." },
  { href: "/graphic-design-services-bangladesh", icon: "brush", title: "Graphic Design", text: "Logos, brand identity, social media creatives, and ad visuals that keep your brand consistent across every channel." },
  { href: "/ads-expert-bangladesh", icon: "ads_click", title: "Ads Management", text: "Meta Ads, Google Ads, and TikTok Ads campaigns with clear structure, creative testing, retargeting, and ongoing optimization." },
];

const results = [
  { href: "/case-studies#meta-ads-local-brand-bangladesh", title: "Meta Ads Campaign for a Local Bangladesh Brand", result: "4.2x return on ad spend" },
  { href: "/case-studies#wordpress-service-business-dhaka", title: "WordPress Website for a Dhaka Service Business", result: "+65% organic contact requests" },
  { href: "/case-studies#shopify-store-bangladesh-retail", title: "Shopify Store Redesign for a Bangladesh Retailer", result: "42% higher mobile conversion" },
];

const tools = ["Adobe Photoshop", "Adobe Illustrator", "Figma", "WordPress", "WooCommerce", "Shopify", "Meta Ads Manager", "Google Ads", "TikTok Ads"];

const process = [
  { title: "Understand", text: "We talk through your business, audience, and goals so the work is built around real needs." },
  { title: "Plan", text: "I map the pages, creatives, or campaign structure and agree the scope with you before starting." },
  { title: "Build", text: "Design and development happen in clear stages, with your feedback at each step." },
  { title: "Launch & Improve", text: "After launch I check performance and refine what is not working yet." },
];

const faqs = [
  { q: "Where are you based?", a: "I am based in Dhaka, Bangladesh. I work with clients across Bangladesh and also remotely with businesses abroad." },
  { q: "What services do you offer?", a: "Web design (WordPress and Shopify), graphic design and branding, and paid ads management on Meta, Google, and TikTok." },
  { q: "Will I work with you directly?", a: "Yes. You work with me directly, with no agency layer or offshore handoff, so communication stays clear and fast." },
  { q: "How do we start a project?", a: "Send a message through the contact form, call, or WhatsApp. I will reply to discuss your goals and suggest the next steps." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-12 text-center">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h2 className="text-4xl font-black text-white md:text-5xl">{title}</h2>
      {description && <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">{description}</p>}
    </div>
  );
}

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return url;
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return "";
  }

  return "";
}

export default async function AboutPage() {
  const [settings, reviews, certificates] = await Promise.all([getAboutSettings(), getReviews(), getCertificates()]);
  const image = settings.about_hero_image || "";
  const videoUrl = settings.about_video_url || "";
  const videoTitle = settings.about_video_title || "About Video";
  const videoEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <>
      <Navbar />
      <JsonLdScript id="about-faq-schema" data={faqSchema} />
      <main className="min-h-screen bg-background-dark pt-28 text-slate-100">
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,167,94,0.14),transparent_45%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-primary/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface aspect-[4/5]">
                <SmartImage src={image || "/img/profile.jpg"} alt="Professional portrait of Mobarak" className="h-full w-full object-cover" />
              </div>
            </div>
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span>
                My Story & Mission
              </div>
              <h1 className="text-[44px] font-black tracking-tighter text-white md:text-[68px]">Crafting Digital <span className="text-primary">Masterpieces</span> That Scale.</h1>
              <p className="mt-6 text-lg font-bold text-white">Mobarak Hossain Rinku (MHRinku) — Web Designer, Graphic Designer & Ads Expert in Dhaka, Bangladesh</p>
              <p className="mt-4 text-lg leading-relaxed text-slate-400">
                I am a multidisciplinary creator dedicated to blending strategic marketing with high-impact visual design. My mission is simple: help visionary brands navigate the digital landscape and achieve growth through creative excellence.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  ["2+", "Years Experience"],
                  ["150+", "Projects Delivered"],
                  ["98%", "Client Satisfaction"],
                  ["12M+", "Reach Managed"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/5 bg-surface p-6">
                    <p className="text-4xl font-black text-white">{value}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/#portfolio" className="inline-flex items-center gap-2 rounded-xl bg-[#C6A75E] px-7 py-4 font-bold text-background-dark">
                  View My Work <span className="material-symbols-outlined">arrow_outward</span>
                </Link>
                <Link href="/#contact" className="rounded-xl border border-slate-700 px-7 py-4 font-bold text-white transition-colors hover:border-primary">
                  Contact Me
                </Link>
              </div>
            </div>
          </div>
        </section>

        {videoUrl && (
          <section className="py-20">
            <div className="mx-auto max-w-5xl px-6">
              <div className="mb-10 text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-primary">Video</p>
                <h2 className="text-4xl font-black text-white md:text-5xl">{videoTitle}</h2>
              </div>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-2xl">
                {videoEmbedUrl ? (
                  <iframe
                    src={videoEmbedUrl}
                    title={videoTitle}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <video src={videoUrl} controls className="aspect-video w-full bg-black" />
                )}
              </div>
            </div>
          </section>
        )}

        <section className="bg-slate-900/50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-primary">Experience</p>
              <h2 className="text-4xl font-black text-white md:text-5xl">What I Bring</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                ["Ads Expert", "Paid advertising strategies across Meta, Google Ads, and TikTok Ads focused on ROAS optimization, creative testing, and scaling."],
                ["Graphic Design Lead", "High-converting ad creatives, visual identity systems, and polished digital assets."],
                ["Web Designer", "SEO-ready business websites, landing pages, and web experiences that teams can manage."],
                ["Local Business Partner", "Growth-focused support for e-commerce and service companies in Bangladesh and beyond."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl border border-white/5 bg-surface p-8 transition-colors hover:border-primary/30">
                  <h3 className="text-2xl font-bold text-white">{title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <SectionHeading eyebrow="My Story" title="Who I Am" />
            <div className="space-y-6 text-lg leading-relaxed text-slate-400">
              <p>
                I am Mobarak Hossain Rinku, known online as MHRinku, a web designer, graphic designer, and paid ads specialist based in Dhaka, Bangladesh. For more than two years I have helped local businesses, e-commerce stores, and service companies turn their online presence into a real source of customers.
              </p>
              <p>
                My work combines three skills that usually sit with different people: designing the brand, building the website, and running the ads that bring visitors to it. Because one person handles all three, your visuals, your website, and your campaigns tell the same story, and nothing gets lost between teams.
              </p>
              <p>
                I work directly with every client, with no agency layer in between. That keeps communication simple, decisions fast, and the focus on results you can measure: more enquiries, more sales, and a brand people remember.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="Services" title="How I Can Help" description="Design, websites, and advertising for businesses in Dhaka and across Bangladesh." />
            <div className="grid gap-6 md:grid-cols-3">
              {services.map((service) => (
                <Link key={service.href} href={service.href} className="group rounded-2xl border border-white/5 bg-surface p-8 transition-colors hover:border-primary/30">
                  <span className="material-symbols-outlined text-4xl text-primary">{service.icon}</span>
                  <h3 className="mt-4 text-2xl font-bold text-white group-hover:text-primary">{service.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-400">{service.text}</p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-widest text-primary">Learn more <span className="material-symbols-outlined text-base">arrow_forward</span></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="Proven Results" title="Work That Delivered" description="A few outcomes from recent client projects." />
            <div className="grid gap-6 md:grid-cols-3">
              {results.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-2xl border border-white/5 bg-surface p-8 transition-colors hover:border-primary/30">
                  <p className="text-3xl font-black text-primary">{item.result}</p>
                  <h3 className="mt-3 text-lg font-bold text-white">{item.title}</h3>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/case-studies" className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-7 py-4 font-bold text-white transition-colors hover:border-primary">
                Read the case studies <span className="material-symbols-outlined">arrow_outward</span>
              </Link>
            </div>
          </div>
        </section>

        {certificates.length > 0 && (
          <section className="bg-slate-900/50 py-20">
            <div className="mx-auto max-w-7xl px-6">
              <SectionHeading eyebrow="Qualifications" title="Certifications" description="Training and certifications behind the work." />
              <div className="grid justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
                {certificates.map((certificate) => (
                  <article key={certificate.id} className="w-full max-w-[500px] overflow-hidden rounded-2xl border border-white/5 bg-surface">
                    <div className="aspect-square overflow-hidden bg-primary/5">
                      <SmartImage src={certificate.image} alt={certificate.title} width={500} height={500} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-lg font-bold text-white">{certificate.title}</h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="Toolkit" title="Tools & Platforms I Use" />
            <ul className="flex flex-wrap justify-center gap-3">
              {tools.map((tool) => (
                <li key={tool} className="rounded-full border border-white/10 bg-surface px-5 py-2 text-sm font-bold text-slate-200">{tool}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-slate-900/50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading eyebrow="Process" title="How I Work" />
            <ol className="grid gap-6 md:grid-cols-4">
              {process.map((step, index) => (
                <li key={step.title} className="rounded-2xl border border-white/5 bg-surface p-8">
                  <p className="text-sm font-black text-primary">0{index + 1}</p>
                  <h3 className="mt-2 text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-400">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {reviews.length > 0 && <section id="testimonials"><TestimonialsCarousel reviews={reviews} /></section>}

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <SectionHeading eyebrow="FAQ" title="Common Questions" />
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-2xl border border-white/5 bg-surface p-6">
                  <summary className="cursor-pointer list-none text-lg font-bold text-white">{faq.q}</summary>
                  <p className="mt-3 leading-relaxed text-slate-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="mx-auto max-w-4xl rounded-3xl border border-primary/20 bg-primary/10 px-6 py-14 text-center">
            <h2 className="text-3xl font-black text-white md:text-4xl">Let&apos;s grow your business together.</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">Tell me about your project and I will suggest the best next step.</p>
            <Link href="/#contact" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#C6A75E] px-7 py-4 font-bold text-background-dark">
              Get in touch <span className="material-symbols-outlined">arrow_outward</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
