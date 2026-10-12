"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { normalizeImage } from "@/lib/validators";
import SmartImage from "./SmartImage";

const fallbackFilters = ["All", "Design", "WordPress", "Ads"];

const getImage = (project) => normalizeImage(
  project.thumbnail
    ? { url: project.thumbnail, alt_text: project.thumbnail_alt_text || "" }
    : project.image_refs?.[0] || project.images?.[0] || "/img/placeholder.jpg"
);

export default function ProjectGrid({ initialProjects }) {
  const filters = useMemo(() => {
    const tags = [...new Set((initialProjects || []).flatMap((project) => Array.isArray(project.tags) ? project.tags : []).filter(Boolean))];
    return tags.length ? ["All", ...tags] : fallbackFilters;
  }, [initialProjects]);
  const [filter, setFilter] = useState("All");

  const filteredProjects = initialProjects.filter(p => {
    if (filter === "All") return true;
    if (Array.isArray(p.tags) && p.tags.includes(filter)) return true;
    if (filter === "Design") return p.category.includes("Design");
    if (filter === "WordPress") return p.category.includes("WordPress") || p.category.includes("Web Design") || p.category.includes("Web Development") || p.category.includes("CMS");
    if (filter === "Ads") return p.category.includes("Ads");
    return false;
  });

  return (
    <>
      <div className="flex flex-wrap gap-4 mb-16">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded tracking-widest text-xs uppercase transition-all duration-300 font-light ${filter === f ? 'bg-[#C6A75E] text-background-dark' : 'border border-[#C6A75E]/50 text-[#888888] hover:border-[#C6A75E] hover:text-[#EDEDED]'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center text-[#888888] font-light tracking-widest uppercase text-sm border border-white/5 bg-[#1A1A1A] rounded">
          No projects found in archive.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredProjects.map((project, index) => {
            const external = Boolean(project.externalLink);
            const href = external ? project.externalLink : `/projects/${project.slug || project.id}`;
            const ctaClass = "mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-[#C6A75E] px-6 py-3 text-sm font-bold text-background-dark transition-transform hover:-translate-y-0.5";

            return (
              <article key={project.id} style={{ animationDelay: `${index * 100}ms` }} className="project-card-animate group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#1A1A1A] transition-colors duration-500 hover:border-[#C6A75E]/40 sm:flex-row">
                <div className="aspect-[4/3] shrink-0 overflow-hidden sm:aspect-auto sm:w-2/5">
                  <SmartImage
                    alt={getImage(project).alt_text || project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={getImage(project)}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6 md:p-8">
                  <h3 className="text-2xl font-bold tracking-tight text-[#EDEDED]">{project.title}</h3>
                  {project.description && <p className="mt-3 line-clamp-3 leading-relaxed text-[#888888]">{project.description}</p>}
                  {external ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={ctaClass}>
                      View Project <span className="material-symbols-outlined text-base">arrow_outward</span>
                    </a>
                  ) : (
                    <Link href={href} className={ctaClass}>
                      View Project <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
