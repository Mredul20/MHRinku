"use client";

import { useState, useEffect, useCallback } from "react";
import { adminFetch } from "../../../lib/adminFetch";
import { getMaxUploadBytes, getFileTooLargeMessage, uploadDirectToStorage } from "../../../lib/uploadClient";
import SmartImage from "../../components/SmartImage";

function Toast({ message, type }) {
  if (!message) return null;
  const colors =
    type === "error"
      ? "bg-red-500/10 border-red-500/30 text-red-400"
      : "bg-green-500/10 border-green-500/30 text-green-400";
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl border font-bold text-sm shadow-xl ${colors}`}
    >
      {message}
    </div>
  );
}

function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) return url;
      const id = parsed.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return "";
  }
  return "";
}

const IMAGE_SETTINGS = [
  {
    key: "hero_image",
    label: "Homepage Hero Image",
    icon: "image",
    description: "The main profile image shown in the homepage hero section.",
  },
  {
    key: "about_hero_image",
    label: "About Section Hero Image",
    icon: "person",
    description:
      'The portrait image in the "Crafting Digital Masterpieces" section on the homepage and about page.',
  },
  {
    key: "graphic_design_image",
    label: "Graphic Design Showcase Image",
    icon: "brush",
    description:
      "The showcase image in the overview section of the Graphic Design service page.",
  },
  {
    key: "meta_ads_image",
    label: "Meta Ads Hero Image",
    icon: "ads_click",
    description:
      "The dashboard image in the hero section of the Meta Ads service page.",
  },
];

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState({});
  const [uploading, setUploading] = useState(null);
  const [saving, setSaving] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 3000);
  };

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/site-settings?admin=1");
      const data = await res.json();
      if (Array.isArray(data)) {
        const map = {};
        data.forEach((s) => (map[s.key] = s.value));
        setSettings(map);
      }
    } catch {
      showToast("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleUpload = async (e, settingKey) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > getMaxUploadBytes()) {
      showToast(getFileTooLargeMessage(), "error");
      e.target.value = "";
      return;
    }
    setUploading(settingKey);
    try {
      const { url: imageUrl } = await uploadDirectToStorage(file);
      if (!imageUrl) throw new Error("Upload failed");
      const saveRes = await adminFetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: settingKey, value: imageUrl }),
      });
      if (!saveRes.ok) throw new Error("Failed to save setting");

      setSettings((prev) => ({ ...prev, [settingKey]: imageUrl }));
      showToast("Image updated successfully!");
    } catch (err) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(null);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > getMaxUploadBytes()) {
      showToast(getFileTooLargeMessage(), "error");
      e.target.value = "";
      return;
    }
    setUploading("about_video_url");
    try {
      const { url: videoUrl } = await uploadDirectToStorage(file);
      if (!videoUrl) throw new Error("Upload failed");
      const saveRes = await adminFetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "about_video_url", value: videoUrl }),
      });
      if (!saveRes.ok) throw new Error("Failed to save video");

      setSettings((prev) => ({ ...prev, about_video_url: videoUrl }));
      showToast("Video uploaded successfully!");
    } catch (err) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  const handleSaveVideo = async () => {
    setSaving("about_video");
    try {
      const entries = [
        ["about_video_title", settings.about_video_title || ""],
        ["about_video_url", settings.about_video_url || ""],
      ];

      const results = await Promise.all(entries.map(([key, value]) => adminFetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      })));
      if (results.some((res) => !res.ok)) throw new Error("Failed to save video settings");

      showToast("Video settings saved!");
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSaving(null);
    }
  };

  const handleSaveSettings = async (entries, savingKey = "settings") => {
    setSaving(savingKey);
    try {
      const results = await Promise.all(entries.map(([key, value]) => adminFetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: value || "" }),
      })));
      if (results.some((res) => !res.ok)) throw new Error("Failed to save");
      showToast("Settings saved!");
    } catch (err) {
      showToast(err.message || "Save failed", "error");
    } finally {
      setSaving(null);
    }
  };

  const handleSaveUrl = async (settingKey) => {
    handleSaveSettings([[settingKey, settings[settingKey] || ""]], settingKey);
  };

  if (loading)
    return (
      <div className="text-slate-400 py-20 text-center">Loading settings...</div>
    );

  return (
    <div>
      <Toast message={toast.message} type={toast.type} />

      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Site Settings</h1>
        <p className="text-slate-400">
          Manage images and video across your website. Upload or paste a URL for each section.
        </p>
      </div>

      <div className="grid gap-8 max-w-4xl">
        <div className="bg-surface border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">query_stats</span>
            SEO Integrations
          </h2>
          <p className="text-slate-400 text-sm mb-6">Add Google Tag Manager and Search Console verification codes without editing code.</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-300">Google Tag Manager Container ID</label>
              <input
                type="text"
                value={settings.gtm_container_id || ""}
                onChange={(e) => setSettings((prev) => ({ ...prev, gtm_container_id: e.target.value }))}
                placeholder="GTM-XXXXXXX"
                className="mt-2 w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-300">Google Search Console Verification</label>
              <input
                type="text"
                value={settings.google_site_verification || ""}
                onChange={(e) => setSettings((prev) => ({ ...prev, google_site_verification: e.target.value }))}
                placeholder="Paste only the content value from the verification meta tag"
                className="mt-2 w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <button
              onClick={() => handleSaveSettings([
                ["gtm_container_id", settings.gtm_container_id || ""],
                ["google_site_verification", settings.google_site_verification || ""],
              ], "seo_integrations")}
              disabled={saving === "seo_integrations"}
              className="bg-primary hover:bg-primary/90 text-background-dark font-bold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-50"
            >
              {saving === "seo_integrations" ? "Saving..." : "Save SEO Integrations"}
            </button>
          </div>
        </div>

        <div className="bg-surface border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">account_tree</span>
            Sitemap & Robots
          </h2>
          <p className="text-slate-400 text-sm mb-6">Leave these blank to use the auto-generated sitemap and robots.txt files.</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-300">robots.txt Override</label>
              <textarea
                value={settings.robots_txt_override || ""}
                onChange={(e) => setSettings((prev) => ({ ...prev, robots_txt_override: e.target.value }))}
                rows={7}
                placeholder={`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\nSitemap: https://mhrinku.com/sitemap.xml`}
                className="mt-2 w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-300">sitemap.xml Override</label>
              <textarea
                value={settings.sitemap_xml_override || ""}
                onChange={(e) => setSettings((prev) => ({ ...prev, sitemap_xml_override: e.target.value }))}
                rows={10}
                placeholder="Leave blank for automatic sitemap generation. Paste full XML only if you need a manual sitemap."
                className="mt-2 w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-primary/50"
              />
            </div>
            <button
              onClick={() => handleSaveSettings([
                ["robots_txt_override", settings.robots_txt_override || ""],
                ["sitemap_xml_override", settings.sitemap_xml_override || ""],
              ], "seo_files")}
              disabled={saving === "seo_files"}
              className="bg-primary hover:bg-primary/90 text-background-dark font-bold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-50"
            >
              {saving === "seo_files" ? "Saving..." : "Save Sitemap & Robots"}
            </button>
          </div>
        </div>

        <div className="bg-surface border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">smart_display</span>
            About Page Video
          </h2>
          <p className="text-slate-400 text-sm mb-6">Add one YouTube link or uploaded video file for the About page.</p>

          {settings.about_video_url && (
            <div className="mb-6 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
              {getYouTubeEmbedUrl(settings.about_video_url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(settings.about_video_url)}
                  title={settings.about_video_title || "About page video preview"}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video src={settings.about_video_url} controls className="aspect-video w-full bg-black" />
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-300">Video Title</label>
              <input
                type="text"
                value={settings.about_video_title || ""}
                onChange={(e) => setSettings((prev) => ({ ...prev, about_video_title: e.target.value }))}
                placeholder="e.g. My story in 60 seconds"
                className="mt-2 w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-300">YouTube or Video URL</label>
              <div className="mt-2 flex gap-3">
                <input
                  type="text"
                  value={settings.about_video_url || ""}
                  onChange={(e) => setSettings((prev) => ({ ...prev, about_video_url: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50"
                />
                <button
                  onClick={handleSaveVideo}
                  disabled={saving === "about_video"}
                  className="bg-primary hover:bg-primary/90 text-background-dark font-bold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  {saving === "about_video" ? "Saving..." : "Save Video"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">Or upload a video file</span>
            <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-base">upload</span>
              {uploading === "about_video_url" ? "Uploading..." : "Choose Video"}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
                disabled={uploading === "about_video_url"}
              />
            </label>
          </div>
        </div>

        {IMAGE_SETTINGS.map((item) => (
          <div
            key={item.key}
            className="bg-surface border border-white/5 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                {item.icon}
              </span>
              {item.label}
            </h2>
            <p className="text-slate-400 text-sm mb-6">{item.description}</p>

            {/* Preview */}
            {settings[item.key] && (
              <div className="mb-6 relative inline-block">
                <SmartImage
                  src={settings[item.key]}
                  alt={`${item.label} preview`}
                  className="w-48 h-60 object-cover rounded-xl border border-white/10"
                />
              </div>
            )}

            {/* URL input */}
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={settings[item.key] || ""}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    [item.key]: e.target.value,
                  }))
                }
                placeholder="Image URL"
                className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50"
              />
              <button
                onClick={() => handleSaveUrl(item.key)}
                disabled={saving === item.key}
                className="bg-primary hover:bg-primary/90 text-background-dark font-bold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-50"
              >
                {saving === item.key ? "Saving..." : "Save URL"}
              </button>
            </div>

            {/* Upload */}
            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-xs uppercase font-bold tracking-widest">
                Or upload a new image
              </span>
              <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-base">upload</span>
                {uploading === item.key ? "Uploading..." : "Choose File"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e, item.key)}
                  disabled={uploading === item.key}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
