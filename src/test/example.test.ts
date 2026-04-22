import { describe, it, expect } from "vitest";
import { futureValue, monthlyPayment, monthlyRateFromApy, monthlyRateFromAnnualRate } from "@/lib/calculators";

describe("finance formulas", () => {
  it("calculates a standard monthly loan payment", () => {
    expect(monthlyPayment(100000, 6, 30)).toBeCloseTo(599.55, 2);
  });

  it("converts APY to a monthly rate that compounds back to the same annual yield", () => {
    const monthlyRate = monthlyRateFromApy(12);
    expect(Math.pow(1 + monthlyRate, 12)).toBeCloseTo(1.12, 10);
  });

  it("projects future value using an equivalent monthly rate for non-monthly compounding", () => {
    const result = futureValue(1000, 12, 1, 100, 4);
    const monthlyRate = monthlyRateFromAnnualRate(12, 4);
    const expected = 1000 * Math.pow(1 + monthlyRate, 12) + 100 * ((Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate);

    expect(result.fv).toBeCloseTo(expected, 6);
    expect(result.totalContrib).toBeCloseTo(2200, 6);
  });
});
