"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { normalizeImage } from "@/lib/validators";
import SmartImage from "./SmartImage";

const fallbackFilters = ["All", "Design", "WordPress", "Ads", "SEO"];

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
    if (filter === "SEO") return Array.isArray(p.service) && p.service.includes("seo");
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
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {filteredProjects.map((project, index) => (
            <div key={project.id} style={{ animationDelay: `${index * 100}ms` }} className="preview-card project-card-animate group relative aspect-square bg-[#1A1A1A] rounded overflow-hidden border border-white/5 transition-colors duration-500">
              <SmartImage
                alt={getImage(project).alt_text || project.title}
                className="w-full h-full object-cover"
                src={getImage(project)}
              />
              <div className="absolute inset-0 bg-background-dark/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-8 text-center backdrop-blur-sm">
                <h5 className="text-2xl font-light tracking-tight mb-3 text-[#EDEDED]">{project.title}</h5>
                <p className="text-[#888888] font-light text-sm mb-8 leading-relaxed max-w-sm">{project.description}</p>

                {project.externalLink ? (
                  <a href={project.externalLink} target="_blank" rel="noopener noreferrer" className="border border-[#C6A75E] text-[#EDEDED] hover:bg-[#C6A75E]/5 tracking-widest uppercase text-xs px-8 py-3 rounded transition-all duration-300 flex items-center gap-3">
                     View Project <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                ) : (
                  <Link href={`/projects/${project.slug || project.id}`} className="border border-[#C6A75E] text-[#EDEDED] hover:bg-[#C6A75E]/5 tracking-widest uppercase text-xs px-8 py-3 rounded transition-all duration-300 flex items-center gap-3">
                     Case Study <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
