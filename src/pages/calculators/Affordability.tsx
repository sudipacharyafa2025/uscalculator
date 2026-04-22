import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findCalc } from "@/data/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { monthlyPayment } from "@/lib/calculators";
import { validateAll } from "@/lib/validate";
import { FINANCE_MAX_RATE_PCT, FINANCE_MAX_YEARS } from "@/lib/financeBounds";
import ShareScenario from "@/components/ShareScenario";
import { useScenarioUrl } from "@/lib/scenario";

const meta = findCalc("affordability")!;
export default function Affordability() {
  const { format: fmt } = useCurrency();
  const [income, setIncome] = useState(7500);
  const [debts, setDebts] = useState(500);
  const [down, setDown] = useState(40000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(30);
  const [taxRate, setTaxRate] = useState(1.2);
  const [insurance, setInsurance] = useState(100);
  const [dti, setDti] = useState(36);
  const [calc, setCalc] = useState<{ income: number; debts: number; down: number; rate: number; years: number; taxRate: number; insurance: number; dti: number } | null>(null);

  const { errors } = validateAll(
    { income, debts, down, rate, years, taxRate, insurance, dti },
    {
      income: { label: "Gross monthly income", required: true, min: 0.01 },
      debts: { label: "Monthly debt payments", min: 0 },
      down: { label: "Down payment", min: 0 },
      rate: { label: "Rate", required: true, min: 0, max: FINANCE_MAX_RATE_PCT },
      years: { label: "Term", required: true, min: 1, max: FINANCE_MAX_YEARS, integer: true },
      taxRate: { label: "Property tax", min: 0, max: 20 },
      insurance: { label: "Insurance", min: 0 },
      dti: { label: "Max DTI", required: true, min: 1, max: 100 },
    },
  );

  const { share } = useScenarioUrl(
    { income, debts, down, rate, years, taxRate, insurance, dti },
    (s) => {
      if (typeof s.income === "number") setIncome(s.income);
      if (typeof s.debts === "number") setDebts(s.debts);
      if (typeof s.down === "number") setDown(s.down);
      if (typeof s.rate === "number") setRate(s.rate);
      if (typeof s.years === "number") setYears(s.years);
      if (typeof s.taxRate === "number") setTaxRate(s.taxRate);
      if (typeof s.insurance === "number") setInsurance(s.insurance);
      if (typeof s.dti === "number") setDti(s.dti);
    },
  );

  const result = useMemo(() => {
    if (!calc) return null;
    const maxTotalDebt = calc.income * (calc.dti / 100);
    const maxMortgagePI = Math.max(0, maxTotalDebt - calc.debts - calc.insurance);
    // Solve for principal where P&I + (price * tax/12) ≈ maxMortgagePI; iterate
    const r = calc.rate / 100 / 12;
    const n = calc.years * 12;
    const factor = r === 0 ? 1 / n : r / (1 - Math.pow(1 + r, -n));
    let price = (maxMortgagePI / factor) + calc.down;
    for (let i = 0; i < 25; i++) {
      const tax = (price * calc.taxRate / 100) / 12;
      const pi = Math.max(0, maxMortgagePI - tax);
      const principal = pi / factor;
      price = principal + calc.down;
    }
    const principal = Math.max(0, price - calc.down);
    const pi = monthlyPayment(principal, calc.rate, calc.years);
    const tax = (price * calc.taxRate / 100) / 12;
    return { price: Math.max(price, calc.down), principal, pi, tax, total: pi + tax + calc.insurance, maxTotalDebt };
  }, [calc]);

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ income, debts, down, rate, years, taxRate, insurance, dti });
  };

  return (
    <CalcShell meta={meta} about={<p>Estimate the maximum home price you can afford using your debt-to-income ratio (DTI). Standard guideline: total housing + debt payments stay under 36% of gross income.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <h2 className="text-lg font-semibold">Your finances</h2>
          <Field label="Gross monthly income" required error={errors.income}><Input type="number" value={income} onChange={(e) => setIncome(+e.target.value || 0)} /></Field>
          <Field label="Monthly debt payments" error={errors.debts}><Input type="number" value={debts} onChange={(e) => setDebts(+e.target.value || 0)} /></Field>
          <Field label="Down payment" error={errors.down}><Input type="number" value={down} onChange={(e) => setDown(+e.target.value || 0)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Rate" suffix="%" required error={errors.rate}><Input type="number" step="0.01" value={rate} onChange={(e) => setRate(+e.target.value || 0)} /></Field>
            <Field label="Term (yrs)" required error={errors.years}><Input type="number" step="1" value={years} onChange={(e) => setYears(+e.target.value || 0)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Property tax" suffix="%/yr" error={errors.taxRate}><Input type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(+e.target.value || 0)} /></Field>
            <Field label="Insurance/mo" error={errors.insurance}><Input type="number" value={insurance} onChange={(e) => setInsurance(+e.target.value || 0)} /></Field>
          </div>
          <Field label="Max DTI" suffix="%" required error={errors.dti}><Input type="number" value={dti} onChange={(e) => setDti(+e.target.value || 0)} /></Field>
          <div className="flex gap-2">
            <Button onClick={calculate}>Calculate</Button>
            <ShareScenario onShare={share} />
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          {!result ? (
            <div className="calc-card"><p className="text-sm text-muted-foreground">Click Calculate to show results.</p></div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <ResultStat highlight label="Max home price" value={fmt(result.price)} />
                <ResultStat label="Loan amount" value={fmt(result.principal)} />
                <ResultStat label="Monthly P&I" value={fmt(result.pi)} />
                <ResultStat label="Monthly tax" value={fmt(result.tax)} />
                <ResultStat label="Monthly insurance" value={fmt(calc?.insurance ?? insurance)} />
                <ResultStat label="Total monthly housing" value={fmt(result.total)} />
              </div>
              <div className="calc-card">
                <p className="text-sm text-muted-foreground">Based on a {(calc?.dti ?? dti)}% DTI cap, your total monthly debt budget is <strong>{fmt(result.maxTotalDebt)}</strong>. Subtracting your existing {fmt(calc?.debts ?? debts)} in debts leaves <strong>{fmt(result.maxTotalDebt - (calc?.debts ?? debts))}</strong> for housing.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
