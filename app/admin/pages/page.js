"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "../../../lib/adminFetch";
import MediaPicker from "../../components/admin/MediaPicker";

const PAGES = [
  { label: "Homepage", slug: "index", path: "/" },
  { label: "About Page", slug: "about", path: "/about" },
  { label: "Graphic Design", slug: "graphic-design-services-bangladesh", path: "/graphic-design-services-bangladesh" },
  { label: "UI/UX Design", slug: "ui-design", path: "/ui-design" },
  { label: "Ads Expert", slug: "ads-expert-bangladesh", path: "/ads-expert-bangladesh" },
  { label: "Web Design Hub", slug: "web-design-services-bangladesh", path: "/web-design-services-bangladesh" },
  { label: "WordPress Web Design", slug: "wordpress-web-design-bangladesh", path: "/wordpress-web-design-bangladesh" },
  { label: "Shopify Development", slug: "shopify-website-design-bangladesh", path: "/shopify-website-design-bangladesh" },
  { label: "SEO", slug: "seo", path: "/seo" },
  { label: "Blog Static Landing", slug: "blog", path: "/blog.html" },
  { label: "SEO Static Landing", slug: "seo-static", path: "/seo.html" },
];

const EMPTY_META = { meta_title: "", meta_description: "", og_image: "" };

export default function PagesAdmin() {
  const [selected, setSelected] = useState(PAGES[0].slug);
  const [content, setContent] = useState("");
  const [meta, setMeta] = useState(EMPTY_META);
  const [source, setSource] = useState("file");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const loadPage = async (slug) => {
    setLoading(true);
    setMessage("");
    try {
      const [pageRes, metaRes] = await Promise.all([
        adminFetch(`/api/pages?slug=${slug}`),
        adminFetch(`/api/page-meta?slug=${slug}`),
      ]);
      const pageData = await pageRes.json();
      const metaData = await metaRes.json();
      if (!pageRes.ok) {
        setMessage(pageData?.error || "Failed to load page.");
        setContent("");
        setSource("missing");
      } else {
        setContent(pageData?.html || "");
        setSource(pageData?.source || "file");
      }
      setMeta(metaRes.ok ? { ...EMPTY_META, ...metaData } : EMPTY_META);
    } catch (error) {
      setMessage("Failed to load page.");
      setContent("");
      setSource("missing");
      setMeta(EMPTY_META);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPage(selected); }, [selected]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const [pageRes, metaRes] = await Promise.all([
        adminFetch("/api/pages", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: selected, html: content }),
        }),
        adminFetch("/api/page-meta", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: selected, ...meta }),
        }),
      ]);
      const pageData = await pageRes.json();
      const metaData = await metaRes.json();
      if (!pageRes.ok) return setMessage(pageData?.error || "Page save failed.");
      if (!metaRes.ok) return setMessage(metaData?.error || "SEO save failed.");
      setSource("cms");
      setMessage("Page saved.");
    } catch (error) {
      setMessage("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const currentPage = PAGES.find((p) => p.slug === selected);

  return (
    <div className="max-w-5xl">
      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(url) => setMeta((prev) => ({ ...prev, og_image: url }))} />
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Pages Editor</h1>
        <p className="text-slate-400">Edit page HTML overrides and SEO metadata.</p>
      </div>

      <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-6">
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-slate-300">Select Page</label>
            <select value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-2 w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white appearance-none">
              {PAGES.map((p) => <option key={p.slug} value={p.slug}>{p.label} ({p.path})</option>)}
            </select>
          </div>
          <div className="text-sm text-slate-400">
            <div>Source: <span className="text-white font-bold">{source}</span></div>
            {currentPage && <div>Path: <span className="text-white">{currentPage.path}</span></div>}
          </div>
        </div>
      </div>

      <div className="mb-6 bg-surface border border-white/5 rounded-2xl p-6">
        <h2 className="mb-4 text-xl font-black text-white">SEO Fields</h2>
        <div className="space-y-4">
          <input value={meta.meta_title || ""} onChange={(e) => setMeta({ ...meta, meta_title: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" placeholder="Meta title" />
          <textarea value={meta.meta_description || ""} onChange={(e) => setMeta({ ...meta, meta_description: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" rows="2" placeholder="Meta description" />
          <div className="flex gap-2">
            <input value={meta.og_image || ""} onChange={(e) => setMeta({ ...meta, og_image: e.target.value })} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white" placeholder="OG image URL" />
            <button type="button" onClick={() => setPickerOpen(true)} className="rounded-xl border border-white/10 px-4 text-primary">Pick</button>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-white/5 rounded-2xl p-6">
        {message && <div className="mb-4 text-sm text-slate-300">{message}</div>}
        <label className="text-sm font-bold text-slate-300">Page HTML</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={18} className="mt-2 w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white text-xs font-mono focus:outline-none focus:border-primary/50" placeholder={loading ? "Loading..." : "Paste full HTML here"} disabled={loading} />
        <div className="mt-4 flex items-center gap-3">
          <button onClick={handleSave} disabled={saving || loading} className="bg-primary hover:bg-primary/90 text-background-dark font-bold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-50">{saving ? "Saving..." : "Save Page"}</button>
          <span className="text-xs text-slate-500">Saving will publish immediately.</span>
        </div>
      </div>
    </div>
  );
}
