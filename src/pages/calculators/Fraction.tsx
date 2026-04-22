import { useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findCalc } from "@/data/calculators";

const meta = findCalc("fraction")!;

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
function simplify(n: number, d: number) {
  if (d === 0) return { n: NaN, d: NaN };
  const g = gcd(n, d) || 1;
  let nn = n / g, dd = d / g;
  if (dd < 0) { nn = -nn; dd = -dd; }
  return { n: nn, d: dd };
}

export default function Fraction() {
  const [a, setA] = useState(1); const [b, setB] = useState(2);
  const [c, setC] = useState(1); const [d, setD] = useState(3);
  const [op, setOp] = useState("+");

  let n = 0, dn = 1;
  if (op === "+") { n = a * d + c * b; dn = b * d; }
  else if (op === "−") { n = a * d - c * b; dn = b * d; }
  else if (op === "×") { n = a * c; dn = b * d; }
  else if (op === "÷") { n = a * d; dn = b * c; }
  const s = simplify(n, dn);
  const dec = dn !== 0 ? n / dn : NaN;

  return (
    <CalcShell meta={meta} about={<p>Add, subtract, multiply or divide two fractions. Result is automatically simplified to lowest terms.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <div className="grid grid-cols-3 gap-2 items-center">
            <Field label="Num"><Input type="number" value={a} onChange={(e) => setA(+e.target.value || 0)} /></Field>
            <Field label="Op">
              <Select value={op} onValueChange={setOp}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["+", "−", "×", "÷"].map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Num"><Input type="number" value={c} onChange={(e) => setC(+e.target.value || 0)} /></Field>
            <Field label="Den"><Input type="number" value={b} onChange={(e) => setB(+e.target.value || 1)} /></Field>
            <div />
            <Field label="Den"><Input type="number" value={d} onChange={(e) => setD(+e.target.value || 1)} /></Field>
          </div>
        </div>
        <div className="space-y-3">
          <ResultStat highlight label="Result (simplified)" value={isFinite(s.n) ? `${s.n} / ${s.d}` : "—"} />
          <ResultStat label="Decimal" value={isFinite(dec) ? dec.toFixed(6).replace(/0+$/, "").replace(/\.$/, "") : "—"} />
        </div>
      </div>
    </CalcShell>
  );
}
