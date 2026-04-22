import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
import UnitSelect, { useLengthAutoConvert } from "@/components/math/UnitSelect";
import { areaUnit, type LengthUnit } from "@/lib/units";

const meta = findCalc("circle")!;
export default function Circle() {
  const [unit, setUnit] = useState<LengthUnit>("ft");
  const [r, setR] = useState(5);
  useLengthAutoConvert(unit, [{ value: r, set: setR }]);
  return (
    <CalcShell meta={meta} about={<p>From radius: diameter = 2r, circumference = 2πr, area = πr². Switch units and the radius auto-converts.</p>}>
      <Two
        inputs={<>
          <UnitSelect value={unit} onChange={setUnit} />
          <Field label={`Radius (${unit})`}><NumIn value={r} onChange={setR} /></Field>
        </>}
        results={<>
          <ResultStat highlight label={`Area (${areaUnit(unit)})`} value={num(Math.PI * r * r)} />
          <ResultStat label={`Circumference (${unit})`} value={num(2 * Math.PI * r)} />
          <ResultStat label={`Diameter (${unit})`} value={num(2 * r)} />
        </>}
      />
    </CalcShell>
  );
}
