import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc } from "@/components/math/common";
const meta = findCalc("long-division")!;
export default function LongDivision() {
  const [a, setA] = useState(1234); const [b, setB] = useState(7);
  const q = b === 0 ? NaN : Math.trunc(a / b);
  const r = b === 0 ? NaN : a - q * b;
  return (
    <CalcShell meta={meta} about={<p>Integer division with quotient and remainder.</p>}>
      <Two
        inputs={<><Field label="Dividend"><NumIn value={a} onChange={setA} step="1" /></Field><Field label="Divisor"><NumIn value={b} onChange={setB} step="1" /></Field></>}
        results={<>
          <ResultStat highlight label="Quotient" value={isFinite(q) ? String(q) : "—"} />
          <ResultStat label="Remainder" value={isFinite(r) ? String(r) : "—"} />
          <ResultStat label="Decimal" value={b === 0 ? "—" : (a / b).toFixed(6)} />
        </>}
      />
    </CalcShell>
  );
}
