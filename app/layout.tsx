import { ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import ClientDemos from "@/components/animation/ClientDemos";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.theviola.co"),
  title: { default: "VIOLA", template: "%s · VIOLA" },
  description: "VIOLA — A&R platform",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "VIOLA",
    title: "VIOLA",
    description: "Tap here to open the link.",
    images: [{ url: "/violaicon.png", width: 1200, height: 630, alt: "VIOLA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VIOLA",
    description: "Tap here to open the link.",
    images: ["/violaicon.png"],
  },
  icons: { icon: "/violaicon.png", shortcut: "/violaicon.png", apple: "/violaicon.png" },
};

interface RootLayoutProps { children: ReactNode; }

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <Suspense fallback={null}>
            <ClientDemos />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
