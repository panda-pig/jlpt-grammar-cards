const { createClient } = require("@supabase/supabase-js");
const grammarData = require("../src/data/grammar.json");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log(`Seeding ${grammarData.length} grammar entries...`);

  const batchSize = 100;
  for (let i = 0; i < grammarData.length; i += batchSize) {
    const batch = grammarData.slice(i, i + batchSize).map((g) => ({
      title: g.title,
      slug: g.slug,
      jlpt_level: g.jlptLevel,
      source_route: g.sourceRoute,
      grammar_type: g.grammarType,
      tags: g.tags || [],
      meaning_cn: g.meaningCn,
      meaning_en: g.meaningEn || "",
      structure: g.structure || "",
      explanation: g.explanation || "",
      usage_note: g.usageNote || "",
      example_jp: g.exampleJp || "",
      example_cn: g.exampleCn || "",
      furigana: g.furigana || null,
      similar_grammar: g.similarGrammar || [],
      common_mistake: g.commonMistake || "",
      memory_tip: g.memoryTip || "",
      quiz_question: g.quizQuestion || "",
      quiz_choices: g.quizChoices || [],
      quiz_answer: g.quizAnswer || "",
      quiz_explanation: g.quizExplanation || "",
    }));

    const { error } = await supabase.from("grammar").insert(batch);
    if (error) {
      console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
      process.exit(1);
    }
    console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(grammarData.length / batchSize)}`);
  }

  console.log("Done!");
}

seed().catch(console.error);
