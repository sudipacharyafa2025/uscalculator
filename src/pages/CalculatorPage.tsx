import { useParams, Navigate } from "react-router-dom";
import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from "react";
import { findCalc } from "@/data/calculators";
import { useLocale } from "@/hooks/useLocale";
import { withLocale } from "@/i18n/locale";
import { t } from "@/i18n/messages";

const pages: Record<string, LazyExoticComponent<ComponentType>> = {
  // Finance
  mortgage: lazy(() => import("./calculators/Mortgage")),
  loan: lazy(() => import("./calculators/Loan")),
  "loan-comparison": lazy(() => import("./calculators/LoanComparison")),
  "auto-loan": lazy(() => import("./calculators/AutoLoan")),
  "compound-interest": lazy(() => import("./calculators/CompoundInterest")),
  investment: lazy(() => import("./calculators/Investment")),
  retirement: lazy(() => import("./calculators/Retirement")),
  "sales-tax": lazy(() => import("./calculators/SalesTax")),
  discount: lazy(() => import("./calculators/Discount")),
  "simple-interest": lazy(() => import("./calculators/SimpleInterest")),
  savings: lazy(() => import("./calculators/Savings")),
  cd: lazy(() => import("./calculators/CD")),
  "credit-card": lazy(() => import("./calculators/CreditCard")),
  "debt-payoff": lazy(() => import("./calculators/DebtPayoff")),
  refinance: lazy(() => import("./calculators/Refinance")),
  affordability: lazy(() => import("./calculators/Affordability")),
  dti: lazy(() => import("./calculators/DTI")),
  inflation: lazy(() => import("./calculators/Inflation")),
  roi: lazy(() => import("./calculators/ROI")),
  apr: lazy(() => import("./calculators/APR")),
  "present-value": lazy(() => import("./calculators/PresentValue")),
  "future-value": lazy(() => import("./calculators/FutureValue")),
  // Health
  bmi: lazy(() => import("./calculators/BMI")),
  calorie: lazy(() => import("./calculators/Calorie")),
  "body-fat": lazy(() => import("./calculators/BodyFat")),
  bmr: lazy(() => import("./calculators/BMR")),
  tdee: lazy(() => import("./calculators/TDEE")),
  macro: lazy(() => import("./calculators/Macro")),
  "ideal-weight": lazy(() => import("./calculators/IdealWeight")),
  "lean-body-mass": lazy(() => import("./calculators/LeanBodyMass")),
  "body-surface-area": lazy(() => import("./calculators/BSA")),
  "heart-rate": lazy(() => import("./calculators/HeartRate")),
  "one-rep-max": lazy(() => import("./calculators/OneRepMax")),
  pace: lazy(() => import("./calculators/Pace")),
  "water-intake": lazy(() => import("./calculators/WaterIntake")),
  "due-date": lazy(() => import("./calculators/DueDate")),
  ovulation: lazy(() => import("./calculators/Ovulation")),
  bac: lazy(() => import("./calculators/BAC")),
  "date-calculator": lazy(() => import("./calculators/DateCalculator")),
  // Math
  scientific: lazy(() => import("./calculators/Scientific")),
  percentage: lazy(() => import("./calculators/Percentage")),
  fraction: lazy(() => import("./calculators/Fraction")),
  tip: lazy(() => import("./calculators/Tip")),
  triangle: lazy(() => import("./calculators/math/Triangle")),
  volume: lazy(() => import("./calculators/math/Volume")),
  "standard-deviation": lazy(() => import("./calculators/math/StdDev")),
  "random-number": lazy(() => import("./calculators/math/RandomNumber")),
  "number-sequence": lazy(() => import("./calculators/math/Sequence")),
  "percent-error": lazy(() => import("./calculators/math/PercentError")),
  exponent: lazy(() => import("./calculators/math/Exponent")),
  binary: lazy(() => import("./calculators/math/Binary")),
  hex: lazy(() => import("./calculators/math/Hex")),
  "half-life": lazy(() => import("./calculators/math/HalfLife")),
  quadratic: lazy(() => import("./calculators/math/Quadratic")),
  slope: lazy(() => import("./calculators/math/Slope")),
  log: lazy(() => import("./calculators/math/Log")),
  area: lazy(() => import("./calculators/math/Area")),
  "sample-size": lazy(() => import("./calculators/math/SampleSize")),
  probability: lazy(() => import("./calculators/math/Probability")),
  statistics: lazy(() => import("./calculators/math/Stats")),
  mmmr: lazy(() => import("./calculators/math/MMMR")),
  permutation: lazy(() => import("./calculators/math/PermComb")),
  "z-score": lazy(() => import("./calculators/math/ZScore")),
  "confidence-interval": lazy(() => import("./calculators/math/CI")),
  ratio: lazy(() => import("./calculators/math/Ratio")),
  distance: lazy(() => import("./calculators/math/Distance")),
  circle: lazy(() => import("./calculators/math/Circle")),
  "surface-area": lazy(() => import("./calculators/math/SurfaceArea")),
  pythagorean: lazy(() => import("./calculators/math/Pythag")),
  "right-triangle": lazy(() => import("./calculators/math/RightTri")),
  root: lazy(() => import("./calculators/math/Root")),
  "lcm-gcf": lazy(() => import("./calculators/math/LCMGCF")),
  factor: lazy(() => import("./calculators/math/Factor")),
  "common-factor": lazy(() => import("./calculators/math/CommonFactor")),
  rounding: lazy(() => import("./calculators/math/Rounding")),
  "scientific-notation": lazy(() => import("./calculators/math/SciNotation")),
  "big-number": lazy(() => import("./calculators/math/BigNum")),
  "prime-factorization": lazy(() => import("./calculators/math/PrimeFact")),
  matrix: lazy(() => import("./calculators/math/Matrix")),
  basic: lazy(() => import("./calculators/math/Basic")),
  "long-division": lazy(() => import("./calculators/math/LongDivision")),
  average: lazy(() => import("./calculators/math/Average")),
  "p-value": lazy(() => import("./calculators/math/PValue")),
};

export default function CalculatorPage() {
  const { locale } = useLocale();
  const { category, slug } = useParams<{ category: string; slug: string }>();
  if (!slug) return <Navigate to={withLocale("/", locale)} replace />;
  const meta = findCalc(slug);
  if (!meta || meta.category !== category) return <Navigate to={withLocale("/", locale)} replace />;
  const Comp = pages[slug];
  if (!Comp) return <Navigate to={withLocale("/", locale)} replace />;
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted-foreground">{t(locale, "common.loading")}</div>}>
      <Comp />
    </Suspense>
  );
}
