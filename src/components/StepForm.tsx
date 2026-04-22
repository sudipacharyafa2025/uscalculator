import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/hooks/useLocale";
import { translateCalculatorText } from "@/i18n/calculatorText";

export interface Step {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
  /** When false, the Next button is disabled. */
  valid?: boolean;
  /** Inline validation message shown under the step body. */
  errorSummary?: string;
}

interface Props {
  steps: Step[];
  /** Rendered after the final step (always visible during the last step). */
  results: ReactNode;
  /** Optional CTA shown on every step header (e.g. "Share scenario"). */
  headerExtras?: ReactNode;
}

/**
 * Lightweight stepper used to break long calculator forms into focused groups.
 * It is intentionally non-blocking: results stay live and always visible so the
 * calculator still feels instant. The stepper is purely a layout aid.
 */
export default function StepForm({ steps, results, headerExtras }: Props) {
  const { locale } = useLocale();
  const [active, setActive] = useState(0);
  const total = steps.length;
  const step = steps[active];
  const isLast = active === total - 1;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Step indicator */}
        <ol className="flex items-center gap-1 overflow-x-auto pb-1" aria-label={translateCalculatorText(locale, "Form progress")}>
          {steps.map((s, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <li key={s.id} className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs transition border ${
                    current
                      ? "border-accent bg-accent text-accent-foreground"
                      : done
                      ? "border-accent/40 text-accent hover:bg-accent/10"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={current ? "step" : undefined}
                >
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                      current ? "bg-accent-foreground text-accent" : done ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  <span className="whitespace-nowrap">{translateCalculatorText(locale, s.title)}</span>
                </button>
                {i < total - 1 && <span className="w-3 h-px bg-border mx-1" />}
              </li>
            );
          })}
        </ol>

        <div className="calc-card space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">{translateCalculatorText(locale, step.title)}</h2>
              {step.description && <p className="text-xs text-muted-foreground mt-0.5">{translateCalculatorText(locale, step.description)}</p>}
            </div>
            {headerExtras && <div className="shrink-0">{headerExtras}</div>}
          </div>

          <div className="space-y-3">{step.content}</div>

          {step.errorSummary && (
            <div role="alert" className="text-xs text-destructive border border-destructive/30 bg-destructive/5 rounded-md p-2">
              {translateCalculatorText(locale, step.errorSummary)}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              disabled={active === 0}
              onClick={() => setActive((a) => Math.max(0, a - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {translateCalculatorText(locale, "Back")}
            </Button>
            <span className="text-xs text-muted-foreground">
              {translateCalculatorText(locale, "Step")} {active + 1} {translateCalculatorText(locale, "of")} {total}
            </span>
            <Button
              size="sm"
              disabled={isLast || step.valid === false}
              onClick={() => setActive((a) => Math.min(total - 1, a + 1))}
            >
              {isLast ? translateCalculatorText(locale, "Done") : translateCalculatorText(locale, "Next")}
              {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4">{results}</div>
    </div>
  );
}
