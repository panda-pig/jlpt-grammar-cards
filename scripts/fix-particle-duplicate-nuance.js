const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const updates = {
  71: {
    grammarType: "存在",
    tags: ["存在", "地点", "助词"],
    meaningZh: "在……；表示存在地点",
    meaningEn: "at/in; marks the place of existence",
    structure: "场所 + に + あります/います",
    explanationZh:
      "这个「に」表示人或物存在的位置，常和「ある／いる」一起使用。重点是某物在哪里，而不是动作发生在哪里。",
    explanationEn:
      "This に marks the place where a person or thing exists and is commonly used with ある or いる. The focus is where something is located, not where an action takes place.",
    usageNoteZh: "描述动作发生地点通常用「で」，描述存在地点通常用「に」。",
    usageNoteEn: "Use で for where an action happens; use に for where something exists.",
    exampleJp: "机の上に本があります。",
    exampleZh: "桌子上有一本书。",
    exampleEn: "There is a book on the desk.",
    commonMistakeZh: "不要说「机の上で本があります」。存在句要用「にあります」。",
    commonMistakeEn: "Do not say 机の上で本があります. Existence sentences use にあります.",
    memoryTipZh: "存在句里，「に」像图钉一样把东西钉在地点上。",
    memoryTipEn: "In existence sentences, に pins the thing to its location.",
  },
  166: {
    grammarType: "並列",
    tags: ["并列", "列举", "助词"],
    meaningZh: "和……；并列列举全部项目",
    meaningEn: "and; lists items exhaustively",
    structure: "名词 + と + 名词",
    explanationZh:
      "这个「と」连接名词，表示“和”。列举感比较完整，暗示提到的项目都包括在内。",
    explanationEn:
      "This と connects nouns and means 'and.' It lists items fairly exhaustively, implying the mentioned items are all included.",
    usageNoteZh: "如果只是举例而非全部列出，通常用「や」或「など」。",
    usageNoteEn: "If listing examples rather than all items, use や or など instead.",
    exampleJp: "机の上に本と辞書があります。",
    exampleZh: "桌子上有书和词典。",
    exampleEn: "There is a book and a dictionary on the desk.",
    commonMistakeZh: "不要和条件「と」混淆；名词之间的「と」表示并列，动词后面的「と」常表示条件。",
    commonMistakeEn:
      "Do not confuse it with conditional と. Between nouns it lists items; after a verb it often marks a condition.",
    memoryTipZh: "名词和名词之间的「と」就是把两样东西并排放好。",
    memoryTipEn: "と between nouns places the two items side by side.",
  },
};

for (const [id, patch] of Object.entries(updates)) {
  const item = grammar.find((entry) => entry.id === id);
  if (!item) throw new Error(`Missing grammar id ${id}`);
  Object.assign(item, patch);
  item.meaningCn = item.meaningZh;
  item.explanation = item.explanationZh;
  item.usageNote = item.usageNoteZh;
  item.exampleCn = item.exampleZh;
  item.commonMistake = item.commonMistakeZh;
  item.memoryTip = item.memoryTipZh;
}

fs.writeFileSync(grammarPath, JSON.stringify(grammar, null, 2) + "\n");
