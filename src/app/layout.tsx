import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AdSense from "./components/AdSense";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://zencloudmedia.vercel.app";
const description =
  "Short-form news reels for AI, markets, science, space, world events, and oil prices. Clear sourced explainers built for the scroll.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ZenCloudMedia | Short-Form News Reels",
  description,
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
      <body className="min-h-full flex flex-col">
        {children}
        <AdSense />
      </body>
    </html>
  );
}
