import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UnitSelect, { useLengthAutoConvert } from "@/components/math/UnitSelect";
import { volumeUnit, type LengthUnit } from "@/lib/units";

const meta = findCalc("volume")!;
export default function Volume() {
  const [shape, setShape] = useState("cube");
  const [unit, setUnit] = useState<LengthUnit>("ft");
  const [a, setA] = useState(5); const [b, setB] = useState(3); const [c, setC] = useState(4);
  useLengthAutoConvert(unit, [
    { value: a, set: setA }, { value: b, set: setB }, { value: c, set: setC },
  ]);
  let v = NaN, label = "";
  if (shape === "cube") { v = a ** 3; label = "Cube (side a)"; }
  else if (shape === "box") { v = a * b * c; label = "Rectangular box (a×b×c)"; }
  else if (shape === "sphere") { v = (4 / 3) * Math.PI * a ** 3; label = "Sphere (radius a)"; }
  else if (shape === "cylinder") { v = Math.PI * a * a * b; label = "Cylinder (radius a, height b)"; }
  else if (shape === "cone") { v = (Math.PI * a * a * b) / 3; label = "Cone (radius a, height b)"; }
  else if (shape === "pyramid") { v = (a * b * c) / 3; label = "Pyramid (base a×b, height c)"; }
  return (
    <CalcShell meta={meta} about={<p>Volume formulas for common 3D shapes. Switch units (ft / in / m / cm …) and inputs auto-convert; result is in matching cubic units.</p>}>
      <Two
        inputs={<>
          <Field label="Shape">
            <Select value={shape} onValueChange={setShape}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["cube", "box", "sphere", "cylinder", "cone", "pyramid"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <UnitSelect value={unit} onChange={setUnit} />
          <Field label={`a (${unit})`}><NumIn value={a} onChange={setA} /></Field>
          {(shape === "box" || shape === "cylinder" || shape === "cone" || shape === "pyramid") && <Field label={`b (${unit})`}><NumIn value={b} onChange={setB} /></Field>}
          {(shape === "box" || shape === "pyramid") && <Field label={`c (${unit})`}><NumIn value={c} onChange={setC} /></Field>}
          <p className="text-xs text-muted-foreground">{label}</p>
        </>}
        results={<ResultStat highlight label={`Volume (${volumeUnit(unit)})`} value={num(v, 4)} />}
      />
    </CalcShell>
  );
}
