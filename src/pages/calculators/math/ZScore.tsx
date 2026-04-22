import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("z-score")!;
export default function ZScore() {
  const [x, setX] = useState(85); const [mean, setMean] = useState(70); const [sd, setSd] = useState(10);
  const z = sd === 0 ? NaN : (x - mean) / sd;
  // Approx normal CDF
  function cdf(v: number) {
    const t = 1 / (1 + 0.2316419 * Math.abs(v));
    const d = 0.3989423 * Math.exp(-v * v / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return v > 0 ? 1 - p : p;
  }
  const pct = isFinite(z) ? cdf(z) * 100 : NaN;
  return (
    <CalcShell meta={meta} about={<p>Z-score = (x − μ)/σ. Tells you how many standard deviations a value is from the mean.</p>}>
      <Two
        inputs={<>
          <Field label="Value (x)"><NumIn value={x} onChange={setX} /></Field>
          <Field label="Mean (μ)"><NumIn value={mean} onChange={setMean} /></Field>
          <Field label="Std deviation (σ)"><NumIn value={sd} onChange={setSd} /></Field>
        </>}
        results={<>
          <ResultStat highlight label="z-score" value={num(z, 4)} />
          <ResultStat label="Percentile" value={`${num(pct, 2)}%`} />
        </>}
      />
    </CalcShell>
  );
}
