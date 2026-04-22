import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findCalc } from "@/data/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { validateAll } from "@/lib/validate";
import ShareScenario from "@/components/ShareScenario";
import { useScenarioUrl } from "@/lib/scenario";

const meta = findCalc("inflation")!;

interface Inputs {
  amount: string;
  rate: string;
  years: string;
}

interface Calc {
  amount: number;
  rate: number;
  years: number;
}

export default function Inflation() {
  const { format: fmt } = useCurrency();
  const [inputs, setInputs] = useState<Inputs>({ amount: "", rate: "", years: "" });
  const [calc, setCalc] = useState<Calc | null>(null);

  const { errors } = validateAll(inputs, {
    amount: { label: "Amount", required: true, min: 0 },
    rate: { label: "Inflation rate", required: true, min: -100, max: 100 },
    years: { label: "Years", required: true, min: 0, max: 200 },
  });

  const { share } = useScenarioUrl(inputs, (s) => {
    const next: Partial<Inputs> = {};
    if (typeof s.amount === "number" || typeof s.amount === "string") next.amount = String(s.amount);
    if (typeof s.rate === "number" || typeof s.rate === "string") next.rate = String(s.rate);
    if (typeof s.years === "number" || typeof s.years === "string") next.years = String(s.years);
    setInputs((p) => ({ ...p, ...next }));
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ amount: Number(inputs.amount), rate: Number(inputs.rate), years: Number(inputs.years) });
  };

  const r = useMemo(() => {
    if (!calc) return null;
    const future = calc.amount * Math.pow(1 + calc.rate / 100, calc.years);
    const purchasingPower = calc.amount / Math.pow(1 + calc.rate / 100, calc.years);
    return { future, purchasingPower };
  }, [calc]);

  return (
    <CalcShell meta={meta} about={<p>Inflation reduces purchasing power over time. Future value = Present x (1+rate)^n; future purchasing power of today's money = Present / (1+rate)^n.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Amount today" required error={errors.amount}><Input type="number" value={inputs.amount} onChange={(e) => setInputs((p) => ({ ...p, amount: e.target.value }))} /></Field>
          <Field label="Annual inflation rate" suffix="%" required error={errors.rate}><Input type="number" step="0.01" value={inputs.rate} onChange={(e) => setInputs((p) => ({ ...p, rate: e.target.value }))} /></Field>
          <Field label="Years" required error={errors.years}><Input type="number" value={inputs.years} onChange={(e) => setInputs((p) => ({ ...p, years: e.target.value }))} /></Field>
          <div className="flex gap-2">
            <Button onClick={calculate}>Calculate</Button>
            <ShareScenario onShare={share} />
          </div>
        </div>
        <div className="space-y-3">
          {!calc || !r ? (
            <p className="text-sm text-muted-foreground">Fill the fields and click Calculate to view results.</p>
          ) : (
            <>
              <ResultStat highlight label={`Equivalent in ${calc.years} years`} value={fmt(r.future)} />
              <ResultStat label={`Today's ${fmt(calc.amount)} buys`} value={fmt(r.purchasingPower)} />
              <ResultStat label="Loss of purchasing power" value={fmt(calc.amount - r.purchasingPower)} />
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
