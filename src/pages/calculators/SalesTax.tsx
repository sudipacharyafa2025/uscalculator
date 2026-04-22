import { useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findCalc } from "@/data/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { validateAll } from "@/lib/validate";

const meta = findCalc("sales-tax")!;

export default function SalesTax() {
  const { format: fmtCurrency } = useCurrency();
  const [inputs, setInputs] = useState({ price: "", rate: "" });
  const [calc, setCalc] = useState<{ price: number; rate: number } | null>(null);

  const { errors } = validateAll(inputs, {
    price: { label: "Pre-tax price", required: true, min: 0 },
    rate: { label: "Sales tax rate", required: true, min: 0, max: 100 },
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ price: Number(inputs.price), rate: Number(inputs.rate) });
  };

  const tax = calc ? (calc.price * calc.rate) / 100 : 0;

  return (
    <CalcShell meta={meta} about={<p>Add sales tax to a pre-tax price. Tax = price x rate. Total = price + tax.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-3xl">
        <div className="calc-card space-y-4">
          <Field label="Pre-tax price" prefix="$" required error={errors.price}>
            <Input type="number" value={inputs.price} onChange={(e) => setInputs((p) => ({ ...p, price: e.target.value }))} />
          </Field>
          <Field label="Sales tax rate" suffix="%" required error={errors.rate}>
            <Input type="number" step="0.01" value={inputs.rate} onChange={(e) => setInputs((p) => ({ ...p, rate: e.target.value }))} />
          </Field>
          <Button onClick={calculate}>Calculate</Button>
        </div>
        <div className="space-y-3">
          {!calc ? (
            <p className="text-sm text-muted-foreground">Fill the fields and click Calculate to view results.</p>
          ) : (
            <>
              <ResultStat label="Sales tax" value={fmtCurrency(tax)} />
              <ResultStat highlight label="Total price" value={fmtCurrency(calc.price + tax)} />
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
