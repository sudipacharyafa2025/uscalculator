import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("confidence-interval")!;
export default function CI() {
  const [mean, setMean] = useState(50); const [sd, setSd] = useState(10); const [n, setN] = useState(100); const [conf, setConf] = useState(95);
  const z = conf >= 99 ? 2.576 : conf >= 95 ? 1.96 : conf >= 90 ? 1.645 : 1.282;
  const se = sd / Math.sqrt(n);
  const moe = z * se;
  return (
    <CalcShell meta={meta} about={<p>CI = mean ± z × (σ/√n). With 95% confidence, the true mean lies in this interval (assuming normal sampling).</p>}>
      <Two
        inputs={<>
          <Field label="Sample mean"><NumIn value={mean} onChange={setMean} /></Field>
          <Field label="Std deviation (σ)"><NumIn value={sd} onChange={setSd} /></Field>
          <Field label="Sample size (n)"><NumIn value={n} onChange={setN} step="1" /></Field>
          <Field label="Confidence (%)"><NumIn value={conf} onChange={setConf} /></Field>
        </>}
        results={<>
          <ResultStat highlight label="Confidence interval" value={`${num(mean - moe)}, ${num(mean + moe)}`} />
          <ResultStat label="Margin of error" value={num(moe)} />
          <ResultStat label="Standard error" value={num(se)} />
        </>}
      />
    </CalcShell>
  );
}
