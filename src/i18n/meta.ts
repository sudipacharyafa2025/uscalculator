import type { CalcCategory } from "@/data/calculators";
import type { Locale } from "@/i18n/locale";

type CategoryText = Record<CalcCategory, { title: string; tagline: string }>;

const CATEGORY_I18N: Record<Locale, CategoryText> = {
  en: {
    finance: { title: "Financial Calculators", tagline: "Loans, mortgages, investments and taxes" },
    health: { title: "Fitness & Health Calculators", tagline: "Body composition and nutrition" },
    math: { title: "Math Calculators", tagline: "From everyday math to scientific computation" },
  },
  fr: {
    finance: { title: "Calculateurs financiers", tagline: "Prêts, hypothèques, investissements et taxes" },
    health: { title: "Calculateurs santé & forme", tagline: "Composition corporelle et nutrition" },
    math: { title: "Calculateurs mathématiques", tagline: "Du calcul quotidien au calcul scientifique" },
  },
  es: {
    finance: { title: "Calculadoras financieras", tagline: "Préstamos, hipotecas, inversiones e impuestos" },
    health: { title: "Calculadoras de salud y fitness", tagline: "Composición corporal y nutrición" },
    math: { title: "Calculadoras matemáticas", tagline: "Desde matemáticas diarias hasta cálculo científico" },
  },
  nl: {
    finance: { title: "Financiële calculators", tagline: "Leningen, hypotheken, investeringen en belastingen" },
    health: { title: "Gezondheid & fitness calculators", tagline: "Lichaamssamenstelling en voeding" },
    math: { title: "Wiskunde calculators", tagline: "Van dagelijkse rekenkunde tot wetenschappelijk rekenen" },
  },
  ar: {
    finance: { title: "حاسبات مالية", tagline: "قروض، رهن عقاري، استثمارات وضرائب" },
    health: { title: "حاسبات الصحة واللياقة", tagline: "تركيب الجسم والتغذية" },
    math: { title: "حاسبات الرياضيات", tagline: "من الحساب اليومي إلى الحساب العلمي" },
  },
  ja: {
    finance: { title: "金融計算ツール", tagline: "ローン、住宅ローン、投資、税金" },
    health: { title: "健康・フィットネス計算ツール", tagline: "体組成と栄養" },
    math: { title: "数学計算ツール", tagline: "日常計算から科学計算まで" },
  },
};

export function categoryText(locale: Locale, category: CalcCategory) {
  return CATEGORY_I18N[locale]?.[category] ?? CATEGORY_I18N.en[category];
}
