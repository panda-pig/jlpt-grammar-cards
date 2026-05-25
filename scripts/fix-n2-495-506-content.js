const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const updates = {
  "495": ["顺便……；兼做……", "while doing; on the occasion of", "动词ます形词干/名词 + がてら", "「がてら」表示做某事的同时顺便做另一件事。", "がてら means doing another thing while taking the opportunity of the first action.", "多用于移动、外出时顺便办事。", "It is often used when going out or moving somewhere and doing something along the way.", "散歩がてら、郵便局に寄りました。", "散步时顺便去了邮局。", "While out for a walk, I stopped by the post office.", "不是正式的主要目的表达，带“顺便”感。", "It is not the main-purpose pattern; it has an 'along the way' nuance."],
  "496": ["一边……一边也……", "while also; alongside", "动词辞书形/名词の + かたわら", "「かたわら」表示从事主要活动的同时，也持续做另一项活动。", "かたわら means doing another continuing activity alongside one's main activity.", "常用于职业、研究、社会活动等长期并行。", "It is common for long-term parallel activities such as work, research, or social activities.", "彼女は会社で働くかたわら、夜間大学で学んでいます。", "她一边在公司工作，一边在夜校学习。", "She works at a company while also studying at night college.", "临时顺便做某事时更常用「がてら」。", "For a temporary side errand, がてら is more common."],
  "497": ["和……一起；随着……", "together with; as", "名词/普通形 + とともに", "「とともに」可表示一起进行，也可表示一个变化伴随另一个变化发生。", "とともに can mean together with, or one change occurring along with another.", "书面语感较强。", "It has a written/formal tone.", "インターネットの普及とともに、働き方も変わりました。", "随着互联网普及，工作方式也改变了。", "Along with the spread of the internet, work styles changed too.", "单纯和朋友一起做事时，日常会话常用「と一緒に」。", "For simply doing something with a friend, と一緒に is more natural in daily speech."],
  "498": ["随着……", "as; in proportion to", "名词/普通形 + につれて", "「につれて」表示随着前项变化，后项也逐渐变化。", "につれて means as the first thing changes, the second gradually changes too.", "前后多是自然变化或程度变化。", "Both clauses often describe natural or degree-based changes.", "年を取るにつれて、健康の大切さが分かってきました。", "随着年龄增长，渐渐明白健康的重要性。", "As I got older, I came to understand the importance of health.", "后项通常不是一次性动作。", "The following clause is usually not a one-time action."],
  "499": ["随着……；按照……", "as; according to", "名词/普通形 + にしたがって", "「にしたがって」表示随着前项变化后项也变化，或按照规则、指示行动。", "にしたがって means the second changes as the first changes, or acting according to rules/instructions.", "比「につれて」更可用于规则、指示。", "Compared with につれて, it more readily applies to rules or instructions.", "説明書にしたがって、機械を組み立てました。", "按照说明书组装了机器。", "I assembled the machine according to the manual.", "表示自然变化时，要确保前后有联动关系。", "For natural change, make sure the two changes are linked."],
  "500": ["伴随……；随着……", "along with; accompanying", "名词/普通形 + に伴って", "「に伴って」表示某变化或事件发生时，另一变化随之出现。", "に伴って means another change appears along with an event or change.", "常用于社会、制度、规模等正式说明。", "It is common in formal explanations about society, systems, scale, and similar topics.", "人口の増加に伴って、住宅も不足してきました。", "随着人口增加，住房也开始不足。", "As the population increased, housing also became insufficient.", "语气较正式，日常口语可用「と一緒に」「につれて」。", "It is formal; daily speech may use と一緒に or につれて."],
  "501": ["根据……；响应……", "according to; in response to", "名词 + に応じて", "「に応じて」表示根据情况、需要、能力或要求做出相应变化。", "に応じて means adjusting according to a situation, need, ability, or request.", "常用于制度、服务、调整。", "It is common for systems, services, and adjustments.", "参加者の人数に応じて、部屋の大きさを変えます。", "根据参加人数调整房间大小。", "We change the room size according to the number of participants.", "不是单纯原因，而是相应调整。", "It is not a simple cause; it means responsive adjustment."],
  "502": ["与……相反；违反……", "contrary to; against", "名词 + に反して", "「に反して」表示结果、行动或事实与期待、规则、预测相反。", "に反して means a result, action, or fact is contrary to expectations, rules, or predictions.", "常接「予想」「期待」「規則」。", "It often follows words like 予想, 期待, and 規則.", "予想に反して、試験はそれほど難しくありませんでした。", "和预想相反，考试并没有那么难。", "Contrary to expectations, the exam was not that difficult.", "不要和普通转折「でも」混同；它需要一个相反的基准。", "Do not confuse it with ordinary 'but'; it needs a contrary baseline."],
  "503": ["基于……；根据……", "based on", "名词 + に基づいて", "「に基づいて」表示以资料、事实、规则、经验等为依据。", "に基づいて means based on data, facts, rules, experience, and similar grounds.", "常用于报告、判断、计划。", "It is common in reports, judgments, and plans.", "調査結果に基づいて、新しい計画を作りました。", "基于调查结果制定了新计划。", "We made a new plan based on the survey results.", "不是随便参考，而是明确作为依据。", "It is not casual reference; it is a clear basis."],
  "504": ["遍及……；长达……", "over; throughout", "名词 + にわたって", "「にわたって」表示范围在时间、地点或领域上延伸很广。", "にわたって means a range extends over time, place, or field.", "常和数量范围一起出现。", "It often appears with quantities or ranges.", "三日間にわたって、国際会議が開かれました。", "国际会议连续举行了三天。", "An international conference was held over three days.", "不用于很小、瞬间的范围。", "It is not used for very small or momentary ranges."],
  "505": ["通过……；在……期间", "through; throughout", "名词 + を通じて", "「を通じて」表示通过某媒介、方法，或在整个期间内。", "を通じて means through a medium/method, or throughout an entire period.", "比「を通して」稍正式。", "It is slightly more formal than を通して.", "一年を通じて、この地域は雨が多いです。", "这一地区全年雨水很多。", "This region has a lot of rain throughout the year.", "表示媒介时，要说明通过什么渠道。", "When it means medium, state the channel or method."],
  "506": ["通过……；经由……", "through; via", "名词 + を通して", "「を通して」表示通过某人、组织、经验或媒介获得结果。", "を通して means obtaining a result through a person, organization, experience, or medium.", "常用于学习、交流、经验。", "It is common with learning, communication, and experience.", "留学を通して、多くの友人ができました。", "通过留学，交到了很多朋友。", "Through studying abroad, I made many friends.", "不要和单纯经过某地的「を通る」混同。", "Do not confuse it with を通る, which means pass through a place."],
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
