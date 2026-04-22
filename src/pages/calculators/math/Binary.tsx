import { useState } from "react";
import { CalcShell, Field, ResultStat, Two, findCalc } from "@/components/math/common";
import { Input } from "@/components/ui/input";
const meta = findCalc("binary")!;
function toBin(n: number) { return (n >>> 0).toString(2); }
export default function Binary() {
  const [dec, setDec] = useState("42");
  const [bin, setBin] = useState("101010");
  const [hex, setHex] = useState("2A");
  return (
    <CalcShell meta={meta} about={<p>Convert between binary, decimal and hexadecimal. Edit any field to update the others.</p>}>
      <Two
        inputs={<>
          <Field label="Decimal">
            <Input value={dec} onChange={(e) => { setDec(e.target.value); const n = parseInt(e.target.value, 10); if (!isNaN(n)) { setBin(toBin(n)); setHex(n.toString(16).toUpperCase()); } }} />
          </Field>
          <Field label="Binary">
            <Input value={bin} onChange={(e) => { setBin(e.target.value); const n = parseInt(e.target.value, 2); if (!isNaN(n)) { setDec(String(n)); setHex(n.toString(16).toUpperCase()); } }} />
          </Field>
          <Field label="Hex">
            <Input value={hex} onChange={(e) => { setHex(e.target.value); const n = parseInt(e.target.value, 16); if (!isNaN(n)) { setDec(String(n)); setBin(toBin(n)); } }} />
          </Field>
        </>}
        results={<>
          <ResultStat label="Decimal" value={dec} />
          <ResultStat label="Binary" value={bin} />
          <ResultStat label="Hex" value={hex} />
        </>}
      />
    </CalcShell>
  );
}
