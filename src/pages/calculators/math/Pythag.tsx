import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("pythagorean")!;
export default function Pythag() {
  const [a, setA] = useState(3); const [b, setB] = useState(4);
  const c = Math.sqrt(a * a + b * b);
  return (
    <CalcShell meta={meta} about={<p>For a right triangle: c² = a² + b².</p>}>
      <Two
        inputs={<><Field label="Leg a"><NumIn value={a} onChange={setA} /></Field><Field label="Leg b"><NumIn value={b} onChange={setB} /></Field></>}
        results={<ResultStat highlight label="Hypotenuse c" value={num(c, 6)} />}
      />
    </CalcShell>
  );
}
