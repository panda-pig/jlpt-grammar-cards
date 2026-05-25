const fs = require("fs");

const grammarPath = "./src/data/grammar.json";
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const updates = {
  30: {
    meaningZh: "但是……；轻微转折",
    meaningEn: "but; soft contrast",
    structure: "句子 + が + 句子",
    explanationZh: "这个「が」连接两个分句，表示后项和前项有转折或出乎预期的关系。语气比「でも」更柔和。",
    explanationEn: "This が connects two clauses and marks a contrast or unexpected turn. It sounds softer than でも.",
    usageNoteZh: "主语标记的「が」另作一张卡；这里专门记连接分句的转折用法。",
    usageNoteEn: "Subject-marking が is handled as a separate card; this card focuses on contrast between clauses.",
    commonMistakeZh: "不要把句中转折「が」和主语标记「が」混在一起看；判断时先看它是否连接两个句子。",
    commonMistakeEn: "Do not mix contrast が with subject が; first check whether it connects two clauses.",
    memoryTipZh: "两个句子中间的「が」常像一个柔和的“但是”。",
    memoryTipEn: "が between two clauses often works like a soft 'but.'",
  },
  106: {
    meaningZh: "一……就……；如果……就自然发生",
    meaningEn: "when; whenever; if this happens, that follows",
    structure: "动词辞书形 + と",
    explanationZh: "条件用法的「と」说明前项一发生，后项就自然、习惯性或必然发生。",
    explanationEn: "Conditional と shows that when the first action happens, the second result follows naturally, habitually, or inevitably.",
    usageNoteZh: "后项通常不接说话人的意志、请求或命令；这些情况多用「たら」等表达。",
    usageNoteEn: "The following clause usually should not be the speaker's will, request, or command; use forms like たら for those cases.",
    commonMistakeZh: "不要和名词并列的「と」混淆；动词后面的「と」常表示自然条件。",
    commonMistakeEn: "Do not confuse it with noun-listing と; after a verb, と often marks a natural condition.",
    memoryTipZh: "按下按钮，门就开；这种自然连锁就是条件「と」。",
    memoryTipEn: "Press the button, and the door opens; that natural chain is conditional と.",
  },
};

for (const [id, patch] of Object.entries(updates)) {
  const item = grammar.find((entry) => entry.id === id);
  if (!item) throw new Error(`Missing grammar id ${id}`);
  Object.assign(item, patch);
  item.meaningCn = item.meaningZh;
  item.explanation = item.explanationZh;
  item.usageNote = item.usageNoteZh;
  item.commonMistake = item.commonMistakeZh;
  item.memoryTip = item.memoryTipZh;
}

fs.writeFileSync(grammarPath, JSON.stringify(grammar, null, 2) + "\n");
