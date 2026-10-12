"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "../../../lib/adminFetch";
import { getMaxUploadBytes, getFileTooLargeMessage, uploadDirectToStorage } from "../../../lib/uploadClient";
import { normalizeImageRef, normalizeImageRefs, slugify, validateProjectForPublish } from "../../../lib/validators";
import SmartImage from "../../components/SmartImage";
import MediaPicker from "../../components/admin/MediaPicker";

const categories = [
  "Graphic Design Projects",
  "Meta Ads / Marketing Proof",
  "UI/UX Design",
  "Web Design Projects",
  "WordPress Plugins & Themes",
  "Landing Page Bundles"
];

const services = [
  { label: "Graphic Design", value: "graphic-design", icon: "brush" },
  { label: "UI/UX Design",   value: "ui-design",      icon: "layers" },
  { label: "Ads Expert", value: "meta-ads", icon: "ads_click" },
  { label: "WordPress Web Design", value: "wordpress-dev", icon: "language" },
  { label: "SEO",            value: "seo",             icon: "query_stats" },
];

const EMPTY_FORM = {
  title: "", slug: "", description: "", category: categories[0],
  thumbnail: "", thumbnail_alt_text: "", images: [], image_refs: [], externalLink: "",
  additionalFields: {}, service: [], status: "draft", content_blocks: [],
  sort_order: 0, tags: [], meta_title: "", meta_description: "", og_image: ""
};

const blockTypes = ["heading", "paragraph", "image", "image_gallery", "before_after", "quote"];

const getDisplayCategory = (category) =>
  category === "CMS Projects" || category === "Web Development Projects" ? "Web Design Projects" : category;

const getProjectThumb = (project) => normalizeImageRef(
  project.thumbnail
    ? { url: project.thumbnail, alt_text: project.thumbnail_alt_text || "" }
    : project.image_refs?.[0] || project.images?.[0] || null
);

const prepareProjectForm = (project = {}) => {
  const imageRefs = normalizeImageRefs(project.image_refs);
  const legacyRefs = normalizeImageRefs(project.images);
  return {
    ...EMPTY_FORM,
    ...project,
    status: project.status || "draft",
    slug: project.slug || slugify(project.title),
    service: Array.isArray(project.service) ? project.service : [],
    tags: Array.isArray(project.tags) ? project.tags : [],
    images: Array.isArray(project.images) ? project.images : [],
    image_refs: imageRefs.length ? imageRefs : legacyRefs,
    content_blocks: Array.isArray(project.content_blocks) ? project.content_blocks : [],
    additionalFields: project.additionalFields || {},
    sort_order: Number.isFinite(Number(project.sort_order)) ? Number(project.sort_order) : 0,
    thumbnail_alt_text: project.thumbnail_alt_text || "",
    meta_title: project.meta_title || "",
    meta_description: project.meta_description || "",
    og_image: project.og_image || "",
  };
};

