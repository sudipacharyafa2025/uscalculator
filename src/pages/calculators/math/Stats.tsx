import { useMemo, useState } from "react";
import { CalcShell, ResultStat, findCalc, num } from "@/components/math/common";
import NumberListInput, { parseNumberList } from "@/components/math/NumberListInput";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportCsv } from "@/lib/csv";

const meta = findCalc("statistics")!;
export default function Stats() {
  const [text, setText] = useState("4, 8, 15, 16, 23, 42");
  const r = useMemo(() => {
    const { values } = parseNumberList(text);
    const a = [...values].sort((x, y) => x - y);
    const n = a.length; if (!n) return null;
    const mean = a.reduce((s, x) => s + x, 0) / n;
    const median = n % 2 ? a[Math.floor(n / 2)] : (a[n / 2 - 1] + a[n / 2]) / 2;
    const counts = new Map<number, number>(); a.forEach((x) => counts.set(x, (counts.get(x) || 0) + 1));
    const maxC = Math.max(...counts.values());
    const mode = maxC === 1 ? "—" : [...counts.entries()].filter(([, c]) => c === maxC).map(([v]) => v).join(", ");
    const variance = a.reduce((s, x) => s + (x - mean) ** 2, 0) / n;
    const sampVar = n > 1 ? a.reduce((s, x) => s + (x - mean) ** 2, 0) / (n - 1) : NaN;
    return { sorted: a, n, sum: mean * n, mean, median, mode, min: a[0], max: a[n - 1], range: a[n - 1] - a[0], variance, sampVar, sd: Math.sqrt(variance), sampSd: Math.sqrt(sampVar) };
  }, [text]);

  const exportCSV = () => {
    if (!r) return;
    exportCsv({
      calculator: "statistics", title: "Statistics Calculator",
      scenario: `${r.n} values`, units: "unitless",
      blocks: [
        {
          title: "Summary statistics",
          headers: ["Metric", "Value"],
          rows: [
            ["Count", r.n], ["Sum", r.sum], ["Mean", r.mean], ["Median", r.median], ["Mode", String(r.mode)],
            ["Min", r.min], ["Max", r.max], ["Range", r.range],
            ["Variance (population)", r.variance], ["Std Dev (population)", r.sd],
            ["Variance (sample)", r.sampVar], ["Std Dev (sample)", r.sampSd],
          ],
        },
        {
          title: "Sorted dataset",
          headers: ["Index", "Value (sorted)"],
          rows: r.sorted.map((v, i) => [i + 1, v]),
        },
      ],
    });
  };

  return (
    <CalcShell meta={meta} about={<p>Descriptive statistics for a dataset: count, sum, mean, median, mode, range, variance and standard deviation. Paste numbers from any spreadsheet — separators (commas, spaces, tabs, newlines) are auto-detected.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card">
          <NumberListInput value={text} onChange={setText} />
        </div>
        {r ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <ResultStat highlight label="Mean" value={num(r.mean)} />
              <ResultStat label="Median" value={num(r.median)} />
              <ResultStat label="Mode" value={String(r.mode)} />
              <ResultStat label="Std deviation (sample)" value={num(r.sampSd)} />
              <ResultStat label="Variance (sample)" value={num(r.sampVar)} />
              <ResultStat label="Range" value={num(r.range)} />
              <ResultStat label="Min / Max" value={`${num(r.min)} / ${num(r.max)}`} />
              <ResultStat label="Count" value={String(r.n)} />
            </div>
            <Button onClick={exportCSV} variant="outline" className="w-full sm:w-auto"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
          </div>
        ) : <p className="text-muted-foreground text-sm">Enter at least one number.</p>}
      </div>
    </CalcShell>
  );
}
