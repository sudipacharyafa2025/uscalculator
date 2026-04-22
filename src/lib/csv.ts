/**
 * CSV utilities. All exports go through buildCsv() which prepends a metadata
 * header block (calculator name, scenario, generated timestamp, source URL)
 * and writes a deterministic filename: uscalculator-<slug>-<YYYYMMDDHHmm>.csv
 */

export interface CsvBlock {
  /** Row of column titles. Each title may include the unit, e.g. "Payment (USD)". */
  headers: (string | number)[];
  /** Data rows, must align with headers. */
  rows: (string | number)[][];
  /** Optional sub-heading printed above the headers row. */
  title?: string;
}

export interface CsvOptions {
  /** Calculator slug, e.g. "mortgage". Drives the filename. */
  calculator: string;
  /** Human-readable calculator title for the header banner. */
  title: string;
  /** Short summary of the scenario, e.g. "$400,000 / 30 yr / 6.5%". */
  scenario?: string;
  /** Currency / unit context, e.g. "USD" or "ft". */
  units?: string;
  /** One or more tabular blocks. They are written sequentially with a blank row between. */
  blocks: CsvBlock[];
}

const escape = (v: unknown) => {
  const s = v === null || v === undefined ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const stamp = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}`;
};

/** Build the CSV content with a standardised metadata banner + one or more blocks. */
export function buildCsvContent(opts: CsvOptions): string {
  const url = typeof window !== "undefined" ? window.location.href : "https://uscalculator.online";
  const lines: string[] = [];
  lines.push(`# USCalculator — ${opts.title}`);
  if (opts.scenario) lines.push(`# Scenario: ${opts.scenario}`);
  if (opts.units) lines.push(`# Units: ${opts.units}`);
  lines.push(`# Generated: ${new Date().toISOString()}`);
  lines.push(`# Source: ${url}`);
  lines.push("");
  opts.blocks.forEach((block, i) => {
    if (i > 0) lines.push("");
    if (block.title) lines.push(`# ${block.title}`);
    lines.push(block.headers.map(escape).join(","));
    block.rows.forEach((r) => lines.push(r.map(escape).join(",")));
  });
  return lines.join("\n");
}

/** Default filename: uscalculator-<slug>-<YYYYMMDDHHmm>.csv */
export function csvFilename(slug: string, suffix?: string) {
  const base = `uscalculator-${slug}${suffix ? `-${suffix}` : ""}-${stamp()}`;
  return `${base.replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-")}.csv`;
}

/** Trigger a download with the standardised banner. */
export function exportCsv(opts: CsvOptions, suffix?: string) {
  const csv = buildCsvContent(opts);
  const filename = csvFilename(opts.calculator, suffix);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return filename;
}

/**
 * Legacy helper — kept for backward-compatibility with the older
 * `downloadCSV(filename, rows)` call sites. New code should use `exportCsv`.
 */
export function downloadCSV(filename: string, rows: (string | number)[][]) {
  const csv = rows.map((r) => r.map(escape).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
