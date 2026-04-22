import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import StepForm, { type Step } from "@/components/StepForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findCalc } from "@/data/calculators";
import { buildAmortization, monthlyPayment } from "@/lib/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { validateAll } from "@/lib/validate";
import { FINANCE_MAX_RATE_PCT, FINANCE_MAX_YEARS } from "@/lib/financeBounds";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const meta = findCalc("auto-loan")!;

export default function AutoLoan() {
  const { format: fmtCurrency, code: ccy } = useCurrency();
  const [price, setPrice] = useState(35000);
  const [down, setDown] = useState(5000);
  const [tradeIn, setTradeIn] = useState(0);
  const [salesTax, setSalesTax] = useState(7);
  const [fees, setFees] = useState(500);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(7.5);
  const [calc, setCalc] = useState<{ price: number; down: number; tradeIn: number; salesTax: number; fees: number; years: number; rate: number } | null>(null);

  const { errors } = validateAll(
    { price, down, tradeIn, salesTax, fees, years, rate },
    {
      price: { label: "Auto price", required: true, min: 1 },
      down: { label: "Down payment", min: 0 },
      tradeIn: { label: "Trade-in", min: 0, max: price, custom: (n) => (n > price ? "Trade-in can't exceed auto price" : null) },
      salesTax: { label: "Sales tax", min: 0, max: 30 },
      fees: { label: "Fees", min: 0 },
      years: { label: "Loan term", required: true, min: 1, max: FINANCE_MAX_YEARS, integer: true },
      rate: { label: "Interest rate", required: true, min: 0, max: FINANCE_MAX_RATE_PCT },
    },
  );

  const taxableAmount = calc ? Math.max(calc.price - calc.tradeIn, 0) : 0;
  const taxAmt = calc ? taxableAmount * calc.salesTax / 100 : 0;
  const loan = calc ? Math.max(calc.price - calc.down - calc.tradeIn + taxAmt + calc.fees, 0) : 0;
  const pmt = calc ? monthlyPayment(loan, calc.rate, calc.years) : 0;
  const amort = useMemo(() => {
    if (!calc) return [];
    return buildAmortization(loan, calc.rate, calc.years);
  }, [calc, loan]);
  const totalInterest = amort.reduce((s, r) => s + r.interest, 0);

  const data = [
    { name: "Vehicle price", value: calc?.price ?? 0 },
    { name: "Sales tax", value: taxAmt },
    { name: "Fees", value: calc?.fees ?? 0 },
    { name: "Interest", value: totalInterest },
  ];
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  const steps: Step[] = [
    {
      id: "vehicle",
      title: "Vehicle",
      description: "Sticker price and down payment",
      valid: !errors.price,
      content: (
        <>
          <Field label="Auto price" prefix={ccy === "USD" ? "$" : ccy} required error={errors.price}>
            <Input type="number" value={price} onChange={(e) => setPrice(+e.target.value || 0)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Down payment" prefix={ccy === "USD" ? "$" : ccy} error={errors.down}>
              <Input type="number" value={down} onChange={(e) => setDown(+e.target.value || 0)} />
            </Field>
            <Field label="Trade-in" prefix={ccy === "USD" ? "$" : ccy} error={errors.tradeIn}>
              <Input type="number" value={tradeIn} onChange={(e) => setTradeIn(+e.target.value || 0)} />
            </Field>
          </div>
        </>
      ),
    },
    {
      id: "loan",
      title: "Loan terms",
      description: "Length and rate",
      valid: !errors.years && !errors.rate,
      content: (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Loan term (yr)" required error={errors.years}>
            <Input type="number" step="1" value={years} onChange={(e) => setYears(+e.target.value || 0)} />
          </Field>
          <Field label="Interest rate" suffix="%" required error={errors.rate}>
            <Input type="number" step="0.01" value={rate} onChange={(e) => setRate(+e.target.value || 0)} />
          </Field>
        </div>
      ),
    },
    {
      id: "extras",
      title: "Tax & fees",
      description: "Add-ons that increase the loan",
      content: (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Sales tax" suffix="%" error={errors.salesTax}>
            <Input type="number" step="0.01" value={salesTax} onChange={(e) => setSalesTax(+e.target.value || 0)} />
          </Field>
          <Field label="Title/fees" prefix={ccy === "USD" ? "$" : ccy} error={errors.fees}>
            <Input type="number" value={fees} onChange={(e) => setFees(+e.target.value || 0)} />
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
    setCalc({ price, down, tradeIn, salesTax, fees, years, rate });
  };

  const results = !calc ? (
    <div className="calc-card"><p className="text-sm text-muted-foreground">Click Calculate to show results.</p></div>
  ) : (
    <>
      <div className="grid sm:grid-cols-2 gap-3">
        <ResultStat highlight label="Monthly payment" value={fmtCurrency(pmt)} />
        <ResultStat label="Loan amount" value={fmtCurrency(loan)} />
        <ResultStat label="Total interest" value={fmtCurrency(totalInterest)} />
        <ResultStat label="Total cost" value={fmtCurrency(calc.price + taxAmt + calc.fees + totalInterest)} hint="Vehicle + tax + fees + interest" />
      </div>
      <div className="calc-card">
        <h3 className="font-semibold mb-3">Cost breakdown</h3>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
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
    <CalcShell meta={meta} about={<p>Estimate your monthly auto loan payment including sales tax, fees and trade-in value.</p>}>
      <StepForm steps={steps} results={results} headerExtras={<Button size="sm" onClick={calculate}>Calculate</Button>} />
    </CalcShell>
  );
}
