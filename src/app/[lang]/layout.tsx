import { LocaleProvider } from "@/components/layout/LocaleProvider";
import { hasLocale, getDictionary, type Locale } from "./dictionaries";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}

export default async function LangLayout({
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
    <LocaleProvider locale={lang as Locale} dict={dict}>
      {children}
    </LocaleProvider>
  );
}
