import { useEffect, useRef } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LENGTH_UNITS, LENGTH_LABELS, convertLength, type LengthUnit } from "@/lib/units";

interface Props {
  value: LengthUnit;
  onChange: (u: LengthUnit) => void;
  label?: string;
}

export default function UnitSelect({ value, onChange, label = "Unit" }: Props) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={(v) => onChange(v as LengthUnit)}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {LENGTH_UNITS.map((u) => (
            <SelectItem key={u} value={u}>{LENGTH_LABELS[u]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * Auto-convert a list of stateful length values when the unit changes.
 * Pass in the current unit + setters; on unit change, every value is rescaled
 * from the previous unit to the new one so the *physical quantity* is preserved.
 */
export function useLengthAutoConvert(
  unit: LengthUnit,
  fields: { value: number; set: (n: number) => void }[],
) {
  const prev = useRef<LengthUnit>(unit);
  useEffect(() => {
    if (prev.current === unit) return;
    const from = prev.current;
    fields.forEach((f) => {
      const next = convertLength(f.value, from, unit);
      f.set(+next.toFixed(6));
    });
    prev.current = unit;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);
}
