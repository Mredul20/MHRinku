export const dynamic = "force-dynamic";

export async function GET() {
  const body = `# MHRinku — Mobarak Hossain Rinku

## Overview
Mobarak Hossain Rinku is a freelance web designer, WordPress developer, and digital marketing specialist based in Dhaka, Bangladesh. He helps small businesses, startups, and service brands in Bangladesh build fast, search-friendly websites, run paid ads, and create brand visuals that convert.

## Primary services
- Web design services Bangladesh — custom, responsive business websites and landing pages.
- WordPress web design Bangladesh — editable business sites, blogs, and WooCommerce stores.
- Shopify website design Bangladesh — product-focused storefronts with checkout flow.
- Graphic design services Bangladesh — logos, brand identity, social media creatives, ad visuals.
- UI/UX design services Bangladesh — wireframes, high-fidelity interfaces, and conversion-focused user flows.
- Ads expert Bangladesh — Meta Ads, Google Ads, TikTok Ads campaign setup and optimization.
- SEO service Bangladesh — technical SEO, on-page optimization, and content structure.

## Location and contact
- Name: Mobarak Hossain Rinku
- Business: MHRinku
- Address: Dhaka, Bangladesh
- Phone: +880 1786-029947
- Email: contact@mhrinku.com
- Website: https://mhrinku.com
- WhatsApp: https://wa.me/8801786029947

## Content and citation policy
- This site contains original service descriptions, project case studies, client testimonials, and portfolio samples.
- All client testimonials are collected with permission and may be edited for clarity.
- Portfolio screenshots are shared with client approval or represent publicly visible work.
- For media, partnership, or citation requests, contact contact@mhrinku.com.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
