import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

const COMMON = [
  { code: "USD", label: "US Dollar", locale: "en-US", symbol: "$" },
  { code: "CAD", label: "Canadian Dollar", locale: "en-CA", symbol: "CA$" },
  { code: "GBP", label: "British Pound", locale: "en-GB", symbol: "£" },
  { code: "EUR", label: "Euro", locale: "de-DE", symbol: "€" },
  { code: "AUD", label: "Australian Dollar", locale: "en-AU", symbol: "A$" },
  { code: "INR", label: "Indian Rupee", locale: "en-IN", symbol: "₹" },
  { code: "JPY", label: "Japanese Yen", locale: "ja-JP", symbol: "¥" },
  { code: "CNY", label: "Chinese Yuan", locale: "zh-CN", symbol: "¥" },
  { code: "CHF", label: "Swiss Franc", locale: "de-CH", symbol: "CHF" },
  { code: "SGD", label: "Singapore Dollar", locale: "en-SG", symbol: "S$" },
  { code: "HKD", label: "Hong Kong Dollar", locale: "en-HK", symbol: "HK$" },
  { code: "NZD", label: "New Zealand Dollar", locale: "en-NZ", symbol: "NZ$" },
  { code: "MXN", label: "Mexican Peso", locale: "es-MX", symbol: "MX$" },
  { code: "BRL", label: "Brazilian Real", locale: "pt-BR", symbol: "R$" },
  { code: "ZAR", label: "South African Rand", locale: "en-ZA", symbol: "R" },
  { code: "AED", label: "UAE Dirham", locale: "ar-AE", symbol: "د.إ" },
  { code: "SAR", label: "Saudi Riyal", locale: "ar-SA", symbol: "﷼" },
  { code: "SEK", label: "Swedish Krona", locale: "sv-SE", symbol: "kr" },
  { code: "NOK", label: "Norwegian Krone", locale: "nb-NO", symbol: "kr" },
  { code: "DKK", label: "Danish Krone", locale: "da-DK", symbol: "kr" },
  { code: "PLN", label: "Polish Zloty", locale: "pl-PL", symbol: "zł" },
  { code: "TRY", label: "Turkish Lira", locale: "tr-TR", symbol: "₺" },
  { code: "RUB", label: "Russian Ruble", locale: "ru-RU", symbol: "₽" },
  { code: "KRW", label: "South Korean Won", locale: "ko-KR", symbol: "₩" },
  { code: "THB", label: "Thai Baht", locale: "th-TH", symbol: "฿" },
  { code: "IDR", label: "Indonesian Rupiah", locale: "id-ID", symbol: "Rp" },
  { code: "PHP", label: "Philippine Peso", locale: "en-PH", symbol: "₱" },
  { code: "MYR", label: "Malaysian Ringgit", locale: "ms-MY", symbol: "RM" },
  { code: "VND", label: "Vietnamese Dong", locale: "vi-VN", symbol: "₫" },
  { code: "ILS", label: "Israeli Shekel", locale: "he-IL", symbol: "₪" },
];

export const CURRENCIES = COMMON;

interface CurrencyState {
  code: string;
  locale: string;
  symbol: string;
  setCode: (c: string) => void;
  format: (n: number, opts?: Intl.NumberFormatOptions) => string;
}

const Ctx = createContext<CurrencyState | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<string>(() => localStorage.getItem("calc.currency") || "USD");

  useEffect(() => {
    localStorage.setItem("calc.currency", code);
  }, [code]);

  const value = useMemo<CurrencyState>(() => {
    const meta = COMMON.find((c) => c.code === code) || COMMON[0];
    const formatter = new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: meta.code,
      maximumFractionDigits: 2,
    });
    return {
      code: meta.code,
      locale: meta.locale,
      symbol: meta.symbol,
      setCode,
      format: (n: number, opts?: Intl.NumberFormatOptions) => {
        if (!isFinite(n)) return "—";
        if (opts) {
          return new Intl.NumberFormat(meta.locale, { style: "currency", currency: meta.code, ...opts }).format(n);
        }
        return formatter.format(n);
      },
    };
  }, [code]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCurrency must be used within CurrencyProvider");
  return v;
}
