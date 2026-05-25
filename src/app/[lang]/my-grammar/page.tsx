"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { MainLayout } from "@/components/layout/MainLayout";
import { LevelBadge } from "@/components/grammar/LevelBadge";
import { GrammarTypeBadge } from "@/components/grammar/GrammarTypeBadge";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { grammarService } from "@/services/grammarService";
import { toGrammarEntry } from "@/lib/mappers";
import { CATEGORY_LABELS } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import type { GrammarCategory, GrammarEntry, JLPTLevel } from "@/lib/types";
import { BookOpen, Database, EyeOff, Layers3, Lock, PencilLine, Plus, Search } from "lucide-react";

type LibraryStatus = Awaited<ReturnType<typeof grammarService.getUserLibraryStatus>>;

const LEVELS: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as GrammarCategory[];

const emptyForm = {
  title: "",
  slug: "",
  jlptLevel: "N3" as JLPTLevel,
  grammarType: "その他" as GrammarCategory,
  structure: "",
  meaningZh: "",
  meaningEn: "",
  explanationZh: "",
  explanationEn: "",
  exampleJp: "",
  exampleZh: "",
  exampleEn: "",
};

function makeSlug(title: string) {
  const normalized = title.trim().replace(/\s+/g, "-");
  return `${normalized || "grammar"}-${Date.now()}`;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-xs font-medium text-[#797776]">{label}</span>
      {children}
    </label>
  );
}

