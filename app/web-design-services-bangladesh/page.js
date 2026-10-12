import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SmartImage from "../components/SmartImage";
import JsonLdScript from "../components/JsonLdScript";
import { getPageMeta, toMetadata } from "@/lib/pageMeta";
import { getServiceSchema, getFaqPageSchema } from "@/lib/schema";

export async function generateMetadata() {
  return toMetadata(await getPageMeta("web-design-services-bangladesh"), "/web-design-services-bangladesh");
}

const platforms = [
  {
    title: "WordPress Web Design",
    description: "Business websites, blogs, landing pages, and WooCommerce stores you can edit yourself without touching code.",
    href: "/wordpress-web-design-bangladesh",
    cta: "See WordPress plans",
    logo: "https://cdn.simpleicons.org/wordpress/C6A75E",
    alt: "WordPress web design Bangladesh",
    stat: "Content + Services",
  },
  {
    title: "Shopify Development",
    description: "Storefronts built for product listings, checkout flow, inventory structure, and sales campaigns.",
    href: "/shopify-website-design-bangladesh",
    cta: "See Shopify plans",
    logo: "https://cdn.simpleicons.org/shopify/C6A75E",
    alt: "Shopify development services Bangladesh",
    stat: "Products + Checkout",
  },
];

const sections = [
  {
    title: "Who This Is For",
    body: "Small businesses, local service providers, consultants, creators, and online stores in Bangladesh that need a clean website they can manage without calling a developer for every text, image, offer, or page update.",
    icon: "groups",
  },
  {
    title: "How I Work",
    body: "Every project starts with scope: pages, features, platform, content, and business goals. Then I move through design, build, mobile checks, speed basics, and launch handoff — so you know exactly how to update your own site after it goes live.",
    icon: "route",
  },
  {
    title: "Why Choose Me",
    body: "I work directly with you from Dhaka, with no agency layer and no offshore handoff. Your website is planned around real business needs: clear pages, simple editing, mobile-friendly layouts, speed basics, and SEO fundamentals from day one instead of being added after launch.",
    icon: "verified",
  },
  {
    title: "Choosing WordPress vs. Shopify",
    body: "WordPress fits content-heavy or service-based businesses that need flexibility, blogs, landing pages, and editable service pages. Shopify fits product-focused businesses that want product management, checkout, inventory, and campaign-ready store pages out of the box.",
    icon: "compare_arrows",
  },
];

const faqs = [
  {
    q: "Do you build both WordPress and Shopify sites?",
    a: "Yes. WordPress for business and content sites, Shopify for e-commerce stores — pick based on what you're selling.",
  },
  {
    q: "Which platform is right for my business?",
    a: "If you're selling products online, Shopify is usually the better fit. If you need a business site, blog, or service pages you'll update often, WordPress is the better fit.",
  },
  {
    q: "Can I switch platforms later if I start with the wrong one?",
    a: "Yes, sites can be rebuilt on a different platform, though it's more efficient to choose correctly up front — happy to advise before you commit.",
  },
  {
    q: "Do you work with clients outside Dhaka?",
    a: "Yes, all work is done remotely regardless of location within Bangladesh.",
  },
];

