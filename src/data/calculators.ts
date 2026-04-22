import {
  Home, Car, Wallet, TrendingUp, PiggyBank, LineChart, Receipt, Tag, GitCompare,
  Activity, Flame, Scale, Calculator as CalcIcon, Percent, Divide, DollarSign,
  Triangle as TriIcon, Box, Sigma, Shuffle, ListOrdered, AlertTriangle, Superscript,
  Binary as BinIcon, Hash, Hourglass, Variable, Spline, Logs, Square, BarChart3,
  Dice5, Ruler, Circle as CircleIcon, Layers, RatioIcon, MapPin, Maximize2, GitBranch,
  Sprout, FileDigit, Grid3x3, Infinity as InfIcon, Calculator,
  Building2, RefreshCw, BadgePercent, Banknote, Landmark, CreditCard as CreditCardIcon,
  Scale as ScaleIcon, ArrowUpRight, ArrowDownRight, CandlestickChart as ChartCandlestick,
  Heart, Dumbbell, Timer, Baby, Wine, Droplet, Stethoscope, Zap, CalendarDays,
  type LucideIcon,
} from "lucide-react";
import type { Locale } from "@/i18n/locale";
import { getLocaleFromPath } from "@/i18n/locale";
import { translateCalculatorText } from "@/i18n/calculatorText";

export type CalcCategory = "finance" | "health" | "math";

export interface CalcMeta {
  slug: string;
  title: string;
  short: string;
  category: CalcCategory;
  icon: LucideIcon;
  description: string;
}

type CalcLocalizedFields = Pick<CalcMeta, "title" | "short" | "description">;

