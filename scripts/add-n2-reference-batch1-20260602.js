const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const rows = [
  ["1341", "中を / 中では", "中を-中では-1341", "状況", ["在...之中", "状况"], "在……之中；在……情况下", "in the midst of; under such circumstances", "名词 + の + 中を / 名词 + の + 中では", "表示在某种持续的环境、状况或范围之中进行后项。", "Shows that the following action happens in the midst of an ongoing environment, situation, or range.", "常用于天气、人群、困难状况等背景说明。", "Common for background situations such as weather, crowds, or difficult conditions.", "大雨の中を、ボランティアたちは避難所へ物資を運んだ。", "志愿者们冒着大雨把物资运到了避难所。", "In the heavy rain, the volunteers carried supplies to the evacuation shelter.", "不要和普通地点「で」完全等同；它更强调包围着行动的状况。", "Do not treat it as identical to location で; it emphasizes the surrounding situation.", "行动穿过某种状况的中间。", "The action moves through the middle of a situation."],
  ["1342", "にしても～にしても", "にしても-にしても-1342", "並列", ["无论", "列举"], "无论……还是……都", "whether...or; both...and", "名词 / 普通形 + にしても + 名词 / 普通形 + にしても", "列举两个同类例子，表示无论哪一种情况后项都成立。", "Lists two examples of the same type and shows that the following statement applies in either case.", "常用于列举不同选择、立场或情况后得出共同判断。", "Common when listing different choices, positions, or situations and making a shared judgment.", "進学するにしても就職するにしても、早めに準備を始めるべきだ。", "无论升学还是就业，都应该尽早开始准备。", "Whether you continue school or start working, you should begin preparing early.", "不要只列一个项目；这个句型需要两个并列例子。", "Do not list only one item; this pattern needs two parallel examples.", "两个例子都放上来，结论一样。", "Put up two examples; the conclusion is the same."],
  ["1343", "に沿って", "に沿って-1343", "基準", ["沿着", "按照"], "沿着……；按照……", "along; in accordance with", "名词 + に沿って / 名词 + に沿った + 名词", "表示沿着路线、方针、计划、规则或希望进行。", "Shows moving along a route or proceeding according to a policy, plan, rule, or wish.", "既可表示物理路线，也可表示抽象方针。", "Can refer to a physical route or an abstract policy.", "会社の方針に沿って、新しい研修制度を作った。", "按照公司的方针，制定了新的培训制度。", "We created a new training system in accordance with company policy.", "不要和「について」混用；「に沿って」强调按某个方向或标准推进。", "Do not mix it up with について; に沿って emphasizes proceeding along a direction or standard.", "贴着一条线往前走。", "Move forward while following a line."],
  ["1344", "に相違ない", "に相違ない-1344", "確信", ["一定", "确信"], "一定……；肯定……", "there is no doubt that; must be", "普通形 + に相違ない / 名词 + に相違ない", "表示说话人根据情况强烈确信某判断正确，语气正式。", "Shows the speaker is strongly convinced that a judgment is correct based on circumstances. It is formal.", "多用于书面、报告、评论等正式表达。", "Mostly used in formal writing, reports, and commentary.", "この技術は、今後の医療に大きな影響を与えるに相違ない。", "这项技术一定会对今后的医疗产生重大影响。", "This technology will undoubtedly have a major impact on future medicine.", "不要用于随意口语；日常会话中「に違いない」更常见。", "Avoid using it in casual speech; に違いない is more common in everyday conversation.", "判断没有偏差，确信如此。", "The judgment has no deviation; you are convinced."],
  ["1345", "に過ぎない", "に過ぎない-1345", "限定", ["只不过", "仅仅"], "只不过……；仅仅是……", "nothing more than; merely", "名词 / 普通形 + に過ぎない", "表示前项程度、数量或价值有限，不超过那个范围。", "Shows that the degree, amount, or value is limited and does not go beyond the stated range.", "常用于降低评价、强调只是其中一部分或最低程度。", "Often used to downplay an evaluation or emphasize that something is only a part or minimum degree.", "これは私個人の意見に過ぎないので、参考程度にしてください。", "这只不过是我个人的意见，请仅作参考。", "This is nothing more than my personal opinion, so please treat it only as a reference.", "不要和「だけ」完全等同；「に過ぎない」更正式，也常带降低评价的语气。", "Do not treat it as identical to だけ; に過ぎない is more formal and often downplays the value.", "范围只到这里，没有更多。", "The range stops here; there is nothing more."],
  ["1346", "につけ", "につけ-1346", "契機", ["每当", "无论"], "每当……；无论……都", "whenever; whether", "动词辞书形 / 名词 + につけ", "表示每当遇到前项就产生后项感受，也可用 AにつけBにつけ 表示无论哪种情况。", "Shows that whenever the first situation occurs, the following feeling arises; AにつけBにつけ means whether A or B.", "常用于情感、回忆、感慨。", "Often used for emotions, memories, and reflections.", "この写真を見るにつけ、留学していたころを思い出す。", "每当看到这张照片，就会想起留学时的日子。", "Whenever I see this photo, I remember my time studying abroad.", "不要用于普通频率动作；它常带情绪或感慨。", "Do not use it for ordinary repeated actions; it often carries emotion or reflection.", "看到一个触发点，感情就被带出来。", "A trigger appears, and the feeling comes out."],
  ["1347", "につき", "につき-1347", "理由・単位", ["由于", "每"], "由于……；每……", "due to; per", "名词 + につき", "可表示正式通知中的原因，也可表示每个单位对应的数量。", "Can indicate a reason in formal notices, or an amount per unit.", "原因用法常见于公告；单位用法常见于价格、人数、数量说明。", "Reason use appears in notices; per-unit use appears with prices, people, and quantities.", "工事中につき、この入口はご利用いただけません。", "由于施工中，此入口无法使用。", "Due to construction, this entrance is not available.", "原因用法偏正式公告，不适合随意会话中过度使用。", "The reason use is formal and notice-like, so avoid overusing it in casual speech.", "公告牌上常见的正式“因为”。", "A formal 'because' often seen on notices."],
  ["1348", "にも関わらず", "にも関わらず-1348", "逆接", ["尽管", "虽然"], "尽管……却……", "despite; although", "名词 / 普通形 + にも関わらず", "表示前项事实存在，但后项出现与预想相反的结果。", "Shows that although the first fact exists, the following result is contrary to expectation.", "语气正式，常用于书面、新闻、报告。", "Formal and common in writing, news, and reports.", "悪天候にも関わらず、多くの人がイベントに参加した。", "尽管天气恶劣，仍有很多人参加了活动。", "Despite the bad weather, many people attended the event.", "不要和原因表达混淆；它强调逆接和意外结果。", "Do not confuse it with causal expressions; it emphasizes contrast and unexpected results.", "明明有前项障碍，后项还是发生。", "Even with the first obstacle, the second still happens."],
  ["1349", "にて", "にて-1349", "場所・手段", ["在", "用"], "在……；以……；用……", "at; by; with", "名词 + にて", "表示地点、时间、手段或方式，语气比「で」正式。", "Marks place, time, means, or method, and is more formal than で.", "常见于通知、公告、商务邮件、正式说明。", "Common in notices, announcements, business emails, and formal explanations.", "説明会は午後二時より大会議室にて行います。", "说明会将于下午两点在大会议室举行。", "The information session will be held in the large conference room from 2 p.m.", "日常会话中多用「で」；「にて」偏正式。", "In everyday conversation, で is more common; にて is formal.", "正式公告里的「で」。", "A formal-notice version of で."],
  ["1350", "のももっともだ", "のももっともだ-1350", "納得", ["也难怪", "理所当然"], "……也是理所当然的；难怪……", "it is natural that; no wonder", "普通形 + のももっともだ", "表示说话人理解并认可前项行为、感受或判断是合理的。", "Shows that the speaker understands and accepts the first action, feeling, or judgment as reasonable.", "常用于说明某人的反应有其原因。", "Often explains that someone's reaction has a good reason.", "あれだけ準備したのだから、彼が自信を持っているのももっともだ。", "他准备了那么多，所以有自信也是理所当然的。", "Since he prepared that much, it is natural that he is confident.", "不要用于说话人不认可的行为；它表示理解其合理性。", "Do not use it for behavior the speaker does not find reasonable; it expresses understanding.", "理由充分，所以那样反应很自然。", "The reason is strong, so the reaction is natural."],
  ["1351", "の下で", "の下で-1351", "条件", ["在...下", "在...指导下"], "在……之下；在……条件下", "under; under the guidance of", "名词 + の下で", "表示在某种条件、环境、制度、影响或指导之下进行后项。", "Shows that the following action happens under certain conditions, environment, system, influence, or guidance.", "常用于制度、环境、领导、指导、规则。", "Common with systems, environments, leadership, guidance, and rules.", "厳しい安全基準の下で、新しい薬の試験が行われている。", "新药试验正在严格的安全标准下进行。", "The new drug is being tested under strict safety standards.", "不要只理解为空间位置；它多表示抽象条件或影响。", "Do not read it only as physical location; it often indicates abstract conditions or influence.", "上方有规则、环境或指导覆盖着。", "Rules, environment, or guidance covers the action from above."],
  ["1352", "の上では", "の上では-1352", "範囲", ["在...方面", "从...上看"], "在……方面；从……来看", "in terms of; from the standpoint of", "名词 + の上では", "表示从某个方面、范围或资料来看，后项成立。", "Shows that from a certain aspect, scope, or source, the following statement holds.", "常用于法律、数据、理论、生活等抽象领域。", "Common with abstract fields such as law, data, theory, and daily life.", "データの上では、今年の利用者数は去年より増えている。", "从数据上看，今年的使用人数比去年增加了。", "In terms of the data, the number of users has increased compared with last year.", "不要和顺序用法「上で」混淆；这里表示判断范围。", "Do not confuse it with sequence 上で; this pattern marks the scope of judgment.", "限定一个观察角度。", "Limit the viewing angle."],
  ["1353", "のみ", "のみ-1353", "限定", ["仅", "只"], "仅；只", "only; solely", "名词 / 普通形 + のみ", "表示限定范围，相当于较正式的「だけ」。", "Limits the scope and is a more formal equivalent of だけ.", "常用于通知、规则、说明、书面语。", "Common in notices, rules, explanations, and written language.", "このチケットは本日のみ有効です。", "这张票仅限今天有效。", "This ticket is valid today only.", "日常会话中过度使用会显得生硬；普通场合用「だけ」更自然。", "Overusing it in casual speech sounds stiff; だけ is more natural in ordinary contexts.", "正式地把范围缩到一个点。", "Formally narrow the range down to one point."],
  ["1354", "のみならず", "のみならず-1354", "追加", ["不仅", "而且"], "不仅……而且……", "not only; furthermore", "名词 / 普通形 + のみならず", "表示不仅前项成立，后项也成立，语气正式。", "Shows that not only the first item but also the following item is true. It is formal.", "常用于书面表达，后项常有更进一步的内容。", "Common in writing; the following clause often goes further.", "この制度は学生のみならず、社会人にも利用されている。", "这个制度不仅被学生使用，也被社会人士使用。", "This system is used not only by students but also by working adults.", "不要和随意口语的「だけじゃなく」混用场合；它偏正式。", "Do not use it in the same casual contexts as だけじゃなく; it is formal.", "不只一个范围，还扩到另一个范围。", "Not just one range; it expands to another."],
  ["1355", "ぬ", "ぬ-1355", "否定", ["不", "书面否定"], "不……；没有……", "not; without", "动词ない形去ない + ぬ / する → せぬ", "是较书面、古风的否定形式，相当于「ない」。", "A written or old-fashioned negative form equivalent to ない.", "常见于固定表达、书面语、标题、格言，如「知らぬ」「思わぬ」。", "Common in fixed expressions, written language, titles, and sayings, such as 知らぬ and 思わぬ.", "思わぬところで、昔の先生に再会した。", "在意想不到的地方，和以前的老师重逢了。", "I unexpectedly met my former teacher again in an unexpected place.", "不要在普通口语里随便替代「ない」；会显得古风或书面。", "Do not casually replace ない with it in ordinary speech; it sounds old-fashioned or written.", "现代日语里的书面否定影子。", "A written-style shadow of negative ない."],
];

