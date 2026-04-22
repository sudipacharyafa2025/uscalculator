import { useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportCsv } from "@/lib/csv";

const meta = findCalc("probability")!;
export default function Probability() {
  const [pa, setPa] = useState(0.4);
  const [pb, setPb] = useState(0.3);
  const both = pa * pb;
  const either = pa + pb - both;
  const neither = (1 - pa) * (1 - pb);
  const condAB = pb === 0 ? NaN : both / pb;
  const condBA = pa === 0 ? NaN : both / pa;

  const onExport = () => {
    exportCsv({
      calculator: "probability",
      title: "Probability Calculator",
      scenario: `P(A)=${pa}, P(B)=${pb}`,
      units: "probability (0–1)",
      blocks: [{
        title: "Event probabilities (independent A, B)",
        headers: ["Event", "Probability"],
        rows: [
          ["P(A)", pa],
          ["P(B)", pb],
          ["P(A and B)", both],
          ["P(A or B)", either],
          ["P(neither)", neither],
          ["P(A | B)", isFinite(condAB) ? condAB : ""],
          ["P(B | A)", isFinite(condBA) ? condBA : ""],
          ["P(only A)", pa - both],
          ["P(only B)", pb - both],
        ],
      }],
    });
  };

  return (
    <CalcShell meta={meta} about={<p>For independent events A and B: P(A∩B)=P(A)P(B), P(A∪B)=P(A)+P(B)−P(A∩B). Export the full event table as CSV.</p>}>
      <Two
        inputs={<>
          <Field label="P(A)" hint="Between 0 and 1"><NumIn value={pa} onChange={setPa} /></Field>
          <Field label="P(B)"><NumIn value={pb} onChange={setPb} /></Field>
          <Button onClick={onExport} variant="outline" className="w-full sm:w-auto"><Download className="h-4 w-4 mr-2" />Export CSV</Button>
        </>}
        results={<>
          <ResultStat highlight label="P(A and B)" value={num(both)} />
          <ResultStat label="P(A or B)" value={num(either)} />
          <ResultStat label="P(neither)" value={num(neither)} />
          <ResultStat label="P(A | B)" value={num(condAB)} />
        </>}
      />
    </CalcShell>
  );
}
