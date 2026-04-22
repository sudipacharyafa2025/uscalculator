import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { CalcMeta } from "@/data/calculators";
import SEO from "@/components/SEO";
import { FINANCE_SEO, type FaqItem } from "@/lib/financeFaq";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLocale } from "@/hooks/useLocale";
import { t } from "@/i18n/messages";
import { withLocale } from "@/i18n/locale";
import { categoryText } from "@/i18n/meta";
import { translateCalculatorText } from "@/i18n/calculatorText";

interface Props {
  meta: CalcMeta;
  children: ReactNode;
  about?: ReactNode;
}

function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

function buildGenericFaqItems(meta: CalcMeta, description: string): FaqItem[] {
  return [
    {
      q: `What does the ${meta.title} calculate?`,
      a: description,
    },
    {
      q: `How accurate is this ${meta.short} calculator?`,
      a: `This tool applies standard ${meta.short.toLowerCase()} formulas and updates results in real time. Output quality depends on correct input values and assumptions.`,
    },
    {
      q: `Can I use this ${meta.short} calculator on mobile?`,
      a: "Yes. It is responsive and designed to work on desktop, tablet, and mobile browsers.",
    },
    {
      q: `Is this ${meta.short} calculator free?`,
      a: "Yes. It is free to use with no signup required.",
    },
  ];
}

function buildSoftwareAppJsonLd(title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    applicationCategory: `${title} Calculator`,
    operatingSystem: "Web",
    url: `https://uscalculator.online${path}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

function buildHowToJsonLd(title: string, steps: string[], path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    url: `https://uscalculator.online${path}`,
    step: steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
  };
}

function buildWebPageJsonLd(title: string, description: string, path: string, locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: `https://uscalculator.online${path}`,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "USCalculator",
      url: "https://uscalculator.online/",
    },
  };
}

export default function CalcShell({ meta, children, about }: Props) {
  const { locale } = useLocale();
  const Icon = meta.icon;
  const basePath = `/${meta.category}/${meta.slug}`;
  const path = withLocale(basePath, locale);
  const catText = categoryText(locale, meta.category);
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t(locale, "nav.home"), item: `https://uscalculator.online${withLocale("/", locale)}` },
      { "@type": "ListItem", position: 2, name: catText.title, item: `https://uscalculator.online${withLocale(`/${meta.category}`, locale)}` },
      { "@type": "ListItem", position: 3, name: meta.title, item: `https://uscalculator.online${path}` },
    ],
  };
  const seo = meta.category === "finance" ? FINANCE_SEO[meta.slug] : null;
  const titleText = translateCalculatorText(locale, meta.title);
  const shortText = translateCalculatorText(locale, meta.short);
  const baseDescription = seo?.description ?? `${meta.description} Free, accurate and mobile-friendly. Use our ${meta.title.toLowerCase()} online with no signup required.`;
  const description = translateCalculatorText(locale, baseDescription);
  const guideSteps = [
    t(locale, "calc.guide.step1"),
    t(locale, "calc.guide.step2"),
    t(locale, "calc.guide.step3"),
  ];
  const faqItems: FaqItem[] = seo?.faq?.length ? seo.faq : buildGenericFaqItems(meta, description);
  const localizedFaqItems: FaqItem[] = faqItems.map((item) => ({
    q: translateCalculatorText(locale, item.q),
    a: translateCalculatorText(locale, item.a),
  }));
  const faqJsonLd = buildFaqJsonLd(localizedFaqItems);
  const softwareAppJsonLd = buildSoftwareAppJsonLd(titleText, description, path);
  const howToJsonLd = buildHowToJsonLd(t(locale, "calc.guide.title", { title: titleText }), guideSteps, path);
  const webPageJsonLd = buildWebPageJsonLd(titleText, description, path, locale);
  const jsonLd = [breadcrumbs, webPageJsonLd, softwareAppJsonLd, howToJsonLd, faqJsonLd];
  const keywords = [
    titleText,
    shortText,
    `${catText.title}`,
    translateCalculatorText(locale, "free online calculator"),
    translateCalculatorText(locale, `${meta.category} calculator`),
    "USCalculator",
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <SEO
        title={`${titleText} — ${translateCalculatorText(locale, `Free Online ${meta.title}`)}`}
        description={description}
        canonical={path}
        image="/placeholder.svg"
        keywords={keywords}
        jsonLd={jsonLd}
      />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground mb-4 flex-wrap">
        <Link to={withLocale("/", locale)} className="hover:text-accent">{t(locale, "nav.home")}</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={withLocale(`/${meta.category}`, locale)} className="hover:text-accent">
          {catText.title}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary font-medium">{shortText}</span>
      </nav>

      <header className="mb-6 flex items-start gap-3 sm:gap-4">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: "var(--gradient-accent)" }}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-bold leading-tight">{titleText}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">{translateCalculatorText(locale, meta.description)}</p>
        </div>
      </header>

      {children}

      {about && (
        <section className="mt-10 calc-card prose prose-sm max-w-none text-foreground">
          <h2 className="text-lg font-semibold mb-2">{t(locale, "calc.about")}</h2>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-3">{about}</div>
        </section>
      )}

      <section className="mt-10 grid lg:grid-cols-3 gap-4 sm:gap-6">
        <article className="calc-card">
          <h2 className="text-lg font-semibold mb-3">{t(locale, "calc.guide.title", { title: titleText })}</h2>
          <ol className="space-y-2 text-sm text-muted-foreground leading-relaxed list-decimal list-inside">
            {guideSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
        <article className="calc-card">
          <h2 className="text-lg font-semibold mb-3">{t(locale, "calc.benefits.title")}</h2>
          <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed">
            <li>{t(locale, "calc.benefits.instant")}</li>
            <li>{t(locale, "calc.benefits.transparent")}</li>
            <li>{t(locale, "calc.benefits.mobile")}</li>
          </ul>
        </article>
        <article className="calc-card">
          <h2 className="text-lg font-semibold mb-3">{t(locale, "calc.accuracy.title")}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t(locale, "calc.accuracy.body", { category: catText.title.toLowerCase() })}
          </p>
        </article>
      </section>

      <section className="mt-10 calc-card">
        <h2 className="text-lg font-semibold mb-2">{t(locale, "calc.faq")}</h2>
        <Accordion type="single" collapsible className="w-full">
          {localizedFaqItems.map((item, index) => (
            <AccordionItem key={item.q} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-sm">{item.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
