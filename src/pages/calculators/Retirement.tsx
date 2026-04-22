import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import StepForm, { type Step } from "@/components/StepForm";
import ShareScenario from "@/components/ShareScenario";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { findCalc } from "@/data/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { exportCsv } from "@/lib/csv";
import { useScenarioUrl } from "@/lib/scenario";
import { validateAll } from "@/lib/validate";
import { Download } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const meta = findCalc("retirement")!;

interface YearRow {
  age: number;
  yearContribution: number;
  employerMatch: number;
  growth: number;
  balance: number;
  cumulativeContrib: number;
}

function project(opts: {
  age: number; retireAge: number; current: number;
  monthly: number; rate: number; salary: number; matchPct: number; matchLimitPct: number; useMatch: boolean;
}): YearRow[] {
  const rows: YearRow[] = [];
  let balance = opts.current;
  let cumContrib = opts.current;
  const annualMatch = opts.useMatch
    ? Math.min(opts.monthly * 12, (opts.salary * opts.matchLimitPct) / 100) * (opts.matchPct / 100)
    : 0;
  for (let age = opts.age + 1; age <= opts.retireAge; age++) {
    const startBal = balance;
    const yearContribution = opts.monthly * 12;
    const r = opts.rate / 100 / 12;
    const matchMonthly = annualMatch / 12;
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + r) + opts.monthly + matchMonthly;
    }
    const growth = balance - startBal - yearContribution - annualMatch;
    cumContrib += yearContribution + annualMatch;
    rows.push({ age, yearContribution, employerMatch: annualMatch, growth, balance, cumulativeContrib: cumContrib });
  }
  return rows;
}

