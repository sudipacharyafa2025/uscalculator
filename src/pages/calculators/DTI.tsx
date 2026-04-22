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

const meta = findCalc("dti")!;

interface Inputs {
  income: string;
  housing: string;
  other: string;
}

interface Calc {
  income: number;
  housing: number;
  other: number;
}

export default function DTI() {
  const { format: fmt } = useCurrency();
  const [inputs, setInputs] = useState<Inputs>({ income: "", housing: "", other: "" });
  const [calc, setCalc] = useState<Calc | null>(null);

  const { errors } = validateAll(inputs, {
    income: { label: "Gross monthly income", required: true, min: 0.01 },
    housing: { label: "Housing costs", min: 0 },
    other: { label: "Other debt payments", min: 0 },
  });

  const { share } = useScenarioUrl(inputs, (s) => {
    const next: Partial<Inputs> = {};
    if (typeof s.income === "number" || typeof s.income === "string") next.income = String(s.income);
    if (typeof s.housing === "number" || typeof s.housing === "string") next.housing = String(s.housing);
    if (typeof s.other === "number" || typeof s.other === "string") next.other = String(s.other);
    setInputs((p) => ({ ...p, ...next }));
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({
      income: Number(inputs.income),
      housing: Number(inputs.housing || 0),
      other: Number(inputs.other || 0),
    });
  };

  const totalDebt = calc ? calc.housing + calc.other : 0;
  const front = calc && calc.income > 0 ? (calc.housing / calc.income) * 100 : 0;
  const back = calc && calc.income > 0 ? (totalDebt / calc.income) * 100 : 0;
  const verdict = back < 36 ? "Healthy" : back < 43 ? "Acceptable" : back < 50 ? "Stretched" : "High risk";

  return (
    <CalcShell meta={meta} about={<p>Debt-to-Income (DTI) ratio is your monthly debt obligations divided by gross monthly income. Lenders generally prefer back-end DTI under 36-43%.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Gross monthly income" required error={errors.income}><Input type="number" value={inputs.income} onChange={(e) => setInputs((p) => ({ ...p, income: e.target.value }))} /></Field>
          <Field label="Housing costs (rent/PITI)" error={errors.housing}><Input type="number" value={inputs.housing} onChange={(e) => setInputs((p) => ({ ...p, housing: e.target.value }))} /></Field>
          <Field label="Other monthly debt payments" error={errors.other}><Input type="number" value={inputs.other} onChange={(e) => setInputs((p) => ({ ...p, other: e.target.value }))} /></Field>
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
              <ResultStat highlight label="Back-end DTI" value={`${back.toFixed(1)}%`} hint={verdict} />
              <ResultStat label="Front-end DTI (housing only)" value={`${front.toFixed(1)}%`} />
              <ResultStat label="Total monthly debt" value={fmt(totalDebt)} />
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
