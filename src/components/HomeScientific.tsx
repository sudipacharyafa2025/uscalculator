import { useState } from "react";
import { Button } from "@/components/ui/button";

const FN: Record<string, any> = {
  sin: (x: number) => Math.sin(x), cos: (x: number) => Math.cos(x), tan: (x: number) => Math.tan(x),
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sqrt: Math.sqrt, ln: Math.log, log: Math.log10, exp: Math.exp,
  abs: Math.abs, pi: Math.PI, e: Math.E,
  pow: Math.pow, fact: (n: number) => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; },
};

function evaluate(expr: string): string {
  if (!expr.trim()) return "0";
  try {
    const e = expr.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/\^/g, "**").replace(/π/g, "pi");
    const f = new Function(...Object.keys(FN), `return (${e});`);
    const v = f(...Object.values(FN));
    if (typeof v !== "number" || !isFinite(v)) return "Error";
    return String(+v.toPrecision(12));
  } catch { return "Error"; }
}

const KEYS: { k: string; v?: "op" | "fn" | "eq" | "clr"; cls?: string }[][] = [
  [{ k: "sin(", v: "fn" }, { k: "cos(", v: "fn" }, { k: "tan(", v: "fn" }, { k: "ln(", v: "fn" }, { k: "log(", v: "fn" }, { k: "C", v: "clr" }],
  [{ k: "asin(", v: "fn" }, { k: "acos(", v: "fn" }, { k: "atan(", v: "fn" }, { k: "π", v: "fn" }, { k: "e", v: "fn" }, { k: "⌫", v: "clr" }],
  [{ k: "(", v: "fn" }, { k: ")", v: "fn" }, { k: "^", v: "op" }, { k: "sqrt(", v: "fn" }, { k: "fact(", v: "fn" }, { k: "÷", v: "op" }],
  [{ k: "7" }, { k: "8" }, { k: "9" }, { k: "%", v: "op" }, { k: "exp(", v: "fn" }, { k: "×", v: "op" }],
  [{ k: "4" }, { k: "5" }, { k: "6" }, { k: "abs(", v: "fn" }, { k: "(", v: "fn" }, { k: "−", v: "op" }],
  [{ k: "1" }, { k: "2" }, { k: "3" }, { k: ")", v: "fn" }, { k: ".", }, { k: "+", v: "op" }],
  [{ k: "0" }, { k: "00" }, { k: "+/-", v: "fn" }, { k: "=", v: "eq" }],
];

export default function HomeScientific() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState<{ expr: string; res: string }[]>([]);

  const press = (k: string, kind?: string) => {
    if (kind === "clr") {
      if (k === "C") { setExpr(""); setResult("0"); }
      else setExpr((e) => e.slice(0, -1));
      return;
    }
    if (kind === "eq") {
      const r = evaluate(expr);
      setResult(r);
      if (r !== "Error" && expr) setHistory((h) => [{ expr, res: r }, ...h].slice(0, 8));
      return;
    }
    if (k === "+/-") { setExpr((e) => e ? `-(${e})` : "-"); return; }
    setExpr((e) => e + k);
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 calc-card">
        <div className="bg-muted/50 rounded-lg p-4 mb-4 text-right min-h-[5.5rem] flex flex-col justify-end">
          <div className="text-xs text-muted-foreground font-mono break-all min-h-[1rem]">{expr || "\u00A0"}</div>
          <div className="text-3xl sm:text-4xl font-bold font-mono text-primary tabular-nums truncate">{result}</div>
        </div>
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {KEYS.flat().map((b, i) => {
            const cls =
              b.v === "eq" ? "bg-accent text-accent-foreground hover:bg-accent/90 col-span-1" :
              b.v === "clr" ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20" :
              b.v === "op" ? "bg-secondary text-secondary-foreground" :
              b.v === "fn" ? "bg-muted text-foreground text-xs" : "";
            return (
              <Button
                key={i}
                variant={b.v === "eq" || b.v === "clr" || b.v === "op" ? "default" : "outline"}
                size="sm"
                className={`h-10 sm:h-12 text-sm font-medium ${cls}`}
                onClick={() => press(b.k, b.v)}
              >
                {b.k}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="calc-card overflow-hidden">
        <div className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">History</div>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">Calculations appear here.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {history.map((h, i) => (
              <li key={i} className="border-b border-border pb-1.5 last:border-0">
                <div className="text-xs text-muted-foreground truncate font-mono">{h.expr}</div>
                <button type="button" onClick={() => setExpr(h.res)} className="font-mono font-semibold text-primary hover:text-accent">= {h.res}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
