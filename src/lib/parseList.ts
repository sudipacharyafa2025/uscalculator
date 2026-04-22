/** Robust number-list parser. Accepts commas, spaces, tabs, semicolons and newlines. */
export function parseNumberList(input: string): { values: number[]; invalid: string[] } {
  if (!input) return { values: [], invalid: [] };
  const tokens = input.split(/[\s,;]+/).map((t) => t.trim()).filter(Boolean);
  const values: number[] = [];
  const invalid: string[] = [];
  for (const t of tokens) {
    const n = Number(t.replace(/_/g, ""));
    if (Number.isFinite(n)) values.push(n);
    else invalid.push(t);
  }
  return { values, invalid };
}
