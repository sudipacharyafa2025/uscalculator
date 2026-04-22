import { useLocale } from "@/hooks/useLocale";
import { translateCalculatorText } from "@/i18n/calculatorText";

interface Props {
  label: string;
  value: string;
  highlight?: boolean;
  hint?: string;
}
export default function ResultStat({ label, value, highlight, hint }: Props) {
  const { locale } = useLocale();
  const translatedLabel = translateCalculatorText(locale, label);
  const translatedHint = hint ? translateCalculatorText(locale, hint) : hint;
  return (
    <div className={`rounded-lg p-4 border ${highlight ? "border-accent bg-accent-soft" : "border-border bg-muted/30"}`}>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{translatedLabel}</div>
      <div className={`text-xl sm:text-2xl font-bold mt-1 break-words ${highlight ? "text-accent" : "text-primary"}`}>{value}</div>
      {translatedHint && <div className="text-xs text-muted-foreground mt-1">{translatedHint}</div>}
    </div>
  );
}
