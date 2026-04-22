import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc } from "@/components/math/common";
const meta = findCalc("prime-factorization")!;
function pf(n: number): number[] {
  n = Math.abs(Math.round(n)); const f: number[] = []; if (n < 2) return f;
  for (let p = 2; p * p <= n; p++) while (n % p === 0) { f.push(p); n /= p; }
  if (n > 1) f.push(n); return f;
}
export default function PrimeFact() {
  const [n, setN] = useState(360);
  const f = pf(n);
  // Group exponents
  const counts = new Map<number, number>(); f.forEach((p) => counts.set(p, (counts.get(p) || 0) + 1));
  const exp = [...counts.entries()].map(([p, c]) => c > 1 ? `${p}^${c}` : `${p}`).join(" × ");
  return (
    <CalcShell meta={meta} about={<p>Express a positive integer as a product of prime numbers.</p>}>
      <Two
        inputs={<Field label="Number"><NumIn value={n} onChange={setN} step="1" /></Field>}
        results={<>
          <ResultStat highlight label="Prime factorization" value={exp || "—"} />
          <ResultStat label="Prime factors" value={f.join(" × ") || "—"} />
        </>}
      />
    </CalcShell>
  );
}
