import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findCalc } from "@/data/calculators";

const meta = findCalc("calorie")!;

const activity = [
  { v: 1.2, l: "Sedentary (little exercise)" },
  { v: 1.375, l: "Light (1–3×/week)" },
  { v: 1.55, l: "Moderate (3–5×/week)" },
  { v: 1.725, l: "Very active (6–7×/week)" },
  { v: 1.9, l: "Extra active (athlete)" },
];

export default function Calorie() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(30);
  const [unit, setUnit] = useState<"metric" | "us">("metric");
  const [hCm, setHCm] = useState(175);
  const [wKg, setWKg] = useState(72);
  const [hFt, setHFt] = useState(5);
  const [hIn, setHIn] = useState(9);
  const [wLb, setWLb] = useState(160);
  const [act, setAct] = useState(1.55);

  const { bmr, tdee } = useMemo(() => {
    const cm = unit === "metric" ? hCm : (hFt * 12 + hIn) * 2.54;
    const kg = unit === "metric" ? wKg : wLb * 0.453592;
    const base = 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);
    return { bmr: base, tdee: base * act };
  }, [sex, age, unit, hCm, wKg, hFt, hIn, wLb, act]);

  return (
    <CalcShell meta={meta} about={<p>Uses the Mifflin–St Jeor equation to estimate Basal Metabolic Rate (BMR), then multiplies by an activity factor for Total Daily Energy Expenditure (TDEE). To lose weight, eat 500 kcal/day below TDEE for ~1 lb/week loss.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Sex">
              <Select value={sex} onValueChange={(v) => setSex(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
              </Select>
            </Field>
            <Field label="Age"><Input type="number" value={age} onChange={(e) => setAge(+e.target.value || 0)} /></Field>
          </div>
          <Tabs value={unit} onValueChange={(v) => setUnit(v as any)}>
            <TabsList className="w-full"><TabsTrigger value="metric" className="flex-1">Metric</TabsTrigger><TabsTrigger value="us" className="flex-1">US</TabsTrigger></TabsList>
          </Tabs>
          {unit === "metric" ? (
            <>
              <Field label="Height" suffix="cm"><Input type="number" value={hCm} onChange={(e) => setHCm(+e.target.value || 0)} /></Field>
              <Field label="Weight" suffix="kg"><Input type="number" value={wKg} onChange={(e) => setWKg(+e.target.value || 0)} /></Field>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Height (ft)"><Input type="number" value={hFt} onChange={(e) => setHFt(+e.target.value || 0)} /></Field>
                <Field label="Height (in)"><Input type="number" value={hIn} onChange={(e) => setHIn(+e.target.value || 0)} /></Field>
              </div>
              <Field label="Weight" suffix="lb"><Input type="number" value={wLb} onChange={(e) => setWLb(+e.target.value || 0)} /></Field>
            </>
          )}
          <Field label="Activity level">
            <Select value={String(act)} onValueChange={(v) => setAct(+v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{activity.map((a) => <SelectItem key={a.v} value={String(a.v)}>{a.l}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <ResultStat highlight label="Maintenance (TDEE)" value={`${Math.round(tdee)} kcal/day`} />
            <ResultStat label="BMR" value={`${Math.round(bmr)} kcal/day`} />
            <ResultStat label="Mild weight loss" value={`${Math.round(tdee - 250)} kcal/day`} hint="−0.5 lb/week" />
            <ResultStat label="Weight loss" value={`${Math.round(tdee - 500)} kcal/day`} hint="−1 lb/week" />
            <ResultStat label="Weight gain" value={`${Math.round(tdee + 500)} kcal/day`} hint="+1 lb/week" />
            <ResultStat label="Extreme loss" value={`${Math.round(tdee - 1000)} kcal/day`} hint="−2 lb/week" />
          </div>
        </div>
      </div>
    </CalcShell>
  );
}
