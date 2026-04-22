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

const meta = findCalc("present-value")!;

interface Inputs {
  fv: string;
  rate: string;
  years: string;
  pmt: string;
}

interface Calc {
  fv: number;
  rate: number;
  years: number;
  pmt: number;
}

export default function PresentValue() {
  const { format: fmt } = useCurrency();
  const [inputs, setInputs] = useState<Inputs>({ fv: "", rate: "", years: "", pmt: "" });
  const [calc, setCalc] = useState<Calc | null>(null);

  const { errors } = validateAll(inputs, {
    fv: { label: "Future value", required: true, min: 0 },
    pmt: { label: "Annual payment", min: 0 },
    rate: { label: "Discount rate", required: true, min: -100, max: 100 },
    years: { label: "Years", required: true, min: 0, max: 200 },
  });

  const { share } = useScenarioUrl(inputs, (s) => {
    const next: Partial<Inputs> = {};
    if (typeof s.fv === "number" || typeof s.fv === "string") next.fv = String(s.fv);
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
    setCalc({ fv: Number(inputs.fv), rate: Number(inputs.rate), years: Number(inputs.years), pmt: Number(inputs.pmt || 0) });
  };

  const r = calc ? calc.rate / 100 : 0;
  const n = calc?.years ?? 0;
  const pvLump = calc ? calc.fv / Math.pow(1 + r, n) : 0;
  const pvAnnuity = calc ? (calc.pmt && r ? (calc.pmt * (1 - Math.pow(1 + r, -n))) / r : calc.pmt * n) : 0;
  const total = pvLump + pvAnnuity;

  return (
    <CalcShell meta={meta} about={<p>Present Value (PV) discounts a future amount and/or annuity stream back to today's value: PV = FV / (1+r)^n + PMT x (1-(1+r)^-n)/r.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Future value (lump sum)" required error={errors.fv}><Input type="number" value={inputs.fv} onChange={(e) => setInputs((p) => ({ ...p, fv: e.target.value }))} /></Field>
          <Field label="Annual payment (optional)" error={errors.pmt}><Input type="number" value={inputs.pmt} onChange={(e) => setInputs((p) => ({ ...p, pmt: e.target.value }))} /></Field>
          <Field label="Discount rate" suffix="%" required error={errors.rate}><Input type="number" step="0.01" value={inputs.rate} onChange={(e) => setInputs((p) => ({ ...p, rate: e.target.value }))} /></Field>
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
              <ResultStat highlight label="Present value" value={fmt(total)} />
              <ResultStat label="PV of lump sum" value={fmt(pvLump)} />
              <ResultStat label="PV of annuity" value={fmt(pvAnnuity)} />
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
