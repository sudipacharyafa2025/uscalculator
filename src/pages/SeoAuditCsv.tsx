import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, FileSpreadsheet, ChevronRight } from "lucide-react";
import SEO from "@/components/SEO";
import { CSV_AUDIT, CSV_AUDIT_SUMMARY } from "@/lib/csvAudit";

/**
 * Static, build-time-generated audit report of every exportCsv() call site.
 * Verifies banner consistency and shows the exact filename each call produces.
 */
export default function SeoAuditCsv() {
  const { total, passing, failing, files, calculators } = CSV_AUDIT_SUMMARY;
  const allPass = failing === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <SEO
        title="CSV Export Audit — USCalculator"
        description="Per-calculator verification of CSV export banner consistency and filename patterns across every USCalculator tool."
        canonical="/seo-audit/csv"
      />

      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted-foreground mb-4 flex-wrap">
        <Link to="/" className="hover:text-accent">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-primary font-medium">CSV export audit</span>
      </nav>

      <header className="mb-6 flex items-start gap-3">
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: "var(--gradient-accent)" }}>
          <FileSpreadsheet className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-bold leading-tight">CSV Export Audit</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Static verification of the metadata banner and filename pattern emitted by every <code>exportCsv()</code> call.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <Stat label="Call sites" value={total} />
        <Stat label="Calculators" value={calculators} />
        <Stat label="Files" value={files} />
        <Stat label="Passing" value={passing} tone="ok" />
        <Stat label="Failing" value={failing} tone={failing ? "bad" : "ok"} />
      </div>

      <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
        allPass ? "border-accent/30 bg-accent/5" : "border-destructive/30 bg-destructive/5"
      }`}>
        {allPass ? (
          <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        ) : (
          <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        )}
        <div className="text-sm">
          <p className="font-medium">
            {allPass
              ? `All ${total} export sites emit the identical 5-line banner.`
              : `${failing} export site${failing === 1 ? "" : "s"} diverge from the expected banner.`}
          </p>
          <p className="text-muted-foreground mt-1">
            Expected banner (in order): <code># USCalculator — &lt;Title&gt;</code>, <code># Scenario: …</code>,
            <code> # Units: …</code>, <code># Generated: …</code>, <code># Source: …</code>, blank separator.
            Filenames follow <code>uscalculator-&lt;slug&gt;[-suffix]-YYYYMMDDHHmm.csv</code>.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {CSV_AUDIT.map((e, i) => (
          <article key={i} className="calc-card">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
              <div className="min-w-0">
                <h2 className="font-semibold text-base">{e.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono break-all">{e.file}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
                e.pass ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
              }`}>
                {e.pass ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {e.pass ? "PASS" : "FAIL"}
              </span>
            </div>

            <dl className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-xs mb-3">
              <Row k="Calculator slug" v={e.calculator} mono />
              <Row k="Blocks" v={String(e.blocks)} />
              <Row k="Scenario" v={e.scenario} />
              <Row k="Units" v={e.units} />
              <Row k="Filename pattern" v={e.filenameSample} mono span />
            </dl>

            <details className="text-xs">
              <summary className="cursor-pointer text-accent hover:underline select-none">View detected banner</summary>
              <pre className="mt-2 p-3 rounded bg-muted/40 border border-border font-mono text-[11px] leading-relaxed overflow-auto whitespace-pre">{e.banner}</pre>
            </details>
          </article>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        This report is generated from a static snapshot of <code>src/lib/csvAudit.ts</code>. Re-run the audit script and update that file when adding new exports.
      </p>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "ok" | "bad" }) {
  const cls = tone === "ok" ? "text-accent" : tone === "bad" ? "text-destructive" : "text-foreground";
  return (
    <div className="calc-card py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-0.5 ${cls}`}>{value}</div>
    </div>
  );
}

function Row({ k, v, mono, span }: { k: string; v: string; mono?: boolean; span?: boolean }) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      <dt className="text-muted-foreground inline">{k}: </dt>
      <dd className={`inline ${mono ? "font-mono" : ""} break-all`}>{v}</dd>
    </div>
  );
}
