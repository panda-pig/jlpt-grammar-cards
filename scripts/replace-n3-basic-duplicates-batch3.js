const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const redirectsPath = path.join(__dirname, "../src/data/grammar-dedupe-redirects.json");

const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));

const deleteRedirects = {
  378: "32",
  419: "154",
  420: "155",
  431: "162",
  432: "163",
  438: "169",
};

const newEntries = [
  {
    id: "1235",
    title: "ながらも",
    slug: "ながらも-1235",
    jlptLevel: "N3",
    grammarType: "逆接・譲歩",
    tags: ["让步", "转折"],
    meaningZh: "虽然……但是……",
    meaningEn: "although; despite",
    structure: "动词ます形去ます / い形容词 / な形容词词干 / 名词 + ながらも",
    explanationZh:
      "表示承认前项事实，同时后项出现与前项预期不同的结果。语气比「けれど」更书面。",
    explanationEn:
      "Acknowledges the first fact while the second clause gives a result that differs from expectation. It sounds more written than けれど.",
    usageNoteZh: "常用于评价人物、状态或情况，如“虽小但功能强”。",
    usageNoteEn: "Often used to evaluate people, states, or situations, such as 'small but powerful.'",
    exampleJp: "この店は小さいながらも、いつも多くの客でにぎわっている。",
    exampleZh: "这家店虽小，却总是有很多客人，非常热闹。",
    exampleEn: "Although this shop is small, it is always bustling with many customers.",
    commonMistakeZh: "接名词和な形容词时常直接接词干，不要加「だ」。",
    commonMistakeEn: "With nouns and na-adjectives, attach it to the stem; do not add だ.",
    memoryTipZh: "「ながらも」就是“带着前项状态，后面却转了方向”。",
    memoryTipEn: "ながらも carries the first state while the sentence turns in another direction.",
  },
  {
    id: "1236",
    title: "ないことはない",
    slug: "ないことはない-1236",
    jlptLevel: "N3",
    grammarType: "否定",
    tags: ["双重否定", "可能性"],
    meaningZh: "不是不……；并非完全不……",
    meaningEn: "not that...not; it is possible, though",
    structure: "动词ない形 + ことはない / い形容词否定 + ことはない",
    explanationZh:
      "用双重否定表示弱肯定，承认某事有可能或并非完全没有，但语气保留。",
    explanationEn:
      "Uses a double negative to make a weak affirmation, admitting something is possible or not entirely absent while sounding reserved.",
    usageNoteZh: "常带有“可以是可以，但……”的语感。",
    usageNoteEn: "Often carries the nuance of 'it is possible, but...'",
    exampleJp: "読めないことはないが、専門用語が多くて時間がかかる。",
    exampleZh: "不是不能读，但专业术语很多，会花时间。",
    exampleEn: "It is not that I cannot read it, but there are many technical terms and it takes time.",
    commonMistakeZh: "不要理解成强烈肯定；这个表达通常带保留或勉强。",
    commonMistakeEn: "Do not read it as a strong affirmation; it is usually reserved or reluctant.",
    memoryTipZh: "两个否定抵消后，只剩一个弱弱的“可以”。",
    memoryTipEn: "Two negatives cancel each other, leaving a weak 'possible.'",
  },
  {
    id: "1237",
    title: "なかなか",
    slug: "なかなか-1237",
    jlptLevel: "N3",
    grammarType: "程度",
    tags: ["程度", "否定"],
    meaningZh: "相当……；怎么也不……",
    meaningEn: "quite; not easily",
    structure: "なかなか + 肯定 / なかなか + 否定",
    explanationZh:
      "接肯定时表示程度超出预期、相当不错；接否定时表示事情不容易实现或迟迟不发生。",
    explanationEn:
      "With an affirmative, it means quite or better than expected; with a negative, it means something does not happen easily or is slow to happen.",
    usageNoteZh: "两种用法意思差别大，要看后面是肯定还是否定。",
    usageNoteEn: "The two uses differ greatly, so check whether the following expression is affirmative or negative.",
    exampleJp: "この問題はなかなか解けなくて、三十分も考えました。",
    exampleZh: "这道题怎么也解不出来，我想了三十分钟。",
    exampleEn: "I could not solve this problem easily and thought about it for thirty minutes.",
    commonMistakeZh: "接肯定时不是“很难”，而是“相当、挺”。",
    commonMistakeEn: "With an affirmative, it does not mean difficult; it means quite or rather.",
    memoryTipZh: "看后面：肯定是“挺”，否定是“怎么也不”。",
    memoryTipEn: "Look after it: affirmative means 'quite'; negative means 'not easily.'",
  },
  {
    id: "1238",
    title: "直す",
    slug: "直す-1238",
    jlptLevel: "N3",
    grammarType: "変化",
    tags: ["重新", "补助动词"],
    meaningZh: "重新……；再……一次",
    meaningEn: "do again; redo",
    structure: "动词ます形去ます + 直す",
    explanationZh:
      "作为补助动词，表示重新做某个动作，使结果变好或重新调整。",
    explanationEn:
      "As an auxiliary verb, 直す means to do an action again in order to improve or adjust the result.",
    usageNoteZh: "常见搭配有「書き直す」「読み直す」「考え直す」「作り直す」。",
    usageNoteEn: "Common combinations include 書き直す, 読み直す, 考え直す, and 作り直す.",
    exampleJp: "間違いが多かったので、作文を書き直しました。",
    exampleZh: "因为错误很多，我重新写了作文。",
    exampleEn: "There were many mistakes, so I rewrote the composition.",
    commonMistakeZh: "不是所有动作都能自然接「直す」；通常是可修正、可重做的动作。",
    commonMistakeEn: "Not every action naturally takes 直す; it is usually for actions that can be corrected or redone.",
    memoryTipZh: "「直す」就是把动作做第二遍，让它变好。",
    memoryTipEn: "直す means doing the action a second time to make it better.",
  },
  {
    id: "1239",
    title: "なるべく",
    slug: "なるべく-1239",
    jlptLevel: "N3",
    grammarType: "程度",
    tags: ["程度", "努力"],
    meaningZh: "尽量……；尽可能……",
    meaningEn: "as much as possible; if possible",
    structure: "なるべく + 动词/形容词",
    explanationZh:
      "表示在可行范围内尽力做到某事。语气比「できるだけ」稍柔和。",
    explanationEn:
      "Shows trying to do something within what is realistically possible. It is slightly softer than できるだけ.",
    usageNoteZh: "常用于请求、建议或自我要求。",
    usageNoteEn: "Often used in requests, advice, or personal goals.",
    exampleJp: "明日はなるべく早く来てください。",
    exampleZh: "明天请尽量早点来。",
    exampleEn: "Please come as early as possible tomorrow.",
    commonMistakeZh: "「なるべく」不是绝对命令，而是在可能范围内尽量。",
    commonMistakeEn: "なるべく is not an absolute command; it means as much as possible within limits.",
    memoryTipZh: "能做到多少，就尽量做到多少。",
    memoryTipEn: "Do as much as can reasonably be done.",
  },
  {
    id: "1240",
    title: "なぜなら",
    slug: "なぜなら-1240",
    jlptLevel: "N3",
    grammarType: "原因・理由",
    tags: ["原因", "说明"],
    meaningZh: "因为……；原因是……",
    meaningEn: "because; the reason is",
    structure: "なぜなら + 理由句 + からだ / のだ",
    explanationZh:
      "用于在先提出结论后补充理由。句末常与「からだ」「ためだ」「のだ」呼应。",
    explanationEn:
      "Used after first stating a conclusion, then adding the reason. It often corresponds with からだ, ためだ, or のだ at the end.",
    usageNoteZh: "比口语的「だって」正式，适合说明文、演讲和作文。",
    usageNoteEn: "More formal than casual だって, and suitable for explanations, speeches, and essays.",
    exampleJp: "私はこの案に賛成です。なぜなら、費用を大きく減らせるからです。",
    exampleZh: "我赞成这个方案。因为它能大幅减少费用。",
    exampleEn: "I support this proposal because it can greatly reduce costs.",
    commonMistakeZh: "使用「なぜなら」时，理由句末最好用「からだ/からです」收住。",
    commonMistakeEn: "When using なぜなら, it is best to end the reason clause with からだ or からです.",
    memoryTipZh: "先说结论，再用「なぜなら」打开理由。",
    memoryTipEn: "State the conclusion first, then open the reason with なぜなら.",
  },
];

