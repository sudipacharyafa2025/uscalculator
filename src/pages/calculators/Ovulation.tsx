import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findCalc } from "@/data/calculators";

const meta = findCalc("ovulation")!;
const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });

export default function Ovulation() {
  const [lmp, setLmp] = useState(() => new Date().toISOString().slice(0, 10));
  const [cycle, setCycle] = useState(28);
  const [lutealLen, setLutealLen] = useState(14);

  const r = useMemo(() => {
    const start = new Date(lmp);
    if (isNaN(+start)) return null;
    const ovDay = cycle - lutealLen;
    const ov = new Date(start); ov.setDate(ov.getDate() + ovDay);
    const fertileStart = new Date(ov); fertileStart.setDate(fertileStart.getDate() - 5);
    const fertileEnd = new Date(ov); fertileEnd.setDate(fertileEnd.getDate() + 1);
    const nextPeriod = new Date(start); nextPeriod.setDate(nextPeriod.getDate() + cycle);
    const dueDate = new Date(start); dueDate.setDate(dueDate.getDate() + 280 + (cycle - 28));
    return { ov, fertileStart, fertileEnd, nextPeriod, dueDate };
  }, [lmp, cycle, lutealLen]);

  return (
    <CalcShell meta={meta} about={<p>Predicts ovulation and the fertile window from your last period. Sperm survives ~5 days; the egg ~24 hours, giving a ~6-day fertile window each cycle.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="First day of last period"><Input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} /></Field>
          <Field label="Cycle length" suffix="days"><Input type="number" value={cycle} onChange={(e) => setCycle(+e.target.value || 28)} /></Field>
          <Field label="Luteal phase length" suffix="days" hint="Default 14 days for most people">
            <Input type="number" value={lutealLen} onChange={(e) => setLutealLen(+e.target.value || 14)} />
          </Field>
        </div>
        <div className="space-y-3">
          {r ? (<>
            <ResultStat highlight label="Predicted ovulation" value={fmt(r.ov)} />
            <ResultStat label="Fertile window" value={`${fmt(r.fertileStart)} – ${fmt(r.fertileEnd)}`} hint="Highest chance of conception" />
            <ResultStat label="Next period" value={fmt(r.nextPeriod)} />
            <ResultStat label="If conception this cycle" value={fmt(r.dueDate)} hint="Estimated due date" />
          </>) : <p className="text-muted-foreground text-sm">Enter a valid date.</p>}
        </div>
      </div>
    </CalcShell>
  );
}
