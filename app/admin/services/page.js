"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "../../../lib/adminFetch";
import { getMaxUploadBytes, getFileTooLargeMessage, uploadDirectToStorage } from "../../../lib/uploadClient";
import { DEFAULT_SERVICES } from "../../../lib/cmsFallbacks";
import { slugify } from "../../../lib/validators";
import SmartImage from "../../components/SmartImage";
import MediaPicker from "../../components/admin/MediaPicker";

const EMPTY_SERVICE = { icon: "", title: "", short_description: "", bullet_points: [], slug: "", sort_order: 0, published: true, meta_title: "", meta_description: "", og_image: "" };

function Toast({ message, type }) {
  if (!message) return null;
  const colors = type === "error" ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-green-500/10 border-green-500/30 text-green-400";
  return <div className={`fixed bottom-6 right-6 z-50 rounded-xl border px-5 py-3 text-sm font-bold shadow-xl ${colors}`}>{message}</div>;
}

export default function ServicesAdmin() {
  const [services, setServices] = useState(DEFAULT_SERVICES.map((service) => ({ ...EMPTY_SERVICE, ...service })));
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE);
  const [editingServiceId, setEditingServiceId] = useState("");
  const [selectedService, setSelectedService] = useState(DEFAULT_SERVICES[0].slug);
  const [certificates, setCertificates] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [picker, setPicker] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const res = await adminFetch("/api/services");
      const data = await res.json();
      const rows = Array.isArray(data) && data.length ? data : DEFAULT_SERVICES.map((service) => ({ ...EMPTY_SERVICE, ...service }));
      setServices(rows);
      if (!rows.some((service) => service.slug === selectedService)) setSelectedService(rows[0]?.slug || DEFAULT_SERVICES[0].slug);
    } catch {
      setServices(DEFAULT_SERVICES.map((service) => ({ ...EMPTY_SERVICE, ...service })));
    }
  }, [selectedService]);

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/service-certifications?service=${selectedService}`);
      const data = await res.json();
      setCertificates(Array.isArray(data) ? data : []);
    } catch {
      setCertificates([]);
      showToast("Failed to load certificates.", "error");
    } finally {
      setLoading(false);
    }
  }, [selectedService, showToast]);

  useEffect(() => { fetchServices(); }, [fetchServices]);
  useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

  const selectedMeta = services.find((service) => service.slug === selectedService) || services[0] || DEFAULT_SERVICES[0];

  const saveService = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...serviceForm, slug: slugify(serviceForm.slug || serviceForm.title) };
      const res = await adminFetch("/api/services", {
        method: editingServiceId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingServiceId ? { ...payload, id: editingServiceId } : payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Service save failed.");
      setServiceForm(EMPTY_SERVICE);
      setEditingServiceId("");
      await fetchServices();
      showToast("Service saved.");
    } catch (error) {
      showToast(error?.message || "Service save failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  const editService = (service) => {
    setEditingServiceId(service.id || "");
    setServiceForm({ ...EMPTY_SERVICE, ...service, bullet_points: Array.isArray(service.bullet_points) ? service.bullet_points : service.bullets || [] });
  };

  const deleteService = async (service) => {
    if (!service.id) return showToast("Seed this service in Supabase before deleting.", "error");
    if (!confirm(`Delete "${service.title}"?`)) return;
    const res = await adminFetch("/api/services", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: service.id }) });
    if (!res.ok) showToast("Delete failed.", "error");
    else { await fetchServices(); showToast("Service deleted."); }
  };

  const updateServiceOrder = async (service, sort_order) => {
    if (!service.id) return;
    await adminFetch("/api/services", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...service, sort_order }) });
  };

  const moveService = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= services.length) return;
    const current = services[index];
    const target = services[targetIndex];
    await Promise.all([updateServiceOrder(current, target.sort_order ?? targetIndex), updateServiceOrder(target, current.sort_order ?? index)]);
    fetchServices();
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > getMaxUploadBytes()) {
      showToast(getFileTooLargeMessage(), "error");
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadDirectToStorage(file);
      setImage(url || "");
      showToast("Image uploaded.");
    } catch (error) {
      showToast(error?.message || "Image upload failed.", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return showToast("Title is required.", "error");
    if (!image.trim()) return showToast("Image is required.", "error");
    setSaving(true);
    try {
      const res = await adminFetch("/api/service-certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: selectedService, title: title.trim(), image: image.trim(), sort_order: certificates.length }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed.");
      setTitle("");
      setImage("");
      await fetchCertificates();
      showToast("Certificate added.");
    } catch (error) {
      showToast(error?.message || "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateCertificate = async (certificate, updates) => {
    const res = await adminFetch("/api/service-certifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...certificate, ...updates }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Update failed.");
    return data;
  };

  const handleDelete = async (certificate) => {
    if (!confirm(`Delete "${certificate.title}"?`)) return;
    try {
      const res = await adminFetch("/api/service-certifications", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: certificate.id }) });
      if (!res.ok) throw new Error((await res.json())?.error || "Delete failed.");
      await fetchCertificates();
      showToast("Certificate deleted.");
    } catch (error) {
      showToast(error?.message || "Delete failed.", "error");
    }
  };

  const moveCertificate = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= certificates.length) return;
    const current = certificates[index];
    const target = certificates[targetIndex];
    try {
      await Promise.all([updateCertificate(current, { sort_order: target.sort_order ?? targetIndex }), updateCertificate(target, { sort_order: current.sort_order ?? index })]);
      await fetchCertificates();
      showToast("Order updated.");
    } catch (error) {
      showToast(error?.message || "Order update failed.", "error");
    }
  };

  return (
    <div>
      <Toast message={toast.message} type={toast.type} />
      <MediaPicker open={picker} onClose={() => setPicker(false)} onSelect={(url) => setImage(url)} />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black text-white">Services</h1>
        <p className="text-slate-400">Edit homepage service cards and service-page certification images.</p>
      </div>

      <form onSubmit={saveService} className="mb-10 rounded-2xl border border-white/5 bg-surface p-8">
        <h2 className="mb-6 text-xl font-bold text-white">{editingServiceId ? "Edit Service" : "Add Service"}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input value={serviceForm.title} onChange={(e) => setServiceForm((prev) => ({ ...prev, title: e.target.value, slug: editingServiceId ? prev.slug : slugify(e.target.value) }))} className="rounded-xl border border-white/10 bg-slate-900 p-3 text-white" placeholder="Title" />
          <input value={serviceForm.slug} onChange={(e) => setServiceForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))} className="rounded-xl border border-white/10 bg-slate-900 p-3 text-white" placeholder="slug" />
          <input value={serviceForm.icon} onChange={(e) => setServiceForm((prev) => ({ ...prev, icon: e.target.value }))} className="rounded-xl border border-white/10 bg-slate-900 p-3 text-white" placeholder="Material icon name" />
          <input type="number" value={serviceForm.sort_order} onChange={(e) => setServiceForm((prev) => ({ ...prev, sort_order: Number(e.target.value) }))} className="rounded-xl border border-white/10 bg-slate-900 p-3 text-white" />
          <textarea value={serviceForm.short_description} onChange={(e) => setServiceForm((prev) => ({ ...prev, short_description: e.target.value }))} className="md:col-span-2 rounded-xl border border-white/10 bg-slate-900 p-3 text-white" rows="2" placeholder="Short description" />
          <input value={(serviceForm.bullet_points || []).join(", ")} onChange={(e) => setServiceForm((prev) => ({ ...prev, bullet_points: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) }))} className="md:col-span-2 rounded-xl border border-white/10 bg-slate-900 p-3 text-white" placeholder="Bullet points, comma-separated" />
          <input value={serviceForm.meta_title || ""} onChange={(e) => setServiceForm((prev) => ({ ...prev, meta_title: e.target.value }))} className="rounded-xl border border-white/10 bg-slate-900 p-3 text-white" placeholder="Meta title" />
          <input value={serviceForm.og_image || ""} onChange={(e) => setServiceForm((prev) => ({ ...prev, og_image: e.target.value }))} className="rounded-xl border border-white/10 bg-slate-900 p-3 text-white" placeholder="OG image" />
          <textarea value={serviceForm.meta_description || ""} onChange={(e) => setServiceForm((prev) => ({ ...prev, meta_description: e.target.value }))} className="md:col-span-2 rounded-xl border border-white/10 bg-slate-900 p-3 text-white" rows="2" placeholder="Meta description" />
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-300"><input type="checkbox" checked={serviceForm.published} onChange={(e) => setServiceForm((prev) => ({ ...prev, published: e.target.checked }))} /> Published</label>
          <button disabled={saving} className="rounded-xl bg-primary px-8 py-3 font-black text-background-dark disabled:opacity-50">{saving ? "Saving…" : editingServiceId ? "Update Service" : "Add Service"}</button>
          {editingServiceId && <button type="button" onClick={() => { setEditingServiceId(""); setServiceForm(EMPTY_SERVICE); }} className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300">Cancel</button>}
        </div>
      </form>

      <div className="mb-10 overflow-hidden rounded-2xl border border-white/5 bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-muted"><tr><th className="p-4 text-left">Order</th><th className="p-4 text-left">Service</th><th className="p-4 text-left">Slug</th><th className="p-4 text-left">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-white/5">{services.map((service, index) => <tr key={service.id || service.slug} className="hover:bg-white/5"><td className="p-4"><button onClick={() => moveService(index, -1)} disabled={index === 0 || !service.id} className="mr-1 rounded border border-white/10 px-2 disabled:opacity-30">↑</button><button onClick={() => moveService(index, 1)} disabled={index === services.length - 1 || !service.id} className="rounded border border-white/10 px-2 disabled:opacity-30">↓</button></td><td className="p-4 font-bold text-white"><span className="material-symbols-outlined mr-2 align-middle text-primary">{service.icon}</span>{service.title}</td><td className="p-4 text-slate-400">/{service.slug}</td><td className="p-4 text-slate-400">{service.published ? "Published" : "Hidden"}</td><td className="p-4 text-right"><button onClick={() => editService(service)} className="p-2 text-primary">Edit</button><button onClick={() => deleteService(service)} className="p-2 text-red-400">Delete</button></td></tr>)}</tbody>
        </table>
      </div>

      <div className="mb-8 rounded-2xl border border-white/5 bg-surface p-6">
        <label className="text-sm font-bold text-slate-300">Select Service For Certificates</label>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-5">
          {services.map((service) => {
            const active = selectedService === service.slug;
            return <button key={service.slug} type="button" onClick={() => setSelectedService(service.slug)} className={`rounded-xl border p-4 text-left transition-all ${active ? "border-primary/40 bg-primary/15 text-primary" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}><span className="material-symbols-outlined mb-2 block">{service.icon}</span><span className="text-xs font-bold">{service.title}</span></button>;
          })}
        </div>
      </div>

      <form onSubmit={handleAdd} className="mb-10 max-w-4xl rounded-2xl border border-white/5 bg-surface p-8">
        <h2 className="mb-1 flex items-center gap-2 text-xl font-bold text-white"><span className="material-symbols-outlined text-primary">workspace_premium</span>Add Certificate For {selectedMeta.title}</h2>
        <p className="mb-6 text-sm text-slate-400">Upload certificate image and add title shown below it.</p>
        <div className="grid gap-6 md:grid-cols-[1fr_220px]">
          <div className="space-y-5">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white" placeholder="Certificate title" />
            <label className={`flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-white/20 p-4 transition-colors hover:border-primary/40 ${uploading ? "pointer-events-none opacity-50" : ""}`}><span className="material-symbols-outlined text-primary">add_photo_alternate</span><span className="text-sm text-slate-400">{uploading ? "Uploading…" : "Click to upload certificate image"}</span><input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} /></label>
            <div className="flex gap-2"><input value={image} onChange={(e) => setImage(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-xs text-white" placeholder="Or paste image URL" /><button type="button" onClick={() => setPicker(true)} className="rounded-xl border border-white/10 px-4 text-primary">Pick</button></div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900 p-3"><div className="aspect-square overflow-hidden rounded-lg bg-white/5">{image ? <SmartImage src={image} alt="Certificate preview" width={500} height={500} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-600"><span className="material-symbols-outlined text-5xl">image</span></div>}</div></div>
        </div>
        <button type="submit" disabled={saving || uploading} className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-black text-background-dark transition-all hover:bg-primary/90 disabled:opacity-50"><span className="material-symbols-outlined">add_circle</span>{saving ? "Saving…" : "Add Certificate"}</button>
      </form>

      <div className="rounded-2xl border border-white/5 bg-surface p-8">
        <div className="mb-6"><h2 className="text-2xl font-black text-white">{selectedMeta.title} Certificates</h2><p className="mt-1 text-sm text-slate-400">{certificates.length} item{certificates.length !== 1 ? "s" : ""}</p></div>
        {loading ? <div className="py-16 text-center text-slate-400">Loading…</div> : certificates.length === 0 ? <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-slate-500">No certificates added for this service yet.</div> : <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{certificates.map((certificate, index) => <div key={certificate.id} className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900"><div className="aspect-square overflow-hidden bg-white/5"><SmartImage src={certificate.image} alt={certificate.title} width={500} height={500} className="h-full w-full object-cover" /></div><div className="space-y-4 p-5"><input defaultValue={certificate.title} onBlur={(e) => e.target.value !== certificate.title && updateCertificate(certificate, { title: e.target.value })} className="w-full rounded-xl border border-white/10 bg-surface p-3 text-sm font-bold text-white" /><div className="flex items-center justify-between gap-2"><div className="flex gap-2"><button type="button" onClick={() => moveCertificate(index, -1)} disabled={index === 0} className="rounded-lg border border-white/10 p-2 text-slate-300 disabled:opacity-30"><span className="material-symbols-outlined text-lg">arrow_upward</span></button><button type="button" onClick={() => moveCertificate(index, 1)} disabled={index === certificates.length - 1} className="rounded-lg border border-white/10 p-2 text-slate-300 disabled:opacity-30"><span className="material-symbols-outlined text-lg">arrow_downward</span></button></div><button type="button" onClick={() => handleDelete(certificate)} className="rounded-lg border border-red-500/20 p-2 text-red-400"><span className="material-symbols-outlined text-lg">delete</span></button></div></div></div>)}</div>}
      </div>
    </div>
  );
}
