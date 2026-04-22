import { useState } from "react";
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

const meta = findCalc("roi")!;

interface Inputs {
  initial: string;
  final: string;
  years: string;
}

interface Calc {
  initial: number;
  final: number;
  years: number;
}

export default function ROI() {
  const { format: fmt } = useCurrency();
  const [inputs, setInputs] = useState<Inputs>({ initial: "", final: "", years: "" });
  const [calc, setCalc] = useState<Calc | null>(null);

  const { errors } = validateAll(inputs, {
    initial: { label: "Initial investment", required: true, min: 0.01 },
    final: { label: "Final value", required: true, min: 0 },
    years: { label: "Holding period", required: true, min: 0.000001, max: 200 },
  });

  const { share } = useScenarioUrl(inputs, (s) => {
    const next: Partial<Inputs> = {};
    if (typeof s.initial === "number" || typeof s.initial === "string") next.initial = String(s.initial);
    if (typeof s.final === "number" || typeof s.final === "string") next.final = String(s.final);
    if (typeof s.years === "number" || typeof s.years === "string") next.years = String(s.years);
    setInputs((p) => ({ ...p, ...next }));
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ initial: Number(inputs.initial), final: Number(inputs.final), years: Number(inputs.years) });
  };

  const profit = calc ? calc.final - calc.initial : 0;
  const roi = calc && calc.initial > 0 ? (profit / calc.initial) * 100 : NaN;
  const annualized = calc && calc.years > 0 && calc.initial > 0 ? (Math.pow(calc.final / calc.initial, 1 / calc.years) - 1) * 100 : NaN;

  return (
    <CalcShell meta={meta} about={<p>Return on Investment (ROI) measures gain relative to cost: ROI = (Final - Initial) / Initial. Annualized return uses the geometric mean over the holding period.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Initial investment" required error={errors.initial}><Input type="number" value={inputs.initial} onChange={(e) => setInputs((p) => ({ ...p, initial: e.target.value }))} /></Field>
          <Field label="Final value" required error={errors.final}><Input type="number" value={inputs.final} onChange={(e) => setInputs((p) => ({ ...p, final: e.target.value }))} /></Field>
          <Field label="Holding period (years)" required error={errors.years}><Input type="number" step="0.01" value={inputs.years} onChange={(e) => setInputs((p) => ({ ...p, years: e.target.value }))} /></Field>
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
              <ResultStat highlight label="Total ROI" value={isFinite(roi) ? `${roi.toFixed(2)}%` : "-"} />
              <ResultStat label="Annualized return" value={isFinite(annualized) ? `${annualized.toFixed(2)}%` : "-"} />
              <ResultStat label="Net profit" value={fmt(profit)} />
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