export const calculators: CalcMeta[] = [
  // Finance
  { slug: "mortgage", title: "Mortgage Calculator", short: "Mortgage", category: "finance", icon: Home, description: "Estimate monthly mortgage payments with taxes, insurance and PMI." },
  { slug: "loan", title: "Loan Calculator", short: "Loan", category: "finance", icon: Wallet, description: "Calculate payments, total interest and amortization for any loan." },
  { slug: "loan-comparison", title: "Loan Comparison Calculator", short: "Loan Comparison", category: "finance", icon: GitCompare, description: "Compare two loan scenarios side-by-side and see the interest difference." },
  { slug: "auto-loan", title: "Auto Loan Calculator", short: "Auto Loan", category: "finance", icon: Car, description: "Determine your monthly car payment including taxes and trade-in." },
  { slug: "compound-interest", title: "Compound Interest Calculator", short: "Compound Interest", category: "finance", icon: TrendingUp, description: "See how your money grows with the power of compounding." },
  { slug: "investment", title: "Investment Calculator", short: "Investment", category: "finance", icon: LineChart, description: "Project returns from a starting balance plus regular contributions." },
  { slug: "retirement", title: "Retirement Calculator", short: "Retirement", category: "finance", icon: PiggyBank, description: "Plan retirement savings with optional employer match." },
  { slug: "sales-tax", title: "Sales Tax Calculator", short: "Sales Tax", category: "finance", icon: Receipt, description: "Compute the final price of an item including sales tax." },
  { slug: "discount", title: "Discount Calculator", short: "Discount", category: "finance", icon: Tag, description: "Find the sale price after a percentage discount." },
  { slug: "simple-interest", title: "Simple Interest Calculator", short: "Simple Interest", category: "finance", icon: TrendingUp, description: "Calculate non-compounding interest using I = P × r × t." },
  { slug: "savings", title: "Savings Calculator", short: "Savings", category: "finance", icon: PiggyBank, description: "Project savings growth with monthly deposits and APY." },
  { slug: "cd", title: "CD Calculator", short: "CD", category: "finance", icon: Banknote, description: "Certificate of Deposit returns and effective APY." },
  { slug: "credit-card", title: "Credit Card Payoff Calculator", short: "Credit Card", category: "finance", icon: CreditCardIcon, description: "Time and interest to pay off a credit card balance." },
  { slug: "debt-payoff", title: "Debt Payoff Calculator", short: "Debt Payoff", category: "finance", icon: ArrowDownRight, description: "Plan a payoff schedule for any fixed-rate debt." },
  { slug: "refinance", title: "Refinance Calculator", short: "Refinance", category: "finance", icon: RefreshCw, description: "Compare refinance vs. current mortgage with break-even and lifetime savings." },
  { slug: "affordability", title: "House Affordability Calculator", short: "Affordability", category: "finance", icon: Building2, description: "Maximum home price you can afford using DTI guidelines." },
  { slug: "dti", title: "Debt-to-Income Ratio Calculator", short: "DTI Ratio", category: "finance", icon: ScaleIcon, description: "Front-end and back-end DTI with lender benchmarks." },
  { slug: "inflation", title: "Inflation Calculator", short: "Inflation", category: "finance", icon: ArrowUpRight, description: "Future value and lost purchasing power from inflation." },
  { slug: "roi", title: "ROI Calculator", short: "ROI", category: "finance", icon: ChartCandlestick, description: "Total and annualized return on investment." },
  { slug: "apr", title: "APR Calculator", short: "APR", category: "finance", icon: BadgePercent, description: "True APR including fees and closing costs." },
  { slug: "present-value", title: "Present Value Calculator", short: "Present Value", category: "finance", icon: Landmark, description: "Discount future cash flows to today's value." },
  { slug: "future-value", title: "Future Value Calculator", short: "Future Value", category: "finance", icon: TrendingUp, description: "Compound today's money plus annual contributions." },
  // Health
  { slug: "bmi", title: "BMI Calculator", short: "BMI", category: "health", icon: Scale, description: "Calculate BMI with WHO category badge and healthy weight range." },
  { slug: "calorie", title: "Calorie Calculator", short: "Calorie", category: "health", icon: Flame, description: "Estimate daily calorie needs to maintain, lose or gain weight." },
  { slug: "body-fat", title: "Body Fat Calculator", short: "Body Fat", category: "health", icon: Activity, description: "Estimate body fat percentage using the U.S. Navy method." },
  { slug: "bmr", title: "BMR Calculator", short: "BMR", category: "health", icon: Flame, description: "Basal Metabolic Rate via Mifflin–St Jeor, Harris–Benedict and Katch–McArdle." },
  { slug: "tdee", title: "TDEE Calculator", short: "TDEE", category: "health", icon: Activity, description: "Total Daily Energy Expenditure: BMR × activity factor with cut/bulk targets." },
  { slug: "macro", title: "Macro Calculator", short: "Macros", category: "health", icon: Sigma, description: "Daily protein, carbs and fat in grams from your calorie goal." },
  { slug: "ideal-weight", title: "Ideal Weight Calculator", short: "Ideal Weight", category: "health", icon: Scale, description: "IBW from Robinson, Miller, Devine and Hamwi formulas." },
  { slug: "lean-body-mass", title: "Lean Body Mass Calculator", short: "Lean Body Mass", category: "health", icon: Dumbbell, description: "Lean mass via Boer, James and Hume formulas." },
  { slug: "body-surface-area", title: "Body Surface Area Calculator", short: "BSA", category: "health", icon: Stethoscope, description: "BSA via Mosteller, Du Bois and Haycock — used for clinical dosing." },
  { slug: "heart-rate", title: "Target Heart Rate Calculator", short: "Heart Rate", category: "health", icon: Heart, description: "Max HR and 5 training zones — Tanaka, Fox and Karvonen." },
  { slug: "one-rep-max", title: "One-Rep Max Calculator", short: "1RM", category: "health", icon: Dumbbell, description: "Estimate 1RM with five formulas plus a percentage training table." },
  { slug: "pace", title: "Pace Calculator", short: "Pace", category: "health", icon: Timer, description: "Race pace per km/mile, average speed and equal split times." },
  { slug: "water-intake", title: "Water Intake Calculator", short: "Water Intake", category: "health", icon: Droplet, description: "Recommended daily water from body mass, exercise and climate." },
  { slug: "due-date", title: "Pregnancy Due Date Calculator", short: "Due Date", category: "health", icon: Baby, description: "Estimated due date and trimester from last menstrual period." },
  { slug: "ovulation", title: "Ovulation Calculator", short: "Ovulation", category: "health", icon: Baby, description: "Predict ovulation and the fertile window." },
  { slug: "bac", title: "BAC Calculator", short: "BAC", category: "health", icon: Wine, description: "Estimate Blood Alcohol Content using the Widmark formula." },
  // Math
  { slug: "scientific", title: "Scientific Calculator", short: "Scientific", category: "math", icon: CalcIcon, description: "Full scientific calculator for advanced math expressions." },
  { slug: "fraction", title: "Fraction Calculator", short: "Fraction", category: "math", icon: Divide, description: "Add, subtract, multiply and divide fractions with simplification." },
  { slug: "percentage", title: "Percentage Calculator", short: "Percentage", category: "math", icon: Percent, description: "Solve any percentage problem in three different ways." },
  { slug: "triangle", title: "Triangle Calculator", short: "Triangle", category: "math", icon: TriIcon, description: "Area, perimeter and angles from three sides." },
  { slug: "volume", title: "Volume Calculator", short: "Volume", category: "math", icon: Box, description: "Volume of cubes, boxes, spheres, cylinders, cones and pyramids." },
  { slug: "standard-deviation", title: "Standard Deviation Calculator", short: "Standard Deviation", category: "math", icon: Sigma, description: "Sample and population standard deviation from a dataset." },
  { slug: "random-number", title: "Random Number Generator", short: "Random Number", category: "math", icon: Shuffle, description: "Generate random integers, optionally unique." },
  { slug: "number-sequence", title: "Number Sequence Calculator", short: "Number Sequence", category: "math", icon: ListOrdered, description: "Arithmetic, geometric and Fibonacci sequences." },
  { slug: "percent-error", title: "Percent Error Calculator", short: "Percent Error", category: "math", icon: AlertTriangle, description: "Compare an observed value against a true reference." },
  { slug: "exponent", title: "Exponent Calculator", short: "Exponent", category: "math", icon: Superscript, description: "Compute base raised to any power." },
  { slug: "binary", title: "Binary Calculator", short: "Binary", category: "math", icon: BinIcon, description: "Convert between binary, decimal and hexadecimal." },
  { slug: "hex", title: "Hex Calculator", short: "Hex", category: "math", icon: Hash, description: "Convert hex to decimal and binary." },
  { slug: "half-life", title: "Half-Life Calculator", short: "Half-Life", category: "math", icon: Hourglass, description: "Exponential decay over time." },
  { slug: "quadratic", title: "Quadratic Formula Calculator", short: "Quadratic", category: "math", icon: Variable, description: "Solve ax² + bx + c = 0 with real or complex roots." },
  { slug: "slope", title: "Slope Calculator", short: "Slope", category: "math", icon: Spline, description: "Slope, intercept, equation and distance between two points." },
  { slug: "log", title: "Logarithm Calculator", short: "Log", category: "math", icon: Logs, description: "Logarithm of any positive number to any base." },
  { slug: "area", title: "Area Calculator", short: "Area", category: "math", icon: Square, description: "Area of common 2D shapes." },
  { slug: "sample-size", title: "Sample Size Calculator", short: "Sample Size", category: "math", icon: BarChart3, description: "Required survey size for a confidence level and margin of error." },
  { slug: "probability", title: "Probability Calculator", short: "Probability", category: "math", icon: Dice5, description: "Combine probabilities of independent events." },
  { slug: "statistics", title: "Statistics Calculator", short: "Statistics", category: "math", icon: BarChart3, description: "Mean, median, mode, range, variance and standard deviation." },
  { slug: "mmmr", title: "Mean, Median, Mode, Range Calculator", short: "Mean/Median/Mode", category: "math", icon: BarChart3, description: "Central tendency and spread of a dataset." },
  { slug: "permutation", title: "Permutation & Combination Calculator", short: "Permutation/Combination", category: "math", icon: Shuffle, description: "Count ordered (P) and unordered (C) selections." },
  { slug: "z-score", title: "Z-score Calculator", short: "Z-score", category: "math", icon: Sigma, description: "Standard score and percentile from value, mean and σ." },
  { slug: "confidence-interval", title: "Confidence Interval Calculator", short: "Confidence Interval", category: "math", icon: BarChart3, description: "CI for a sample mean using normal approximation." },
  { slug: "ratio", title: "Ratio Calculator", short: "Ratio", category: "math", icon: Divide, description: "Simplify ratios and convert to decimal or percent." },
  { slug: "distance", title: "Distance Calculator", short: "Distance", category: "math", icon: MapPin, description: "Distance between two points in 2D space." },
  { slug: "circle", title: "Circle Calculator", short: "Circle", category: "math", icon: CircleIcon, description: "Area, circumference and diameter from radius." },
  { slug: "surface-area", title: "Surface Area Calculator", short: "Surface Area", category: "math", icon: Layers, description: "Surface area of common 3D shapes." },
  { slug: "pythagorean", title: "Pythagorean Theorem Calculator", short: "Pythagorean", category: "math", icon: TriIcon, description: "Hypotenuse from two right-triangle legs." },
  { slug: "right-triangle", title: "Right Triangle Calculator", short: "Right Triangle", category: "math", icon: TriIcon, description: "Sides, angles, area and perimeter of a right triangle." },
  { slug: "root", title: "Root Calculator", short: "Root", category: "math", icon: Sprout, description: "nth root of any number." },
  { slug: "lcm-gcf", title: "LCM & GCF Calculator", short: "LCM / GCF", category: "math", icon: GitBranch, description: "Greatest common factor and least common multiple." },
  { slug: "factor", title: "Factor Calculator", short: "Factor", category: "math", icon: GitBranch, description: "All positive integer factors of a number." },
  { slug: "common-factor", title: "Common Factor Calculator", short: "Common Factor", category: "math", icon: GitBranch, description: "Find common factors between numbers." },
  { slug: "rounding", title: "Rounding Calculator", short: "Rounding", category: "math", icon: Maximize2, description: "Round, floor, ceiling or truncate to N decimal places." },
  { slug: "scientific-notation", title: "Scientific Notation Calculator", short: "Scientific Notation", category: "math", icon: Superscript, description: "Convert numbers to m × 10ⁿ form." },
  { slug: "big-number", title: "Big Number Calculator", short: "Big Number", category: "math", icon: InfIcon, description: "Arbitrary precision integer arithmetic." },
  { slug: "prime-factorization", title: "Prime Factorization Calculator", short: "Prime Factorization", category: "math", icon: FileDigit, description: "Express a number as a product of primes." },
  { slug: "matrix", title: "Matrix Calculator", short: "Matrix", category: "math", icon: Grid3x3, description: "Add, subtract, multiply, transpose and determinant." },
  { slug: "basic", title: "Basic Calculator", short: "Basic", category: "math", icon: Calculator, description: "A simple four-function calculator." },
  { slug: "long-division", title: "Long Division Calculator", short: "Long Division", category: "math", icon: Divide, description: "Integer quotient and remainder." },
  { slug: "average", title: "Average Calculator", short: "Average", category: "math", icon: BarChart3, description: "Arithmetic mean of a list of numbers." },
  { slug: "p-value", title: "P-value Calculator", short: "P-value", category: "math", icon: Sigma, description: "P-value from a z-score for one- or two-tailed tests." },
  { slug: "tip", title: "Tip Calculator", short: "Tip", category: "math", icon: DollarSign, description: "Calculate tip and split a bill." },
  { slug: "date-calculator", title: "Date Calculator", short: "Date", category: "math", icon: CalendarDays, description: "Years, months, days, hours, minutes and seconds between two dates — or add to a date." },
];

