import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { AGENT_LANDING_URL, SITE_URL } from "@/lib/site";
import "./globals.css";

const archivo = localFont({ src: "../../assets/fonts/ArchivoBlack-Regular.ttf", variable: "--font-archivo" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "AI Hypocrisy Highlighter", template: "%s | AI Hypocrisy Highlighter" },
  description: "These companies sell AI agents. We graded how well an agent can use their websites.",
  openGraph: { images: [{ url: "/api/card/class", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="min-h-screen font-sans antialiased">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-2 px-4 pt-6 font-bold sm:px-6">
          <Link href="/" className="font-display text-xl text-pen">AI HYPOCRISY HIGHLIGHTER</Link>
          <Link href="/#class" className="hover:text-pen">The Class</Link>
          <Link href="/grading" className="hover:text-pen">Grading</Link>
          <Link href="/#yours" className="hover:text-pen">Grade Yours</Link>
        </nav>
        {children}
        <footer className="mx-auto max-w-5xl px-4 pb-12 text-sm text-ink/60 sm:px-6">
          Grades come from <a href={AGENT_LANDING_URL} className="underline">agent-landing</a>, an open-source scanner anyone can run. Made by{" "}
          <a href="https://andyrosic.com" className="underline">Andy Rosic</a>.
        </footer>
      </body>
    </html>
  );
}
