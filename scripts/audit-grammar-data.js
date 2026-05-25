const grammar = require("../src/data/grammar.json");
const redirects = require("../src/data/grammar-dedupe-redirects.json");

const levelBands = {
  N5: [100, 160],
  N4: [130, 190],
  N3: [90, 130],
  N2: [120, 150],
  N1: [120, 150],
};

const placeholderPatterns = [
  /準備中/,
  /准备中/,
  /補充中/,
  /补充中/,
  /暂未/,
  /例文を準備/,
  /例句准备/,
  /例文准备/,
  /Not added/i,
  /still being filled/i,
  /Coming soon/i,
  /This sentence demonstrates/i,
  /Expresses \.{2,}/i,
  /表示表示/,
  /するました/,
  /読み直すました/,
];

const requiredFields = [
  "id",
  "title",
  "slug",
  "jlptLevel",
  "grammarType",
  "meaningZh",
  "meaningEn",
  "structure",
  "explanationZh",
  "explanationEn",
  "usageNoteZh",
  "usageNoteEn",
  "exampleJp",
  "exampleZh",
  "exampleEn",
  "commonMistakeZh",
  "commonMistakeEn",
  "memoryTipZh",
  "memoryTipEn",
];

function normalize(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\s\u3000]+/g, "")
    .replace(/[＋]/g, "+")
    .replace(/[，,。．.；;：:、]/g, "")
    .replace(/[「」『』“”"'`]/g, "")
    .trim();
}

function duplicateKey(item) {
  return [
    normalize(item.title),
    normalize(item.grammarType),
    normalize(item.structure),
    normalize(item.meaningZh || item.meaningCn),
    normalize(item.commonMistakeZh || item.commonMistake),
    item.jlptLevel,
  ].join("::");
}

const failures = [];
const warnings = [];
const ids = new Set(grammar.map((item) => String(item.id)));

for (const item of grammar) {
  for (const field of requiredFields) {
    const value = String(item[field] ?? "").trim();
    if (!value) failures.push(`${item.id} ${item.title}: missing ${field}`);
    if (placeholderPatterns.some((pattern) => pattern.test(value))) {
      failures.push(`${item.id} ${item.title}: placeholder/template text in ${field}`);
    }
  }
}

const examples = new Map();
for (const item of grammar) {
  const key = normalize(item.exampleJp);
  examples.set(key, [...(examples.get(key) ?? []), item]);
}
for (const group of examples.values()) {
  if (group.length > 1) {
    failures.push(`duplicate example: ${group.map((item) => `${item.id}/${item.title}`).join(", ")}`);
  }
}

const exactSameLevel = new Map();
for (const item of grammar) {
  const key = duplicateKey(item);
  exactSameLevel.set(key, [...(exactSameLevel.get(key) ?? []), item]);
}
for (const group of exactSameLevel.values()) {
  if (group.length > 1) {
    failures.push(`same-level duplicate: ${group.map((item) => `${item.id}/${item.jlptLevel}/${item.title}`).join(", ")}`);
  }
}

const sameLevelTitleStructure = new Map();
const sameLevelTitleMeaning = new Map();
for (const item of grammar) {
  const titleStructureKey = [
    item.jlptLevel,
    normalize(item.title),
    normalize(item.structure),
  ].join("::");
  const titleMeaningKey = [
    item.jlptLevel,
    normalize(item.title),
    normalize(item.meaningZh || item.meaningCn),
  ].join("::");
  sameLevelTitleStructure.set(titleStructureKey, [...(sameLevelTitleStructure.get(titleStructureKey) ?? []), item]);
  sameLevelTitleMeaning.set(titleMeaningKey, [...(sameLevelTitleMeaning.get(titleMeaningKey) ?? []), item]);
}
for (const group of [...sameLevelTitleStructure.values(), ...sameLevelTitleMeaning.values()]) {
  if (group.length > 1) {
    failures.push(`same-level semantic duplicate: ${group.map((item) => `${item.id}/${item.jlptLevel}/${item.title}`).join(", ")}`);
  }
}

const byLevel = grammar.reduce((acc, item) => {
  acc[item.jlptLevel] = (acc[item.jlptLevel] ?? 0) + 1;
  return acc;
}, {});

for (const [level, [min, max]] of Object.entries(levelBands)) {
  const count = byLevel[level] ?? 0;
  if (count < min || count > max) {
    failures.push(`${level} count ${count} outside expected band ${min}-${max}`);
  }
}

for (const [from, to] of Object.entries(redirects)) {
  if (ids.has(String(from))) failures.push(`redirect source ${from} still exists in grammar data`);
  if (!ids.has(String(to))) failures.push(`redirect target ${to} is missing`);
  if (from === to) failures.push(`redirect ${from} points to itself`);
}

const crossLevelGroups = new Map();
for (const item of grammar) {
  const key = [
    normalize(item.title),
    normalize(item.grammarType),
    normalize(item.structure),
    normalize(item.meaningZh || item.meaningCn),
    normalize(item.commonMistakeZh || item.commonMistake),
  ].join("::");
  crossLevelGroups.set(key, [...(crossLevelGroups.get(key) ?? []), item]);
}

for (const group of crossLevelGroups.values()) {
  if (group.length > 1) {
    warnings.push(`cross-level duplicate candidate: ${group.map((item) => `${item.id}/${item.jlptLevel}/${item.title}`).join(", ")}`);
  }
}

console.log(JSON.stringify({
  total: grammar.length,
  byLevel,
  redirects: Object.keys(redirects).length,
  warnings: warnings.length,
  warningSamples: warnings.slice(0, 20),
  failures: failures.length,
  failureSamples: failures.slice(0, 30),
}, null, 2));

if (failures.length > 0) process.exit(1);
