import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findCalc } from "@/data/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { validateAll } from "@/lib/validate";
import { FINANCE_MAX_RATE_PCT } from "@/lib/financeBounds";

const meta = findCalc("cd")!;

interface Inputs {
  deposit: string;
  rate: string;
  months: string;
  compound: string;
}

interface Calc {
  deposit: number;
  rate: number;
  months: number;
  compound: number;
}

export default function CD() {
  const { format: fmt } = useCurrency();
  const [inputs, setInputs] = useState<Inputs>({ deposit: "", rate: "", months: "", compound: "12" });
  const [calc, setCalc] = useState<Calc | null>(null);

  const { errors } = validateAll(inputs, {
    deposit: { label: "Initial deposit", required: true, min: 0 },
    rate: { label: "Interest rate", required: true, min: 0, max: FINANCE_MAX_RATE_PCT },
    months: { label: "Term", required: true, min: 1, max: 1200, integer: true },
    compound: {
      label: "Compounds per year",
      required: true,
      custom: (n) => ([1, 2, 4, 12, 365].includes(n) ? null : "Choose a valid compounding frequency"),
    },
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({
      deposit: Number(inputs.deposit),
      rate: Number(inputs.rate),
      months: Number(inputs.months),
      compound: Number(inputs.compound),
    });
  };

  const r = useMemo(() => {
    if (!calc) return null;
    const n = calc.compound;
    const t = calc.months / 12;
    const fv = calc.deposit * Math.pow(1 + calc.rate / 100 / n, n * t);
    const apy = (Math.pow(1 + calc.rate / 100 / n, n) - 1) * 100;
    return { fv, interest: fv - calc.deposit, apy };
  }, [calc]);

  return (
    <CalcShell meta={meta} about={<p>Certificate of Deposit (CD) returns: A = P(1 + r/n)^(nt). APY reflects the effective annual yield given the compounding frequency.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Initial deposit" required error={errors.deposit}><Input type="number" value={inputs.deposit} onChange={(e) => setInputs((p) => ({ ...p, deposit: e.target.value }))} /></Field>
          <Field label="Interest rate" suffix="%" required error={errors.rate}><Input type="number" step="0.01" value={inputs.rate} onChange={(e) => setInputs((p) => ({ ...p, rate: e.target.value }))} /></Field>
          <Field label="Term (months)" required error={errors.months}><Input type="number" step="1" value={inputs.months} onChange={(e) => setInputs((p) => ({ ...p, months: e.target.value }))} /></Field>
          <Field label="Compounds per year" required error={errors.compound}>
            <Select value={inputs.compound} onValueChange={(v) => setInputs((p) => ({ ...p, compound: v }))}>
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
          <Button onClick={calculate}>Calculate</Button>
        </div>
        <div className="space-y-3">
          {!calc || !r ? (
            <p className="text-sm text-muted-foreground">Fill the fields and click Calculate to view results.</p>
          ) : (
            <>
              <ResultStat highlight label="Final balance" value={fmt(r.fv)} />
              <ResultStat label="Interest earned" value={fmt(r.interest)} />
              <ResultStat label="Effective APY" value={`${r.apy.toFixed(3)}%`} />
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
