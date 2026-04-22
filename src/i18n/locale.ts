export const SUPPORTED_LOCALES = ["en", "fr", "es", "nl", "ar", "ja"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const RTL_LOCALES: Locale[] = ["ar"];

export function isLocale(value?: string): value is Locale {
  if (!value) return false;
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export function getLocaleFromPath(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

export function stripLocaleFromPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return "/";
  if (isLocale(parts[0])) {
    const rest = parts.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function withLocale(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return normalized;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function localeToOgLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    en: "en_US",
    fr: "fr_FR",
    es: "es_ES",
    nl: "nl_NL",
    ar: "ar_AR",
    ja: "ja_JP",
  };
  return map[locale];
}

export function localeLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: "English",
    fr: "Français",
    es: "Español",
    nl: "Nederlands",
    ar: "العربية",
    ja: "日本語",
  };
  return labels[locale];
}
