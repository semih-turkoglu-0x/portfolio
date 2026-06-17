import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const description =
  "Portfolio and blog of Semih Turkoglu — software engineer & writer.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Semih Turkoglu",
  description,
  openGraph: {
    type: "website",
    siteName: "Semih Turkoglu",
    title: "Semih Turkoglu",
    description,
    url: siteUrl,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Semih Turkoglu",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
