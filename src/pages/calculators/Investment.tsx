import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { findCalc } from "@/data/calculators";
import { futureValue } from "@/lib/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { validateAll } from "@/lib/validate";
import { FINANCE_MAX_RATE_PCT, FINANCE_MAX_YEARS } from "@/lib/financeBounds";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import ShareScenario from "@/components/ShareScenario";
import { useScenarioUrl } from "@/lib/scenario";

const meta = findCalc("investment")!;

export default function Investment() {
  const { format: fmtCurrency } = useCurrency();
  const [start, setStart] = useState(20000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(8);
  const [monthly, setMonthly] = useState(500);
  const [calc, setCalc] = useState<{ start: number; years: number; rate: number; monthly: number } | null>(null);

  const { share } = useScenarioUrl(
    { start, years, rate, monthly },
    (s) => {
      if (typeof s.start === "number") setStart(s.start);
      if (typeof s.years === "number") setYears(s.years);
      if (typeof s.rate === "number") setRate(s.rate);
      if (typeof s.monthly === "number") setMonthly(s.monthly);
    },
  );

  const r = useMemo(() => {
    if (!calc) return null;
    return futureValue(calc.start, calc.rate, calc.years, calc.monthly, 12);
  }, [calc]);

  const { errors } = validateAll(
    { start, years, rate, monthly },
    {
      start: { label: "Starting amount", required: true, min: 0 },
      years: { label: "Years to grow", required: true, min: 1, max: FINANCE_MAX_YEARS, integer: true },
      rate: { label: "Annual return", required: true, min: -100, max: FINANCE_MAX_RATE_PCT },
      monthly: { label: "Monthly contribution", min: 0 },
    },
  );

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ start, years, rate, monthly });
  };

  return (
    <CalcShell meta={meta} about={<p>Project the future value of an investment that compounds monthly with regular contributions.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <Field label="Starting amount" prefix="$" required error={errors.start}><Input type="number" value={start} onChange={(e) => setStart(+e.target.value || 0)} /></Field>
          <Field label="Years to grow" required error={errors.years}><Input type="number" step="1" value={years} onChange={(e) => setYears(+e.target.value || 0)} /></Field>
          <Field label="Annual return" suffix="%" required error={errors.rate}><Input type="number" step="0.01" value={rate} onChange={(e) => setRate(+e.target.value || 0)} /></Field>
          <Field label="Monthly contribution" prefix="$" error={errors.monthly}><Input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value || 0)} /></Field>
          <div className="flex gap-2">
            <button type="button" className="px-3 py-2 rounded-md bg-accent text-accent-foreground text-sm" onClick={calculate}>Calculate</button>
            <ShareScenario onShare={share} />
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          {!r ? (
            <div className="calc-card"><p className="text-sm text-muted-foreground">Click Calculate to show results.</p></div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-3">
                <ResultStat highlight label="Future value" value={fmtCurrency(r.fv)} />
                <ResultStat label="Total invested" value={fmtCurrency(r.totalContrib)} />
                <ResultStat label="Total earnings" value={fmtCurrency(r.totalInterest)} />
              </div>
              <div className="calc-card">
                <div className="h-72">
                  <ResponsiveContainer>
                    <AreaChart data={r.series}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(v: number) => fmtCurrency(v)} />
                      <Legend />
                      <Area type="monotone" dataKey="balance" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.2} name="Balance" />
                      <Area type="monotone" dataKey="contributions" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.15} name="Contributions" />
                    </AreaChart>
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
