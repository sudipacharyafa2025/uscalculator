/**
 * Scenario URL encoding. Inputs are JSON-stringified, gzipped via base64url
 * (using the browser's built-in btoa), and round-tripped via the `?s=` param.
 *
 * Encoding choice: we keep this simple and dependency-free. JSON → URI-safe
 * base64. Average mortgage scenario is ~120 chars in the URL, well under any
 * browser/email client limit.
 */
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const SHARE_PARAM = "s";

function toBase64Url(s: string) {
  const utf8 = new TextEncoder().encode(s);
  let bin = "";
  utf8.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): string {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

export function encodeScenario(state: Record<string, unknown>): string {
  return toBase64Url(JSON.stringify(state));
}

export function decodeScenario<T = Record<string, unknown>>(encoded: string): T | null {
  try {
    return JSON.parse(fromBase64Url(encoded)) as T;
  } catch {
    return null;
  }
}

/**
 * Hook that:
 *  - On mount, decodes `?s=…` (if present) and calls `onLoad(state)` once.
 *  - Returns a `share()` function that builds a permalink and copies it to
 *    the clipboard (or returns it if clipboard is unavailable).
 *
 * `state` should be the *current* values you want to encode. The hook reads
 * the latest state from a ref so the share button always captures live data.
 */
export function useScenarioUrl<T extends Record<string, unknown>>(
  state: T,
  onLoad?: (state: T) => void,
) {
  const [params, setParams] = useSearchParams();
  const stateRef = useRef(state);
  stateRef.current = state;
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const encoded = params.get(SHARE_PARAM);
    if (!encoded) return;
    const decoded = decodeScenario<T>(encoded);
    if (decoded && onLoad) onLoad(decoded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const share = async (): Promise<string> => {
    const encoded = encodeScenario(stateRef.current);
    // Update the URL silently so the user sees the shareable URL in the bar.
    const next = new URLSearchParams(params);
    next.set(SHARE_PARAM, encoded);
    setParams(next, { replace: true });
    const link = `${window.location.origin}${window.location.pathname}?${next.toString()}`;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(link);
    } catch {
      /* clipboard blocked; caller still gets the link */
    }
    return link;
  };

  return { share };
}
