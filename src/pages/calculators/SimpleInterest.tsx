import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findCalc } from "@/data/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { validateAll } from "@/lib/validate";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const meta = findCalc("simple-interest")!;

interface Inputs { p: string; r: string; t: string }
interface Calc { p: number; r: number; t: number }

export default function SimpleInterest() {
  const { format: fmt } = useCurrency();
  const [inputs, setInputs] = useState<Inputs>({ p: "", r: "", t: "" });
  const [calc, setCalc] = useState<Calc | null>(null);

  const { errors } = validateAll(inputs, {
    p: { label: "Principal", required: true, min: 0 },
    r: { label: "Annual rate", required: true, min: -100, max: 100 },
    t: { label: "Time", required: true, min: 0, max: 200 },
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ p: Number(inputs.p), r: Number(inputs.r), t: Number(inputs.t) });
  };

  const data = useMemo(() => {
    if (!calc) return [] as { year: number; balance: number; interest: number }[];
    const arr = [{ year: 0, balance: calc.p, interest: 0 }];
    const wholeYears = Math.max(0, Math.floor(calc.t));
    for (let y = 1; y <= wholeYears; y++) {
      arr.push({ year: y, balance: calc.p + calc.p * (calc.r / 100) * y, interest: calc.p * (calc.r / 100) * y });
    }
    if (calc.t > wholeYears) {
      arr.push({ year: calc.t, balance: calc.p + calc.p * (calc.r / 100) * calc.t, interest: calc.p * (calc.r / 100) * calc.t });
    }
    return arr;
  }, [calc]);

  const interest = calc ? calc.p * (calc.r / 100) * calc.t : 0;
  const total = calc ? calc.p + interest : 0;

  return (
    <CalcShell meta={meta} about={<p>Simple interest is calculated only on the original principal: I = P x r x t. It does not compound.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <h2 className="text-lg font-semibold">Inputs</h2>
          <Field label="Principal" required error={errors.p}><Input type="number" value={inputs.p} onChange={(e) => setInputs((p) => ({ ...p, p: e.target.value }))} /></Field>
          <Field label="Annual rate" suffix="%" required error={errors.r}><Input type="number" step="0.01" value={inputs.r} onChange={(e) => setInputs((p) => ({ ...p, r: e.target.value }))} /></Field>
          <Field label="Time (years)" required error={errors.t}><Input type="number" value={inputs.t} onChange={(e) => setInputs((p) => ({ ...p, t: e.target.value }))} /></Field>
          <Button onClick={calculate}>Calculate</Button>
        </div>
        <div className="lg:col-span-3 space-y-4">
          {!calc ? (
            <div className="calc-card"><p className="text-sm text-muted-foreground">Fill the fields and click Calculate to view results.</p></div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-3">
                <ResultStat highlight label="Final balance" value={fmt(total)} />
                <ResultStat label="Interest earned" value={fmt(interest)} />
                <ResultStat label="Principal" value={fmt(calc.p)} />
              </div>
              <div className="calc-card">
                <h3 className="font-semibold mb-3">Balance over time</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(v: number) => fmt(v)} labelFormatter={(l) => `Year ${l}`} />
                      <Legend />
                      <Line type="monotone" dataKey="balance" stroke="hsl(var(--chart-2))" name="Balance" strokeWidth={2} />
                      <Line type="monotone" dataKey="interest" stroke="hsl(var(--chart-4))" name="Interest" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
