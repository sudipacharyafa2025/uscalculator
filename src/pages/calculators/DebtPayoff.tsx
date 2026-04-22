import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import StepForm, { type Step } from "@/components/StepForm";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { findCalc } from "@/data/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { exportCsv } from "@/lib/csv";
import { validateAll } from "@/lib/validate";

const meta = findCalc("debt-payoff")!;

export default function DebtPayoff() {
  const { format: fmt, code: ccy } = useCurrency();
  const [balance, setBalance] = useState(15000);
  const [rate, setRate] = useState(18);
  const [payment, setPayment] = useState(400);
  const [calc, setCalc] = useState<{ balance: number; rate: number; payment: number } | null>(null);

  const { errors } = validateAll({ balance, rate, payment }, {
    balance: { label: "Balance", required: true, min: 0.01 },
    rate: { label: "APR", required: true, min: 0, max: 100 },
    payment: { label: "Payment", required: true, min: 0.01 },
  });

  const minPayment = calc ? (calc.balance * (calc.rate / 100 / 12)) + 1 : 0;
  const insufficient = calc ? calc.payment <= minPayment : false;

  const schedule = useMemo(() => {
    if (!calc) return [] as { month: number; payment: number; interest: number; principal: number; balance: number }[];
    const r = calc.rate / 100 / 12;
    const rows: { month: number; payment: number; interest: number; principal: number; balance: number }[] = [];
    let bal = calc.balance;
    for (let m = 1; m <= 600 && bal > 0.005; m++) {
      const interest = bal * r;
      const pay = Math.min(calc.payment, bal + interest);
      const principal = pay - interest;
      if (principal <= 0) {
        rows.push({ month: m, payment: pay, interest, principal: 0, balance: bal + interest - pay });
        if (m > 600) break;
        continue;
      }
      bal -= principal;
      rows.push({ month: m, payment: pay, interest, principal, balance: Math.max(bal, 0) });
    }
    return rows;
  }, [calc]);

  const totalInterest = schedule.reduce((s, x) => s + x.interest, 0);
  const months = schedule.length;

  const exportCSV = () => exportCsv({
    calculator: "debt-payoff", title: "Debt Payoff Calculator",
    scenario: `${fmt(calc?.balance ?? balance)} balance @ ${calc?.rate ?? rate}% APR, ${fmt(calc?.payment ?? payment)}/mo`, units: ccy,
    blocks: [{
      title: "Monthly payoff schedule",
      headers: ["Month", `Payment (${ccy})`, `Interest (${ccy})`, `Principal (${ccy})`, `Balance (${ccy})`],
      rows: schedule.map((r) => [r.month, r.payment.toFixed(2), r.interest.toFixed(2), r.principal.toFixed(2), r.balance.toFixed(2)]),
    }],
  });

  const steps: Step[] = [
    {
      id: "debt",
      title: "Debt",
      description: "Current balance and APR",
      valid: !errors.balance && !errors.rate,
      content: (
        <>
          <Field label="Current balance" prefix={ccy === "USD" ? "$" : ccy} required error={errors.balance}>
            <Input type="number" value={balance} onChange={(e) => setBalance(+e.target.value || 0)} />
          </Field>
          <Field label="Annual interest rate (APR)" suffix="%" required error={errors.rate}>
            <Input type="number" step="0.01" value={rate} onChange={(e) => setRate(+e.target.value || 0)} />
          </Field>
        </>
      ),
    },
    {
      id: "payment",
      title: "Payment plan",
      description: "How much you'll pay each month",
      valid: !errors.payment,
      errorSummary: insufficient ? `Payment is below monthly interest of ${fmt(minPayment - 1)}; balance will grow.` : undefined,
      content: (
        <Field label="Monthly payment" prefix={ccy === "USD" ? "$" : ccy} required error={errors.payment}>
          <Input type="number" value={payment} onChange={(e) => setPayment(+e.target.value || 0)} />
        </Field>
      ),
    },
  ];

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ balance, rate, payment });
  };

  const results = !calc ? (
    <div className="calc-card"><p className="text-sm text-muted-foreground">Click Calculate to show results.</p></div>
  ) : (
    <>
      <div className="grid sm:grid-cols-3 gap-3">
        <ResultStat highlight label="Payoff time" value={insufficient ? "Never" : `${Math.floor(months / 12)}y ${months % 12}m`} />
        <ResultStat label="Total interest" value={fmt(totalInterest)} />
        <ResultStat label="Total paid" value={fmt(calc.balance + totalInterest)} />
      </div>
      <Tabs defaultValue="table">
        <div className="flex items-center justify-between gap-3">
          <TabsList><TabsTrigger value="table">Schedule</TabsTrigger></TabsList>
          <Button onClick={exportCSV} variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />CSV</Button>
        </div>
        <TabsContent value="table" className="calc-card overflow-x-auto max-h-[480px] overflow-y-auto">
          <Table>
            <TableHeader><TableRow><TableHead>#</TableHead><TableHead className="text-right">Payment ({ccy})</TableHead><TableHead className="text-right">Interest ({ccy})</TableHead><TableHead className="text-right">Principal ({ccy})</TableHead><TableHead className="text-right">Balance ({ccy})</TableHead></TableRow></TableHeader>
            <TableBody>{schedule.slice(0, 240).map((r) => <TableRow key={r.month}><TableCell>{r.month}</TableCell><TableCell className="text-right font-mono">{fmt(r.payment)}</TableCell><TableCell className="text-right font-mono">{fmt(r.interest)}</TableCell><TableCell className="text-right font-mono">{fmt(r.principal)}</TableCell><TableCell className="text-right font-mono">{fmt(r.balance)}</TableCell></TableRow>)}</TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </>
  );

  return (
    <CalcShell meta={meta} about={<p>See how long it takes to pay off a debt at a fixed monthly payment, and how much interest you'll pay along the way. Increase your payment to dramatically reduce both.</p>}>
      <StepForm steps={steps} results={results} headerExtras={<Button size="sm" onClick={calculate}>Calculate</Button>} />
    </CalcShell>
  );
}
