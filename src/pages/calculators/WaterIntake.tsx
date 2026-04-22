import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { findCalc } from "@/data/calculators";

const meta = findCalc("water-intake")!;

export default function WaterIntake() {
  const [unit, setUnit] = useState<"metric" | "us">("metric");
  const [wKg, setWKg] = useState(72);
  const [wLb, setWLb] = useState(160);
  const [exerciseMin, setExerciseMin] = useState(30);
  const [climate, setClimate] = useState<"normal" | "hot">("normal");

  const r = useMemo(() => {
    const kg = unit === "metric" ? wKg : wLb * 0.453592;
    let mlPerKg = 35;
    if (climate === "hot") mlPerKg += 5;
    const baseMl = mlPerKg * kg;
    const exerciseMl = (exerciseMin / 30) * 350;
    const totalMl = baseMl + exerciseMl;
    return {
      ml: totalMl, l: totalMl / 1000, oz: totalMl / 29.5735, cups: totalMl / 240,
      glassesIso: Math.round(totalMl / 250),
    };
  }, [unit, wKg, wLb, exerciseMin, climate]);

  return (
    <CalcShell meta={meta} about={<p>Daily water needs depend on body mass, exercise volume and climate. A common guideline is 30–35 ml/kg body weight, plus ~350 ml per 30 minutes of exercise.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Units">
            <select className="w-full h-10 rounded-md border border-input bg-background px-3" value={unit} onChange={(e) => setUnit(e.target.value as any)}>
              <option value="metric">Metric (kg)</option><option value="us">US (lb)</option>
            </select>
          </Field>
          {unit === "metric"
            ? <Field label="Weight" suffix="kg"><Input type="number" value={wKg} onChange={(e) => setWKg(+e.target.value || 0)} /></Field>
            : <Field label="Weight" suffix="lb"><Input type="number" value={wLb} onChange={(e) => setWLb(+e.target.value || 0)} /></Field>}
          <Field label="Daily exercise" suffix="min"><Input type="number" value={exerciseMin} onChange={(e) => setExerciseMin(+e.target.value || 0)} /></Field>
          <Field label="Climate">
            <select className="w-full h-10 rounded-md border border-input bg-background px-3" value={climate} onChange={(e) => setClimate(e.target.value as any)}>
              <option value="normal">Temperate</option><option value="hot">Hot / humid</option>
            </select>
          </Field>
        </div>
        <div className="space-y-3">
          <ResultStat highlight label="Recommended intake" value={`${r.l.toFixed(1)} L / day`} hint={`${r.oz.toFixed(0)} fl oz`} />
          <ResultStat label="Cups (240 ml)" value={`${r.cups.toFixed(1)} cups`} />
          <ResultStat label="Standard 250 ml glasses" value={`${r.glassesIso} glasses`} />
        </div>
      </div>
    </CalcShell>
  );
}
