import { useEffect } from "react";
import { useLocale } from "@/hooks/useLocale";
import { translateCalculatorText } from "@/i18n/calculatorText";

const TEXT_EXCLUDE = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE"]);

export default function LocaleDomTranslator() {
  const { locale } = useLocale();

  useEffect(() => {
    const textOriginals = new WeakMap<Text, string>();
    let isApplying = false;

    const translateAttr = (el: HTMLElement, attr: "placeholder" | "title" | "aria-label") => {
      const current = el.getAttribute(attr);
      if (!current) return;
      const dataKey = `i18nOrig${attr.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()).replace(/^./, (c) => c.toUpperCase())}`;
      const dataset = el.dataset as Record<string, string | undefined>;
      const original = dataset[dataKey] ?? current;
      if (!dataset[dataKey]) dataset[dataKey] = original;
      const translated = translateCalculatorText(locale, original);
      if (translated !== current) {
        el.setAttribute(attr, translated);
      }
    };

    const applyTranslations = () => {
      if (isApplying) return;
      isApplying = true;

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      let node = walker.nextNode();
      while (node) {
        const textNode = node as Text;
        const parent = textNode.parentElement;
        if (parent && !TEXT_EXCLUDE.has(parent.tagName)) {
          textNodes.push(textNode);
        }
        node = walker.nextNode();
      }

      for (const textNode of textNodes) {
        const current = textNode.textContent ?? "";
        if (!textOriginals.has(textNode)) textOriginals.set(textNode, current);
        const original = textOriginals.get(textNode) ?? current;
        if (!original.trim()) continue;
        const translated = translateCalculatorText(locale, original);
        if (translated !== current) {
          textNode.textContent = translated;
        }
      }

      const attrs = document.querySelectorAll<HTMLElement>("[placeholder], [title], [aria-label]");
      attrs.forEach((el) => {
        translateAttr(el, "placeholder");
        translateAttr(el, "title");
        translateAttr(el, "aria-label");
      });

      isApplying = false;
    };

    const observer = new MutationObserver(() => {
      applyTranslations();
    });

    applyTranslations();
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
    });

    return () => observer.disconnect();
  }, [locale]);

  return null;
}
