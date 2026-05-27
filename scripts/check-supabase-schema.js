#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

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

async function main() {
  const env = {
    ...readEnvFile(path.join(process.cwd(), ".env.local")),
    ...process.env,
  };

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    process.exit(1);
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false },
  });

  const checks = [];
  const { data: basicData, error: basicError, count } = await supabase
    .from("grammar")
    .select("id,slug", { count: "exact" })
    .limit(1);
  checks.push({
    name: "grammar basic read",
    ok: !basicError,
    count,
    error: basicError?.message ?? null,
    sampleKeys: basicData?.[0] ? Object.keys(basicData[0]) : [],
  });

  const { data: keyData, error: keyError } = await supabase
    .from("grammar")
    .select("id,source_key,content_version,is_system")
    .limit(1);
  checks.push({
    name: "grammar stable key columns",
    ok: !keyError,
    error: keyError?.message ?? null,
    sampleKeys: keyData?.[0] ? Object.keys(keyData[0]) : [],
  });

  for (const table of [
    "user_grammar_overrides",
    "user_grammar_items",
    "payments",
    "payment_events",
    "user_entitlements",
  ]) {
    const { data, error } = await supabase.from(table).select("id").limit(1);
    checks.push({
      name: table,
      ok: !error,
      error: error?.message ?? null,
      sampleKeys: data?.[0] ? Object.keys(data[0]) : [],
    });
  }

  console.log(JSON.stringify({ checks }, null, 2));

  if (checks.some((check) => !check.ok)) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
