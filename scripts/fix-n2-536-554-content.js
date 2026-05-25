const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const updates = {
  "536": ["虽然……但是……", "although; but", "普通形 + ものの", "「ものの」表示先承认前项事实，再说后项并未如预期发展。", "ものの admits the first fact and then states that the result did not develop as expected.", "书面感比「けど」「のに」强。", "It is more written than けど or のに.", "新しいパソコンを買ったものの、まだ使い方が分かりません。", "虽然买了新电脑，但还不知道怎么用。", "Although I bought a new computer, I still do not know how to use it.", "后项通常带转折结果。", "The following clause usually contains a contrasting result."],
  "537": ["虽说……但是……", "although it is said that; nevertheless", "普通形 + とはいうものの", "「とはいうものの」承认前面说法，同时补充现实并不完全如此。", "とはいうものの acknowledges the preceding statement while adding that reality is not entirely so.", "常用于修正过于乐观或笼统的说法。", "It often corrects an overly optimistic or broad statement.", "春になったとはいうものの、朝はまだ寒いです。", "虽说已经到春天了，早上还是很冷。", "Although it is spring, mornings are still cold.", "不要和单纯引用的「と言う」混同。", "Do not confuse it with simple quotation と言う."],
  "538": ["然而；可是", "however; but then", "ところが + 句子", "「ところが」放在句首，表示后项结果和预想相反。", "ところが appears at the start of a sentence and introduces a result contrary to expectation.", "常用于叙述转折。", "It is common in narrative turns.", "電車に間に合うと思いました。ところが、駅に着いた時にはもう出ていました。", "我以为赶得上电车。可是到车站时已经开走了。", "I thought I would catch the train. However, it had already left when I arrived.", "不是连接名词的表达，而是句子层面的转折。", "It is not a noun connector; it turns the sentence direction."],
  "539": ["即使……也……", "even if; even though", "普通形 + ところで", "「ところで」表示即使前项成立，后项也不会发生变化，多接否定或无效结果。", "ところで means even if the first point holds, the second will not change, often with a negative or ineffective result.", "和话题转换的「ところで」不同。", "It differs from topic-changing ところで.", "今さら謝ったところで、壊れた信頼はすぐには戻りません。", "事到如今即使道歉，破裂的信任也不会马上恢复。", "Even if you apologize now, broken trust will not immediately return.", "不要和句首“话说回来”的「ところで」混同。", "Do not confuse it with sentence-initial ところで meaning 'by the way.'"],
  "540": ["明明……却……", "even though; despite", "普通形 + くせに", "「くせに」强烈批评前后矛盾，带责备、不满语气。", "くせに strongly criticizes a contradiction and carries blame or dissatisfaction.", "用于人时语气很冲，需谨慎。", "It sounds harsh when used about people, so use carefully.", "知っているくせに、何も教えてくれませんでした。", "明明知道，却什么都没告诉我。", "Even though he knew, he did not tell me anything.", "正式或中性转折可用「のに」。", "For neutral contrast, use のに."],
  "541": ["明明……却……（口语责备）", "even though, blaming tone", "普通形 + くせして", "「くせして」和「くせに」相近，口语中带更强的责备感。", "くせして is close to くせに and has an even more conversational blaming tone.", "常用于亲近关系或抱怨，正式场合避免。", "It appears in complaints or close relationships; avoid it formally.", "自分も遅れたくせして、人のことを注意しています。", "自己也迟到了，却还在提醒别人。", "Even though he was late too, he is warning others.", "语气很强，不适合礼貌场合。", "The tone is strong and unsuitable for polite contexts."],
  "542": ["明明……却……", "although; even though", "普通形 + のに", "「のに」表示结果和预期相反，常带遗憾、意外或不满。", "のに expresses a result contrary to expectation, often with regret, surprise, or dissatisfaction.", "名词和な形容词接「なのに」。", "Use なのに after nouns and na-adjectives.", "一生懸命説明したのに、分かってもらえませんでした。", "明明拼命说明了，却没能让对方理解。", "Even though I explained hard, I could not make them understand.", "后面不适合接命令或请求。", "Commands or requests are not natural after it."],
  "543": ["以……来说；却……", "for; considering", "普通形/名词 + わりに", "「わりに」表示从前项程度或情况来看，后项结果出乎预期。", "わりに means that considering the preceding degree or situation, the result is unexpected.", "常用于评价“比想象中更/不那么”。", "It often evaluates something as more/less than expected.", "値段が安いわりに、この料理はおいしいです。", "以价格便宜来说，这道菜很好吃。", "Considering the low price, this dish is good.", "不要和「にしては」完全混同；わりに更常接程度或状态。", "Do not fully confuse it with にしては; わりに often follows degree or state."],
  "544": ["与……相对；而……", "whereas; in contrast to", "普通形/名词 + のに対して", "「のに対して」对比两件事、两种性质或两个立场。", "のに対して contrasts two facts, qualities, or positions.", "常用于说明明显差异。", "It is common when explaining clear differences.", "兄は外で遊ぶのが好きなのに対して、弟は家で本を読むのが好きです。", "哥哥喜欢在外面玩，而弟弟喜欢在家读书。", "My older brother likes playing outside, whereas my younger brother likes reading at home.", "不是单纯抱怨的「のに」。", "It is not complaint-like のに."],
  "545": ["一方面……；另一方面……", "on one hand; while", "普通形 + 一方", "「一方」表示两个并列方面形成对比，也可表示某变化持续朝一个方向发展。", "一方 contrasts two parallel aspects, or can show a change continuing in one direction.", "对比用法常和另一个方面搭配。", "The contrast use often pairs with another aspect.", "この仕事は大変な一方、学べることも多いです。", "这份工作一方面辛苦，另一方面能学到很多。", "This job is hard, while there is also a lot to learn.", "注意区分“另一方面”和“一直变化”的用法。", "Distinguish the contrast use from the one-direction change use."],
  "546": ["另一方面；反面", "on the other hand; downside", "普通形 + 反面", "「反面」表示某事有一个方面，同时也有相反或需要注意的另一面。", "反面 means something has one side and also an opposite or caution-worthy side.", "常用于利弊对比。", "It is common for pros and cons.", "この薬は効果が強い反面、副作用もあります。", "这种药效果强，另一方面也有副作用。", "This medicine is strong, but on the other hand it has side effects.", "后项通常是与前项相对的性质。", "The following clause usually presents an opposing quality."],
  "547": ["代替……；作为交换", "instead of; in return for", "普通形/名词の + かわりに", "「かわりに」可表示代替某人某物，也可表示作为交换获得另一种结果。", "かわりに can mean instead of someone/something, or in return for another result.", "需要根据上下文判断是代替还是交换。", "Use context to decide whether it is substitution or exchange.", "週末に働くかわりに、月曜日に休みをもらいました。", "作为周末工作的交换，周一获得了休息。", "In exchange for working on the weekend, I got Monday off.", "不要把所有「かわりに」都理解成“代替人”。", "Do not interpret every かわりに as replacing a person."],
  "548": ["代替……；取代……", "instead of; replacing", "名词 + にかわって", "「にかわって」表示代替某人、某组织或某事物承担角色。", "にかわって means replacing someone, an organization, or something in a role.", "常用于正式场合或角色替换。", "It is common in formal contexts or role replacement.", "部長にかわって、私が会議に出席します。", "我代替部长出席会议。", "I will attend the meeting in place of the department manager.", "不要写成「のかわって」；固定形式是「にかわって」。", "Do not write のかわって; the fixed form is にかわって."],
  "549": ["代替；交换条件", "substitute; exchange", "名词 + のかわり", "「かわり」作为名词，表示替代物、代理人或交换条件。", "かわり as a noun means a substitute, replacement, or exchange condition.", "后面常接「に」构成副词性表达。", "It often takes に to become adverbial.", "現金のかわりに、カードで払いました。", "用银行卡代替现金支付了。", "I paid by card instead of cash.", "注意「かわり」本身是名词，接续需要助词。", "Remember かわり is a noun and needs particles."],
  "550": ["代替……；取而代之", "replace; take the place of", "名词 + にかわる", "「にかわる」表示某物或某人取代前项，成为新的选择或角色。", "にかわる means something or someone replaces the preceding item as a new option or role.", "常用于制度、技术、材料、负责人变化。", "It is common for changes in systems, technology, materials, or responsible persons.", "紙の書類にかわる新しいシステムを導入しました。", "引入了取代纸质文件的新系统。", "We introduced a new system that replaces paper documents.", "不要和「変わる」的普通变化混同。", "Do not confuse it with ordinary 変わる meaning change."],
  "551": ["尽管……；虽然……", "despite; although", "名词/普通形 + にもかかわらず", "「にもかかわらず」表示前项事实存在，但后项却与预期相反。", "にもかかわらず means despite the first fact, the following result is contrary to expectation.", "书面正式语感较强。", "It has a formal written tone.", "雨にもかかわらず、多くの人が集まりました。", "尽管下雨，还是来了很多人。", "Despite the rain, many people gathered.", "不要误写成单独的「かわらず」表达这个意思。", "Do not write only かわらず for this meaning."],
  "552": ["作为……的替代", "instead of; as a substitute for", "名词 + のかわり", "「のかわり」表示某物、某人或某做法的替代。", "のかわり indicates a substitute for a thing, person, or method.", "常接「に」形成「のかわりに」。", "It often takes に as のかわりに.", "砂糖のかわりに、はちみつを使いました。", "用蜂蜜代替了砂糖。", "I used honey instead of sugar.", "代替动作时常用动词普通形 + かわりに。", "For substituting actions, use plain form + かわりに."],
  "553": ["代替……；不……而……", "instead of", "名词の/普通形 + かわりに", "「かわりに」表示不采用前项，而采用后项来替代。", "かわりに means not using/doing the first option but using/doing the second instead.", "也可表示交换条件。", "It can also express an exchange condition.", "映画を見るかわりに、家で本を読みました。", "没有看电影，而是在家读了书。", "Instead of watching a movie, I read a book at home.", "不要和补偿交换用法混淆；需要看上下文。", "Do not confuse substitution and exchange uses; check context."],
  "554": ["代替……；代表……", "instead of; on behalf of", "名词 + にかわって", "「にかわって」表示代表或代替前项做某事。", "にかわって means doing something in place of or on behalf of the preceding person/group.", "较正式，常用于代理发言、出席、负责。", "It is fairly formal and common for speaking, attending, or taking responsibility on someone's behalf.", "社長にかわって、担当者が説明しました。", "负责人代替社长进行了说明。", "The person in charge explained on behalf of the president.", "固定形式是「にかわって」，不是「のかわって」。", "The fixed form is にかわって, not のかわって."],
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
