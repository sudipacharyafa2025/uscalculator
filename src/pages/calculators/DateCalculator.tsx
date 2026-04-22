import { useEffect, useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findCalc } from "@/data/calculators";

const meta = findCalc("date-calculator")!;

function diffParts(from: Date, to: Date) {
  let f = new Date(from), t = new Date(to);
  if (f > t) [f, t] = [t, f];
  let years = t.getFullYear() - f.getFullYear();
  let months = t.getMonth() - f.getMonth();
  let days = t.getDate() - f.getDate();
  if (days < 0) {
    months -= 1;
    const prev = new Date(t.getFullYear(), t.getMonth(), 0).getDate();
    days += prev;
  }
  if (months < 0) { years -= 1; months += 12; }
  let hours = t.getHours() - f.getHours();
  let minutes = t.getMinutes() - f.getMinutes();
  let seconds = t.getSeconds() - f.getSeconds();
  if (seconds < 0) { minutes -= 1; seconds += 60; }
  if (minutes < 0) { hours -= 1; minutes += 60; }
  if (hours < 0) { days -= 1; hours += 24; }
  return { years, months, days, hours, minutes, seconds };
}

export default function DateCalculator() {
  const [mode, setMode] = useState<"between" | "add">("between");
  const [start, setStart] = useState(() => new Date(Date.now() - 365 * 86400000).toISOString().slice(0, 16));
  const [end, setEnd] = useState(() => new Date().toISOString().slice(0, 16));
  const [addAmt, setAddAmt] = useState(30);
  const [addUnit, setAddUnit] = useState<"days" | "weeks" | "months" | "years">("days");

  // Live ticker for "until today"
  const [, force] = useState(0);
  useEffect(() => { const id = setInterval(() => force((x) => x + 1), 1000); return () => clearInterval(id); }, []);

  const between = useMemo(() => {
    const f = new Date(start);
    const t = mode === "between" ? new Date(end) : new Date();
    if (isNaN(+f) || isNaN(+t)) return null;
    const totalMs = Math.abs(t.getTime() - f.getTime());
    const totalSec = Math.floor(totalMs / 1000);
    const totalMin = Math.floor(totalSec / 60);
    const totalHr = Math.floor(totalMin / 60);
    const totalDay = Math.floor(totalHr / 24);
    const totalWeek = Math.floor(totalDay / 7);
    return { parts: diffParts(f, t), totalSec, totalMin, totalHr, totalDay, totalWeek };
  }, [start, end, mode]);

  const added = useMemo(() => {
    const f = new Date(start); if (isNaN(+f)) return null;
    const d = new Date(f);
    if (addUnit === "days") d.setDate(d.getDate() + addAmt);
    if (addUnit === "weeks") d.setDate(d.getDate() + addAmt * 7);
    if (addUnit === "months") d.setMonth(d.getMonth() + addAmt);
    if (addUnit === "years") d.setFullYear(d.getFullYear() + addAmt);
    return d;
  }, [start, addAmt, addUnit]);

  return (
    <CalcShell meta={meta} about={<p>Compute the duration between two dates in years, months, days, hours, minutes and seconds — or add/subtract a duration from a date. Updates live every second when comparing to today.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="between">Between dates</TabsTrigger>
              <TabsTrigger value="add">Add / subtract</TabsTrigger>
            </TabsList>
          </Tabs>
          <Field label="Start date & time"><Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} /></Field>
          {mode === "between" ? (
            <Field label="End date & time (leave today for live)"><Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Amount"><Input type="number" value={addAmt} onChange={(e) => setAddAmt(+e.target.value || 0)} /></Field>
              <Field label="Unit">
                <select className="w-full h-10 rounded-md border border-input bg-background px-3" value={addUnit} onChange={(e) => setAddUnit(e.target.value as any)}>
                  <option value="days">Days</option><option value="weeks">Weeks</option>
                  <option value="months">Months</option><option value="years">Years</option>
                </select>
              </Field>
            </div>
          )}
          {mode === "between" && (
            <button type="button" onClick={() => setEnd(new Date().toISOString().slice(0, 16))} className="text-xs text-accent hover:underline">Set end to now</button>
          )}
        </div>

        {mode === "between" ? (
          <div className="lg:col-span-3 space-y-3">
            {between ? (<>
              <div className="calc-card">
                <div className="text-xs uppercase text-muted-foreground mb-2">Duration</div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                  {[
                    ["Years", between.parts.years], ["Months", between.parts.months], ["Days", between.parts.days],
                    ["Hours", between.parts.hours], ["Min", between.parts.minutes], ["Sec", between.parts.seconds],
                  ].map(([k, v]) => (
                    <div key={k as string} className="bg-muted/40 rounded-lg p-3">
                      <div className="text-2xl font-bold text-primary tabular-nums">{v as number}</div>
                      <div className="text-[10px] uppercase text-muted-foreground tracking-wide">{k}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <ResultStat label="Total weeks" value={between.totalWeek.toLocaleString()} />
                <ResultStat label="Total days" value={between.totalDay.toLocaleString()} />
                <ResultStat label="Total hours" value={between.totalHr.toLocaleString()} />
                <ResultStat label="Total minutes" value={between.totalMin.toLocaleString()} />
                <ResultStat label="Total seconds" value={between.totalSec.toLocaleString()} />
              </div>
            </>) : <p className="text-muted-foreground text-sm">Enter valid dates.</p>}
          </div>
        ) : (
          <div className="lg:col-span-3 space-y-3">
            {added ? (
              <ResultStat highlight label="Result date" value={added.toLocaleString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })} />
            ) : <p className="text-muted-foreground text-sm">Enter a valid start date.</p>}
          </div>
        )}
      </div>
    </CalcShell>
  );
}
