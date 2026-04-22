import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("sample-size")!;
export default function SampleSize() {
  const [conf, setConf] = useState(95); const [moe, setMoe] = useState(5); const [pop, setPop] = useState(10000); const [prop, setProp] = useState(50);
  const z = conf >= 99 ? 2.576 : conf >= 95 ? 1.96 : conf >= 90 ? 1.645 : 1.282;
  const p = prop / 100; const e = moe / 100;
  const n0 = (z * z * p * (1 - p)) / (e * e);
  const n = pop > 0 ? Math.ceil(n0 / (1 + (n0 - 1) / pop)) : Math.ceil(n0);
  return (
    <CalcShell meta={meta} about={<p>Cochran's formula with finite population correction. Used in survey planning.</p>}>
      <Two
        inputs={<>
          <Field label="Confidence level (%)"><NumIn value={conf} onChange={setConf} /></Field>
          <Field label="Margin of error (%)"><NumIn value={moe} onChange={setMoe} /></Field>
          <Field label="Population size"><NumIn value={pop} onChange={setPop} step="1" /></Field>
          <Field label="Response distribution (%)"><NumIn value={prop} onChange={setProp} /></Field>
        </>}
        results={<><ResultStat highlight label="Required sample size" value={String(n)} /><ResultStat label="z-score used" value={num(z, 3)} /></>}
      />
    </CalcShell>
  );
}
