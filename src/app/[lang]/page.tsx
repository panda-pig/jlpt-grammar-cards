"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import { useAuth } from "@/hooks/useAuth";
import { grammarService } from "@/services/grammarService";
import { learningService } from "@/services/learningService";
import { Heart, Play, Sparkles } from "lucide-react";

const MARQUEE_ITEMS = [
  { text: "わけではない", level: "N3" },
  { text: "にもかかわらず", level: "N2" },
  { text: "に違いない", level: "N3" },
  { text: "をはじめ", level: "N3" },
  { text: "ばかりか", level: "N2" },
  { text: "ことになっている", level: "N3" },
  { text: "からこそ", level: "N3" },
  { text: "といえども", level: "N1" },
  { text: "をものともせず", level: "N1" },
  { text: "に足りる", level: "N1" },
  { text: "てはならない", level: "N4" },
  { text: "ようとしない", level: "N2" },
  { text: "てしかたがない", level: "N3" },
  { text: "のみならず", level: "N1" },
  { text: "ものだから", level: "N3" },
];

const LEVEL_BADGE: Record<string, string> = {
  N5: "bg-[#dcebd8] text-[#315b3b]",
  N4: "bg-[#d8e8f0] text-[#2a5a7a]",
  N3: "bg-[#cfdaf5] text-[#2a3a5a]",
  N2: "bg-[#e8e0f5] text-[#5a3a8a]",
  N1: "bg-[#f4b4a8] text-[#7a3a30]",
};

const FLOW_ICONS = ["🎯", "📖", "🃏", "⭐", "✅"];
const FLOW_COLORS = [
  "bg-[#d8e8f0]",
  "bg-[#cfdaf5]",
  "bg-[#fff6df]",
  "bg-[#f4b4a8]/40",
  "bg-[#dcebd8]",
];

