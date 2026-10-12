"use client";

import { useState } from "react";

const INITIAL_FORM = {
  name: "",
  email: "",
  service: "Graphic Design",
  message: "",
  website: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({ type: "error", message: data?.error || "Something went wrong." });
        return;
      }

      setForm(INITIAL_FORM);
      setStatus({ type: "success", message: "Message sent! I’ll get back to you soon." });
    } catch {
      setStatus({ type: "error", message: "Could not send message. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => updateField("website", event.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="ml-1 text-sm font-bold text-slate-300">Name</label>
          <input
            required
            minLength={2}
            maxLength={100}
            className="w-full rounded-xl border border-white/10 bg-background-dark p-4 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Your Name"
            type="text"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="ml-1 text-sm font-bold text-slate-300">Email</label>
          <input
            required
            maxLength={254}
            className="w-full rounded-xl border border-white/10 bg-background-dark p-4 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="email@example.com"
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="ml-1 text-sm font-bold text-slate-300">Service Interest</label>
        <select
          className="w-full appearance-none rounded-xl border border-white/10 bg-background-dark p-4 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          value={form.service}
          onChange={(event) => updateField("service", event.target.value)}
        >
          <option>Graphic Design</option>
          <option>Web Design</option>
          <option>Ads Management</option>
          <option>SEO</option>
          <option>Full Package</option>
        </select>
      </div>
      <div className="space-y-2">
        <label className="ml-1 text-sm font-bold text-slate-300">Message</label>
        <textarea
          required
          minLength={10}
          maxLength={5000}
          className="w-full rounded-xl border border-white/10 bg-background-dark p-4 text-white outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          placeholder="Tell me about your project..."
          rows="5"
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </div>
      {status.message && (
        <div className={`rounded-xl border px-4 py-3 text-sm font-bold ${status.type === "error" ? "border-red-500/20 bg-red-500/10 text-red-400" : "border-green-500/20 bg-green-500/10 text-green-400"}`}>
          {status.message}
        </div>
      )}
      <button disabled={submitting} className="w-full rounded-xl bg-[#C6A75E] px-8 py-4 text-lg font-black text-background-dark shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50" type="submit">
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