const META_OVERRIDES: Partial<Record<Locale, Partial<Record<string, CalcLocalizedFields>>>> = {
  fr: {
    mortgage: {
      title: "Calculateur hypothécaire",
      short: "Hypothèque",
      description: "Estimez les mensualités hypothécaires avec taxes, assurance et PMI.",
    },
    loan: {
      title: "Calculateur de prêt",
      short: "Prêt",
      description: "Calculez les paiements, les intérêts totaux et l'amortissement pour tout prêt.",
    },
    bmi: {
      title: "Calculateur IMC",
      short: "IMC",
      description: "Calculez l'IMC avec catégorie OMS et plage de poids santé.",
    },
    scientific: {
      title: "Calculatrice scientifique",
      short: "Scientifique",
      description: "Calculatrice scientifique complète pour les expressions mathématiques avancées.",
    },
  },
  es: {
    mortgage: {
      title: "Calculadora de hipoteca",
      short: "Hipoteca",
      description: "Estima pagos mensuales de hipoteca con impuestos, seguro y PMI.",
    },
    loan: {
      title: "Calculadora de préstamo",
      short: "Préstamo",
      description: "Calcula pagos, interés total y amortización para cualquier préstamo.",
    },
    bmi: {
      title: "Calculadora de IMC",
      short: "IMC",
      description: "Calcula el IMC con categoría OMS y rango de peso saludable.",
    },
    scientific: {
      title: "Calculadora científica",
      short: "Científica",
      description: "Calculadora científica completa para expresiones matemáticas avanzadas.",
    },
  },
  nl: {},
  ar: {},
  ja: {},
};

