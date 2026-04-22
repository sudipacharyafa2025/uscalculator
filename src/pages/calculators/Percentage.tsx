import { useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findCalc } from "@/data/calculators";
import { fmtNumber } from "@/lib/format";

const meta = findCalc("percentage")!;

export default function Percentage() {
  return (
    <CalcShell meta={meta} about={<p>Three classic percentage problems: what is X% of Y, X is what % of Y, and percent change between two numbers.</p>}>
      <Tabs defaultValue="of" className="max-w-3xl">
        <TabsList>
          <TabsTrigger value="of">X% of Y</TabsTrigger>
          <TabsTrigger value="isof">X is what % of Y</TabsTrigger>
          <TabsTrigger value="change">% change</TabsTrigger>
        </TabsList>
        <TabsContent value="of"><A /></TabsContent>
        <TabsContent value="isof"><B /></TabsContent>
        <TabsContent value="change"><C /></TabsContent>
      </Tabs>
    </CalcShell>
  );
}

function A() {
  const [x, setX] = useState(20); const [y, setY] = useState(150);
  return <Pair label={`${x}% of ${y}`} value={fmtNumber(x * y / 100)}>
    <Field label="Percentage" suffix="%"><Input type="number" value={x} onChange={(e) => setX(+e.target.value || 0)} /></Field>
    <Field label="Of"><Input type="number" value={y} onChange={(e) => setY(+e.target.value || 0)} /></Field>
  </Pair>;
}
function B() {
  const [x, setX] = useState(30); const [y, setY] = useState(120);
  return <Pair label={`${x} is X% of ${y}`} value={`${fmtNumber(y === 0 ? 0 : x / y * 100)}%`}>
    <Field label="Number"><Input type="number" value={x} onChange={(e) => setX(+e.target.value || 0)} /></Field>
    <Field label="Out of"><Input type="number" value={y} onChange={(e) => setY(+e.target.value || 0)} /></Field>
  </Pair>;
}
function C() {
  const [x, setX] = useState(80); const [y, setY] = useState(100);
  const change = x === 0 ? 0 : (y - x) / Math.abs(x) * 100;
  return <Pair label="Percent change" value={`${change >= 0 ? "+" : ""}${fmtNumber(change)}%`}>
    <Field label="From"><Input type="number" value={x} onChange={(e) => setX(+e.target.value || 0)} /></Field>
    <Field label="To"><Input type="number" value={y} onChange={(e) => setY(+e.target.value || 0)} /></Field>
  </Pair>;
}
function Pair({ children, label, value }: { children: React.ReactNode; label: string; value: string }) {
  return (
    <div className="grid sm:grid-cols-2 gap-6 mt-4">
      <div className="calc-card space-y-4">{children}</div>
      <div><ResultStat highlight label={label} value={value} /></div>
    </div>
  );
}
