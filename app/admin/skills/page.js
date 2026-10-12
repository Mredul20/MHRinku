"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

const EMPTY = { label: "", percentage: 0, icon: "", sort_order: 0, published: true };

export default function SkillsAdmin() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await adminFetch("/api/skills");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setMessage("");
    const res = await adminFetch("/api/skills", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data?.error || "Save failed.");
    setForm(EMPTY);
    setEditingId("");
    await load();
    setMessage("Saved.");
  };

  const remove = async (id) => {
    if (!confirm("Delete this skill?")) return;
    await adminFetch("/api/skills", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  const updateOrder = async (item, sort_order) => {
    await adminFetch("/api/skills", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...item, sort_order }) });
  };

  const move = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const current = items[index];
    const target = items[targetIndex];
    await Promise.all([updateOrder(current, target.sort_order ?? targetIndex), updateOrder(target, current.sort_order ?? index)]);
    load();
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8"><h1 className="text-3xl font-black text-white">Skills</h1><p className="mt-1 text-sm text-slate-400">Edit homepage proficiency bars.</p></div>
      <form onSubmit={save} className="mb-8 grid gap-4 rounded-2xl border border-white/5 bg-surface p-6 md:grid-cols-6">
        <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Graphic Design" className="md:col-span-2 rounded-xl border border-white/10 bg-slate-900 p-3 text-white" />
        <input type="number" min="0" max="100" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-slate-900 p-3 text-white" />
        <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="palette" className="rounded-xl border border-white/10 bg-slate-900 p-3 text-white" />
        <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="rounded-xl border border-white/10 bg-slate-900 p-3 text-white" />
        <button className="rounded-xl bg-primary px-5 py-3 font-black text-background-dark">{editingId ? "Update" : "Add"}</button>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-300"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
        {message && <p className="md:col-span-6 text-sm font-bold text-primary">{message}</p>}
      </form>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-surface">
        <table className="w-full text-sm"><tbody className="divide-y divide-white/5">{items.map((item, index) => <tr key={item.id} className="hover:bg-white/5"><td className="p-4"><button onClick={() => move(index, -1)} disabled={index === 0} className="mr-1 rounded border border-white/10 px-2 disabled:opacity-30">↑</button><button onClick={() => move(index, 1)} disabled={index === items.length - 1} className="rounded border border-white/10 px-2 disabled:opacity-30">↓</button></td><td className="p-4 font-bold text-white"><span className="material-symbols-outlined mr-2 text-primary align-middle">{item.icon}</span>{item.label}</td><td className="p-4 text-primary font-black">{item.percentage}%</td><td className="p-4 text-slate-400">{item.published ? "Published" : "Hidden"}</td><td className="p-4 text-right"><button onClick={() => { setEditingId(item.id); setForm(item); }} className="p-2 text-primary">Edit</button><button onClick={() => remove(item.id)} className="p-2 text-red-400">Delete</button></td></tr>)}</tbody></table>
      </div>
    </div>
  );
}
