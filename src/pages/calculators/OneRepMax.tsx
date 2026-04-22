import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { findCalc } from "@/data/calculators";

const meta = findCalc("one-rep-max")!;
// Multiple validated formulas
const formulas = {
  epley: (w: number, r: number) => w * (1 + r / 30),
  brzycki: (w: number, r: number) => w * 36 / (37 - r),
  lombardi: (w: number, r: number) => w * Math.pow(r, 0.10),
  oconner: (w: number, r: number) => w * (1 + 0.025 * r),
  mayhew: (w: number, r: number) => (100 * w) / (52.2 + 41.9 * Math.exp(-0.055 * r)),
};

export default function OneRepMax() {
  const [weight, setWeight] = useState(225);
  const [reps, setReps] = useState(5);
  const [unit, setUnit] = useState<"lb" | "kg">("lb");
  const [formula, setFormula] = useState<keyof typeof formulas>("epley");

  const r = useMemo(() => {
    const all = Object.fromEntries(Object.entries(formulas).map(([k, f]) => [k, f(weight, reps)]));
    const oneRm = (all as any)[formula];
    const pct = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
    return { oneRm, all, table: pct.map((p) => ({ pct: p, w: oneRm * p / 100 })) };
  }, [weight, reps, formula]);

  return (
    <CalcShell meta={meta} about={<p>Estimates your one-rep max from a submaximal lift. The Epley and Brzycki formulas are most popular for the 1–10 rep range. The percentage table helps program training volume.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Weight lifted"><Input type="number" value={weight} onChange={(e) => setWeight(+e.target.value || 0)} /></Field>
            <Field label="Unit">
              <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="lb">Pounds (lb)</SelectItem><SelectItem value="kg">Kilograms (kg)</SelectItem></SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Reps performed (1–10 best)"><Input type="number" value={reps} onChange={(e) => setReps(+e.target.value || 0)} /></Field>
          <Field label="Formula">
            <Select value={formula} onValueChange={(v) => setFormula(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="epley">Epley</SelectItem><SelectItem value="brzycki">Brzycki</SelectItem>
                <SelectItem value="lombardi">Lombardi</SelectItem><SelectItem value="oconner">O'Conner</SelectItem>
                <SelectItem value="mayhew">Mayhew</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="lg:col-span-3 space-y-3">
          <ResultStat highlight label={`Estimated 1RM (${formula})`} value={`${r.oneRm.toFixed(1)} ${unit}`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(r.all).map(([k, v]) => (
              <ResultStat key={k} label={k} value={`${(v as number).toFixed(1)} ${unit}`} />
            ))}
          </div>
          <div className="calc-card">
            <h3 className="font-semibold mb-2 text-sm">Training percentages</h3>
            <Table>
              <TableHeader><TableRow><TableHead>%1RM</TableHead><TableHead className="text-right">Weight ({unit})</TableHead><TableHead className="text-right">Typical reps</TableHead></TableRow></TableHeader>
              <TableBody>
                {r.table.map((row) => (
                  <TableRow key={row.pct}>
                    <TableCell>{row.pct}%</TableCell>
                    <TableCell className="text-right font-mono">{row.w.toFixed(1)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{row.pct >= 95 ? "1" : row.pct >= 90 ? "2-3" : row.pct >= 85 ? "4-6" : row.pct >= 75 ? "8-10" : row.pct >= 65 ? "12-15" : "15+"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </CalcShell>
  );
}
