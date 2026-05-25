const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const updates = {
  "515": ["无论是……也……", "whether it is...or...", "名词 + であれ", "「であれ」表示无论前项是什么身份、状态或条件，后项都成立。", "であれ means whatever the stated identity, state, or condition is, the following point holds.", "常成对使用，语气正式。", "It is often used in pairs and sounds formal.", "学生であれ社会人であれ、学び続けることは大切です。", "无论是学生还是社会人，持续学习都很重要。", "Whether one is a student or a working adult, continuing to learn is important.", "日常会话中可用「でも」。", "In casual speech, でも is simpler."],
  "516": ["即使……也……", "even if", "たとえ + 普通形 + ても", "「たとえ〜ても」强调即使出现某种情况，后项也不会改变。", "たとえ〜ても emphasizes that even if a situation occurs, the following point will not change.", "「たとえ」加强假设语气，后面常与「ても」呼应。", "たとえ strengthens the hypothetical tone and often pairs with ても.", "たとえ試験に落ちても、もう一度挑戦します。", "即使考试没通过，也会再挑战一次。", "Even if I fail the exam, I will try again.", "不要只写「たとえ」而没有后面的让步结构。", "Do not use たとえ without the following concessive structure."],
  "517": ["即使作为……；即使假设……", "even if; even assuming", "普通形/名词 + としても", "「としても」表示即使承认前项，后项仍然成立。", "としても means even if the first point is admitted, the following point still holds.", "可用于假设，也可用于退一步承认。", "It can be used for supposition or conceding a point.", "費用が高いとしても、この研究は続ける価値があります。", "即使费用高，这项研究也有继续的价值。", "Even if the cost is high, this research is worth continuing.", "い形容词前不要加「だ」。", "Do not add だ after i-adjectives before it."],
  "518": ["就算是……也……", "even for; even if", "普通形/名词 + にしたって", "「にしたって」是较口语的让步表达，意思接近「にしても」。", "にしたって is a conversational concessive expression close to にしても.", "常带说话人的情绪或评价。", "It often carries the speaker's emotion or evaluation.", "新人にしたって、理由もなく遅刻していいわけではありません。", "就算是新人，也不能无故迟到。", "Even for a new employee, being late without a reason is not acceptable.", "正式说明中可用「にしても」。", "In formal explanations, にしても may be better."],
  "519": ["无论……还是……", "whether...or...", "普通形/名词 + にしろ", "「にしろ」列举可能情况，表示无论哪种情况后项都成立。", "にしろ lists possible situations and says the following point holds regardless.", "常成对出现。", "It often appears in pairs.", "賛成するにしろ反対するにしろ、理由を言うべきです。", "无论赞成还是反对，都应该说明理由。", "Whether you agree or disagree, you should state your reason.", "后项要适用于列举的所有情况。", "The following point should apply to all listed situations."],
  "520": ["无论……还是……", "whether...or...", "普通形/名词 + にせよ", "「にせよ」和「にしろ」相近，书面感稍强，用于让步列举。", "にせよ is close to にしろ, slightly more written, and lists concessive alternatives.", "正式说明中常见。", "It is common in formal explanations.", "延期するにせよ中止するにせよ、早めに知らせてください。", "无论延期还是取消，请早点通知。", "Whether it is postponed or canceled, please inform us early.", "不要让后项只适用于其中一边。", "Do not make the following point apply to only one side."],
  "521": ["无论多么……也……", "no matter how much", "いくら + 普通形 + ても", "「いくら〜ても」表示无论程度、数量或努力多大，后项仍不变。", "いくら〜ても means no matter how much the degree, amount, or effort is, the following point does not change.", "多用于数量、努力、反复尝试。", "It is often used for amount, effort, or repeated attempts.", "いくら説明しても、彼は納得しませんでした。", "无论怎么说明，他都没有接受。", "No matter how much I explained, he was not convinced.", "后面需要和「ても」等让步形式呼应。", "It needs a concessive form such as ても later."],
  "522": ["无论多么……也……", "no matter how", "どんなに + 普通形 + ても", "「どんなに〜ても」强调无论程度多高，后项仍然成立。", "どんなに〜ても emphasizes that no matter how high the degree is, the following point still holds.", "常接形容词或表示困难、忙碌、努力的内容。", "It often appears with adjectives or content about difficulty, busyness, or effort.", "どんなに忙しくても、睡眠時間は削らないようにしています。", "无论多忙，我都尽量不减少睡眠时间。", "No matter how busy I am, I try not to cut down on sleep.", "不要只用「どんなに」而没有后面的让步结构。", "Do not use どんなに without a later concessive structure."],
  "523": ["即使被……也……", "even if being...", "たとえ + 动词て形 + も", "这一用法用动词て形接「も」，突出即使受到某动作或遇到某情况，后项仍不变。", "This use takes the verb て-form + も and emphasizes that even if one undergoes an action or situation, the following point remains unchanged.", "常见于被动、否定评价、困难状况。", "It is common with passive forms, negative evaluation, or difficult situations.", "たとえ笑われても、自分の意見を言います。", "即使被笑，我也会说出自己的意见。", "Even if I am laughed at, I will state my opinion.", "和普通形 + ても相近，但这里更凸显动作条件。", "It is close to plain-form + ても, but highlights the action condition."],
  "524": ["即使……也……（书面）", "even if, formal", "たとい + 普通形 + ても", "「たとい〜ても」和「たとえ〜ても」意思相近，但更书面、更硬。", "たとい〜ても is close to たとえ〜ても but more written and formal.", "现代口语中「たとえ」更常见。", "たとえ is more common in modern speech.", "たとい結果が出なくても、努力は無駄ではありません。", "即使没有结果，努力也不是白费。", "Even if no result appears, the effort is not wasted.", "日常会话中过度使用会显得生硬。", "Overusing it in daily speech sounds stiff."],
  "525": ["即使被……也……（书面）", "even if being..., formal", "たとい + 动词て形 + も", "「たとい〜ても」可接动词て形，表示即使发生某动作条件，后项仍成立。", "たとい〜ても can take the て-form and means even if that action condition occurs, the following point still holds.", "语气比「たとえ」正式。", "It is more formal than たとえ.", "たとい批判されても、必要な改革は進めます。", "即使受到批评，也会推进必要的改革。", "Even if criticized, we will move forward with the necessary reforms.", "不要和假设副词「たとえ」混在同一句里重复使用。", "Do not redundantly combine it with たとえ in the same sentence."],
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