const DESCRIPTION_TEMPLATES: Record<Exclude<Locale, "en">, Record<CalcCategory, (title: string) => string>> = {
  fr: {
    finance: (title) => `${title} en ligne gratuit pour estimer les paiements, comparer les hypothèses financières et obtenir des résultats clairs adaptés au mobile.`,
    health: (title) => `${title} en ligne gratuit pour estimer des indicateurs de santé et de forme à partir de formules reconnues et de résultats faciles à lire.`,
    math: (title) => `${title} en ligne gratuit pour résoudre rapidement des calculs mathématiques courants ou avancés avec des résultats structurés.`,
  },
  es: {
    finance: (title) => `${title} en línea gratuita para estimar pagos, comparar supuestos financieros y obtener resultados claros adaptados a móvil.`,
    health: (title) => `${title} en línea gratuita para estimar métricas de salud y fitness con fórmulas reconocidas y resultados fáciles de interpretar.`,
    math: (title) => `${title} en línea gratuita para resolver cálculos matemáticos cotidianos o avanzados con resultados estructurados.`,
  },
  nl: {
    finance: (title) => `Gratis online ${title.toLowerCase()} om betalingen te schatten, financiële aannames te vergelijken en duidelijke mobielvriendelijke resultaten te krijgen.`,
    health: (title) => `Gratis online ${title.toLowerCase()} om gezondheids- en fitnessmetingen te schatten met erkende formules en heldere resultaten.`,
    math: (title) => `Gratis online ${title.toLowerCase()} voor snelle dagelijkse en geavanceerde wiskundige berekeningen met overzichtelijke resultaten.`,
  },
  ar: {
    finance: (title) => `${title} مجانية عبر الإنترنت لتقدير المدفوعات ومقارنة الافتراضات المالية والحصول على نتائج واضحة مناسبة للجوال.`,
    health: (title) => `${title} مجانية عبر الإنترنت لتقدير مؤشرات الصحة واللياقة باستخدام صيغ معتمدة ونتائج سهلة الفهم.`,
    math: (title) => `${title} مجانية عبر الإنترنت لحل الحسابات الرياضية اليومية أو المتقدمة بسرعة وبنتائج منظمة.`,
  },
  ja: {
    finance: (title) => `${title}。支払い、金融上の前提、比較シナリオをわかりやすくモバイル対応の結果で確認できる無料オンライン計算ツールです。`,
    health: (title) => `${title}。標準的な式を使って健康・フィットネス指標を推定し、読みやすい結果を確認できる無料オンライン計算ツールです。`,
    math: (title) => `${title}。日常的な計算から高度な数学計算まで、整理された結果で素早く解ける無料オンライン計算ツールです。`,
  },
};

