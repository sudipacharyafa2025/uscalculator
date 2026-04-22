import { useMemo, useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportCsv } from "@/lib/csv";

const meta = findCalc("number-sequence")!;
export default function Sequence() {
  const [type, setType] = useState("arith");
  const [first, setFirst] = useState(1); const [diff, setDiff] = useState(2); const [n, setN] = useState(10);
  const seq = useMemo(() => {
    const out: number[] = [];
    const count = Math.max(1, Math.min(Math.floor(n), 1000));
    for (let i = 0; i < count; i++) out.push(type === "arith" ? first + i * diff : type === "geom" ? first * Math.pow(diff, i) : type === "fib" ? fib(i + 1) : 0);
    return out;
  }, [type, first, diff, n]);
  const sum = seq.reduce((s, x) => s + x, 0);

  const exportCSV = () => {
    exportCsv({
      calculator: "number-sequence", title: "Number Sequence Calculator",
      scenario: `${type} sequence, ${seq.length} terms`, units: "unitless",
      blocks: [
        { title: "Summary", headers: ["Type", "Count", "Sum"], rows: [[type, seq.length, sum]] },
        { title: "Sequence", headers: ["Index (n)", "Term"], rows: seq.map((v, i) => [i + 1, v]) },
      ],
    }, type);
  };

  return (
    <CalcShell meta={meta} about={<p>Generate arithmetic, geometric or Fibonacci sequences and their sums. Export the full sequence as CSV.</p>}>
      <Two
        inputs={<>
          <Field label="Type">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="arith">Arithmetic</SelectItem><SelectItem value="geom">Geometric</SelectItem><SelectItem value="fib">Fibonacci</SelectItem></SelectContent>
            </Select>
          </Field>
          {type !== "fib" && <Field label="First term"><NumIn value={first} onChange={setFirst} /></Field>}
          {type !== "fib" && <Field label={type === "arith" ? "Common difference" : "Common ratio"}><NumIn value={diff} onChange={setDiff} /></Field>}
          <Field label="Number of terms (max 1000)"><NumIn value={n} onChange={setN} step="1" /></Field>
        </>}
        results={<>
          <ResultStat highlight label="Sequence" value={seq.slice(0, 30).map((x) => num(x, 4)).join(", ") + (seq.length > 30 ? " …" : "")} />
          <ResultStat label="Sum" value={num(sum)} />
          <ResultStat label="Last term" value={num(seq[seq.length - 1])} />
          <Button onClick={exportCSV} variant="outline" className="w-full sm:w-auto"><Download className="h-4 w-4 mr-2" />Export full sequence (CSV)</Button>
        </>}
      />
    </CalcShell>
  );
}
function fib(n: number): number { let a = 0, b = 1; for (let i = 0; i < n; i++) { const t = a + b; a = b; b = t; } return a; }