export default function Retirement() {
  const { format: fmt, code: ccy } = useCurrency();
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [current, setCurrent] = useState(50000);
  const [monthly, setMonthly] = useState(800);
  const [rate, setRate] = useState(7);
  const [withdrawalAge, setWithdrawalAge] = useState(85);
  const [retIncomePct, setRetIncomePct] = useState(4);
  const [useMatch, setUseMatch] = useState(true);
  const [salary, setSalary] = useState(85000);
  const [matchPct, setMatchPct] = useState(100);
  const [matchLimitPct, setMatchLimitPct] = useState(6);
  const [calc, setCalc] = useState<{
    age: number;
    retireAge: number;
    current: number;
    monthly: number;
    rate: number;
    withdrawalAge: number;
    retIncomePct: number;
    useMatch: boolean;
    salary: number;
    matchPct: number;
    matchLimitPct: number;
  } | null>(null);

  const { share } = useScenarioUrl(
    { age, retireAge, current, monthly, rate, withdrawalAge, retIncomePct, useMatch, salary, matchPct, matchLimitPct },
    (s) => {
      const setIfNum = (v: unknown, set: (n: number) => void) => { if (typeof v === "number") set(v); };
      setIfNum(s.age, setAge); setIfNum(s.retireAge, setRetireAge); setIfNum(s.current, setCurrent);
      setIfNum(s.monthly, setMonthly); setIfNum(s.rate, setRate); setIfNum(s.withdrawalAge, setWithdrawalAge);
      setIfNum(s.retIncomePct, setRetIncomePct); setIfNum(s.salary, setSalary);
      setIfNum(s.matchPct, setMatchPct); setIfNum(s.matchLimitPct, setMatchLimitPct);
      if (typeof s.useMatch === "boolean") setUseMatch(s.useMatch);
    },
  );

  const { errors } = validateAll(
    { age, retireAge, current, monthly, rate, salary, matchPct, matchLimitPct, withdrawalAge, retIncomePct },
    {
      age: { label: "Current age", required: true, min: 0, max: 120, integer: true },
      retireAge: {
        label: "Retirement age", required: true, min: 1, max: 120, integer: true,
        custom: (n) => (n <= age ? "Retirement age must be greater than current age" : null),
      },
      current: { label: "Current savings", min: 0 },
      monthly: { label: "Monthly contribution", min: 0 },
      rate: { label: "Annual return", min: -20, max: 30 },
      salary: { label: "Salary", min: 0 },
      matchPct: { label: "Match rate", min: 0, max: 1000 },
      matchLimitPct: { label: "Salary cap", min: 0, max: 100 },
      withdrawalAge: {
        label: "Plan-until age", min: 1, max: 130, integer: true,
        custom: (n) => (n < retireAge ? "Must be after retirement age" : null),
      },
      retIncomePct: { label: "Withdrawal rate", min: 0, max: 100 },
    },
  );

  const rows = useMemo(() => {
    if (!calc) return [] as YearRow[];
    return project({
      age: calc.age,
      retireAge: calc.retireAge,
      current: calc.current,
      monthly: calc.monthly,
      rate: calc.rate,
      salary: calc.salary,
      matchPct: calc.matchPct,
      matchLimitPct: calc.matchLimitPct,
      useMatch: calc.useMatch,
    });
  }, [calc]);

  const final = rows.length ? rows[rows.length - 1] : null;
  const fv = final?.balance ?? 0;
  const totalContrib = final?.cumulativeContrib ?? 0;
  const totalGrowth = fv - totalContrib;
  const annualIncome = (fv * (calc?.retIncomePct ?? retIncomePct)) / 100;
  const monthlyIncome = annualIncome / 12;
  const drawYears = Math.max((calc?.withdrawalAge ?? withdrawalAge) - (calc?.retireAge ?? retireAge), 0);
  const annualEmployerMatch = rows[0]?.employerMatch ?? 0;

  const chartData = [
    { age: calc?.age ?? age, balance: calc?.current ?? 0, contributions: calc?.current ?? 0 },
    ...rows.map((r) => ({ age: r.age, balance: r.balance, contributions: r.cumulativeContrib })),
  ];

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ age, retireAge, current, monthly, rate, withdrawalAge, retIncomePct, useMatch, salary, matchPct, matchLimitPct });
  };

  const exportProjection = () => exportCsv({
    calculator: "retirement",
    title: "Retirement Calculator",
    scenario: `Age ${age} → ${retireAge}, ${fmt(monthly)}/mo @ ${rate}%`,
    units: ccy,
    blocks: [{
      title: "Yearly projection",
      headers: ["Age", `Your contribution (${ccy})`, `Employer match (${ccy})`, `Investment growth (${ccy})`, `Year-end balance (${ccy})`, `Cumulative contributed (${ccy})`],
      rows: rows.map((r) => [r.age, r.yearContribution.toFixed(2), r.employerMatch.toFixed(2), r.growth.toFixed(2), r.balance.toFixed(2), r.cumulativeContrib.toFixed(2)]),
    }],
  }, "projection");

  const profileErr = ["age", "retireAge"].some((k) => errors[k as keyof typeof errors]);
  const contribErr = ["current", "monthly"].some((k) => errors[k as keyof typeof errors]);
  const matchErr = useMatch && ["salary", "matchPct", "matchLimitPct"].some((k) => errors[k as keyof typeof errors]);

  const steps: Step[] = [
    {
      id: "profile",
      title: "Your profile",
      description: "Current and target retirement age",
      valid: !profileErr,
      content: (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Current age" required error={errors.age}>
            <Input type="number" value={age} onChange={(e) => setAge(+e.target.value || 0)} />
          </Field>
          <Field label="Retirement age" required error={errors.retireAge}>
            <Input type="number" value={retireAge} onChange={(e) => setRetireAge(+e.target.value || 0)} />
          </Field>
        </div>
      ),
    },
    {
      id: "contrib",
      title: "Contributions",
      description: "Current savings and monthly addition",
      valid: !contribErr,
      content: (
        <>
          <Field label="Current savings" prefix={ccy === "USD" ? "$" : ccy} error={errors.current}>
            <Input type="number" value={current} onChange={(e) => setCurrent(+e.target.value || 0)} />
          </Field>
          <Field label="Your monthly contribution" prefix={ccy === "USD" ? "$" : ccy} error={errors.monthly}>
            <Input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value || 0)} />
          </Field>
          <Field label="Expected annual return" suffix="%" error={errors.rate}>
            <Input type="number" step="0.01" value={rate} onChange={(e) => setRate(+e.target.value || 0)} />
          </Field>
        </>
      ),
    },
    {
      id: "match",
      title: "Employer match",
      description: "401(k) employer contribution",
      valid: !matchErr,
      content: (
        <>
          <div className="flex items-center justify-between">
            <Label htmlFor="match" className="text-sm font-medium">Include employer match</Label>
            <Switch id="match" checked={useMatch} onCheckedChange={setUseMatch} />
          </div>
          {useMatch && (
            <>
              <Field label="Annual salary" prefix={ccy === "USD" ? "$" : ccy} error={errors.salary}>
                <Input type="number" value={salary} onChange={(e) => setSalary(+e.target.value || 0)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Match rate" suffix="%" hint="100% = $1-for-$1" error={errors.matchPct}>
                  <Input type="number" step="1" value={matchPct} onChange={(e) => setMatchPct(+e.target.value || 0)} />
                </Field>
                <Field label="Up to % of salary" suffix="%" error={errors.matchLimitPct}>
                  <Input type="number" step="0.5" value={matchLimitPct} onChange={(e) => setMatchLimitPct(+e.target.value || 0)} />
                </Field>
              </div>
              <p className="text-xs text-muted-foreground">Employer adds <strong className="text-accent">{fmt(annualEmployerMatch)}</strong>/year</p>
            </>
          )}
        </>
      ),
    },
    {
      id: "withdraw",
      title: "Withdrawal plan",
      description: "How you'll spend the savings",
      content: (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Withdrawal rate" suffix="%" error={errors.retIncomePct}>
            <Input type="number" step="0.1" value={retIncomePct} onChange={(e) => setRetIncomePct(+e.target.value || 0)} />
          </Field>
          <Field label="Plan until age" error={errors.withdrawalAge}>
            <Input type="number" value={withdrawalAge} onChange={(e) => setWithdrawalAge(+e.target.value || 0)} />
          </Field>
        </div>
      ),
    },
  ];

  const results = !calc ? (
    <div className="calc-card"><p className="text-sm text-muted-foreground">Click Calculate to show results.</p></div>
  ) : (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        <ResultStat highlight label="Nest egg at retirement" value={fmt(fv)} hint={`At age ${calc.retireAge}`} />
        <ResultStat label="Estimated monthly income" value={fmt(monthlyIncome)} hint={`${calc.retIncomePct}% safe withdrawal`} />
        <ResultStat label="Total contributed" value={fmt(totalContrib)} hint={calc.useMatch ? "Includes employer match" : undefined} />
        <ResultStat label="Investment growth" value={fmt(totalGrowth)} hint={`Spans ${drawYears} retirement years`} />
      </div>
      <div className="calc-card">
        <h3 className="font-semibold mb-3">Balance over time</h3>
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="age" stroke="hsl(var(--muted-foreground))" />
              <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => fmt(v)} labelFormatter={(l) => `Age ${l}`} />
              <Legend />
              <Area type="monotone" dataKey="balance" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.25} name="Balance" />
              <Area type="monotone" dataKey="contributions" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.15} name="Contributions" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  return (
    <CalcShell meta={meta} about={
      <>
        <p>Project your retirement nest egg with optional employer 401(k) match. The match is calculated as <em>match% × min(your contribution, salary × match limit%)</em>.</p>
        <p>Common formula: 100% match up to 6% of salary. The withdrawal rate (commonly 4%) estimates safe annual income from your portfolio. Use “Share scenario” to copy a permalink containing every input.</p>
      </>
    }>
      <StepForm
        steps={steps}
        results={results}
        headerExtras={<div className="flex items-center gap-2"><Button size="sm" onClick={calculate}>Calculate</Button><ShareScenario onShare={share} /></div>}
      />

      {calc && <Tabs defaultValue="yearly" className="mt-8">
        <TabsList><TabsTrigger value="yearly">Yearly contributions</TabsTrigger></TabsList>
        <TabsContent value="yearly" className="calc-card">
          <div className="flex justify-end mb-3">
            <Button variant="outline" size="sm" onClick={exportProjection}>
              <Download className="h-4 w-4 mr-1" />Download CSV
            </Button>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Age</TableHead>
                <TableHead className="text-right">You ({ccy})</TableHead>
                <TableHead className="text-right">Employer ({ccy})</TableHead>
                <TableHead className="text-right">Growth ({ccy})</TableHead>
                <TableHead className="text-right">Balance ({ccy})</TableHead>
              </TableRow></TableHeader>
              <TableBody>{rows.map((r) => (
                <TableRow key={r.age}>
                  <TableCell>{r.age}</TableCell>
                  <TableCell className="text-right font-mono">{fmt(r.yearContribution)}</TableCell>
                  <TableCell className="text-right font-mono text-accent">{fmt(r.employerMatch)}</TableCell>
                  <TableCell className="text-right font-mono">{fmt(r.growth)}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{fmt(r.balance)}</TableCell>
                </TableRow>
              ))}</TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>}
    </CalcShell>
  );
}
