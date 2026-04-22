import { useState } from "react";
import CalcShell from "@/components/CalcShell";
import { Button } from "@/components/ui/button";
import { findCalc } from "@/data/calculators";

const meta = findCalc("scientific")!;

// Safe expression evaluator using Function constructor with whitelisted Math methods
const FN: Record<string, any> = {
  sin: (x: number) => Math.sin(x), cos: (x: number) => Math.cos(x), tan: (x: number) => Math.tan(x),
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sqrt: Math.sqrt, ln: Math.log, log: Math.log10, exp: Math.exp,
  abs: Math.abs, pi: Math.PI, e: Math.E,
  pow: Math.pow, fact: (n: number) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; },
};

function evaluate(expr: string): string {
  try {
    let e = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/\^/g, "**");
    e = e.replace(/π/g, "pi");
    const f = new Function(...Object.keys(FN), `return (${e});`);
    const v = f(...Object.values(FN));
    if (typeof v !== "number" || !isFinite(v)) return "Error";
    return String(+v.toPrecision(12));
  } catch {
    return "Error";
  }
}

export default function Scientific() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("0");

  const press = (s: string) => setExpr((e) => e + s);
  const calc = () => setResult(evaluate(expr || "0"));
  const clear = () => { setExpr(""); setResult("0"); };

  const keys = [
    ["sin(", "cos(", "tan(", "(", ")"],
    ["asin(", "acos(", "atan(", "ln(", "log("],
    ["π", "e", "^", "sqrt(", "fact("],
    ["7", "8", "9", "÷", "C"],
    ["4", "5", "6", "×", "⌫"],
    ["1", "2", "3", "−", "+"],
    ["0", ".", "%", "=", ""],
  ];

  return (
    <CalcShell meta={meta} about={<p>A scientific calculator supporting trig, logs, exponents, square roots, factorial and constants. Type expressions or use the keypad.</p>}>
      <div className="max-w-md mx-auto calc-card">
        <div className="bg-muted/50 rounded-lg p-3 mb-3 text-right">
          <div className="text-xs text-muted-foreground font-mono break-all min-h-[1rem]">{expr || "\u00A0"}</div>
          <div className="text-3xl font-bold font-mono text-primary">{result}</div>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {keys.flat().map((k, i) => {
            if (!k) return <div key={i} />;
            const isOp = ["÷", "×", "−", "+", "^", "%"].includes(k);
            const isEq = k === "=";
            const isClr = k === "C" || k === "⌫";
            return (
              <Button
                key={i}
                variant={isEq ? "default" : isClr ? "destructive" : isOp ? "secondary" : "outline"}
                className={isEq ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
                onClick={() => {
                  if (k === "C") clear();
                  else if (k === "⌫") setExpr((e) => e.slice(0, -1));
                  else if (k === "=") calc();
                  else press(k);
                }}
              >
                {k}
              </Button>
            );
          })}
        </div>
      </div>
    </CalcShell>
  );
}
