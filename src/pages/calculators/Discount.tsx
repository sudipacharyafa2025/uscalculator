import { useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { findCalc } from "@/data/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";
import { validateAll } from "@/lib/validate";

const meta = findCalc("discount")!;

export default function Discount() {
  const { format: fmtCurrency } = useCurrency();
  const [inputs, setInputs] = useState({ price: "", pct: "" });
  const [calc, setCalc] = useState<{ price: number; pct: number } | null>(null);

  const { errors } = validateAll(inputs, {
    price: { label: "Original price", required: true, min: 0 },
    pct: { label: "Discount", required: true, min: 0, max: 100 },
  });

  const calculate = () => {
    if (Object.keys(errors).length > 0) {
      setCalc(null);
      return;
    }
    setCalc({ price: Number(inputs.price), pct: Number(inputs.pct) });
  };

  const save = calc ? (calc.price * calc.pct) / 100 : 0;
  const final = calc ? calc.price - save : 0;

  return (
    <CalcShell meta={meta} about={<p>Final price = original price x (1 - discount%). Useful for sales, coupons and promotions.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-3xl">
        <div className="calc-card space-y-4">
          <Field label="Original price" prefix="$" required error={errors.price}>
            <Input type="number" value={inputs.price} onChange={(e) => setInputs((p) => ({ ...p, price: e.target.value }))} />
          </Field>
          <Field label="Discount" suffix="%" required error={errors.pct}>
            <Input type="number" step="0.01" value={inputs.pct} onChange={(e) => setInputs((p) => ({ ...p, pct: e.target.value }))} />
          </Field>
          <Button onClick={calculate}>Calculate</Button>
        </div>
        <div className="space-y-3">
          {!calc ? (
            <p className="text-sm text-muted-foreground">Fill the fields and click Calculate to view results.</p>
          ) : (
            <>
              <ResultStat label="You save" value={fmtCurrency(save)} />
              <ResultStat highlight label="Final price" value={fmtCurrency(final)} />
            </>
          )}
        </div>
      </div>
    </CalcShell>
  );
}
