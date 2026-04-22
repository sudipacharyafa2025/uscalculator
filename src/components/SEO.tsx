import { useEffect } from "react";
import { localeToOgLocale, SUPPORTED_LOCALES, withLocale, stripLocaleFromPath, getLocaleFromPath } from "@/i18n/locale";

type JsonLd = Record<string, unknown>;

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: JsonLd | JsonLd[];
  image?: string;
  keywords?: string[];
}

const SITE = "USCalculator";
const SITE_URL = "https://uscalculator.online";

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    const [k, v] = selector.replace(/^meta\[|\]$/g, "").split("=");
    el.setAttribute(k, v.replace(/['"]/g, ""));
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setAlternate(hreflang: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hreflang}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "alternate");
    el.setAttribute("hreflang", hreflang);
    el.setAttribute("data-seo-alt", "true");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function SEO({ title, description, canonical, jsonLd, image, keywords }: SEOProps) {
  const keywordsContent = keywords?.join(", ") ?? "";
  const jsonLdContent = jsonLd ? JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : "";

  useEffect(() => {
    const fullTitle = title.includes(SITE) ? title : `${title} | ${SITE}`;
    document.title = fullTitle;
    const imageUrl = image ? (image.startsWith("http") ? image : `${SITE_URL}${image}`) : `${SITE_URL}/placeholder.svg`;

    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="robots"]', "content", "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    setMeta('meta[name="googlebot"]', "content", "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1");
    setMeta('meta[name="referrer"]', "content", "strict-origin-when-cross-origin");
    setMeta('meta[name="application-name"]', "content", SITE);
    setMeta('meta[name="apple-mobile-web-app-title"]', "content", SITE);
    setMeta('meta[name="mobile-web-app-capable"]', "content", "yes");
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:site_name"]', "content", SITE);
    setMeta('meta[property="og:image"]', "content", imageUrl);
    setMeta('meta[property="og:image:alt"]', "content", title);
    setMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image:alt"]', "content", title);

    const path = canonical || window.location.pathname;
    const canonicalUrl = path.startsWith("http") ? path : `${SITE_URL}${path}`;
    setLink("canonical", canonicalUrl);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    const locale = getLocaleFromPath(path);
    setMeta('meta[property="og:locale"]', "content", localeToOgLocale(locale));

    const normalizedPath = stripLocaleFromPath(path);
    document.head.querySelectorAll('link[data-seo-alt="true"]').forEach((n) => n.remove());
    SUPPORTED_LOCALES.forEach((l) => {
      const href = `${SITE_URL}${withLocale(normalizedPath, l)}`;
      setAlternate(l, href);
    });
    setAlternate("x-default", `${SITE_URL}${withLocale(normalizedPath, "en")}`);

    setMeta('meta[name="keywords"]', "content", keywordsContent);

    setMeta('meta[name="twitter:image"]', "content", imageUrl);

    // JSON-LD
    const existing = document.head.querySelectorAll('script[data-seo-jsonld="true"]');
    existing.forEach((n) => n.remove());
    if (jsonLdContent) {
      const arr = JSON.parse(jsonLdContent) as JsonLd[];
      arr.forEach((data) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.setAttribute("data-seo-jsonld", "true");
        s.textContent = JSON.stringify(data);
        document.head.appendChild(s);
      });
    }
  }, [title, description, canonical, image, keywordsContent, jsonLdContent]);

  return null;
}
