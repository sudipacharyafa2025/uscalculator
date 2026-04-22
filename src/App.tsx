import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import LocaleDomTranslator from "./components/LocaleDomTranslator";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import CalculatorPage from "@/pages/CalculatorPage";
import { About, Privacy, Terms } from "@/pages/Static";
import SeoAuditCsv from "@/pages/SeoAuditCsv";
import NotFound from "./pages/NotFound.tsx";
import { SUPPORTED_LOCALES } from "@/i18n/locale";

const queryClient = new QueryClient();
const localizedRoutes = SUPPORTED_LOCALES.filter((locale) => locale !== "en");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {localizedRoutes.map((locale) => (
              <Route key={locale} path={`/${locale}`} element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="terms" element={<Terms />} />
                <Route path="seo-audit/csv" element={<SeoAuditCsv />} />
                <Route path=":category" element={<CategoryPage />} />
                <Route path=":category/:slug" element={<CalculatorPage />} />
              </Route>
            ))}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/seo-audit/csv" element={<SeoAuditCsv />} />
              <Route path="/:category" element={<CategoryPage />} />
              <Route path="/:category/:slug" element={<CalculatorPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <LocaleDomTranslator />
        </BrowserRouter>
      </TooltipProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);

export default App;
