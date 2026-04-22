import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("slope")!;
export default function Slope() {
  const [x1, setX1] = useState(1); const [y1, setY1] = useState(2);
  const [x2, setX2] = useState(4); const [y2, setY2] = useState(8);
  const dx = x2 - x1; const dy = y2 - y1;
  const slope = dx === 0 ? NaN : dy / dx;
  const yInt = isFinite(slope) ? y1 - slope * x1 : NaN;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return (
    <CalcShell meta={meta} about={<p>Slope = (y₂−y₁)/(x₂−x₁). Equation y = mx + b uses the slope (m) and y-intercept (b).</p>}>
      <Two
        inputs={<>
          <Field label="x₁"><NumIn value={x1} onChange={setX1} /></Field>
          <Field label="y₁"><NumIn value={y1} onChange={setY1} /></Field>
          <Field label="x₂"><NumIn value={x2} onChange={setX2} /></Field>
          <Field label="y₂"><NumIn value={y2} onChange={setY2} /></Field>
        </>}
        results={<>
          <ResultStat highlight label="Slope (m)" value={num(slope)} />
          <ResultStat label="y-intercept (b)" value={num(yInt)} />
          <ResultStat label="Equation" value={isFinite(slope) ? `y = ${num(slope, 3)}x ${yInt >= 0 ? "+" : "−"} ${num(Math.abs(yInt), 3)}` : "vertical line"} />
          <ResultStat label="Distance" value={num(dist)} />
        </>}
      />
    </CalcShell>
  );
}
