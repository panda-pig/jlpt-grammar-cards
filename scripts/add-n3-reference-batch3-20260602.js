const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const rows = [
  ["1299", "さて", "さて-1299", "転換", ["话题转换", "开始"], "那么；接下来", "well then; now", "さて + 句子", "用于转换话题、开始新的说明或进入正题。", "Used to shift topics, begin a new explanation, or move into the main point.", "常用于演讲、文章、会议和说明中，语气比突然换话题更自然。", "Common in speeches, writing, meetings, and explanations; it makes a topic shift sound natural.", "さて、次に試験当日の持ち物について説明します。", "那么，接下来说明考试当天需要携带的物品。", "Now, I will explain what to bring on the day of the exam.", "不要把它当作普通的「そして」；它有整理话题、重新开始的感觉。", "Do not treat it as a simple そして; it feels like organizing or restarting the topic.", "说完一段，整理一下进入下一段。", "Finish one section, then reset and move to the next."],
  ["1300", "せいぜい", "せいぜい-1300", "限度", ["顶多", "最多"], "最多；顶多；尽量", "at most; at best; as much as possible", "せいぜい + 数量 / 句子", "表示数量、程度或能力的上限不高，也可表示尽量做到某事。", "Shows that the upper limit of an amount, degree, or ability is not high; it can also mean doing one's best.", "表示上限时常带“也不过如此”的语气；表示努力时常见「せいぜい頑張る」。", "When marking an upper limit, it often sounds like 'only that much'; for effort, せいぜい頑張る is common.", "この会議に参加できる人は、せいぜい十人くらいだと思う。", "我觉得能参加这次会议的人最多也就十人左右。", "I think at most about ten people can attend this meeting.", "不要和「ぜひ」混淆；「せいぜい」常表示有限的上限。", "Do not confuse it with ぜひ; せいぜい often marks a limited upper bound.", "天花板不高，最多也就到那里。", "The ceiling is low; at most it reaches that point."],
  ["1301", "しばらく", "しばらく-1301", "時", ["一段时间", "暂时"], "一会儿；一段时间；暂时", "for a while; for some time", "しばらく + 句子", "表示持续一段不太短的时间，具体长短取决于语境。", "Indicates that something continues for a while; the exact length depends on context.", "可用于过去、现在和未来，也常用于寒暄「しばらくですね」。", "Can be used for past, present, and future situations, and appears in greetings like しばらくですね.", "新しい仕事に慣れるまで、しばらく時間がかかりそうだ。", "适应新工作看来需要一段时间。", "It looks like it will take some time to get used to the new job.", "不要机械翻译成固定长度；它只表示“一段时间”。", "Do not translate it as a fixed length; it simply means 'for a while.'", "时间长度像一段留白，不精确但不短。", "Think of an unspecified but noticeable stretch of time."],
  ["1302", "確かに", "確かに-1302", "判断", ["确实", "承认"], "确实；的确", "certainly; indeed", "確かに + 句子", "表示承认某事真实或有道理，后面也常接转折说明。", "Acknowledges that something is true or reasonable, often before adding a contrasting point.", "常见形式是「確かにAが、B」。", "A common pattern is 確かに A が, B.", "確かにこの方法は便利だが、費用が少し高い。", "这个方法确实方便，但费用有点高。", "This method is certainly convenient, but it is a little expensive.", "不要只用来表示强烈肯定；它常用于先承认再补充不同意见。", "Do not use it only for strong agreement; it often acknowledges first, then adds another view.", "先点头承认，再继续说明。", "First nod in agreement, then continue explaining."],
  ["1303", "たとえ～ても", "たとえ-ても-1303", "条件", ["让步", "即使"], "即使……也……", "even if; no matter if", "たとえ + 普通形 + ても / でも", "表示即使前项情况成立，后项也不会改变。", "Shows that even if the first condition is true, the result in the second clause will not change.", "后项常表达决心、判断或不变的结果。", "The following clause often expresses determination, judgment, or an unchanged result.", "たとえ時間がかかっても、この研究を最後まで続けたい。", "即使花时间，我也想把这项研究坚持到最后。", "Even if it takes time, I want to continue this research to the end.", "不要漏掉后面的「ても／でも」；只有「たとえ」句子不完整。", "Do not omit ても or でも; たとえ alone does not complete the pattern.", "先假设最困难的情况，再说结果不变。", "Imagine the difficult condition first, then say the result stays the same."],
  ["1304", "例えば", "例えば-1304", "例示", ["例如", "举例"], "例如；比如", "for example; for instance", "例えば + 名词 / 句子", "用于举出具体例子，让前面的说明更容易理解。", "Introduces a concrete example to make the previous explanation easier to understand.", "多用于说明、建议、解释和列举。", "Often used in explanations, suggestions, and lists.", "毎日少しでも日本語に触れよう。例えば、ニュースの見出しを読むだけでもいい。", "每天哪怕一点也要接触日语。比如，只读新闻标题也可以。", "Try to touch Japanese a little every day. For example, even reading news headlines is fine.", "例子应服务于前面的说明，不要突然列出无关内容。", "The example should support the previous explanation; do not introduce unrelated content.", "抽象说明后拿出一个具体样本。", "After an abstract explanation, show one concrete sample."],
  ["1305", "たって", "たって-1305", "条件", ["即使", "口语"], "即使……也；就算……也", "even if; even though", "动词た形 / い形容词くたって / 名词・な形容词だって", "是「ても／でも」的口语形式，表示让步条件。", "A conversational form of ても / でも that expresses concession.", "常用于口语，语气比书面表达更随意。", "Common in speech and more casual than written forms.", "今から急いだって、電車には間に合わないだろう。", "就算现在开始赶，恐怕也赶不上电车了吧。", "Even if we hurry now, we probably will not make the train.", "不要在正式文章中过度使用；正式场合用「ても／でも」更稳妥。", "Avoid overusing it in formal writing; ても / でも is safer in formal contexts.", "口语里把「ても」说得更随意。", "A more casual spoken version of ても."],
  ["1306", "てしょうがない / てしかたがない", "てしょうがない-てしかたがない-1306", "感情", ["非常", "无法忍受"], "非常……；……得不得了", "extremely; cannot help but", "动词て形 / い形容词くて / な形容词で + しょうがない / しかたがない", "表示感情、感觉或状态强烈到无法控制。", "Shows that a feeling, sensation, or state is so strong that it cannot be controlled.", "常用于困、饿、担心、想念、开心等自然产生的感受。", "Common with natural feelings such as sleepiness, hunger, worry, longing, or happiness.", "試験の結果が気になってしょうがない。", "我非常在意考试结果，怎么也放不下。", "I cannot stop worrying about the exam results.", "不要用于说话人主动控制的普通动作；重点是自然涌出的强烈感觉。", "Do not use it for ordinary actions under the speaker's control; it focuses on strong feelings that arise naturally.", "感觉太强，自己也没办法。", "The feeling is so strong that there is nothing you can do."],
  ["1307", "てはいけないから", "てはいけないから-1307", "理由", ["为了避免", "不可以"], "因为不能……；为了避免……", "because one must not; so that it does not", "动词て形 + はいけないから", "表示为了避免出现不好的结果或违反规则，所以采取某种行动。", "Shows taking an action because something must not happen or because a rule must not be broken.", "后项常是提醒、预防措施或提前准备。", "The following clause is often a warning, preventive measure, or preparation.", "資料をなくしてはいけないから、コピーを取っておきました。", "因为不能弄丢资料，所以我提前复印了一份。", "I made a copy in advance because I must not lose the materials.", "不要和单纯禁止「てはいけない」混同；这里后面有「から」说明理由。", "Do not confuse it with the simple prohibition てはいけない; から adds the reason.", "不可以发生，所以先防住。", "It must not happen, so you prevent it first."],
  ["1308", "的", "的-1308", "接尾辞", ["性质", "风格"], "……性的；……方面的", "-like; -al; -ic", "名词 + 的 / 名词 + 的な + 名词 / 名词 + 的に + 动词・形容词", "接在名词后，表示具有某种性质、风格或倾向。", "Attaches to a noun to show a certain quality, style, or tendency.", "「的な」修饰名词，「的に」修饰动词或形容词。", "的な modifies nouns, while 的に modifies verbs or adjectives.", "この問題は、社会的な視点から考える必要がある。", "这个问题需要从社会性的角度来思考。", "This issue needs to be considered from a social perspective.", "不要把所有中文“的”都翻成「的」；日语中它只接特定汉语名词较自然。", "Do not translate every Chinese 的 as Japanese 的; it is natural only with certain Sino-Japanese nouns.", "给名词加上一种性质标签。", "Add a quality label to a noun."],
  ["1309", "ても始まらない", "ても始まらない-1309", "無意味", ["也没用", "无济于事"], "即使……也没用；……也无济于事", "there is no point in; it will not help to", "动词て形 + も始まらない", "表示即使做前项也不能解决问题，因此没有意义。", "Shows that even doing the first action will not solve the problem, so it is pointless.", "常用于劝人停止抱怨、后悔或空想，转向实际行动。", "Often used to tell someone to stop complaining, regretting, or daydreaming and move to action.", "今さら文句を言っても始まらない。まず解決策を考えよう。", "事到如今抱怨也没用。先想解决办法吧。", "There is no point complaining now. Let's think of a solution first.", "不是“不能开始”的字面意思，而是“这样做没有意义”。", "It does not literally mean 'cannot start'; it means the action is pointless.", "这样做启动不了解决过程。", "Doing that will not start the solution."],
  ["1310", "てもしょうがない / てもしかたがない", "てもしょうがない-てもしかたがない-1310", "無意味", ["也没办法", "无济于事"], "即使……也没办法；……也无济于事", "it cannot be helped even if; no use doing", "动词て形 / い形容词くて / な形容词で + もしょうがない / もしかたがない", "表示即使出现前项或做前项，也无法改变结果或解决问题。", "Shows that even if the first thing happens or is done, it cannot change the result or solve the problem.", "常用于接受现实、劝人不要继续纠结。", "Often used to accept reality or advise someone not to keep dwelling on something.", "過ぎたことを後悔してもしょうがない。次に気をつけよう。", "后悔已经过去的事也没办法。下次注意吧。", "There is no use regretting what has passed. Let's be careful next time.", "不要和「てしょうがない」混淆；有「も」时常表示“即使也没用”。", "Do not confuse it with てしょうがない; with も, it often means 'even if, it is no use.'", "即使做了，也改变不了局面。", "Even doing it will not change the situation."],
  ["1311", "と言えば", "と言えば-1311", "話題", ["说到", "提起"], "说到……；提起……", "speaking of; when it comes to", "名词 / 普通形 + と言えば", "用前项引出相关话题、联想或代表性例子。", "Uses the first item to introduce a related topic, association, or representative example.", "常用于会话中自然转换到相关话题。", "Often used in conversation to shift naturally to a related topic.", "京都と言えば、古い寺や美しい庭を思い浮かべる人が多い。", "说到京都，很多人会想到古老的寺庙和美丽的庭院。", "Speaking of Kyoto, many people think of old temples and beautiful gardens.", "不要和引用内容的「と言う」混淆；这里重点是提起话题。", "Do not confuse it with quotation と言う; here the focus is introducing a topic.", "听到一个词，脑中接出相关话题。", "Hear one word and connect it to a related topic."],
  ["1312", "といい / たらいい", "といい-たらいい-1312", "希望・助言", ["希望", "建议"], "要是……就好了；……比较好", "it would be good if; should", "动词辞书形 / ない形 + といい / 动词た形 + らいい", "表示愿望、建议或期待某事发生。", "Expresses a wish, suggestion, or hope that something will happen.", "「といい」偏愿望和建议，「たらいい」也常用于给对方建议。", "といい tends toward wishes and suggestions; たらいい is also common for giving advice.", "分からないことがあったら、先生に聞いたらいいよ。", "有不懂的地方，问老师就好。", "If there is something you do not understand, you should ask the teacher.", "给上级建议时要注意语气，可用更礼貌的「いかがでしょうか」。", "When advising a superior, be careful with tone; いかがでしょうか may be more polite.", "把理想结果轻轻提出来。", "Gently present the desirable action or result."],
  ["1313", "といっても", "といっても-1313", "補足", ["虽说", "补充限制"], "虽说……但其实……；即使说是……", "although I say; even though it is called", "普通形 + といっても", "用于对前面的说法补充限制，说明实际程度没有听起来那么大或那么强。", "Adds a limitation to the previous statement, showing the actual degree is not as large or strong as it may sound.", "常用于避免对方误解前面的表达。", "Often used to prevent misunderstanding of the previous expression.", "海外旅行といっても、今回は三日間だけの短い旅行です。", "虽说是海外旅行，但这次只是三天的短途旅行。", "Although I say it is an overseas trip, this time it is only a short three-day trip.", "不要当普通转折「でも」使用；它一定是在修正前面的说法。", "Do not use it as a generic でも; it specifically revises what was just said.", "先说一个词，再把期待值调低。", "Say one expression first, then lower the expected scale."],
  ["1314", "ということだ", "ということだ-1314", "伝聞・結論", ["据说", "也就是说"], "据说……；也就是说……",
    "I heard that; it means that", "普通形 + ということだ", "可表示传闻，也可表示根据前文得出的结论或解释。", "Can report hearsay, or state a conclusion or explanation drawn from the previous context.", "表示传闻时常来自通知、报道、说明；表示结论时可译为“也就是说”。", "In hearsay use, the source is often a notice, report, or explanation; in conclusion use, it means 'that means.'", "掲示によると、明日の説明会はオンラインで行われるということだ。", "根据公告，明天的说明会据说会在线上举行。", "According to the notice, tomorrow's information session will be held online.", "要根据上下文判断是传闻还是结论，不要固定翻译。", "Judge from context whether it is hearsay or conclusion; do not translate it mechanically.", "别人说出的内容，或前文推出的结论。", "Either what someone says, or the conclusion drawn from earlier information."],
  ["1315", "というのは", "というのは-1315", "説明", ["所谓", "原因解释"], "所谓……；之所以……是因为", "what is called; the reason is", "名词 / 普通形 + というのは", "用于解释某个词、概念、现象或前面说法的理由。", "Explains a word, concept, phenomenon, or the reason behind the previous statement.", "后面常接定义、说明或「からだ」等原因表达。", "Often followed by a definition, explanation, or reason expression such as からだ.", "敬語というのは、相手との関係を考えて言葉を選ぶ表現だ。", "所谓敬语，就是考虑与对方关系来选择语言的表达方式。", "Keigo is a form of expression where you choose words based on your relationship with the other person.", "不要和单纯引用混淆；它通常是在展开解释。", "Do not confuse it with simple quotation; it usually introduces an explanation.", "拿出一个词，然后解释它的意思或理由。", "Take a term and explain its meaning or reason."],
  ["1316", "と言うと", "というと-1316", "確認・連想", ["说起", "你的意思是"], "说起……；你的意思是……", "when you say; speaking of", "名词 / 普通形 + と言うと", "用于从某个词引出联想，也可用于确认对方话语的意思。", "Introduces an association from a word, or checks what the other person means.", "会话中常用于追问、确认或自然接话。", "Common in conversation for asking follow-up questions, confirming, or continuing naturally.", "来週のイベントと言うと、駅前で行われる音楽祭のことですか。", "你说下周的活动，是指在车站前举行的音乐节吗？", "When you say next week's event, do you mean the music festival held in front of the station?", "和「と言えば」相近，但「と言うと」更常带确认对方意思的语气。", "It is close to と言えば, but と言うと more often checks what the other person means.", "听到对方的话，先确认指的是什么。", "Hear the other person's words and first confirm what they mean."],
  ["1317", "というより", "というより-1317", "訂正", ["与其说", "更准确说"], "与其说……不如说……", "rather than; more than saying", "A + というより + B", "用于修正前面的说法，表示后项比前项更准确。", "Corrects the first expression and shows that the second is more accurate.", "常用于表达细微评价差异。", "Often used to express a subtle difference in evaluation.", "彼は冷たいというより、感情を表に出すのが苦手なのだと思う。", "与其说他冷淡，不如说他不擅长把感情表现出来。", "Rather than saying he is cold, I think he is just not good at showing his feelings.", "不要只当普通比较；它是在替换更准确的说法。", "Do not treat it as ordinary comparison; it replaces the first wording with a more accurate one.", "把不够准确的标签换成更准确的标签。", "Replace an imprecise label with a more accurate one."],
  ["1318", "とみえる / とみえて", "とみえる-とみえて-1318", "推量", ["看来", "似乎"], "看来……；似乎……", "it seems that; apparently", "普通形 + とみえる / とみえて", "根据眼前状况或结果进行推测，表示“看起来是这样”。", "Infers from visible circumstances or results that something seems to be the case.", "后项常说明由此产生的状态或结果。", "The following clause often describes the resulting state or observation.", "店の前に行列ができている。新しいケーキが人気だとみえる。", "店前排起了队。看来新出的蛋糕很受欢迎。", "There is a line in front of the shop. Apparently the new cake is popular.", "不要用于没有任何根据的主观猜测；它需要可观察的线索。", "Do not use it for guesses with no basis; it needs observable clues.", "看到线索后推断“看来如此”。", "See clues, then infer 'apparently so.'"],
];

function entry([
  id, title, slug, grammarType, tags, meaningZh, meaningEn, structure,
  explanationZh, explanationEn, usageNoteZh, usageNoteEn, exampleJp,
  exampleZh, exampleEn, commonMistakeZh, commonMistakeEn, memoryTipZh, memoryTipEn,
]) {
  return {
    id,
    title,
    slug,
    jlptLevel: "N3",
    grammarType,
    tags,
    meaningZh,
    meaningEn,
    structure,
    explanationZh,
    explanationEn,
    usageNoteZh,
    usageNoteEn,
    exampleJp,
    exampleZh,
    exampleEn,
    commonMistakeZh,
    commonMistakeEn,
    memoryTipZh,
    memoryTipEn,
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
