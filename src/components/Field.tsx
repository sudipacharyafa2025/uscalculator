// Reusable Field component shared by calculators
import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { translateCalculatorText } from "@/i18n/calculatorText";

export default function Field({
  label, children, prefix, suffix, hint, error, required,
}: {
  label: string;
  children: ReactNode;
  prefix?: string;
  suffix?: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
}) {
  const { locale } = useLocale();
  const hasError = !!error;
  const translatedLabel = translateCalculatorText(locale, label);
  const translatedHint = hint ? translateCalculatorText(locale, hint) : hint;
  const translatedError = error ? translateCalculatorText(locale, error) : error;
  return (
    <div>
      <Label className="text-xs text-muted-foreground flex items-center gap-1">
        {translatedLabel}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative mt-1">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm z-10">{prefix}</span>}
        <div
          className={`${prefix ? "[&>input]:pl-7" : suffix ? "[&>input]:pr-10" : ""} ${
            hasError ? "[&>input]:border-destructive [&>input]:focus-visible:ring-destructive/40" : ""
          }`}
        >
          {children}
        </div>
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm z-10">{suffix}</span>}
      </div>
      {hasError ? (
        <div role="alert" className="text-xs text-destructive mt-1 flex items-start gap-1">
          <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
          <span>{translatedError}</span>
        </div>
      ) : (
        translatedHint && <div className="text-xs text-muted-foreground mt-1">{translatedHint}</div>
      )}
    </div>
  );
}
