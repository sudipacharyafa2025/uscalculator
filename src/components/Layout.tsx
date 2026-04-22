import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import CurrencySelector from "@/components/CurrencySelector";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { byCategory, findCalc, type CalcCategory } from "@/data/calculators";
import { localeLabel, SUPPORTED_LOCALES, withLocale, stripLocaleFromPath, type Locale } from "@/i18n/locale";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/i18n/messages";
import { categoryText } from "@/i18n/meta";
import { translateCalculatorText } from "@/i18n/calculatorText";

function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return <img src="/placeholder.svg" alt="USCalculator logo" className={className} />;
}

function AppSidebar() {
  const { locale } = useLocale();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const cats: CalcCategory[] = ["finance", "health", "math"];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-card">
        <div className="px-4 py-4 border-b border-border">
          <Link to={withLocale("/", locale)} className="flex items-center gap-2">
            <LogoMark />
            {!collapsed && <span className="font-semibold text-primary">USCalculator</span>}
          </Link>
        </div>
        {cats.map((cat) => {
          const items = byCategory(cat, locale);
          return (
            <SidebarGroup key={cat}>
              <SidebarGroupLabel>{categoryText(locale, cat).title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.slug}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={withLocale(`/${cat}/${item.slug}`, locale)}
                          className="hover:bg-muted/50"
                          activeClassName="bg-accent-soft text-accent font-medium"
                        >
                          <item.icon className="mr-2 h-4 w-4 shrink-0" />
                          {!collapsed && <span className="truncate">{item.short}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}

export default function Layout() {
  const location = useLocation();
  const { locale, isRtl } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [locale, isRtl]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-card px-3 sm:px-4 sticky top-0 z-30">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <SidebarTrigger />
              <Link to={withLocale("/", locale)} className="flex items-center gap-2 min-w-0">
                <LogoMark className="h-7 w-7 shrink-0 sm:hidden" />
                <span className="text-sm font-semibold text-primary truncate">USCalculator<span className="text-muted-foreground font-normal hidden sm:inline">.online</span></span>
              </Link>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <nav aria-label={t(locale, "nav.primaryAria")} className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                <Link to={withLocale("/finance", locale)} className="hover:text-primary">{t(locale, "nav.finance")}</Link>
                <Link to={withLocale("/health", locale)} className="hover:text-primary">{t(locale, "nav.health")}</Link>
                <Link to={withLocale("/math", locale)} className="hover:text-primary">{t(locale, "nav.math")}</Link>
                <Link to={withLocale("/about", locale)} className="hover:text-primary">{t(locale, "nav.about")}</Link>
              </nav>
              <div className="flex items-center">
                <select
                  value={locale}
                  onChange={(e) => {
                    const targetLocale = e.target.value as Locale;
                    const basePath = stripLocaleFromPath(location.pathname);
                    window.location.assign(`${withLocale(basePath, targetLocale)}${location.search}${location.hash}`);
                  }}
                  className="h-8 w-[88px] sm:w-[128px] rounded-md border border-border bg-background px-1.5 sm:px-2 text-xs text-foreground"
                  aria-label={t(locale, "nav.languageAria")}
                >
                  {SUPPORTED_LOCALES.map((l) => (
                    <option key={l} value={l}>{localeLabel(l)}</option>
                  ))}
                </select>
              </div>
              <CurrencySelector compact />
            </div>
          </header>
          <main key={location.pathname} className="flex-1">
            <Outlet />
          </main>
          <footer className="border-t border-border bg-card mt-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
              <div className="col-span-2 sm:col-span-1">
                <div className="font-semibold text-primary mb-2">USCalculator.online</div>
                <p className="text-muted-foreground">{t(locale, "footer.brandBlurb")}</p>
              </div>
              <div>
                <div className="font-medium text-primary mb-2">{t(locale, "footer.categories")}</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li><Link to={withLocale("/finance", locale)} className="hover:text-accent">{t(locale, "nav.finance")}</Link></li>
                  <li><Link to={withLocale("/health", locale)} className="hover:text-accent">{t(locale, "nav.health")}</Link></li>
                  <li><Link to={withLocale("/math", locale)} className="hover:text-accent">{t(locale, "nav.math")}</Link></li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-primary mb-2">{t(locale, "footer.company")}</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li><Link to={withLocale("/about", locale)} className="hover:text-accent">{t(locale, "footer.aboutUs")}</Link></li>
                  <li><Link to={withLocale("/privacy", locale)} className="hover:text-accent">{t(locale, "footer.privacy")}</Link></li>
                  <li><Link to={withLocale("/terms", locale)} className="hover:text-accent">{t(locale, "footer.terms")}</Link></li>
                </ul>
              </div>
              <div>
                <div className="font-medium text-primary mb-2">{t(locale, "footer.popular")}</div>
                <ul className="space-y-1 text-muted-foreground">
                  {["mortgage", "compound-interest", "bmi", "scientific"].map((slug) => {
                    const item = findCalc(slug, locale);
                    if (!item) return null;
                    return (
                      <li key={slug}>
                        <Link to={withLocale(`/${item.category}/${item.slug}`, locale)} className="hover:text-accent">
                          {item.short}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="border-t border-border py-4 text-center text-xs text-muted-foreground px-4">
              © {new Date().getFullYear()} USCalculator.online — {t(locale, "footer.disclaimer")}
              <span className="mx-2">•</span>
              <Link to={withLocale("/math/scientific", locale)} className="text-accent hover:underline">
                {translateCalculatorText(locale, "Scientific Calculator")}
              </Link>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
