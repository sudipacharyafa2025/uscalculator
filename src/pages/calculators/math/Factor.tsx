import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("factor")!;
function factors(n: number) { const f: number[] = []; n = Math.abs(Math.round(n)); if (n === 0) return [0]; for (let i = 1; i <= Math.sqrt(n); i++) if (n % i === 0) { f.push(i); if (i !== n / i) f.push(n / i); } return f.sort((a, b) => a - b); }
export default function Factor() {
  const [n, setN] = useState(48);
  const f = factors(n);
  return (
    <CalcShell meta={meta} about={<p>List all positive integer factors of a number.</p>}>
      <Two
        inputs={<Field label="Number"><NumIn value={n} onChange={setN} step="1" /></Field>}
        results={<>
          <ResultStat highlight label={`Factors of ${n}`} value={f.join(", ")} />
          <ResultStat label="Count" value={String(f.length)} />
        </>}
      />
    </CalcShell>
  );
}