function entry([
  id, title, slug, grammarType, tags, meaningZh, meaningEn, structure,
  explanationZh, explanationEn, usageNoteZh, usageNoteEn, exampleJp,
  exampleZh, exampleEn, commonMistakeZh, commonMistakeEn, memoryTipZh, memoryTipEn,
]) {
  return {
    id, title, slug, jlptLevel: "N2", grammarType, tags, meaningZh, meaningEn, structure,
    explanationZh, explanationEn, usageNoteZh, usageNoteEn, exampleJp, exampleZh, exampleEn,
    commonMistakeZh, commonMistakeEn, memoryTipZh, memoryTipEn,
    sourceRoute: "综合",
    furigana: "",
    similarGrammar: [],
    quizQuestion: "",
    quizChoices: [],
    quizAnswer: "",
    quizExplanation: "",
    meaningCn: meaningZh,
    explanation: explanationZh,
    usageNote: usageNoteZh,
    exampleCn: exampleZh,
    commonMistake: commonMistakeZh,
    memoryTip: memoryTipZh,
  };
}

const newEntries = rows.map(entry);
const newIds = new Set(newEntries.map((item) => item.id));
const nextGrammar = grammar.filter((item) => !newIds.has(String(item.id)));
nextGrammar.push(...newEntries);
nextGrammar.sort((a, b) => Number(a.id) - Number(b.id));

fs.writeFileSync(grammarPath, JSON.stringify(nextGrammar, null, 2) + "\n");
