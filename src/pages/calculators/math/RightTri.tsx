import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("right-triangle")!;
export default function RightTri() {
  const [a, setA] = useState(3); const [b, setB] = useState(4);
  const c = Math.sqrt(a * a + b * b);
  const A = Math.atan(a / b) * 180 / Math.PI;
  const B = 90 - A;
  const area = (a * b) / 2;
  return (
    <CalcShell meta={meta} about={<p>From two legs of a right triangle: hypotenuse, both acute angles, area and perimeter.</p>}>
      <Two
        inputs={<><Field label="Leg a"><NumIn value={a} onChange={setA} /></Field><Field label="Leg b"><NumIn value={b} onChange={setB} /></Field></>}
        results={<>
          <ResultStat highlight label="Hypotenuse" value={num(c)} />
          <ResultStat label="Angle opposite a" value={`${num(A, 2)}°`} />
          <ResultStat label="Angle opposite b" value={`${num(B, 2)}°`} />
          <ResultStat label="Area" value={num(area)} />
          <ResultStat label="Perimeter" value={num(a + b + c)} />
        </>}
      />
    </CalcShell>
  );
}
