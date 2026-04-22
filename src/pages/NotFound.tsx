import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLocale } from "@/hooks/useLocale";
import { withLocale } from "@/i18n/locale";
import { t } from "@/i18n/messages";

const NotFound = () => {
  const { locale } = useLocale();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t(locale, "notfound.title")}</p>
        <a href={withLocale("/", locale)} className="text-primary underline hover:text-primary/90">
          {t(locale, "notfound.back")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
