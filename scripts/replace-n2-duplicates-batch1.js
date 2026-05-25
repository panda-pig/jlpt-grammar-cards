const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const redirectsPath = path.join(__dirname, "../src/data/grammar-dedupe-redirects.json");

const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));

const deleteRedirects = {
  523: "516",
  525: "524",
  667: "536",
  553: "547",
  554: "548",
  552: "549",
  542: "117",
};

const newEntries = [
  {
    id: "1241",
    title: "に応えて",
    slug: "に応えて-1241",
    jlptLevel: "N2",
    grammarType: "関係",
    tags: ["回应", "对应"],
    meaningZh: "响应……；应……",
    meaningEn: "in response to; in answer to",
    structure: "名词 + に応えて",
    explanationZh: "表示根据期待、要求、请求、呼声等作出回应或采取行动。",
    explanationEn: "Shows acting in response to expectations, demands, requests, voices, or similar input.",
    usageNoteZh: "常接「期待」「要望」「声」「リクエスト」「要求」等名词。",
    usageNoteEn: "Common with nouns such as 期待, 要望, 声, リクエスト, and 要求.",
    exampleJp: "利用者の要望に応えて、新しい機能を追加しました。",
    exampleZh: "应用户要求，我们追加了新功能。",
    exampleEn: "In response to user requests, we added a new feature.",
    commonMistakeZh: "不要和「に答えて」混淆；「応えて」强调回应期待或要求，「答えて」多用于回答问题。",
    commonMistakeEn: "Do not confuse it with に答えて; 応えて responds to needs or expectations, while 答えて answers questions.",
    memoryTipZh: "对方有期待，我方作回应。",
    memoryTipEn: "There is a call from someone, and this answers that call.",
  },
  {
    id: "1242",
    title: "に加えて",
    slug: "に加えて-1242",
    jlptLevel: "N2",
    grammarType: "並列",
    tags: ["追加", "并列"],
    meaningZh: "加上……；除此之外还……",
    meaningEn: "in addition to; besides",
    structure: "名词 + に加えて",
    explanationZh: "表示在已有事项之外再追加另一个事项，常用于并列多个理由、特点或条件。",
    explanationEn: "Adds another point to an existing one, often listing reasons, features, or conditions.",
    usageNoteZh: "后项通常是同方向的追加信息，不适合接完全相反的内容。",
    usageNoteEn: "The following point usually adds information in the same direction, not a completely opposite idea.",
    exampleJp: "この町は景色が美しいのに加えて、食べ物もおいしい。",
    exampleZh: "这座城市风景很美，而且食物也好吃。",
    exampleEn: "In addition to beautiful scenery, this town also has delicious food.",
    commonMistakeZh: "不要和转折表达混用；「に加えて」是追加，不是“但是”。",
    commonMistakeEn: "Do not use it as a contrast; に加えて adds information, it does not mean 'but.'",
    memoryTipZh: "「加えて」就是在已有信息上再加一层。",
    memoryTipEn: "加えて means adding one more layer of information.",
  },
  {
    id: "1243",
    title: "に向かって",
    slug: "に向かって-1243",
    jlptLevel: "N2",
    grammarType: "目的",
    tags: ["方向", "目标"],
    meaningZh: "朝着……；面向……",
    meaningEn: "toward; facing; aiming at",
    structure: "名词 + に向かって",
    explanationZh: "表示动作、视线、声音或努力的方向，也可表示朝目标推进。",
    explanationEn: "Indicates the direction of an action, gaze, voice, or effort, and can also mean moving toward a goal.",
    usageNoteZh: "用于物理方向时较直接；用于目标时常接「夢」「目標」「試験」等。",
    usageNoteEn: "For physical direction it is literal; for goals it often follows nouns like 夢, 目標, or 試験.",
    exampleJp: "合格に向かって、毎日少しずつ復習しています。",
    exampleZh: "我正朝着合格的目标，每天一点点复习。",
    exampleEn: "I review a little every day as I work toward passing.",
    commonMistakeZh: "「に向けて」偏准备和面向目标，「に向かって」更强调方向或正在推进。",
    commonMistakeEn: "に向けて emphasizes preparation toward a goal; に向かって emphasizes direction or ongoing movement.",
    memoryTipZh: "箭头正在朝目标移动。",
    memoryTipEn: "The arrow is moving toward the target.",
  },
  {
    id: "1244",
    title: "に際して",
    slug: "に際して-1244",
    jlptLevel: "N2",
    grammarType: "時点",
    tags: ["时机", "正式"],
    meaningZh: "在……之际；当……的时候",
    meaningEn: "on the occasion of; when",
    structure: "名词 + に際して / 动词辞书形 + に際して",
    explanationZh: "表示在某个重要行为或事件即将发生时。语气正式，多用于通知、致辞、说明。",
    explanationEn: "Used when an important action or event is about to occur. It is formal and common in notices, speeches, or explanations.",
    usageNoteZh: "常接「出発」「入学」「契約」「利用」「応募」等正式场景。",
    usageNoteEn: "Common with formal situations such as 出発, 入学, 契約, 利用, and 応募.",
    exampleJp: "ご利用に際して、注意事項を必ずお読みください。",
    exampleZh: "使用之际，请务必阅读注意事项。",
    exampleEn: "When using the service, please be sure to read the precautions.",
    commonMistakeZh: "日常闲聊里通常不用「に際して」，可换成「とき」。",
    commonMistakeEn: "に際して is usually too formal for casual conversation; とき is more natural there.",
    memoryTipZh: "「際」就是事情发生的那个正式场合。",
    memoryTipEn: "際 points to the formal occasion when something happens.",
  },
  {
    id: "1245",
    title: "に先立ち",
    slug: "に先立ち-1245",
    jlptLevel: "N2",
    grammarType: "時点",
    tags: ["之前", "正式"],
    meaningZh: "在……之前；先于……",
    meaningEn: "before; prior to",
    structure: "名词 + に先立ち / 动词辞书形 + に先立ち",
    explanationZh: "表示在某个正式事件或行动之前先做准备、通知、说明等。",
    explanationEn: "Indicates doing preparation, notification, explanation, or a similar action before a formal event or action.",
    usageNoteZh: "比「前に」正式，常用于会议、考试、活动、实施前说明。",
    usageNoteEn: "More formal than 前に and common before meetings, exams, events, or implementation.",
    exampleJp: "試験に先立ち、本人確認を行います。",
    exampleZh: "考试开始前，将进行本人确认。",
    exampleEn: "Before the exam, identity verification will be conducted.",
    commonMistakeZh: "后项通常是正式准备动作，不是普通日常先后顺序。",
    commonMistakeEn: "The following action is usually a formal preparatory step, not just an everyday sequence.",
    memoryTipZh: "「先立つ」就是先站到事件前面。",
    memoryTipEn: "先立つ means standing before the event.",
  },
  {
    id: "1246",
    title: "にしろ～にしろ",
    slug: "にしろ-にしろ-1246",
    jlptLevel: "N2",
    grammarType: "条件",
    tags: ["列举", "让步"],
    meaningZh: "无论……还是……",
    meaningEn: "whether...or...",
    structure: "普通形/名词 + にしろ + 普通形/名词 + にしろ",
    explanationZh: "列举两个可能情况，表示无论哪一种成立，后项结论都不变。",
    explanationEn: "Lists two possible cases and says that the conclusion remains the same whichever is true.",
    usageNoteZh: "后项要能同时适用于前面列举的两种情况。",
    usageNoteEn: "The following point must apply to both listed cases.",
    exampleJp: "賛成にしろ反対にしろ、理由をはっきり説明してください。",
    exampleZh: "无论赞成还是反对，请明确说明理由。",
    exampleEn: "Whether you agree or disagree, please clearly explain your reason.",
    commonMistakeZh: "不要只列一个选项；这个形式通常成对出现。",
    commonMistakeEn: "Do not list only one option; this pattern normally appears as a pair.",
    memoryTipZh: "两个「にしろ」把两个分支都包住。",
    memoryTipEn: "The two にしろ phrases cover both branches.",
  },
  {
    id: "1247",
    title: "にしたら / にすれば",
    slug: "にしたら-にすれば-1247",
    jlptLevel: "N2",
    grammarType: "関係",
    tags: ["立场", "角度"],
    meaningZh: "从……的立场来看；对……来说",
    meaningEn: "from the standpoint of; for",
    structure: "名词 + にしたら / 名词 + にすれば",
    explanationZh: "表示从某人或某方的立场、感受或判断来看事情。",
    explanationEn: "Shows viewing something from a person's or group's standpoint, feelings, or judgment.",
    usageNoteZh: "常用于说明当事人的感受，后项多带评价或判断。",
    usageNoteEn: "Often describes how the person concerned feels, with the following part giving an evaluation or judgment.",
    exampleJp: "親にすれば、子どもの安全が何より大切だ。",
    exampleZh: "对父母来说，孩子的安全比什么都重要。",
    exampleEn: "For parents, their child's safety is more important than anything.",
    commonMistakeZh: "不要和单纯对象「にとって」机械等同；「にしたら/にすれば」更突出当事人立场。",
    commonMistakeEn: "Do not mechanically equate it with にとって; にしたら/にすれば emphasizes the person's standpoint.",
    memoryTipZh: "把自己放到那个人的位置上看。",
    memoryTipEn: "Put yourself in that person's position and look from there.",
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