export default function HomePage() {
  const dict = useDictionary();
  const v = dict.home.v3;
  const locale = useLocale();
  const { user } = useAuth();

  const [stats, setStats] = useState({ totalGrammar: 955, learned: 0, due: 0, mastered: 0 });
  const [levelPcts, setLevelPcts] = useState<Record<string, number>>({ N5: 0, N4: 0, N3: 0, N2: 0, N1: 0 });
  const [cardFlipped, setCardFlipped] = useState(false);
  const [marqueeHovered, setMarqueeHovered] = useState(false);
  const flipTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const userFlipped = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const [rows, progressMap] = await Promise.all([
          grammarService.getAll(user?.id ?? undefined).catch(() => [] as any[]),
          learningService.getProgressMap(user?.id ?? undefined).catch(() => new Map()),
        ]);
        const total = rows.length;
        const byLevel: Record<string, { total: number; learned: number }> = {
          N5: { total: 0, learned: 0 }, N4: { total: 0, learned: 0 },
          N3: { total: 0, learned: 0 }, N2: { total: 0, learned: 0 }, N1: { total: 0, learned: 0 },
        };
        let learned = 0, mastered = 0, due = 0;
        const now = Date.now();

        for (const row of rows) {
          const level = row.jlpt_level ?? row.jlptLevel;
          if (byLevel[level]) byLevel[level].total++;
          const p = progressMap.get(String(row.source_key ?? row.id));
          if (p) {
            if (p.study_status === "学习中" || p.study_status === "已掌握") {
              learned++;
              if (byLevel[level]) byLevel[level].learned++;
            }
            if (p.study_status === "已掌握") mastered++;
            if (p.next_review_at && new Date(p.next_review_at).getTime() <= now && p.study_status === "学习中") due++;
          }
        }

        const pcts: Record<string, number> = {};
        for (const lv of ["N5", "N4", "N3", "N2", "N1"])
          pcts[lv] = byLevel[lv].total > 0 ? Math.round((byLevel[lv].learned / byLevel[lv].total) * 100) : 0;

        setStats({ totalGrammar: total, learned, due, mastered });
        setLevelPcts(pcts);
      } catch { /* fallback to defaults */ }
    })();
  }, [user]);

  // Auto-flip flashcard — skipped when the user prefers reduced motion.
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const start = setTimeout(() => {
      flipTimer.current = setInterval(() => {
        if (!userFlipped.current) setCardFlipped(f => !f);
      }, 3200);
    }, 1800);
    return () => { clearTimeout(start); clearInterval(flipTimer.current); };
  }, []);

  const handleCardClick = () => {
    userFlipped.current = true;
    clearInterval(flipTimer.current);
    setCardFlipped(f => !f);
  };

  const allMarqueeItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <MainLayout>
      <div className="overflow-x-hidden">

        {/* ══ HERO ═══════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-[1160px] px-6 pt-16 pb-14 md:pt-20 md:pb-16">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* Copy */}
            <div className="text-center lg:text-left">
              <div className="mb-5 flex items-center justify-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776] lg:justify-start">
                <div className="h-px w-8 bg-[#242424]" />
                N1–N5 Grammar Cards · SM-2 Review
              </div>
              <h1 className="mb-4 font-serif text-[clamp(42px,5.6vw,70px)] font-bold leading-[1.02] tracking-[-0.025em] text-black">
                {v.heroTitle.map((line, i) => (
                  <span key={i}>{line}{i < v.heroTitle.length - 1 && <br />}</span>
                ))}
              </h1>
              <p className="mb-7 mx-auto max-w-[480px] text-[17px] leading-[1.75] text-[#4c4947] lg:mx-0">
                {v.heroSubtitle}
              </p>
              <div className="mb-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <Link href={`/${locale}/study`} className="btn-v3-primary">
                  <Play className="h-4 w-4" /> {dict.common.startLearning}
                </Link>
                <Link href={`/${locale}/grammar`} className="btn-v3-secondary">
                  {dict.common.viewLibrary}
                </Link>
              </div>
              <div className="mb-5 flex flex-wrap justify-center gap-[6px] lg:justify-start">
                {(["N5", "N4", "N3", "N2", "N1"] as const).map((lv) => (
                  <span key={lv} className={`font-mono text-[11px] font-bold px-[11px] py-[4px] rounded-full ${LEVEL_BADGE[lv]}`}>
                    {lv}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-[10px] text-[14px] text-[#797776] lg:justify-start">
                <div className="h-[8px] w-[8px] shrink-0 rounded-full bg-[#315b3b] shadow-[0_0_0_5px_rgba(220,235,216,.9)]" />
                {v.localHint}
              </div>
            </div>

            {/* Flashcard */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative" style={{ width: 310, height: 410 }}>
                <div className="absolute inset-0 rounded-[22px] border border-[#ded8d0] bg-[#fbfaf8]"
                  style={{ transform: "rotate(5deg) translate(7px,12px)", zIndex: 0 }} />
                <div className="absolute inset-0 rounded-[22px] border border-[#ded8d0] bg-[#fbfaf8]"
                  style={{ transform: "rotate(-4deg) translate(-5px,16px)", zIndex: 0 }} />
                <div className="fc-perspective absolute inset-0" style={{ zIndex: 1 }}>
                  <div
                    className={`fc-inner w-full h-full cursor-pointer select-none ${cardFlipped ? "fc-flipped" : ""}`}
                    onClick={handleCardClick}
                  >
                    {/* Front */}
                    <div className="fc-face absolute inset-0 rounded-[22px] p-7 flex flex-col"
                      style={{ background: "#cfdaf5", border: "1px solid rgba(100,140,220,.18)",
                        boxShadow: "0 28px 64px rgba(100,140,220,.22), 0 4px 16px rgba(36,36,36,.06)" }}>
                      <div className="mb-2 flex items-center gap-[7px] font-mono text-[11px] text-[rgba(36,36,36,.5)]">
                        <span className="rounded-full bg-[rgba(36,36,36,.08)] px-[9px] py-[3px] font-bold">N3</span>
                        <span>{v.cardCategory}</span>
                      </div>
                      <div className="font-serif text-[44px] leading-[1.08] text-black flex-1 flex items-center">
                        ～わけでは<br />ない
                      </div>
                      <div className="rounded-[11px] bg-[rgba(255,255,255,.52)] p-[11px]">
                        <div className="font-mono text-[10px] text-[rgba(36,36,36,.42)] mb-[3px]">{v.cardConjLabel}</div>
                        <div className="font-mono text-[12px] text-[rgba(36,36,36,.7)]">{v.cardConjValue}</div>
                      </div>
                      <div className="mt-[10px] text-center font-mono text-[10px] text-[rgba(36,36,36,.38)]">
                        {v.cardFlipHint}
                      </div>
                    </div>
                    {/* Back */}
                    <div className="fc-face fc-face-back absolute inset-0 rounded-[22px] p-7 flex flex-col"
                      style={{ background: "#fbfaf8", border: "1px solid #ded8d0",
                        boxShadow: "0 24px 56px rgba(36,36,36,.1), 0 4px 14px rgba(36,36,36,.05)" }}>
                      <div className="mb-3 flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold rounded-full bg-[#cfdaf5] text-[#2a3a5a] px-[11px] py-[4px]">N3</span>
                        <span className="font-mono text-[10px] text-[#797776]">{v.cardFlipBack}</span>
                      </div>
                      <div className="text-[19px] font-semibold text-[#242424] mb-3 leading-[1.4] whitespace-pre-line">
                        {v.cardMeaning}
                      </div>
                      <div className="mb-2">
                        <div className="font-mono text-[10px] uppercase tracking-[.06em] text-[#797776] mb-1">{v.exampleLabel}</div>
                        <div className="text-[14px] font-medium leading-[1.5]">{v.cardExampleJp}</div>
                        <div className="text-[12px] text-[#797776] mt-[2px]">{v.cardExampleCn}</div>
                      </div>
                      <div className="rounded-[10px] bg-[#fff6df] p-[10px] text-[12px] text-[#8a6a20] leading-[1.5]">
                        <div className="font-mono text-[10px] mb-[3px]">⚠ {v.mistakeLabel}</div>
                        {v.cardMistake}
                      </div>
                      <div className="mt-auto grid grid-cols-4 gap-[5px] pt-3">
                        {[
                          { label: "Again", cls: "bg-[#f4b4a8] text-[#7a3a30]" },
                          { label: "Hard",  cls: "bg-[#fff6df] text-[#8a6a20]" },
                          { label: "Good ✓",cls: "bg-[#cfdaf5] text-[#2a3a5a]" },
                          { label: "Easy",  cls: "bg-[#dcebd8] text-[#315b3b]" },
                        ].map((b) => (
                          <div key={b.label} className={`rounded-[9px] py-[8px] text-center font-mono text-[10px] font-bold ${b.cls}`}>
                            {b.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ MARQUEE ════════════════════════════════════════════════ */}
        <div
          className="border-y border-[#ded8d0] bg-[rgba(251,250,247,.82)] py-[13px] overflow-hidden"
          onMouseEnter={() => setMarqueeHovered(true)}
          onMouseLeave={() => setMarqueeHovered(false)}
        >
          <div className={`flex w-max ${marqueeHovered ? "animate-marquee-paused" : "animate-marquee"}`}>
            {allMarqueeItems.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 whitespace-nowrap px-[18px]">
                <span className="font-mono text-[13px] font-semibold text-[#242424]">{item.text}</span>
                <span className={`font-mono text-[10px] font-bold px-[8px] py-[3px] rounded-full ${LEVEL_BADGE[item.level]}`}>
                  {item.level}
                </span>
                <span className="text-[#ded8d0] text-[18px] mx-[2px]">·</span>
              </span>
            ))}
          </div>
        </div>

        {/* ══ FEATURES (Bento) ═══════════════════════════════════════ */}
        <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-20">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-[6px] flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">
                <div className="h-px w-8 bg-[#242424]" />
                Study Surface
              </div>
              <h2 className="font-serif text-[clamp(28px,3.8vw,46px)] font-bold leading-[1.1] tracking-[-0.02em] text-balance">
                {v.featuresHeading}
              </h2>
            </div>
            <Link href={`/${locale}/grammar`} className="btn-v3-secondary shrink-0 self-start sm:self-end">
              {dict.common.viewLibrary}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-[10px]">
            {/* Grammar library */}
            <div className="lg:col-span-7 rounded-[18px] border border-[rgba(100,140,220,.16)] bg-[#cfdaf5]/40 p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(36,36,36,.08)] text-xl">📚</div>
              <div className="font-mono text-[15px] font-bold mb-2">{v.featLibTitle}</div>
              <div className="text-[13px] text-[#797776] leading-[1.65]">{v.featLibDesc.replace("{count}", String(stats.totalGrammar))}</div>
              <div className="mt-5 flex flex-wrap gap-[6px]">
                {[
                  { text: "から〜にかけて", lv: "N2", c: "#5a3a8a" },
                  { text: "ものだから",     lv: "N3", c: "#315b3b" },
                  { text: "に違いない",     lv: "N3", c: "#2a3a5a" },
                  { text: "といえども",     lv: "N1", c: "#7a3a30" },
                  { text: "のみならず",     lv: "N1", c: "#7a3a30" },
                  { text: "に足りる",       lv: "N1", c: "#7a3a30" },
                ].map((t) => (
                  <div key={t.text} className="rounded-[10px] border border-[#ded8d0] bg-[#f6f3f1] px-[11px] py-[7px] font-mono text-[11px]">
                    <div className="font-bold text-[#242424]">{t.text}</div>
                    <div className="text-[10px] mt-[2px]" style={{ color: t.c }}>{t.lv}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SM-2 */}
            <div className="lg:col-span-5 rounded-[18px] border border-[rgba(49,91,59,.12)] bg-[#dcebd8]/50 p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(36,36,36,.08)] text-xl">🔄</div>
              <div className="font-mono text-[15px] font-bold mb-2">{v.featSmTitle}</div>
              <div className="text-[13px] text-[#797776] leading-[1.65]">{v.featSmDesc}</div>
              <div className="mt-5 flex h-[58px] items-end gap-[5px]">
                {[18, 34, 50, 64, 78, 92, 100].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-[4px] bg-[#315b3b]" style={{ height: `${h}%`, opacity: 0.3 + i * 0.1 }} />
                ))}
              </div>
              <div className="mt-[5px] font-mono text-[10px] text-[#315b3b] opacity-75">{v.featSmChart}</div>
            </div>

            {/* 3 narrow cards */}
            {v.featCards.map((f, i) => {
              const meta = [
                { icon: "🔍", bg: "bg-[#e8e0f5]/30" },
                { icon: "📊", bg: "bg-[#fff6df]/50" },
                { icon: "☁️", bg: "bg-[#d8e8f0]/40" },
              ][i];
              return (
                <div key={f.title} className={`lg:col-span-4 rounded-[18px] border border-[#ded8d0] ${meta.bg} p-6`}>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(36,36,36,.07)] text-xl">{meta.icon}</div>
                  <div className="font-mono text-[15px] font-bold mb-2">{f.title}</div>
                  <div className="text-[13px] text-[#797776] leading-[1.65]">{f.desc}</div>
                </div>
              );
            })}

            {/* Personal library */}
            <div className="sm:col-span-2 lg:col-span-12 rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1 min-w-0">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4b4a8]/40 text-xl">✏️</div>
                <div className="font-mono text-[15px] font-bold mb-2">{v.featPersonalTitle}</div>
                <div className="text-[13px] text-[#797776] leading-[1.65]">{v.featPersonalDesc}</div>
              </div>
              <div className="flex flex-wrap gap-[7px] shrink-0">
                <div className="rounded-[10px] bg-[#f4b4a8] px-[13px] py-[7px] font-mono text-[11px] font-bold text-[#7a3a30]">{v.featPersonalAdd}</div>
                {["眼から鱗 · 私人", "お世話になります"].map((t) => (
                  <div key={t} className="rounded-[10px] border border-[#ded8d0] bg-[#f6f3f1] px-[13px] py-[7px] font-mono text-[11px] text-[#797776]">{t}</div>
                ))}
                <div className="rounded-[10px] border border-[#ded8d0] bg-[#f6f3f1] px-[13px] py-[7px] font-mono text-[11px] text-[#797776] opacity-40 line-through">{v.featPersonalHidden}</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ LEARNING FLOW ══════════════════════════════════════════ */}
        <section className="border-t border-[#ded8d0] bg-[rgba(251,250,247,.78)]">
          <div className="mx-auto max-w-[1160px] px-6 py-16 md:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(220px,320px)_1fr]">
              <div className="border-l-2 border-[#242424] pl-5 lg:sticky lg:top-24 lg:self-start">
                <div className="mb-[6px] flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">
                  <div className="h-px w-8 bg-[#242424]" />
                  Five-step learning loop
                </div>
                <h2 className="font-serif text-[clamp(26px,3.4vw,40px)] font-bold leading-[1.1] tracking-[-0.02em] mt-2 text-balance">
                  {v.flowHeading}
                </h2>
                <p className="mt-3 text-[15px] text-[#797776] leading-[1.7]">
                  {v.flowIntro}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 border border-[#c9c1b8] rounded-[18px] overflow-hidden bg-[#c9c1b8] gap-px">
                {dict.home.flowSteps.map((step, i) => (
                  <div key={i} className="bg-[#fbfaf8] p-5 flex flex-col hover:bg-[rgba(207,218,245,.18)] transition-colors">
                    <div className="mb-3 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-[#242424] bg-[#fbfaf8] font-mono text-[12px] font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className={`mb-3 flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-[17px] ${FLOW_COLORS[i]}`}>
                      {FLOW_ICONS[i]}
                    </div>
                    <div className="font-serif text-[15px] font-bold mb-[6px] leading-[1.2]">{step.step}</div>
                    <div className="text-[12px] text-[#66615d] leading-[1.6] flex-1">{step.desc}</div>
                    <div className="mt-3 self-start rounded-full border border-[#ded8d0] bg-[#f6f3f1] px-[10px] py-[4px] font-mono text-[10px] font-bold text-[#797776]">
                      {v.flowChips[i]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══ PRODUCT PREVIEW ════════════════════════════════════════ */}
        <section className="mx-auto max-w-[1160px] px-6 py-16 md:py-20">
          <div className="mb-10">
            <div className="mb-[6px] flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">
              <div className="h-px w-8 bg-[#242424]" />
              Product Preview
            </div>
            <h2 className="font-serif text-[clamp(28px,3.8vw,46px)] font-bold leading-[1.1] tracking-[-0.02em] text-balance">
              {v.previewHeading}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Card spread */}
            <div>
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[.07em] text-[#797776]">{v.previewCardLabel}</div>
              <div className="grid grid-cols-2 gap-[10px]">
                <div className="rounded-[20px] border border-[rgba(100,140,220,.15)] bg-[#cfdaf5] p-5">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[.07em] text-[#797776]">{v.previewFront}</div>
                  <div className="font-serif text-[32px] leading-[1.1] text-black mb-3">～わけでは<br />ない</div>
                  <div className="rounded-[9px] bg-[rgba(255,255,255,.55)] p-[9px]">
                    <div className="font-mono text-[10px] text-[rgba(36,36,36,.4)] mb-[3px]">{v.cardConjLabel}</div>
                    <div className="font-mono text-[11px] text-[rgba(36,36,36,.6)]">{v.cardConjValue}</div>
                  </div>
                  <div className="mt-3 flex gap-[6px]">
                    <span className="font-mono text-[11px] font-bold bg-[#cfdaf5] text-[#2a3a5a] border border-[rgba(36,36,36,.1)] rounded-full px-[10px] py-[3px]">N3</span>
                  </div>
                </div>
                <div className="rounded-[20px] border border-[#ded8d0] bg-[#fbfaf8] p-5">
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[.07em] text-[#797776]">{v.previewBack}</div>
                  <div className="text-[16px] font-semibold mb-3 leading-[1.4] whitespace-pre-line">{v.cardMeaning}</div>
                  <div className="text-[12px] font-medium leading-[1.5]">嫌いなわけではないが…</div>
                  <div className="text-[11px] text-[#797776] mt-[2px]">{v.cardExampleCn}</div>
                  <div className="mt-3 rounded-[9px] bg-[#fff6df] p-[9px] text-[11px] text-[#8a6a20] leading-[1.5]">
                    <div className="font-mono text-[10px] mb-[2px]">⚠ {v.mistakeLabel}</div>
                    {v.cardMistake}
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-[4px]">
                    {[
                      { l: "Again", c: "bg-[#f4b4a8] text-[#7a3a30]" },
                      { l: "Hard",  c: "bg-[#fff6df] text-[#8a6a20]" },
                      { l: "Good",  c: "bg-[#cfdaf5] text-[#2a3a5a]" },
                      { l: "Easy",  c: "bg-[#dcebd8] text-[#315b3b]" },
                    ].map((b) => (
                      <div key={b.l} className={`rounded-[8px] py-[6px] text-center font-mono text-[10px] font-bold ${b.c}`}>{b.l}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard */}
            <div>
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[.07em] text-[#797776]">{v.previewDashLabel}</div>
              <div className="rounded-[18px] border border-[#242424] overflow-hidden bg-[#fffefa]"
                style={{ boxShadow: "0 10px 30px rgba(36,36,36,.08)" }}>
                <div className="px-5 pt-5 pb-0 flex items-center justify-between gap-3 mb-4">
                  <h3 className="font-serif text-[22px] font-bold">{v.previewMasteryTitle}</h3>
                  <span className="rounded-full border border-[#ded8d0] bg-[#dcebd8] px-[10px] py-[6px] font-mono text-[11px] font-bold text-[#315b3b] whitespace-nowrap">
                    SM-2 synced
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-px bg-[#ded8d0] border-t border-b border-[#ded8d0]">
                  {[
                    { val: stats.totalGrammar, lbl: v.statTotal },
                    { val: stats.learned, lbl: v.statLearned },
                    { val: stats.due, lbl: v.statDue },
                    { val: stats.mastered, lbl: v.statMastered },
                  ].map((m) => (
                    <div key={m.lbl} className="bg-[#fffefa] px-5 py-4">
                      <div className="font-serif text-[32px] leading-[1]">{m.val}</div>
                      <div className="mt-[5px] text-[12px] text-[#797776]">{m.lbl}</div>
                    </div>
                  ))}
                </div>
                <div className="p-5 grid gap-[12px]">
                  {(["N5", "N4", "N3", "N2", "N1"] as const).map((lv) => (
                    <div key={lv} className="grid grid-cols-[34px_1fr_36px] gap-3 items-center">
                      <span className="font-mono text-[12px] font-bold">{lv}</span>
                      <div className="h-[20px] rounded-full border border-[#ded8d0] overflow-hidden bg-[#ece7e0]">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${levelPcts[lv]}%`, background: "linear-gradient(90deg,#f4b4a8,#fff6df)" }} />
                      </div>
                      <span className="font-mono text-[12px] font-bold text-right">{levelPcts[lv]}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ STATS ══════════════════════════════════════════════════ */}
        <section className="border-t border-[#ded8d0]">
          <div className="mx-auto max-w-[1160px] px-6 py-14">
            <div className="grid grid-cols-2 sm:grid-cols-4 border border-[#242424] bg-[#242424] gap-px">
              {[
                { val: `${stats.totalGrammar}+`, lbl: v.statsRow[0] },
                { val: "5",     lbl: v.statsRow[1] },
                { val: "SM·2", lbl: v.statsRow[2] },
                { val: "中/EN", lbl: v.statsRow[3] },
              ].map((s) => (
                <div key={s.lbl} className="bg-[#fffefa] py-[28px] px-6 text-center">
                  <div className="font-serif text-[36px] leading-[1] mb-[6px]">{s.val}</div>
                  <div className="font-mono text-[11px] text-[#797776]">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA (V1 border style) ══════════════════════════════════ */}
        <section className="mx-auto max-w-[1160px] px-6 pb-16 md:pb-20">
          <div className="border-t-2 border-b-2 border-[#242424] py-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] items-center">
              <div>
                <div className="mb-[6px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">{v.ctaEyebrow}</div>
                <h2 className="font-serif text-[clamp(32px,4.8vw,58px)] font-bold leading-[1.02] tracking-[-0.02em] text-balance">
                  {v.ctaHeading.replace("{due}", String(stats.due || 18))}
                </h2>
                <p className="mt-3 max-w-[600px] text-[17px] text-[#797776] leading-[1.7]">
                  {v.ctaSubtitle}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/${locale}/study`} className="btn-v3-primary">
                  <Play className="h-4 w-4" /> {dict.home.ctaButton}
                </Link>
                <Link href={`/${locale}/grammar`} className="btn-v3-secondary">
                  {dict.common.viewLibrary}
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-5 text-[14px] text-[#797776]">
            <Link href={`/${locale}/pro`} className="underline underline-offset-4 hover:text-[#242424] transition-colors flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> {dict.home.ctaPro}
            </Link>
            <Link href={`/${locale}/support`} className="underline underline-offset-4 hover:text-[#242424] transition-colors flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" /> {dict.home.ctaSupport}
            </Link>
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
