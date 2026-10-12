import Image from "next/image";
import Link from "next/link";
import { cleanSocialUrl } from "@/lib/urlHealth";
import { supabaseAdmin } from "@/lib/supabase";

const socialPlatforms = [
  {
    key: "facebook",
    label: "Facebook",
    hosts: ["facebook.com", "fb.com"],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.79-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.972h-1.514c-1.491 0-1.955.931-1.955 1.887v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    hosts: ["instagram.com"],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
        <path d="M7.5 0h9A7.5 7.5 0 0 1 24 7.5v9a7.5 7.5 0 0 1-7.5 7.5h-9A7.5 7.5 0 0 1 0 16.5v-9A7.5 7.5 0 0 1 7.5 0zm0 2.4a5.1 5.1 0 0 0-5.1 5.1v9a5.1 5.1 0 0 0 5.1 5.1h9a5.1 5.1 0 0 0 5.1-5.1v-9a5.1 5.1 0 0 0-5.1-5.1h-9zM12 5.8a6.2 6.2 0 1 1 0 12.4 6.2 6.2 0 0 1 0-12.4zm0 2.4a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6zm6.4-.7a1.45 1.45 0 1 1-2.9 0 1.45 1.45 0 0 1 2.9 0z" />
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    hosts: ["linkedin.com"],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    key: "behance",
    label: "Behance",
    hosts: ["behance.net"],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
        <path d="M22.3 7.7h-6.6V6.1h6.6v1.6zM8.2 11.6c1.3-.4 2.1-1.3 2.1-2.8 0-2.4-1.8-3.5-4.2-3.5H0v13.3h6.3c2.5 0 4.6-1.2 4.6-4 0-1.7-.8-2.7-2.7-3zM2.9 7.6h2.7c1 0 1.8.3 1.8 1.4 0 1-.7 1.4-1.7 1.4H2.9V7.6zm2.9 8.8H2.9v-3.7h3c1.2 0 2.1.5 2.1 1.8 0 1.4-1 1.9-2.2 1.9zm13.2 2.5c-3 0-4.9-2.1-4.9-5.1 0-2.9 2-5.2 4.9-5.2 3.3 0 4.9 2.8 4.7 5.9h-6.8c.1 1.5.8 2.2 2.2 2.2.9 0 1.7-.5 2-1.1h2.4c-.8 2.2-2.4 3.3-4.5 3.3zm-2.1-6h4.1c-.3-1.3-.8-1.9-2-1.9-1.3 0-1.9.8-2.1 1.9z" />
      </svg>
    ),
  },
  {
    key: "pinterest",
    label: "Pinterest",
    hosts: ["pinterest.com", "pin.it"],
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.406.042-3.444.219-.938 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.669.968-2.915 2.173-2.915 1.024 0 1.518.769 1.518 1.69 0 1.03-.655 2.568-.994 3.995-.283 1.195.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.137.893 2.739.098.119.112.223.083.344-.091.378-.293 1.195-.333 1.362-.052.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.966 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.36-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146A12.01 12.01 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
  },
];

async function getSocialLinks() {
  try {
    const { data, error } = await supabaseAdmin
      .from("social_links")
      .select("platform,url")
      .in("platform", socialPlatforms.map((platform) => platform.key));

    if (error) return {};

    const entries = (data || []).map((row) => {
      const platform = socialPlatforms.find((item) => item.key === row.platform);
      const url = cleanSocialUrl(row.url, platform?.hosts || []);
      return [row.platform, url];
    });

    return Object.fromEntries(entries.filter(([, url]) => url));
  } catch {
    return {};
  }
}

export default async function Footer() {
  const socialLinks = await getSocialLinks();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center mb-6">
              <Image src="/mhr-logo.png" alt="MHR logo" width={126} height={50} className="h-9 w-auto" />
            </Link>
            <p className="text-slate-400 max-w-sm mb-6">A results-driven designer specialized in building digital experiences that matter.</p>
            <div className="flex flex-wrap gap-3">
              {socialPlatforms.map((platform) => {
                const url = socialLinks[platform.key];
                const active = Boolean(url);
                return (
                  <a
                    key={platform.key}
                    className={`group flex size-11 items-center justify-center rounded-full border transition-all duration-300 ${active ? "border-primary/30 bg-primary/10 hover:bg-primary hover:scale-110" : "border-white/10 bg-white/5 opacity-40 pointer-events-none"}`}
                    href={url || "#"}
                    target={active ? "_blank" : undefined}
                    rel={active ? "noopener noreferrer" : undefined}
                    title={platform.label}
                    aria-label={platform.label}
                  >
                    <span className="text-primary transition-colors group-hover:text-background-dark">{platform.icon}</span>
                  </a>
                );
              })}
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-6">Services</h5>
            <ul className="space-y-4 text-slate-400">
              <li><Link className="hover:text-primary transition-colors" href="/graphic-design-services-bangladesh">Graphic Design</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/ads-expert-bangladesh">Ads Expert</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/web-design-services-bangladesh">Web Design</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6">Company</h5>
            <ul className="space-y-4 text-slate-400">
              <li><Link className="hover:text-primary transition-colors" href="/about">About Me</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/#testimonials">Testimonials</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="/#contact">Contact</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-6">Contact</h5>
            <ul className="space-y-4 text-slate-400">
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-lg text-primary">call</span>
                <a className="hover:text-primary transition-colors" href="tel:+8801786029947">+880 1786-029947</a>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-lg text-primary">mail</span>
                <span>contact@mhrinku.com</span>
              </li>
              <li className="flex gap-3">
                <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
          <p>© 2026 Mobarak Hossain Rinku. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
