import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JsonLdScript from "../components/JsonLdScript";
import { getPageMeta, toMetadata } from "@/lib/pageMeta";
import { getArticleSchema } from "@/lib/schema";

export async function generateMetadata() {
  return toMetadata(await getPageMeta("case-studies"), "/case-studies");
}

const caseStudies = [
  {
    slug: "shopify-store-bangladesh-retail",
    title: "Shopify Store Redesign for a Bangladesh Retailer",
    category: "Shopify Website Design Bangladesh",
    challenge: "A Dhaka-based product business had slow load times, a confusing checkout flow, and low mobile conversion on their existing store.",
    approach: "Rebuilt the store on Shopify with a mobile-first product page layout, simplified checkout steps, and clear shipping messaging for Bangladesh customers.",
    results: [
      { value: "42%", label: "Higher mobile conversion" },
      { value: "1.8s", label: "Average page load time" },
      { value: "3x", label: "More completed checkouts" },
    ],
  },
  {
    slug: "wordpress-service-business-dhaka",
    title: "WordPress Website for a Dhaka Service Business",
    category: "WordPress Web Design Bangladesh",
    challenge: "A local service company in Dhaka had no editable website and relied on social media messages for leads, which was hard to track and scale.",
    approach: "Built a WordPress site with service pages, a contact form, WhatsApp integration, and an easy-to-update CMS so the team could publish pages without code.",
    results: [
      { value: "+65%", label: "Organic contact requests" },
      { value: "12", label: "Editable service pages" },
      { value: "4.9s", label: "Avg. session duration" },
    ],
  },
  {
    slug: "meta-ads-local-brand-bangladesh",
    title: "Meta Ads Campaign for a Local Bangladesh Brand",
    category: "Ads Expert Bangladesh",
    challenge: "A growing local brand in Bangladesh was running boosted posts with weak targeting, inconsistent creative, and no conversion tracking.",
    approach: "Set up Meta Pixel, built a campaign structure with retargeting, tested multiple creative angles, and optimized toward purchase and lead events.",
    results: [
      { value: "4.2x", label: "Return on ad spend" },
      { value: "-38%", label: "Cost per lead" },
      { value: "9", label: "Creative variants tested" },
    ],
  },
];

export default function CaseStudiesPage() {
  const pageSchema = getArticleSchema({
    title: "Case Studies | MHRinku Bangladesh",
    description: "Selected web design, Shopify, WordPress, and Meta Ads project results for businesses in Bangladesh.",
    pathname: "/case-studies",
    publishedAt: "2024-01-15",
  });

  return (
    <>
      <JsonLdScript id="case-studies-page-schema" data={pageSchema} />
      <Navbar />
      <main className="min-h-screen overflow-hidden bg-background-dark pt-28 text-slate-100">
        <section className="relative py-16 md:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(198,167,94,0.20),transparent_32%),radial-gradient(circle_at_90%_20%,rgba(34,211,238,0.10),transparent_26%),linear-gradient(180deg,rgba(15,23,42,0.18),transparent_60%)]" />
          <div className="absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.28em] text-primary">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_18px_rgba(198,167,94,0.9)]" />
              Selected Work
            </div>
            <h1 className="max-w-4xl text-[44px] font-black leading-[0.96] tracking-tighter text-white md:text-[56px] lg:text-[76px]">
              Case studies for businesses in Bangladesh.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Practical web design, WordPress, Shopify, and Meta Ads work with measurable results for Dhaka-based and Bangladesh clients.
            </p>
          </div>
        </section>

        <section className="relative pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {caseStudies.map((study, index) => (
                <article
                  id={study.slug}
                  key={study.slug}
                  className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
                >
                  <div className="flex h-16 items-center justify-center border-b border-white/10 bg-slate-900/50 text-xs font-black uppercase tracking-[0.28em] text-primary">
                    Case Study 0{index + 1}
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">{study.category}</p>
                    <h2 className="text-2xl font-black leading-tight text-white md:text-3xl">{study.title}</h2>
                    <div className="mt-8 space-y-6">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary">Challenge</h3>
                        <p className="mt-2 leading-relaxed text-slate-400">{study.challenge}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-primary">Approach</h3>
                        <p className="mt-2 leading-relaxed text-slate-400">{study.approach}</p>
                      </div>
                    </div>
                    <div className="mt-auto pt-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-primary">Results</h3>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {study.results.map((result) => (
                          <div key={result.label} className="rounded-2xl border border-white/10 bg-background-dark/50 p-4 text-center">
                            <p className="text-2xl font-black text-white">{result.value}</p>
                            <p className="mt-1 text-[10px] font-bold uppercase leading-tight tracking-wider text-slate-400">{result.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#C6A75E] p-10 text-background-dark shadow-[0_30px_90px_rgba(198,167,94,0.18)] md:p-14">
            <div className="absolute -right-16 -top-16 size-56 rounded-full bg-white/20 blur-3xl" />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-black md:text-5xl">Want similar results?</h2>
                <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-background-dark/75">Tell me about your project and I'll suggest a practical plan.</p>
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
