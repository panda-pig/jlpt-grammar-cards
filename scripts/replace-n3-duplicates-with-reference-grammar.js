const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const redirectsPath = path.join(__dirname, "../src/data/grammar-dedupe-redirects.json");

const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));

const deleteRedirects = {
  339: "331",
  340: "330",
  342: "332",
  407: "369",
  408: "370",
  409: "371",
  483: "185",
  484: "186",
  485: "187",
};

const newEntries = [
  {
    id: "1216",
    title: "から〜にかけて",
    slug: "から-にかけて-1216",
    jlptLevel: "N3",
    grammarType: "範囲",
    tags: ["范围", "时间", "地点"],
    meaningZh: "从……到……一带；从……到……期间",
    meaningEn: "from...through; over the area/time from...to...",
    structure: "名词 + から + 名词 + にかけて",
    explanationZh:
      "表示时间或空间的大致范围，强调从起点到终点之间的一带或一段期间，而不是精确边界。",
    explanationEn:
      "Indicates an approximate range of time or space, emphasizing the area or period from one point through another rather than exact boundaries.",
    usageNoteZh: "常用于天气、交通、活动、地区分布等较宽范围的说明。",
    usageNoteEn: "Common for weather, traffic, events, regional distribution, and other broad ranges.",
    exampleJp: "今夜から明日の朝にかけて、強い雨が降るでしょう。",
    exampleZh: "从今晚到明天早上，可能会下大雨。",
    exampleEn: "Heavy rain is expected from tonight through tomorrow morning.",
    commonMistakeZh: "「から〜まで」边界更明确；「から〜にかけて」范围更宽、更模糊。",
    commonMistakeEn:
      "から〜まで marks clearer boundaries; から〜にかけて is broader and more approximate.",
    memoryTipZh: "「かけて」像把范围铺开到另一端。",
    memoryTipEn: "かけて spreads the range toward the other endpoint.",
  },
  {
    id: "1217",
    title: "決して〜ない",
    slug: "決して-ない-1217",
    jlptLevel: "N3",
    grammarType: "否定",
    tags: ["否定", "强调"],
    meaningZh: "绝不……；决不……",
    meaningEn: "never; by no means",
    structure: "決して + 否定形",
    explanationZh:
      "用副词「決して」和否定表达搭配，强烈否定某事，表示说话人很确定或态度坚决。",
    explanationEn:
      "Uses the adverb 決して with a negative expression to strongly deny something, showing certainty or firm resolve.",
    usageNoteZh: "后面必须接否定，如「ない」「ません」「ではない」。",
    usageNoteEn: "It must be followed by a negative form such as ない, ません, or ではない.",
    exampleJp: "この約束は決して忘れません。",
    exampleZh: "我绝不会忘记这个约定。",
    exampleEn: "I will never forget this promise.",
    commonMistakeZh: "不要把「決して」单独和肯定句搭配；它需要否定结尾。",
    commonMistakeEn: "Do not pair 決して with an affirmative ending; it requires a negative ending.",
    memoryTipZh: "「決して」后面等一个强否定。",
    memoryTipEn: "決して waits for a strong negative ending.",
  },
  {
    id: "1218",
    title: "切れない",
    slug: "切れない-1218",
    jlptLevel: "N3",
    grammarType: "否定",
    tags: ["程度", "否定", "补助动词"],
    meaningZh: "……不完；无法完全……",
    meaningEn: "cannot finish doing; cannot fully",
    structure: "动词ます形去ます + 切れない",
    explanationZh:
      "接在动词连用形后，表示数量、程度或心理负担太大，无法全部完成或完全做到。",
    explanationEn:
      "Attaches to the masu-stem of a verb and shows that something cannot be completely finished or fully done because the amount, degree, or burden is too great.",
    usageNoteZh: "常接「食べる」「数える」「説明する」「信じる」等动词。",
    usageNoteEn: "Common with verbs such as 食べる, 数える, 説明する, and 信じる.",
    exampleJp: "この量の料理は一人では食べ切れません。",
    exampleZh: "这么多菜一个人吃不完。",
    exampleEn: "One person cannot finish this amount of food.",
    commonMistakeZh: "不是普通的“切不断”，作为补助动词时表示“做不完、完全不能”。",
    commonMistakeEn:
      "As an auxiliary verb it does not mean 'cannot cut'; it means cannot finish or cannot fully do something.",
    memoryTipZh: "动作多到“切不到尽头”。",
    memoryTipEn: "The action is too much to cut through to the end.",
  },
  {
    id: "1219",
    title: "きり",
    slug: "きり-1219",
    jlptLevel: "N3",
    grammarType: "限定",
    tags: ["限定", "持续"],
    meaningZh: "自从……以后就一直；只有……",
    meaningEn: "since...and still; only",
    structure: "动词た形 + きり / 名词 + きり",
    explanationZh:
      "表示某动作发生后状态一直没有改变，也可表示限定为很少的人或物。N3 中常见的是「たきり」的持续状态。",
    explanationEn:
      "Shows that after an action happened, the state has remained unchanged; it can also mean only a small number of people or things. At N3, たきり is common.",
    usageNoteZh: "表示持续状态时，后句常接没有再发生、没有回来、没有联系等内容。",
    usageNoteEn:
      "When showing a continuing state, the following clause often says something has not happened again, someone has not returned, or there has been no contact.",
    exampleJp: "彼とは去年会ったきり、連絡を取っていません。",
    exampleZh: "我自从去年见过他以后，就没有再联系。",
    exampleEn: "I have not contacted him since I saw him last year.",
    commonMistakeZh: "「きり」表示后续状态停在那里，不只是普通的“以后”。",
    commonMistakeEn: "きり means the subsequent state has stayed that way, not just ordinary 'after.'",
    memoryTipZh: "一次之后就“切断”在那个状态。",
    memoryTipEn: "After one time, the situation is cut off and remains there.",
  },
  {
    id: "1220",
    title: "切る",
    slug: "切る-1220",
    jlptLevel: "N3",
    grammarType: "結果",
    tags: ["完成", "补助动词"],
    meaningZh: "彻底……；……完",
    meaningEn: "to finish completely; to do thoroughly",
    structure: "动词ます形去ます + 切る",
    explanationZh:
      "作为补助动词，表示把动作做到最后或程度达到极限。常用于完成、耗尽、彻底改变等语境。",
    explanationEn:
      "As an auxiliary verb, 切る shows doing an action completely or reaching an extreme degree. It is common with completion, exhaustion, or thorough change.",
    usageNoteZh: "常见搭配有「使い切る」「走り切る」「言い切る」「疲れ切る」。",
    usageNoteEn: "Common combinations include 使い切る, 走り切る, 言い切る, and 疲れ切る.",
    exampleJp: "マラソンを最後まで走り切りました。",
    exampleZh: "我把马拉松坚持跑到了最后。",
    exampleEn: "I ran the marathon all the way to the end.",
    commonMistakeZh: "补助动词「切る」不是切东西，而是表示动作完成或程度彻底。",
    commonMistakeEn: "Auxiliary 切る does not mean cutting something; it marks completion or thoroughness.",
    memoryTipZh: "把动作“一刀切到终点”。",
    memoryTipEn: "Cut the action all the way to the finish.",
  },
  {
    id: "1221",
    title: "っけ",
    slug: "っけ-1221",
    jlptLevel: "N3",
    grammarType: "確認",
    tags: ["口语", "确认"],
    meaningZh: "……来着？；是……吗",
    meaningEn: "what was it again; was it...?",
    structure: "普通形 + っけ / 丁寧形 + っけ",
    explanationZh:
      "口语中用于回想自己记不清的事情，或向对方确认过去的信息。",
    explanationEn:
      "A conversational ending used when trying to recall something unclear or confirming previously known information.",
    usageNoteZh: "常用于自言自语或熟人之间，正式场合应换成更礼貌的确认表达。",
    usageNoteEn:
      "Used in self-talk or among familiar people; in formal settings, use a more polite confirmation expression.",
    exampleJp: "会議は何時からでしたっけ。",
    exampleZh: "会议是几点开始来着？",
    exampleEn: "What time did the meeting start again?",
    commonMistakeZh: "它不是新信息提问，而是“我记得但想确认”的语气。",
    commonMistakeEn: "It is not just asking for new information; it suggests the speaker once knew and wants to confirm.",
    memoryTipZh: "忘了一点点时，句尾轻轻加「っけ」。",
    memoryTipEn: "When memory is a bit fuzzy, add っけ at the end.",
  },
  {
    id: "1222",
    title: "込む",
    slug: "込む-1222",
    jlptLevel: "N3",
    grammarType: "結果",
    tags: ["进入", "深入", "补助动词"],
    meaningZh: "进入……；深入地……",
    meaningEn: "into; deeply; thoroughly",
    structure: "动词ます形去ます + 込む",
    explanationZh:
      "作为补助动词，表示进入内部、持续深入，或把动作做到很深的程度。",
    explanationEn:
      "As an auxiliary verb, 込む indicates moving into something, continuing deeply, or doing an action to a deep degree.",
    usageNoteZh: "常见搭配有「申し込む」「考え込む」「話し込む」「冷え込む」。",
    usageNoteEn: "Common combinations include 申し込む, 考え込む, 話し込む, and 冷え込む.",
    exampleJp: "彼は答えが出るまで一人で考え込みました。",
    exampleZh: "他一个人陷入沉思，直到想出答案。",
    exampleEn: "He thought deeply by himself until he found an answer.",
    commonMistakeZh: "不是所有动词都能自然接「込む」，要按常见搭配记。",
    commonMistakeEn: "Not every verb naturally attaches to 込む; learn it through common combinations.",
    memoryTipZh: "「込む」有往里面钻、钻得很深的感觉。",
    memoryTipEn: "込む feels like going inside or going deeply into something.",
  },
  {
    id: "1223",
    title: "こそ",
    slug: "こそ-1223",
    jlptLevel: "N3",
    grammarType: "強調",
    tags: ["强调", "提示"],
    meaningZh: "正是……；才是……",
    meaningEn: "exactly; precisely; it is...that",
    structure: "名词/助词 + こそ",
    explanationZh:
      "强调前面的词，表示“正是这个，而不是别的”。常用于表达感谢、决心、对比或强调原因。",
    explanationEn:
      "Emphasizes the preceding word, meaning 'this exactly, not something else.' It is often used for thanks, resolve, contrast, or emphasizing a reason.",
    usageNoteZh: "常见表达有「こちらこそ」「今度こそ」「だからこそ」。",
    usageNoteEn: "Common expressions include こちらこそ, 今度こそ, and だからこそ.",
    exampleJp: "失敗したからこそ、次はもっと慎重に進めたい。",
    exampleZh: "正因为失败过，所以下次更想谨慎推进。",
    exampleEn: "Precisely because I failed, I want to proceed more carefully next time.",
    commonMistakeZh: "「こそ」是强调，不是普通主题标记；前项会被突出出来。",
    commonMistakeEn: "こそ is emphasis, not an ordinary topic marker; it highlights what comes before it.",
    memoryTipZh: "「こそ」把前面的词打上聚光灯。",
    memoryTipEn: "こそ puts a spotlight on the preceding word.",
  },
  {
    id: "1224",
    title: "ことになっている",
    slug: "ことになっている-1224",
    jlptLevel: "N3",
    grammarType: "規則",
    tags: ["规定", "安排"],
    meaningZh: "规定为……；安排为……",
    meaningEn: "it is arranged that; it is a rule that",
    structure: "动词辞书形/ない形 + ことになっている",
    explanationZh:
      "表示已经由规则、约定、制度或安排决定好的事情，不强调个人临时决定。",
    explanationEn:
      "Shows something that has been decided by a rule, agreement, system, or arrangement, rather than a personal temporary decision.",
    usageNoteZh: "常用于学校、公司、预约、制度、合同等场景。",
    usageNoteEn: "Common in schools, companies, reservations, systems, contracts, and similar contexts.",
    exampleJp: "この寮では、夜十時以降は静かにすることになっています。",
    exampleZh: "这个宿舍规定晚上十点以后要保持安静。",
    exampleEn: "In this dorm, residents are expected to be quiet after 10 p.m.",
    commonMistakeZh: "个人刚做出的决定用「ことにする」，已经形成规则或安排用「ことになっている」。",
    commonMistakeEn:
      "Use ことにする for a personal decision just made; use ことになっている for an established rule or arrangement.",
    memoryTipZh: "「なっている」表示规则已经成形并持续有效。",
    memoryTipEn: "なっている shows that the rule has been established and remains in effect.",
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

for (const item of newEntries) {
  item.sourceRoute = "综合";
  item.furigana = "";
  item.similarGrammar = [];
  item.quizQuestion = "";
  item.quizChoices = [];
  item.quizAnswer = "";
  item.quizExplanation = "";
  item.explanationEn = item.explanationEn;
  item.usageNoteEn = item.usageNoteEn;
  item.commonMistakeEn = item.commonMistakeEn;
  item.memoryTipEn = item.memoryTipEn;
  applyLegacyFields(item);
}

const deleted = new Set(Object.keys(deleteRedirects));
for (const [from, to] of Object.entries(deleteRedirects)) redirects[from] = to;
for (const [from, to] of Object.entries(redirects)) {
  if (deleteRedirects[to]) redirects[from] = deleteRedirects[to];
}

const newIds = new Set(newEntries.map((item) => item.id));
const nextGrammar = grammar.filter((item) => !deleted.has(item.id) && !newIds.has(item.id));
for (const item of newEntries) {
  nextGrammar.push(item);
}

nextGrammar.sort((a, b) => Number(a.id) - Number(b.id));

fs.writeFileSync(grammarPath, JSON.stringify(nextGrammar, null, 2) + "\n");
fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2) + "\n");
