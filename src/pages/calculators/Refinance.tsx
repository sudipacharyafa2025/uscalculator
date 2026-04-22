import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findCalc } from "@/data/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { monthlyPayment, buildAmortization } from "@/lib/calculators";
import { validateAll } from "@/lib/validate";
import { FINANCE_MAX_RATE_PCT, FINANCE_MAX_YEARS } from "@/lib/financeBounds";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import ShareScenario from "@/components/ShareScenario";
import { useScenarioUrl } from "@/lib/scenario";

const meta = findCalc("refinance")!;
export default function Refinance() {
  const { format: fmt } = useCurrency();
  const [balance, setBalance] = useState(250000);
  const [oldRate, setOldRate] = useState(6.5);
  const [oldRem, setOldRem] = useState(25);
  const [newRate, setNewRate] = useState(5.25);
  const [newTerm, setNewTerm] = useState(25);
  const [costs, setCosts] = useState(4000);
  const [calc, setCalc] = useState<{ balance: number; oldRate: number; oldRem: number; newRate: number; newTerm: number; costs: number } | null>(null);

  const { errors } = validateAll(
    { balance, oldRate, oldRem, newRate, newTerm, costs },
    {
      balance: { label: "Current balance", required: true, min: 0.01 },
      oldRate: { label: "Current rate", required: true, min: 0, max: FINANCE_MAX_RATE_PCT },
      oldRem: { label: "Years remaining", required: true, min: 1, max: FINANCE_MAX_YEARS, integer: true },
      newRate: { label: "New rate", required: true, min: 0, max: FINANCE_MAX_RATE_PCT },
      newTerm: { label: "New term", required: true, min: 1, max: FINANCE_MAX_YEARS, integer: true },
      costs: { label: "Closing costs", min: 0 },
    },
  );

  const { share } = useScenarioUrl(
    { balance, oldRate, oldRem, newRate, newTerm, costs },
    (s) => {
      if (typeof s.balance === "number") setBalance(s.balance);
      if (typeof s.oldRate === "number") setOldRate(s.oldRate);
      if (typeof s.oldRem === "number") setOldRem(s.oldRem);
      if (typeof s.newRate === "number") setNewRate(s.newRate);
      if (typeof s.newTerm === "number") setNewTerm(s.newTerm);
      if (typeof s.costs === "number") setCosts(s.costs);
    },
  );

  const r = useMemo(() => {
    if (!calc) return null;
    const oldPmt = monthlyPayment(calc.balance, calc.oldRate, calc.oldRem);
    const newPmt = monthlyPayment(calc.balance, calc.newRate, calc.newTerm);
    const oldInterest = buildAmortization(calc.balance, calc.oldRate, calc.oldRem).reduce((s, x) => s + x.interest, 0);
    const newInterest = buildAmortization(calc.balance, calc.newRate, calc.newTerm).reduce((s, x) => s + x.interest, 0);
    const monthlySaving = oldPmt - newPmt;
    const breakEven = monthlySaving > 0 ? calc.costs / monthlySaving : Infinity;
    const lifetimeSaving = oldInterest - newInterest - calc.costs;
    return { oldPmt, newPmt, oldInterest, newInterest, monthlySaving, breakEven, lifetimeSaving };
  }, [calc]);

  const chart = useMemo(() => {
    const arr: any[] = [];
    const term = calc?.newTerm ?? newTerm;
    const monthlySaving = r?.monthlySaving ?? 0;
    const closing = calc?.costs ?? costs;
    for (let m = 0; m <= term * 12; m += 6) {
      arr.push({ month: m, savings: monthlySaving * m - closing });
    }
    return arr;
  }, [r, calc, costs, newTerm]);

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ balance, oldRate, oldRem, newRate, newTerm, costs });
  };

  return (
    <CalcShell meta={meta} about={<p>Compare your existing mortgage against a refinance offer. Break-even is when monthly savings cover closing costs; lifetime savings net out total interest difference.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <h2 className="text-lg font-semibold">Loan details</h2>
          <Field label="Current balance" required error={errors.balance}><Input type="number" value={balance} onChange={(e) => setBalance(+e.target.value || 0)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current rate" suffix="%" required error={errors.oldRate}><Input type="number" step="0.01" value={oldRate} onChange={(e) => setOldRate(+e.target.value || 0)} /></Field>
            <Field label="Years remaining" required error={errors.oldRem}><Input type="number" step="1" value={oldRem} onChange={(e) => setOldRem(+e.target.value || 0)} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="New rate" suffix="%" required error={errors.newRate}><Input type="number" step="0.01" value={newRate} onChange={(e) => setNewRate(+e.target.value || 0)} /></Field>
            <Field label="New term (yrs)" required error={errors.newTerm}><Input type="number" step="1" value={newTerm} onChange={(e) => setNewTerm(+e.target.value || 0)} /></Field>
          </div>
          <Field label="Closing costs" error={errors.costs}><Input type="number" value={costs} onChange={(e) => setCosts(+e.target.value || 0)} /></Field>
          <div className="flex gap-2">
            <Button onClick={calculate}>Calculate</Button>
            <ShareScenario onShare={share} />
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          {!r ? (
            <div className="calc-card"><p className="text-sm text-muted-foreground">Click Calculate to show results.</p></div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <ResultStat highlight label="Monthly savings" value={fmt(r.monthlySaving)} />
                <ResultStat label="Break-even" value={isFinite(r.breakEven) ? `${r.breakEven.toFixed(1)} months` : "Never"} />
                <ResultStat label="Old payment" value={fmt(r.oldPmt)} />
                <ResultStat label="New payment" value={fmt(r.newPmt)} />
                <ResultStat label="Lifetime savings" value={fmt(r.lifetimeSaving)} />
                <ResultStat label="Closing costs" value={fmt(calc?.costs ?? costs)} />
              </div>
              <div className="calc-card">
                <h3 className="font-semibold mb-3">Cumulative savings</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <LineChart data={chart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(v: number) => fmt(v)} labelFormatter={(l) => `Month ${l}`} />
                      <Legend />
                      <Line type="monotone" dataKey="savings" stroke="hsl(var(--chart-2))" name="Net savings" strokeWidth={2} dot={false} />
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
