const grammar = require("../src/data/grammar.json");
const reference = require("../src/data/reference/jlpt-sensei-grammar-inventory.json");

const strictTemplatePatterns = [
  /表示原因或理由/,
  /表示让步或转折/,
  /表示目的或意图/,
  /表示情感或可能性/,
  /表示判断或说明/,
  /表示方向或授受/,
  /用于补充句子的语气、关系或常用表达/,
  /使用时要确认前接词形/,
  /自然に話しました/,
  /について自然に話しました/,
  /別の.+も.+しました/,
];

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[〜～~]/g, "")
    .replace(/[・/／、,，()（）【】\[\]「」『』\s\u3000]/g, "")
    .replace(/する$/g, "")
    .trim();
}

function duplicateMeaningKey(item) {
  return [
    normalize(item.title),
    normalize(item.grammarType),
    normalize(item.structure),
    normalize(item.meaningZh || item.meaningCn),
    normalize(item.commonMistakeZh || item.commonMistake),
  ].join("::");
}

function buildMap(items, keyFn) {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

function referenceCandidates(item) {
  const rawValues = [item.title, item.japanese, item.english].filter(Boolean);
  const candidates = new Set(rawValues);

  for (const value of rawValues) {
    const readings = [...String(value).matchAll(/（([^）]+)）|\(([^)]+)\)/g)]
      .map((match) => match[1] || match[2])
      .flatMap((reading) => reading.split(/\s*[・/／,，、]\s*/))
      .map((reading) => reading.trim())
      .filter(Boolean);

    for (const reading of readings) candidates.add(reading);

    const withoutReading = String(value)
      .replace(/（[^）]*）/g, "")
      .replace(/\([^)]*\)/g, "");
    candidates.add(withoutReading);

    for (const part of withoutReading.split(/\s*\/\s*/)) {
      if (part.trim()) candidates.add(part.trim());
    }

    for (const part of withoutReading.split(/\s*[・,，、]\s*/)) {
      if (part.trim()) candidates.add(part.trim());
    }
  }

  return [...candidates];
}

const strictFailures = [];

for (const item of grammar) {
  const fields = [
    "meaningZh",
    "meaningEn",
    "explanationZh",
    "explanationEn",
    "usageNoteZh",
    "usageNoteEn",
    "exampleJp",
    "exampleZh",
    "exampleEn",
    "commonMistakeZh",
    "commonMistakeEn",
  ];

  for (const field of fields) {
    const value = String(item[field] ?? "");
    if (strictTemplatePatterns.some((pattern) => pattern.test(value))) {
      strictFailures.push(`${item.id}/${item.jlptLevel}/${item.title}: template-like ${field}`);
    }
  }
}

const crossLevelGroups = buildMap(grammar, duplicateMeaningKey);
for (const group of crossLevelGroups.values()) {
  const levels = new Set(group.map((item) => item.jlptLevel));
  if (group.length > 1 && levels.size > 1) {
    strictFailures.push(
      `cross-level exact duplicate: ${group
        .map((item) => `${item.id}/${item.jlptLevel}/${item.title}`)
        .join(", ")}`
    );
  }
}

const sameLevelTitleGroups = buildMap(
  grammar.filter((item) => ["N1", "N2", "N3"].includes(item.jlptLevel)),
  (item) => `${item.jlptLevel}::${normalize(item.title)}`
);
for (const group of sameLevelTitleGroups.values()) {
  if (group.length > 1) {
    strictFailures.push(
      `same-level title duplicate: ${group
        .map((item) => `${item.id}/${item.jlptLevel}/${item.title}/${item.grammarType}`)
        .join(", ")}`
    );
  }
}

const currentTitleKeys = new Set(grammar.map((item) => normalize(item.title)));
const referenceTargets = reference.entries.filter((item) => ["N1", "N2", "N3"].includes(item.level));
const missingReference = referenceTargets.filter((item) => {
  return !referenceCandidates(item).some((candidate) => currentTitleKeys.has(normalize(candidate)));
});

const missingByLevel = missingReference.reduce((acc, item) => {
  acc[item.level] = (acc[item.level] ?? 0) + 1;
  return acc;
}, {});

const byLevel = grammar.reduce((acc, item) => {
  acc[item.jlptLevel] = (acc[item.jlptLevel] ?? 0) + 1;
  return acc;
}, {});

console.log(
  JSON.stringify(
    {
      total: grammar.length,
      byLevel,
      reference: {
        source: reference.source,
        sourceUrl: reference.sourceUrl,
        coveragePolicy:
          "advisory only: the external inventory is broader than the product's curated JLPT deck size, so unmatched titles are used for batch planning rather than pass/fail.",
        n1n2n3Targets: referenceTargets.length,
        unmatched: missingReference.length,
        missingByLevel,
        missingSamples: missingReference.slice(0, 30).map((item) => ({
          level: item.level,
          title: item.title,
          japanese: item.japanese,
          english: item.english,
        })),
      },
      strictWarnings: 0,
      strictWarningSamples: [],
      strictFailures: strictFailures.length,
      strictFailureSamples: strictFailures.slice(0, 80),
    },
    null,
    2
  )
);

if (strictFailures.length > 0) process.exit(1);
