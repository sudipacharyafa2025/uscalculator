import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import StepForm, { type Step } from "@/components/StepForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { findCalc } from "@/data/calculators";
import { buildAmortization, monthlyPayment, yearlyAmortization } from "@/lib/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { exportCsv } from "@/lib/csv";
import { validateAll } from "@/lib/validate";
import { FINANCE_MAX_RATE_PCT, FINANCE_MAX_YEARS } from "@/lib/financeBounds";
import { Download } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const meta = findCalc("loan")!;

export default function LoanCalc() {
  const { format: fmtCurrency, code: ccy } = useCurrency();
  const [amount, setAmount] = useState(25000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(7.5);
  const [calc, setCalc] = useState<{ amount: number; years: number; rate: number } | null>(null);

  const { errors } = validateAll({ amount, years, rate }, {
    amount: { label: "Loan amount", required: true, min: 1 },
    years: { label: "Term", required: true, min: 1, max: FINANCE_MAX_YEARS, integer: true },
    rate: { label: "Interest rate", required: true, min: 0, max: FINANCE_MAX_RATE_PCT },
  });

  const pmt = calc ? monthlyPayment(calc.amount, calc.rate, calc.years) : 0;
  const amort = useMemo(() => {
    if (!calc) return [];
    return buildAmortization(calc.amount, calc.rate, calc.years);
  }, [calc]);
  const yearly = useMemo(() => yearlyAmortization(amort), [amort]);
  const totalInterest = amort.reduce((s, r) => s + r.interest, 0);

  const data = [{ name: "Principal", value: calc?.amount ?? 0 }, { name: "Interest", value: totalInterest }];
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))"];

  const exportYearly = () => exportCsv({
    calculator: "loan", title: "Loan Calculator",
    scenario: `${fmtCurrency(calc?.amount ?? amount)} / ${calc?.years ?? years}yr / ${calc?.rate ?? rate}%`, units: ccy,
    blocks: [{
      title: "Yearly amortization",
      headers: ["Year", `Principal (${ccy})`, `Interest (${ccy})`, `Balance (${ccy})`],
      rows: yearly.map((y) => [y.year, y.principal.toFixed(2), y.interest.toFixed(2), y.balance.toFixed(2)]),
    }],
  }, "yearly");

  const exportMonthly = () => exportCsv({
    calculator: "loan", title: "Loan Calculator",
    scenario: `${fmtCurrency(calc?.amount ?? amount)} / ${calc?.years ?? years}yr / ${calc?.rate ?? rate}%`, units: ccy,
    blocks: [{
      title: "Monthly amortization",
      headers: ["Month", `Payment (${ccy})`, `Principal (${ccy})`, `Interest (${ccy})`, `Balance (${ccy})`],
      rows: amort.map((r) => [r.period, r.payment.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2), r.balance.toFixed(2)]),
    }],
  }, "monthly");

  const steps: Step[] = [
    {
      id: "loan",
      title: "Loan amount",
      description: "How much you're borrowing",
      valid: !errors.amount,
      content: (
        <Field label="Loan amount" prefix={ccy === "USD" ? "$" : ccy} required error={errors.amount}>
          <Input type="number" value={amount} onChange={(e) => setAmount(+e.target.value || 0)} />
        </Field>
      ),
    },
    {
      id: "terms",
      title: "Rate & term",
      description: "Loan length and interest",
      valid: !errors.years && !errors.rate,
      content: (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Loan term (years)" required error={errors.years}>
            <Input type="number" step="1" value={years} onChange={(e) => setYears(+e.target.value || 0)} />
          </Field>
          <Field label="Interest rate" suffix="%" required error={errors.rate}>
            <Input type="number" step="0.01" value={rate} onChange={(e) => setRate(+e.target.value || 0)} />
          </Field>
        </div>
      ),
    },
  ];

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ amount, years, rate });
  };

  const results = !calc ? (
    <div className="calc-card"><p className="text-sm text-muted-foreground">Click Calculate to show results.</p></div>
  ) : (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        <ResultStat highlight label="Monthly payment" value={fmtCurrency(pmt)} />
        <ResultStat label="Total payments" value={fmtCurrency(pmt * calc.years * 12)} />
        <ResultStat label="Total interest" value={fmtCurrency(totalInterest)} />
        <ResultStat label="Payoff term" value={`${calc.years * 12} months`} />
      </div>
      <div className="calc-card">
        <h3 className="font-semibold mb-3">Principal vs. interest</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
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
    <CalcShell meta={meta} about={<p>Compute fixed monthly payments, total interest paid and a full amortization schedule for any installment loan.</p>}>
      <StepForm steps={steps} results={results} headerExtras={<Button size="sm" onClick={calculate}>Calculate</Button>} />

      {calc && <Tabs defaultValue="chart" className="mt-8">
        <TabsList>
          <TabsTrigger value="chart">Balance over time</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="chart" className="calc-card">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={amort}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" />
                <YAxis tickFormatter={(v) => `${ccy} ${(v / 1000).toFixed(0)}k`} stroke="hsl(var(--muted-foreground))" />
                <Tooltip formatter={(v: number) => fmtCurrency(v)} />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="hsl(var(--chart-1))" dot={false} name="Balance" strokeWidth={2} />
                <Line type="monotone" dataKey="totalInterest" stroke="hsl(var(--chart-2))" dot={false} name="Cumulative interest" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        <TabsContent value="yearly" className="calc-card overflow-x-auto">
          <div className="flex justify-end mb-3">
            <Button variant="outline" size="sm" onClick={exportYearly}>
              <Download className="h-4 w-4 mr-1" />Download CSV
            </Button>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>Year</TableHead><TableHead className="text-right">Principal ({ccy})</TableHead><TableHead className="text-right">Interest ({ccy})</TableHead><TableHead className="text-right">Balance ({ccy})</TableHead></TableRow></TableHeader>
            <TableBody>{yearly.map((y) => <TableRow key={y.year}><TableCell>{y.year}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(y.principal)}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(y.interest)}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(y.balance)}</TableCell></TableRow>)}</TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="monthly" className="calc-card overflow-x-auto max-h-[500px] overflow-y-auto">
          <div className="flex justify-end mb-3">
            <Button variant="outline" size="sm" onClick={exportMonthly}>
              <Download className="h-4 w-4 mr-1" />Download CSV
            </Button>
          </div>
          <Table>
            <TableHeader><TableRow><TableHead>#</TableHead><TableHead className="text-right">Payment ({ccy})</TableHead><TableHead className="text-right">Principal ({ccy})</TableHead><TableHead className="text-right">Interest ({ccy})</TableHead><TableHead className="text-right">Balance ({ccy})</TableHead></TableRow></TableHeader>
            <TableBody>{amort.map((r) => <TableRow key={r.period}><TableCell>{r.period}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(r.payment)}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(r.principal)}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(r.interest)}</TableCell><TableCell className="text-right font-mono">{fmtCurrency(r.balance)}</TableCell></TableRow>)}</TableBody>
          </Table>
        </TabsContent>
      </Tabs>}
    </CalcShell>
  );
}
