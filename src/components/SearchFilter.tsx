import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/hooks/useLocale";
import { translateCalculatorText } from "@/i18n/calculatorText";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  resultCount?: number;
}

export default function SearchFilter({ value, onChange, placeholder = "Search calculators…", resultCount }: Props) {
  const { locale } = useLocale();
  const translatedPlaceholder = translateCalculatorText(locale, placeholder);
  const translatedSearchLabel = translateCalculatorText(locale, "Search calculators");
  const translatedClearLabel = translateCalculatorText(locale, "Clear search");
  return (
    <div className="relative max-w-xl">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={translatedPlaceholder}
        className="pl-9 pr-9 h-11"
        aria-label={translatedSearchLabel}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={translatedClearLabel}
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {value && typeof resultCount === "number" && (
        <p className="absolute -bottom-6 left-0 text-xs text-muted-foreground">
          {resultCount} {translateCalculatorText(locale, resultCount === 1 ? "result" : "results")}
        </p>
      )}
    </div>
  );
}
