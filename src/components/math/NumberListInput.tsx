import { useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { parseNumberList } from "@/lib/parseList";

interface Props {
  value: string;
  onChange: (s: string) => void;
  rows?: number;
  label?: string;
  hint?: string;
}

/**
 * Shared list input for math calculators. Accepts numbers separated by commas,
 * spaces, tabs, semicolons or newlines. Shows live count + invalid tokens.
 */
export default function NumberListInput({
  value,
  onChange,
  rows = 6,
  label = "Numbers",
  hint = "Separate with commas, spaces or new lines. Paste from Excel works.",
}: Props) {
  const { values, invalid } = useMemo(() => parseNumberList(value), [value]);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <span className="text-[11px] text-muted-foreground">
          {values.length} value{values.length === 1 ? "" : "s"}
          {invalid.length > 0 && (
            <span className="text-destructive ml-2">• {invalid.length} invalid</span>
          )}
        </span>
      </div>
      <Textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono text-sm"
        placeholder="e.g. 4, 8, 15, 16, 23, 42"
      />
      <p className="text-[11px] text-muted-foreground">{hint}</p>
      {invalid.length > 0 && (
        <p className="text-[11px] text-destructive">
          Ignored: {invalid.slice(0, 6).join(", ")}
          {invalid.length > 6 ? "…" : ""}
        </p>
      )}
    </div>
  );
}

export { parseNumberList };
