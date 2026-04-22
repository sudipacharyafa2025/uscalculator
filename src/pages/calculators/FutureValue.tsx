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

const meta = findCalc("future-value")!;

interface Inputs {
  pv: string;
  rate: string;
  years: string;
  pmt: string;
}

interface Calc {
  pv: number;
  rate: number;
  years: number;
  pmt: number;
}

export default function FutureValue() {
  const { format: fmt } = useCurrency();
  const [inputs, setInputs] = useState<Inputs>({ pv: "", rate: "", years: "", pmt: "" });
  const [calc, setCalc] = useState<Calc | null>(null);

  const { errors } = validateAll(inputs, {
    pv: { label: "Present value", required: true, min: 0 },
    pmt: { label: "Annual contribution", min: 0 },
    rate: { label: "Annual rate", required: true, min: -100, max: 100 },
    years: { label: "Years", required: true, min: 0, max: 200 },
  });

  const { share } = useScenarioUrl(inputs, (s) => {
    const next: Partial<Inputs> = {};
    if (typeof s.pv === "number" || typeof s.pv === "string") next.pv = String(s.pv);
    if (typeof s.rate === "number" || typeof s.rate === "string") next.rate = String(s.rate);
    if (typeof s.years === "number" || typeof s.years === "string") next.years = String(s.years);
    if (typeof s.pmt === "number" || typeof s.pmt === "string") next.pmt = String(s.pmt);
    setInputs((p) => ({ ...p, ...next }));
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ pv: Number(inputs.pv), rate: Number(inputs.rate), years: Number(inputs.years), pmt: Number(inputs.pmt || 0) });
  };

  const r = calc ? calc.rate / 100 : 0;
  const n = calc?.years ?? 0;
  const fvLump = calc ? calc.pv * Math.pow(1 + r, n) : 0;
  const fvAnnuity = calc ? (calc.pmt && r ? (calc.pmt * (Math.pow(1 + r, n) - 1)) / r : calc.pmt * n) : 0;
  const total = fvLump + fvAnnuity;

  return (
    <CalcShell meta={meta} about={<p>Future Value (FV) compounds today's amount and/or annual payments forward: FV = PV(1+r)^n + PMT x ((1+r)^n-1)/r.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Present value" required error={errors.pv}><Input type="number" value={inputs.pv} onChange={(e) => setInputs((p) => ({ ...p, pv: e.target.value }))} /></Field>
          <Field label="Annual contribution" error={errors.pmt}><Input type="number" value={inputs.pmt} onChange={(e) => setInputs((p) => ({ ...p, pmt: e.target.value }))} /></Field>
          <Field label="Annual rate" suffix="%" required error={errors.rate}><Input type="number" step="0.01" value={inputs.rate} onChange={(e) => setInputs((p) => ({ ...p, rate: e.target.value }))} /></Field>
          <Field label="Years" required error={errors.years}><Input type="number" value={inputs.years} onChange={(e) => setInputs((p) => ({ ...p, years: e.target.value }))} /></Field>
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
              <ResultStat highlight label="Future value" value={fmt(total)} />
              <ResultStat label="FV of lump sum" value={fmt(fvLump)} />
              <ResultStat label="FV of annuity" value={fmt(fvAnnuity)} />
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
