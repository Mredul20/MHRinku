"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";
import { normalizeImage } from "@/lib/validators";
import SmartImage from "../SmartImage";

export default function MediaPicker({ open, onClose, onSelect }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    let active = true;
    setLoading(true);
    setError("");
    adminFetch("/api/media")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => active && setError("Failed to load media."))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/80 p-4 backdrop-blur-sm">
      <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 p-5">
          <div>
            <h2 className="text-xl font-black text-white">Choose Media</h2>
            <p className="text-sm text-slate-400">Reuse an uploaded Supabase Storage file.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 p-2 text-slate-300 hover:bg-white/5">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="max-h-[68vh] overflow-y-auto p-5">
          {loading && <div className="py-16 text-center text-slate-400">Loading…</div>}
          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-400">{error}</div>}
          {!loading && !error && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {items.map((item) => {
                const image = normalizeImage({ url: item.url, alt_text: item.name });
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      onSelect(image.url);
                      onClose();
                    }}
                    className="group overflow-hidden rounded-xl border border-white/5 bg-slate-900 text-left transition-colors hover:border-primary/50"
                  >
                    <div className="aspect-square overflow-hidden bg-white/5">
                      <SmartImage src={image} alt={image.alt_text} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <div className="p-3">
                      <p className="truncate text-xs font-bold text-slate-300" title={item.name}>{item.name}</p>
                    </div>
                  </button>
                );
              })}
              {items.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-white/10 py-16 text-center text-muted">
                  No media uploaded yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
