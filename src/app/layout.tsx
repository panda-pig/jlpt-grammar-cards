import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { GrammarProvider } from "@/context/GrammarContext";
import "./[lang]/globals.css";

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
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background">
        <AuthProvider>
          <GrammarProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </GrammarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
