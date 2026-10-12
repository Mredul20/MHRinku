import { getSiteUrl, getCanonicalUrl } from "./pageMeta";

const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mobarak Hossain Rinku",
  alternateName: "MHRinku",
  jobTitle: "Web Designer, WordPress Developer & Digital Marketing Specialist",
  url: getSiteUrl(),
  sameAs: [
    "https://www.linkedin.com/in/mhrinku",
    "https://www.facebook.com/mhrinku",
    "https://www.instagram.com/mhrinku",
    "https://www.behance.net/mhrinku",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  telephone: "+8801786029947",
  email: "mailto:contact@mhrinku.com",
};

const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "MHRinku",
  description: "Web design, WordPress development, Shopify stores, graphic design, UI/UX design, and paid ads services for businesses in Bangladesh.",
  url: getSiteUrl(),
  telephone: "+8801786029947",
  email: "contact@mhrinku.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dhaka",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "23.8103",
    longitude: "90.4125",
  },
  priceRange: "$$",
  areaServed: {
    "@type": "Country",
    name: "Bangladesh",
  },
};

export function getPersonSchema() {
  return PERSON;
}

export function getLocalBusinessSchema() {
  return LOCAL_BUSINESS;
}

export function getServiceSchema({ title, description, pathname, image, provider = "MHRinku" }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: title,
    description,
    provider: {
      "@type": "ProfessionalService",
      name: provider,
      url: getSiteUrl(),
      telephone: "+8801786029947",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "BD",
      },
    },
    areaServed: {
      "@type": "Country",
      name: "Bangladesh",
    },
    url: getCanonicalUrl(pathname),
    ...(image ? { image: image.startsWith("http") ? image : getCanonicalUrl(image) } : {}),
  };
}

export function getFaqPageSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function getArticleSchema({ title, description, pathname, publishedAt, modifiedAt, image, author = "Mobarak Hossain Rinku" }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    author: {
      "@type": "Person",
      name: author,
      url: getSiteUrl(),
    },
    publisher: {
      "@type": "ProfessionalService",
      name: "MHRinku",
      url: getSiteUrl(),
    },
    datePublished: publishedAt,
    ...(modifiedAt ? { dateModified: modifiedAt } : {}),
    url: getCanonicalUrl(pathname),
    ...(image ? { image: image.startsWith("http") ? image : getCanonicalUrl(image) } : {}),
  };
}
