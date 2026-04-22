import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
import UnitSelect, { useLengthAutoConvert } from "@/components/math/UnitSelect";
import type { LengthUnit } from "@/lib/units";

const meta = findCalc("distance")!;
export default function Distance() {
  const [unit, setUnit] = useState<LengthUnit>("ft");
  const [x1, setX1] = useState(0); const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(3); const [y2, setY2] = useState(4);
  useLengthAutoConvert(unit, [
    { value: x1, set: setX1 }, { value: y1, set: setY1 },
    { value: x2, set: setX2 }, { value: y2, set: setY2 },
  ]);
  const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return (
    <CalcShell meta={meta} about={<p>2D distance using d = √((x₂−x₁)² + (y₂−y₁)²). Switch units (ft / in / m / cm / km / mi …) and inputs auto-convert.</p>}>
      <Two
        inputs={<>
          <UnitSelect value={unit} onChange={setUnit} />
          <Field label={`x₁ (${unit})`}><NumIn value={x1} onChange={setX1} /></Field>
          <Field label={`y₁ (${unit})`}><NumIn value={y1} onChange={setY1} /></Field>
          <Field label={`x₂ (${unit})`}><NumIn value={x2} onChange={setX2} /></Field>
          <Field label={`y₂ (${unit})`}><NumIn value={y2} onChange={setY2} /></Field>
        </>}
        results={<ResultStat highlight label={`Distance (${unit})`} value={num(d, 6)} />}
      />
    </CalcShell>
  );
}