export default function ProjectManagement() {
  const [projects, setProjects]   = useState([]);
  const [view, setView]           = useState("list");
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [missingFields, setMissingFields] = useState([]);
  const [formData, setFormData]   = useState(EMPTY_FORM);
  const [loading, setLoading]     = useState(false);
  const [uploading, setUploading] = useState(false);
  const [picker, setPicker]       = useState(null);

  const fetchProjects = async () => {
    try {
      const res  = await adminFetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchProjects();
  }, [view]);

  const buildPayload = () => ({
    ...formData,
    slug: slugify(formData.slug || formData.title),
    tags: Array.isArray(formData.tags) ? formData.tags : [],
    image_refs: normalizeImageRefs(formData.image_refs),
    images: normalizeImageRefs(formData.image_refs).map((image) => image.url),
    thumbnail: formData.thumbnail || normalizeImageRefs(formData.image_refs)[0]?.url || "",
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setMissingFields([]);

    const payload = buildPayload();
    const missing = payload.status === "published" ? validateProjectForPublish(payload) : [];
    if (missing.length) {
      setMissingFields(missing);
      setError("Complete required fields before publishing.");
      return;
    }

    setLoading(true);
    try {
      const isEdit = view === "edit";
      const res = await adminFetch("/api/projects", {
        method:  isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(isEdit ? "Project updated successfully!" : "Project created successfully!");
        setTimeout(() => setView("list"), 800);
      } else {
        setMissingFields(data?.missingFields || []);
        setError(data?.error || `Error ${res.status}: Failed to save project.`);
      }
    } catch (e) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      const res = await adminFetch("/api/projects", {
        method:  "DELETE",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ id }),
      });
      if (res.ok) fetchProjects();
      else alert((await res.json())?.error || "Failed to delete project.");
    } catch (e) {
      alert("Network error. Please try again.");
    }
  };

  const uploadAndSet = async (file, setter) => {
    if (!file) return;
    if (file.size > getMaxUploadBytes()) {
      setError(getFileTooLargeMessage());
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadDirectToStorage(file);
      setter(url);
    } catch (e) {
      setError(e?.message || "Image upload failed. Check your connection.");
    }
    setUploading(false);
  };

  const setAdditional = (key, val) =>
    setFormData(prev => ({ ...prev, additionalFields: { ...prev.additionalFields, [key]: val } }));

  const toggleService = (value) => {
    setFormData(prev => {
      const current = Array.isArray(prev.service) ? prev.service : [];
      return { ...prev, service: current.includes(value) ? current.filter(s => s !== value) : [...current, value] };
    });
  };

  const setTagsFromText = (value) => {
    setFormData((prev) => ({ ...prev, tags: value.split(",").map((tag) => tag.trim()).filter(Boolean) }));
  };

  const addImageRef = (url) => {
    setFormData((prev) => ({ ...prev, image_refs: [...normalizeImageRefs(prev.image_refs), { url, alt_text: "" }] }));
  };

  const updateImageRef = (index, updates) => {
    setFormData((prev) => {
      const next = normalizeImageRefs(prev.image_refs);
      next[index] = { ...next[index], ...updates };
      return { ...prev, image_refs: next };
    });
  };

  const removeImageRef = (index) => {
    setFormData((prev) => ({ ...prev, image_refs: normalizeImageRefs(prev.image_refs).filter((_, idx) => idx !== index) }));
  };

  const addBlock = (type) => {
    setFormData((prev) => {
      const block = { id: `${type}-${prev.content_blocks.length + 1}`, type };
      if (type === "heading" || type === "paragraph" || type === "quote") block.text = "";
      if (type === "quote") block.cite = "";
      if (type === "image") block.image = { url: "", alt_text: "" };
      if (type === "image_gallery") block.images = [];
      if (type === "before_after") {
        block.before = { url: "", alt_text: "" };
        block.after = { url: "", alt_text: "" };
      }
      return { ...prev, content_blocks: [...prev.content_blocks, block] };
    });
  };

  const updateBlock = (index, updates) => {
    setFormData((prev) => ({
      ...prev,
      content_blocks: prev.content_blocks.map((block, idx) => idx === index ? { ...block, ...updates } : block),
    }));
  };

  const moveBlock = (index, direction) => {
    setFormData((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.content_blocks.length) return prev;
      const next = [...prev.content_blocks];
      [next[index], next[target]] = [next[target], next[index]];
      return { ...prev, content_blocks: next };
    });
  };

  const removeBlock = (index) => {
    setFormData((prev) => ({ ...prev, content_blocks: prev.content_blocks.filter((_, idx) => idx !== index) }));
  };

  const startEdit = (project) => {
    setFormData(prepareProjectForm(project));
    setView("edit");
    setError("");
    setSuccess("");
    setMissingFields([]);
  };

  const updateProjectOrder = async (project, nextOrder) => {
    const payload = prepareProjectForm({ ...project, sort_order: nextOrder });
    await adminFetch("/api/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const moveProject = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const current = projects[index];
    const target = projects[targetIndex];
    await Promise.all([
      updateProjectOrder(current, target.sort_order ?? targetIndex),
      updateProjectOrder(target, current.sort_order ?? index),
    ]);
    fetchProjects();
  };

  const chooseMedia = (callback) => setPicker({ callback });

  if (view === "create" || view === "edit") {
    const imageRefs = normalizeImageRefs(formData.image_refs);
    return (
      <div className="max-w-5xl">
        <MediaPicker open={Boolean(picker)} onClose={() => setPicker(null)} onSelect={(url) => picker?.callback(url)} />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black">{view === "create" ? "Add New Project" : "Edit Project"}</h1>
          <button onClick={() => { setView("list"); setError(""); }} className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-all text-sm font-bold">← Back to List</button>
        </div>

        {error && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-bold">{error}</div>}
        {missingFields.length > 0 && (
          <div className="mb-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-200">
            <p className="mb-2 font-black text-yellow-300">Missing before publish:</p>
            <ul className="list-disc space-y-1 pl-5">{missingFields.map((field) => <li key={field}>{field}</li>)}</ul>
          </div>
        )}
        {success && <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-bold">{success}</div>}

        <form onSubmit={handleSave} className="space-y-6 bg-surface p-8 rounded-2xl border border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Project Title *</label>
              <input type="text" value={formData.title} onChange={e => {
                const title = e.target.value;
                setFormData({ ...formData, title, slug: view === "create" ? slugify(title) : formData.slug });
              }} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Slug</label>
              <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: slugify(e.target.value) })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Category *</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none text-white appearance-none">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 focus:border-primary focus:outline-none text-white appearance-none">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-300">Description *</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none" rows="3" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Tags (comma-separated)</label>
              <input type="text" value={formData.tags.join(", ")} onChange={e => setTagsFromText(e.target.value)} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none" placeholder="Design, WordPress, Ads" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300">Sort Order</label>
              <input type="number" value={formData.sort_order} onChange={e => setFormData({ ...formData, sort_order: Number(e.target.value) })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary focus:outline-none" />
            </div>
          </div>

          <div className="p-5 bg-primary/5 rounded-xl border border-primary/20 space-y-3">
            <h3 className="text-primary font-bold tracking-wider text-sm uppercase">Service Pages</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {services.map(s => {
                const checked = Array.isArray(formData.service) && formData.service.includes(s.value);
                return (
                  <label key={s.value} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all select-none ${checked ? "bg-primary/15 border-primary/40 text-primary" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}>
                    <input type="checkbox" className="hidden" checked={checked} onChange={() => toggleService(s.value)} />
                    <span className="material-symbols-outlined text-base">{s.icon}</span>
                    <span className="text-xs font-bold">{s.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-5">
            <h3 className="text-primary font-bold tracking-wider text-sm uppercase">Images & Alt Text</h3>
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
              <label className={`flex items-center gap-3 cursor-pointer border border-dashed border-white/20 rounded-xl p-4 hover:border-primary/40 transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
                <span className="text-sm text-slate-400">{uploading ? "Uploading…" : "Upload image"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={e => uploadAndSet(e.target.files[0], addImageRef)} />
              </label>
              <button type="button" onClick={() => chooseMedia(addImageRef)} className="rounded-xl border border-white/10 p-4 text-sm font-bold text-slate-300 hover:border-primary/40 hover:text-primary">
                Pick from Media Library
              </button>
              <button type="button" onClick={() => formData.og_image && addImageRef(formData.og_image)} className="rounded-xl border border-white/10 px-4 text-sm font-bold text-slate-300 hover:border-primary/40 hover:text-primary">
                Use OG
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {imageRefs.map((image, index) => (
                <div key={`${image.url}-${index}`} className="rounded-xl border border-white/10 bg-slate-900 p-3">
                  <div className="flex gap-3">
                    <SmartImage src={image.url} className="h-20 w-20 rounded-lg object-cover" alt={image.alt_text || "Project image"} />
                    <div className="flex-1 space-y-2">
                      <input value={image.url} onChange={(e) => updateImageRef(index, { url: e.target.value })} className="w-full rounded-lg border border-white/10 bg-surface p-2 text-xs text-white" />
                      <input value={image.alt_text} onChange={(e) => updateImageRef(index, { alt_text: e.target.value })} className="w-full rounded-lg border border-white/10 bg-surface p-2 text-sm text-white" placeholder="Alt text (required before publish)" />
                    </div>
                    <button type="button" onClick={() => removeImageRef(index)} className="text-red-400 hover:text-white">×</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-slate-300">Thumbnail URL</label>
                <div className="mt-2 flex gap-2">
                  <input value={formData.thumbnail} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" />
                  <button type="button" onClick={() => chooseMedia((url) => setFormData((prev) => ({ ...prev, thumbnail: url })))} className="rounded-xl border border-white/10 px-4 text-primary">Pick</button>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-300">Thumbnail Alt Text</label>
                <input value={formData.thumbnail_alt_text} onChange={e => setFormData({ ...formData, thumbnail_alt_text: e.target.value })} className="mt-2 w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-primary font-bold tracking-wider text-sm uppercase">Content Blocks</h3>
              <div className="flex flex-wrap gap-2">{blockTypes.map((type) => <button key={type} type="button" onClick={() => addBlock(type)} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:border-primary hover:text-primary">+ {type}</button>)}</div>
            </div>
            {formData.content_blocks.map((block, index) => (
              <div key={block.id || index} className="rounded-xl border border-white/10 bg-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-black uppercase tracking-widest text-primary">{index + 1}. {block.type}</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="rounded border border-white/10 px-2 disabled:opacity-30">↑</button>
                    <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === formData.content_blocks.length - 1} className="rounded border border-white/10 px-2 disabled:opacity-30">↓</button>
                    <button type="button" onClick={() => removeBlock(index)} className="rounded border border-red-500/30 px-2 text-red-400">Delete</button>
                  </div>
                </div>

                {(block.type === "heading" || block.type === "paragraph" || block.type === "quote") && (
                  <textarea value={block.text || ""} onChange={(e) => updateBlock(index, { text: e.target.value })} rows={block.type === "paragraph" ? 4 : 2} className="w-full rounded-xl border border-white/10 bg-surface p-3 text-white" placeholder={`${block.type} text`} />
                )}
                {block.type === "quote" && <input value={block.cite || ""} onChange={(e) => updateBlock(index, { cite: e.target.value })} className="w-full rounded-xl border border-white/10 bg-surface p-3 text-white" placeholder="Citation" />}
                {block.type === "image" && <ImageField image={block.image} onChange={(image) => updateBlock(index, { image })} chooseMedia={chooseMedia} />}
                {block.type === "image_gallery" && <GalleryField images={block.images || []} onChange={(images) => updateBlock(index, { images })} chooseMedia={chooseMedia} />}
                {block.type === "before_after" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <ImageField label="Before" image={block.before} onChange={(before) => updateBlock(index, { before })} chooseMedia={chooseMedia} />
                    <ImageField label="After" image={block.after} onChange={(after) => updateBlock(index, { after })} chooseMedia={chooseMedia} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
            <h3 className="text-primary font-bold tracking-wider text-sm uppercase">SEO</h3>
            <input value={formData.meta_title} onChange={e => setFormData({ ...formData, meta_title: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" placeholder="Meta title" />
            <textarea value={formData.meta_description} onChange={e => setFormData({ ...formData, meta_description: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" rows="2" placeholder="Meta description" />
            <div className="flex gap-2">
              <input value={formData.og_image} onChange={e => setFormData({ ...formData, og_image: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" placeholder="OG image URL (defaults to first project image)" />
              <button type="button" onClick={() => chooseMedia((url) => setFormData((prev) => ({ ...prev, og_image: url })))} className="rounded-xl border border-white/10 px-4 text-primary">Pick</button>
            </div>
          </div>

          <button disabled={loading || uploading} type="submit" className="bg-primary hover:bg-primary/90 text-background-dark font-black py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2">
            <span className="material-symbols-outlined">{view === "edit" ? "save" : "add_circle"}</span>
            {loading ? "Saving…" : view === "edit" ? "Update Project" : "Create Project"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black">Projects Catalog</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
        </div>
        <button onClick={() => { setView("create"); setError(""); setSuccess(""); setMissingFields([]); setFormData(EMPTY_FORM); }} className="bg-primary hover:bg-primary/90 text-background-dark font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-sm shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-lg">add</span> Add Project
        </button>
      </div>

      <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-white/5 uppercase text-xs font-bold tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-4">Order</th>
              <th className="px-6 py-4">Preview</th>
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {projects.map((p, index) => {
              const thumb = getProjectThumb(p);
              return (
                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button onClick={() => moveProject(index, -1)} disabled={index === 0} className="rounded border border-white/10 px-2 disabled:opacity-30">↑</button>
                      <button onClick={() => moveProject(index, 1)} disabled={index === projects.length - 1} className="rounded border border-white/10 px-2 disabled:opacity-30">↓</button>
                    </div>
                  </td>
                  <td className="px-6 py-4">{thumb.url ? <SmartImage src={thumb} alt={thumb.alt_text || p.title} className="w-12 h-12 rounded-lg object-cover border border-white/10" /> : <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-600"><span className="material-symbols-outlined text-xl">image</span></div>}</td>
                  <td className="px-6 py-4 font-bold text-white">{p.title}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs font-bold bg-white/10 text-white">{getDisplayCategory(p.category)}</span></td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === "published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{p.status || "draft"}</span></td>
                  <td className="px-6 py-4"><div className="flex flex-wrap gap-1">{Array.isArray(p.tags) && p.tags.length ? p.tags.map((tag) => <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{tag}</span>) : <span className="text-slate-600 text-xs italic">None</span>}</div></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-primary hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Edit" onClick={() => startEdit(p)}><span className="material-symbols-outlined text-lg">edit</span></button>
                      <button className="text-red-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-red-500/20" title="Delete" onClick={() => handleDelete(p.id)}><span className="material-symbols-outlined text-lg">delete</span></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {projects.length === 0 && <tr><td colSpan="7" className="px-6 py-12 text-center text-muted italic">No projects yet. Click <strong className="text-white">Add Project</strong> to get started.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ImageField({ image, onChange, chooseMedia, label = "Image" }) {
  const ref = normalizeImageRef(image);
  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-surface p-3">
      <label className="text-sm font-bold text-slate-300">{label}</label>
      <div className="flex gap-2">
        <input value={ref.url} onChange={(e) => onChange({ ...ref, url: e.target.value })} className="w-full rounded-lg border border-white/10 bg-slate-900 p-2 text-xs text-white" placeholder="Image URL" />
        <button type="button" onClick={() => chooseMedia((url) => onChange({ ...ref, url }))} className="rounded-lg border border-white/10 px-3 text-primary">Pick</button>
      </div>
      <input value={ref.alt_text} onChange={(e) => onChange({ ...ref, alt_text: e.target.value })} className="w-full rounded-lg border border-white/10 bg-slate-900 p-2 text-sm text-white" placeholder="Alt text" />
    </div>
  );
}

function GalleryField({ images, onChange, chooseMedia }) {
  const refs = normalizeImageRefs(images);
  return (
    <div className="space-y-3">
      <button type="button" onClick={() => chooseMedia((url) => onChange([...refs, { url, alt_text: "" }]))} className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-primary">Add gallery image</button>
      <div className="grid gap-3 md:grid-cols-2">
        {refs.map((image, index) => (
          <ImageField key={`${image.url}-${index}`} image={image} chooseMedia={chooseMedia} onChange={(nextImage) => onChange(refs.map((item, idx) => idx === index ? nextImage : item))} label={`Gallery image ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}
