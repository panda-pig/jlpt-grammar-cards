import type { Metadata } from "next";
import { IBM_Plex_Mono, Fraunces } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";

// Latin display serif — sharpens English headings and big numeric displays.
// CJK headings keep their system serif fallback (Songti SC) automatically.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

// Editorial monospace for the pervasive eyebrow labels, badges, nav and stats.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "JLPT Grammar Deck — Anki-Style JLPT Grammar Learning",
  description:
    "Systematically organized N1–N5 grammar, with flashcards, favorites, spaced repetition, and side-by-side comparisons.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className={`h-full antialiased ${fraunces.variable} ${plexMono.variable}`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
