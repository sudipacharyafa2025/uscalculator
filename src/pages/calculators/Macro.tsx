import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { findCalc } from "@/data/calculators";

const meta = findCalc("macro")!;

const goals = {
  maintain: { p: 0.30, c: 0.40, f: 0.30, mod: 1.0, label: "Maintain" },
  cut: { p: 0.40, c: 0.35, f: 0.25, mod: 0.8, label: "Fat loss" },
  bulk: { p: 0.30, c: 0.45, f: 0.25, mod: 1.15, label: "Lean gain" },
  keto: { p: 0.25, c: 0.05, f: 0.70, mod: 1.0, label: "Keto" },
};

export default function Macro() {
  const [tdee, setTdee] = useState(2400);
  const [goal, setGoal] = useState<keyof typeof goals>("maintain");
  const [proteinPct, setProteinPct] = useState<number>(30);

  const r = useMemo(() => {
    const g = goals[goal];
    const cals = tdee * g.mod;
    const pPct = proteinPct / 100;
    const remaining = 1 - pPct;
    const cRatio = g.c / (g.c + g.f);
    const cPct = remaining * cRatio;
    const fPct = remaining * (1 - cRatio);
    return {
      cals,
      protein: { g: Math.round((cals * pPct) / 4), kcal: Math.round(cals * pPct), pct: Math.round(pPct * 100) },
      carbs: { g: Math.round((cals * cPct) / 4), kcal: Math.round(cals * cPct), pct: Math.round(cPct * 100) },
      fat: { g: Math.round((cals * fPct) / 9), kcal: Math.round(cals * fPct), pct: Math.round(fPct * 100) },
    };
  }, [tdee, goal, proteinPct]);

  return (
    <CalcShell meta={meta} about={<p>Splits your daily calories into grams of protein, carbohydrates and fat using your goal-adjusted calorie target. Protein = 4 kcal/g, carbs = 4 kcal/g, fat = 9 kcal/g.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Daily calories (TDEE)" suffix="kcal"><Input type="number" value={tdee} onChange={(e) => setTdee(+e.target.value || 0)} /></Field>
          <Field label="Goal">
            <Select value={goal} onValueChange={(v) => setGoal(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(goals).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <div>
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Protein share</span><span className="font-medium text-foreground">{proteinPct}%</span>
            </div>
            <Slider value={[proteinPct]} min={15} max={50} step={5} onValueChange={(v) => setProteinPct(v[0])} />
          </div>
        </div>
        <div className="space-y-3">
          <ResultStat highlight label="Adjusted calories" value={`${Math.round(r.cals)} kcal`} hint={goals[goal].label} />
          <div className="grid sm:grid-cols-3 gap-3">
            <ResultStat label={`Protein (${r.protein.pct}%)`} value={`${r.protein.g} g`} hint={`${r.protein.kcal} kcal`} />
            <ResultStat label={`Carbs (${r.carbs.pct}%)`} value={`${r.carbs.g} g`} hint={`${r.carbs.kcal} kcal`} />
            <ResultStat label={`Fat (${r.fat.pct}%)`} value={`${r.fat.g} g`} hint={`${r.fat.kcal} kcal`} />
          </div>
        </div>
      </div>
    </CalcShell>
  );
}
