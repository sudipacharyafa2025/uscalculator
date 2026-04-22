import { useMemo, useState } from "react";
import { CalcShell, ResultStat, findCalc, num } from "@/components/math/common";
import NumberListInput, { parseNumberList } from "@/components/math/NumberListInput";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportCsv } from "@/lib/csv";

const meta = findCalc("standard-deviation")!;
export default function StdDev() {
  const [text, setText] = useState("4, 8, 15, 16, 23, 42");
  const r = useMemo(() => {
    const { values } = parseNumberList(text); const n = values.length;
    if (!n) return null;
    const mean = values.reduce((s, x) => s + x, 0) / n;
    const sumSq = values.reduce((s, x) => s + (x - mean) ** 2, 0);
    return { values, n, mean, popVar: sumSq / n, sampVar: n > 1 ? sumSq / (n - 1) : NaN, sum: mean * n,
      popSd: Math.sqrt(sumSq / n), sampSd: n > 1 ? Math.sqrt(sumSq / (n - 1)) : NaN };
  }, [text]);

  const exportCSV = () => {
    if (!r) return;
    exportCsv({
      calculator: "standard-deviation", title: "Standard Deviation Calculator",
      scenario: `${r.n} values, mean ${num(r.mean)}`, units: "unitless",
      blocks: [
        {
          title: "Summary metrics",
          headers: ["Metric", "Value"],
          rows: [
            ["Count", r.n], ["Mean", r.mean], ["Sum", r.sum],
            ["Sample Std Dev (n-1)", r.sampSd], ["Population Std Dev (n)", r.popSd],
            ["Sample Variance", r.sampVar], ["Population Variance", r.popVar],
          ],
        },
        {
          title: "Per-value contribution",
          headers: ["Index", "Value", "Deviation from mean", "Squared deviation"],
          rows: r.values.map((v, i) => [i + 1, v, v - r.mean, (v - r.mean) ** 2]),
        },
      ],
    });
  };

  return (
    <CalcShell meta={meta} about={<p>Standard deviation measures the spread of a dataset. Sample SD divides by n−1 (Bessel's correction); population SD divides by n.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card">
          <NumberListInput value={text} onChange={setText} />
        </div>
        <div className="space-y-3">
          {r ? <>
            <ResultStat highlight label="Sample SD (n−1)" value={num(r.sampSd)} />
            <ResultStat label="Population SD (n)" value={num(r.popSd)} />
            <ResultStat label="Mean" value={num(r.mean)} />
            <ResultStat label="Count" value={String(r.n)} />
            <Button onClick={exportCSV} variant="outline" className="w-full sm:w-auto"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
          </> : <p className="text-muted-foreground text-sm">Enter at least one number.</p>}
        </div>
      </div>
    </CalcShell>
  );
}
