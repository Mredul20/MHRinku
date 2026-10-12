"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "../../../lib/adminFetch";
import SmartImage from "../../components/SmartImage";

const CATEGORIES = ["WordPress Plugin", "WordPress Theme", "Shopify Theme", "Other"];
const emptyForm = { title: "", description: "", category: "WordPress Plugin", cover_url: "", action_url: "", action_type: "visit", badge: "", published: true };

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [view, setView] = useState("list");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchProducts = async () => {
    const res = await adminFetch("/api/products?admin=1");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const isEdit = view === "edit";
    const res = await adminFetch("/api/products", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.error) setMsg("Error: " + data.error);
    else {
      setMsg(isEdit ? "Product updated." : "Product saved.");
      setForm(emptyForm);
      setView("list");
      fetchProducts();
    }
    setLoading(false);
  };

  const handleToggle = async (id, published) => {
    await adminFetch("/api/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, published: !published }) });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await adminFetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchProducts();
  };

  const categoryColors = {
    "WordPress Plugin": "bg-blue-500/20 text-blue-400",
    "WordPress Theme": "bg-purple-500/20 text-purple-400",
    "Shopify Theme": "bg-green-500/20 text-green-400",
    "Other": "bg-white/10 text-muted",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">Products / Downloads</h1>
        {view === "list" ? (
          <button onClick={() => { setView("create"); setMsg(""); setForm(emptyForm); }}
            className="bg-primary hover:bg-primary/90 text-background-dark font-bold py-2 px-6 rounded-lg transition-all flex items-center gap-2 text-sm shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-lg">add</span> Add Product
          </button>
        ) : (
          <button onClick={() => setView("list")} className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-sm font-bold transition-all">Back</button>
        )}
      </div>

      {(view === "create" || view === "edit") && (
        <form onSubmit={handleSave} className="space-y-6 bg-surface p-8 rounded-2xl border border-white/5 max-w-2xl">
          <h2 className="text-xl font-bold">{view === "edit" ? "Edit Product" : "New Product"}</h2>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Title *</label>
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g. WooCommerce RBAC Admin Plugin"
              className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Category *</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary appearance-none">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Description *</label>
            <textarea required rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Describe what this plugin/theme does, features, requirements..."
              className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Cover Image URL</label>
            <input type="url" value={form.cover_url} onChange={e => setForm({...form, cover_url: e.target.value})}
              placeholder="https://example.com/screenshot.png"
              className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Link URL * (Download or Visit)</label>
            <input required type="url" value={form.action_url} onChange={e => setForm({...form, action_url: e.target.value})}
              placeholder="https://drive.google.com/file/... or https://yoursite.com/plugin"
              className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Button Type</label>
            <div className="flex gap-4">
              {["visit", "download"].map(t => (
                <button type="button" key={t} onClick={() => setForm({...form, action_type: t})}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${form.action_type === t ? 'bg-primary/10 border-primary text-primary' : 'border-white/10 text-muted hover:border-white/30'}`}>
                  <span className="material-symbols-outlined text-base">{t === "visit" ? "open_in_new" : "download"}</span>
                  {t === "visit" ? "Visit / View" : "Download"}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Badge Label (optional)</label>
            <input value={form.badge} onChange={e => setForm({...form, badge: e.target.value})}
              placeholder="e.g. Free, v1.2.0, New, Popular"
              className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary" />
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="prod-pub" checked={form.published} onChange={e => setForm({...form, published: e.target.checked})} className="w-4 h-4 accent-primary" />
            <label htmlFor="prod-pub" className="text-sm font-bold">Publish immediately (show on website)</label>
          </div>

          {msg && <p className="text-sm font-bold text-primary">{msg}</p>}
          <button disabled={loading} type="submit" className="bg-primary hover:bg-primary/90 text-background-dark font-black py-3 px-8 rounded-xl transition-all disabled:opacity-50">
            {loading ? "Saving..." : view === "edit" ? "Update Product" : "Save Product"}
          </button>
        </form>
      )}

      {view === "list" && (
        <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden">
          {products.length === 0 ? (
            <div className="p-16 text-center">
              <span className="material-symbols-outlined text-6xl text-muted mb-4 block">extension</span>
              <p className="font-bold text-lg text-white">No products yet</p>
              <p className="text-muted text-sm mt-1">Add your plugins and themes to showcase on the web design page</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {products.map(p => (
                <div key={p.id} className="flex items-center gap-4 p-5 hover:bg-white/5 transition-all">
                  {p.cover_url
                    ? <SmartImage src={p.cover_url} alt={p.title} className="w-16 h-12 rounded-lg object-cover border border-white/10 flex-shrink-0" />
                    : <div className="w-16 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary">extension</span>
                      </div>
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-white truncate">{p.title}</p>
                      {p.badge && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">{p.badge}</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${categoryColors[p.category] || 'bg-white/10 text-muted'}`}>{p.category}</span>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">{p.action_type === "download" ? "download" : "open_in_new"}</span>
                        {p.action_type === "download" ? "Download" : "Visit Link"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleToggle(p.id, p.published)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${p.published ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-muted'}`}>
                      {p.published ? "Published" : "Hidden"}
                    </button>
                    <a href={p.action_url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/10 rounded-lg transition-all text-muted hover:text-white">
                      <span className="material-symbols-outlined text-lg">open_in_new</span>
                    </a>
                    <button onClick={() => { setView("edit"); setMsg(""); setForm({ ...emptyForm, ...p }); }} className="p-2 hover:bg-white/10 text-primary rounded-lg transition-all" title="Edit">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all" title="Delete">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
