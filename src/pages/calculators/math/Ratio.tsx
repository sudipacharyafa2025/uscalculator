import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("ratio")!;
function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : Math.abs(a); }
export default function Ratio() {
  const [a, setA] = useState(12); const [b, setB] = useState(18);
  const g = gcd(Math.round(a), Math.round(b)) || 1;
  return (
    <CalcShell meta={meta} about={<p>Simplify a ratio to its lowest terms by dividing both sides by their greatest common divisor.</p>}>
      <Two
        inputs={<><Field label="A"><NumIn value={a} onChange={setA} /></Field><Field label="B"><NumIn value={b} onChange={setB} /></Field></>}
        results={<>
          <ResultStat highlight label="Simplified" value={`${a / g} : ${b / g}`} />
          <ResultStat label="As decimal" value={num(b === 0 ? NaN : a / b)} />
          <ResultStat label="As percent" value={`${num(b === 0 ? NaN : (a / b) * 100, 2)}%`} />
        </>}
      />
    </CalcShell>
  );
}
