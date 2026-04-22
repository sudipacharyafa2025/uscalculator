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

const meta = findCalc("credit-card")!;

type Strategy = "min" | "fixed";

interface Inputs {
  balance: string;
  apr: string;
  fixed: string;
}

interface Calc {
  balance: number;
  apr: number;
  fixed: number;
  strategy: Strategy;
}

export default function CreditCard() {
  const { format: fmt } = useCurrency();
  const [inputs, setInputs] = useState<Inputs>({ balance: "", apr: "", fixed: "" });
  const [strategy, setStrategy] = useState<Strategy>("fixed");
  const [calc, setCalc] = useState<Calc | null>(null);

  const { errors } = validateAll(inputs, {
    balance: { label: "Current balance", required: true, min: 0.01 },
    apr: { label: "APR", required: true, min: 0, max: 100 },
    fixed: {
      label: "Fixed payment",
      min: 0,
      custom: (n) => (strategy === "fixed" && n <= 0 ? "Fixed payment must be greater than 0" : null),
    },
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({
      balance: Number(inputs.balance),
      apr: Number(inputs.apr),
      fixed: Number(inputs.fixed || 0),
      strategy,
    });
  };

  const schedule = useMemo(() => {
    if (!calc) return [] as { month: number; payment: number; interest: number; balance: number }[];
    const r = calc.apr / 100 / 12;
    const rows: { month: number; payment: number; interest: number; balance: number }[] = [];
    let bal = calc.balance;
    for (let m = 1; m <= 1200 && bal > 0.005; m++) {
      const interest = bal * r;
      const pay = calc.strategy === "min" ? Math.max(25, bal * 0.02 + interest) : Math.min(calc.fixed, bal + interest);
      if (pay <= interest) {
        rows.push({ month: m, payment: pay, interest, balance: bal + interest - pay });
        if (m >= 600) break;
        continue;
      }
      bal = bal + interest - pay;
      rows.push({ month: m, payment: pay, interest, balance: Math.max(bal, 0) });
    }
    return rows;
  }, [calc]);

  const monthlyRate = calc ? calc.apr / 100 / 12 : 0;
  const fixedTooLow = calc ? calc.strategy === "fixed" && calc.fixed <= calc.balance * monthlyRate + 0.01 : false;
  const nonAmortizing = calc ? calc.strategy === "min" ? false : fixedTooLow : false;
  const totalInterest = schedule.reduce((s, x) => s + x.interest, 0);
  const months = schedule.length;
  const chart = schedule.filter((_, i) => i % 3 === 0);

  return (
    <CalcShell meta={meta} about={<p>Estimate how long it will take to pay off a credit card. Minimum payment uses 2% of balance + monthly interest, $25 floor - typical for U.S. cards.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <Field label="Current balance" required error={errors.balance}><Input type="number" value={inputs.balance} onChange={(e) => setInputs((p) => ({ ...p, balance: e.target.value }))} /></Field>
          <Field label="APR" suffix="%" required error={errors.apr}><Input type="number" step="0.01" value={inputs.apr} onChange={(e) => setInputs((p) => ({ ...p, apr: e.target.value }))} /></Field>
          <Field label="Payment strategy">
            <div className="flex gap-2">
              <button type="button" onClick={() => setStrategy("min")} className={`flex-1 px-3 py-2 rounded-md border text-sm ${strategy === "min" ? "bg-accent text-accent-foreground border-accent" : "border-border"}`}>Minimum</button>
              <button type="button" onClick={() => setStrategy("fixed")} className={`flex-1 px-3 py-2 rounded-md border text-sm ${strategy === "fixed" ? "bg-accent text-accent-foreground border-accent" : "border-border"}`}>Fixed</button>
            </div>
          </Field>
          {strategy === "fixed" && <Field label="Fixed monthly payment" required error={errors.fixed}><Input type="number" value={inputs.fixed} onChange={(e) => setInputs((p) => ({ ...p, fixed: e.target.value }))} /></Field>}
          <Button onClick={calculate}>Calculate</Button>
        </div>
        <div className="lg:col-span-3 space-y-4">
          {!calc ? (
            <div className="calc-card"><p className="text-sm text-muted-foreground">Fill the fields and click Calculate to view results.</p></div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-3">
                <ResultStat highlight label="Payoff time" value={nonAmortizing ? "Never" : `${Math.floor(months / 12)}y ${months % 12}m`} />
                <ResultStat label="Total interest" value={fmt(totalInterest)} />
                <ResultStat label="Total paid" value={fmt(calc.balance + totalInterest)} />
              </div>
              {nonAmortizing && <p className="text-sm text-destructive">Fixed payment is below monthly interest ({fmt(calc.balance * monthlyRate)}), so the balance will not be paid off.</p>}
              <div className="calc-card">
                <h3 className="font-semibold mb-3">Balance over time</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <LineChart data={chart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(v: number) => fmt(v)} labelFormatter={(l) => `Month ${l}`} />
                      <Legend />
                      <Line type="monotone" dataKey="balance" stroke="hsl(var(--chart-1))" name="Balance" strokeWidth={2} dot={false} />
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
