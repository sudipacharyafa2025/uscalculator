import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { findCalc } from "@/data/calculators";

const meta = findCalc("bmi")!;

const cats = [
  { name: "Underweight", min: 0, max: 18.5, color: "hsl(var(--chart-3))", advice: "Below WHO healthy range. Consider speaking with a healthcare provider." },
  { name: "Normal weight", min: 18.5, max: 25, color: "hsl(var(--chart-2))", advice: "You're in the WHO-defined healthy range. Maintain a balanced diet and regular activity." },
  { name: "Overweight", min: 25, max: 30, color: "hsl(var(--chart-4))", advice: "Above the WHO healthy range. Modest changes to diet and exercise can help." },
  { name: "Obese (Class I)", min: 30, max: 35, color: "hsl(20 90% 55%)", advice: "Increased health risk. Consider consulting a healthcare professional." },
  { name: "Obese (Class II)", min: 35, max: 40, color: "hsl(10 85% 50%)", advice: "High health risk. Medical guidance recommended." },
  { name: "Obese (Class III)", min: 40, max: 100, color: "hsl(var(--destructive))", advice: "Very high health risk. Medical guidance strongly recommended." },
];

export default function BMI() {
  const [unit, setUnit] = useState<"metric" | "us">("metric");
  const [hCm, setHCm] = useState(175);
  const [wKg, setWKg] = useState(72);
  const [hFt, setHFt] = useState(5);
  const [hIn, setHIn] = useState(9);
  const [wLb, setWLb] = useState(160);

  const { bmi, hM, kg } = useMemo(() => {
    if (unit === "metric") {
      const m = hCm / 100;
      return { bmi: m > 0 ? wKg / (m * m) : NaN, hM: m, kg: wKg };
    }
    const m = ((hFt * 12 + hIn) * 0.0254);
    const k = wLb * 0.453592;
    return { bmi: m > 0 ? k / (m * m) : NaN, hM: m, kg: k };
  }, [unit, hCm, wKg, hFt, hIn, wLb]);

  const cat = cats.find((c) => bmi >= c.min && bmi < c.max) || cats[cats.length - 1];
  const healthyMinKg = 18.5 * hM * hM;
  const healthyMaxKg = 24.9 * hM * hM;
  const showHealthyRange = unit === "metric"
    ? `${healthyMinKg.toFixed(1)} – ${healthyMaxKg.toFixed(1)} kg`
    : `${(healthyMinKg / 0.453592).toFixed(1)} – ${(healthyMaxKg / 0.453592).toFixed(1)} lb`;
  const diffToHealthy = kg < healthyMinKg ? healthyMinKg - kg
    : kg > healthyMaxKg ? kg - healthyMaxKg : 0;

  return (
    <CalcShell meta={meta} about={
      <>
        <p>BMI = weight (kg) ÷ height² (m²). It's a screening tool for population studies and doesn't distinguish muscle from fat. Categories follow the World Health Organization (WHO) standard.</p>
        <p>Your healthy weight range is calculated from your height: BMI 18.5 to 24.9 kg/m².</p>
      </>
    }>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <Tabs value={unit} onValueChange={(v) => setUnit(v as any)}>
            <TabsList className="w-full">
              <TabsTrigger value="metric" className="flex-1">Metric</TabsTrigger>
              <TabsTrigger value="us" className="flex-1">US units</TabsTrigger>
            </TabsList>
          </Tabs>
          {unit === "metric" ? (
            <>
              <Field label="Height" suffix="cm"><Input type="number" value={hCm} onChange={(e) => setHCm(+e.target.value || 0)} /></Field>
              <Field label="Weight" suffix="kg"><Input type="number" value={wKg} onChange={(e) => setWKg(+e.target.value || 0)} /></Field>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Height (ft)"><Input type="number" value={hFt} onChange={(e) => setHFt(+e.target.value || 0)} /></Field>
                <Field label="Height (in)"><Input type="number" value={hIn} onChange={(e) => setHIn(+e.target.value || 0)} /></Field>
              </div>
              <Field label="Weight" suffix="lb"><Input type="number" value={wLb} onChange={(e) => setWLb(+e.target.value || 0)} /></Field>
            </>
          )}
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="calc-card">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Your BMI</div>
                <div className="text-5xl font-bold mt-1 text-primary">{isFinite(bmi) ? bmi.toFixed(1) : "—"}</div>
              </div>
              <Badge
                className="text-sm px-3 py-1 rounded-full font-medium border-0"
                style={{ background: cat.color, color: "white" }}
              >
                WHO: {cat.name}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-3">{cat.advice}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <ResultStat highlight label="Healthy weight range" value={showHealthyRange} hint="BMI 18.5 – 24.9 for your height" />
            <ResultStat
              label={diffToHealthy === 0 ? "You're in range ✓" : kg < healthyMinKg ? "To reach healthy range" : "Above healthy range by"}
              value={diffToHealthy === 0 ? "—" : `${unit === "metric" ? diffToHealthy.toFixed(1) + " kg" : (diffToHealthy / 0.453592).toFixed(1) + " lb"}`}
            />
          </div>

          <div className="calc-card">
            <h3 className="font-semibold mb-3">WHO BMI scale</h3>
            <div className="space-y-2">
              {cats.map((c) => {
                const isMine = c.name === cat.name;
                return (
                  <div key={c.name} className={`flex items-center gap-3 p-2 rounded ${isMine ? "bg-accent-soft" : ""}`}>
                    <div className="w-32 text-sm font-medium" style={{ color: isMine ? c.color : undefined }}>{c.name}</div>
                    <div className="flex-1 h-3 rounded-full" style={{ background: c.color, opacity: isMine ? 1 : 0.3 }} />
                    <div className="text-xs font-mono text-muted-foreground w-24 text-right">
                      {c.min.toFixed(1)} – {c.max === 100 ? "40+" : c.max.toFixed(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </CalcShell>
  );
}