export default function WebDesignServicesBangladeshPage() {
  const serviceSchema = getServiceSchema({
    title: "Web Design Services Bangladesh",
    description: "Web design services in Bangladesh for WordPress and Shopify websites built for speed, structure, and easy editing.",
    pathname: "/web-design-services-bangladesh",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=80",
  });
  const faqSchema = getFaqPageSchema(faqs);

  return (
    <>
      <JsonLdScript id="web-design-service-schema" data={serviceSchema} />
      <JsonLdScript id="web-design-faq-schema" data={faqSchema} />
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-background-dark pt-28 text-slate-100">
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(198,167,94,0.20),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(34,211,238,0.10),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.18),transparent_60%)]" />
          <div className="absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-primary shadow-[0_0_35px_rgba(198,167,94,0.12)]">
                <span className="size-2 rounded-full bg-primary shadow-[0_0_18px_rgba(198,167,94,0.9)]" />
                Website Design Hub
              </div>
              <h1 className="max-w-5xl text-[44px] font-black leading-[0.96] tracking-tighter text-white md:text-[56px] lg:text-[76px]">
                Web design services in Bangladesh, built on WordPress or Shopify.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                Custom, editable websites for businesses across Dhaka and Bangladesh — choose the platform that fits how you sell.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/#contact" className="inline-flex items-center gap-2 rounded-2xl bg-[#C6A75E] px-7 py-4 font-black text-background-dark shadow-[0_18px_50px_rgba(198,167,94,0.22)] transition-transform hover:-translate-y-0.5">
                  Start Your Project <span className="material-symbols-outlined">arrow_outward</span>
                </Link>
                <a href="#platforms" className="rounded-2xl border border-white/10 px-7 py-4 font-bold text-white transition-colors hover:border-primary/50 hover:bg-white/5">
                  Compare Platforms
                </a>
              </div>
            </div>

            <div className="relative lg:pl-8">
              <div className="absolute -inset-6 rounded-[2rem] bg-primary/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111827]/90 p-4 shadow-2xl" aria-label="Web design services in Bangladesh by Mobarak Hossain Rinku">
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="size-3 rounded-full bg-red-400/80" />
                  <span className="size-3 rounded-full bg-yellow-300/80" />
                  <span className="size-3 rounded-full bg-green-400/80" />
                  <span className="ml-3 h-2 flex-1 rounded-full bg-white/10" />
                </div>
                <div className="relative min-h-[430px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-background-dark p-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(198,167,94,0.22),transparent_34%),radial-gradient(circle_at_78%_88%,rgba(34,211,238,0.12),transparent_28%)]" />
                  <div className="relative grid h-full gap-5">
                    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-5">
                      <div className="mb-4 h-3 w-24 rounded-full bg-primary/70" />
                      <div className="h-8 w-10/12 rounded-full bg-white/85" />
                      <div className="mt-3 h-8 w-7/12 rounded-full bg-white/65" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                        <span className="material-symbols-outlined text-4xl text-primary">language</span>
                        <div className="mt-8 h-3 rounded-full bg-white/20" />
                        <div className="mt-3 h-3 w-2/3 rounded-full bg-white/10" />
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                        <span className="material-symbols-outlined text-4xl text-primary">shopping_cart</span>
                        <div className="mt-8 h-3 rounded-full bg-white/20" />
                        <div className="mt-3 h-3 w-2/3 rounded-full bg-white/10" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {["Speed", "SEO", "Edit"].map((item) => (
                        <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs font-black uppercase tracking-widest text-slate-300">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platforms" className="relative py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
              <div>
                <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-primary">Choose Your Platform</p>
                <h2 className="text-4xl font-black tracking-tight text-white md:text-[56px]">WordPress or Shopify</h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-slate-400 md:justify-self-end">
                Start with how your business sells. Content-heavy service site? WordPress. Product store with checkout and inventory? Shopify.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {platforms.map((platform, index) => (
                <Link key={platform.title} href={platform.href} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:no-underline hover:shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,167,94,0.16),transparent_38%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="relative flex items-start justify-between gap-6">
                    <div className="flex size-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 p-4" aria-label={platform.alt}>
                      <SmartImage src={platform.logo} alt={platform.alt} width={52} height={52} className="size-13 object-contain" />
                    </div>
                    <span className="rounded-full border border-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400">0{index + 1}</span>
                  </div>
                  <div className="relative mt-10">
                    <p className="mb-3 text-xs font-black uppercase tracking-[0.28em] text-primary/80">{platform.stat}</p>
                    <h3 className="text-3xl font-black text-white transition-colors group-hover:text-primary md:text-4xl">{platform.title}</h3>
                    <p className="mt-5 max-w-xl text-lg leading-8 text-slate-400">{platform.description}</p>
                    <span className="mt-9 inline-flex items-center gap-2 rounded-full border border-primary/30 px-5 py-3 text-xs font-black uppercase tracking-widest text-primary transition-colors group-hover:bg-primary group-hover:text-background-dark">
                      {platform.cta} <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-16 md:py-24">
          <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-primary">Simple, Direct, Useful</p>
              <h2 className="text-4xl font-black tracking-tight text-white md:text-[56px]">Built to be managed after launch.</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {sections.map((section) => (
                <article key={section.title} className="group flex min-h-56 gap-6 rounded-[1.75rem] border border-white/10 bg-[#111827]/70 p-7 transition-colors hover:border-primary/40 hover:bg-surface">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:-translate-y-1">
                    <span className="material-symbols-outlined text-3xl">{section.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">{section.title}</h2>
                    <p className="mt-4 max-w-xl text-base leading-7 text-slate-400">{section.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-slate-900/40 py-16 md:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-primary">FAQ</p>
              <h2 className="text-4xl font-black tracking-tight text-white md:text-[56px]">Common Questions</h2>
              <p className="mt-6 text-lg leading-8 text-slate-400">Quick answers for choosing between WordPress and Shopify before starting your project.</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-2xl border border-white/10 bg-background-dark/70 p-6 open:border-primary/40 open:bg-surface">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-white">
                    {faq.q}
                    <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-45">add</span>
                  </summary>
                  <p className="mt-4 max-w-3xl leading-7 text-slate-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-primary">Proof of Work</p>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-[56px]">Web design results in Bangladesh.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">Measured outcomes from WordPress, Shopify, and Meta Ads projects for Dhaka and Bangladesh clients.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { href: "/case-studies#shopify-store-bangladesh-retail", title: "Shopify Store Redesign", result: "42% higher mobile conversion" },
              { href: "/case-studies#wordpress-service-business-dhaka", title: "WordPress Service Business", result: "+65% organic contact requests" },
              { href: "/case-studies#meta-ads-local-brand-bangladesh", title: "Meta Ads Local Brand", result: "4.2x return on ad spend" },
            ].map((study) => (
              <Link key={study.href} href={study.href} className="group flex flex-col rounded-2xl border border-white/10 bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:no-underline">
                <h3 className="text-xl font-black text-white transition-colors group-hover:text-primary">{study.title}</h3>
                <p className="mt-3 text-sm font-black uppercase tracking-widest text-primary">{study.result}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">Read case study <span className="material-symbols-outlined text-base">arrow_forward</span></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20" id="start">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#C6A75E] p-10 text-background-dark shadow-[0_30px_90px_rgba(198,167,94,0.18)] md:p-14">
            <div className="absolute -right-16 -top-16 size-56 rounded-full bg-white/20 blur-3xl" />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-black md:text-5xl">Ready to start your website?</h2>
                <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-background-dark/75">Tell me what you sell, how many pages you need, and whether WordPress or Shopify feels right.</p>
              </div>
              <Link href="/#contact" className="inline-flex items-center justify-center rounded-2xl bg-background-dark px-8 py-4 font-black text-white transition-transform hover:-translate-y-0.5">
                Start Your Project
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
