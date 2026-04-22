import { ComponentType, ReactElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/contexts/CurrencyContext";

const calculatorModules = import.meta.glob("../pages/calculators/**/*.tsx");

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock;

function renderCalculator(ui: ReactElement) {
  return render(
    <MemoryRouter initialEntries={["/finance/mortgage"]}>
      <CurrencyProvider>
        <TooltipProvider>{ui}</TooltipProvider>
      </CurrencyProvider>
    </MemoryRouter>
  );
}

afterEach(() => {
  cleanup();
});

describe("calculator pages", () => {
  it("render every calculator and keep Calculate controls unique and clickable", async () => {
    expect(Object.keys(calculatorModules).length).toBeGreaterThan(80);

    for (const [path, loadModule] of Object.entries(calculatorModules)) {
      const module = (await loadModule()) as { default: ComponentType };
      const Calculator = module.default;

      renderCalculator(<Calculator />);

      expect(screen.getByRole("heading", { level: 1 }), path).toBeInTheDocument();

      const calculateButtons = screen.queryAllByRole("button", { name: /^calculate$/i });
      expect(calculateButtons.length, `${path} has duplicate Calculate buttons`).toBeLessThanOrEqual(1);

      calculateButtons.forEach((button) => {
        fireEvent.click(button);
      });

      cleanup();
    }
  }, 30000);
});
