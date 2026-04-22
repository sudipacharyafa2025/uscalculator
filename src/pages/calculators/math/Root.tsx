import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("root")!;
export default function Root() {
  const [x, setX] = useState(64); const [n, setN] = useState(3);
  const v = x < 0 && n % 2 === 0 ? NaN : Math.sign(x) * Math.pow(Math.abs(x), 1 / n);
  return (
    <CalcShell meta={meta} about={<p>The nth root of x: ⁿ√x = x^(1/n).</p>}>
      <Two
        inputs={<><Field label="x"><NumIn value={x} onChange={setX} /></Field><Field label="n (root)"><NumIn value={n} onChange={setN} step="1" /></Field></>}
        results={<ResultStat highlight label={`${n}√${x}`} value={num(v, 8)} />}
      />
    </CalcShell>
  );
}
