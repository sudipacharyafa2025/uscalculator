import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("scientific-notation")!;
export default function SciNotation() {
  const [v, setV] = useState(1234567);
  function toSci(x: number) {
    if (x === 0) return "0";
    const e = Math.floor(Math.log10(Math.abs(x)));
    const m = x / Math.pow(10, e);
    return `${num(m, 6)} × 10^${e}`;
  }
  return (
    <CalcShell meta={meta} about={<p>Convert a number to scientific notation: m × 10ⁿ where 1 ≤ |m| &lt; 10.</p>}>
      <Two
        inputs={<Field label="Number"><NumIn value={v} onChange={setV} /></Field>}
        results={<ResultStat highlight label="Scientific notation" value={toSci(v)} />}
      />
    </CalcShell>
  );
}
