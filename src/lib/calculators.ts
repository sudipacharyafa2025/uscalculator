// Shared financial math utilities

export interface AmortRow {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

/** Standard fixed-rate loan monthly payment. rate = annual %, term in years */
export function monthlyPayment(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Convert an annual nominal rate and compounding frequency into an equivalent monthly rate. */
export function monthlyRateFromAnnualRate(annualRate: number, compoundsPerYear = 12): number {
  if (compoundsPerYear <= 0) return 0;
  return Math.pow(1 + annualRate / 100 / compoundsPerYear, compoundsPerYear / 12) - 1;
}

/** Convert an APY into an equivalent monthly rate. */
export function monthlyRateFromApy(apy: number): number {
  return Math.pow(1 + apy / 100, 1 / 12) - 1;
}

export function buildAmortization(
  principal: number,
  annualRate: number,
  years: number,
  extraMonthly = 0
): AmortRow[] {
  const r = annualRate / 100 / 12;
  const pmt = monthlyPayment(principal, annualRate, years);
  const rows: AmortRow[] = [];
  let balance = principal;
  let totalInterest = 0;
  const maxN = years * 12;
  for (let i = 1; i <= maxN && balance > 0.005; i++) {
    const interest = balance * r;
    let principalPaid = pmt - interest + extraMonthly;
    if (principalPaid > balance) principalPaid = balance;
    balance -= principalPaid;
    totalInterest += interest;
    rows.push({
      period: i,
      payment: principalPaid + interest,
      principal: principalPaid,
      interest,
      balance: Math.max(balance, 0),
      totalInterest,
    });
    if (balance <= 0) break;
  }
  return rows;
}

/** Aggregate amortization by year for compact display */
export function yearlyAmortization(rows: AmortRow[]) {
  const years: { year: number; principal: number; interest: number; balance: number }[] = [];
  let cur = { year: 1, principal: 0, interest: 0, balance: 0 };
  rows.forEach((r, idx) => {
    cur.principal += r.principal;
    cur.interest += r.interest;
    cur.balance = r.balance;
    if ((idx + 1) % 12 === 0 || idx === rows.length - 1) {
      years.push({ ...cur });
      cur = { year: cur.year + 1, principal: 0, interest: 0, balance: 0 };
    }
  });
  return years;
}

/** Future value of a series with periodic contributions */
export function futureValue(
  principal: number,
  annualRate: number,
  years: number,
  monthlyContribution = 0,
  compoundsPerYear = 12
): { fv: number; totalContrib: number; totalInterest: number; series: { year: number; balance: number; contributions: number }[] } {
  const monthlyRate = monthlyRateFromAnnualRate(annualRate, compoundsPerYear);
  const totalMonths = Math.max(0, Math.round(years * 12));
  const series: { year: number; balance: number; contributions: number }[] = [];
  let balance = principal;
  let contrib = principal;
  series.push({ year: 0, balance, contributions: contrib });
  for (let month = 1; month <= totalMonths; month++) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    contrib += monthlyContribution;
    if (month % 12 === 0 || month === totalMonths) {
      series.push({ year: month / 12, balance, contributions: contrib });
    }
  }
  return {
    fv: balance,
    totalContrib: contrib,
    totalInterest: balance - contrib,
    series,
  };
}
