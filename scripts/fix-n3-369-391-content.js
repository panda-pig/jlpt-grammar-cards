const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const updates = {
  "369": ["请别人为我方做……（谦让）", "humbly receive someone's action", "动词て形 + いただく", "「ていただく」是「てもらう」的谦让形式，表示承蒙对方为自己一方做某事。", "ていただく is the humble form of てもらう and means receiving someone's action for the speaker's side.", "常用于请求、感谢、正式说明。", "It is common in requests, thanks, and formal explanations.", "先生に作文を添削していただきました。", "请老师帮我修改了作文。", "I had my teacher correct my composition.", "不要用来描述自己为别人做事。", "Do not use it for actions you do for someone else."],
  "370": ["为我方做……（尊敬）", "honorifically do something for us", "动词て形 + くださる", "「てくださる」是「てくれる」的尊敬形式，尊敬地说对方为自己一方做事。", "てくださる is the honorific form of てくれる, respectfully saying someone does something for the speaker's side.", "礼貌形常用「てくださいます／てくださいました」。", "The polite forms てくださいます and てくださいました are common.", "部長が資料を確認してくださいました。", "部长为我确认了资料。", "The department manager kindly checked the materials.", "请求句「てください」和描述恩惠的「てくださる」要区分。", "Distinguish request てください from benefit-description てくださる."],
  "371": ["给……（谦让）", "humbly give", "名词を + さしあげる", "「さしあげる」是「あげる」的谦让语，用于自己一方给尊敬对象东西。", "さしあげる is the humble form of あげる, used when the speaker's side gives something to a respected person.", "实际会话中有时显得过于郑重，要看场合。", "In real conversation it can sound overly formal, so use it according to context.", "お客様にパンフレットをさしあげました。", "给了客人一本宣传册。", "I gave the customer a brochure.", "对亲近朋友一般用「あげる」即可。", "For close friends, あげる is usually enough."],
  "373": ["只；光是……", "only; nothing but", "名词/动词て形 + ばかり", "「ばかり」表示同类内容很多，或某动作反复发生，常带偏重感。", "ばかり means many of the same kind or repeated action, often with a sense of imbalance.", "可用于批评“总是……”。", "It can criticize someone for always doing something.", "弟はゲームばかりしています。", "弟弟光是在打游戏。", "My younger brother does nothing but play games.", "不要和「たばかり」的“刚刚做完”混同。", "Do not confuse it with たばかり meaning 'just did.'"],
  "374": ["只；仅仅", "only; just", "名词/普通形 + だけ", "「だけ」限定范围，表示除此之外没有其他。", "だけ limits the scope and means nothing else is included.", "语气较中性，后面不需要否定。", "It is fairly neutral and does not require a negative predicate.", "今日は単語だけ復習しました。", "今天只复习了单词。", "Today I reviewed only vocabulary.", "和「しか〜ない」相比，だけ没有“不够”的感觉。", "Compared with しか〜ない, だけ does not suggest insufficiency."],
  "375": ["只有……；除此之外不……", "only; nothing but", "名词/数量 + しか + 否定", "「しか」必须和否定一起使用，强调范围或数量有限。", "しか must be used with a negative predicate and emphasizes a limited amount or scope.", "常带“少、不够、别无选择”的感觉。", "It often suggests smallness, insufficiency, or no other option.", "会議には三人しか来ませんでした。", "会议只来了三个人。", "Only three people came to the meeting.", "不要说「しか来ました」；后面要是否定。", "Do not say しか来ました; use a negative predicate."],
  "376": ["大约；到……程度", "about; to the extent", "数量/普通形 + くらい", "「くらい」表示大约的数量，也可表示某种程度。", "くらい indicates approximate amount and can also show degree.", "口语中和「ぐらい」常可互换。", "In speech, it is often interchangeable with ぐらい.", "この作文を書くのに一時間くらいかかりました。", "写这篇作文大约花了一个小时。", "It took about an hour to write this composition.", "大约时间点用「ごろ」，时间长度用「くらい／ぐらい」。", "Use ごろ for approximate points in time; くらい/ぐらい for duration."],
  "377": ["大约；到……程度", "about; to the extent", "数量/普通形 + ぐらい", "「ぐらい」和「くらい」一样，表示大约数量或程度。", "ぐらい, like くらい, indicates approximate amount or degree.", "发音上「ぐらい」很常见。", "The pronunciation ぐらい is very common.", "駅から学校まで十五分ぐらい歩きます。", "从车站到学校大约走十五分钟。", "I walk about fifteen minutes from the station to school.", "不要和「ごろ」混用；ごろ用于时间点。", "Do not mix it with ごろ, which is used for points in time."],
  "378": ["比……；从……", "than; from", "名词 + より", "「より」可标记比较基准，也可在正式语中表示起点。", "より can mark a comparison baseline and can also formally mark a starting point.", "比较时常见「AはBより」。", "In comparison, AはBより is common.", "新幹線はバスより速いです。", "新干线比公交快。", "The Shinkansen is faster than the bus.", "比较句中，被「より」标出的不是更高的一方。", "In comparison, the item marked by より is not the higher side."],
  "379": ["……这一方更……", "this side is more...", "名词 + の方が", "「の方が」标出比较中更强、更好或更合适的一方。", "の方が marks the side that is stronger, better, or more suitable in a comparison.", "常和「より」一起用。", "It often appears with より.", "一人で行くより、友だちと行く方が安心です。", "比起一个人去，和朋友一起去更安心。", "Rather than going alone, going with a friend is more reassuring.", "不要把「より」和「方が」放在同一边。", "Do not put より and 方が on the same side."],
  "381": ["看起来……；似乎要……", "looks; seems about to", "动词ます形词干/形容词词干 + そうだ", "样态「そうだ」根据眼前迹象判断某事看起来如何或似乎要发生。", "Appearance そうだ judges from visible signs how something looks or seems about to happen.", "传闻「そうだ」接普通形，样态「そうだ」接词干。", "Hearsay そうだ follows plain forms; appearance そうだ follows stems.", "この荷物は重そうです。", "这件行李看起来很重。", "This luggage looks heavy.", "「いい」变「よさそう」，不是「いそう」。", "いい becomes よさそう, not いそう."],
  "382": ["看起来不会……", "does not look likely to", "动词ます形词干 + そうにない", "「そうにない」表示从当前情况看，某事似乎不会发生。", "そうにない means that from the current situation, something does not look likely to happen.", "多接动词词干。", "It often follows verb stems.", "この雨はすぐには止みそうにありません。", "这场雨看起来不会马上停。", "This rain does not look likely to stop soon.", "不要和传闻否定混同；这里是根据样子判断。", "Do not confuse it with hearsay negative; this is based on appearance."],
  "384": ["容易……；常常……", "tend to; often", "动词ます形词干/名词 + がち", "「がち」表示某种不太理想的倾向经常出现。", "がち indicates a tendency that often appears, usually undesirable.", "常用于健康、生活习惯、天气、状态。", "It is common for health, habits, weather, and states.", "忙しいと、食事の時間を忘れがちです。", "一忙就容易忘记吃饭时间。", "When busy, I tend to forget meal times.", "多带负面倾向，不适合普通正面习惯。", "It often has a negative nuance and is not for ordinary positive habits."],
  "386": ["像……；带有……倾向", "kind of; -ish", "名词/动词ます形词干 + っぽい", "「っぽい」表示看起来像某种性质，或容易出现某种倾向。", "っぽい means having a certain quality or tendency, often '-ish.'", "口语感较强。", "It is conversational.", "このシャツは少し子どもっぽいです。", "这件衬衫有点孩子气。", "This shirt looks a little childish.", "可能带负面评价，使用时注意对象。", "It can sound negative, so mind the target."],
  "387": ["有点……倾向", "slightly; -ish tendency", "名词/动词ます形词干 + 気味", "「気味」表示稍微有某种不太好的状态或倾向。", "気味 means slightly having a certain, often undesirable, condition or tendency.", "常见于身体、心理、变化趋势。", "It is common for physical condition, mental state, and trends.", "最近、少し疲れ気味です。", "最近有点疲劳。", "Recently I feel a bit tired.", "通常不用于强烈正面评价。", "It is usually not used for strongly positive evaluations."],
  "388": ["正在逐渐……", "be gradually becoming", "动词ます形词干 + つつある", "「つつある」表示变化正在逐步进行中，书面感较强。", "つつある means a change is gradually in progress, with a written/formal tone.", "常用于社会变化、病情、技术发展等。", "It is common for social change, health conditions, and technological development.", "この町の人口は少しずつ増えつつあります。", "这个城镇的人口正在逐渐增加。", "The population of this town is gradually increasing.", "日常口语可用「ている」「てきている」。", "In daily speech, ている or てきている is more common."],
  "389": ["做到一半的状态", "half-done; in the middle of", "动词ます形词干 + かけだ", "「かけだ」表示动作开始后还没有完成，处于中途状态。", "かけだ means an action has started but is not finished; it is in progress halfway.", "常用于「食べかけ」「読みかけ」等。", "It is common in forms like 食べかけ and 読みかけ.", "テーブルの上に読みかけの本があります。", "桌子上有一本读到一半的书。", "There is a half-read book on the table.", "不是“快要”一定会完成，而是已经开始但没完成。", "It does not necessarily mean it will finish soon; it has started but is unfinished."],
  "390": ["开始做……；做到一半", "start to; be about to/halfway", "动词ます形词干 + かける", "「かける」表示动作刚开始、快要发生，或做到一半。", "かける means an action has just started, is about to happen, or is halfway done.", "具体意思要看动词和上下文。", "The exact meaning depends on the verb and context.", "言いかけて、彼は急に黙りました。", "他说到一半，突然沉默了。", "He started to say something, then suddenly went silent.", "不要和普通动词「掛ける」的其他意思混同。", "Do not confuse it with other meanings of the verb 掛ける."],
  "391": ["难以……；不忍……", "hard to; cannot bring oneself to", "动词ます形词干 + がたい", "「がたい」表示心理上或性质上难以做到，常用于书面语。", "がたい means difficult to do psychologically or by nature, often in written language.", "常见搭配有「信じがたい」「許しがたい」「理解しがたい」。", "Common phrases include 信じがたい, 許しがたい, and 理解しがたい.", "彼の説明には信じがたい点があります。", "他的说明里有难以相信的地方。", "There are points in his explanation that are hard to believe.", "一般物理上难做更常用「にくい」。", "For ordinary physical difficulty, にくい is often used."],
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
