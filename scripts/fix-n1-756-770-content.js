const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const updates = {
  756: {
    meaningZh: "带着……；倾注……",
    meaningEn: "with; putting into; filled with",
    grammarType: "関係",
    explanationZh:
      "表示把感情、愿望、祈祷、感谢等心意放进某个行为或物品中。常用于正式、温暖或郑重的语境。",
    explanationEn:
      "Shows that a feeling, wish, prayer, gratitude, or similar emotion is put into an action or object. It often sounds warm, formal, or sincere.",
    usageNoteZh: "常接「心」「感謝」「願い」「祈り」「愛情」等抽象名词。",
    usageNoteEn: "Common with abstract nouns such as 心, 感謝, 願い, 祈り, and 愛情.",
    exampleJp: "感謝の気持ちを込めて、手紙を書きました。",
    exampleZh: "我带着感谢的心情写了这封信。",
    exampleEn: "I wrote the letter with feelings of gratitude.",
    commonMistakeZh: "不要用于单纯物理性地“放入”。表示把东西放进去通常用「入れる」。",
    commonMistakeEn: "Do not use it for simply putting a physical object inside; use 入れる for that.",
    memoryTipZh: "「込める」像把心意塞进动作里。",
    memoryTipEn: "込める feels like packing emotion into an action.",
  },
  757: {
    meaningZh: "以……为界；凭借……；用……",
    meaningEn: "as of; by means of; with",
    grammarType: "時点",
    explanationZh:
      "表示结束或开始的时间界线，也可表示正式手段、方法或依据。语气郑重，常见于通知、公告、仪式性表达。",
    explanationEn:
      "Marks a formal boundary for ending or beginning, and can also indicate a method, means, or basis. It sounds formal and often appears in notices or ceremonial wording.",
    usageNoteZh: "表示时间界线时常接日期、时间、活动；表示手段时常接「書面」「拍手」「全会一致」等。",
    usageNoteEn:
      "For time boundaries it often follows dates, times, or events; for means it often follows 書面, 拍手, 全会一致, and similar nouns.",
    exampleJp: "本日の営業は午後六時をもって終了いたします。",
    exampleZh: "本日营业将于下午六点结束。",
    exampleEn: "Today's business hours will end at 6 p.m.",
    commonMistakeZh: "不要把所有「をもって」都翻成“因为”。它更多表示界线、手段或正式依据。",
    commonMistakeEn:
      "Do not translate every をもって as 'because'; it more often marks a boundary, means, or formal basis.",
    memoryTipZh: "「もって」有“拿这个作为界线/手段”的感觉。",
    memoryTipEn: "Think of it as taking something as the boundary or means.",
  },
  758: {
    meaningZh: "围绕……；关于……发生争论或动向",
    meaningEn: "over; concerning; surrounding",
    grammarType: "関係",
    explanationZh:
      "表示以某个问题、事件、制度、利益等为中心，各方产生讨论、争论、对立或变化。",
    explanationEn:
      "Shows that discussions, disputes, conflicts, or developments are centered around an issue, event, system, or interest.",
    usageNoteZh: "常与「議論」「対立」「争い」「動き」「報道」等词搭配。",
    usageNoteEn: "Common with words such as 議論, 対立, 争い, 動き, and 報道.",
    exampleJp: "新しい制度をめぐって、議論が続いている。",
    exampleZh: "围绕新制度，讨论仍在持续。",
    exampleEn: "Debate continues over the new system.",
    commonMistakeZh: "不要和单纯的「について」完全等同；「をめぐって」常暗示多方围绕一个焦点展开。",
    commonMistakeEn:
      "Do not treat it as identical to について; をめぐって often implies multiple sides surrounding one focal issue.",
    memoryTipZh: "「めぐる」是围着转，所以事情围绕一个焦点展开。",
    memoryTipEn: "めぐる means to go around, so the issue has people or events circling around it.",
  },
  759: {
    meaningZh: "以……为开端；从……开始",
    meaningEn: "starting with; beginning with",
    grammarType: "時点",
    explanationZh:
      "表示某个事件、活动、行动成为一连串事情的开端。后面通常接持续展开或扩大的内容。",
    explanationEn:
      "Marks an event, activity, or action as the beginning of a series. The following part usually describes continuation or expansion.",
    usageNoteZh: "常用于新闻、活动安排、巡演、改革、运动等连续展开的事情。",
    usageNoteEn: "Common in news, event schedules, tours, reforms, campaigns, and other series of developments.",
    exampleJp: "東京公演を皮切りに、全国ツアーが始まった。",
    exampleZh: "以东京公演为开端，全国巡演开始了。",
    exampleEn: "Starting with the Tokyo performance, the nationwide tour began.",
    commonMistakeZh: "不要用于只发生一次、没有后续展开的事件。",
    commonMistakeEn: "Do not use it for a one-off event with no following development.",
    memoryTipZh: "「皮切り」就是切开的第一刀，引出后续一串事情。",
    memoryTipEn: "皮切り is the first cut that opens up a whole sequence.",
  },
  760: {
    meaningZh: "以……为最后；到……为止结束",
    meaningEn: "ending with; as the last",
    grammarType: "限定",
    explanationZh:
      "表示以某个时间、地点、活动或机会作为最后界线，此后不再继续。",
    explanationEn:
      "Marks a time, place, event, or opportunity as the final boundary after which something will not continue.",
    usageNoteZh: "常用于宣布服务结束、退任、停止活动、最后一次演出等。",
    usageNoteEn: "Often used to announce the end of a service, retirement, cessation of activity, or final performance.",
    exampleJp: "今月末を限りに、このサービスは終了します。",
    exampleZh: "这项服务将于本月底结束。",
    exampleEn: "This service will end at the end of this month.",
    commonMistakeZh: "不要和「に限り」混淆；「を限りに」强调最后界线，「に限り」强调限定对象。",
    commonMistakeEn:
      "Do not confuse it with に限り. を限りに marks the final boundary; に限り limits the target.",
    memoryTipZh: "「限り」画出最后一条线。",
    memoryTipEn: "限り draws the final line.",
  },
  761: {
    meaningZh: "禁不住……；不禁……",
    meaningEn: "cannot help feeling; cannot suppress",
    grammarType: "感情",
    explanationZh:
      "表示某种强烈情感无法抑制，常见于书面语。前面接「涙」「怒り」「同情」「驚き」等情感名词。",
    explanationEn:
      "Shows that a strong emotion cannot be suppressed. It is written in tone and often follows emotion nouns such as 涙, 怒り, 同情, and 驚き.",
    usageNoteZh: "常用过去形「を禁じえなかった」描述看到或听到某事后的反应。",
    usageNoteEn: "The past form を禁じえなかった is common when describing a reaction to something seen or heard.",
    exampleJp: "被災地の映像を見て、涙を禁じえなかった。",
    exampleZh: "看到灾区的影像，我不禁落泪。",
    exampleEn: "Seeing footage of the disaster area, I could not hold back tears.",
    commonMistakeZh: "「禁じえない」前面通常是情感名词，不直接接动词句。",
    commonMistakeEn: "禁じえない usually follows an emotion noun, not a full verb clause.",
    memoryTipZh: "情感强到“禁止不了”。",
    memoryTipEn: "The feeling is so strong that it cannot be restrained.",
  },
  762: {
    meaningZh: "被迫……；不得不……",
    meaningEn: "be forced to; be compelled to",
    grammarType: "義務・当然",
    explanationZh:
      "表示由于外部原因、压力、事故或形势变化，某人或组织不得不接受某种行动或结果。",
    explanationEn:
      "Shows that a person or organization is forced by external reasons, pressure, accidents, or changing circumstances to accept an action or result.",
    usageNoteZh: "主语是被迫的一方，前面多接「変更」「中止」「延期」「撤退」等名词。",
    usageNoteEn:
      "The subject is the side being forced. It often follows nouns such as 変更, 中止, 延期, and 撤退.",
    exampleJp: "台風の影響で、計画の変更を余儀なくされた。",
    exampleZh: "受台风影响，计划被迫变更。",
    exampleEn: "Because of the typhoon, we were forced to change the plan.",
    commonMistakeZh: "不要和「余儀なくさせる」混淆；「される」是被迫的一方作主语。",
    commonMistakeEn:
      "Do not confuse it with 余儀なくさせる. With される, the forced side is the subject.",
    memoryTipZh: "「される」说明压力落到主语身上。",
    memoryTipEn: "される shows that the pressure falls on the subject.",
  },
  763: {
    meaningZh: "迫使……；使……不得不……",
    meaningEn: "force someone to; compel",
    grammarType: "結果",
    explanationZh:
      "表示某种原因、事件或形势迫使他人或组织采取某行动。主语通常是造成压力的因素。",
    explanationEn:
      "Shows that a cause, event, or situation forces someone or an organization to take an action. The subject is usually the pressure-causing factor.",
    usageNoteZh: "句子常写成「AはBにCを余儀なくさせた」。",
    usageNoteEn: "A common pattern is AはBにCを余儀なくさせた.",
    exampleJp: "急激な円安は、多くの企業に価格改定を余儀なくさせた。",
    exampleZh: "日元急剧贬值迫使许多企业调整价格。",
    exampleEn: "The sharp depreciation of the yen forced many companies to revise prices.",
    commonMistakeZh: "「させる」强调造成压力的一方，不要把被迫的一方误作主语。",
    commonMistakeEn:
      "させる highlights the forcing cause; do not make the forced side the subject by mistake.",
    memoryTipZh: "「させる」就是“让别人别无选择”。",
    memoryTipEn: "させる means making someone have no other choice.",
  },
  764: {
    meaningZh: "不顾……；无视……",
    meaningEn: "regardless of; despite",
    grammarType: "逆接・譲歩",
    explanationZh:
      "表示不理会周围的担心、批评、期待或状况，仍然按自己的方式行动。",
    explanationEn:
      "Shows that someone acts in their own way while ignoring surrounding worries, criticism, expectations, or circumstances.",
    usageNoteZh: "常接「心配」「批判」「期待」「反対」「混乱」等名词。",
    usageNoteEn: "Common with nouns such as 心配, 批判, 期待, 反対, and 混乱.",
    exampleJp: "周囲の心配をよそに、彼は一人で山へ向かった。",
    exampleZh: "他不顾周围人的担心，独自去了山里。",
    exampleEn: "Ignoring the worries of those around him, he headed into the mountains alone.",
    commonMistakeZh: "不要用于单纯的“不知道”。它强调明知或存在某情况却置之不理。",
    commonMistakeEn:
      "Do not use it for simply not knowing something; it means acting while disregarding an existing situation.",
    memoryTipZh: "「よそ」有“放到一边”的感觉。",
    memoryTipEn: "よそ suggests putting something aside.",
  },
  765: {
    meaningZh: "不把……当回事；不畏……",
    meaningEn: "undeterred by; in defiance of",
    grammarType: "逆接・譲歩",
    explanationZh:
      "表示面对困难、危险、反对、恶劣条件等仍毫不退缩地行动，带有积极评价。",
    explanationEn:
      "Shows acting without backing down despite difficulty, danger, opposition, or harsh conditions. It often carries a positive evaluation.",
    usageNoteZh: "常接「困難」「悪天候」「けが」「批判」「危険」等名词。",
    usageNoteEn: "Common with nouns such as 困難, 悪天候, けが, 批判, and 危険.",
    exampleJp: "強風をものともせず、選手たちは最後まで走り続けた。",
    exampleZh: "选手们不畏强风，坚持跑到了最后。",
    exampleEn: "Undeterred by the strong wind, the athletes kept running to the end.",
    commonMistakeZh: "不要和「をよそに」混淆；「をものともせず」更偏向克服困难的正面描写。",
    commonMistakeEn:
      "Do not confuse it with をよそに. をものともせず more positively describes overcoming difficulty.",
    memoryTipZh: "“没把困难当成一回事”就是「ものともせず」。",
    memoryTipEn: "It means treating the obstacle as if it were nothing.",
  },
  766: {
    meaningZh: "不顾……；不考虑……",
    meaningEn: "without regard to; disregarding",
    grammarType: "逆接・譲歩",
    explanationZh:
      "表示不考虑危险、后果、利益、牺牲等就采取行动。语气可褒可贬，取决于上下文。",
    explanationEn:
      "Shows acting without considering danger, consequences, benefit, sacrifice, or similar factors. The tone can be positive or negative depending on context.",
    usageNoteZh: "常接「危険」「損得」「犠牲」「迷惑」「自分の身」等名词。",
    usageNoteEn: "Common with nouns such as 危険, 損得, 犠牲, 迷惑, and 自分の身.",
    exampleJp: "彼は危険を顧みず、川に飛び込んだ。",
    exampleZh: "他不顾危险，跳进了河里。",
    exampleEn: "He jumped into the river without regard for the danger.",
    commonMistakeZh: "「顧みる」是回头看、顾及；否定后表示不顾及。",
    commonMistakeEn: "顧みる means to look back on or consider; the negative form means disregarding.",
    memoryTipZh: "不回头看危险，直接行动。",
    memoryTipEn: "The image is acting without looking back at the danger.",
  },
  768: {
    meaningZh: "根据……；在……基础上",
    meaningEn: "based on; taking into account",
    grammarType: "関係",
    explanationZh:
      "表示把事实、结果、意见、经验等作为判断或行动的基础。常用于报告、提案、说明。",
    explanationEn:
      "Shows that facts, results, opinions, or experience are used as the basis for a judgment or action. Common in reports, proposals, and explanations.",
    usageNoteZh: "常接「結果」「意見」「経験」「状況」「反省」等名词。",
    usageNoteEn: "Common with nouns such as 結果, 意見, 経験, 状況, and 反省.",
    exampleJp: "調査結果を踏まえて、計画を見直します。",
    exampleZh: "我们将根据调查结果重新审视计划。",
    exampleEn: "We will review the plan based on the survey results.",
    commonMistakeZh: "不要只翻成“踩着”。这里的「踏まえる」是“依据、考虑”。",
    commonMistakeEn: "Do not read it literally as stepping on; 踏まえる here means to base something on or take into account.",
    memoryTipZh: "脚踩在事实上，再往前做判断。",
    memoryTipEn: "Stand on the facts before making the next judgment.",
  },
  769: {
    meaningZh: "以……为首；包括……在内",
    meaningEn: "starting with; including",
    grammarType: "例示",
    explanationZh:
      "举出代表性成员，并暗示还有其他同类成员。常用于正式介绍人员、地区、机构、事物群。",
    explanationEn:
      "Presents a representative member and implies that other similar members are included. Often used formally for people, regions, organizations, or groups of things.",
    usageNoteZh: "后面常接表示复数或范围的表达，如「多くの人」「各地」「関係者」。",
    usageNoteEn:
      "Often followed by plural or range expressions such as 多くの人, 各地, and 関係者.",
    exampleJp: "校長先生をはじめ、多くの方々が式に出席した。",
    exampleZh: "以校长为首，许多人出席了仪式。",
    exampleEn: "Many people, including the principal, attended the ceremony.",
    commonMistakeZh: "它不是单纯“开始做某事”，而是列举代表成员。",
    commonMistakeEn: "It does not simply mean to start doing something; it lists a representative member.",
    memoryTipZh: "先点名一个代表，再带出同类一群。",
    memoryTipEn: "Name one representative first, then include the group around it.",
  },
  770: {
    meaningZh: "以……为代表的；包括……在内的",
    meaningEn: "including; represented by",
    grammarType: "例示",
    explanationZh:
      "修饰后面的名词，表示“以某代表为首的一类”。常用于正式说明范围或群体。",
    explanationEn:
      "Modifies a following noun and means a group represented by the named example. It is often used to formally define a range or category.",
    usageNoteZh: "后面需要接名词，如「観光地」「企業」「作品」「専門家」。",
    usageNoteEn: "It needs a following noun, such as 観光地, 企業, 作品, or 専門家.",
    exampleJp: "京都をはじめとする観光地では、外国人旅行者が増えている。",
    exampleZh: "在以京都为代表的观光地，外国游客正在增加。",
    exampleEn: "In tourist destinations including Kyoto, the number of foreign travelers is increasing.",
    commonMistakeZh: "「をはじめ」可以停顿接句子；「をはじめとする」后面通常要接名词。",
    commonMistakeEn:
      "をはじめ can pause before a clause; をはじめとする usually modifies a following noun.",
    memoryTipZh: "「とする」把前面的代表包装成后面名词的修饰语。",
    memoryTipEn: "とする turns the representative example into a modifier for the next noun.",
  },
};

function applyLegacyFields(item) {
  item.meaningCn = item.meaningZh;
  item.explanation = item.explanationZh;
  item.usageNote = item.usageNoteZh;
  item.exampleCn = item.exampleZh;
  item.commonMistake = item.commonMistakeZh;
  item.memoryTip = item.memoryTipZh;
}

for (const [id, patch] of Object.entries(updates)) {
  const item = grammar.find((entry) => entry.id === id);
  if (!item) throw new Error(`Missing grammar id ${id}`);
  Object.assign(item, patch);
  applyLegacyFields(item);
}

fs.writeFileSync(grammarPath, JSON.stringify(grammar, null, 2) + "\n");
