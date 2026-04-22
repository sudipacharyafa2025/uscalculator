import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UnitSelect, { useLengthAutoConvert } from "@/components/math/UnitSelect";
import { areaUnit, type LengthUnit } from "@/lib/units";

const meta = findCalc("area")!;
export default function Area() {
  const [shape, setShape] = useState("rect");
  const [unit, setUnit] = useState<LengthUnit>("ft");
  const [a, setA] = useState(5); const [b, setB] = useState(3); const [c, setC] = useState(4);
  useLengthAutoConvert(unit, [
    { value: a, set: setA }, { value: b, set: setB }, { value: c, set: setC },
  ]);
  let v = NaN, label = "";
  if (shape === "rect") { v = a * b; label = "Rectangle (a×b)"; }
  else if (shape === "square") { v = a * a; label = "Square (side a)"; }
  else if (shape === "triangle") { v = (a * b) / 2; label = "Triangle (base a, height b)"; }
  else if (shape === "circle") { v = Math.PI * a * a; label = "Circle (radius a)"; }
  else if (shape === "trapezoid") { v = ((a + b) * c) / 2; label = "Trapezoid (parallels a,b; height c)"; }
  else if (shape === "ellipse") { v = Math.PI * a * b; label = "Ellipse (semi-axes a,b)"; }
  else if (shape === "parallelogram") { v = a * b; label = "Parallelogram (base a, height b)"; }
  return (
    <CalcShell meta={meta} about={<p>Area formulas for common 2D shapes. Switch units (ft / in / m / cm / km …) and inputs auto-convert; results are in matching square units.</p>}>
      <Two
        inputs={<>
          <Field label="Shape">
            <Select value={shape} onValueChange={setShape}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["rect", "square", "triangle", "circle", "trapezoid", "ellipse", "parallelogram"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <UnitSelect value={unit} onChange={setUnit} />
          <Field label={`a (${unit})`}><NumIn value={a} onChange={setA} /></Field>
          {shape !== "square" && shape !== "circle" && <Field label={`b (${unit})`}><NumIn value={b} onChange={setB} /></Field>}
          {shape === "trapezoid" && <Field label={`c — height (${unit})`}><NumIn value={c} onChange={setC} /></Field>}
          <p className="text-xs text-muted-foreground">{label}</p>
        </>}
        results={<ResultStat highlight label={`Area (${areaUnit(unit)})`} value={num(v, 4)} />}
      />
    </CalcShell>
  );
}
