import { useLocation } from "react-router-dom";
import { DEFAULT_LOCALE, getLocaleFromPath, Locale, RTL_LOCALES } from "@/i18n/locale";

export function useLocale(): { locale: Locale; isRtl: boolean } {
  const { pathname } = useLocation();
  const locale = getLocaleFromPath(pathname) || DEFAULT_LOCALE;
  return { locale, isRtl: RTL_LOCALES.includes(locale) };
}
