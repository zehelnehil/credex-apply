import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Credex Spend Auditor",
  description: "Find defensible savings across startup AI tooling spend.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Credex Spend Auditor",
    description: "Benchmark your AI SaaS spend against the Credex index and find defensible savings without arbitrary vendor cuts.",
    url: "/",
    siteName: "Credex",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Credex Spend Auditor",
    description: "Calculate deterministic savings for your startup's AI stack.",
  }
};

import { Navigation } from "@/components/navigation";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-mist flex min-h-screen flex-col`}>
        <Navigation />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