export default function MyGrammarPage() {
  const { user } = useAuth();
  const dict = useDictionary();
  const locale = useLocale();
  const t = dict.myGrammar;
  const [status, setStatus] = useState<LibraryStatus | null>(null);
  const [entries, setEntries] = useState<GrammarEntry[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [libraryMeta, setLibraryMeta] = useState({ privateCount: 0, hiddenCount: 0, overrideCount: 0 });

  useEffect(() => {
    let alive = true;
    async function load() {
      setLoading(true);
      try {
        const [statusResult, rows] = await Promise.all([
          grammarService.getUserLibraryStatus().catch(() => null),
          grammarService.getAll(user?.id),
        ]);
        if (!alive) return;
        setStatus(statusResult);
        setEntries(rows.map(toGrammarEntry));
        setLibraryMeta(user?.id ? grammarService.getLocalUserLibraryMeta(user.id) : { privateCount: 0, hiddenCount: 0, overrideCount: 0 });
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [user?.id]);

  const ready = !!status?.ready;
  const canEdit = !!user;
  const localPersonalMode = !!user && !ready;
  const privateCount = entries.filter((entry) => entry.isUserCreated).length;
  const defaultCount = entries.filter((entry) => !entry.isUserCreated).length;
  const filteredDefaults = useMemo(() => {
    const q = search.trim().toLowerCase();
    const defaults = entries.filter((entry) => !entry.isUserCreated);
    if (!q) return defaults.slice(0, 8);
    return defaults
      .filter((entry) =>
        entry.title.toLowerCase().includes(q) ||
        entry.meaningZh.toLowerCase().includes(q) ||
        entry.meaningEn.toLowerCase().includes(q) ||
        entry.structure.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [entries, search]);

  const updateForm = (key: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleCreate = async () => {
    if (!user || !form.title.trim()) return;
    setSaving(true);
    setMessage("");
    try {
      const slug = form.slug.trim() || makeSlug(form.title);
      await grammarService.createUserItem(user.id, {
        title: form.title.trim(),
        slug,
        jlpt_level: form.jlptLevel,
        source_route: "综合",
        grammar_type: form.grammarType,
        tags: [],
        meaning_cn: form.meaningZh,
        meaning_zh: form.meaningZh,
        meaning_en: form.meaningEn,
        structure: form.structure,
        explanation: form.explanationZh,
        explanation_zh: form.explanationZh,
        explanation_en: form.explanationEn,
        usage_note: "",
        usage_note_zh: "",
        usage_note_en: "",
        example_jp: form.exampleJp,
        example_cn: form.exampleZh,
        example_zh: form.exampleZh,
        example_en: form.exampleEn,
      });
      const rows = await grammarService.getAll(user.id);
      setEntries(rows.map(toGrammarEntry));
      setLibraryMeta(grammarService.getLocalUserLibraryMeta(user.id));
      setForm(emptyForm);
      setMessage(t.saved);
    } finally {
      setSaving(false);
    }
  };

  const handleHide = async (entry: GrammarEntry) => {
    if (!user) return;
    await grammarService.hideForUser(user.id, entry.id);
    setEntries((current) => current.filter((item) => item.id !== entry.id));
    setLibraryMeta(grammarService.getLocalUserLibraryMeta(user.id));
    setMessage(t.hidden);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto flex min-h-[320px] max-w-5xl items-center justify-center py-6">
          <p className="font-mono text-sm text-[#797776]">{dict.common.loading}</p>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Card className="rounded-[36px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#242424] text-[#f6f3f1]">
                <Lock className="h-5 w-5" />
              </div>
              <h1 className="font-serif text-3xl text-[#242424]">{t.loginTitle}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#797776]">{t.loginDesc}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/${locale}/login`} className={buttonVariants({ className: "rounded-full font-mono" })}>
                  {t.loginAction}
                </Link>
                <Link href={`/${locale}/grammar`} className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>
                  {t.browseDefault}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-7">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase text-[#797776]">{dict.common.siteName}</p>
            <h1 className="font-serif text-3xl text-[#242424]">{t.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#797776]">{t.subtitle}</p>
          </div>
          <Badge className={`w-fit rounded-full px-3 py-1 font-mono text-xs ${ready ? "bg-[#dcebd8] text-[#315b3b]" : "bg-[#fff6df] text-[#7a5b20]"}`}>
            {ready ? t.dbReadyTitle : t.localModeTitle}
          </Badge>
        </div>

        <div className="mb-5 rounded-[28px] border border-[rgba(36,36,36,0.16)] bg-[#fff6df] px-4 py-3 text-sm leading-relaxed text-[#4e4d4d]">
          <div className="flex items-start gap-3">
            <Database className="mt-0.5 h-4 w-4 shrink-0 text-[#a08040]" />
            <div>
              <p className="font-mono text-xs font-medium text-[#242424]">
                {ready ? t.dbReadyTitle : t.localModeTitle}
              </p>
              <p className="mt-1">{ready ? t.dbReadyDesc : t.localModeDesc}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          {[
            { label: t.defaultDeck, value: defaultCount, icon: BookOpen },
            { label: t.privateItems, value: Math.max(privateCount, libraryMeta.privateCount), icon: Plus },
            { label: t.hiddenItems, value: libraryMeta.hiddenCount, icon: EyeOff },
            { label: t.overrides, value: libraryMeta.overrideCount, icon: PencilLine },
          ].map((item) => (
            <Card key={item.label} className="rounded-[30px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
              <CardContent className="p-4">
                <item.icon className="mb-2 h-4 w-4 text-[#797776]" />
                <p className="font-mono text-2xl text-[#242424]">{item.value}</p>
                <p className="font-mono text-xs text-[#797776]">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
          <Card className="rounded-[36px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
            <CardContent className="p-5 sm:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-[#242424]">{t.addPrivate}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#797776]">{t.addPrivateDesc}</p>
                </div>
                {localPersonalMode && <Badge variant="secondary" className="rounded-full font-mono text-xs">{dict.common.localMode}</Badge>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t.form.title}>
                  <Input value={form.title} onChange={(event) => updateForm("title", event.target.value)} disabled={!canEdit} />
                </Field>
                <Field label={t.form.slug}>
                  <Input value={form.slug} onChange={(event) => updateForm("slug", event.target.value)} placeholder={makeSlug(form.title)} disabled={!canEdit} />
                </Field>
                <Field label={t.form.jlptLevel}>
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                    value={form.jlptLevel}
                    onChange={(event) => updateForm("jlptLevel", event.target.value)}
                    disabled={!canEdit}
                  >
                    {LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
                  </select>
                </Field>
                <Field label={t.form.grammarType}>
                  <select
                    className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                    value={form.grammarType}
                    onChange={(event) => updateForm("grammarType", event.target.value)}
                    disabled={!canEdit}
                  >
                    {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </Field>
                <Field label={t.form.structure}>
                  <Input value={form.structure} onChange={(event) => updateForm("structure", event.target.value)} disabled={!canEdit} />
                </Field>
                <Field label={t.form.meaningZh}>
                  <Input value={form.meaningZh} onChange={(event) => updateForm("meaningZh", event.target.value)} disabled={!canEdit} />
                </Field>
                <Field label={t.form.meaningEn}>
                  <Input value={form.meaningEn} onChange={(event) => updateForm("meaningEn", event.target.value)} disabled={!canEdit} />
                </Field>
                <Field label={t.form.exampleJp}>
                  <Input value={form.exampleJp} onChange={(event) => updateForm("exampleJp", event.target.value)} disabled={!canEdit} />
                </Field>
                <Field label={t.form.exampleZh}>
                  <Input value={form.exampleZh} onChange={(event) => updateForm("exampleZh", event.target.value)} disabled={!canEdit} />
                </Field>
                <Field label={t.form.exampleEn}>
                  <Input value={form.exampleEn} onChange={(event) => updateForm("exampleEn", event.target.value)} disabled={!canEdit} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label={t.form.explanationZh}>
                    <Textarea value={form.explanationZh} onChange={(event) => updateForm("explanationZh", event.target.value)} disabled={!canEdit} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label={t.form.explanationEn}>
                    <Textarea value={form.explanationEn} onChange={(event) => updateForm("explanationEn", event.target.value)} disabled={!canEdit} />
                  </Field>
                </div>
              </div>

              {localPersonalMode && <p className="mt-4 text-xs text-[#797776]">{t.disabledHint}</p>}
              {message && <p className="mt-4 text-sm text-[#315b3b]">{message}</p>}
              <Button className="mt-5 rounded-full font-mono" onClick={handleCreate} disabled={!canEdit || saving || !form.title.trim()}>
                <Plus className="mr-1 h-4 w-4" />{saving ? t.saving : t.save}
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="rounded-[36px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start gap-3">
                  <Layers3 className="mt-1 h-5 w-5 text-[#797776]" />
                  <div>
                    <h2 className="font-serif text-2xl text-[#242424]">{t.manageDefault}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-[#797776]">{t.manageDefaultDesc}</p>
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-2 rounded-full border border-[rgba(36,36,36,0.16)] px-3">
                  <Search className="h-4 w-4 text-[#797776]" />
                  <Input
                    className="border-0 px-0 shadow-none focus-visible:ring-0"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={t.searchPlaceholder}
                  />
                </div>
                <div className="space-y-2">
                  {filteredDefaults.map((entry) => (
                    <div key={entry.id} className="rounded-[24px] border border-[rgba(36,36,36,0.12)] bg-[#fbfaf8] p-3">
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-[#242424]">{entry.title}</span>
                        <LevelBadge level={entry.jlptLevel} />
                        <GrammarTypeBadge category={entry.grammarType} />
                      </div>
                      <p className="line-clamp-1 text-xs text-[#797776]">{entry.structure}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-[#4e4d4d]">{entry.meaningZh}</p>
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm" className="rounded-full font-mono" disabled={!canEdit} onClick={() => handleHide(entry)}>
                          <EyeOff className="mr-1 h-3.5 w-3.5" />{t.hideFromMine}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[36px] border border-[rgba(36,36,36,0.16)] bg-[#f6f3f1] shadow-none">
              <CardContent className="p-5">
                <h2 className="mb-3 font-serif text-xl text-[#242424]">{t.schemaCheck}</h2>
                <div className="space-y-2 text-xs">
                  {status && Object.entries(status.checks).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-3 rounded-full border border-[rgba(36,36,36,0.12)] px-3 py-2">
                      <span className="font-mono text-[#797776]">{key}</span>
                      <Badge className={`rounded-full font-mono text-[10px] ${value ? "bg-[#dcebd8] text-[#315b3b]" : "bg-[#f4b4a8]/35 text-[#7a3a30]"}`}>
                        {value ? "OK" : "TODO"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
