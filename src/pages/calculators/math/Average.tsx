import { useMemo, useState } from "react";
import { CalcShell, ResultStat, findCalc, num } from "@/components/math/common";
import NumberListInput, { parseNumberList } from "@/components/math/NumberListInput";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportCsv } from "@/lib/csv";

const meta = findCalc("average")!;
export default function Average() {
  const [text, setText] = useState("10, 20, 30, 40, 50");
  const r = useMemo(() => {
    const { values } = parseNumberList(text);
    if (!values.length) return null;
    const sum = values.reduce((s, x) => s + x, 0);
    return { values, mean: sum / values.length, sum, n: values.length };
  }, [text]);

  const exportCSV = () => {
    if (!r) return;
    exportCsv({
      calculator: "average", title: "Average Calculator",
      scenario: `${r.n} values, mean ${num(r.mean)}`, units: "unitless",
      blocks: [
        {
          title: "Summary",
          headers: ["Metric", "Value"],
          rows: [["Count", r.n], ["Sum", r.sum], ["Average", r.mean]],
        },
        {
          title: "Dataset",
          headers: ["Index", "Value"],
          rows: r.values.map((v, i) => [i + 1, v]),
        },
      ],
    });
  };

  return (
    <CalcShell meta={meta} about={<p>Arithmetic mean (average) of a list of numbers.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card">
          <NumberListInput value={text} onChange={setText} />
        </div>
        <div className="space-y-3">{r ? <>
          <ResultStat highlight label="Average" value={num(r.mean)} />
          <ResultStat label="Sum" value={num(r.sum)} />
          <ResultStat label="Count" value={String(r.n)} />
          <Button onClick={exportCSV} variant="outline" className="w-full sm:w-auto"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
        </> : <p className="text-muted-foreground text-sm">Enter at least one number.</p>}</div>
      </div>
    </CalcShell>
  );
}
