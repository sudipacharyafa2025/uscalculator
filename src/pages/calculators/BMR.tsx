import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findCalc } from "@/data/calculators";

const meta = findCalc("bmr")!;

export default function BMR() {
  const [sex, setSex] = useState<"male" | "female">("male");
  const [age, setAge] = useState(30);
  const [unit, setUnit] = useState<"metric" | "us">("metric");
  const [hCm, setHCm] = useState(175);
  const [wKg, setWKg] = useState(72);
  const [hFt, setHFt] = useState(5);
  const [hIn, setHIn] = useState(9);
  const [wLb, setWLb] = useState(160);
  const [formula, setFormula] = useState<"mifflin" | "harris" | "katch">("mifflin");
  const [bf, setBf] = useState(20);

  const r = useMemo(() => {
    const cm = unit === "metric" ? hCm : (hFt * 12 + hIn) * 2.54;
    const kg = unit === "metric" ? wKg : wLb * 0.453592;
    const lean = kg * (1 - bf / 100);
    const mifflin = 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);
    const harris = sex === "male"
      ? 88.362 + 13.397 * kg + 4.799 * cm - 5.677 * age
      : 447.593 + 9.247 * kg + 3.098 * cm - 4.330 * age;
    const katch = 370 + 21.6 * lean;
    return { mifflin, harris, katch, value: formula === "mifflin" ? mifflin : formula === "harris" ? harris : katch };
  }, [sex, age, unit, hCm, wKg, hFt, hIn, wLb, formula, bf]);

  return (
    <CalcShell meta={meta} about={<p>BMR (Basal Metabolic Rate) is the calories your body burns at complete rest to keep vital organs running. The Mifflin–St Jeor equation is the modern standard; Harris–Benedict and Katch–McArdle (which needs body-fat %) are also widely used.</p>}>
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
          {unit === "metric" ? (<>
            <Field label="Height" suffix="cm"><Input type="number" value={hCm} onChange={(e) => setHCm(+e.target.value || 0)} /></Field>
            <Field label="Weight" suffix="kg"><Input type="number" value={wKg} onChange={(e) => setWKg(+e.target.value || 0)} /></Field>
          </>) : (<>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Height (ft)"><Input type="number" value={hFt} onChange={(e) => setHFt(+e.target.value || 0)} /></Field>
              <Field label="Height (in)"><Input type="number" value={hIn} onChange={(e) => setHIn(+e.target.value || 0)} /></Field>
            </div>
            <Field label="Weight" suffix="lb"><Input type="number" value={wLb} onChange={(e) => setWLb(+e.target.value || 0)} /></Field>
          </>)}
          <Field label="Formula">
            <Select value={formula} onValueChange={(v) => setFormula(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mifflin">Mifflin–St Jeor (recommended)</SelectItem>
                <SelectItem value="harris">Harris–Benedict (revised)</SelectItem>
                <SelectItem value="katch">Katch–McArdle (needs BF%)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {formula === "katch" && <Field label="Body fat" suffix="%"><Input type="number" value={bf} onChange={(e) => setBf(+e.target.value || 0)} /></Field>}
        </div>
        <div className="lg:col-span-3 space-y-3">
          <ResultStat highlight label={`BMR (${formula})`} value={`${Math.round(r.value)} kcal/day`} hint="Calories burned at complete rest" />
          <div className="grid sm:grid-cols-3 gap-3">
            <ResultStat label="Mifflin–St Jeor" value={`${Math.round(r.mifflin)} kcal`} />
            <ResultStat label="Harris–Benedict" value={`${Math.round(r.harris)} kcal`} />
            <ResultStat label="Katch–McArdle" value={`${Math.round(r.katch)} kcal`} />
          </div>
        </div>
      </div>
    </CalcShell>
  );
}
