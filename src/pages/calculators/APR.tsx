import { useState } from "react";
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

const meta = findCalc("apr")!;

interface Inputs {
  amount: string;
  rate: string;
  years: string;
  fees: string;
}

interface Calc {
  amount: number;
  rate: number;
  years: number;
  fees: number;
}

export default function APR() {
  const { format: fmt } = useCurrency();
  const [inputs, setInputs] = useState<Inputs>({ amount: "", rate: "", years: "", fees: "" });
  const [calc, setCalc] = useState<Calc | null>(null);

  const parsedAmount = Number(inputs.amount || 0);

  const { errors } = validateAll(inputs, {
    amount: { label: "Loan amount", required: true, min: 0.01 },
    rate: { label: "Interest rate", required: true, min: 0, max: FINANCE_MAX_RATE_PCT },
    years: { label: "Term", required: true, min: 1, max: FINANCE_MAX_YEARS, integer: true },
    fees: {
      label: "Upfront fees",
      required: true,
      min: 0,
      custom: (n) => (n >= parsedAmount ? "Fees must be less than loan amount" : null),
    },
  });

  const { share } = useScenarioUrl(inputs, (s) => {
    const next: Partial<Inputs> = {};
    if (typeof s.amount === "number" || typeof s.amount === "string") next.amount = String(s.amount);
    if (typeof s.rate === "number" || typeof s.rate === "string") next.rate = String(s.rate);
    if (typeof s.years === "number" || typeof s.years === "string") next.years = String(s.years);
    if (typeof s.fees === "number" || typeof s.fees === "string") next.fees = String(s.fees);
    setInputs((p) => ({ ...p, ...next }));
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({
      amount: Number(inputs.amount),
      rate: Number(inputs.rate),
      years: Number(inputs.years),
      fees: Number(inputs.fees),
    });
  };

  const pmt = calc ? monthlyPayment(calc.amount, calc.rate, calc.years) : 0;
  const principalNet = calc ? calc.amount - calc.fees : 0;
  let apr = Number.NaN;

  if (calc && principalNet > 0 && calc.years > 0) {
    let lo = 0.0001;
    let hi = calc.rate / 100 + 0.5;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      const r = mid / 12;
      const n = calc.years * 12;
      const test = r === 0 ? principalNet / n : (principalNet * r) / (1 - Math.pow(1 + r, -n));
      if (test > pmt) hi = mid;
      else lo = mid;
    }
    apr = ((lo + hi) / 2) * 100;
  }

  return (
    <CalcShell meta={meta} about={<p>APR (Annual Percentage Rate) reflects the true cost of a loan including upfront fees. It's calculated as the rate that equates the monthly payment when fees are subtracted from loan proceeds.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Loan amount" error={errors.amount}><Input type="number" value={inputs.amount} onChange={(e) => setInputs((p) => ({ ...p, amount: e.target.value }))} /></Field>
          <Field label="Interest rate" suffix="%" error={errors.rate}><Input type="number" step="0.01" value={inputs.rate} onChange={(e) => setInputs((p) => ({ ...p, rate: e.target.value }))} /></Field>
          <Field label="Term (years)" error={errors.years}><Input type="number" step="1" value={inputs.years} onChange={(e) => setInputs((p) => ({ ...p, years: e.target.value }))} /></Field>
          <Field label="Upfront fees / closing costs" error={errors.fees}><Input type="number" value={inputs.fees} onChange={(e) => setInputs((p) => ({ ...p, fees: e.target.value }))} /></Field>
          <div className="flex gap-2">
            <Button onClick={calculate}>Calculate</Button>
            <ShareScenario onShare={share} />
          </div>
        </div>
        <div className="space-y-3">
          {!calc ? (
            <p className="text-sm text-muted-foreground">Fill the fields and click Calculate to view results.</p>
          ) : (
            <>
              <ResultStat highlight label="APR" value={Number.isFinite(apr) ? `${apr.toFixed(3)}%` : "-"} />
              <ResultStat label="Monthly payment" value={fmt(pmt)} />
              <ResultStat label="Stated rate" value={`${calc.rate.toFixed(3)}%`} />
              <ResultStat label="Net loan proceeds" value={fmt(principalNet)} />
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
