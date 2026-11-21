/*
 * Trusted Types "default" policy.
 *
 * The CSP says `require-trusted-types-for 'script'`, so the browser refuses plain strings in
 * script-capable DOM sinks (innerHTML, script.src, eval…). Next.js loads its own code through its
 * named policies ("nextjs", "nextjs#bundler"); this default policy catches everything else.
 *
 * Production: strict. A production walk-through of the whole site makes no default-policy calls at
 * all, so this only lets through what is known to be needed:
 *   - HTML: this bootstrap script itself (React re-renders it when recovering from an error) and
 *     Cloudflare's email-off comments.
 *   - Script URLs: this site, Turnstile and Cloudflare Web Analytics.
 *   - Scripts (eval and friends): nothing.
 * Anything else is blocked and logged as "[trusted-types] blocked …" in the browser console.
 *
 * Development: pass-through, because React's dev tooling and hot reload rely on eval.
 *
 * These are plain string literals on purpose: the server sends the exact text to the browser and
 * React compares it as-is, so it must not be rebuilt or minified differently on either side.
 */

export const TRUSTED_SCRIPT_ORIGINS = ["https://challenges.cloudflare.com", "https://static.cloudflareinsights.com"];

export const TRUSTED_TYPES_BOOTSTRAP = `(function(){var tt=window.trustedTypes;if(!tt||!tt.createPolicy||tt.defaultPolicy)return;var me=document.currentScript?document.currentScript.textContent:"";var html={"<!--email_off-->":1,"<!--email_on-->":1};if(me)html[me]=1;var origins=[location.origin,"https://challenges.cloudflare.com","https://static.cloudflareinsights.com"];function no(k,s){console.error("[trusted-types] blocked "+k+": "+String(s).slice(0,100));throw new TypeError("Blocked by the Trusted Types policy")}try{tt.createPolicy("default",{createHTML:function(s){return html[s]?s:no("HTML",s)},createScript:function(s){return no("script",s)},createScriptURL:function(s){try{if(origins.indexOf(new URL(s,location.href).origin)>-1)return s}catch(e){}return no("script URL",s)}})}catch(e){}})();`;

export const TRUSTED_TYPES_BOOTSTRAP_DEV = `(function(){var tt=window.trustedTypes;if(!tt||!tt.createPolicy||tt.defaultPolicy)return;try{tt.createPolicy("default",{createHTML:function(s){return s},createScript:function(s){return s},createScriptURL:function(s){return s}})}catch(e){}})();`;
