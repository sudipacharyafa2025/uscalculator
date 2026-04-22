import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findCalc } from "@/data/calculators";

const meta = findCalc("lean-body-mass")!;
function lbm(sex: "male" | "female", cm: number, kg: number) {
  // Boer (1984), James (1976), Hume (1966)
  const m = sex === "male";
  const boer = m ? 0.407 * kg + 0.267 * cm - 19.2 : 0.252 * kg + 0.473 * cm - 48.3;
  const james = m
    ? 1.1 * kg - 128 * Math.pow(kg / cm, 2)
    : 1.07 * kg - 148 * Math.pow(kg / cm, 2);
  const hume = m ? 0.32810 * kg + 0.33929 * cm - 29.5336 : 0.29569 * kg + 0.41813 * cm - 43.2933;
  return { boer, james, hume };
}

export default function LeanBodyMass() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [hCm, setHCm] = useState(175);
  const [wKg, setWKg] = useState(72);
  const r = useMemo(() => lbm(sex, hCm, wKg), [sex, hCm, wKg]);
  const avg = (r.boer + r.james + r.hume) / 3;
  const fatPct = ((wKg - avg) / wKg) * 100;
  return (
    <CalcShell meta={meta} about={<p>Lean Body Mass (LBM) is total weight minus fat mass. Useful for medication dosing, nutrition planning and tracking body recomposition.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Sex">
            <Select value={sex} onValueChange={(v) => setSex(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Height" suffix="cm"><Input type="number" value={hCm} onChange={(e) => setHCm(+e.target.value || 0)} /></Field>
          <Field label="Weight" suffix="kg"><Input type="number" value={wKg} onChange={(e) => setWKg(+e.target.value || 0)} /></Field>
        </div>
        <div className="space-y-3">
          <ResultStat highlight label="Average LBM" value={`${avg.toFixed(1)} kg`} hint={`Estimated ~${fatPct.toFixed(1)}% body fat`} />
          <ResultStat label="Boer" value={`${r.boer.toFixed(1)} kg`} />
          <ResultStat label="James" value={`${r.james.toFixed(1)} kg`} />
          <ResultStat label="Hume" value={`${r.hume.toFixed(1)} kg`} />
        </div>
      </div>
    </CalcShell>
  );
}
