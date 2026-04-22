import { useState } from "react";
import { CalcShell, Field, ResultStat, Two, findCalc } from "@/components/math/common";
import { Input } from "@/components/ui/input";
// Big number arithmetic using BigInt
const meta = findCalc("big-number")!;
export default function BigNum() {
  const [a, setA] = useState("12345678901234567890");
  const [b, setB] = useState("98765432109876543210");
  let add = "—", sub = "—", mul = "—", div = "—";
  try { const A = BigInt(a), B = BigInt(b); add = (A + B).toString(); sub = (A - B).toString(); mul = (A * B).toString(); div = B === 0n ? "—" : (A / B).toString(); } catch {}
  return (
    <CalcShell meta={meta} about={<p>Arbitrary-precision integer arithmetic using JavaScript BigInt. Supports very large whole numbers.</p>}>
      <Two
        inputs={<><Field label="A"><Input value={a} onChange={(e) => setA(e.target.value)} className="font-mono" /></Field><Field label="B"><Input value={b} onChange={(e) => setB(e.target.value)} className="font-mono" /></Field></>}
        results={<>
          <ResultStat highlight label="A + B" value={add} />
          <ResultStat label="A − B" value={sub} />
          <ResultStat label="A × B" value={mul} />
          <ResultStat label="A ÷ B (integer)" value={div} />
        </>}
      />
    </CalcShell>
  );
}
