/**
 * Centralised SEO content per finance calculator: keyword-rich descriptions
 * and FAQ entries for FAQPage JSON-LD. Used by SEO.tsx via the `faq` prop.
 */
export interface FaqItem { q: string; a: string; }
export interface FinanceSeo { description: string; faq: FaqItem[]; }

export const FINANCE_SEO: Record<string, FinanceSeo> = {
  mortgage: {
    description: "Free mortgage calculator with PITI breakdown, PMI, taxes, insurance, full amortization schedule, and CSV export. Calculate your monthly home loan payment instantly.",
    faq: [
      { q: "How is a monthly mortgage payment calculated?", a: "It uses the standard amortization formula M = P·r(1+r)ⁿ / ((1+r)ⁿ−1), where P is the loan amount, r the monthly interest rate, and n the number of months." },
      { q: "When is PMI required?", a: "Lenders typically require Private Mortgage Insurance when your down payment is less than 20% (loan-to-value above 80%). It can be removed once equity reaches 20%." },
      { q: "What is included in PITI?", a: "PITI = Principal, Interest, property Taxes, and homeowner's Insurance — the four core components of a monthly mortgage payment." },
    ],
  },
  loan: {
    description: "Free loan calculator with full amortization table, total interest, monthly payment and CSV download. Works for personal, auto, student and home loans.",
    faq: [
      { q: "How do I lower the total interest paid?", a: "Choose a shorter term, make extra principal payments, or refinance at a lower rate. Even one extra payment per year significantly cuts total interest." },
      { q: "What is amortization?", a: "Amortization is the gradual repayment of a loan through fixed periodic payments. Each payment covers interest first; the remainder reduces principal." },
    ],
  },
  apr: {
    description: "APR calculator that includes loan fees and closing costs to reveal the true Annual Percentage Rate. Compare lender offers accurately.",
    faq: [
      { q: "What is APR?", a: "APR (Annual Percentage Rate) reflects the total yearly cost of borrowing, including fees and discount points — not just the interest rate." },
      { q: "Why is APR higher than the interest rate?", a: "APR rolls upfront fees, origination costs and points into an annualised rate, so it usually exceeds the nominal interest rate quoted by lenders." },
      { q: "Is the lowest APR always the best loan?", a: "Often yes, but compare term length and prepayment penalties too. A shorter term can have a higher APR yet lower total cost." },
    ],
  },
  roi: {
    description: "ROI calculator with total return, annualized return (CAGR), and gain/loss breakdown. Free, instant, supports multi-year holdings.",
    faq: [
      { q: "What is a good ROI?", a: "It depends on the asset class and risk: stocks historically average 7–10% annualised, while real estate may yield 4–8%. Always compare ROI to the risk-free rate." },
      { q: "What is the difference between ROI and CAGR?", a: "ROI is the simple percentage gain over the entire period. CAGR (Compound Annual Growth Rate) annualises that gain to make multi-year investments comparable." },
      { q: "Does ROI account for taxes or fees?", a: "Basic ROI does not. For an after-tax view, subtract capital gains tax and transaction fees from the final value before computing the return." },
    ],
  },
  refinance: {
    description: "Mortgage refinance calculator with break-even analysis, lifetime savings, and monthly payment comparison. See whether refinancing your home loan saves money.",
    faq: [
      { q: "When is refinancing worth it?", a: "Generally when the new rate is at least 0.75–1% lower and you'll stay in the home past the break-even month (closing costs ÷ monthly savings)." },
      { q: "What are typical refinance closing costs?", a: "2–5% of the loan amount, covering origination, appraisal, title insurance and recording fees." },
    ],
  },
  affordability: {
    description: "House affordability calculator using the 28/36 DTI rule. Estimate the maximum home price you can afford from income, debts and down payment.",
    faq: [
      { q: "What is the 28/36 rule?", a: "Lenders prefer housing costs ≤ 28% of gross income (front-end DTI) and total debt payments ≤ 36% (back-end DTI)." },
      { q: "Does down payment affect affordability?", a: "Yes — a larger down payment lowers the loan amount, removes PMI above 20%, and reduces monthly payments, increasing the price you can afford." },
    ],
  },
  "compound-interest": {
    description: "Free compound interest calculator with daily, monthly, quarterly and annual compounding. Visualise growth, contributions and total interest earned.",
    faq: [
      { q: "What is the compound interest formula?", a: "A = P(1 + r/n)^(nt), where P is principal, r the annual rate, n the compounding periods per year, and t the time in years." },
      { q: "Does compounding frequency matter?", a: "Yes. More frequent compounding (daily vs annual) yields slightly higher returns at the same nominal rate due to interest-on-interest." },
    ],
  },
  retirement: {
    description: "Retirement calculator with employer match, annual contributions, salary growth and projection chart. Plan a confident retirement.",
    faq: [
      { q: "How much should I save for retirement?", a: "A common rule is to save 10–15% of gross income annually, including employer match, aiming for 10× your final salary by age 67." },
      { q: "Should I always max the employer match?", a: "Yes — employer match is effectively a 100% return on every matched dollar. Contribute at least up to the match before any other investing." },
    ],
  },
  "credit-card": {
    description: "Credit card payoff calculator. See months to debt freedom, total interest paid, and how a higher monthly payment accelerates payoff.",
    faq: [
      { q: "How does the avalanche payoff method work?", a: "Pay minimums on all cards and put every extra dollar toward the card with the highest APR — the mathematically fastest, lowest-interest path." },
      { q: "What is the snowball method?", a: "Pay minimums on all cards and attack the smallest balance first for psychological wins. Slower than avalanche but boosts motivation." },
    ],
  },
  "debt-payoff": {
    description: "Debt payoff calculator with full payment schedule and CSV export. Plan a fixed-rate payoff strategy and see exactly when you'll be debt-free.",
    faq: [
      { q: "How can I pay off debt faster?", a: "Increase your monthly payment, refinance to a lower rate, consolidate high-interest balances, and avoid new debt while the plan is in progress." },
    ],
  },
  cd: {
    description: "Certificate of Deposit (CD) calculator. Compute maturity value, interest earned and effective APY at any compounding frequency.",
    faq: [
      { q: "What is APY?", a: "APY (Annual Percentage Yield) is the effective annual return after compounding. It's always ≥ the nominal interest rate." },
      { q: "Are CDs safe?", a: "Bank CDs are FDIC-insured up to $250,000 per depositor, per institution. Early withdrawals usually incur a penalty." },
    ],
  },
  savings: {
    description: "Savings calculator with monthly deposits, APY and compounding frequency. Project how long it takes to reach a savings goal.",
    faq: [
      { q: "How is high-yield savings different?", a: "High-yield savings accounts pay several times the national average APY — often 4–5% — while remaining FDIC-insured and fully liquid." },
    ],
  },
  inflation: {
    description: "Inflation calculator: future value of money, lost purchasing power and equivalent dollars across years using a custom inflation rate.",
    faq: [
      { q: "What inflation rate should I use?", a: "Long-run U.S. CPI averages roughly 2.5–3.5%. Use a higher rate if forecasting periods of elevated inflation." },
    ],
  },
  "future-value": {
    description: "Future value (FV) calculator with annual contributions and compounding. Project the future worth of any present sum.",
    faq: [
      { q: "What is the future value formula?", a: "FV = PV·(1+r)ⁿ for a lump sum, plus PMT·[((1+r)ⁿ−1)/r] for annuity contributions." },
    ],
  },
  "present-value": {
    description: "Present value (PV) calculator: discount future cash flows to today's dollars at any discount rate.",
    faq: [
      { q: "What discount rate should I use?", a: "Use your opportunity cost of capital — typically 6–10% for equity investors, or your weighted average cost of capital (WACC) for a business." },
    ],
  },
  "auto-loan": {
    description: "Auto loan calculator with monthly payment, total interest, sales tax and trade-in support. Free, accurate and mobile-friendly.",
    faq: [
      { q: "What is a good auto loan term?", a: "60 months is the sweet spot for most buyers. Anything longer risks being underwater (owing more than the car is worth)." },
    ],
  },
  dti: {
    description: "Debt-to-income (DTI) ratio calculator. Front-end and back-end DTI with lender benchmarks for mortgage qualification.",
    faq: [
      { q: "What DTI do mortgage lenders prefer?", a: "Conventional loans usually cap back-end DTI at 43–45%; conforming and FHA loans may allow up to 50% with compensating factors." },
    ],
  },
  "simple-interest": {
    description: "Simple interest calculator using I = P × r × t. Free and instant for short-term loans, savings and bond accruals.",
    faq: [
      { q: "When is simple interest used?", a: "Auto loans, short-term personal loans, and most bonds compute interest simply on the principal — not on accumulated interest." },
      { q: "How is simple interest different from compound interest?", a: "Simple interest accrues only on the original principal. Compound interest accrues on principal plus previously earned interest, leading to exponential growth over time." },
    ],
  },
  investment: {
    description: "Investment calculator with starting balance, regular contributions, expected return and projection chart. Estimate compound growth for stocks, ETFs and index funds.",
    faq: [
      { q: "What return rate should I assume?", a: "A common long-run assumption for diversified U.S. equities is 7% real (after inflation) or 10% nominal. For balanced portfolios use 5–7% nominal." },
      { q: "How often should I contribute?", a: "Monthly dollar-cost averaging works well for most investors — it removes timing risk and takes advantage of market dips automatically." },
    ],
  },
  "loan-comparison": {
    description: "Side-by-side loan comparison calculator. Compare two loans by rate, term and amount; see monthly payment, total interest and lifetime savings differences.",
    faq: [
      { q: "How do I choose between two loans?", a: "Compare the total cost (principal + interest + fees). A lower monthly payment over a longer term often means much higher total interest." },
      { q: "Does a shorter term always save money?", a: "Yes on total interest, but it raises the monthly payment. Pick the shortest term you can afford comfortably without straining cash flow." },
    ],
  },
};

export function buildFaqJsonLd(slug: string) {
  const entry = FINANCE_SEO[slug];
  if (!entry) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entry.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
