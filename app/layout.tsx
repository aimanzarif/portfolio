import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { profile } from "@/lib/profile";
import { parseThemePreference, THEME_STORAGE_KEY, themeClassName } from "@/lib/theme";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zarep.my";
const title = `${profile.shortName} — ${profile.title}`;
const description =
  "Portfolio of Zarif Nur Aiman Bin Khairul Bahri: IT support, QA and full-stack delivery, plus a self-hosted RHEL homelab. Based in Klang, Malaysia.";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ece7db" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1f20" },
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
        bricolage.variable,
        jetbrains.variable,
        "h-full antialiased font-sans",
        themeClassName(theme),
      )}
    >
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `(function(){var tt=window.trustedTypes;if(!tt||!tt.createPolicy)return;try{tt.createPolicy("default",{createHTML:function(s){return s},createScript:function(s){return s},createScriptURL:function(s){return s}})}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-dvh flex-col overflow-x-clip font-sans">
        {children}
      </body>
    </html>
  );
}
