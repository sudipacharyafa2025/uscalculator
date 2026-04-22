import { useMemo, useState } from "react";
import CalcShell from "@/components/CalcShell";
import ResultStat from "@/components/ResultStat";
import Field from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findCalc } from "@/data/calculators";

const meta = findCalc("pace")!;
// Distance helpers in meters
const DIST: Record<string, number> = {
  "5k": 5000, "10k": 10000, "halfmar": 21097.5, "marathon": 42195,
  "1mi": 1609.34, "5mi": 8046.72, "10mi": 16093.4, "custom": 0,
};

function fmtTime(seconds: number) {
  if (!isFinite(seconds) || seconds <= 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

export default function Pace() {
  const [hh, setHh] = useState(0);
  const [mm, setMm] = useState(45);
  const [ss, setSs] = useState(0);
  const [preset, setPreset] = useState("10k");
  const [customKm, setCustomKm] = useState(7);
  const [unit, setUnit] = useState<"km" | "mi">("km");

  const r = useMemo(() => {
    const totalSec = hh * 3600 + mm * 60 + ss;
    const meters = preset === "custom" ? customKm * 1000 : DIST[preset];
    if (totalSec <= 0 || meters <= 0) return null;
    const perKm = totalSec / (meters / 1000);
    const perMi = totalSec / (meters / 1609.34);
    const speedKph = (meters / 1000) / (totalSec / 3600);
    const speedMph = (meters / 1609.34) / (totalSec / 3600);
    const splits = [];
    const intervals = unit === "km" ? Math.ceil(meters / 1000) : Math.ceil(meters / 1609.34);
    const each = unit === "km" ? perKm : perMi;
    for (let i = 1; i <= Math.min(intervals, 42); i++) splits.push({ k: i, t: i * each });
    return { perKm, perMi, speedKph, speedMph, splits };
  }, [hh, mm, ss, preset, customKm, unit]);

  return (
    <CalcShell meta={meta} about={<p>Race pace calculator with split table for any distance from 1 mile to a marathon. Enter total time and distance to get pace per km, pace per mile, average speed and equal split times.</p>}>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 calc-card space-y-4">
          <div>
            <label className="text-xs text-muted-foreground">Total time (hh:mm:ss)</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <Input type="number" value={hh} onChange={(e) => setHh(+e.target.value || 0)} placeholder="hh" />
              <Input type="number" value={mm} onChange={(e) => setMm(+e.target.value || 0)} placeholder="mm" />
              <Input type="number" value={ss} onChange={(e) => setSs(+e.target.value || 0)} placeholder="ss" />
            </div>
          </div>
          <Field label="Distance">
            <Select value={preset} onValueChange={setPreset}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1mi">1 mile</SelectItem><SelectItem value="5k">5K</SelectItem>
                <SelectItem value="10k">10K</SelectItem><SelectItem value="halfmar">Half marathon</SelectItem>
                <SelectItem value="marathon">Marathon</SelectItem><SelectItem value="5mi">5 mi</SelectItem>
                <SelectItem value="10mi">10 mi</SelectItem><SelectItem value="custom">Custom (km)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          {preset === "custom" && <Field label="Distance" suffix="km"><Input type="number" value={customKm} onChange={(e) => setCustomKm(+e.target.value || 0)} /></Field>}
          <Field label="Splits unit">
            <Select value={unit} onValueChange={(v) => setUnit(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="km">Per km</SelectItem><SelectItem value="mi">Per mile</SelectItem></SelectContent>
            </Select>
          </Field>
        </div>
        <div className="lg:col-span-3 space-y-3">
          {r ? (<>
            <div className="grid sm:grid-cols-2 gap-3">
              <ResultStat highlight label="Pace per km" value={fmtTime(r.perKm)} hint="min/km" />
              <ResultStat highlight label="Pace per mile" value={fmtTime(r.perMi)} hint="min/mi" />
              <ResultStat label="Speed" value={`${r.speedKph.toFixed(2)} km/h`} hint={`${r.speedMph.toFixed(2)} mph`} />
            </div>
            <div className="calc-card">
              <h3 className="text-sm font-semibold mb-2">Splits ({unit})</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-sm font-mono">
                {r.splits.map((s) => (
                  <div key={s.k} className="bg-muted/40 rounded p-2 text-center">
                    <div className="text-xs text-muted-foreground">{s.k} {unit}</div>
                    <div>{fmtTime(s.t)}</div>
                  </div>
                ))}
              </div>
            </div>
          </>) : <p className="text-muted-foreground text-sm">Enter time and distance.</p>}
        </div>
      </div>
    </CalcShell>
  );
}
