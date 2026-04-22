import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findCalc } from "@/data/calculators";

const meta = findCalc("body-surface-area")!;

export default function BSA() {
  const [hCm, setHCm] = useState(175);
  const [wKg, setWKg] = useState(72);
  const [formula, setFormula] = useState<"mosteller" | "dubois" | "haycock">("mosteller");

  const r = useMemo(() => {
    const mosteller = Math.sqrt((hCm * wKg) / 3600);
    const dubois = 0.007184 * Math.pow(hCm, 0.725) * Math.pow(wKg, 0.425);
    const haycock = 0.024265 * Math.pow(hCm, 0.3964) * Math.pow(wKg, 0.5378);
    return { mosteller, dubois, haycock, value: { mosteller, dubois, haycock }[formula] };
  }, [hCm, wKg, formula]);

  return (
    <CalcShell meta={meta} about={<p>Body Surface Area (BSA) is widely used in clinical settings to dose chemotherapy and IV fluids. The Mosteller formula is the most-used due to its simplicity and accuracy.</p>}>
      <div className="grid lg:grid-cols-2 gap-6 max-w-4xl">
        <div className="calc-card space-y-4">
          <Field label="Height" suffix="cm"><Input type="number" value={hCm} onChange={(e) => setHCm(+e.target.value || 0)} /></Field>
          <Field label="Weight" suffix="kg"><Input type="number" value={wKg} onChange={(e) => setWKg(+e.target.value || 0)} /></Field>
          <Field label="Formula">
            <Select value={formula} onValueChange={(v) => setFormula(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="mosteller">Mosteller (recommended)</SelectItem>
                <SelectItem value="dubois">Du Bois & Du Bois</SelectItem>
                <SelectItem value="haycock">Haycock</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div className="space-y-3">
          <ResultStat highlight label={`BSA (${formula})`} value={`${r.value.toFixed(2)} m²`} />
          <ResultStat label="Mosteller" value={`${r.mosteller.toFixed(2)} m²`} />
          <ResultStat label="Du Bois" value={`${r.dubois.toFixed(2)} m²`} />
          <ResultStat label="Haycock" value={`${r.haycock.toFixed(2)} m²`} />
        </div>
      </div>
    </CalcShell>
  );
}
