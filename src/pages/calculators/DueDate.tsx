import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { findCalc } from "@/data/calculators";

const meta = findCalc("due-date")!;
const fmt = (d: Date) => d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

export default function DueDate() {
  const [lmp, setLmp] = useState(() => new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10));
  const [cycle, setCycle] = useState(28);

  const r = useMemo(() => {
    const start = new Date(lmp);
    if (isNaN(+start)) return null;
    const adj = cycle - 28;
    const due = new Date(start);
    due.setDate(due.getDate() + 280 + adj);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - start.getTime()) / 86400000);
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    const tri = weeks < 13 ? "1st trimester" : weeks < 27 ? "2nd trimester" : "3rd trimester";
    const conception = new Date(start);
    conception.setDate(conception.getDate() + 14 + adj);
    return { due, weeks, days, tri, conception, daysLeft: Math.ceil((due.getTime() - today.getTime()) / 86400000) };
  }, [lmp, cycle]);

  return (
    <CalcShell meta={meta} about={<p>Estimates your due date using Naegele's rule (LMP + 280 days), adjusted for non-28-day cycles. For medical decisions, consult a clinician — ultrasound dating is more accurate.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="First day of last menstrual period (LMP)"><Input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} /></Field>
          <Field label="Average cycle length" suffix="days"><Input type="number" value={cycle} onChange={(e) => setCycle(+e.target.value || 28)} /></Field>
        </div>
        <div className="space-y-3">
          {r ? (<>
            <ResultStat highlight label="Estimated due date" value={fmt(r.due)} hint={`${r.daysLeft > 0 ? `${r.daysLeft} days to go` : `${-r.daysLeft} days overdue`}`} />
            <ResultStat label="Gestational age" value={`${r.weeks}w ${r.days}d`} hint={r.tri} />
            <ResultStat label="Conception (est.)" value={fmt(r.conception)} />
          </>) : <p className="text-muted-foreground text-sm">Enter a valid LMP date.</p>}
        </div>
      </div>
    </CalcShell>
  );
}
