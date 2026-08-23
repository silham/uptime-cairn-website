import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteNavbar } from "@/components/site-navbar";
import { ThemeScript } from "@/components/theme-script";
import { SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Self-hosted uptime monitoring and status pages`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  keywords: [
    "uptime monitoring",
    "status page",
    "self-hosted",
    "open source",
    "Uptime Kuma alternative",
    "website monitoring",
    "SSL certificate expiry monitoring",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: SITE.name,
    url: SITE.url,
    title: `${SITE.name} — Self-hosted uptime monitoring and status pages`,
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the inline head script sets the `dark` class on
    // <html> before React hydrates, so the server markup and the live DOM
    // legitimately differ on that one attribute.
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteNavbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
