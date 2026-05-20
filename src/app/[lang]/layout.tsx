import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { GrammarProvider } from "@/context/GrammarContext";
import { LocaleProvider } from "@/components/layout/LocaleProvider";
import { hasLocale, getDictionary, type Locale } from "./dictionaries";
import { notFound } from "next/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "JLPT Grammar Deck — Anki-Style JLPT Grammar Learning",
  description:
    "Systematically organized N1–N5 grammar, with flashcards, favorites, spaced repetition, and side-by-side comparisons.",
};

export async function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);

  return (
    <html lang={lang === "zh" ? "zh-CN" : "en"} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background">
        <LocaleProvider locale={lang as Locale} dict={dict}>
          <AuthProvider>
            <GrammarProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </GrammarProvider>
          </AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
