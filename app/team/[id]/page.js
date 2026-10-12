import { cache } from "react";
import { getCanonicalUrl } from "@/lib/pageMeta";
import { supabaseAdmin } from "@/lib/supabase";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import SmartImage from "../../components/SmartImage";
import Link from "next/link";
import { notFound } from "next/navigation";

/* ── fetch member on server ── */
const getMember = cache(async (id) => {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("*")
    .eq("id", id)
    .eq("published", true)
    .single();
  if (error || !data) return null;
  return data;
});

export async function generateStaticParams() {
  return [];
}

/* ── metadata ── */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) return { title: "Team Member Not Found" };
  return {
    title: `${member.name} — ${member.role} | MHR`,
    description: member.bio?.substring(0, 160),
    alternates: { canonical: getCanonicalUrl(`/team/${id}`) },
  };
}

/* ── page ── */
export default async function TeamMemberPage({ params }) {
  const { id } = await params;
  const member = await getMember(id);
  if (!member) notFound();

  const initial = member.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-[#121212] text-slate-100 font-sans">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/#team"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-[#C6A75E] transition-colors mb-10"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Team
          </Link>

          {/* ── Hero ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">

            {/* Photo */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 bg-[#C6A75E]/15 rounded-2xl blur-2xl group-hover:bg-[#C6A75E]/25 transition-all duration-700" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/5] bg-[#1A1A1A]">
                {member.photo_url ? (
                  <SmartImage
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#C6A75E] text-[8rem] font-black leading-none select-none">
                      {initial}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-8 order-1 lg:order-2">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A75E]/10 border border-[#C6A75E]/20 text-[#C6A75E] text-xs font-bold uppercase tracking-widest mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A75E] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6A75E]" />
                  </span>
                  Team Member
                </span>
                <p className="text-[#C6A75E] font-bold tracking-widest uppercase text-sm mb-3">
                  {member.role}
                </p>
                <h1 className="text-[44px] md:text-[56px] font-black tracking-tighter leading-[0.95] text-white">
                  {member.name}
                  <span className="text-[#C6A75E]">.</span>
                </h1>
              </div>

              <div className="border-l-2 border-[#C6A75E]/30 pl-6">
                <p className="text-slate-400 text-lg leading-relaxed">{member.bio}</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/#contact"
                  className="bg-[#C6A75E] hover:bg-[#C6A75E]/90 text-[#121212] font-bold py-4 px-8 rounded-xl text-lg transition-all flex items-center gap-2 shadow-lg shadow-[#C6A75E]/20"
                >
                  Work with us
                  <span className="material-symbols-outlined">arrow_outward</span>
                </Link>
                <Link
                  href="/#team"
                  className="border-2 border-slate-700 hover:border-[#C6A75E] text-slate-100 font-bold py-4 px-8 rounded-xl text-lg transition-all"
                >
                  Meet the Team
                </Link>
              </div>
            </div>
          </div>

          {/* ── About Card ── */}
          <div className="bg-[#1A1A1A] border border-white/5 rounded-3xl p-10 md:p-14">
            <div className="flex items-center gap-4 mb-8">
              <div className="size-14 bg-[#C6A75E]/10 rounded-xl flex items-center justify-center text-[#C6A75E]">
                <span className="material-symbols-outlined text-3xl">person</span>
              </div>
              <div>
                <p className="text-[#C6A75E] text-xs font-bold uppercase tracking-widest">About</p>
                <h2 className="text-2xl font-black text-white">{member.name}</h2>
              </div>
            </div>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">{member.bio}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C6A75E]/10 border border-[#C6A75E]/20">
              <span className="material-symbols-outlined text-[#C6A75E] text-lg">work</span>
              <span className="text-[#C6A75E] font-bold text-sm">{member.role}</span>
            </div>
          </div>

          {/* ── SEO Expertise Section (only for SEO-related roles) ── */}
          {/seo/i.test(member.role) && (
            <div className="mt-8 bg-[#1A1A1A] border border-white/5 rounded-3xl p-10 md:p-14">
              <div className="flex items-center gap-4 mb-10">
                <div className="size-14 bg-[#C6A75E]/10 rounded-xl flex items-center justify-center text-[#C6A75E]">
                  <span className="material-symbols-outlined text-3xl">query_stats</span>
                </div>
                <div>
                  <p className="text-[#C6A75E] text-xs font-bold uppercase tracking-widest">Specialisation</p>
                  <h2 className="text-2xl font-black text-white">SEO Expertise</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  { icon: "travel_explore", title: "Technical SEO", desc: "Site audits, Core Web Vitals, structured data, and crawlability optimization." },
                  { icon: "text_fields", title: "On-Page SEO", desc: "Keyword strategy, content optimization, meta tags, and internal linking." },
                  { icon: "link", title: "Off-Page & Link Building", desc: "Authority building through ethical link acquisition and digital PR." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="bg-[#121212] border border-white/5 rounded-2xl p-6 group hover:border-[#C6A75E]/30 transition-all duration-300">
                    <div className="size-12 bg-[#C6A75E]/10 rounded-xl flex items-center justify-center text-[#C6A75E] mb-4 group-hover:bg-[#C6A75E] group-hover:text-[#121212] transition-all duration-300">
                      <span className="material-symbols-outlined text-2xl">{icon}</span>
                    </div>
                    <h3 className="font-black text-white text-lg mb-2">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {[
                  { value: "3x", label: "Avg. Organic Growth" },
                  { value: "Top 3", label: "SERP Rankings" },
                  { value: "100+", label: "Keywords Ranked" },
                  { value: "98%", label: "Client Retention" },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-[#121212] border border-white/5 rounded-2xl p-5">
                    <p className="text-3xl font-black text-[#C6A75E] mb-1">{value}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA Banner ── */}
          <div className="mt-16 relative bg-[#C6A75E] rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-2xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-3xl md:text-4xl font-black text-[#121212] mb-3">
                  Want to work with us?
                </h3>
                <p className="text-[#121212]/70 text-lg font-medium">
                  Let&apos;s build something great together.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Link
                  href="/#contact"
                  className="bg-[#121212] text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-2xl text-center"
                >
                  Get in Touch
                </Link>
                <Link
                  href="/#team"
                  className="bg-transparent border-2 border-[#121212] text-[#121212] px-8 py-4 rounded-xl font-bold hover:bg-[#121212] hover:text-white transition-all text-center"
                >
                  Meet the Team
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
