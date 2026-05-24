import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://www.zencloudweb.com";
const description =
  "Short-form news reels for AI, markets, science, space, world events, and oil prices. Clear sourced explainers built for the scroll.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3efe6" },
    { media: "(prefers-color-scheme: dark)", color: "#111210" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ZenCloudMedia | Short-Form News Reels",
  description,
  icons: {
    icon: "/zencloudmedia-logo.png",
    apple: "/zencloudmedia-logo.png",
  },
  openGraph: {
    title: "ZenCloudMedia | Short-Form News Reels",
    description,
    url: "/",
    siteName: "ZenCloudMedia",
    images: [
      {
        url: "/zencloudmedia-logo.png",
        width: 256,
        height: 256,
        alt: "ZenCloudMedia",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZenCloudMedia | Short-Form News Reels",
    description,
    images: ["/zencloudmedia-logo.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head />
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ST9XEYEMVS"
          strategy="afterInteractive"
        />
        <Script src="/ga4-init.js" strategy="afterInteractive" />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? 'ca-pub-3651454000211352'}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