function resolveLocale(locale?: Locale): Locale {
  if (locale) return locale;
  if (typeof window === "undefined") return "en";
  return getLocaleFromPath(window.location.pathname);
}

function localizeMeta(meta: CalcMeta, locale: Locale): CalcMeta {
  if (locale === "en") return meta;
  const override = META_OVERRIDES[locale]?.[meta.slug];
  const title = override?.title ?? translateCalculatorText(locale, meta.title);
  const short = override?.short ?? translateCalculatorText(locale, meta.short);
  return {
    ...meta,
    title,
    short,
    description: override?.description ?? DESCRIPTION_TEMPLATES[locale][meta.category](title),
  };
}

const dynamicMetaCache = new Map<string, CalcMeta>();

function createDynamicMeta(meta: CalcMeta): CalcMeta {
  const cached = dynamicMetaCache.get(meta.slug);
  if (cached) return cached;

  const dynamic = { ...meta } as CalcMeta;
  Object.defineProperties(dynamic, {
    title: {
      enumerable: true,
      configurable: true,
      get() {
        return localizeMeta(meta, resolveLocale()).title;
      },
    },
    short: {
      enumerable: true,
      configurable: true,
      get() {
        return localizeMeta(meta, resolveLocale()).short;
      },
    },
    description: {
      enumerable: true,
      configurable: true,
      get() {
        return localizeMeta(meta, resolveLocale()).description;
      },
    },
  });

  dynamicMetaCache.set(meta.slug, dynamic);
  return dynamic;
}

export const getCalculators = (locale?: Locale) => {
  const resolved = resolveLocale(locale);
  return calculators.map((x) => localizeMeta(x, resolved));
};

export const byCategory = (c: CalcCategory, locale?: Locale) => {
  const resolved = resolveLocale(locale);
  return calculators.filter((x) => x.category === c).map((x) => localizeMeta(x, resolved));
};

export const findCalc = (slug: string, locale?: Locale) => {
  const found = calculators.find((x) => x.slug === slug);
  if (!found) return undefined;
  if (locale) return localizeMeta(found, resolveLocale(locale));
  return createDynamicMeta(found);
};

export const categoryMeta: Record<CalcCategory, { title: string; tagline: string }> = {
  finance: { title: "Financial Calculators", tagline: "Loans, mortgages, investments and taxes" },
  health: { title: "Fitness & Health Calculators", tagline: "Body composition and nutrition" },
  math: { title: "Math Calculators", tagline: "From everyday math to scientific computation" },
};
