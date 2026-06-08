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
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { grammarService } from "@/services/grammarService";
import { toGrammarEntry } from "@/lib/mappers";
import { CATEGORY_LABELS } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";
import { useDictionary, useLocale } from "@/components/layout/LocaleProvider";
import type { GrammarCategory, GrammarEntry, JLPTLevel } from "@/lib/types";
import {
  BookOpen, Crown, Database, EyeOff, Layers3, Lock, PencilLine, Plus, Search,
  Trash2, Undo2, CheckSquare, Square, X,
} from "lucide-react";

type LibraryStatus = Awaited<ReturnType<typeof grammarService.getUserLibraryStatus>>;

const LEVELS: JLPTLevel[] = ["N5", "N4", "N3", "N2", "N1"];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as GrammarCategory[];

const emptyForm = {
  title: "", jlptLevel: "N3" as JLPTLevel, grammarType: "その他" as GrammarCategory,
  structure: "", meaningZh: "", meaningEn: "", explanationZh: "", explanationEn: "",
  exampleJp: "", exampleZh: "", exampleEn: "",
};

function makeSlug(title: string) {
  return `${title.trim().replace(/\s+/g, "-") || "grammar"}-${Date.now()}`;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
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
  const [hiddenEntries, setHiddenEntries] = useState<GrammarEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [batchMode, setBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPro, setIsPro] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user?.id) { setIsPro(false); return; }
    fetch("/api/me/entitlements", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setIsPro(Boolean(d?.isPro)))
      .catch(() => setIsPro(false));
  }, [user?.id]);

  const refreshMeta = async () => {
    if (!user?.id) return;
    const [meta, hidden] = await Promise.all([
      grammarService.getLocalUserLibraryMeta(user.id),
      grammarService.getHiddenItems(user.id).catch(() => []),
    ]);
    const remoteCount = hidden.length;
    const localCount = meta.hiddenCount;
    setLibraryMeta({ ...meta, hiddenCount: remoteCount + localCount });
    setHiddenEntries(hidden.map(toGrammarEntry));
  };

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
        if (user?.id) {
          const [meta, hidden] = await Promise.all([
            grammarService.getLocalUserLibraryMeta(user.id),
            grammarService.getHiddenItems(user.id).catch(() => []),
          ]);
          if (!alive) return;
          setLibraryMeta({ ...meta, hiddenCount: hidden.length + meta.hiddenCount });
          setHiddenEntries(hidden.map(toGrammarEntry));
        }
      } finally { if (alive) setLoading(false); }
    }
    load();
    return () => { alive = false; };
  }, [user?.id]);

  const FREE_PRIVATE_LIMIT = 10;

  const ready = !!status?.ready;
  const canEdit = !!user;
  const privateEntries = entries.filter((e) => e.isUserCreated);
  const defaultEntries = entries.filter((e) => !e.isUserCreated);
  const privateCount = privateEntries.length;
  const defaultCount = defaultEntries.length;
  const currentPrivateCount = Math.max(privateCount, libraryMeta.privateCount);
  // Soft gate: Free users can read/edit existing entries but cannot add new ones past limit.
  // isPro===null means still loading — allow optimistically to avoid flicker.
  const atFreeLimit = isPro === false && currentPrivateCount >= FREE_PRIVATE_LIMIT;

  const filteredDefaults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return defaultEntries.slice(0, 20);
    return defaultEntries.filter((e) =>
      e.title.toLowerCase().includes(q) || e.meaningZh.toLowerCase().includes(q) ||
      e.meaningEn.toLowerCase().includes(q) || e.structure.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [defaultEntries, search]);

  const handleCreate = async () => {
    if (!user || !form.title.trim()) return;
    setSaving(true); setMessage("");
    try {
      const slug = makeSlug(form.title);
      await grammarService.createUserItem(user.id, {
        title: form.title.trim(), slug,
        jlpt_level: form.jlptLevel, source_route: "综合", grammar_type: form.grammarType, tags: [],
        meaning_cn: form.meaningZh, meaning_zh: form.meaningZh, meaning_en: form.meaningEn,
        structure: form.structure,
        explanation: form.explanationZh, explanation_zh: form.explanationZh, explanation_en: form.explanationEn,
        usage_note: "", usage_note_zh: "", usage_note_en: "",
        example_jp: form.exampleJp, example_cn: form.exampleZh, example_zh: form.exampleZh, example_en: form.exampleEn,
      });
      const rows = await grammarService.getAll(user.id);
      setEntries(rows.map(toGrammarEntry));
      await refreshMeta();
      setForm(emptyForm);
      setMessage(t.saved);
    } catch (error) {
      const text = error instanceof Error ? error.message : "";
      setMessage(
        text.includes("free_private_grammar_limit_reached")
          ? t.freeLimitReached.replace("{limit}", String(FREE_PRIVATE_LIMIT))
          : t.saveFailed
      );
    } finally { setSaving(false); }
  };

  const handleHide = async (entry: GrammarEntry) => {
    if (!user) return;
    await grammarService.hideForUser(user.id, entry.baseGrammarKey || entry.id);
    setEntries((c) => c.filter((e) => e.id !== entry.id));
    await refreshMeta();
    setMessage(t.hidden);
  };

  const handleDeletePrivate = async (entry: GrammarEntry) => {
    if (!user || !confirm(t.deleteConfirm)) return;
    await grammarService.deleteUserItem(user.id, entry.baseGrammarKey || entry.id);
    setEntries((c) => c.filter((e) => e.id !== entry.id));
    await refreshMeta();
    setMessage(t.deleted);
  };

  const handleStartEdit = (entry: GrammarEntry) => {
    setEditingId(entry.id);
    setEditForm({
      title: entry.title,
      jlptLevel: entry.jlptLevel,
      grammarType: entry.grammarType,
      structure: entry.structure,
      meaningZh: entry.meaningZh,
      meaningEn: entry.meaningEn,
      explanationZh: entry.explanationZh,
      explanationEn: entry.explanationEn,
      exampleJp: entry.exampleJp,
      exampleZh: entry.exampleZh,
      exampleEn: entry.exampleEn,
    });
  };

  const handleSaveEdit = async () => {
    if (!user || !editingId || !editForm.title?.trim()) return;
    await grammarService.updateUserItem(user.id, editingId, {
      title: editForm.title.trim(),
      jlpt_level: editForm.jlptLevel,
      grammar_type: editForm.grammarType,
      structure: editForm.structure,
      meaning_zh: editForm.meaningZh,
      meaning_en: editForm.meaningEn,
      explanation_zh: editForm.explanationZh,
      explanation_en: editForm.explanationEn,
      example_jp: editForm.exampleJp,
      example_zh: editForm.exampleZh,
      example_en: editForm.exampleEn,
      updated_at: new Date().toISOString(),
    });
    const rows = await grammarService.getAll(user.id);
    setEntries(rows.map(toGrammarEntry));
    setEditingId(null);
    setMessage(t.saved);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllDefaults = () => {
    setSelectedIds(new Set(filteredDefaults.map((e) => e.id)));
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setBatchMode(false);
  };

  const batchHide = async () => {
    if (!user || selectedIds.size === 0) return;
    if (!confirm(t.batchHideConfirm.replace("{count}", String(selectedIds.size)))) return;
    for (const id of selectedIds) {
      const entry = entries.find((e) => e.id === id);
      if (entry && !entry.isUserCreated) {
        await grammarService.hideForUser(user.id, entry.baseGrammarKey || id);
      }
    }
    const rows = await grammarService.getAll(user.id);
    setEntries(rows.map(toGrammarEntry));
    await refreshMeta();
    clearSelection();
    setMessage(t.batchHidden.replace("{count}", String(selectedIds.size)));
  };

  // ---- render ----

  if (loading) {
    return <MainLayout><div className="mx-auto flex min-h-[320px] max-w-5xl items-center justify-center py-6"><p className="font-mono text-sm text-[#797776]">{dict.common.loading}</p></div></MainLayout>;
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#242424] text-[#f6f3f1]"><Lock className="h-5 w-5" /></div>
              <h1 className="font-serif text-3xl text-[#242424]">{t.loginTitle}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#797776]">{t.loginDesc}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/${locale}/login`} className={buttonVariants({ className: "rounded-full font-mono" })}>{t.loginAction}</Link>
                <Link href={`/${locale}/grammar`} className={buttonVariants({ variant: "outline", className: "rounded-full font-mono" })}>{t.browseDefault}</Link>
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
            <div className="mb-2 flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">
              <div className="h-px w-8 bg-[#242424]" />
              {dict.common.siteName}
            </div>
            <h1 className="font-serif text-[clamp(28px,3.6vw,46px)] font-bold leading-[1.08] tracking-[-0.022em] text-black text-balance">{t.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#797776]">{t.subtitle}</p>
          </div>
          <Badge className={`w-fit rounded-full px-3 py-1 font-mono text-xs ${ready ? "bg-[#dcebd8] text-[#315b3b]" : "bg-[#fff6df] text-[#7a5b20]"}`}>
            {ready ? t.dbReadyTitle : t.localModeTitle}
          </Badge>
        </div>

        {/* db status */}
        <div className="mb-5 rounded-[14px] border border-[#e8c178]/50 bg-[#fff6df] px-4 py-3 text-sm leading-relaxed text-[#4e4d4d]">
          <div className="flex items-start gap-3">
            <Database className="mt-0.5 h-4 w-4 shrink-0 text-[#a08040]" />
            <div>
              <p className="font-mono text-xs font-medium text-[#242424]">{ready ? t.dbReadyTitle : t.localModeTitle}</p>
              <p className="mt-1">{ready ? t.dbReadyDesc : t.localModeDesc}</p>
            </div>
          </div>
        </div>

        {/* stats */}
        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          {/* Private items card — shows Pro/Free limit badge */}
          <Card className={`rounded-[18px] border shadow-none ${atFreeLimit ? "border-[#d8b15a]/50 bg-[#fff6df]" : "border-[#ded8d0] bg-[#fbfaf8]"}`}>
            <CardContent className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <Plus className="h-4 w-4 text-[#797776]" />
                {isPro ? (
                  <span className="flex items-center gap-1 rounded-full bg-[#315b3b]/10 px-2 py-0.5">
                    <Crown className="h-3 w-3 text-[#315b3b]" />
                    <span className="font-mono text-[10px] text-[#315b3b]">{t.proUnlimited}</span>
                  </span>
                ) : isPro === false ? (
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${atFreeLimit ? "bg-[#d8b15a]/20 text-[#8a6a20]" : "bg-[rgba(36,36,36,0.06)] text-[#797776]"}`}>
                    {t.freeLimit.replace("{limit}", String(FREE_PRIVATE_LIMIT))}
                  </span>
                ) : null}
              </div>
              <p className={`font-mono text-2xl ${atFreeLimit ? "text-[#8a6a20]" : "text-[#242424]"}`}>{currentPrivateCount}</p>
              <p className="font-mono text-xs text-[#797776]">{t.privateItems}</p>
            </CardContent>
          </Card>
          {[
            { label: t.defaultDeck, value: defaultCount, icon: BookOpen },
            { label: t.hiddenItems, value: libraryMeta.hiddenCount, icon: EyeOff },
            { label: t.overrides, value: libraryMeta.overrideCount, icon: PencilLine },
          ].map((item) => (
            <Card key={item.label} className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
              <CardContent className="p-4">
                <item.icon className="mb-2 h-4 w-4 text-[#797776]" />
                <p className="font-mono text-2xl text-[#242424]">{item.value}</p>
                <p className="font-mono text-xs text-[#797776]">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* message */}
        {message && (
          <div className="mb-5 rounded-full bg-[#dcebd8] px-4 py-2 text-sm text-[#315b3b] font-mono flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage("")}><X className="h-3.5 w-3.5" /></button>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
          {/* left: add + private list */}
          <div className="space-y-5">
            {/* add form */}
            <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
              <CardContent className="p-5 sm:p-6">
                <h2 className="font-serif text-2xl text-[#242424]">{t.addPrivate}</h2>
                <p className="mt-1 text-sm leading-relaxed text-[#797776]">{t.addPrivateDesc}</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label={t.form.title}><Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} disabled={!canEdit} /></Field>
                  <Field label={t.form.jlptLevel}>
                    <select className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={form.jlptLevel} onChange={(e) => setForm((f) => ({ ...f, jlptLevel: e.target.value as JLPTLevel }))} disabled={!canEdit}>
                      {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </Field>
                  <Field label={t.form.grammarType}>
                    <select className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={form.grammarType} onChange={(e) => setForm((f) => ({ ...f, grammarType: e.target.value as GrammarCategory }))} disabled={!canEdit}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label={t.form.structure}><Input value={form.structure} onChange={(e) => setForm((f) => ({ ...f, structure: e.target.value }))} disabled={!canEdit} /></Field>
                  <Field label={t.form.meaningZh}><Input value={form.meaningZh} onChange={(e) => setForm((f) => ({ ...f, meaningZh: e.target.value }))} disabled={!canEdit} /></Field>
                  <Field label={t.form.meaningEn}><Input value={form.meaningEn} onChange={(e) => setForm((f) => ({ ...f, meaningEn: e.target.value }))} disabled={!canEdit} /></Field>
                  <Field label={t.form.exampleJp}><Input value={form.exampleJp} onChange={(e) => setForm((f) => ({ ...f, exampleJp: e.target.value }))} disabled={!canEdit} /></Field>
                  <Field label={t.form.exampleZh}><Input value={form.exampleZh} onChange={(e) => setForm((f) => ({ ...f, exampleZh: e.target.value }))} disabled={!canEdit} /></Field>
                  <Field label={t.form.exampleEn}><Input value={form.exampleEn} onChange={(e) => setForm((f) => ({ ...f, exampleEn: e.target.value }))} disabled={!canEdit} /></Field>
                  <div className="sm:col-span-2"><Field label={t.form.explanationZh}><Textarea value={form.explanationZh} onChange={(e) => setForm((f) => ({ ...f, explanationZh: e.target.value }))} disabled={!canEdit} /></Field></div>
                  <div className="sm:col-span-2"><Field label={t.form.explanationEn}><Textarea value={form.explanationEn} onChange={(e) => setForm((f) => ({ ...f, explanationEn: e.target.value }))} disabled={!canEdit} /></Field></div>
                </div>
                {atFreeLimit ? (
                  <div className="mt-5 space-y-2">
                    <p className="text-xs leading-relaxed text-[#8a6a20]">
                      {t.freeLimitReached.replace("{limit}", String(FREE_PRIVATE_LIMIT))}
                    </p>
                    <Link
                      href={`/${locale}/pro`}
                      className={buttonVariants({ className: "rounded-full font-mono w-full" })}
                    >
                      <Crown className="mr-1 h-4 w-4" />{t.upgradeForMore}
                    </Link>
                  </div>
                ) : (
                  <Button className="mt-5 rounded-full font-mono" onClick={handleCreate} disabled={!canEdit || saving || !form.title.trim()}>
                    <Plus className="mr-1 h-4 w-4" />{saving ? t.saving : t.save}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* hidden items — restore */}
            {libraryMeta.hiddenCount > 0 && (
              <Card className="rounded-[18px] border border-[#e8c178]/50 bg-[#fff6df] shadow-none">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <EyeOff className="h-4 w-4 text-[#a08040]" />
                      <h3 className="font-serif text-lg text-[#242424]">{t.hiddenItems} ({libraryMeta.hiddenCount})</h3>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full font-mono" onClick={async () => {
                      if (!user) return;
                      for (const h of hiddenEntries) {
                        await grammarService.restoreForUser(user.id, h.baseGrammarKey || h.id);
                      }
                      const refreshed = await grammarService.getAll(user.id);
                      setEntries(refreshed.map(toGrammarEntry));
                      await refreshMeta();
                      setMessage(t.allRestored);
                    }}>
                      <Undo2 className="mr-1 h-3.5 w-3.5" />{t.restoreAll}
                    </Button>
                  </div>
                  <p className="mb-4 text-sm text-[#797776]">{t.restoreHint}</p>
                  <div className="space-y-2">
                    {hiddenEntries.map((entry) => (
                      <div key={entry.id} className="rounded-[12px] border border-[#ded8d0] bg-[#fbfaf8] p-3">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="mb-1 flex flex-wrap items-center gap-1.5">
                              <span className="font-semibold text-[#242424]">{entry.title}</span>
                              <LevelBadge level={entry.jlptLevel} />
                              <GrammarTypeBadge category={entry.grammarType} />
                            </div>
                            <p className="line-clamp-1 text-xs text-[#797776]">{entry.structure}</p>
                            <p className="mt-1 line-clamp-2 text-sm text-[#4e4d4d]">{entry.meaningZh}</p>
                          </div>
                          <Button variant="outline" size="sm" className="shrink-0 rounded-full font-mono" onClick={async () => {
                            if (!user) return;
                            await grammarService.restoreForUser(user.id, entry.baseGrammarKey || entry.id);
                            const refreshed = await grammarService.getAll(user.id);
                            setEntries(refreshed.map(toGrammarEntry));
                            await refreshMeta();
                            setMessage(t.restored);
                          }}>
                            <Undo2 className="mr-1 h-3.5 w-3.5" />{t.restore}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* private items list */}
            {privateEntries.length > 0 && (
              <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
                <CardContent className="p-5">
                  <h2 className="font-serif text-xl text-[#242424]">{t.managePrivate}</h2>
                  <p className="mt-1 text-sm text-[#797776]">{t.managePrivateDesc}</p>
                  <div className="mt-4 space-y-2">
                    {privateEntries.map((entry) => (
                      <div key={entry.id} className="rounded-[12px] border border-[#ded8d0] bg-[#fbfaf8] p-3">
                        <div className="mb-1 flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-[#242424]">{entry.title}</span>
                          <LevelBadge level={entry.jlptLevel} />
                          <GrammarTypeBadge category={entry.grammarType} />
                          <Badge className="rounded-full font-mono text-[10px] bg-[#cfdaf5] text-[#242424]">{t.privateBadge}</Badge>
                        </div>
                        <p className="line-clamp-1 text-xs text-[#797776]">{entry.structure}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-[#4e4d4d]">{entry.meaningZh}</p>
                        <div className="mt-3 flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="rounded-full font-mono" onClick={() => handleStartEdit(entry)}>
                            <PencilLine className="mr-1 h-3.5 w-3.5" />{t.edit}
                          </Button>
                          <Button variant="outline" size="sm" className="rounded-full font-mono text-[#c47a6a]" onClick={() => handleDeletePrivate(entry)}>
                            <Trash2 className="mr-1 h-3.5 w-3.5" />{t.delete}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* right: default + hidden */}
          <div className="space-y-5">
            {/* default deck management */}
            <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
              <CardContent className="p-5">
                <div className="mb-4 flex items-start gap-3">
                  <Layers3 className="mt-1 h-5 w-5 text-[#797776]" />
                  <div>
                    <h2 className="font-serif text-2xl text-[#242424]">{t.manageDefault}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-[#797776]">{t.manageDefaultDesc}</p>
                  </div>
                </div>

                {/* search + batch toggle */}
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex flex-1 items-center gap-2 rounded-full border border-[#ded8d0] px-3">
                    <Search className="h-4 w-4 text-[#797776]" />
                    <Input className="border-0 px-0 shadow-none focus-visible:ring-0" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} />
                  </div>
                  <Button variant={batchMode ? "default" : "outline"} size="sm" className="rounded-full font-mono text-xs" onClick={() => { setBatchMode(!batchMode); clearSelection(); }}>
                    <CheckSquare className="mr-1 h-3.5 w-3.5" />{batchMode ? t.deselectAll : t.batchActions}
                  </Button>
                </div>

                {/* batch action bar */}
                {batchMode && selectedIds.size > 0 && (
                  <div className="mb-3 flex items-center gap-2 rounded-full bg-[#242424] px-3 py-1.5 text-xs text-[#f6f3f1]">
                    <span className="font-mono">{t.batchSelected} {selectedIds.size}</span>
                    <div className="flex-1" />
                    <Button size="sm" className="h-7 rounded-full font-mono text-[10px] bg-[#f6f3f1] text-[#242424] hover:bg-white" onClick={selectAllDefaults}>{t.selectAll}</Button>
                    <Button size="sm" className="h-7 rounded-full font-mono text-[10px] bg-[#f4b4a8] text-[#7a3a30] hover:bg-[#f0a098]" onClick={batchHide}>{t.batchHide}</Button>
                    <button onClick={clearSelection}><X className="h-3.5 w-3.5" /></button>
                  </div>
                )}

                <div className="space-y-2">
                  {filteredDefaults.map((entry) => (
                    <div key={entry.id} className="rounded-[12px] border border-[#ded8d0] bg-[#fbfaf8] p-3">
                      <div className="flex items-start gap-2">
                        {batchMode && (
                          <button onClick={() => toggleSelect(entry.id)} className="mt-1 shrink-0">
                            {selectedIds.has(entry.id) ? <CheckSquare className="h-4 w-4 text-[#242424]" /> : <Square className="h-4 w-4 text-[#797776]" />}
                          </button>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-[#242424]">{entry.title}</span>
                            <LevelBadge level={entry.jlptLevel} />
                            <GrammarTypeBadge category={entry.grammarType} />
                          </div>
                          <p className="line-clamp-1 text-xs text-[#797776]">{entry.structure}</p>
                          <p className="mt-1 line-clamp-2 text-sm text-[#4e4d4d]">{entry.meaningZh}</p>
                        </div>
                        {!batchMode && (
                          <Button variant="outline" size="sm" className="shrink-0 rounded-full font-mono" disabled={!canEdit} onClick={() => handleHide(entry)}>
                            <EyeOff className="mr-1 h-3.5 w-3.5" />{t.hideFromMine}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredDefaults.length === 0 && (
                    <p className="py-8 text-center text-sm text-[#797776]">{t.noMatches}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* schema check */}
            <Card className="rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
              <CardContent className="p-5">
                <h2 className="mb-3 font-serif text-xl text-[#242424]">{t.schemaCheck}</h2>
                <div className="space-y-2 text-xs">
                  {status && Object.entries(status.checks).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between gap-3 rounded-full border border-[#ded8d0] px-3 py-2">
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

      {/* edit dialog */}
      <Dialog open={!!editingId} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto rounded-[18px] border border-[#ded8d0] bg-[#fbfaf8] shadow-none">
          <DialogTitle className="font-serif text-xl">{t.editTitle}</DialogTitle>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Field label={t.form.title}><Input value={editForm.title || ""} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} /></Field>
            <Field label={t.form.jlptLevel}>
              <select className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={editForm.jlptLevel || ""} onChange={(e) => setEditForm((f) => ({ ...f, jlptLevel: e.target.value }))}>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label={t.form.grammarType}>
              <select className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" value={editForm.grammarType || ""} onChange={(e) => setEditForm((f) => ({ ...f, grammarType: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label={t.form.structure}><Input value={editForm.structure || ""} onChange={(e) => setEditForm((f) => ({ ...f, structure: e.target.value }))} /></Field>
            <Field label={t.form.meaningZh}><Input value={editForm.meaningZh || ""} onChange={(e) => setEditForm((f) => ({ ...f, meaningZh: e.target.value }))} /></Field>
            <Field label={t.form.meaningEn}><Input value={editForm.meaningEn || ""} onChange={(e) => setEditForm((f) => ({ ...f, meaningEn: e.target.value }))} /></Field>
            <Field label={t.form.exampleJp}><Input value={editForm.exampleJp || ""} onChange={(e) => setEditForm((f) => ({ ...f, exampleJp: e.target.value }))} /></Field>
            <Field label={t.form.exampleZh}><Input value={editForm.exampleZh || ""} onChange={(e) => setEditForm((f) => ({ ...f, exampleZh: e.target.value }))} /></Field>
            <Field label={t.form.exampleEn}><Input value={editForm.exampleEn || ""} onChange={(e) => setEditForm((f) => ({ ...f, exampleEn: e.target.value }))} /></Field>
            <div className="sm:col-span-2"><Field label={t.form.explanationZh}><Textarea value={editForm.explanationZh || ""} onChange={(e) => setEditForm((f) => ({ ...f, explanationZh: e.target.value }))} /></Field></div>
            <div className="sm:col-span-2"><Field label={t.form.explanationEn}><Textarea value={editForm.explanationEn || ""} onChange={(e) => setEditForm((f) => ({ ...f, explanationEn: e.target.value }))} /></Field></div>
          </div>
          <div className="mt-5 flex gap-3">
            <Button className="rounded-full font-mono" onClick={handleSaveEdit}>{t.save}</Button>
            <Button variant="outline" className="rounded-full font-mono" onClick={() => setEditingId(null)}>{t.cancel}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
