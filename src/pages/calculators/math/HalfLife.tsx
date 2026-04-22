import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("half-life")!;
export default function HalfLife() {
  const [n0, setN0] = useState(100); const [t, setT] = useState(10); const [half, setHalf] = useState(5);
  const remaining = n0 * Math.pow(0.5, t / half);
  const lambda = Math.log(2) / half;
  const meanLife = 1 / lambda;
  return (
    <CalcShell meta={meta} about={<p>Exponential decay. N(t) = N₀ × (½)^(t/T½). Decay constant λ = ln(2)/T½, mean lifetime τ = 1/λ.</p>}>
      <Two
        inputs={<>
          <Field label="Initial quantity N₀"><NumIn value={n0} onChange={setN0} /></Field>
          <Field label="Half-life (T½)"><NumIn value={half} onChange={setHalf} /></Field>
          <Field label="Elapsed time (t)"><NumIn value={t} onChange={setT} /></Field>
        </>}
        results={<>
          <ResultStat highlight label="Remaining quantity" value={num(remaining, 4)} />
          <ResultStat label="Decay constant λ" value={num(lambda, 6)} />
          <ResultStat label="Mean lifetime τ" value={num(meanLife, 4)} />
        </>}
      />
    </CalcShell>
  );
}
