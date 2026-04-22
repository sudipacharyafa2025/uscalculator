import { useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { findCalc } from "@/data/calculators";
import { useCurrency } from "@/contexts/CurrencyContext";

const meta = findCalc("tip")!;

export default function Tip() {
  const { format: fmtCurrency } = useCurrency();
  const [bill, setBill] = useState(50);
  const [pct, setPct] = useState(18);
  const [people, setPeople] = useState(2);
  const tip = bill * pct / 100;
  const total = bill + tip;
  const each = people > 0 ? total / people : total;
  return (
    <CalcShell meta={meta} about={<p>Calculate a tip and split a bill. Common rates: 15% (acceptable), 18% (good), 20%+ (excellent).</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-3xl">
        <div className="calc-card space-y-4">
          <Field label="Bill amount" prefix="$"><Input type="number" value={bill} onChange={(e) => setBill(+e.target.value || 0)} /></Field>
          <Field label="Tip" suffix="%"><Input type="number" step="1" value={pct} onChange={(e) => setPct(+e.target.value || 0)} /></Field>
          <div className="flex gap-2">{[10, 15, 18, 20, 25].map((p) => (
            <button key={p} type="button" onClick={() => setPct(p)} className={`px-3 py-1 rounded-md text-sm border ${pct === p ? "bg-accent text-accent-foreground border-accent" : "border-border hover:bg-muted"}`}>{p}%</button>
          ))}</div>
          <Field label="Split between"><Input type="number" value={people} onChange={(e) => setPeople(+e.target.value || 1)} /></Field>
        </div>
        <div className="space-y-3">
          <ResultStat label="Tip amount" value={fmtCurrency(tip)} />
          <ResultStat label="Total bill" value={fmtCurrency(total)} />
          <ResultStat highlight label="Per person" value={fmtCurrency(each)} />
        </div>
      </div>
    </CalcShell>
  );
}
