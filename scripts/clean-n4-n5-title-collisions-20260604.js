const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const redirectsPath = path.join(__dirname, "../src/data/grammar-dedupe-redirects.json");

const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));

const deleteRedirects = {
  237: "108",
  238: "98",
  239: "99",
  240: "100",
  253: "93",
  256: "155",
  268: "121",
  275: "106",
  276: "104",
  277: "107",
  278: "105",
  279: "117",
  280: "115",
  285: "90",
  287: "138",
  297: "113",
  304: "215",
};

const updates = {
  25: {
    title: "から（原因）",
    slug: "から-原因-25",
    grammarType: "原因・理由",
    meaningZh: "因为……所以……",
    meaningEn: "because; since",
    structure: "句子普通形 + から",
    explanationZh: "接在句子后，说明说话人认为后句成立的理由。",
    explanationEn: "Attached to a clause, it gives the reason the speaker believes the following clause holds.",
    usageNoteZh: "语气较直接，常用于说明个人判断、请求或行动理由。",
    usageNoteEn: "It is fairly direct and often explains the reason for a judgment, request, or action.",
    commonMistakeZh: "不要和表示起点的名词后「から」混淆；这里前面通常是一个完整句子。",
    commonMistakeEn: "Do not confuse it with から after a noun marking a starting point; here it usually follows a full clause.",
    memoryTipZh: "前句给理由，后句说结果。",
    memoryTipEn: "The first clause gives the reason; the second gives the result.",
  },
  74: {
    title: "から（起点）",
    slug: "から-起点-74",
    grammarType: "起点",
    meaningZh: "从……；自……起",
    meaningEn: "from; starting at",
    structure: "时间 / 地点 + から",
    explanationZh: "标记时间、地点或范围的起点，表示“从这里开始”。",
    explanationEn: "Marks the starting point of a time, place, or range, meaning 'from here.'",
    usageNoteZh: "常和「まで」一起表示从……到……。",
    usageNoteEn: "Often pairs with まで to mean from...to....",
    commonMistakeZh: "不要和原因「から」混淆；起点用法前面通常是名词。",
    commonMistakeEn: "Do not confuse it with causal から; the starting-point use usually follows a noun.",
    memoryTipZh: "把「から」看成起跑线。",
    memoryTipEn: "Think of から as the starting line.",
  },
  28: {
    title: "に（时间点）",
    slug: "に-时间点-28",
    grammarType: "時",
    meaningZh: "在……时间；于……",
    meaningEn: "at; on; in at a specific time",
    structure: "具体时间 + に",
    explanationZh: "标记动作发生的具体时间点，如几点、几月几日、星期几。",
    explanationEn: "Marks the specific time when an action occurs, such as an hour, date, or weekday.",
    usageNoteZh: "相对时间如「今日」「明日」「毎日」通常不加「に」。",
    usageNoteEn: "Relative time words such as 今日, 明日, and 毎日 usually do not take に.",
    commonMistakeZh: "不要把所有时间词都加「に」；具体时间点才常加。",
    commonMistakeEn: "Do not add に to every time word; it is common with specific time points.",
    memoryTipZh: "具体时间像日历上的一个点，用「に」钉住。",
    memoryTipEn: "A specific time is like a point on a calendar; に pins it down.",
  },
  71: {
    title: "に（存在地点）",
    slug: "に-存在地点-71",
    grammarType: "存在",
    meaningZh: "在……；表示存在地点",
    meaningEn: "in; at, marking where something exists",
    structure: "场所 + に + あります / います",
    usageNoteZh: "重点是人或物存在在哪里，而不是动作在哪里发生。",
    usageNoteEn: "The focus is where a person or thing exists, not where an action happens.",
    commonMistakeZh: "存在句用「にある / にいる」，动作发生地点才常用「で」。",
    commonMistakeEn: "Existence uses にある / にいる; action locations often use で.",
  },
  30: {
    title: "が（转折）",
    slug: "が-转折-30",
    grammarType: "逆接・譲歩",
    meaningZh: "但是……；不过……",
    meaningEn: "but; although",
    structure: "句子 + が + 句子",
    usageNoteZh: "比「でも」更柔和、书面一些，可用于礼貌铺垫。",
    usageNoteEn: "Softer and somewhat more written than でも; useful for polite lead-ins.",
    commonMistakeZh: "不要和主语助词「が」混淆；转折「が」连接两个句子。",
    commonMistakeEn: "Do not confuse it with the subject particle が; contrastive が connects two clauses.",
  },
  69: {
    title: "が（主语）",
    slug: "が-主语-69",
    grammarType: "主語",
    meaningZh: "主语标记；新信息",
    meaningEn: "subject marker; new information",
    structure: "名词 + が",
    usageNoteZh: "常用于介绍新出现的人或物，或强调“谁/什么”。",
    usageNoteEn: "Often introduces a newly appearing person or thing, or emphasizes who/what.",
    commonMistakeZh: "「は」提示话题，「が」更常标记新信息或被强调的主语。",
    commonMistakeEn: "は marks the topic; が often marks new information or an emphasized subject.",
  },
  106: {
    title: "と（条件）",
    slug: "と-条件-106",
    grammarType: "条件",
    meaningZh: "一……就……；如果……就自然发生",
    meaningEn: "when; if, with a natural result",
    structure: "动词辞书形 + と",
    usageNoteZh: "后项多为自然结果、机械反应、习惯或必然结果。",
    usageNoteEn: "The following clause is often a natural result, mechanical response, habit, or inevitable result.",
    commonMistakeZh: "不要和名词并列「と」混淆；条件「と」接在动词句后。",
    commonMistakeEn: "Do not confuse it with と for listing nouns; conditional と follows a verb clause.",
  },
  166: {
    title: "と（并列）",
    slug: "と-并列-166",
    grammarType: "並列",
    meaningZh: "和……；并列列举全部项目",
    meaningEn: "and, listing nouns exhaustively",
    structure: "名词 + と + 名词",
    usageNoteZh: "列举感比较完整，暗示提到的项目都包括在内。",
    usageNoteEn: "It feels exhaustive, implying that the listed items are all included.",
    commonMistakeZh: "不要和条件「と」混淆；并列「と」连接名词。",
    commonMistakeEn: "Do not confuse it with conditional と; listing と connects nouns.",
  },
  110: {
    title: "ために（原因）",
    slug: "ために-原因-110",
    grammarType: "原因・理由",
    meaningZh: "由于……；因为……",
    meaningEn: "because of; due to",
    structure: "名词 + の / 动词普通形 + ため（に）",
    usageNoteZh: "原因用法偏正式，后项多为已经发生或自然产生的结果。",
    usageNoteEn: "The cause use is formal; the following clause is often an already occurred or natural result.",
    commonMistakeZh: "不要自动翻成“为了”；原因用法看后项是否为非意志结果。",
    commonMistakeEn: "Do not automatically translate it as 'in order to'; for cause, the result is often non-volitional.",
  },
  298: {
    title: "ために（目的）",
    slug: "ために-目的-298",
    grammarType: "目的",
    meaningZh: "为了……",
    meaningEn: "in order to; for the purpose of",
    structure: "名词 + の / 动词辞书形 + ために",
    explanationZh: "表示为了某个目的而采取后项行动。",
    explanationEn: "Shows taking the following action for the purpose of the first item.",
    usageNoteZh: "后项通常是说话人或主语有意志地做的动作。",
    usageNoteEn: "The following clause is usually a volitional action by the speaker or subject.",
    commonMistakeZh: "和原因「ために」不同，目的用法后项通常是主动行动。",
    commonMistakeEn: "Unlike causal ために, the purpose use usually has an intentional action after it.",
    memoryTipZh: "目的用法是在前方放一个目标。",
    memoryTipEn: "The purpose use places a goal ahead.",
  },
  113: {
    title: "ように（目的）",
    slug: "ように-目的-113",
    grammarType: "目的",
    meaningZh: "为了……；以便……",
    meaningEn: "so that; in order that",
    commonMistakeZh: "自己的直接意志动作常用「ために」；能力、状态或避免发生常用「ように」。",
    commonMistakeEn: "Use ために for direct volitional actions; use ように for abilities, states, or avoiding something.",
  },
  303: {
    title: "ようにする（习惯化）",
    slug: "ようにする-习惯化-303",
    grammarType: "習慣",
    meaningZh: "努力做到……；有意识地……",
    meaningEn: "make an effort to; make it a habit to",
    usageNoteZh: "强调人为、有意识地调整行为或养成习惯。",
    usageNoteEn: "Emphasizes consciously adjusting behavior or building a habit.",
  },
  119: {
    title: "が（连接转折）",
    slug: "が-连接转折-119",
    grammarType: "逆接・譲歩",
    meaningZh: "但是……；不过……",
    meaningEn: "but; though",
    structure: "句子普通形 + が + 句子",
    commonMistakeZh: "这个「が」不是主语助词，而是连接句子的转折助词。",
    commonMistakeEn: "This が is not the subject marker; it connects clauses with contrast.",
  },
  302: {
    title: "がする（感官）",
    slug: "がする-感官-302",
    grammarType: "感覚",
    meaningZh: "有……感觉；闻到/听到/感到……",
    meaningEn: "sense; smell; hear; feel",
    usageNoteZh: "常接声音、气味、味道、感觉等名词。",
    usageNoteEn: "Often follows nouns for sounds, smells, tastes, or feelings.",
  },
  173: {
    title: "に（对象）",
    slug: "に-对象-173",
    grammarType: "対象",
    meaningZh: "向……；给……；对……",
    meaningEn: "to; toward; for, marking a target",
    structure: "对象 / 接受者 + に",
    usageNoteZh: "标记动作朝向的人、对象或接受者。",
    usageNoteEn: "Marks the person, target, or recipient toward whom an action is directed.",
    commonMistakeZh: "直接宾语用「を」，动作对象或接受者常用「に」。",
    commonMistakeEn: "Use を for direct objects; に often marks the target or recipient.",
  },
  215: {
    title: "にする（决定）",
    slug: "にする-决定-215",
    grammarType: "決定",
    meaningZh: "决定选……；使……变成……",
    meaningEn: "decide on; make into",
    structure: "名词 + にする / 形容词词干 + く / にする",
    usageNoteZh: "可表示选择决定，也可表示人为地让某物变成某状态。",
    usageNoteEn: "Can show choosing something, or intentionally making something into a state.",
  },
};

for (const [from, to] of Object.entries(deleteRedirects)) redirects[from] = to;
for (const [from, to] of Object.entries(redirects)) {
  if (deleteRedirects[to]) redirects[from] = deleteRedirects[to];
}

const deleted = new Set(Object.keys(deleteRedirects));
const nextGrammar = grammar
  .filter((item) => !deleted.has(String(item.id)))
  .map((item) => {
    const update = updates[item.id];
    if (!update) return item;
    const next = { ...item, ...update };
    for (const [legacy, modern] of [
      ["meaningCn", "meaningZh"],
      ["explanation", "explanationZh"],
      ["usageNote", "usageNoteZh"],
      ["exampleCn", "exampleZh"],
      ["commonMistake", "commonMistakeZh"],
      ["memoryTip", "memoryTipZh"],
    ]) {
      if (update[modern]) next[legacy] = update[modern];
    }
    return next;
  })
  .sort((a, b) => Number(a.id) - Number(b.id));

fs.writeFileSync(grammarPath, JSON.stringify(nextGrammar, null, 2) + "\n");
fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2) + "\n");
