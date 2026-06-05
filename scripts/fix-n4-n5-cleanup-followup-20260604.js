const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const redirectsPath = path.join(__dirname, "../src/data/grammar-dedupe-redirects.json");

const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));

redirects["234"] = "156";
for (const [from, to] of Object.entries(redirects)) {
  if (to === "234") redirects[from] = "156";
}

const deleted = new Set(["234"]);
const additions = [
  {
    id: "1548",
    title: "が/も～なら、～も～だ",
    slug: "が-も-なら-も-だ-1548",
    jlptLevel: "N1",
    grammarType: "並列評価",
    tags: ["也", "同样", "评价"],
    meaningZh: "……如此，……也如此；……也真是……",
    meaningEn: "if A is like that, B is also like that; both are similarly...",
    structure: "名词 + が / も + 名词 + なら、名词 + も + 名词 + だ",
    explanationZh: "表示上位者、相关对象或一方如此，另一方也同样如此，常用于负面评价或感叹。",
    explanationEn: "Shows that if one side, related party, or superior is a certain way, the other side is also the same; often used for negative evaluation or exclamation.",
    usageNoteZh: "常见于「親が親なら、子も子だ」这类说法，强调双方都有相同问题或同样特征。",
    usageNoteEn: "Common in expressions like 親が親なら、子も子だ, emphasizing that both sides share the same problem or trait.",
    exampleJp: "上司が上司なら、部下も部下で、誰も期限を守ろうとしない。",
    exampleZh: "上司不像样，部下也不像样，谁都不想遵守期限。",
    exampleEn: "If the boss is like that, the subordinates are no better; no one tries to meet the deadline.",
    commonMistakeZh: "不要当作普通条件「なら」；这里重点是前后双方“同样如此”的评价。",
    commonMistakeEn: "Do not treat it as ordinary conditional なら; the focus is evaluating both sides as similarly so.",
    memoryTipZh: "前面这样，后面也这样，双方一起被评价。",
    memoryTipEn: "The first side is like this, the second side is also like this; both are evaluated together.",
    sourceRoute: "综合",
    furigana: "",
    similarGrammar: [],
    quizQuestion: "",
    quizChoices: [],
    quizAnswer: "",
    quizExplanation: "",
  },
  {
    id: "1549",
    title: "に",
    slug: "に-1549",
    jlptLevel: "N1",
    grammarType: "追加",
    tags: ["加上", "再加上", "并列"],
    meaningZh: "……加上……；……和……的组合",
    meaningEn: "and; in addition to; the combination of",
    structure: "名词 + に + 名词",
    explanationZh: "用「に」连接两个名词，表示组合、搭配或追加，常用于列举构成要素。",
    explanationEn: "Uses に to connect two nouns, showing a combination, pairing, or addition, often when listing components.",
    usageNoteZh: "常见于「ご飯に味噌汁」「努力に経験」这类组合表达，比 N5 的时间/对象助词更偏高级并列用法。",
    usageNoteEn: "Common in combinations like ご飯に味噌汁 or 努力に経験; unlike the basic time/target particle, this is an advanced additive pairing use.",
    exampleJp: "この仕事には、日本語力に加えて、調整力に判断力も求められる。",
    exampleZh: "这份工作除了日语能力，还需要协调能力和判断能力。",
    exampleEn: "This job requires not only Japanese ability, but also coordination skills and judgment.",
    commonMistakeZh: "不要和表示时间点、对象、存在地点的基础「に」混淆；这里连接名词表示追加组合。",
    commonMistakeEn: "Do not confuse it with basic に marking time, target, or existence location; here it connects nouns as additions or combinations.",
    memoryTipZh: "把两个名词用「に」串起来，像把配料加在一起。",
    memoryTipEn: "String two nouns together with に, like adding ingredients together.",
    sourceRoute: "综合",
    furigana: "",
    similarGrammar: [],
    quizQuestion: "",
    quizChoices: [],
    quizAnswer: "",
    quizExplanation: "",
  },
];

const additionIds = new Set(additions.map((item) => item.id));
const nextGrammar = grammar
  .filter((item) => !deleted.has(String(item.id)) && !additionIds.has(String(item.id)))
  .map((item) => {
    if (String(item.id) !== "156") return item;
    return {
      ...item,
      title: "て（原因・连接）",
      slug: "て-原因-连接-156",
      grammarType: "原因・並列",
      meaningZh: "因为……；并且……",
      meaningEn: "because; and then",
      structure: "动词 / 形容词て形",
      explanationZh: "て形可连接动作，也可把前项作为轻原因，后项说明自然出现的结果。",
      explanationEn: "The て-form can connect actions, and can also present the first clause as a light cause for the natural result that follows.",
      usageNoteZh: "用于轻原因时后项多是自然结果；若要明确强调理由，可用「から」「ので」。",
      usageNoteEn: "When used as a light cause, the following clause is often a natural result; use から or ので to emphasize the reason clearly.",
      commonMistakeZh: "不要把所有て形都理解为原因；也可能只是动作连接。",
      commonMistakeEn: "Do not interpret every て-form as a reason; it may simply connect actions.",
      meaningCn: "因为……；并且……",
      explanation: "て形可连接动作，也可把前项作为轻原因，后项说明自然出现的结果。",
      usageNote: "用于轻原因时后项多是自然结果；若要明确强调理由，可用「から」「ので」。",
      commonMistake: "不要把所有て形都理解为原因；也可能只是动作连接。",
    };
  })
  .concat(additions.map((item) => ({
    ...item,
    meaningCn: item.meaningZh,
    explanation: item.explanationZh,
    usageNote: item.usageNoteZh,
    exampleCn: item.exampleZh,
    commonMistake: item.commonMistakeZh,
    memoryTip: item.memoryTipZh,
  })))
  .sort((a, b) => Number(a.id) - Number(b.id));

fs.writeFileSync(grammarPath, JSON.stringify(nextGrammar, null, 2) + "\n");
fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2) + "\n");
