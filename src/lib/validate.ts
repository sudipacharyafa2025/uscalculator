/**
 * Lightweight numeric validation helpers shared by calculator inputs.
 * Returns null when valid, or a human-readable error message string.
 */
export interface NumRule {
  min?: number;
  max?: number;
  /** When true, NaN/empty is rejected. */
  required?: boolean;
  /** When true, integer values only. */
  integer?: boolean;
  /** Custom validator that runs last. */
  custom?: (n: number) => string | null;
  /** Used in error messages, e.g. "Loan amount". */
  label?: string;
}

export function validateNumber(value: number | string, rule: NumRule = {}): string | null {
  const label = rule.label ?? "Value";
  if (value === "" || value === null || value === undefined) {
    return rule.required ? `${label} is required` : null;
  }
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return `${label} must be a number`;
  if (rule.integer && !Number.isInteger(n)) return `${label} must be a whole number`;
  if (rule.min !== undefined && n < rule.min) return `${label} must be ≥ ${rule.min}`;
  if (rule.max !== undefined && n > rule.max) return `${label} must be ≤ ${rule.max}`;
  if (rule.custom) return rule.custom(n);
  return null;
}

/** Validate a record of fields; returns { ok, errors }. */
export function validateAll<T extends Record<string, number | string>>(
  values: T,
  rules: Partial<Record<keyof T, NumRule>>,
): { ok: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};
  (Object.keys(rules) as (keyof T)[]).forEach((k) => {
    const err = validateNumber(values[k], rules[k]);
    if (err) errors[k] = err;
  });
  return { ok: Object.keys(errors).length === 0, errors };
}
