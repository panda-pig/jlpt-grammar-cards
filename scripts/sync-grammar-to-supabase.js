#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const grammar = require("../src/data/grammar.json");

const APPLY = process.argv.includes("--apply");
const REPLACE_SYSTEM = process.argv.includes("--replace-system");
const CONFIRM_REPLACE = process.argv.includes("--confirm-replace-system");
const VALID_ROUTES = new Set(["蓝宝书", "TRY", "一册合格", "综合"]);

function route(value) {
  return VALID_ROUTES.has(value) ? value : "综合";
}

function nowIso() {
  return new Date().toISOString();
}

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      })
  );
}

function mapGrammar(item, syncedAt) {
  return {
    source_key: String(item.id),
    title: item.title,
    slug: item.slug,
    jlpt_level: item.jlptLevel,
    source_route: route(item.sourceRoute),
    grammar_type: item.grammarType,
    tags: item.tags ?? [],
    meaning_cn: item.meaningCn ?? item.meaningZh ?? "",
    meaning_zh: item.meaningZh ?? item.meaningCn ?? "",
    meaning_en: item.meaningEn ?? "",
    structure: item.structure ?? "",
    explanation: item.explanation ?? item.explanationZh ?? "",
    explanation_zh: item.explanationZh ?? item.explanation ?? "",
    explanation_en: item.explanationEn ?? "",
    usage_note: item.usageNote ?? item.usageNoteZh ?? "",
    usage_note_zh: item.usageNoteZh ?? item.usageNote ?? "",
    usage_note_en: item.usageNoteEn ?? "",
    example_jp: item.exampleJp ?? "",
    example_cn: item.exampleCn ?? item.exampleZh ?? "",
    example_zh: item.exampleZh ?? item.exampleCn ?? "",
    example_en: item.exampleEn ?? "",
    furigana: item.furigana ?? "",
    similar_grammar: item.similarGrammar ?? [],
    common_mistake: item.commonMistake ?? item.commonMistakeZh ?? "",
    common_mistake_zh: item.commonMistakeZh ?? item.commonMistake ?? "",
    common_mistake_en: item.commonMistakeEn ?? "",
    memory_tip: item.memoryTip ?? item.memoryTipZh ?? "",
    memory_tip_zh: item.memoryTipZh ?? item.memoryTip ?? "",
    memory_tip_en: item.memoryTipEn ?? "",
    quiz_question: item.quizQuestion ?? "",
    quiz_choices: item.quizChoices ?? [],
    quiz_answer: item.quizAnswer ?? "",
    quiz_explanation: item.quizExplanation ?? "",
    is_system: true,
    content_version: 1,
    updated_at: syncedAt,
  };
}

function validateRows(rows) {
  const seenSourceKeys = new Set();
  const seenSlugs = new Set();
  const errors = [];

  for (const row of rows) {
    if (seenSourceKeys.has(row.source_key)) errors.push(`Duplicate source_key: ${row.source_key}`);
    if (seenSlugs.has(row.slug)) errors.push(`Duplicate slug: ${row.slug}`);
    seenSourceKeys.add(row.source_key);
    seenSlugs.add(row.slug);

    for (const required of ["title", "slug", "jlpt_level", "grammar_type", "meaning_cn", "meaning_zh", "meaning_en"]) {
      if (!row[required]) errors.push(`${row.source_key} missing ${required}`);
    }
  }

  return errors;
}

async function assertRemoteGrammarColumns(supabase, rows) {
  const columns = Object.keys(rows[0] ?? {}).join(",");
  const { error } = await supabase
    .from("grammar")
    .select(columns)
    .limit(1);
  if (!error) return;

  console.error("Remote grammar table is missing one or more columns required by the local grammar data.");
  console.error("Apply supabase/migrations/005_complete_grammar_i18n_columns.sql, then rerun this command.");
  throw error;
}

async function main() {
  const env = {
    ...readEnvFile(path.join(process.cwd(), ".env.local")),
    ...process.env,
  };
  const syncedAt = nowIso();
  const rows = grammar.map((item) => mapGrammar(item, syncedAt));
  const errors = validateRows(rows);

  console.log(`Prepared ${rows.length} grammar rows for Supabase.`);
  console.log(APPLY ? "Mode: apply" : "Mode: dry-run");
  if (REPLACE_SYSTEM) {
    console.log("Replace mode: remote grammar system deck will be cleared and rebuilt from local data.");
  }

  if (errors.length > 0) {
    console.error(`Validation failed with ${errors.length} error(s):`);
    for (const error of errors.slice(0, 30)) console.error(`- ${error}`);
    if (errors.length > 30) console.error(`... ${errors.length - 30} more`);
    process.exit(1);
  }

  if (!APPLY) {
    console.log("Dry-run passed. Re-run with --apply to write to Supabase.");
    if (REPLACE_SYSTEM) {
      console.log("To replace the remote default deck, use --apply --replace-system --confirm-replace-system.");
    }
    return;
  }

  if (REPLACE_SYSTEM && !CONFIRM_REPLACE) {
    console.error("Refusing to replace remote grammar without --confirm-replace-system.");
    process.exit(1);
  }

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: existingRows, error: fetchError } = await supabase
    .from("grammar")
    .select("id, slug, source_key");
  if (fetchError) {
    console.error("Could not read grammar.source_key. Apply supabase/migrations/004_user_grammar_library.sql first.");
    throw fetchError;
  }

  await assertRemoteGrammarColumns(supabase, rows);

  if (REPLACE_SYSTEM) {
    console.log(`Remote grammar rows before replace: ${existingRows?.length ?? 0}`);

    const { error: progressDetachError } = await supabase
      .from("user_grammar_progress")
      .update({ grammar_id: null })
      .not("grammar_id", "is", null);
    if (progressDetachError) throw progressDetachError;

    const { error: historyDetachError } = await supabase
      .from("review_history")
      .update({ grammar_id: null })
      .not("grammar_id", "is", null);
    if (historyDetachError) throw historyDetachError;

    const { error: deleteError } = await supabase
      .from("grammar")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (deleteError) throw deleteError;

    let inserted = 0;
    for (const row of rows) {
      const { error } = await supabase.from("grammar").insert(row);
      if (error) throw error;
      inserted += 1;
    }

    console.log(`Replace complete. Deleted ${existingRows?.length ?? 0}, inserted ${inserted}.`);
    const { count, error: countError } = await supabase
      .from("grammar")
      .select("*", { count: "exact", head: true });
    if (countError) throw countError;
    if (count !== rows.length) {
      throw new Error(`Post-replace count mismatch. Expected ${rows.length}, got ${count}.`);
    }
    console.log(`Verified remote grammar count: ${count}.`);
    return;
  }

  const existingBySourceKey = new Map((existingRows ?? []).map((row) => [row.source_key, row]));
  const existingBySlug = new Map((existingRows ?? []).map((row) => [row.slug, row]));
  let inserted = 0;
  let updated = 0;

  for (const row of rows) {
    const existing = existingBySourceKey.get(row.source_key) ?? existingBySlug.get(row.slug);
    if (existing) {
      const { error } = await supabase.from("grammar").update(row).eq("id", existing.id);
      if (error) throw error;
      updated += 1;
    } else {
      const { error } = await supabase.from("grammar").insert(row);
      if (error) throw error;
      inserted += 1;
    }
  }

  const { count, error: countError } = await supabase
    .from("grammar")
    .select("*", { count: "exact", head: true });
  if (countError) throw countError;
  console.log(`Sync complete. Inserted ${inserted}, updated ${updated}. Remote grammar count: ${count}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
