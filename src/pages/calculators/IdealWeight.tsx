import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findCalc } from "@/data/calculators";

const meta = findCalc("ideal-weight")!;
// Robinson, Miller, Devine, Hamwi formulas (kg). Inputs in cm.
function ideal(sex: "male" | "female", cm: number) {
  const inOver5ft = Math.max(0, (cm - 152.4) / 2.54);
  const m = sex === "male";
  return {
    Robinson: (m ? 52 : 49) + (m ? 1.9 : 1.7) * inOver5ft,
    Miller: (m ? 56.2 : 53.1) + (m ? 1.41 : 1.36) * inOver5ft,
    Devine: (m ? 50 : 45.5) + 2.3 * inOver5ft,
    Hamwi: (m ? 48 : 45.5) + (m ? 2.7 : 2.2) * inOver5ft,
  };
}

export default function IdealWeight() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [unit, setUnit] = useState<"metric" | "us">("metric");
  const [hCm, setHCm] = useState(175);
  const [hFt, setHFt] = useState(5);
  const [hIn, setHIn] = useState(9);

  const cm = unit === "metric" ? hCm : (hFt * 12 + hIn) * 2.54;
  const r = useMemo(() => ideal(sex, cm), [sex, cm]);
  const avg = (r.Robinson + r.Miller + r.Devine + r.Hamwi) / 4;
  const conv = (kg: number) => unit === "metric" ? `${kg.toFixed(1)} kg` : `${(kg / 0.453592).toFixed(1)} lb`;

  return (
    <CalcShell meta={meta} about={<p>The Ideal Body Weight (IBW) calculator returns four widely cited estimates (Robinson, Miller, Devine, Hamwi). They are clinical estimators only — body composition matters more than weight alone.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Sex">
            <Select value={sex} onValueChange={(v) => setSex(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Units">
            <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="metric">Metric (cm/kg)</SelectItem><SelectItem value="us">US (ft·in/lb)</SelectItem></SelectContent>
            </Select>
          </Field>
          {unit === "metric" ? (
            <Field label="Height" suffix="cm"><Input type="number" value={hCm} onChange={(e) => setHCm(+e.target.value || 0)} /></Field>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Field label="ft"><Input type="number" value={hFt} onChange={(e) => setHFt(+e.target.value || 0)} /></Field>
              <Field label="in"><Input type="number" value={hIn} onChange={(e) => setHIn(+e.target.value || 0)} /></Field>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <ResultStat highlight label="Average IBW" value={conv(avg)} hint="Across 4 standard formulas" />
          <div className="grid sm:grid-cols-2 gap-3">
            <ResultStat label="Robinson (1983)" value={conv(r.Robinson)} />
            <ResultStat label="Miller (1983)" value={conv(r.Miller)} />
            <ResultStat label="Devine (1974)" value={conv(r.Devine)} />
            <ResultStat label="Hamwi (1964)" value={conv(r.Hamwi)} />
          </div>
        </div>
      </div>
    </CalcShell>
  );
}
