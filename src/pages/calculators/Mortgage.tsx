import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import StepForm, { type Step } from "@/components/StepForm";
import ShareScenario from "@/components/ShareScenario";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { findCalc } from "@/data/calculators";
import { buildAmortization, monthlyPayment, yearlyAmortization } from "@/lib/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { exportCsv } from "@/lib/csv";
import { useScenarioUrl } from "@/lib/scenario";
import { validateAll } from "@/lib/validate";
import { FINANCE_MAX_RATE_PCT, FINANCE_MAX_YEARS } from "@/lib/financeBounds";
import { Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const meta = findCalc("mortgage")!;

interface MortgageInputs {
  price: string;
  down: string;
  years: string;
  rate: string;
  taxPct: string;
  insAnnual: string;
  hoa: string;
  pmiPct: string;
}

interface MortgageCalc {
  price: number;
  down: number;
  years: number;
  rate: number;
  taxPct: number;
  insAnnual: number;
  hoa: number;
  pmiPct: number;
}

export default function Mortgage() {
  const { format: fmtCurrency, code: ccy } = useCurrency();
  const [inputs, setInputs] = useState<MortgageInputs>({
    price: "",
    down: "",
    years: "",
    rate: "",
    taxPct: "",
    insAnnual: "",
    hoa: "",
    pmiPct: "",
  });
  const [calc, setCalc] = useState<MortgageCalc | null>(null);

  const setInput = (key: keyof MortgageInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const { share } = useScenarioUrl(inputs, (s) => {
    const next: Partial<MortgageInputs> = {};
    const keys: (keyof MortgageInputs)[] = ["price", "down", "years", "rate", "taxPct", "insAnnual", "hoa", "pmiPct"];
    keys.forEach((k) => {
      const v = (s as Record<string, unknown>)[k];
      if (typeof v === "number" || typeof v === "string") next[k] = String(v);
    });
    setInputs((prev) => ({ ...prev, ...next }));
  });

  const parsedPrice = Number(inputs.price || 0);

  const { errors } = validateAll(inputs, {
    price: { label: "Home price", required: true, min: 1 },
    down: { label: "Down payment", min: 0, custom: (n) => (n > parsedPrice ? "Down payment can't exceed price" : null) },
    years: { label: "Loan term", required: true, min: 1, max: FINANCE_MAX_YEARS, integer: true },
    rate: { label: "Interest rate", required: true, min: 0, max: FINANCE_MAX_RATE_PCT },
    taxPct: { label: "Property tax", min: 0, max: 10 },
    insAnnual: { label: "Insurance", min: 0 },
    hoa: { label: "HOA", min: 0 },
    pmiPct: { label: "PMI", min: 0, max: 5 },
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({
      price: Number(inputs.price),
      down: inputs.down === "" ? 0 : Number(inputs.down),
      years: Number(inputs.years),
      rate: Number(inputs.rate),
      taxPct: inputs.taxPct === "" ? 0 : Number(inputs.taxPct),
      insAnnual: inputs.insAnnual === "" ? 0 : Number(inputs.insAnnual),
      hoa: inputs.hoa === "" ? 0 : Number(inputs.hoa),
      pmiPct: inputs.pmiPct === "" ? 0 : Number(inputs.pmiPct),
    });
  };

  const loan = calc ? Math.max(calc.price - calc.down, 0) : 0;
  const ltv = calc && calc.price > 0 ? (loan / calc.price) * 100 : 0;
  const pAndI = calc ? monthlyPayment(loan, calc.rate, calc.years) : 0;
  const monthlyTax = calc ? (calc.price * calc.taxPct / 100) / 12 : 0;
  const monthlyIns = calc ? calc.insAnnual / 12 : 0;
  const needsPMI = calc ? ltv > 80 : false;
  const monthlyPMI = calc && needsPMI ? (loan * calc.pmiPct / 100) / 12 : 0;
  const total = pAndI + monthlyTax + monthlyIns + (calc?.hoa ?? 0) + monthlyPMI;

  const amort = useMemo(() => {
    if (!calc) return [];
    return buildAmortization(loan, calc.rate, calc.years);
  }, [calc, loan]);
  const yearly = useMemo(() => yearlyAmortization(amort), [amort]);
  const totalInterest = amort.reduce((s, r) => s + r.interest, 0);

  const breakdown = [
    { name: "Principal & Interest", value: pAndI },
    { name: "Property Tax", value: monthlyTax },
    { name: "Home Insurance", value: monthlyIns },
    { name: "PMI", value: monthlyPMI },
    { name: "HOA", value: calc?.hoa ?? 0 },
  ].filter((d) => d.value > 0);

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
  const scenarioStr = calc ? `${fmtCurrency(calc.price)} home, ${calc.years}yr @ ${calc.rate}%` : "";

  const exportYearly = () => {
    if (!calc) return;
    exportCsv({
      calculator: "mortgage", title: "Mortgage Calculator", scenario: scenarioStr, units: ccy,
      blocks: [{
        title: "Yearly amortization schedule",
        headers: ["Year", `Principal (${ccy})`, `Interest (${ccy})`, `Ending balance (${ccy})`],
        rows: yearly.map((y) => [y.year, y.principal.toFixed(2), y.interest.toFixed(2), y.balance.toFixed(2)]),
      }],
    }, `yearly-${calc.years}yr`);
  };

  const exportMonthly = () => {
    if (!calc) return;
    exportCsv({
      calculator: "mortgage", title: "Mortgage Calculator", scenario: scenarioStr, units: ccy,
      blocks: [{
        title: "Monthly amortization schedule",
        headers: ["Month", `Payment (${ccy})`, `Principal (${ccy})`, `Interest (${ccy})`, `Ending balance (${ccy})`],
        rows: amort.map((r) => [r.period, r.payment.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2), r.balance.toFixed(2)]),
      }],
    }, `monthly-${calc.years}yr`);
  };

  const step1Errors = ["price", "down"].some((k) => Boolean(errors[k as keyof typeof errors]));
  const step2Errors = ["years", "rate"].some((k) => Boolean(errors[k as keyof typeof errors]));

  const steps: Step[] = [
    {
      id: "loan",
      title: "Loan basics",
      description: "Home price and down payment",
      valid: !step1Errors,
      content: (
        <>
          <Field label="Home price" prefix={ccy === "USD" ? "$" : ccy} required error={errors.price}>
            <Input type="number" value={inputs.price} onChange={(e) => setInput("price", e.target.value)} />
          </Field>
          <Field
            label="Down payment"
            prefix={ccy === "USD" ? "$" : ccy}
            hint={`${((Number(inputs.down || 0) / Number(inputs.price || 0)) * 100 || 0).toFixed(1)}% of price`}
            error={errors.down}
          >
            <Input type="number" value={inputs.down} onChange={(e) => setInput("down", e.target.value)} />
          </Field>
        </>
      ),
    },
    {
      id: "terms",
      title: "Rate & term",
      description: "Interest rate and length",
      valid: !step2Errors,
      content: (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Loan term (yr)" required error={errors.years}>
            <Input type="number" step="1" value={inputs.years} onChange={(e) => setInput("years", e.target.value)} />
          </Field>
          <Field label="Interest rate" suffix="%" required error={errors.rate}>
            <Input type="number" step="0.01" value={inputs.rate} onChange={(e) => setInput("rate", e.target.value)} />
          </Field>
        </div>
      ),
    },
    {
      id: "extras",
      title: "Taxes & insurance",
      description: "PITI add-ons and PMI",
      content: (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Property tax /yr" suffix="%" error={errors.taxPct}>
              <Input type="number" step="0.01" value={inputs.taxPct} onChange={(e) => setInput("taxPct", e.target.value)} />
            </Field>
            <Field label="Insurance /yr" prefix={ccy === "USD" ? "$" : ccy} error={errors.insAnnual}>
              <Input type="number" value={inputs.insAnnual} onChange={(e) => setInput("insAnnual", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="HOA /mo" prefix={ccy === "USD" ? "$" : ccy} error={errors.hoa}>
              <Input type="number" value={inputs.hoa} onChange={(e) => setInput("hoa", e.target.value)} />
            </Field>
            <Field label="PMI /yr" suffix="%" hint={needsPMI ? "Applied (LTV > 80%)" : "Not needed"} error={errors.pmiPct}>
              <Input type="number" step="0.01" value={inputs.pmiPct} onChange={(e) => setInput("pmiPct", e.target.value)} />
            </Field>
          </div>
        </>
      ),
    },
  ];

  const results = !calc ? (
    <div className="calc-card">
      <h3 className="font-semibold mb-2">Results</h3>
      <p className="text-sm text-muted-foreground">Fill the fields, then click Calculate to show results.</p>
    </div>
  ) : (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        <ResultStat highlight label="Monthly payment" value={fmtCurrency(total)} hint="Total PITI + HOA" />
        <ResultStat label="Loan amount" value={fmtCurrency(loan)} hint={`${ltv.toFixed(1)}% LTV`} />
        <ResultStat label="Total interest" value={fmtCurrency(totalInterest)} />
        <ResultStat label="Total of payments" value={fmtCurrency(pAndI * calc.years * 12)} />
      </div>
      <div className="calc-card">
        <h3 className="font-semibold mb-3">Monthly payment breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => fmtCurrency(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  return (
    <CalcShell
      meta={meta}
      about={
        <>
          <p>The mortgage calculator estimates your monthly payment based on home price, down payment, loan term and interest rate. PITI includes Principal, Interest, Taxes and Insurance, plus PMI if your down payment is less than 20%.</p>
          <p>Property tax is entered as an annual percentage of the home price. PMI is automatically added when loan-to-value exceeds 80%. Use “Share scenario” to send a permalink with all your inputs pre-filled.</p>
        </>
      }
    >
      <StepForm
        steps={steps}
        results={results}
        headerExtras={(
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={calculate}>Calculate</Button>
            <ShareScenario onShare={share} />
          </div>
        )}
      />

      {calc && (
        <Tabs defaultValue="chart" className="mt-8">
          <TabsList>
            <TabsTrigger value="chart">Balance over time</TabsTrigger>
            <TabsTrigger value="yearly">Yearly schedule</TabsTrigger>
            <TabsTrigger value="monthly">Monthly schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="calc-card">
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={amort.filter((_, i) => i % 6 === 0 || i === amort.length - 1)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="period" tickFormatter={(v) => `Yr ${Math.ceil(v / 12)}`} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tickFormatter={(v) => `${ccy} ${(v / 1000).toFixed(0)}k`} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip formatter={(v: number) => fmtCurrency(v)} labelFormatter={(l) => `Month ${l}`} />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="Balance" />
                  <Line type="monotone" dataKey="totalInterest" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="Total interest" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="yearly" className="calc-card">
            <div className="flex justify-end mb-3">
              <Button variant="outline" size="sm" onClick={exportYearly} disabled={!calc}>
                <Download className="h-4 w-4 mr-1" />Download CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Year</TableHead><TableHead className="text-right">Principal ({ccy})</TableHead><TableHead className="text-right">Interest ({ccy})</TableHead><TableHead className="text-right">Balance ({ccy})</TableHead></TableRow></TableHeader>
                <TableBody>{yearly.map((y) => (
                  <TableRow key={y.year}><TableCell>{y.year}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(y.principal)}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(y.interest)}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(y.balance)}</TableCell></TableRow>
                ))}</TableBody>
              </Table>
            </div>
          </TabsContent>
          <TabsContent value="monthly" className="calc-card">
            <div className="flex justify-end mb-3">
              <Button variant="outline" size="sm" onClick={exportMonthly} disabled={!calc}>
                <Download className="h-4 w-4 mr-1" />Download CSV
              </Button>
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader><TableRow><TableHead>#</TableHead><TableHead className="text-right">Payment ({ccy})</TableHead><TableHead className="text-right">Principal ({ccy})</TableHead><TableHead className="text-right">Interest ({ccy})</TableHead><TableHead className="text-right">Balance ({ccy})</TableHead></TableRow></TableHeader>
                <TableBody>{amort.map((r) => (
                  <TableRow key={r.period}><TableCell>{r.period}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(r.payment)}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(r.principal)}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(r.interest)}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(r.balance)}</TableCell></TableRow>
                ))}</TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </CalcShell>
  );
}
