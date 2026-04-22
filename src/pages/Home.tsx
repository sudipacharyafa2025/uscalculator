import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calculator, TrendingUp, Heart, Sigma, Plus, Minus, X, Divide, Equal } from "lucide-react";
import { calculators, byCategory, getCalculators, type CalcCategory } from "@/data/calculators";
import SEO from "@/components/SEO";
import SearchFilter from "@/components/SearchFilter";
import HomeScientific from "@/components/HomeScientific";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/i18n/messages";
import { withLocale } from "@/i18n/locale";
import { categoryText } from "@/i18n/meta";

export default function Home() {
  const { locale } = useLocale();
  const popular = ["mortgage", "compound-interest", "bmi", "loan", "calorie", "investment", "percentage", "tip"];
  const [q, setQ] = useState("");
  const localizedCalculators = useMemo(() => getCalculators(locale), [locale]);

  const matches = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return localizedCalculators.filter((c) =>
      c.title.toLowerCase().includes(s) ||
      c.short.toLowerCase().includes(s) ||
      c.slug.includes(s) ||
      c.description.toLowerCase().includes(s)
    ).slice(0, 12);
  }, [localizedCalculators, q]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "USCalculator",
        url: "https://uscalculator.online/",
        inLanguage: locale,
        description: `${calculators.length}+ ${t(locale, "home.hero.subtitle")}`,
        potentialAction: {
          "@type": "SearchAction",
          target: `https://uscalculator.online${withLocale("/math", locale)}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebApplication",
        name: "USCalculator",
        url: `https://uscalculator.online${withLocale("/", locale)}`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        description: `${calculators.length}+ ${t(locale, "home.hero.subtitle")}`,
      },
      {
        "@type": "ItemList",
        name: t(locale, "home.popular"),
        numberOfItems: popular.length,
        itemListElement: popular.map((slug, index) => {
          const item = localizedCalculators.find((x) => x.slug === slug)!;
          return {
            "@type": "ListItem",
            position: index + 1,
            name: item.title,
            url: `https://uscalculator.online${withLocale(`/${item.category}/${item.slug}`, locale)}`,
          };
        }),
      },
    ],
  };

  const categoryLabel = (category: "finance" | "health" | "math") => {
    if (category === "finance") return t(locale, "nav.finance");
    if (category === "health") return t(locale, "nav.health");
    return t(locale, "nav.math");
  };

  return (
    <div>
      <SEO
        title={`USCalculator — ${t(locale, "home.hero.title")}`}
        description={`${calculators.length}+ ${t(locale, "home.hero.subtitle")}`}
        canonical={withLocale("/", locale)}
        jsonLd={jsonLd}
        keywords={[
          "USCalculator",
          t(locale, "home.badge.professional"),
          t(locale, "nav.finance"),
          t(locale, "nav.health"),
          t(locale, "nav.math"),
          t(locale, "home.scientific.title"),
        ]}
      />
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-primary-foreground">
          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
            <Link
              to={withLocale("/math/scientific", locale)}
              className="mx-auto lg:mx-0 w-full max-w-[220px] rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-md shadow-lg hover:bg-white/15 transition"
              aria-label={t(locale, "home.mini.ariaOpen")}
            >
              <div className="rounded-lg bg-white/90 text-[#0f2942] px-3 py-2 text-lg font-semibold tracking-wide text-right">
                1234.5
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div className="h-10 rounded-md bg-white/90 text-[#0f2942] flex items-center justify-center"><Plus className="h-4 w-4" /></div>
                <div className="h-10 rounded-md bg-white/90 text-[#0f2942] flex items-center justify-center"><Minus className="h-4 w-4" /></div>
                <div className="h-10 rounded-md bg-white/90 text-[#0f2942] flex items-center justify-center"><Equal className="h-4 w-4" /></div>
                <div className="h-10 rounded-md bg-white/90 text-[#0f2942] flex items-center justify-center"><X className="h-4 w-4" /></div>
                <div className="h-10 rounded-md bg-white/90 text-[#0f2942] flex items-center justify-center"><Divide className="h-4 w-4" /></div>
                <div className="h-10 rounded-md bg-accent text-accent-foreground flex items-center justify-center text-xs font-semibold">{t(locale, "home.mini.open")}</div>
              </div>
            </Link>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent-soft text-xs font-medium mb-5">
                <Calculator className="h-3 w-3" /> {calculators.length}+ {t(locale, "home.badge.professional")}
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-3xl text-primary-foreground">
                {t(locale, "home.hero.title")}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-primary-foreground/80 max-w-2xl">
                {t(locale, "home.hero.subtitle")}
              </p>
              <div className="mt-6 sm:mt-8 bg-card/95 rounded-xl p-3 sm:p-4 backdrop-blur shadow-lg max-w-xl">
                <SearchFilter
                  value={q}
                  onChange={setQ}
                  placeholder={t(locale, "home.search.placeholder")}
                  resultCount={q ? matches.length : undefined}
                />
                {q && matches.length > 0 && (
                  <ul className="mt-8 max-h-72 overflow-auto divide-y divide-border rounded-md border border-border bg-card">
                    {matches.map((c) => {
                      const Icon = c.icon;
                      return (
                        <li key={c.slug}>
                          <Link to={withLocale(`/${c.category}/${c.slug}`, locale)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted">
                            <Icon className="h-4 w-4 text-accent shrink-0" />
                            <span className="font-medium text-sm text-foreground">{c.title}</span>
                            <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">{categoryLabel(c.category)}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {q && matches.length === 0 && (
                  <p className="mt-8 text-sm text-muted-foreground">{t(locale, "home.search.noResults", { query: q })}</p>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to={withLocale("/finance/mortgage", locale)} className="px-5 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition inline-flex items-center gap-2">
                  {t(locale, "home.hero.tryMortgage")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to={withLocale("/finance", locale)} className="px-5 py-2.5 rounded-lg bg-white/10 text-primary-foreground hover:bg-white/15 transition">{t(locale, "home.hero.browseAll")}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <div>
            <h2 className="text-2xl font-bold">{t(locale, "home.scientific.title")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t(locale, "home.scientific.subtitle")}</p>
          </div>
          <Link to={withLocale("/math/scientific", locale)} className="text-sm text-accent hover:underline inline-flex items-center gap-1">
            {t(locale, "home.scientific.open")} <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <HomeScientific />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 sm:pb-12">
        <h2 className="text-2xl font-bold mb-6">{t(locale, "home.popular")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {popular.map((slug) => {
            const c = localizedCalculators.find((x) => x.slug === slug)!;
            const Icon = c.icon;
            return (
              <Link key={slug} to={withLocale(`/${c.category}/${slug}`, locale)} className="calc-card hover:border-accent transition group">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ background: "var(--gradient-accent)" }}>
                  <Icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="font-semibold text-primary group-hover:text-accent transition">{c.short}</div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 grid md:grid-cols-3 gap-6">
        {[
          { c: "finance", icon: TrendingUp },
          { c: "health", icon: Heart },
          { c: "math", icon: Sigma },
        ].map(({ c, icon: Icon }) => {
          const cat = c as CalcCategory;
          return (
            <div key={c} className="calc-card">
              <div className="h-10 w-10 rounded-lg bg-accent-soft text-accent flex items-center justify-center mb-3">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{categoryText(locale, cat).title}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{categoryText(locale, cat).tagline}</p>
              <ul className="space-y-1.5 text-sm">
                {byCategory(cat, locale).slice(0, 5).map((x) => (
                  <li key={x.slug}><Link to={withLocale(`/${cat}/${x.slug}`, locale)} className="text-muted-foreground hover:text-accent">› {x.short}</Link></li>
                ))}
              </ul>
              <Link to={withLocale(`/${cat}`, locale)} className="inline-flex items-center gap-1 mt-4 text-sm text-accent font-medium hover:underline">
                {t(locale, "home.category.seeAll")} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          );
        })}
      </section>
    </div>
  );
}
