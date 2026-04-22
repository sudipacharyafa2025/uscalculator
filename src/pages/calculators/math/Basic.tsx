import { useState } from "react";
import CalcShell from "@/components/CalcShell";
import { Button } from "@/components/ui/button";
import { findCalc } from "@/data/calculators";
const meta = findCalc("basic")!;
export default function Basic() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);

  const press = (k: string) => {
    if (reset) { setDisplay(k === "." ? "0." : k); setReset(false); return; }
    if (display === "0" && k !== ".") setDisplay(k);
    else if (k === "." && display.includes(".")) return;
    else setDisplay(display + k);
  };
  const apply = (a: number, b: number, o: string) => {
    if (o === "+") return a + b; if (o === "−") return a - b; if (o === "×") return a * b; if (o === "÷") return b === 0 ? NaN : a / b; return b;
  };
  const setOpClick = (o: string) => {
    const v = parseFloat(display);
    if (acc !== null && op && !reset) { const r = apply(acc, v, op); setAcc(r); setDisplay(String(r)); }
    else setAcc(v);
    setOp(o); setReset(true);
  };
  const equals = () => { if (acc === null || op === null) return; const r = apply(acc, parseFloat(display), op); setDisplay(isFinite(r) ? String(r) : "Error"); setAcc(null); setOp(null); setReset(true); };
  const clear = () => { setDisplay("0"); setAcc(null); setOp(null); setReset(false); };

  const keys: [string, string][] = [["C", "destructive"], ["±", "outline"], ["%", "outline"], ["÷", "secondary"],
    ["7", "outline"], ["8", "outline"], ["9", "outline"], ["×", "secondary"],
    ["4", "outline"], ["5", "outline"], ["6", "outline"], ["−", "secondary"],
    ["1", "outline"], ["2", "outline"], ["3", "outline"], ["+", "secondary"],
    ["0", "outline"], [".", "outline"], ["=", "default"]];
  return (
    <CalcShell meta={meta} about={<p>A basic four-function calculator.</p>}>
      <div className="max-w-sm mx-auto calc-card">
        <div className="bg-muted/50 rounded-lg p-4 mb-3 text-right text-3xl font-mono font-bold text-primary truncate">{display}</div>
        <div className="grid grid-cols-4 gap-2">
          {keys.map(([k, v]) => (
            <Button key={k}
              variant={v as any}
              className={`${k === "0" ? "col-span-2" : ""} ${k === "=" ? "bg-accent text-accent-foreground hover:bg-accent/90" : ""}`}
              onClick={() => {
                if (k === "C") clear();
                else if (k === "=") equals();
                else if ("+−×÷".includes(k)) setOpClick(k);
                else if (k === "±") setDisplay(String(-parseFloat(display)));
                else if (k === "%") setDisplay(String(parseFloat(display) / 100));
                else press(k);
              }}>{k}</Button>
          ))}
        </div>
      </div>
    </CalcShell>
  );
}
