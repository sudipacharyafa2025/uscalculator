import { useState } from "react";
import { CalcShell, Field, ResultStat, findCalc, num } from "@/components/math/common";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportCsv } from "@/lib/csv";
const meta = findCalc("matrix")!;
function parseMat(s: string): number[][] {
  return s.trim().split(/\n+/).map((row) => row.trim().split(/[,\s]+/).map(Number));
}
function fmt(m: number[][]) { return m.map((r) => r.map((v) => num(v, 4)).join("\t")).join("\n"); }
export default function Matrix() {
  const [a, setA] = useState("1 2\n3 4");
  const [b, setB] = useState("5 6\n7 8");
  const [op, setOp] = useState<"add" | "sub" | "mul" | "det" | "trans">("add");
  const A = parseMat(a); const B = parseMat(b);
  let result = "—";
  try {
    if (op === "add" && A.length === B.length && A[0].length === B[0].length)
      result = fmt(A.map((r, i) => r.map((v, j) => v + B[i][j])));
    else if (op === "sub" && A.length === B.length && A[0].length === B[0].length)
      result = fmt(A.map((r, i) => r.map((v, j) => v - B[i][j])));
    else if (op === "mul" && A[0].length === B.length) {
      const m = A.length, p = B[0].length, k = B.length;
      const out = Array.from({ length: m }, () => Array(p).fill(0));
      for (let i = 0; i < m; i++) for (let j = 0; j < p; j++) for (let x = 0; x < k; x++) out[i][j] += A[i][x] * B[x][j];
      result = fmt(out);
    } else if (op === "trans") result = fmt(A[0].map((_, j) => A.map((r) => r[j])));
    else if (op === "det" && A.length === A[0].length) result = num(det(A), 4);
  } catch { result = "Invalid input"; }
  return (
    <CalcShell meta={meta} about={<p>Matrix addition, subtraction, multiplication, transpose and determinant. Enter rows on separate lines, values separated by spaces or commas.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-3">
          <Field label="Matrix A"><Textarea rows={4} value={a} onChange={(e) => setA(e.target.value)} className="font-mono" /></Field>
          <Field label="Matrix B"><Textarea rows={4} value={b} onChange={(e) => setB(e.target.value)} className="font-mono" /></Field>
          <div className="flex gap-2 flex-wrap">
            {(["add", "sub", "mul", "trans", "det"] as const).map((o) => (
              <button key={o} type="button" onClick={() => setOp(o)} className={`px-3 py-1 text-sm rounded border ${op === o ? "bg-accent text-accent-foreground border-accent" : "border-border"}`}>{o === "trans" ? "trans A" : o === "det" ? "det A" : `A ${o}`}</button>
            ))}
          </div>
        </div>
        <div className="calc-card space-y-3">
          <div className="text-xs uppercase text-muted-foreground">Result</div>
          <pre className="font-mono text-sm whitespace-pre overflow-auto">{result}</pre>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const blocks = op === "det"
                ? [{ title: "Determinant", headers: ["det(A)"], rows: [[result]] as (string | number)[][] }]
                : [{
                    title: `Result of ${op === "trans" ? "transpose(A)" : `A ${op} B`}`,
                    headers: result.split("\n")[0].split("\t").map((_, i) => `col${i + 1}`),
                    rows: result.split("\n").map((line) => line.split("\t")) as (string | number)[][],
                  }];
              exportCsv({
                calculator: "matrix",
                title: "Matrix Calculator",
                scenario: `Operation: ${op}`,
                units: "scalar",
                blocks: [
                  { title: "Matrix A", headers: A[0]?.map((_, i) => `a${i + 1}`) ?? ["a"], rows: A as (string | number)[][] },
                  ...(op === "trans" || op === "det" ? [] : [{ title: "Matrix B", headers: B[0]?.map((_, i) => `b${i + 1}`) ?? ["b"], rows: B as (string | number)[][] }]),
                  ...blocks,
                ],
              }, op);
            }}
          >
            <Download className="h-4 w-4 mr-2" />Export CSV
          </Button>
        </div>
      </div>
    </CalcShell>
  );
}
function det(m: number[][]): number {
  const n = m.length; if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  let d = 0;
  for (let j = 0; j < n; j++) {
    const sub = m.slice(1).map((r) => r.filter((_, k) => k !== j));
    d += (j % 2 ? -1 : 1) * m[0][j] * det(sub);
  }
  return d;
}
