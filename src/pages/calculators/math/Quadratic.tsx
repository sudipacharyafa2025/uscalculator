import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("quadratic")!;
export default function Quadratic() {
  const [a, setA] = useState(1); const [b, setB] = useState(-3); const [c, setC] = useState(2);
  const disc = b * b - 4 * a * c;
  let r1: any = "—", r2: any = "—", kind = "";
  if (a !== 0) {
    if (disc > 0) { r1 = num((-b + Math.sqrt(disc)) / (2 * a)); r2 = num((-b - Math.sqrt(disc)) / (2 * a)); kind = "Two real roots"; }
    else if (disc === 0) { r1 = r2 = num(-b / (2 * a)); kind = "One repeated root"; }
    else { const re = num(-b / (2 * a)); const im = num(Math.sqrt(-disc) / (2 * a)); r1 = `${re} + ${im}i`; r2 = `${re} − ${im}i`; kind = "Complex roots"; }
  }
  return (
    <CalcShell meta={meta} about={<p>Solves ax² + bx + c = 0 using the quadratic formula. Discriminant = b² − 4ac determines the nature of the roots.</p>}>
      <Two
        inputs={<>
          <Field label="a"><NumIn value={a} onChange={setA} /></Field>
          <Field label="b"><NumIn value={b} onChange={setB} /></Field>
          <Field label="c"><NumIn value={c} onChange={setC} /></Field>
        </>}
        results={<>
          <ResultStat highlight label="Root 1" value={String(r1)} />
          <ResultStat label="Root 2" value={String(r2)} />
          <ResultStat label="Discriminant" value={num(disc)} hint={kind} />
        </>}
      />
    </CalcShell>
  );
}
