import { ReactNode } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { findCalc } from "@/data/calculators";

export { Input, Field, ResultStat, CalcShell, findCalc };

export function Two({ inputs, results, about }: { inputs: ReactNode; results: ReactNode; about?: ReactNode }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
      <div className="calc-card space-y-4">{inputs}</div>
      <div className="space-y-3">{results}</div>
    </div>
  );
}

export function NumIn({ value, onChange, step = "any" }: { value: number; onChange: (n: number) => void; step?: string }) {
  return <Input type="number" step={step} value={value} onChange={(e) => onChange(+e.target.value || 0)} />;
}

export const num = (n: number, d = 4) => isFinite(n) ? +n.toFixed(d) + "" : "—";
