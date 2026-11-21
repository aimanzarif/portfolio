import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isHttps =
    forwardedProto === "https" ||
    request.nextUrl.protocol === "https:" ||
    (process.env.NEXT_PUBLIC_SITE_URL ?? "https://zarep.my").startsWith("https://");

  // Ignored by browsers that support 'strict-dynamic' (they trust only nonced scripts and what those
  // load); kept as a fallback for older browsers.
  const cloudflareScriptSrc = ["https://challenges.cloudflare.com", "https://static.cloudflareinsights.com"].join(" ");

  const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${cloudflareScriptSrc}${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://challenges.cloudflare.com",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "frame-src 'self' https://challenges.cloudflare.com",
    "connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com https://static.cloudflareinsights.com" +
      (isDev ? " ws: wss:" : ""),
    "require-trusted-types-for 'script'",
    // Next.js creates its own policies ("nextjs", and "nextjs#bundler" for webpack builds) to load chunks.
    "trusted-types default nextjs nextjs#bundler 'allow-duplicates'",
    ...(!isDev && isHttps ? ["upgrade-insecure-requests"] : []),
    // Violations are posted to /api/csp-report and summarised in the server log.
    "report-uri /api/csp-report",
    "report-to csp-endpoint",
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  response.headers.set("Reporting-Endpoints", 'csp-endpoint="/api/csp-report"');

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|docs/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
