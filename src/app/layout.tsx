import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ChillGits",
  description: "Discover your GitHub chill factor and share your coding journey in style!",
  openGraph: {
    title: "ChillGits - Your GitHub Dashboard with Style",
    description: "Discover your GitHub chill factor and share your coding journey in style!",
    images: [
      {
        url: "/og-image.png", // Make sure to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "ChillGits Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
    siteName: "ChillGits",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChillGits - Your GitHub Dashboard with Style",
    description: "Discover your GitHub chill factor and share your coding journey in style!",
    images: ["/og-image.png"], // Same image as OpenGraph
    creator: "@chillgits",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SpeedInsights />
      <Analytics />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