function applyLegacyFields(item) {
  item.sourceRoute = item.sourceRoute ?? "综合";
  item.furigana = item.furigana ?? "";
  item.similarGrammar = item.similarGrammar ?? [];
  item.quizQuestion = item.quizQuestion ?? "";
  item.quizChoices = item.quizChoices ?? [];
  item.quizAnswer = item.quizAnswer ?? "";
  item.quizExplanation = item.quizExplanation ?? "";
  item.meaningCn = item.meaningZh;
  item.explanation = item.explanationZh;
  item.usageNote = item.usageNoteZh;
  item.exampleCn = item.exampleZh;
  item.commonMistake = item.commonMistakeZh;
  item.memoryTip = item.memoryTipZh;
}

for (const item of newEntries) applyLegacyFields(item);

const deleted = new Set(Object.keys(deleteRedirects));
for (const [from, to] of Object.entries(deleteRedirects)) redirects[from] = to;
for (const [from, to] of Object.entries(redirects)) {
  if (deleteRedirects[to]) redirects[from] = deleteRedirects[to];
}

const newIds = new Set(newEntries.map((item) => item.id));
const nextGrammar = grammar.filter((item) => !deleted.has(item.id) && !newIds.has(item.id));
nextGrammar.push(...newEntries);
nextGrammar.sort((a, b) => Number(a.id) - Number(b.id));

fs.writeFileSync(grammarPath, JSON.stringify(nextGrammar, null, 2) + "\n");
fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2) + "\n");
