"use client";

import Link from "next/link";
import { CheckCircle, Clock, Heart, Library, LineChart, ListChecks, Smartphone, Sparkles } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";

const SHIPPED_ICONS = [Library, LineChart, ListChecks, Sparkles];
const PLANNED_ICONS = [ListChecks, Sparkles, Smartphone, Clock];

export default function RoadmapPage() {
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.roadmap;

  return (
    <MainLayout>
      <div className="mx-auto max-w-[1000px] px-6 py-10 md:py-14">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#dcebd8] px-3 py-1 text-[#315b3b]">
          <CheckCircle className="h-3.5 w-3.5" />
          <span className="font-mono text-[11px]">{t.freeBadge}</span>
        </div>

        <h1 className="mt-4 font-serif text-[clamp(34px,6vw,58px)] font-bold leading-[1.05] tracking-[-0.022em] text-[#000000] text-balance">
          {t.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#797776] md:text-base">
          {t.subtitle}
        </p>

        <section className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-[.08em] text-[#797776]">{t.shippedTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {t.shipped.map((item, index) => {
              const Icon = SHIPPED_ICONS[index] ?? CheckCircle;
              return (
                <div key={item.title} className="lift rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#dcebd8] text-[#315b3b]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-mono text-sm font-medium text-[#242424]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#797776]">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-mono text-xs uppercase tracking-[.08em] text-[#797776]">{t.plannedTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {t.planned.map((item, index) => {
              const Icon = PLANNED_ICONS[index] ?? Clock;
              return (
                <div key={item.title} className="rounded-[18px] border border-dashed border-[#ded8d0] bg-[#fbfaf8]/60 p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(36,36,36,0.05)] text-[#797776]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-mono text-sm font-medium text-[#242424]">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#797776]">{item.desc}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-4 font-mono text-xs text-[#797776]">{t.plannedNote}</p>
        </section>

        <section className="card-soft mt-10 rounded-[20px] border border-[#ded8d0] bg-[#fbfaf8] p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="font-mono text-sm font-medium text-[#242424]">{t.supportTitle}</h2>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#797776]">{t.supportDesc}</p>
            </div>
            <Link
              href={`/${locale}/support`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-[#ded8d0] px-4 py-2.5 font-mono text-sm text-[#242424] transition-colors hover:border-[#242424] hover:bg-[#fff6df]"
            >
              <Heart className="h-4 w-4 text-[#8a6a20]" />
              {t.supportCta}
            </Link>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${locale}/study`} className="btn-v3-primary">{t.startCta}</Link>
          <Link href={`/${locale}/grammar`} className="btn-v3-secondary">{dict.common.viewLibrary}</Link>
        </div>
      </div>
    </MainLayout>
  );
}
