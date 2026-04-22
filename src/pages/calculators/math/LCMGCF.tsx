import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
const meta = findCalc("lcm-gcf")!;
function gcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); return b ? gcd(b, a % b) : a; }
export default function LCMGCF() {
  const [a, setA] = useState(12); const [b, setB] = useState(18);
  const g = gcd(a, b); const l = a && b ? Math.abs(a * b) / g : 0;
  return (
    <CalcShell meta={meta} about={<p>GCF (Greatest Common Factor) and LCM (Least Common Multiple) of two integers.</p>}>
      <Two
        inputs={<><Field label="A"><NumIn value={a} onChange={setA} step="1" /></Field><Field label="B"><NumIn value={b} onChange={setB} step="1" /></Field></>}
        results={<><ResultStat highlight label="GCF" value={String(g)} /><ResultStat label="LCM" value={num(l, 0)} /></>}
      />
    </CalcShell>
  );
}
