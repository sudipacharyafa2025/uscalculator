import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findCalc } from "@/data/calculators";

const meta = findCalc("heart-rate")!;
const intensities = [
  { name: "Warm-up / recovery", lo: 0.50, hi: 0.60, color: "hsl(var(--chart-2))" },
  { name: "Fat burn", lo: 0.60, hi: 0.70, color: "hsl(var(--chart-3))" },
  { name: "Aerobic / cardio", lo: 0.70, hi: 0.80, color: "hsl(var(--chart-4))" },
  { name: "Anaerobic / threshold", lo: 0.80, hi: 0.90, color: "hsl(var(--chart-5))" },
  { name: "Maximum / VO₂ max", lo: 0.90, hi: 1.00, color: "hsl(var(--destructive))" },
];

export default function HeartRate() {
  const [age, setAge] = useState(30);
  const [resting, setResting] = useState(60);
  const [method, setMethod] = useState<"tanaka" | "fox" | "karvonen">("tanaka");

  const r = useMemo(() => {
    const tanaka = 208 - 0.7 * age;
    const fox = 220 - age;
    const max = method === "fox" ? fox : tanaka;
    return { tanaka, fox, max };
  }, [age, method]);

  const zone = (lo: number, hi: number) => method === "karvonen"
    ? `${Math.round((r.max - resting) * lo + resting)} – ${Math.round((r.max - resting) * hi + resting)} bpm`
    : `${Math.round(r.max * lo)} – ${Math.round(r.max * hi)} bpm`;

  return (
    <CalcShell meta={meta} about={<p>Estimates max heart rate (HRmax) and 5 training zones. Tanaka (208 − 0.7×age) is more accurate than Fox (220 − age) for most adults. Karvonen uses heart-rate reserve and requires resting HR.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <Field label="Age"><Input type="number" value={age} onChange={(e) => setAge(+e.target.value || 0)} /></Field>
          <Field label="Resting HR" suffix="bpm" hint="Used by Karvonen method"><Input type="number" value={resting} onChange={(e) => setResting(+e.target.value || 0)} /></Field>
          <Field label="Method">
            <Select value={method} onValueChange={(v) => setMethod(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tanaka">Tanaka (recommended)</SelectItem>
                <SelectItem value="fox">Fox (220 − age)</SelectItem>
                <SelectItem value="karvonen">Karvonen (HR reserve)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="lg:col-span-3 space-y-3">
          <ResultStat highlight label="Estimated max HR" value={`${Math.round(r.max)} bpm`} hint={`Tanaka ${Math.round(r.tanaka)} • Fox ${Math.round(r.fox)}`} />
          <div className="calc-card">
            <h3 className="font-semibold mb-3 text-sm">Training zones</h3>
            <div className="space-y-2">
              {intensities.map((z) => (
                <div key={z.name} className="flex items-center gap-3 p-2 rounded bg-muted/40">
                  <div className="w-44 text-sm font-medium">{z.name}</div>
                  <div className="flex-1 h-2 rounded-full" style={{ background: z.color }} />
                  <div className="text-xs font-mono text-muted-foreground w-44 text-right">{zone(z.lo, z.hi)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CalcShell>
  );
}
