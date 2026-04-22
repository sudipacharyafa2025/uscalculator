import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UnitSelect, { useLengthAutoConvert } from "@/components/math/UnitSelect";
import { areaUnit, type LengthUnit } from "@/lib/units";

const meta = findCalc("surface-area")!;
export default function SurfaceArea() {
  const [shape, setShape] = useState("cube");
  const [unit, setUnit] = useState<LengthUnit>("ft");
  const [a, setA] = useState(5); const [b, setB] = useState(3); const [c, setC] = useState(4);
  useLengthAutoConvert(unit, [
    { value: a, set: setA }, { value: b, set: setB }, { value: c, set: setC },
  ]);
  let v = NaN, label = "";
  if (shape === "cube") { v = 6 * a * a; label = "Cube (side a)"; }
  else if (shape === "box") { v = 2 * (a * b + b * c + a * c); label = "Box (a×b×c)"; }
  else if (shape === "sphere") { v = 4 * Math.PI * a * a; label = "Sphere (radius a)"; }
  else if (shape === "cylinder") { v = 2 * Math.PI * a * (a + b); label = "Cylinder (radius a, height b)"; }
  else if (shape === "cone") { v = Math.PI * a * (a + Math.sqrt(a * a + b * b)); label = "Cone (radius a, height b)"; }
  return (
    <CalcShell meta={meta} about={<p>Surface area formulas for common 3D shapes. Inputs auto-convert when you switch units.</p>}>
      <Two
        inputs={<>
          <Field label="Shape">
            <Select value={shape} onValueChange={setShape}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["cube", "box", "sphere", "cylinder", "cone"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <UnitSelect value={unit} onChange={setUnit} />
          <Field label={`a (${unit})`}><NumIn value={a} onChange={setA} /></Field>
          {(shape === "box" || shape === "cylinder" || shape === "cone") && <Field label={`b (${unit})`}><NumIn value={b} onChange={setB} /></Field>}
          {shape === "box" && <Field label={`c (${unit})`}><NumIn value={c} onChange={setC} /></Field>}
          <p className="text-xs text-muted-foreground">{label}</p>
        </>}
        results={<ResultStat highlight label={`Surface area (${areaUnit(unit)})`} value={num(v, 4)} />}
      />
    </CalcShell>
  );
}
