import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DebugImageProbe from "@/components/DebugImageProbe";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BlogIA — Tech, IA & Innovation",
    template: "%s | BlogIA",
  },
  description:
    "Le blog qui décrypte l'intelligence artificielle, le développement, la cybersécurité et les innovations technologiques.",
  keywords: ["intelligence artificielle", "IA", "tech", "développement", "cybersécurité"],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "BlogIA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="BlogIA — RSS Feed"
          href="/rss.xml"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        {isDev && <DebugImageProbe />}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
