import { useMemo, useState, useEffect } from "react";
import { Link, useParams, useSearchParams, Navigate } from "react-router-dom";
import { byCategory, type CalcCategory } from "@/data/calculators";
import SEO from "@/components/SEO";
import SearchFilter from "@/components/SearchFilter";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/i18n/messages";
import { withLocale } from "@/i18n/locale";
import { categoryText } from "@/i18n/meta";
import { translateCalculatorText } from "@/i18n/calculatorText";

/** Per-category quick-filter tags. Each tag matches against title/short/slug/description. */
const QUICK_TAGS: Record<CalcCategory, string[]> = {
  finance: ["mortgage", "loan", "auto", "interest", "retirement", "tax", "investment", "credit", "savings", "ROI", "APR"],
  health: ["BMI", "calorie", "macro", "heart rate", "BMR", "TDEE", "weight", "pace", "pregnancy", "BAC"],
  math: [
    "scientific", "triangle", "quadratic", "z-score", "statistics", "probability",
    "matrix", "geometry", "area", "volume", "fraction", "percentage", "binary",
    "sequence", "average", "p-value", "log",
  ],
};

/** Category chips shown on every category page so users can jump between sections. */
const CATEGORIES: CalcCategory[] = ["finance", "health", "math"];

const getCurrentSearchQuery = () => new URLSearchParams(window.location.search).get("q") || "";

export default function CategoryPage() {
  const { locale } = useLocale();
  const { category } = useParams<{ category: string }>();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(getCurrentSearchQuery);

  useEffect(() => {
    if (q) setParams({ q }, { replace: true });
    else setParams({}, { replace: true });
  }, [q, setParams]);

  // Reset search when navigating to a different category
  useEffect(() => {
    setQ(getCurrentSearchQuery());
  }, [category]);

  const valid = !!category && CATEGORIES.includes(category as CalcCategory);
  const cat = (valid ? category : "finance") as CalcCategory;
  const items = useMemo(() => byCategory(cat, locale), [cat, locale]);

  const filtered = useMemo(() => {
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter((c) =>
      c.title.toLowerCase().includes(s) ||
      c.short.toLowerCase().includes(s) ||
      c.slug.includes(s) ||
      c.description.toLowerCase().includes(s)
    );
  }, [items, q]);

  if (!valid) return <Navigate to={withLocale("/", locale)} replace />;
  const meta = categoryText(locale, cat);
  const seoDescription = translateCalculatorText(
    locale,
    `${meta.tagline}. ${items.length} free professional ${cat} calculators with charts and detailed breakdowns.`
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: meta.title,
        description: seoDescription,
        url: `https://uscalculator.online${withLocale(`/${cat}`, locale)}`,
        inLanguage: locale,
        isPartOf: {
          "@type": "WebSite",
          name: "USCalculator",
          url: "https://uscalculator.online/",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t(locale, "nav.home"), item: `https://uscalculator.online${withLocale("/", locale)}` },
          { "@type": "ListItem", position: 2, name: meta.title, item: `https://uscalculator.online${withLocale(`/${cat}`, locale)}` },
        ],
      },
      {
        "@type": "ItemList",
        name: meta.title,
        numberOfItems: items.length,
        itemListElement: items.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://uscalculator.online${withLocale(`/${cat}/${c.slug}`, locale)}`,
          name: c.title,
          description: c.description,
        })),
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <SEO
        title={`${meta.title} — USCalculator`}
        description={seoDescription}
        canonical={withLocale(`/${cat}`, locale)}
        jsonLd={jsonLd}
        keywords={[meta.title, meta.tagline, t(locale, `nav.${cat}`), "USCalculator"]}
      />
      <h1 className="text-2xl sm:text-3xl font-bold">{meta.title}</h1>
      <p className="text-muted-foreground mt-2">{meta.tagline}</p>

      {/* Category chips */}
      <div className="mt-5 flex flex-wrap gap-2" aria-label={translateCalculatorText(locale, "Calculator categories")}>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            to={withLocale(`/${c}`, locale)}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-full border transition ${
              c === cat
                ? "bg-accent text-accent-foreground border-accent"
                : "border-border text-muted-foreground hover:text-foreground hover:border-accent"
            }`}
          >
            {categoryText(locale, c).title}
          </Link>
        ))}
      </div>

      <div className="mt-6 mb-3">
        <SearchFilter
          value={q}
          onChange={setQ}
          placeholder={t(locale, "category.search.placeholder", { count: items.length, category: cat })}
          resultCount={q ? filtered.length : undefined}
        />
      </div>

      {/* Quick-filter tags */}
      <div className="mt-8 flex flex-wrap gap-2" aria-label={translateCalculatorText(locale, "Quick filters")}>
        {q && (
          <button
            onClick={() => setQ("")}
            className="px-2.5 py-1 text-xs rounded-full border border-border text-muted-foreground hover:text-foreground"
          >
            ✕ {t(locale, "category.clear")}
          </button>
        )}
        {QUICK_TAGS[cat].map((tag) => {
          const active = q.toLowerCase() === tag.toLowerCase();
          const label = translateCalculatorText(locale, tag);
          return (
            <button
              key={tag}
              onClick={() => setQ(active ? "" : tag)}
              className={`px-2.5 py-1 text-xs rounded-full border transition ${
                active
                  ? "bg-accent text-accent-foreground border-accent"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-accent"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {t(locale, "category.noResults", { query: q })} <button onClick={() => setQ("")} className="text-accent underline">{t(locale, "category.clear")}</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-6">
          {filtered.map((c) => {
            const Icon = c.icon;
            return (
              <Link key={c.slug} to={withLocale(`/${cat}/${c.slug}`, locale)} className="calc-card hover:border-accent transition group">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-primary group-hover:text-accent">{c.title}</div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
