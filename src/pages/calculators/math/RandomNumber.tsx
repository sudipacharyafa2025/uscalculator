import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc } from "@/components/math/common";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportCsv } from "@/lib/csv";

const meta = findCalc("random-number")!;
export default function RandomNumber() {
  const [min, setMin] = useState(1); const [max, setMax] = useState(100);
  const [count, setCount] = useState(5); const [unique, setUnique] = useState(false);
  const [out, setOut] = useState<number[]>([]);
  const generate = () => {
    const lo = Math.ceil(Math.min(min, max)); const hi = Math.floor(Math.max(min, max));
    const n = Math.max(1, Math.min(count, 10000));
    if (unique && hi - lo + 1 < n) { setOut([]); return; }
    const set = new Set<number>(); const arr: number[] = [];
    while (arr.length < n) {
      const v = Math.floor(Math.random() * (hi - lo + 1)) + lo;
      if (unique) { if (!set.has(v)) { set.add(v); arr.push(v); } } else arr.push(v);
    }
    setOut(arr);
  };
  const exportCSV = () => {
    if (!out.length) return;
    exportCsv({
      calculator: "random-number", title: "Random Number Generator",
      scenario: `${out.length} integers in [${min}, ${max}]${unique ? ", unique" : ""}`, units: "unitless",
      blocks: [
        { title: "Parameters", headers: ["Min", "Max", "Count", "Unique"], rows: [[min, max, out.length, unique ? "yes" : "no"]] },
        { title: "Generated values", headers: ["Index", "Value"], rows: out.map((v, i) => [i + 1, v]) },
      ],
    });
  };
  return (
    <CalcShell meta={meta} about={<p>Generate random integers in a range. Toggle unique to draw without replacement. Export results as CSV.</p>}>
      <Two
        inputs={<>
          <Field label="Minimum"><NumIn value={min} onChange={setMin} step="1" /></Field>
          <Field label="Maximum"><NumIn value={max} onChange={setMax} step="1" /></Field>
          <Field label="How many (max 10,000)"><NumIn value={count} onChange={setCount} step="1" /></Field>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} /> Unique values</label>
          <Button onClick={generate} className="bg-accent text-accent-foreground hover:bg-accent/90">Generate</Button>
        </>}
        results={<>
          <ResultStat highlight label="Result" value={out.length ? (out.length > 50 ? out.slice(0, 50).join(", ") + " …" : out.join(", ")) : "Click Generate"} />
          {out.length > 0 && <Button onClick={exportCSV} variant="outline" className="w-full sm:w-auto"><Download className="h-4 w-4 mr-2" />Export CSV ({out.length} values)</Button>}
        </>}
      />
    </CalcShell>
  );
}
