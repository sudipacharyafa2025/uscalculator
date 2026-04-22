import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import ShareScenario from "@/components/ShareScenario";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { findCalc } from "@/data/calculators";
import { buildAmortization, monthlyPayment } from "@/lib/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useScenarioUrl } from "@/lib/scenario";
import { validateAll } from "@/lib/validate";
import { FINANCE_MAX_RATE_PCT, FINANCE_MAX_YEARS } from "@/lib/financeBounds";
import { ArrowDown, ArrowUp, Equal } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const meta = findCalc("loan-comparison")!;

interface Scenario { amount: number; rate: number; years: number; }

function compute(s: Scenario) {
  const pmt = monthlyPayment(s.amount, s.rate, s.years);
  const am = buildAmortization(s.amount, s.rate, s.years);
  const totalInterest = am.reduce((sum, r) => sum + r.interest, 0);
  const totalPaid = pmt * s.years * 12;
  return { pmt, totalInterest, totalPaid, am };
}

export default function LoanComparison() {
  const { format: fmt, code: ccy } = useCurrency();
  const [a, setA] = useState<Scenario>({ amount: 300000, rate: 6.5, years: 30 });
  const [b, setB] = useState<Scenario>({ amount: 300000, rate: 5.5, years: 15 });
  const [calc, setCalc] = useState<{ a: Scenario; b: Scenario } | null>(null);

  const { share } = useScenarioUrl({ a, b }, (s) => {
    if (s.a && typeof s.a === "object") setA(s.a as Scenario);
    if (s.b && typeof s.b === "object") setB(s.b as Scenario);
  });

  const ra = useMemo(() => (calc ? compute(calc.a) : null), [calc]);
  const rb = useMemo(() => (calc ? compute(calc.b) : null), [calc]);

  const intDiff = ra && rb ? rb.totalInterest - ra.totalInterest : 0;
  const pmtDiff = ra && rb ? rb.pmt - ra.pmt : 0;

  const chartData = useMemo(() => {
    if (!ra || !rb) return [] as { period: number; A: number; B: number }[];
    const max = Math.max(ra.am.length, rb.am.length);
    const data = [] as { period: number; A: number; B: number }[];
    for (let i = 0; i < max; i += 6) {
      data.push({ period: i + 1, A: ra.am[i]?.balance ?? 0, B: rb.am[i]?.balance ?? 0 });
    }
    return data;
  }, [ra, rb]);

  const calculate = () => {
    setCalc({ a: { ...a }, b: { ...b } });
  };

  return (
    <CalcShell meta={meta} about={
      <p>Compare two loan scenarios side-by-side. Useful for evaluating different rates, terms or loan amounts (e.g., 30-year vs 15-year mortgage, or two refinance offers). Click <em>Share scenario</em> to send a permalink containing both scenarios.</p>
    }>
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          <Button onClick={calculate}>Calculate</Button>
          <ShareScenario onShare={share} label="Share both scenarios" />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <ScenarioCard label="Scenario A" color="hsl(var(--chart-1))" v={a} setV={setA} r={ra} fmt={fmt} ccy={ccy} />
        <ScenarioCard label="Scenario B" color="hsl(var(--chart-2))" v={b} setV={setB} r={rb} fmt={fmt} ccy={ccy} />
      </div>

      {ra && rb && <div className="mt-6 calc-card">
        <h3 className="font-semibold mb-3">Difference (B − A)</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <DiffStat label="Monthly payment" value={pmtDiff} fmt={fmt} />
          <DiffStat label="Total interest" value={intDiff} fmt={fmt} highlight />
          <DiffStat label="Total paid" value={rb.totalPaid - ra.totalPaid} fmt={fmt} />
        </div>
        {intDiff !== 0 && (
          <p className="text-sm text-muted-foreground mt-4">
            {intDiff < 0 ? (
              <>Scenario B saves <strong className="text-accent">{fmt(Math.abs(intDiff))}</strong> in total interest compared to Scenario A.</>
            ) : (
              <>Scenario A saves <strong className="text-accent">{fmt(Math.abs(intDiff))}</strong> in total interest compared to Scenario B.</>
            )}
          </p>
        )}
      </div>}

      {ra && rb && <div className="mt-6 calc-card">
        <h3 className="font-semibold mb-3">Balance over time</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="period" tickFormatter={(v) => `Yr ${Math.ceil(v / 12)}`} stroke="hsl(var(--muted-foreground))" />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => fmt(v)} labelFormatter={(l) => `Month ${l}`} />
              <Legend />
              <Line type="monotone" dataKey="A" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="Scenario A" />
              <Line type="monotone" dataKey="B" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="Scenario B" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>}

      {!calc && <div className="mt-6 calc-card"><p className="text-sm text-muted-foreground">Set both scenarios and click Calculate to compare results.</p></div>}
    </CalcShell>
  );
}

function ScenarioCard({ label, color, v, setV, r, fmt, ccy }: {
  label: string; color: string; v: Scenario; setV: (s: Scenario) => void; r: ReturnType<typeof compute> | null; fmt: (n: number) => string; ccy: string;
}) {
  const { errors } = validateAll(v as unknown as Record<string, number>, {
    amount: { label: "Loan amount", required: true, min: 1 },
    years: { label: "Term", required: true, min: 1, max: FINANCE_MAX_YEARS, integer: true },
    rate: { label: "Rate", required: true, min: 0, max: FINANCE_MAX_RATE_PCT },
  });
  return (
    <div className="calc-card">
      <div className="flex items-center gap-2 mb-3">
        <span className="h-3 w-3 rounded-full" style={{ background: color }} />
        <h3 className="font-semibold">{label}</h3>
      </div>
      <div className="space-y-3">
        <Field label="Loan amount" prefix={ccy === "USD" ? "$" : ccy} required error={errors.amount}>
          <Input type="number" value={v.amount} onChange={(e) => setV({ ...v, amount: +e.target.value || 0 })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Term (years)" required error={errors.years}>
            <Input type="number" step="1" value={v.years} onChange={(e) => setV({ ...v, years: +e.target.value || 0 })} />
          </Field>
          <Field label="Interest rate" suffix="%" required error={errors.rate}>
            <Input type="number" step="0.01" value={v.rate} onChange={(e) => setV({ ...v, rate: +e.target.value || 0 })} />
          </Field>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <ResultStat label="Monthly" value={r ? fmt(r.pmt) : "-"} />
        <ResultStat label="Total interest" value={r ? fmt(r.totalInterest) : "-"} />
      </div>
    </div>
  );
}

function DiffStat({ label, value, fmt, highlight }: { label: string; value: number; fmt: (n: number) => string; highlight?: boolean }) {
  const Icon = value > 0.01 ? ArrowUp : value < -0.01 ? ArrowDown : Equal;
  const color = value > 0.01 ? "text-destructive" : value < -0.01 ? "text-accent" : "text-muted-foreground";
  return (
    <div className={`rounded-lg p-4 border ${highlight ? "border-accent" : "border-border"} bg-muted/30`}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-1 flex items-center gap-2 ${color}`}>
        <Icon className="h-5 w-5" />
        {fmt(Math.abs(value))}
      </div>
    </div>
  );
}
