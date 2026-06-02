import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DebugImageProbe from "@/components/DebugImageProbe";
import { AUTHOR, SITE } from "@/lib/site";

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
    default: `${SITE.name} — ${AUTHOR.name}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["intelligence artificielle", "IA", "tech", "développement", "cybersécurité", AUTHOR.name],
  authors: [{ name: AUTHOR.name }],
  creator: AUTHOR.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.name,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const showImageProbe = process.env.DEBUG_IMAGE_PROBE === "1";

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
        {showImageProbe && <DebugImageProbe />}
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
