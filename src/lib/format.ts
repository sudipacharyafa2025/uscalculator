export const fmtCurrency = (n: number, currency = "USD") => {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);
};

export const fmtNumber = (n: number, digits = 2) => {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
};

export const fmtPercent = (n: number, digits = 2) => {
  if (!isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
};
