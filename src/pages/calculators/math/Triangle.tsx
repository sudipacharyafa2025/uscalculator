import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("triangle")!;
export default function Triangle() {
  const [a, setA] = useState(3); const [b, setB] = useState(4); const [c, setC] = useState(5);
  const valid = a + b > c && a + c > b && b + c > a;
  const s = (a + b + c) / 2;
  const area = valid ? Math.sqrt(s * (s - a) * (s - b) * (s - c)) : NaN;
  const perimeter = a + b + c;
  // Angles via law of cosines
  const A = valid ? Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180 / Math.PI : NaN;
  const B = valid ? Math.acos((a * a + c * c - b * b) / (2 * a * c)) * 180 / Math.PI : NaN;
  const C = valid ? 180 - A - B : NaN;
  return (
    <CalcShell meta={meta} about={<p>Compute area (Heron's formula), perimeter and interior angles (law of cosines) from three side lengths.</p>}>
      <Two
        inputs={<>
          <Field label="Side a"><NumIn value={a} onChange={setA} /></Field>
          <Field label="Side b"><NumIn value={b} onChange={setB} /></Field>
          <Field label="Side c"><NumIn value={c} onChange={setC} /></Field>
          {!valid && <p className="text-xs text-destructive">These sides cannot form a triangle.</p>}
        </>}
        results={<>
          <ResultStat highlight label="Area" value={num(area)} />
          <ResultStat label="Perimeter" value={num(perimeter)} />
          <ResultStat label="Angles (°)" value={valid ? `${num(A, 2)}, ${num(B, 2)}, ${num(C, 2)}` : "—"} />
        </>}
      />
    </CalcShell>
  );
}
