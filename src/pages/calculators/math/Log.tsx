import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("log")!;
export default function Log() {
  const [x, setX] = useState(1000); const [base, setBase] = useState(10);
  const v = Math.log(x) / Math.log(base);
  return (
    <CalcShell meta={meta} about={<p>logₐ(x) = ln(x)/ln(a). Common bases: 10 (common log), e ≈ 2.71828 (natural log), 2 (binary log).</p>}>
      <Two
        inputs={<><Field label="x"><NumIn value={x} onChange={setX} /></Field><Field label="base"><NumIn value={base} onChange={setBase} /></Field></>}
        results={<>
          <ResultStat highlight label={`log_${base}(${x})`} value={num(v, 6)} />
          <ResultStat label="ln(x)" value={num(Math.log(x), 6)} />
          <ResultStat label="log₁₀(x)" value={num(Math.log10(x), 6)} />
        </>}
      />
    </CalcShell>
  );
}
