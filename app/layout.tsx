import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import { Figtree, Fraunces } from "next/font/google";
import { cn } from "@/lib/utils";
import { profile } from "@/lib/profile";
import { parseThemePreference, THEME_STORAGE_KEY, themeClassName } from "@/lib/theme";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zarep.my";
const title = `${profile.shortName} — ${profile.title}`;
const description =
  "Portfolio of Zarif Nur Aiman Bin Khairul Bahri, a CPRE-certified Information Systems Engineering graduate and QA engineer based in Johor, Malaysia.";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#dcd7c8" },
    { media: "(prefers-color-scheme: dark)", color: "#2c3639" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: profile.shortName,
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const theme = parseThemePreference(cookieStore.get(THEME_STORAGE_KEY)?.value);
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        figtree.variable,
        fraunces.variable,
        "h-full antialiased font-sans",
        themeClassName(theme),
      )}
    >
      <body className="flex min-h-dvh flex-col overflow-x-clip font-sans">
        <Script id="trusted-types-default" strategy="beforeInteractive" nonce={nonce}>
          {`(function(){if(!window.trustedTypes||!trustedTypes.createPolicy)return;try{trustedTypes.createPolicy("default",{createHTML:function(s){return s},createScript:function(s){return s},createScriptURL:function(s){return s}})}catch(e){}})();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
