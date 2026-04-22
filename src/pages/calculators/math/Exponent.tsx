import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("exponent")!;
export default function Exponent() {
  const [base, setBase] = useState(2); const [exp, setExp] = useState(10);
  return (
    <CalcShell meta={meta} about={<p>Compute base^exponent for any real values, including fractional and negative exponents.</p>}>
      <Two
        inputs={<><Field label="Base"><NumIn value={base} onChange={setBase} /></Field><Field label="Exponent"><NumIn value={exp} onChange={setExp} /></Field></>}
        results={<ResultStat highlight label={`${base}^${exp}`} value={num(Math.pow(base, exp), 8)} />}
      />
    </CalcShell>
  );
}
