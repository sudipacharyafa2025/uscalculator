import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("p-value")!;
// Uses standard normal approximation
function cdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}
export default function PValue() {
  const [z, setZ] = useState(1.96);
  const right = 1 - cdf(z);
  const left = cdf(z);
  const two = 2 * (1 - cdf(Math.abs(z)));
  return (
    <CalcShell meta={meta} about={<p>P-value from a z-score using the standard normal distribution. For α=0.05, p &lt; 0.05 is typically considered significant.</p>}>
      <Two
        inputs={<Field label="z-score"><NumIn value={z} onChange={setZ} /></Field>}
        results={<>
          <ResultStat highlight label="Two-tailed p" value={num(two, 6)} />
          <ResultStat label="Right-tailed p" value={num(right, 6)} />
          <ResultStat label="Left-tailed p" value={num(left, 6)} />
        </>}
      />
    </CalcShell>
  );
}
