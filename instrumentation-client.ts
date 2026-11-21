/*
 * Runs before React starts in the browser. Makes sure the Trusted Types "default" policy exists.
 * The inline <script> in app/layout.tsx creates it on normal page loads, but when a server render
 * fails Next.js sends a bare shell without that script; without this, the layout can't re-render on
 * the client and every page error escalates to global-error. Same rules as lib/trusted-types.ts.
 */
import { TRUSTED_SCRIPT_ORIGINS, TRUSTED_TYPES_BOOTSTRAP } from "@/lib/trusted-types";

type TrustedTypesApi = {
  defaultPolicy: unknown;
  createPolicy: (name: string, rules: Record<string, (value: string) => string>) => unknown;
};

const tt = (window as unknown as { trustedTypes?: TrustedTypesApi }).trustedTypes;

if (tt?.createPolicy && !tt.defaultPolicy) {
  if (process.env.NODE_ENV === "development") {
    const pass = (value: string) => value;
    tt.createPolicy("default", { createHTML: pass, createScript: pass, createScriptURL: pass });
  } else {
    const html = new Set(["<!--email_off-->", "<!--email_on-->", TRUSTED_TYPES_BOOTSTRAP]);
    const origins = new Set([window.location.origin, ...TRUSTED_SCRIPT_ORIGINS]);
    const block = (kind: string, value: string): never => {
      console.error(`[trusted-types] blocked ${kind}: ${String(value).slice(0, 100)}`);
      throw new TypeError("Blocked by the Trusted Types policy");
    };
    tt.createPolicy("default", {
      createHTML: (value) => (html.has(value) ? value : block("HTML", value)),
      createScript: (value) => block("script", value),
      createScriptURL: (value) => {
        try {
          if (origins.has(new URL(value, window.location.href).origin)) return value;
        } catch {
          /* not a URL */
        }
        return block("script URL", value);
      },
    });
  }
}
