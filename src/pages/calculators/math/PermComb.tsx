import { useMemo, useState } from "react";
import { CalcShell, Field, NumIn, ResultStat, Two, findCalc, num } from "@/components/math/common";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportCsv } from "@/lib/csv";

const meta = findCalc("permutation")!;
function fact(n: number): number { if (n < 0) return NaN; let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }

export default function PermComb() {
  const [n, setN] = useState(10);
  const [r, setR] = useState(3);

  const table = useMemo(() => {
    const N = Math.max(0, Math.min(Math.floor(n), 25));
    const rows: { r: number; P: number; C: number }[] = [];
    for (let k = 0; k <= N; k++) {
      rows.push({ r: k, P: fact(N) / fact(N - k), C: fact(N) / (fact(k) * fact(N - k)) });
    }
    return rows;
  }, [n]);

  const p = fact(n) / fact(n - r);
  const c = fact(n) / (fact(r) * fact(n - r));

  const onExport = () => {
    exportCsv({
      calculator: "permutation-combination",
      title: "Permutation & Combination Calculator",
      scenario: `n=${n}, r=${r}`,
      units: "count",
      blocks: [
        {
          title: "Selected result",
          headers: ["n", "r", "P(n,r) — Permutations", "C(n,r) — Combinations"],
          rows: [[n, r, p, c]],
        },
        {
          title: `Full table for n=${n} (r = 0…n)`,
          headers: ["r", "P(n,r) — Permutations", "C(n,r) — Combinations"],
          rows: table.map((t) => [t.r, t.P, t.C]),
        },
      ],
    }, `n${n}`);
  };

  return (
    <CalcShell meta={meta} about={<p>Permutations P(n,r) = n!/(n−r)! count ordered arrangements. Combinations C(n,r) = n!/(r!(n−r)!) count unordered selections. The full table for r = 0…n is exportable as CSV.</p>}>
      <Two
        inputs={<>
          <Field label="n"><NumIn value={n} onChange={setN} step="1" /></Field>
          <Field label="r"><NumIn value={r} onChange={setR} step="1" /></Field>
          <Button onClick={onExport} variant="outline" className="w-full sm:w-auto"><Download className="h-4 w-4 mr-2" />Export full table (CSV)</Button>
        </>}
        results={<>
          <ResultStat highlight label={`P(${n},${r})`} value={num(p, 0)} />
          <ResultStat label={`C(${n},${r})`} value={num(c, 0)} />
          <ResultStat label="n!" value={num(fact(n), 0)} />
        </>}
      />
    </CalcShell>
  );
}
