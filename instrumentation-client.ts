/*
 * Runs before React starts in the browser. Makes sure the Trusted Types "default" policy exists.
 * The inline <script> in app/layout.tsx creates it on normal page loads, but when a server render
 * fails Next.js sends a bare shell without that script; without this, the layout can't re-render on
 * the client and every page error escalates to global-error.
 */
type TrustedTypesApi = {
  defaultPolicy: unknown;
  createPolicy: (name: string, rules: Record<string, (value: string) => string>) => unknown;
};

const tt = (window as unknown as { trustedTypes?: TrustedTypesApi }).trustedTypes;

if (tt?.createPolicy && !tt.defaultPolicy) {
  const pass = (value: string) => value;
  tt.createPolicy("default", { createHTML: pass, createScript: pass, createScriptURL: pass });
}
