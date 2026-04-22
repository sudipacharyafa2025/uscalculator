import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findCalc } from "@/data/calculators";
import { futureValue } from "@/lib/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { validateAll } from "@/lib/validate";
import { FINANCE_MAX_RATE_PCT, FINANCE_MAX_YEARS } from "@/lib/financeBounds";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend, Area, AreaChart } from "recharts";
import ShareScenario from "@/components/ShareScenario";
import { useScenarioUrl } from "@/lib/scenario";

const meta = findCalc("compound-interest")!;

export default function CompoundInterest() {
  const { format: fmtCurrency } = useCurrency();
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [contrib, setContrib] = useState(200);
  const [compound, setCompound] = useState(12);
  const [calc, setCalc] = useState<{ principal: number; rate: number; years: number; contrib: number; compound: number } | null>(null);

  const { share } = useScenarioUrl(
    { principal, rate, years, contrib, compound },
    (s) => {
      if (typeof s.principal === "number") setPrincipal(s.principal);
      if (typeof s.rate === "number") setRate(s.rate);
      if (typeof s.years === "number") setYears(s.years);
      if (typeof s.contrib === "number") setContrib(s.contrib);
      if (typeof s.compound === "number") setCompound(s.compound);
    },
  );

  const result = useMemo(() => {
    if (!calc) return null;
    return futureValue(calc.principal, calc.rate, calc.years, calc.contrib, calc.compound);
  }, [calc]);

  const { errors } = validateAll(
    { principal, rate, years, contrib, compound },
    {
      principal: { label: "Initial investment", required: true, min: 0 },
      contrib: { label: "Monthly contribution", min: 0 },
      rate: { label: "Annual rate", required: true, min: -100, max: FINANCE_MAX_RATE_PCT },
      years: { label: "Years", required: true, min: 1, max: FINANCE_MAX_YEARS, integer: true },
      compound: {
        label: "Compounds per year",
        required: true,
        custom: (n) => ([1, 2, 4, 12, 365].includes(n) ? null : "Choose a valid compounding frequency"),
      },
    },
  );

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ principal, rate, years, contrib, compound });
  };

  return (
    <CalcShell meta={meta} about={<p>Compound interest is the interest you earn on both your initial deposit and previously earned interest. Even modest contributions grow significantly over long periods.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <h2 className="text-lg font-semibold">Inputs</h2>
          <Field label="Initial investment" prefix="$" required error={errors.principal}><Input type="number" value={principal} onChange={(e) => setPrincipal(+e.target.value || 0)} /></Field>
          <Field label="Monthly contribution" prefix="$" error={errors.contrib}><Input type="number" value={contrib} onChange={(e) => setContrib(+e.target.value || 0)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Annual rate" suffix="%" required error={errors.rate}><Input type="number" step="0.01" value={rate} onChange={(e) => setRate(+e.target.value || 0)} /></Field>
            <Field label="Years" required error={errors.years}><Input type="number" step="1" value={years} onChange={(e) => setYears(+e.target.value || 0)} /></Field>
          </div>
          <Field label="Compounds per year" required error={errors.compound}>
            <Select value={String(compound)} onValueChange={(v) => setCompound(+v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Annually</SelectItem>
                <SelectItem value="2">Semi-annually</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem>
                <SelectItem value="12">Monthly</SelectItem>
                <SelectItem value="365">Daily</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex gap-2">
            <button type="button" className="px-3 py-2 rounded-md bg-accent text-accent-foreground text-sm" onClick={calculate}>Calculate</button>
            <ShareScenario onShare={share} />
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          {!result ? (
            <div className="calc-card"><p className="text-sm text-muted-foreground">Click Calculate to show results.</p></div>
          ) : (
            <>
              <div className="grid sm:grid-cols-3 gap-3">
                <ResultStat highlight label="Final balance" value={fmtCurrency(result.fv)} />
                <ResultStat label="Total contributions" value={fmtCurrency(result.totalContrib)} />
                <ResultStat label="Interest earned" value={fmtCurrency(result.totalInterest)} />
              </div>
              <div className="calc-card">
                <h3 className="font-semibold mb-3">Growth over time</h3>
                <div className="h-72">
                  <ResponsiveContainer>
                    <AreaChart data={result.series}>
                      <defs>
                        <linearGradient id="balC" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="conC" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
                      <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip formatter={(v: number) => fmtCurrency(v)} labelFormatter={(l) => `Year ${l}`} />
                      <Legend />
                      <Area type="monotone" dataKey="balance" stroke="hsl(var(--chart-2))" fill="url(#balC)" name="Balance" strokeWidth={2} />
                      <Area type="monotone" dataKey="contributions" stroke="hsl(var(--chart-1))" fill="url(#conC)" name="Contributions" strokeWidth={2} />
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
