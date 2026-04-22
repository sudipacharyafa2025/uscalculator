import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { findCalc } from "@/data/calculators";

const meta = findCalc("bac")!;
// Widmark formula
export default function BAC() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [wLb, setWLb] = useState(160);
  const [drinks, setDrinks] = useState(3);
  const [oz, setOz] = useState(1.5);
  const [pct, setPct] = useState(40);
  const [hours, setHours] = useState(2);

  const r = useMemo(() => {
    const grams = drinks * oz * 29.5735 * (pct / 100) * 0.789;
    const kg = wLb * 0.453592;
    const widmark = sex === "male" ? 0.68 : 0.55;
    const bac = (grams / (kg * 1000 * widmark)) * 100;
    const eliminated = 0.015 * hours;
    const current = Math.max(0, bac - eliminated);
    return { peak: bac, current };
  }, [sex, wLb, drinks, oz, pct, hours]);

  let level = "Sober", color = "hsl(var(--chart-2))";
  if (r.current >= 0.08) { level = "Legally impaired (US)"; color = "hsl(var(--destructive))"; }
  else if (r.current >= 0.04) { level = "Significantly impaired"; color = "hsl(20 90% 55%)"; }
  else if (r.current >= 0.02) { level = "Mildly impaired"; color = "hsl(var(--chart-4))"; }

  return (
    <CalcShell meta={meta} about={<p>Estimates Blood Alcohol Content using the Widmark formula. <strong>This is an estimate only — never use it to decide whether to drive.</strong> Many factors (food, medication, individual physiology) affect actual BAC.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sex">
              <Select value={sex} onValueChange={(v) => setSex(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
              </Select>
            </Field>
            <Field label="Body weight" suffix="lb"><Input type="number" value={wLb} onChange={(e) => setWLb(+e.target.value || 0)} /></Field>
          </div>
          <Field label="Number of drinks"><Input type="number" value={drinks} onChange={(e) => setDrinks(+e.target.value || 0)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Drink size" suffix="oz"><Input type="number" step="0.1" value={oz} onChange={(e) => setOz(+e.target.value || 0)} /></Field>
            <Field label="ABV" suffix="%"><Input type="number" value={pct} onChange={(e) => setPct(+e.target.value || 0)} /></Field>
          </div>
          <Field label="Hours since first drink"><Input type="number" step="0.25" value={hours} onChange={(e) => setHours(+e.target.value || 0)} /></Field>
        </div>
        <div className="lg:col-span-3 space-y-3">
          <div className="calc-card">
            <div className="text-xs uppercase text-muted-foreground">Estimated current BAC</div>
            <div className="flex items-end gap-3 mt-1">
              <div className="text-5xl font-bold text-primary">{r.current.toFixed(3)}%</div>
              <Badge className="border-0" style={{ background: color, color: "white" }}>{level}</Badge>
            </div>
          </div>
          <ResultStat label="Peak BAC (no metabolism)" value={`${r.peak.toFixed(3)}%`} />
          <ResultStat label="Time to fully sober" value={`${(r.current / 0.015).toFixed(1)} hours`} hint="At 0.015%/hr elimination" />
        </div>
      </div>
    </CalcShell>
  );
}
