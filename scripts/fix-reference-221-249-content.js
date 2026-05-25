const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const updates = {
  "221": ["在……之中，A最……", "A is the most...among...", "名词の中で + Aが一番 + 形容词", "在一个明确范围内比较时，用这个句型指出程度最高的对象。", "Use this pattern to identify the top item within a clear comparison group.", "比较范围放在「の中で」前，最高的一项用「が」标出。", "Put the comparison group before の中で and mark the top item with が.", "果物の中で、いちごが一番好きです。", "水果中我最喜欢草莓。", "Among fruits, I like strawberries the most.", "不要漏掉比较范围，否则“一番”的范围可能不清楚。", "Do not omit the comparison group if the scope is not clear."],
  "222": ["请给我……", "please give me...", "名词をください", "「をください」用于点餐、购物或请求对方给自己某物。", "をください is used when ordering, shopping, or asking someone to give you an item.", "语气直接但礼貌；更委婉时可说「をお願いします」。", "It is direct but polite; をお願いします is softer.", "水をください。", "请给我水。", "Water, please.", "不要用于请求动作；请求动作要用「てください」。", "Do not use it to request actions; use てください for actions."],
  "223": ["但是；然而", "however; but", "しかし + 句子", "「しかし」连接前后相反或对比的内容，语气比「でも」更书面。", "しかし connects contrasting content and is more written/formal than でも.", "常用于说明文、报告或较正式发言。", "It is common in explanations, reports, and formal speech.", "この店は高いです。しかし、とてもおいしいです。", "这家店很贵。但是非常好吃。", "This restaurant is expensive. However, it is very good.", "日常闲聊中可用「でも」，正式文本中「しかし」更自然。", "でも fits casual speech; しかし fits formal writing."],
  "224": ["曾经做过……", "have done before", "动词た形 + ことがある", "「たことがある」表达过去曾有过某种经历。", "たことがある expresses that one has had an experience before.", "谈人生经历时常和「一度」「前に」等搭配。", "It often appears with 一度 or 前に when talking about experiences.", "富士山に登ったことがあります。", "我爬过富士山。", "I have climbed Mt. Fuji before.", "具体过去时间的普通叙述不用这个句型，直接用过去形即可。", "For a specific past event, a plain past sentence is usually enough."],
  "225": ["做A、B等事情", "do things such as A and B", "动词た形 + り + 动词た形 + りする", "「たり〜たりする」列举代表性动作，不表示完整清单。", "たり〜たりする lists representative actions, not a complete list.", "每个列举动作都用た形加「り」。", "Each listed action takes the た-form plus り.", "休みの日は掃除をしたり、買い物をしたりします。", "休息日会打扫、购物之类。", "On days off, I do things like clean and shop.", "不要只给最后一个动作加「たり」。", "Do not add たり only to the final action."],
  "226": ["可以……", "may; is allowed to", "动词て形 + もいいです", "「てもいいです」表示许可，也可用于询问能不能做某事。", "てもいいです expresses permission and can ask whether an action is allowed.", "询问许可时用「てもいいですか」。", "Use てもいいですか to ask permission.", "ここで写真を撮ってもいいですか。", "可以在这里拍照吗？", "May I take photos here?", "前面必须用て形。", "The verb before it must be in the て-form."],
  "227": ["……的时候", "when; at the time of", "普通形 + とき", "「とき」表示某动作、状态或时期发生时。", "とき means when an action, state, or period occurs.", "名词接「のとき」，な形容词接「なとき」。", "Use のとき after nouns and なとき after na-adjectives.", "子どものとき、よく海で泳ぎました。", "小时候经常在海里游泳。", "When I was a child, I often swam in the sea.", "前面形式不同会影响时间关系，如「行くとき」和「行ったとき」。", "The form before とき affects timing, as in 行くとき vs 行ったとき."],
  "228": ["非常；很", "very", "とても + 形容词", "「とても」加强形容词或状态的程度。", "とても intensifies an adjective or state.", "多用于肯定句；否定句中常见「とても〜ない」表示怎么也不能。", "It is common in affirmative sentences; とても〜ない means cannot possibly.", "この部屋はとても明るいです。", "这个房间非常明亮。", "This room is very bright.", "不要把程度副词放在名词前直接修饰名词。", "Do not place this degree adverb directly before a noun as if it modified the noun itself."],
  "229": ["打算……；计划……", "intend to; plan to", "动词辞书形/ない形 + つもり", "「つもり」表达说话人的计划或打算。", "つもり expresses the speaker's plan or intention.", "否定计划常用「ないつもり」或「つもりはない」，语气不同。", "Negative plans use ないつもり or つもりはない, with different nuance.", "来年、日本へ留学するつもりです。", "明年打算去日本留学。", "I plan to study in Japan next year.", "不要把临时愿望和明确计划混同；「つもり」比「たい」更像计划。", "Do not confuse a wish with a plan; つもり is more plan-like than たい."],
  "230": ["A比B更……", "A is more...than B", "AはBより + 形容词です", "这个句型用「より」标出比较基准，说明A比B更怎样。", "This pattern marks B as the comparison baseline with より and says A is more something.", "A是被说明的一方，Bより是“比B”。", "A is the described item; Bより means than B.", "北海道は東京より寒いです。", "北海道比东京冷。", "Hokkaido is colder than Tokyo.", "不要把「より」放在更高的一方后面。", "Do not put より after the side with the higher degree."],
  "231": ["……怎么样？", "how about...?", "名词 + はどうですか", "「はどうですか」询问对方对某事物、提案或状态的看法。", "はどうですか asks for someone's opinion about a thing, proposal, or condition.", "也可用于提出建议，如推荐地点或时间。", "It can also suggest an option, such as a place or time.", "明日の午後はどうですか。", "明天下午怎么样？", "How about tomorrow afternoon?", "不要和询问方法的「どうやって」混同。", "Do not confuse it with どうやって, which asks how to do something."],
  "232": ["比起……，……更……", "more...than...", "AよりBのほうが + 形容词", "「より〜ほうが」把A作为比较基准，强调B这一方更符合后面的性质。", "より〜ほうが sets A as the baseline and emphasizes that B has more of the following quality.", "「より」和「ほうが」不要标在同一对象上。", "Do not mark the same item with both より and ほうが.", "バスより電車のほうが速いです。", "电车比公交快。", "The train is faster than the bus.", "比较方向弄反会导致意思完全相反。", "Reversing the comparison direction reverses the meaning."],
  "233": ["又……又……；列举理由", "and; listing reasons", "普通形 + し、普通形 + し", "「し」列举多个理由或特点，后面常接结论。", "し lists multiple reasons or features, often followed by a conclusion.", "可以列举两个以上，也可只说一个暗示还有别的理由。", "It can list two or more, or one while implying there are other reasons.", "この店は安いし、おいしいし、よく来ます。", "这家店又便宜又好吃，所以我常来。", "This shop is cheap and tasty, so I come often.", "不要把「し」当成普通的时间顺序连接。", "Do not treat し as an ordinary time-sequence connector."],
  "234": ["因为……；所以……", "because; and as a result", "动词/形容词て形", "原因用法的て形把前项作为轻原因，后项说自然结果。", "The reason use of the て-form gives a light cause and then a natural result.", "后项常是不受意志控制的结果或状态。", "The following clause is often an uncontrollable result or state.", "道が混んでいて、授業に遅れました。", "因为路上堵，所以上课迟到了。", "The road was crowded, so I was late for class.", "明确陈述理由时可用「から」「ので」。", "Use から or ので when stating the reason more explicitly."],
  "235": ["说明；解释原因", "explanatory tone", "普通形 + んです", "「んです」给句子加上解释背景或说明原因的语气。", "んです adds an explanatory tone or gives background/reason.", "名词和な形容词接「なんです」。", "Use なんです after nouns and na-adjectives.", "すみません、電車が遅れたんです。", "不好意思，是电车晚点了。", "Sorry, the train was delayed.", "没有解释语境时不要机械添加。", "Do not add it mechanically without explanatory context."],
  "236": ["于是；因此", "therefore; so then", "そこで + 句子", "「そこで」承接前面的情况，说明因此采取了某个行动。", "そこで takes the previous situation and states the action taken as a result.", "后项通常是人为采取的对策或行动。", "The following clause is usually a deliberate response or action.", "財布を忘れました。そこで、家に戻りました。", "忘了钱包。于是回家了。", "I forgot my wallet. So I went back home.", "自然结果更常用「それで」，对策行动常用「そこで」。", "それで often gives a natural result; そこで often gives a response/action."],
  "237": ["因为……所以……", "because; since", "普通形 + ので", "「ので」柔和地说明理由，后项给出结果、请求或判断。", "ので softly gives a reason, followed by a result, request, or judgment.", "名词和な形容词接「なので」。", "Use なので after nouns and na-adjectives.", "メールがまだ届いていないので、先生に確認しました。", "因为邮件还没到，所以向老师确认了。", "Because the email had not arrived yet, I checked with the teacher.", "な形容词后不要漏掉「な」。", "Do not omit な after na-adjectives."],
  "238": ["为别人做……", "do something for someone", "动词て形 + あげる", "「てあげる」说明自己一方为别人做事，对方受益。", "てあげる says the speaker's side does something for someone else's benefit.", "对上级直接使用要谨慎。", "Use it carefully with superiors because it can sound patronizing.", "妹のかばんを持ってあげました。", "我帮妹妹拿了包。", "I carried my younger sister's bag for her.", "别人帮我时用「てくれる」。", "When someone helps me, use てくれる."],
  "239": ["别人为我方做……", "someone does something for us", "动词て形 + くれる", "「てくれる」说明别人为自己一方做了有益的事。", "てくれる means someone does something beneficial for the speaker's side.", "主语是做动作的人，受益者常是我方。", "The subject is the doer, and the beneficiary is often the speaker's side.", "弟が忘れ物を届けてくれました。", "弟弟帮我送来了忘带的东西。", "My younger brother brought me the item I forgot.", "不要把主语和受益者方向弄反。", "Do not reverse the doer and beneficiary."],
  "240": ["请别人为我方做……", "receive someone's help doing...", "动词て形 + もらう", "「てもらう」从接受帮助的一方来说别人为自己做了某事。", "てもらう speaks from the receiver's side: someone does something for them.", "帮助者常用「に」标记。", "The helper is often marked with に.", "友だちに写真を撮ってもらいました。", "请朋友帮我拍了照片。", "I had a friend take a photo for me.", "主语通常是接受帮助的人。", "The subject is usually the person receiving help."],
  "241": ["能不能请你……", "could you please...", "动词て形 + くれませんか / いただけませんか", "这个句型用于请求对方帮忙，「いただけませんか」更礼貌。", "This pattern asks someone for help; いただけませんか is more polite.", "对朋友可用「てくれませんか」，对上级或陌生人用「ていただけませんか」更稳妥。", "Use てくれませんか with familiar people; ていただけませんか is safer with superiors or strangers.", "この書類を確認していただけませんか。", "能不能请您确认这份文件？", "Could you please check this document?", "请求句不是描述已发生的恩惠，不要和「てくれる」陈述句混同。", "This is a request, not a statement of received help."],
  "242": ["可能形", "potential form", "动词可能形", "可能形表示能够做某事，或某事在条件上可以实现。", "The potential form expresses ability or possibility under conditions.", "一类动词变え段加る；二类动词去る加られる；する变できる。", "Group 1 changes to the e-row + る; group 2 drops る + られる; する becomes できる.", "この店ではカードが使えます。", "这家店可以用银行卡。", "You can use cards at this shop.", "可能形的对象常用「が」，也可见「を」。", "The object often takes が, though を is also seen."],
  "243": ["命令形", "imperative form", "动词命令形", "命令形直接要求对方做某事，语气很强。", "The imperative directly orders someone to do something and sounds very strong.", "常见于号令、标语、男性粗口或紧急情况，日常需谨慎。", "It appears in commands, slogans, rough speech, or emergencies; use carefully in daily life.", "危ない。早く逃げろ。", "危险，快逃！", "Danger! Run quickly!", "普通请求不要用命令形，用「てください」更安全。", "For ordinary requests, use てください instead."],
  "244": ["禁止形", "prohibitive form", "动词辞书形 + な", "禁止形用「辞书形 + な」表示不准做某事，语气强。", "The prohibitive uses dictionary form + な to strongly say not to do something.", "常见于标语、警告、强烈命令。", "It is common in signs, warnings, and strong commands.", "ここに入るな。", "不准进入这里。", "Do not enter here.", "不要和感叹句尾「なあ」混淆。", "Do not confuse it with exclamatory なあ."],
  "245": ["条件形", "conditional form", "动词ば形 / 形容词ば形", "条件形提出条件，后项说明该条件下的结果或判断。", "The conditional form presents a condition and gives the result or judgment under it.", "动词和い形容词都有ば形；名词和な形容词常用「なら」。", "Verbs and i-adjectives have ば forms; nouns and na-adjectives often use なら.", "時間があれば、手伝います。", "如果有时间，我会帮忙。", "If I have time, I will help.", "后项使用意志表达时要注意自然度。", "Be careful with volitional expressions in the second clause."],
  "246": ["意向形", "volitional form", "动词意向形", "意向形表示说话人的意志、提议或打算。", "The volitional form expresses the speaker's will, proposal, or intention.", "礼貌体对应「ましょう」；普通体如「行こう」「食べよう」。", "The polite counterpart is ましょう; plain forms include 行こう and 食べよう.", "週末は家でゆっくり休もう。", "周末在家好好休息吧/我想休息。", "Let's rest at home this weekend.", "对上级直接用普通意向形邀请可能太随意。", "Using plain volitional directly with superiors can be too casual."],
  "247": ["受身形", "passive form", "动词受身形", "受身形表示主语受到别人动作的影响，也可用于客观描述。", "The passive form shows the subject is affected by someone else's action, or gives an objective description.", "动作发出者常用「に」标记。", "The doer is often marked with に.", "私は先生に名前を呼ばれました。", "我被老师叫到了名字。", "I was called by name by the teacher.", "不要把所有被动都按中文“被”硬翻；日语也常用受身表达受影响。", "Do not force every passive into Chinese/English 'by'; Japanese passives often show affectedness."],
  "248": ["使役形", "causative form", "动词使役形", "使役形表示让某人做某事，或允许某人做某事。", "The causative form means making/letting someone do something.", "被使役者可用「に」或「を」，取决于动词和语义。", "The caused person can take に or を depending on the verb and meaning.", "母は子どもに野菜を食べさせました。", "母亲让孩子吃了蔬菜。", "The mother made the child eat vegetables.", "使役可能有命令感，也可能是许可，要看上下文。", "Causative can mean making someone do something or letting them do it, depending on context."],
  "249": ["使役受身形", "causative-passive form", "动词使役受身形", "使役受身形表示被迫做某事，常带不情愿。", "The causative-passive means being made to do something, often unwillingly.", "常用于说自己被别人要求做了不想做的事。", "It is often used when someone was forced to do something they did not want to do.", "子どものころ、毎日ピアノを練習させられました。", "小时候每天被迫练钢琴。", "When I was a child, I was made to practice piano every day.", "不要和单纯受身混同；这里含有“让/逼迫”的使役意义。", "Do not confuse it with the simple passive; it includes causative force."]
};

for (const item of grammar) {
  const data = updates[item.id];
  if (!data) continue;
  const [
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
  ] = data;
  Object.assign(item, {
    meaningZh,
    meaningCn: meaningZh,
    meaningEn,
    structure,
    explanationZh,
    explanation: explanationZh,
    explanationEn,
    usageNoteZh,
    usageNote: usageNoteZh,
    usageNoteEn,
    exampleJp,
    exampleZh,
    exampleCn: exampleZh,
    exampleEn,
    commonMistakeZh,
    commonMistake: commonMistakeZh,
    commonMistakeEn,
  });
}

fs.writeFileSync(grammarPath, `${JSON.stringify(grammar, null, 2)}\n`);
