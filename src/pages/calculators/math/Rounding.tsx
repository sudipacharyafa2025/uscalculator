import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
const meta = findCalc("rounding")!;
export default function Rounding() {
  const [x, setX] = useState(3.14159); const [d, setD] = useState(2); const [mode, setMode] = useState("round");
  const f = Math.pow(10, d);
  const fns: Record<string, (v: number) => number> = {
    round: (v) => Math.round(v * f) / f,
    floor: (v) => Math.floor(v * f) / f,
    ceil: (v) => Math.ceil(v * f) / f,
    trunc: (v) => Math.trunc(v * f) / f,
  };
  return (
    <CalcShell meta={meta} about={<p>Round, floor, ceiling or truncate a number to a chosen number of decimal places.</p>}>
      <Two
        inputs={<>
          <Field label="Number"><NumIn value={x} onChange={setX} /></Field>
          <Field label="Decimal places"><NumIn value={d} onChange={setD} step="1" /></Field>
          <Field label="Mode">
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="round">Round</SelectItem><SelectItem value="floor">Floor</SelectItem><SelectItem value="ceil">Ceiling</SelectItem><SelectItem value="trunc">Truncate</SelectItem></SelectContent>
            </Select>
          </Field>
        </>}
        results={<ResultStat highlight label="Result" value={num(fns[mode](x), Math.max(d, 0))} />}
      />
    </CalcShell>
  );
}
