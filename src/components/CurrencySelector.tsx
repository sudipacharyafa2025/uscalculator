import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CurrencySelector({ compact = false }: { compact?: boolean }) {
  const { code, setCode } = useCurrency();
  return (
    <Select value={code} onValueChange={setCode}>
      <SelectTrigger className={compact ? "h-8 w-[110px] text-xs" : "h-9 w-[160px]"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {CURRENCIES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            <span className="font-mono mr-2">{c.code}</span>
            <span className="text-muted-foreground text-xs">{c.label}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
