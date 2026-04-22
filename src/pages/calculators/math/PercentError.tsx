import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("percent-error")!;
export default function PercentError() {
  const [obs, setObs] = useState(105); const [tru, setTru] = useState(100);
  const err = tru === 0 ? NaN : Math.abs((obs - tru) / tru) * 100;
  return (
    <CalcShell meta={meta} about={<p>Percent error = |observed − true| ÷ |true| × 100%. Used in experimental sciences to compare measurement to accepted value.</p>}>
      <Two
        inputs={<><Field label="Observed value"><NumIn value={obs} onChange={setObs} /></Field><Field label="True value"><NumIn value={tru} onChange={setTru} /></Field></>}
        results={<ResultStat highlight label="Percent error" value={isFinite(err) ? `${num(err, 4)}%` : "—"} />}
      />
    </CalcShell>
  );
}
