import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findCalc } from "@/data/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { monthlyRateFromApy } from "@/lib/calculators";
import { validateAll } from "@/lib/validate";
import { FINANCE_MAX_RATE_PCT, FINANCE_MAX_YEARS } from "@/lib/financeBounds";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const meta = findCalc("savings")!;

interface Inputs { start: string; monthly: string; rate: string; years: string }
interface Calc { start: number; monthly: number; rate: number; years: number }

export default function Savings() {
  const { format: fmt } = useCurrency();
  const [inputs, setInputs] = useState<Inputs>({ start: "", monthly: "", rate: "", years: "" });
  const [calc, setCalc] = useState<Calc | null>(null);

  const { errors } = validateAll(inputs, {
    start: { label: "Starting amount", required: true, min: 0 },
    monthly: { label: "Monthly deposit", min: 0 },
    rate: { label: "APY", required: true, min: 0, max: FINANCE_MAX_RATE_PCT },
    years: { label: "Years", required: true, min: 1, max: FINANCE_MAX_YEARS, integer: true },
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({
      start: Number(inputs.start),
      monthly: Number(inputs.monthly || 0),
      rate: Number(inputs.rate),
      years: Number(inputs.years),
    });
  };

  const data = useMemo(() => {
    if (!calc) return [] as { year: number; balance: number; contributions: number; interest: number }[];
    const r = monthlyRateFromApy(calc.rate);
    let bal = calc.start;
    let contrib = calc.start;
    const out = [{ year: 0, balance: bal, contributions: contrib, interest: 0 }];
    for (let y = 1; y <= calc.years; y++) {
      for (let m = 0; m < 12; m++) {
        bal = bal * (1 + r) + calc.monthly;
        contrib += calc.monthly;
      }
      out.push({ year: y, balance: bal, contributions: contrib, interest: bal - contrib });
    }
    return out;
  }, [calc]);

  const last = data[data.length - 1];

  return (
    <CalcShell meta={meta} about={<p>Project the growth of a savings account or HYSA with regular monthly deposits, compounded monthly.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <h2 className="text-lg font-semibold">Inputs</h2>
          <Field label="Starting amount" required error={errors.start}><Input type="number" value={inputs.start} onChange={(e) => setInputs((p) => ({ ...p, start: e.target.value }))} /></Field>
          <Field label="Monthly deposit" error={errors.monthly}><Input type="number" value={inputs.monthly} onChange={(e) => setInputs((p) => ({ ...p, monthly: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="APY" suffix="%" required error={errors.rate}><Input type="number" step="0.01" value={inputs.rate} onChange={(e) => setInputs((p) => ({ ...p, rate: e.target.value }))} /></Field>
            <Field label="Years" required error={errors.years}><Input type="number" step="1" value={inputs.years} onChange={(e) => setInputs((p) => ({ ...p, years: e.target.value }))} /></Field>
          </div>
          <Button onClick={calculate}>Calculate</Button>
        </div>
        <div className="lg:col-span-3 space-y-4">
          {!calc || !last ? (
            <div className="calc-card"><p className="text-sm text-muted-foreground">Fill the fields and click Calculate to view results.</p></div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-3">
                <ResultStat highlight label="Final balance" value={fmt(last.balance)} />
                <ResultStat label="Total deposits" value={fmt(last.contributions)} />
                <ResultStat label="Interest earned" value={fmt(last.interest)} />
              </div>
              <div className="calc-card">
                <div className="h-72">
                  <ResponsiveContainer>
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(v: number) => fmt(v)} labelFormatter={(l) => `Year ${l}`} />
                      <Legend />
                      <Line type="monotone" dataKey="balance" stroke="hsl(var(--chart-2))" name="Balance" strokeWidth={2} />
                      <Line type="monotone" dataKey="contributions" stroke="hsl(var(--chart-1))" name="Contributions" strokeWidth={2} />
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
