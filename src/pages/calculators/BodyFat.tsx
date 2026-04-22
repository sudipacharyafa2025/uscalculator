import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findCalc } from "@/data/calculators";

const meta = findCalc("body-fat")!;

// US Navy method
export default function BodyFat() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [hCm, setHCm] = useState(175);
  const [neck, setNeck] = useState(38);
  const [waist, setWaist] = useState(85);
  const [hip, setHip] = useState(95);
  const [wKg, setWKg] = useState(72);

  const bf = useMemo(() => {
    if (sex === "male") {
      if (waist <= neck) return NaN;
      return 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(hCm)) - 450;
    }
    if (waist + hip <= neck) return NaN;
    return 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(hCm)) - 450;
  }, [sex, hCm, neck, waist, hip]);

  const fatMass = (wKg * bf) / 100;
  const lean = wKg - fatMass;

  const cats = sex === "male"
    ? [["Essential fat", 2, 5], ["Athletes", 6, 13], ["Fitness", 14, 17], ["Average", 18, 24], ["Obese", 25, 100]]
    : [["Essential fat", 10, 13], ["Athletes", 14, 20], ["Fitness", 21, 24], ["Average", 25, 31], ["Obese", 32, 100]];
  const cat = (cats.find(([, , h]) => bf <= (h as number)) || cats[cats.length - 1])[0];

  return (
    <CalcShell meta={meta} about={<p>Estimates body fat using the U.S. Navy circumference method. Measure neck, waist (and hips for women) at relaxed posture, in centimeters.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <Field label="Sex">
            <Select value={sex} onValueChange={(v) => setSex(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Height" suffix="cm"><Input type="number" value={hCm} onChange={(e) => setHCm(+e.target.value || 0)} /></Field>
            <Field label="Weight" suffix="kg"><Input type="number" value={wKg} onChange={(e) => setWKg(+e.target.value || 0)} /></Field>
          </div>
          <Field label="Neck" suffix="cm"><Input type="number" value={neck} onChange={(e) => setNeck(+e.target.value || 0)} /></Field>
          <Field label="Waist" suffix="cm"><Input type="number" value={waist} onChange={(e) => setWaist(+e.target.value || 0)} /></Field>
          {sex === "female" && <Field label="Hip" suffix="cm"><Input type="number" value={hip} onChange={(e) => setHip(+e.target.value || 0)} /></Field>}
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <ResultStat highlight label="Body fat" value={isFinite(bf) ? `${bf.toFixed(1)}%` : "—"} hint={isFinite(bf) ? String(cat) : "Check measurements"} />
            <ResultStat label="Category" value={isFinite(bf) ? String(cat) : "—"} />
            <ResultStat label="Fat mass" value={isFinite(bf) ? `${fatMass.toFixed(1)} kg` : "—"} />
            <ResultStat label="Lean mass" value={isFinite(bf) ? `${lean.toFixed(1)} kg` : "—"} />
          </div>
        </div>
      </div>
    </CalcShell>
  );
}
