import Link from "next/link";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SmartImage from "./SmartImage";
import JsonLdScript from "./JsonLdScript";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeImage } from "@/lib/validators";
import { getCanonicalUrl } from "@/lib/pageMeta";
import { getServiceSchema, getFaqPageSchema } from "@/lib/schema";

async function getProjects(service) {
  if (!service) return [];

  try {
    let query = supabaseAdmin
      .from("projects")
      .select("*")
      .contains("service", [service])
      .eq("status", "published")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    let { data, error } = await query;

    if (error?.message?.includes("status")) return [];

    if (error && (error.message?.includes("deleted_at") || error.message?.includes("sort_order"))) {
      const result = await supabaseAdmin
        .from("projects")
        .select("*")
        .contains("service", [service])
        .eq("status", "published")
        .order("created_at", { ascending: false });
      data = result.data;
      error = result.error;
    }

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

async function getSetting(key) {
  if (!key) return "";

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

async function getCertificates(service) {
  if (!service) return [];

  try {
    const { data, error } = await supabaseAdmin
      .from("service_certifications")
      .select("*")
      .eq("service", service)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}

async function getCmsService(slug) {
  if (!slug) return null;

  try {
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error) return null;
    return data || null;
  } catch {
    return null;
  }
}

function mergeServiceConfig(config, cmsService) {
  if (!cmsService) return config;

  const bulletPoints = Array.isArray(cmsService.bullet_points) ? cmsService.bullet_points : [];

  return {
    ...config,
    service: cmsService.slug || config.service,
    slug: cmsService.slug || config.slug,
    sort_order: cmsService.sort_order ?? config.sort_order,
    icon: config.ignoreCmsContent ? config.icon : cmsService.icon || config.icon,
    description: config.ignoreCmsContent ? config.description : cmsService.short_description || config.description,
    short_description: config.ignoreCmsContent ? config.short_description : cmsService.short_description || config.short_description,
    bullet_points: config.ignoreCmsContent ? config.bullet_points : bulletPoints.length ? bulletPoints : config.bullet_points,
    title: config.ignoreCmsTitle ? config.title : cmsService.title || config.title,
    cmsTitle: cmsService.title || "",
    portfolioTitle: config.ignoreCmsTitle ? config.portfolioTitle : cmsService.title ? `Featured ${cmsService.title} Projects` : config.portfolioTitle,
  };
}

function SectionLabel({ eyebrow, title, description }) {
  return (
    <div className="mb-12 text-center">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
      <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">{title}</h2>
      {description && <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">{description}</p>}
    </div>
  );
}

function ToolsSection({
  tools,
  eyebrow = "Tools",
  title = "Tools I Use",
  description = "Core platforms used for web design builds and e-commerce experiences.",
}) {
  if (!tools?.length) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <div key={tool.name} className="flex items-center gap-6 rounded-2xl border border-white/5 bg-surface p-7 transition-colors hover:border-primary/30">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 p-4">
                <SmartImage src={tool.logo} alt={`${tool.name} logo`} width={56} height={56} className="h-14 w-14 object-contain" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{tool.name}</h3>
                <p className="mt-2 leading-relaxed text-slate-400">{tool.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RelatedServicesSection({ services }) {
  if (!services?.length) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel eyebrow="Keep Exploring" title="Related Services" description="Other ways I can help with your project in Bangladesh." />
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((item) => (
            <Link key={item.href} href={item.href} className="group flex flex-col rounded-2xl border border-white/5 bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:no-underline">
              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-primary">{item.title}</h3>
              <p className="mt-3 flex-1 leading-relaxed text-slate-400">{item.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                Learn more <span className="material-symbols-outlined text-base">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudiesSection({ studies }) {
  if (!studies?.length) return null;

  return (
    <section className="bg-slate-900/50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel eyebrow="Proof of Work" title="Related Case Studies" description="Measured results for projects like yours in Bangladesh." />
        <div className="grid gap-6 md:grid-cols-3">
          {studies.map((study) => (
            <Link key={study.href} href={study.href} className="group flex flex-col rounded-2xl border border-white/5 bg-surface p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:no-underline">
              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-primary">{study.title}</h3>
              <p className="mt-3 text-sm font-black uppercase tracking-widest text-primary">{study.result}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
                Read case study <span className="material-symbols-outlined text-base">arrow_forward</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CertificatesSection({ certificates }) {
  if (!certificates?.length) return null;

  return (
    <section className="bg-slate-900/50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel eyebrow="Qualifications" title="Certifications & Qualifications" description="Relevant certifications and proof of training connected to this service." />
        <div className="grid justify-items-center gap-8 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <article key={certificate.id} className="w-full max-w-[500px] overflow-hidden rounded-2xl border border-white/5 bg-surface transition-colors hover:border-primary/30">
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
  );
}

function ProjectCard({ project, fallbackIcon }) {
  const image = normalizeImage(project.thumbnail || project.image_refs?.[0] || (Array.isArray(project.images) ? project.images[0] : ""));
  const href = project.externalLink || `/projects/${project.slug || project.id}`;
  const external = Boolean(project.externalLink);
  const displayCategory = project.category === "CMS Projects" || project.category === "Web Development Projects" ? "Web Design Projects" : project.category;

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/5 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
      <div className="aspect-[4/3] overflow-hidden bg-primary/5">
        {image.url ? (
          <SmartImage src={image} alt={project.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-primary/40">
            <span className="material-symbols-outlined text-6xl">{fallbackIcon}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">{displayCategory}</p>
        <h3 className="text-2xl font-bold text-white">{project.title}</h3>
        {project.description && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">{project.description}</p>}
        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-primary px-5 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary/10"
        >
          View Project <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    </article>
  );
}

export default async function ServicePage({ config, pathname }) {
  const cmsService = await getCmsService(config.service);
  const mergedConfig = mergeServiceConfig(config, cmsService);
  const [projects, settingImage, certificates] = await Promise.all([
    getProjects(mergedConfig.service),
    getSetting(mergedConfig.imageSettingKey),
    getCertificates(mergedConfig.service),
  ]);
  const heroImage = settingImage || mergedConfig.heroImage;
  config = mergedConfig;
  const schemaTitle = config.schemaTitle || (typeof config.title === "string" ? config.title : config.eyebrow);
  const serviceSchema = getServiceSchema({
    title: schemaTitle,
    description: config.schemaDescription || config.description,
    pathname,
    image: heroImage,
  });
  const faqSchema = config.faq?.length ? getFaqPageSchema(config.faq) : null;

  return (
    <>
      <JsonLdScript id="service-schema" data={serviceSchema} />
      {faqSchema && <JsonLdScript id="faq-schema" data={faqSchema} />}
      <Navbar />
      <main className="min-h-screen bg-background-dark pt-28 text-slate-100">
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,167,94,0.14),transparent_45%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span>
                {config.eyebrow}
              </div>
              <h1 className="text-[44px] font-black tracking-tighter text-white md:text-[68px]">{config.title}</h1>
              <p className="mt-6 max-w-xl text-xl leading-relaxed text-slate-400">{config.description}</p>
              {config.parentService && (
                <Link href={config.parentService.href} className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary underline-offset-4 hover:underline">
                  {config.parentService.label} <span className="material-symbols-outlined text-base">arrow_back</span>
                </Link>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/#contact" className="inline-flex items-center gap-2 rounded-xl bg-[#C6A75E] px-7 py-4 font-bold text-background-dark transition-transform hover:-translate-y-0.5">
                  Start Your Project <span className="material-symbols-outlined">arrow_outward</span>
                </Link>
                <Link href="/#portfolio" className="rounded-xl border border-slate-700 px-7 py-4 font-bold text-white transition-colors hover:border-primary">
                  See Work
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-primary/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-2xl">
                {heroImage ? (
                  <SmartImage src={heroImage} alt={config.title} className="aspect-[4/3] h-full w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center text-primary/40">
                    <span className="material-symbols-outlined text-8xl">{config.icon}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionLabel eyebrow="What I Do" title={config.overviewTitle} description={config.overview} />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {config.features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-white/5 bg-surface p-6 transition-colors hover:border-primary/30">
                  <div className="mb-5 flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-400">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ToolsSection tools={config.tools} title={config.toolsTitle} description={config.toolsDescription} />

        <CertificatesSection certificates={certificates} />

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionLabel eyebrow="Workflow" title="Process Built For Results" description="A direct, collaborative workflow keeps work focused from first idea to launch." />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {config.process.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-white/5 bg-surface p-7">
                  <p className="mb-6 text-5xl font-black text-white/5">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-900/50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <SectionLabel eyebrow="Portfolio" title={config.portfolioTitle} description="Recent work connected to this service." />
            {projects.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => <ProjectCard key={project.id} project={project} fallbackIcon={config.icon} />)}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-surface/50 py-16 text-center text-slate-500">
                No projects published for this service yet.
              </div>
            )}
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <SectionLabel eyebrow="FAQ" title="Common Questions" />
            <div className="space-y-4">
              {config.faq.map((item) => (
                <div key={item.q} className="rounded-2xl border border-white/5 bg-surface p-6">
                  <h3 className="text-lg font-bold text-white">{item.q}</h3>
                  <p className="mt-3 leading-relaxed text-slate-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-slate-900/30 py-14">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Author & Contact</p>
            <p className="mt-4 text-lg font-bold text-white">Written by Mobarak Hossain Rinku</p>
            <p className="mt-2 text-slate-400">Freelance web designer and developer based in Dhaka, Bangladesh.</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-300">
              <a href="tel:+8801786029947" className="inline-flex items-center gap-2 hover:text-primary">+880 1786-029947</a>
              <span className="hidden text-slate-600 md:inline">|</span>
              <a href="mailto:contact@mhrinku.com" className="inline-flex items-center gap-2 hover:text-primary">contact@mhrinku.com</a>
              <span className="hidden text-slate-600 md:inline">|</span>
              <span className="inline-flex items-center gap-2">Dhaka, Bangladesh</span>
            </div>
          </div>
        </section>

        <RelatedServicesSection services={config.relatedServices} />
        <CaseStudiesSection studies={config.caseStudies} />

        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="overflow-hidden rounded-3xl bg-[#C6A75E] p-10 text-background-dark md:p-14">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-3xl font-black md:text-4xl">Ready to build something better?</h2>
                <p className="mt-3 max-w-2xl font-medium text-background-dark/75">Tell me about your goals and I’ll help shape a practical plan.</p>
              </div>
              <Link href="/#contact" className="inline-flex items-center justify-center rounded-xl bg-background-dark px-8 py-4 font-bold text-white">
                Contact Me
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
