const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const updates = {
  "316": ["因为……；由于……", "because; since", "普通形 + ものだから", "「ものだから」说明带有个人辩解、解释语气的原因。", "ものだから gives a reason with an explanatory or excuse-like tone.", "迟到、拒绝、无法做到某事时常用来解释原因。", "It is common when explaining lateness, refusal, or inability.", "電車が止まったものだから、教室に着くのが遅れました。", "因为电车停了，所以到教室晚了。", "Because the train stopped, I arrived at the classroom late.", "语气带解释感，不适合冷冰冰列事实。", "It sounds explanatory, not like a dry factual cause."],
  "317": ["因为……；由于……", "because; since", "普通形 + もので", "「もので」柔和地说明个人情况造成的原因，常用于解释或道歉。", "もので softly explains a reason caused by personal circumstances, often in apologies or explanations.", "比「から」更委婉。", "It is softer than から.", "急な用事ができたもので、先生との約束を延期しました。", "因为突然有事，所以推迟了和老师的约定。", "Because something urgent came up, I postponed my appointment with the teacher.", "不要用于强硬主张；它更像说明难处。", "Do not use it for forceful claims; it explains circumstances."],
  "318": ["因为是……；就……而言", "given that it is...", "名词 + のことだから", "「ことだから」根据某人的性格、特点或一贯表现来推断结果。", "ことだから makes an inference based on someone's character, traits, or usual behavior.", "前面多接人名或描述人的名词。", "It often follows a person's name or a noun describing a person.", "責任感の強い田中さんのことだから、最後までやるでしょう。", "因为是责任感很强的田中，他会做到最后吧。", "Knowing responsible Tanaka, he will probably see it through.", "不是普通原因，而是基于“这个人一贯如此”的推断。", "It is not an ordinary cause; it infers from what the person is usually like."],
  "319": ["正因为……才导致坏结果", "just because... led to a bad result", "普通形 + ばかりに", "「ばかりに」说明仅仅因为某个原因，造成了不好的结果。", "ばかりに says that just because of one cause, an undesirable result happened.", "后项通常是不满、后悔或损失。", "The following result is usually regret, trouble, or loss.", "一言確認しなかったばかりに、大きな誤解が生まれました。", "就因为没确认一句，产生了很大的误会。", "Just because I failed to confirm one thing, a big misunderstanding arose.", "后项如果是好结果，通常不用「ばかりに」。", "It is usually not used with a good result."],
  "320": ["正因为……所以更……", "precisely because; all the more because", "普通形/名词 + だけに", "「だけに」根据前项的特点，说明后项更自然、更强烈或更值得理解。", "だけに uses the preceding quality to explain why the following result is natural or stronger.", "常用于期待、评价、遗憾等。", "It is common with expectations, evaluations, and regrets.", "長く使ってきた道具だけに、壊れると残念です。", "正因为是用了很久的工具，坏了就很遗憾。", "Because it is a tool I have used for a long time, it is sad when it breaks.", "不要和限定数量的「だけ」混同。", "Do not confuse it with quantity-limiting だけ."],
  "321": ["不愧是……；正因为……", "as expected of; precisely because", "名词/普通形 + だけあって", "「だけあって」表示不愧具备前项身份、能力或经历，所以后项评价成立。", "だけあって means 'as expected of' someone/something with the stated status, ability, or experience.", "后项多是正面评价。", "The following evaluation is often positive.", "専門家だけあって、説明がとても分かりやすいです。", "不愧是专家，说明非常容易懂。", "As expected of a specialist, the explanation is very easy to understand.", "如果后项是负面意外，用「だけに」等更自然。", "For negative surprise, patterns like だけに may fit better."],
  "322": ["由于……；因为……", "because of; due to", "名词 + のゆえに / 普通形 + ゆえに", "「ゆえに」是书面语，说明原因或根据。", "ゆえに is written/formal language giving a cause or basis.", "比「から」「ので」硬，常见于文章和正式说明。", "It is stiffer than から or ので and appears in writing or formal explanations.", "経験が少ないゆえに、慎重に進める必要があります。", "由于经验少，有必要谨慎推进。", "Because experience is limited, we need to proceed carefully.", "日常口语中过度使用会显得生硬。", "Overusing it in daily speech sounds stiff."],
  "323": ["正因为……；由于……", "because precisely; due to", "普通形 + がゆえに", "「がゆえに」强调正因为前项，后项才发生，语气正式。", "がゆえに emphasizes that precisely because of the first point, the second occurs, with a formal tone.", "常用于书面评价、分析和说明。", "It is common in written evaluation, analysis, and explanation.", "真面目であるがゆえに、彼は小さなミスも許せません。", "正因为认真，他连小错误也无法原谅。", "Precisely because he is serious, he cannot overlook even small mistakes.", "不要把它当普通口语原因来用。", "Do not use it as an ordinary conversational reason marker."],
  "324": ["原因；缘故", "reason; cause", "名词 + のゆえ / 普通形 + ゆえ", "「ゆえ」表示原因、理由或依据，多用于书面语。", "ゆえ indicates reason, cause, or basis and is mostly written.", "可接在句中，也可作名词性表达。", "It can appear inside a sentence or function noun-like.", "若さゆえの失敗もあります。", "也有因为年轻而造成的失败。", "There are also mistakes due to youth.", "语体正式，日常会话一般换成「ため」「から」。", "It is formal; daily speech usually uses ため or から."],
  "325": ["假设……的话", "assuming that...", "普通形/名词 + とすると", "「とすると」把前项作为假设，然后推出判断或结果。", "とすると treats the first clause as an assumption and draws a judgment or result.", "常用于推理和确认可能性。", "It is common in reasoning and checking possibilities.", "彼の話が本当だとすると、計画を変える必要があります。", "如果他说的是真的，就有必要改变计划。", "Assuming his story is true, we need to change the plan.", "不要把它当简单时间条件。", "Do not treat it as a simple time condition."],
  "326": ["如果……的话；假如……", "if; assuming that", "普通形/名词 + とすれば", "「とすれば」在某个假设基础上进行判断、推论或评价。", "とすれば makes a judgment, inference, or evaluation based on an assumption.", "和「とすると」接近，但更常用于说话人的推论。", "It is close to とすると, often used for the speaker's inference.", "この資料が正しいとすれば、結論は変わります。", "如果这份资料是正确的，结论就会改变。", "If this material is correct, the conclusion changes.", "前项应是可作为前提的内容。", "The first clause should be something that can serve as a premise."],
  "327": ["如果……的话；假如……", "if; supposing that", "普通形/名词 + としたら", "「としたら」提出假设，并在该假设下说出想法或结果。", "としたら presents a supposition and states an idea or result under it.", "比「とすれば」更口语一些。", "It is somewhat more conversational than とすれば.", "一週間休みが取れるとしたら、海外へ行きたいです。", "如果能休一周，我想去国外。", "If I could take a week off, I would like to go abroad.", "不要和已经确定发生的时间条件混同。", "Do not confuse it with a time condition for something already certain."],
  "328": ["作为……；以……身份", "as; in the role of", "名词 + として", "「として」表示身份、资格、立场或用途。", "として indicates role, qualification, standpoint, or use.", "常用于介绍身份和评价立场。", "It is common when introducing roles or evaluation standpoints.", "彼は通訳として会議に参加しました。", "他作为翻译参加了会议。", "He joined the meeting as an interpreter.", "不要和引用的「と」混同。", "Do not confuse it with quotation と."],
  "329": ["以……来说却……", "for; considering", "名词 + にしては", "「にしては」表示从前项身份、条件来看，后项出乎预期。", "にしては means that considering the stated identity or condition, the following result is unexpected.", "后项常带“比想象中更/不那么”的评价。", "The following clause often evaluates something as more/less than expected.", "初めてにしては、とても上手にできました。", "以第一次来说，做得非常好。", "For a first try, you did very well.", "不要用于单纯身份说明；身份说明用「として」。", "Do not use it for a simple role statement; use として."],
  "330": ["无论……还是……", "whether...or...", "普通形/名词 + にしろ", "「にしろ」列举可能情况，表示无论哪种情况都适用后项。", "にしろ lists possible cases and says the following point applies whichever is true.", "常和另一个「にしろ」成对出现。", "It often appears in pairs.", "行くにしろ行かないにしろ、早く返事をしてください。", "无论去还是不去，请早点回复。", "Whether you go or not, please reply soon.", "后项应是两种情况都成立的内容。", "The following point should apply to both cases."],
  "331": ["无论……还是……", "whether...or...", "普通形/名词 + にせよ", "「にせよ」和「にしろ」接近，书面感稍强，表示让步条件。", "にせよ is close to にしろ, slightly more written, and marks concessive alternatives.", "常用于正式说明。", "It is common in formal explanations.", "賛成するにせよ反対するにせよ、理由を説明してください。", "无论赞成还是反对，请说明理由。", "Whether you agree or disagree, please explain your reason.", "不要只列举前项却让后项只适用于其中一种情况。", "Do not use it if the following statement applies to only one listed case."],
  "332": ["无论是……也……", "even if; whether it is...", "名词 + であろうと", "「であろうと」表示即使是某种身份、条件或情况，后项也不改变。", "であろうと means even if it is a certain identity, condition, or situation, the following point does not change.", "正式语气，常用于规则和原则。", "It is formal and common in rules or principles.", "初心者であろうと、基本のマナーは守るべきです。", "即使是初学者，也应该遵守基本礼仪。", "Even if someone is a beginner, they should follow basic manners.", "日常口语可用「でも」。", "In daily speech, でも may be simpler."],
  "334": ["即使……也；最迟/至少", "even if; at the latest/least", "动词意向形/い形容词く + とも",
    "「とも」可表示让步，也可出现在「遅くとも」「少なくとも」等固定表达中。", "とも can mark concession and also appears in fixed expressions like 遅くとも and 少なくとも.", "N3阶段常先掌握固定表达。", "At N3, fixed expressions are especially useful.", "遅くとも金曜日までに返事をください。", "最迟请在周五前回复。", "Please reply by Friday at the latest.", "不要把所有「とも」都当作“朋友”的「友」。", "Do not confuse this とも with 友 meaning friend."],
  "335": ["即使作为……；即使假设……", "even if; even assuming", "普通形/名词 + としても", "「としても」表示即使承认前项，后项仍然成立。", "としても means even if the first point is admitted, the following point still holds.", "可用于让步和假设。", "It can be used for concession and supposition.", "値段が安いとしても、必要のない物は買いません。", "即使价格便宜，不需要的东西也不买。", "Even if the price is low, I do not buy things I do not need.", "注意い形容词直接接「としても」，不要加「だ」。", "I-adjectives attach directly before としても; do not add だ."],
  "336": ["即使……也；就算……", "even if; even considering", "普通形/名词 + にしても", "「にしても」表示即使处于前项情况，后项评价仍然成立。", "にしても means even under the stated condition, the following evaluation still holds.", "也可成对列举「AにしてもBにしても」。", "It can also list alternatives as AにしてもBにしても.", "忙しいにしても、連絡ぐらいはできるはずです。", "就算很忙，联系一下总是能做到的吧。", "Even if you are busy, you should at least be able to contact me.", "语气常带说话人的评价。", "It often carries the speaker's evaluation."],
  "337": ["就算是……也", "even for; even if", "普通形/名词 + にしたって", "「にしたって」是较口语的让步表达，意思接近「にしても」。", "にしたって is a conversational concessive expression close to にしても.", "常用于带情绪的评价。", "It is common in emotionally colored evaluations.", "先生にしたって、急に予定を変えられたら困ります。", "就算是老师，突然被改日程也会为难。", "Even for a teacher, a sudden schedule change is troublesome.", "正式文章中可改用「にしても」。", "In formal writing, にしても may be better."],
  "338": ["以……来说却……", "for; considering", "名词 + にしては", "「にしては」表示以后项评价来看，结果和前项身份或条件不太相称。", "にしては means the result does not quite match what would be expected from the stated identity or condition.", "常带意外感。", "It often carries surprise.", "冬にしては、今日は暖かいです。", "以冬天来说，今天很暖和。", "For winter, today is warm.", "前项不能是普通比较基准；它是预期依据。", "The first item is not a simple comparison baseline; it is the basis for expectation."],
  "339": ["无论……还是……", "whether...or...", "普通形/名词 + にせよ", "「にせよ」列举让步条件，表示无论哪一种都不影响后项。", "にせよ lists concessive alternatives and says the following point is unaffected.", "常见于书面和正式说明。", "It is common in written and formal explanations.", "参加するにせよ欠席するにせよ、今日中に知らせてください。", "无论参加还是缺席，请今天内通知。", "Whether you attend or are absent, please let us know today.", "不要让后项只适用于其中一个选项。", "Do not make the following statement apply to only one option."],
  "340": ["无论……还是……", "whether...or...", "普通形/名词 + にしろ", "「にしろ」列举可能情况，后项在任何情况都成立。", "にしろ lists possible situations, and the following point holds in any case.", "比「にせよ」稍口语。", "It is slightly more conversational than にせよ.", "買うにしろ借りるにしろ、よく調べてから決めましょう。", "无论买还是租，都仔细调查后再决定吧。", "Whether buying or renting, let's decide after checking carefully.", "常成对使用，表达选择范围。", "It is often used in pairs to show the range of options."],
  "341": ["无论是……也……", "whether it is...or...", "名词 + であれ", "「であれ」表示无论前项是什么身份、状态或条件，后项都成立。", "であれ means whatever the stated identity, state, or condition is, the following point holds.", "正式语气，常用于原则性说明。", "It is formal and common in statements of principle.", "新人であれ経験者であれ、規則は守らなければなりません。", "无论新人还是有经验者，都必须遵守规则。", "Whether new or experienced, everyone must follow the rules.", "日常会话中可换成「でも」。", "In casual speech, でも is simpler."],
  "342": ["即使是……也……", "even if it is...", "名词 + であろうと", "「であろうと」是正式的让步表达，表示即使是前项情况也不例外。", "であろうと is a formal concessive pattern meaning even that case is no exception.", "常用于强调规则、责任或判断不变。", "It often emphasizes that rules, duties, or judgments do not change.", "どんな理由であろうと、約束を破るのはよくありません。", "无论是什么理由，违背约定都不好。", "Whatever the reason may be, breaking a promise is not good.", "语气正式，日常可用「でも」。", "It is formal; でも is common in daily speech."],
  "343": ["为了……；以便……", "so that; in order that", "动词辞书形/ない形 + ように", "「ように」表示为了让某状态实现而采取行动，常接可能形、ない形或无意志动词。", "ように means acting so that a desired state happens, often with potential, negative, or non-volitional verbs.", "和直接目的「ために」相比，更偏状态或能力目标。", "Compared with direct-purpose ために, it leans toward state or ability goals.", "忘れないように、予定をカレンダーに入れました。", "为了不忘记，把日程放进了日历。",
    "I added the schedule to my calendar so I would not forget.", "自己的直接意志动作常用「ために」。", "For one's direct intentional action, ために is often used."],
  "345": ["……却……；明明……", "although; even though", "普通形 + のに", "「のに」表达实际结果和预期相反，常带遗憾、不满或意外。", "のに expresses a result contrary to expectation, often with regret, dissatisfaction, or surprise.", "名词和な形容词接「なのに」。", "Use なのに after nouns and na-adjectives.", "早く出たのに、電車に間に合いませんでした。", "明明很早出门，却没赶上电车。", "Even though I left early, I did not make the train.", "不要把「のに」误当成目的表达。", "Do not mistake のに for a purpose marker."],
  "346": ["设法……；努力以……方式", "manage to; try to do in a way", "动词辞书形 + ようにして", "「ようにして」表示以某种方式努力做到前项，常带“设法”的感觉。", "ようにして means trying to do something in a certain way, often with a sense of managing to do it.", "常用于说明方法或努力过程。", "It is common when describing a method or effort.", "音を立てないようにして、部屋を出ました。", "尽量不发出声音地离开了房间。", "I left the room while trying not to make noise.", "不要和结果变化「ようになる」混同。", "Do not confuse it with result-change ようになる."],
  "347": ["尽量做到……；习惯性地努力……", "make a point of; try to habitually", "动词辞书形/ない形 + ようにしている", "「ようにしている」表示平时有意识地坚持做或避免做某事。", "ようにしている means consciously making a habit of doing or avoiding something.", "常用于生活习惯、学习习惯、健康管理。", "It is common for lifestyle, study habits, and health management.", "毎日ニュースを聞くようにしています。", "我尽量每天听新闻。", "I make a point of listening to the news every day.", "如果是自然变得会做，用「ようになる」。", "If it naturally becomes possible, use ようになる."],
  "348": ["决定一直……；规定自己……", "make it a rule to", "动词辞书形/ない形 + ことにしている", "「ことにしている」表示自己定下规则并持续实行。", "ことにしている means one has made a rule for oneself and continues to follow it.", "常用于个人习惯或长期方针。", "It is common for personal habits or long-term policies.", "夜十時以降はメールを見ないことにしています。", "我规定自己晚上十点以后不看邮件。", "I make it a rule not to check email after 10 p.m.", "一次性决定用「ことにした」。", "For a one-time decision, use ことにした."],
  "349": ["决定了……", "decided to", "动词辞书形/ない形 + ことにした", "「ことにした」表示说话人自己做出了决定。", "ことにした means the speaker made a decision.", "强调决定来自自己。", "It emphasizes that the decision came from oneself.", "健康のために、毎朝走ることにしました。", "为了健康，我决定每天早上跑步。", "For my health, I decided to run every morning.", "外部安排的决定用「ことになった」。", "For externally arranged decisions, use ことになった."],
  "350": ["决定为……；被安排为……", "it was decided that", "动词辞书形 + ことになった", "「ことになった」表示由于安排、规则或他人决定，事情变成如此。", "ことになった means it was decided by arrangements, rules, or others.", "决定来源通常不完全是说话人自己。", "The source of the decision is usually not entirely the speaker.", "来月から新しい部署で働くことになりました。", "已经决定从下个月开始在新部门工作。", "It has been decided that I will work in a new department from next month.", "自己主动决定用「ことにした」。", "For one's own decision, use ことにした."],
  "351": ["计划……；预定……", "be scheduled to; plan to", "动词辞书形 + 予定だ / 名词 + の予定だ", "「予定だ」说明已经安排好的计划或日程。", "予定だ states an arranged plan or schedule.", "名词后接「の予定」。", "Use の予定 after nouns.", "来週、会社で新しい企画を発表する予定です。", "下周计划在公司发表新企划。", "I am scheduled to present a new plan at the company next week.", "不要和单纯愿望「たい」混同。", "Do not confuse it with a simple wish marked by たい."],
  "353": ["没有……的打算", "have no intention of", "动词辞书形 + つもりはない", "「つもりはない」明确表示没有做某事的意图。", "つもりはない clearly states that one has no intention of doing something.", "语气比「ないつもりだ」更强调否定意图。", "It emphasizes lack of intention more than ないつもりだ.", "今の仕事を辞めるつもりはありません。", "我没有辞掉现在工作的打算。", "I have no intention of quitting my current job.", "不要和“本来没打算”的「つもりではなかった」混同。", "Do not confuse it with つもりではなかった, meaning it was not the original intention."],
  "358": ["一直想……；打算……", "have been wanting/intending to", "动词ます形词干 + たいと思っている", "「たいと思っている」表示愿望或计划持续存在一段时间。", "たいと思っている means a wish or plan has continued for some time.", "比「たいと思う」更有持续想法的感觉。", "It feels more ongoing than たいと思う.", "いつか日本の大学院で研究したいと思っています。", "我一直想有一天在日本的研究生院做研究。", "I have been wanting to do research at a graduate school in Japan someday.", "前面要用动词ます形词干加「たい」。", "Use the verb stem plus たい before it."],
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
