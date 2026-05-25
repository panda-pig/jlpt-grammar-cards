const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const redirectsPath = path.join(__dirname, "../src/data/grammar-dedupe-redirects.json");

const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));

const deleteRedirects = {
  338: "329",
  480: "377",
  345: "117",
  351: "293",
  375: "80",
  445: "138",
  447: "140",
  410: "147",
  411: "148",
  412: "149",
};

const newEntries = [
  {
    id: "1225",
    title: "ことはない",
    slug: "ことはない-1225",
    jlptLevel: "N3",
    grammarType: "義務・当然",
    tags: ["不必要", "建议"],
    meaningZh: "不必……；没有必要……",
    meaningEn: "there is no need to; do not have to",
    structure: "动词辞书形 + ことはない",
    explanationZh:
      "表示某个动作没有必要做，常用于安慰、劝告或说明不用担心。",
    explanationEn:
      "Shows that an action is unnecessary, often used to reassure, advise, or say there is no need to worry.",
    usageNoteZh: "多用于口语和说明语气，后面不再接否定。",
    usageNoteEn: "Often used in speech or explanatory tone; do not add another negative after it.",
    exampleJp: "少し遅れただけだから、そんなに謝ることはありません。",
    exampleZh: "只是稍微迟到了一点，不必那么道歉。",
    exampleEn: "You were only a little late, so there is no need to apologize so much.",
    commonMistakeZh: "不要和「ことがない」混淆；「ことがない」表示经验或发生频率，「ことはない」表示没必要。",
    commonMistakeEn:
      "Do not confuse it with ことがない, which talks about experience or frequency; ことはない means there is no need.",
    memoryTipZh: "“这件事不用做”就是「ことはない」。",
    memoryTipEn: "Think: 'There is no need to do that thing.'",
  },
  {
    id: "1226",
    title: "ことは～が",
    slug: "ことは-が-1226",
    jlptLevel: "N3",
    grammarType: "逆接・譲歩",
    tags: ["让步", "部分承认"],
    meaningZh: "虽然……是……，但是……",
    meaningEn: "it is true that..., but",
    structure: "普通形 + ことは + 同一表达 + が",
    explanationZh:
      "先部分承认前项成立，再提出限制、保留或相反评价。常用于“是……倒是……，不过……”。",
    explanationEn:
      "Partly admits that the first point is true, then adds a limitation, reservation, or contrasting evaluation.",
    usageNoteZh: "前后通常重复同一个形容词或动词，如「高いことは高いが」。",
    usageNoteEn: "The same adjective or verb is usually repeated, as in 高いことは高いが.",
    exampleJp: "この部屋は広いことは広いが、駅から少し遠い。",
    exampleZh: "这个房间宽敞是宽敞，但离车站有点远。",
    exampleEn: "This room is spacious, true, but it is a little far from the station.",
    commonMistakeZh: "不要省略后面的转折内容；这个表达的重点在“承认后再保留”。",
    commonMistakeEn: "Do not omit the contrasting part; the point is admitting something and then qualifying it.",
    memoryTipZh: "先点头：是这样；再转折：不过……",
    memoryTipEn: "First nod: yes, it is true. Then turn: but...",
  },
  {
    id: "1227",
    title: "まるで",
    slug: "まるで-1227",
    jlptLevel: "N3",
    grammarType: "推量・様態",
    tags: ["比喻", "样态"],
    meaningZh: "简直像……；完全像……",
    meaningEn: "just like; as if",
    structure: "まるで + 名词 + のようだ / みたいだ",
    explanationZh:
      "用于比喻或夸张地说明某状态像另一种事物。常和「ようだ」「みたいだ」搭配。",
    explanationEn:
      "Used to describe something metaphorically or emphatically as being like something else, often with ようだ or みたいだ.",
    usageNoteZh: "也可和否定搭配表示“完全不……”，如「まるで分からない」。",
    usageNoteEn: "It can also pair with negatives to mean 'not at all,' as in まるで分からない.",
    exampleJp: "彼の説明はまるで映画の場面のように分かりやすかった。",
    exampleZh: "他的说明简直像电影场景一样容易理解。",
    exampleEn: "His explanation was so clear it was almost like a scene from a movie.",
    commonMistakeZh: "比喻用法后面常需要「ようだ/みたいだ」，不要只停在「まるで」。",
    commonMistakeEn: "For comparison, it usually needs ようだ or みたいだ; do not stop at まるで.",
    memoryTipZh: "「まるで」给后面的比喻加“简直”。",
    memoryTipEn: "まるで adds 'just like' to the comparison that follows.",
  },
  {
    id: "1228",
    title: "まさか",
    slug: "まさか-1228",
    jlptLevel: "N3",
    grammarType: "推量・様態",
    tags: ["意外", "否定推量"],
    meaningZh: "难道……；不可能吧",
    meaningEn: "surely not; no way; could it be",
    structure: "まさか + 句子 / まさか〜とは思わなかった",
    explanationZh:
      "表示说话人觉得某事非常意外、不太可能或难以相信。常用于惊讶反应。",
    explanationEn:
      "Shows that the speaker finds something very unexpected, unlikely, or hard to believe. It is common in surprised reactions.",
    usageNoteZh: "常和否定、疑问或「とは思わなかった」搭配。",
    usageNoteEn: "Often used with negatives, questions, or とは思わなかった.",
    exampleJp: "まさかこんな場所で昔の友人に会うとは思わなかった。",
    exampleZh: "真没想到会在这种地方遇到老朋友。",
    exampleEn: "I never imagined I would meet an old friend in a place like this.",
    commonMistakeZh: "不要把「まさか」当普通“也许”；它带强烈意外和难以置信。",
    commonMistakeEn: "Do not treat まさか as ordinary 'maybe'; it carries strong surprise or disbelief.",
    memoryTipZh: "「まさか」就是“不会吧？！”的语气。",
    memoryTipEn: "まさか has the feeling of 'No way! Really?'",
  },
  {
    id: "1229",
    title: "めったに〜ない",
    slug: "めったに-ない-1229",
    jlptLevel: "N3",
    grammarType: "否定",
    tags: ["频率", "否定"],
    meaningZh: "很少……；难得……",
    meaningEn: "rarely; seldom",
    structure: "めったに + 否定形",
    explanationZh:
      "表示某事发生频率很低。必须和否定表达搭配。",
    explanationEn:
      "Shows that something happens very rarely. It must be used with a negative expression.",
    usageNoteZh: "常接「ない」「ません」，表示并非绝对不发生，而是频率极低。",
    usageNoteEn: "Usually followed by ない or ません. It means very rare, not absolutely never.",
    exampleJp: "仕事が忙しくて、最近はめったに映画を見ません。",
    exampleZh: "工作很忙，最近很少看电影。",
    exampleEn: "I have been busy with work, so I rarely watch movies these days.",
    commonMistakeZh: "不要和肯定句搭配；「めったに行きます」不自然。",
    commonMistakeEn: "Do not use it with an affirmative sentence; めったに行きます is unnatural.",
    memoryTipZh: "「めったに」后面等一个否定。",
    memoryTipEn: "めったに waits for a negative ending.",
  },
  {
    id: "1230",
    title: "も～ば～も",
    slug: "も-ば-も-1230",
    jlptLevel: "N3",
    grammarType: "並列",
    tags: ["并列", "列举"],
    meaningZh: "既……又……；也……也……",
    meaningEn: "both...and; as well as",
    structure: "名词 + も + ば + 名词 + も / 动词ば形 + も",
    explanationZh:
      "并列列举两个方面，表示两者都成立。常用于评价、特征或条件的并列。",
    explanationEn:
      "Lists two aspects in parallel and says both are true. Common for evaluations, features, or conditions.",
    usageNoteZh: "常见形式是「AもあればBもある」「AもすればBもする」。",
    usageNoteEn: "Common forms include AもあればBもある and AもすればBもする.",
    exampleJp: "この町には古い寺もあれば、新しい美術館もあります。",
    exampleZh: "这座城市既有古老的寺院，也有新的美术馆。",
    exampleEn: "This town has both old temples and new art museums.",
    commonMistakeZh: "前后结构要尽量平行，不能随意换成不对应的形式。",
    commonMistakeEn: "Keep the two sides structurally parallel; do not mix unrelated forms casually.",
    memoryTipZh: "两个「も」把两个方面并排放在一起。",
    memoryTipEn: "The two も markers place the two aspects side by side.",
  },
  {
    id: "1231",
    title: "もしかしたら",
    slug: "もしかしたら-1231",
    jlptLevel: "N3",
    grammarType: "推量・様態",
    tags: ["推量", "可能性"],
    meaningZh: "也许……；说不定……",
    meaningEn: "perhaps; maybe",
    structure: "もしかしたら + 句子",
    explanationZh:
      "表示说话人认为某事有一定可能性，但并不确定。常和「かもしれない」搭配。",
    explanationEn:
      "Shows that the speaker thinks something is possible but not certain. It often pairs with かもしれない.",
    usageNoteZh: "比普通「たぶん」更带有“意外可能性”的感觉。",
    usageNoteEn: "Compared with たぶん, it often suggests a possibility that has occurred to the speaker.",
    exampleJp: "もしかしたら、電車が遅れているのかもしれません。",
    exampleZh: "说不定电车晚点了。",
    exampleEn: "Maybe the train is delayed.",
    commonMistakeZh: "不要把它和断定表达搭配得太强；后面通常用推量。",
    commonMistakeEn: "Do not pair it with a statement that sounds too certain; it usually takes conjectural wording.",
    memoryTipZh: "「もし」开头，说明只是一个可能性。",
    memoryTipEn: "Starting with もし hints that it is only a possibility.",
  },
  {
    id: "1232",
    title: "もしも〜たら",
    slug: "もしも-たら-1232",
    jlptLevel: "N3",
    grammarType: "条件",
    tags: ["条件", "假设"],
    meaningZh: "如果……的话",
    meaningEn: "if; supposing that",
    structure: "もしも + 普通形过去 + ら",
    explanationZh:
      "表示假设条件，比普通「もし」更强调“假如真的发生”。常用于想象、担心或建议。",
    explanationEn:
      "Introduces a hypothetical condition, with stronger emphasis than plain もし on 'if it really happened.' Common for imagination, worry, or advice.",
    usageNoteZh: "后句可以接意志、建议、推量、命令等，但要符合假设语境。",
    usageNoteEn:
      "The following clause can express intention, advice, conjecture, or command, as long as it fits the hypothetical context.",
    exampleJp: "もしも道に迷ったら、すぐに駅員に聞いてください。",
    exampleZh: "如果迷路了，请马上问车站工作人员。",
    exampleEn: "If you get lost, please ask a station staff member right away.",
    commonMistakeZh: "不要漏掉「たら」；「もしも」只是提示假设，条件形式还要靠后面的「たら」。",
    commonMistakeEn:
      "Do not omit たら; もしも only signals a hypothesis, while たら forms the condition.",
    memoryTipZh: "「もしも」先打开假设门，「たら」把条件说完整。",
    memoryTipEn: "もしも opens the hypothetical door; たら completes the condition.",
  },
  {
    id: "1233",
    title: "向け",
    slug: "向け-1233",
    jlptLevel: "N3",
    grammarType: "目的",
    tags: ["对象", "用途"],
    meaningZh: "面向……；以……为对象",
    meaningEn: "intended for; aimed at",
    structure: "名词 + 向け",
    explanationZh:
      "表示某物、服务、内容或活动是为特定对象设计的。",
    explanationEn:
      "Shows that a product, service, content, or activity is designed for a particular target audience.",
    usageNoteZh: "常接人群或市场，如「子ども向け」「初心者向け」「海外向け」。",
    usageNoteEn: "Common with target groups or markets, such as 子ども向け, 初心者向け, and 海外向け.",
    exampleJp: "この教材は初めて日本語を学ぶ人向けです。",
    exampleZh: "这套教材是面向第一次学习日语的人。",
    exampleEn: "This material is intended for people learning Japanese for the first time.",
    commonMistakeZh: "「向け」强调设计对象；「向き」强调适合程度。",
    commonMistakeEn: "向け emphasizes the intended target; 向き emphasizes suitability.",
    memoryTipZh: "箭头“向”着谁，就是为谁做的。",
    memoryTipEn: "The arrow points toward the intended audience.",
  },
  {
    id: "1234",
    title: "向き",
    slug: "向き-1234",
    jlptLevel: "N3",
    grammarType: "評価",
    tags: ["适合", "对象"],
    meaningZh: "适合……；适于……",
    meaningEn: "suitable for; fit for",
    structure: "名词 + 向き",
    explanationZh:
      "表示某物的性质适合某类人、用途或场合。重点是适不适合，而不是设计初衷。",
    explanationEn:
      "Shows that something is suitable for a type of person, use, or situation. The focus is suitability, not original design.",
    usageNoteZh: "常接「初心者」「子ども」「家庭」「夏」等表示对象或场景的名词。",
    usageNoteEn: "Often follows nouns naming a target or situation, such as 初心者, 子ども, 家庭, or 夏.",
    exampleJp: "この靴は軽くて、長い散歩向きです。",
    exampleZh: "这双鞋很轻，适合长时间散步。",
    exampleEn: "These shoes are light and suitable for long walks.",
    commonMistakeZh: "「子ども向けの本」是为儿童设计的书；「子ども向きの本」是适合儿童读的书。",
    commonMistakeEn:
      "子ども向けの本 is a book designed for children; 子ども向きの本 is a book suitable for children.",
    memoryTipZh: "「向き」看合不合适。",
    memoryTipEn: "向き asks whether something fits.",
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
