const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const redirectsPath = path.join(__dirname, "../src/data/grammar-dedupe-redirects.json");

const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));
const redirects = JSON.parse(fs.readFileSync(redirectsPath, "utf8"));

const updates = {
  567: {
    meaningZh: "原计划……；原本预定……",
    meaningEn: "was scheduled to; had planned to",
    structure: "动词辞书形 + 予定だった / 名词 + の予定だった",
    explanationZh:
      "表示过去已经安排好的计划。常用于说明原定事项后来因为情况变化而推迟、取消或没有按预定发展。",
    explanationEn:
      "Shows a plan or schedule that had already been set in the past, often with the nuance that things later changed or did not go as planned.",
    usageNoteZh: "后句常接「が」「けれど」说明变化，也可以单独陈述原本安排。",
    usageNoteEn:
      "It is often followed by が or けれど to explain the change, but it can also simply state the original schedule.",
    exampleJp: "本当は今日中に資料を送る予定だったが、確認に時間がかかった。",
    exampleZh: "原本计划今天之内发送资料，但确认花了时间。",
    exampleEn: "I was supposed to send the materials today, but the checks took time.",
    commonMistakeZh: "不要把它当成现在的计划。现在仍然有效的计划用「予定だ」，已经发生变化的原计划用「予定だった」。",
    commonMistakeEn:
      "Do not use it for a current plan. Use 予定だ for an active plan, and 予定だった for a plan that existed in the past.",
    memoryTipZh: "看到「だった」就想成“原本排在日程上”。",
    memoryTipEn: "The past だった points to something that was once on the schedule.",
  },
  568: {
    meaningZh: "并非计划……；没有……的安排",
    meaningEn: "is not scheduled to; is not planned to",
    structure: "动词辞书形 + 予定ではない / 名词 + の予定ではない",
    explanationZh:
      "表示某件事不在当前安排或计划之中。语气比单纯的否定更强调“没有这样的日程安排”。",
    explanationEn:
      "States that something is not part of the current schedule or plan, emphasizing that there is no such arrangement.",
    usageNoteZh: "常用于说明会议、施工、发布、访问等正式安排。",
    usageNoteEn: "Common with formal schedules such as meetings, construction, releases, or visits.",
    exampleJp: "この建物は今年中に完成する予定ではない。",
    exampleZh: "这栋建筑没有计划在今年内完工。",
    exampleEn: "This building is not scheduled to be completed within this year.",
    commonMistakeZh: "「つもりではない」偏向个人意图，「予定ではない」偏向客观日程或安排。",
    commonMistakeEn:
      "つもりではない focuses on personal intention, while 予定ではない focuses on an objective schedule or arrangement.",
    memoryTipZh: "「予定」看日程表，不看心情。",
    memoryTipEn: "予定 belongs to the schedule, not the speaker's feelings.",
  },
  569: {
    meaningZh: "原本不是计划……；并非原定……",
    meaningEn: "was not scheduled to; had not been planned to",
    structure: "动词辞书形 + 予定ではなかった / 名词 + の予定ではなかった",
    explanationZh:
      "表示某结果和原本的安排不同，或说明某事并不是一开始就计划好的。",
    explanationEn:
      "Shows that the actual result differed from the original arrangement, or that something had not been planned at first.",
    usageNoteZh: "适合用于解释突发变更、临时追加、时间延长等情况。",
    usageNoteEn: "Useful for explaining sudden changes, added tasks, or unexpected extensions.",
    exampleJp: "会議はこんなに長くなる予定ではなかった。",
    exampleZh: "会议原本没有计划开这么久。",
    exampleEn: "The meeting was not supposed to last this long.",
    commonMistakeZh: "不要和「予定だった」混淆；前者否定原计划，后者说明原本有计划。",
    commonMistakeEn:
      "Do not confuse it with 予定だった. This form denies an original plan; 予定だった states that there was one.",
    memoryTipZh: "「ではなかった」把“原定如此”这件事否定掉。",
    memoryTipEn: "ではなかった negates the idea that it was originally planned.",
  },
  570: {
    meaningZh: "并不是打算……；没有……的意思",
    meaningEn: "do not mean to; have no intention of",
    structure: "动词辞书形 + つもりではない / 名词 + のつもりではない",
    explanationZh:
      "用于澄清自己的意图，说明某个行为或说法并不是出于对方理解的那种目的。",
    explanationEn:
      "Clarifies the speaker's intention, explaining that an action or statement was not meant in the way the listener may have understood it.",
    usageNoteZh: "常用于解释、缓和语气或避免误会，如道歉、说明立场时。",
    usageNoteEn:
      "Often used to explain oneself, soften the tone, or prevent misunderstanding, especially in apologies or position statements.",
    exampleJp: "あなたを責めるつもりではないので、まず事情を聞きたい。",
    exampleZh: "我并不是要责备你，所以想先听听情况。",
    exampleEn: "I do not mean to blame you, so I would like to hear what happened first.",
    commonMistakeZh: "「予定ではない」说日程没有安排，「つもりではない」说自己没有这个意图。",
    commonMistakeEn:
      "予定ではない says there is no plan on the schedule; つもりではない says the speaker does not intend it.",
    memoryTipZh: "「つもり」放在心里，所以重点是本意。",
    memoryTipEn: "つもり lives in the speaker's mind, so the focus is intention.",
  },
  571: {
    meaningZh: "原本没打算……；并非本意",
    meaningEn: "did not mean to; had not intended to",
    structure: "动词辞书形 + つもりではなかった / 名词 + のつもりではなかった",
    explanationZh:
      "表示某行为已经发生，但说话人强调那并不是自己原本的意图。",
    explanationEn:
      "Used after something has happened to stress that it was not the speaker's original intention.",
    usageNoteZh: "常用于解释失言、泄露、冒犯、迟到等并非故意的行为。",
    usageNoteEn:
      "Common when explaining an unintended remark, disclosure, offense, delay, or similar action.",
    exampleJp: "秘密を話すつもりではなかったが、つい口に出てしまった。",
    exampleZh: "我原本没打算说出秘密，但不小心脱口而出了。",
    exampleEn: "I did not mean to reveal the secret, but it slipped out.",
    commonMistakeZh: "它不是普通过去式的“打算了”，而是强调“本来不是这个意思”。",
    commonMistakeEn:
      "This is not just the past of 'intend'; it stresses that the action was not what the speaker meant to do.",
    memoryTipZh: "「つい」和「つもりではなかった」常一起出现，表示并非故意。",
    memoryTipEn: "つい often pairs naturally with つもりではなかった to show an unintended action.",
  },
  583: {
    meaningZh: "按理不该……；不应是……",
    meaningEn: "is not supposed to; should not be the case",
    structure: "普通形 + はずではない / 名词 + のはずではない / な形容词 + なはずではない",
    grammarType: "推量・様態",
    explanationZh:
      "表示根据已有信息推断，某件事不应该是这样的状态。带有“和预期不符”的语气。",
    explanationEn:
      "Expresses that, based on the available information, something should not be in that state. It carries a nuance of mismatch with expectation.",
    usageNoteZh: "比「はずがない」更偏向“安排或推断上不应如此”，语气常用于说明异常。",
    usageNoteEn:
      "Compared with はずがない, this form more often points to something being wrong relative to an arrangement or expectation.",
    exampleJp: "この資料は外部に出るはずではない。",
    exampleZh: "这份资料按理不应该流到外部。",
    exampleEn: "This document is not supposed to leave the company.",
    commonMistakeZh: "不要把「名词 + はず」直接接成「名词はず」；名词前通常要加「の」。",
    commonMistakeEn: "Do not attach a noun directly to はず; nouns normally take の before はず.",
    memoryTipZh: "「はず」是推断，「ではない」是否定这个应然状态。",
    memoryTipEn: "はず is expectation; ではない denies that expected state.",
  },
  584: {
    meaningZh: "原本不该……；按理本不应……",
    meaningEn: "was not supposed to; should not have been the case",
    structure: "普通形 + はずではなかった / 名词 + のはずではなかった / な形容词 + なはずではなかった",
    grammarType: "推量・様態",
    explanationZh:
      "表示实际发生的事和原本推断、安排或预期相反，强调“本来不该这样”。",
    explanationEn:
      "Shows that what actually happened went against the original expectation, arrangement, or reasoning.",
    usageNoteZh: "常用于回顾已经发生的偏差、事故、误判或计划外结果。",
    usageNoteEn: "Common when looking back on deviations, accidents, misjudgments, or unplanned outcomes.",
    exampleJp: "この道はこんなに混むはずではなかった。",
    exampleZh: "这条路原本不该这么堵。",
    exampleEn: "This road was not supposed to be this crowded.",
    commonMistakeZh: "「はずだった」说原本预期会发生；「はずではなかった」说原本预期不会这样。",
    commonMistakeEn:
      "はずだった says something was expected to happen; はずではなかった says it was not expected to be this way.",
    memoryTipZh: "过去否定形让“预期落空”的感觉更强。",
    memoryTipEn: "The past negative form strongly signals a failed expectation.",
  },
  596: {
    meaningZh: "为我方做……；对方 kindly 做……",
    meaningEn: "someone kindly does something for me/us",
    structure: "动词て形 + くださる",
    explanationZh:
      "「くださる」是「くれる」的尊敬语，表示上级、老师、客人等为说话人一方做某事。",
    explanationEn:
      "くださる is the respectful form of くれる, used when a superior, teacher, customer, or respected person does something for the speaker's side.",
    usageNoteZh: "日常礼貌表达常用过去礼貌形「てくださいました」。命令形「ください」另作请求表达。",
    usageNoteEn:
      "The polite past form てくださいました is very common. The imperative-like ください is also used separately for requests.",
    exampleJp: "先生が推薦状を書いてくださった。",
    exampleZh: "老师为我写了推荐信。",
    exampleEn: "My teacher kindly wrote a recommendation letter for me.",
    commonMistakeZh: "不要和「ていただく」混淆；「くださる」以对方为主语，「いただく」以自己一方为主语。",
    commonMistakeEn:
      "Do not confuse it with ていただく. With くださる, the giver is the subject; with いただく, the speaker's side is the subject.",
    memoryTipZh: "「くださる」从对方那里“下来”给我方。",
    memoryTipEn: "くださる frames the favor as coming down from the respected giver to the speaker's side.",
  },
  629: {
    meaningZh: "忍不住做了……；不能不……",
    meaningEn: "could not help doing; could not resist",
    structure: "动词ない形 + ないではいられなかった",
    explanationZh:
      "表示受到强烈情绪、刺激或情况推动，过去无法抑制自己不去做某事。",
    explanationEn:
      "Shows that in the past the speaker could not suppress an action because of strong emotion, stimulus, or circumstances.",
    usageNoteZh: "常和笑う、泣く、言う、確認する、心配する等动词搭配。",
    usageNoteEn: "Common with verbs such as laugh, cry, say, check, or worry.",
    exampleJp: "その話を聞いて、笑わないではいられませんでした。",
    exampleZh: "听了那件事，我忍不住笑了。",
    exampleEn: "When I heard that story, I could not help laughing.",
    commonMistakeZh: "形式上是否定，意思却是“忍不住做了”。不要翻成“没有做”。",
    commonMistakeEn: "Although the form contains a negative, the meaning is that the action did happen.",
    memoryTipZh: "“不做这件事就待不住”就是忍不住做。",
    memoryTipEn: "Think: 'I could not remain without doing it.'",
  },
  630: {
    meaningZh: "不能不……；忍不住……",
    meaningEn: "cannot help doing; cannot resist",
    structure: "动词ない形去掉ない + ずにはいられない",
    explanationZh:
      "表示情绪或状况强烈到无法克制，结果一定会做某事。语气较书面。",
    explanationEn:
      "Shows that an emotion or situation is so strong that one cannot refrain from doing something. It has a somewhat written tone.",
    usageNoteZh: "「する」变成「せずにはいられない」，不是「しず」。",
    usageNoteEn: "する becomes せずにはいられない, not しず.",
    exampleJp: "あの映画を見ると、泣かずにはいられません。",
    exampleZh: "一看那部电影就忍不住哭。",
    exampleEn: "Whenever I watch that movie, I cannot help crying.",
    commonMistakeZh: "不要漏掉「に」；固定形式是「ずにはいられない」。",
    commonMistakeEn: "Do not drop に; the fixed pattern is ずにはいられない.",
    memoryTipZh: "「ず」是古风否定，整句反而表示“非做不可”。",
    memoryTipEn: "ず is an old-style negative, but the whole phrase means the action is unavoidable.",
  },
  631: {
    meaningZh: "忍不住做了……；当时不能不……",
    meaningEn: "could not help doing; could not resist at the time",
    structure: "动词ない形去掉ない + ずにはいられなかった",
    explanationZh:
      "表示过去某个时刻因为感情或情况太强，无法克制自己，最终做了某事。",
    explanationEn:
      "Shows that at a past moment, the speaker could not hold back because the emotion or situation was too strong.",
    usageNoteZh: "比现在形更强调已经发生的反应或行动。",
    usageNoteEn: "The past form emphasizes an action or reaction that already happened.",
    exampleJp: "友人の成功を聞いて、喜ばずにはいられませんでした。",
    exampleZh: "听到朋友成功的消息，我忍不住高兴起来。",
    exampleEn: "When I heard about my friend's success, I could not help feeling happy.",
    commonMistakeZh: "和「ないではいられなかった」意思接近，但「ずには」更书面。",
    commonMistakeEn:
      "It is close to ないではいられなかった, but ずには sounds more written.",
    memoryTipZh: "过去的「いられなかった」说明当时已经忍不住了。",
    memoryTipEn: "The past いられなかった shows the speaker could not hold back then.",
  },
  645: {
    meaningZh: "叫作……；说……（「言う」的谦让语）",
    meaningEn: "to be called; to say, humble form of 言う",
    structure: "名词 + と申す / 内容 + と申す",
    explanationZh:
      "「申す」是「言う」的谦让语。介绍自己的姓名、所属，或正式转述自己一方的话时使用。",
    explanationEn:
      "申す is the humble form of 言う. It is used to introduce one's name or affiliation, or to humbly state something from one's own side.",
    usageNoteZh: "自我介绍时常用「〜と申します」。不能用来抬高对方的发言。",
    usageNoteEn:
      "〜と申します is common in self-introductions. Do not use it to honor someone else's speech.",
    exampleJp: "私は営業部の田中と申します。",
    exampleZh: "我是营业部的田中。",
    exampleEn: "My name is Tanaka from the sales department.",
    commonMistakeZh: "对方“说”不能说「先生が申しました」，应使用「おっしゃいました」。",
    commonMistakeEn:
      "Do not say 先生が申しました for what a teacher said; use おっしゃいました.",
    memoryTipZh: "「申す」把自己的“说”放低。",
    memoryTipEn: "申す lowers the speaker's own act of saying.",
  },
  646: {
    meaningZh: "谨致……；郑重地说/表达",
    meaningEn: "to humbly say or express; to offer respectfully",
    structure: "名词 + を申し上げる / 内容 + と申し上げる",
    explanationZh:
      "「申し上げる」是更郑重的谦让表达，常用于感谢、道歉、祝贺、报告等正式场合。",
    explanationEn:
      "申し上げる is a more formal humble expression, often used for thanks, apologies, congratulations, reports, and formal statements.",
    usageNoteZh: "固定搭配很多，如「お礼申し上げます」「お詫び申し上げます」。",
    usageNoteEn:
      "It appears in many fixed phrases such as お礼申し上げます and お詫び申し上げます.",
    exampleJp: "ご支援いただき、心より御礼申し上げます。",
    exampleZh: "承蒙支持，谨致衷心感谢。",
    exampleEn: "We sincerely thank you for your support.",
    commonMistakeZh: "不要把它当普通的「上げる」。这里不是“给上去”，而是谦让地表达。",
    commonMistakeEn:
      "Do not read it as the ordinary verb 上げる; here it is a humble expression.",
    memoryTipZh: "商务邮件里的“郑重表达”常用「申し上げる」。",
    memoryTipEn: "Think of 申し上げる as formal wording for business messages.",
  },
  647: {
    meaningZh: "知道；认为（「知る/思う」的谦让语）",
    meaningEn: "to know; to think, humble form of 知る/思う",
    structure: "名词/内容 + を存じる / 内容 + と存じる",
    explanationZh:
      "「存じる」用于谦让地表达“知道”或“认为”。正式场合中常用「存じております」。",
    explanationEn:
      "存じる humbly expresses knowing or thinking. The polite form 存じております is common in formal situations.",
    usageNoteZh: "表示“不知道”时常说「存じません」。",
    usageNoteEn: "For 'I do not know,' 存じません is commonly used.",
    exampleJp: "その件については存じております。",
    exampleZh: "关于那件事，我是知道的。",
    exampleEn: "I am aware of that matter.",
    commonMistakeZh: "「ご存じだ」是尊敬语，用于对方知道；「存じる」是自己一方知道。",
    commonMistakeEn:
      "ご存じだ is respectful and refers to someone else's knowing; 存じる is humble and refers to one's own side.",
    memoryTipZh: "有「ご」多半抬高对方，没「ご」的「存じる」放低自己。",
    memoryTipEn: "ご存じ raises the other person; 存じる lowers the speaker's side.",
  },
  648: {
    meaningZh: "拜见；拜读；看（「見る」的谦让语）",
    meaningEn: "to see/read, humble form of 見る",
    structure: "名词 + を拝見する",
    explanationZh:
      "「拝見する」用于谦让地表示自己看对方的人、资料、作品、邮件等。",
    explanationEn:
      "拝見する humbly expresses that the speaker sees or reads someone else's materials, work, message, or presence.",
    usageNoteZh: "既可用于看人，也可用于看文件、作品、网页等对象。",
    usageNoteEn: "It can be used for seeing a person or reading/viewing documents, works, webpages, and similar objects.",
    exampleJp: "事前に資料を拝見しました。",
    exampleZh: "我事先拜读了资料。",
    exampleEn: "I looked over the materials in advance.",
    commonMistakeZh: "不要说「先生が資料を拝見しました」来抬高老师；老师看资料应说「ご覧になりました」。",
    commonMistakeEn:
      "Do not use 拝見しました to honor a teacher's action; use ご覧になりました for the teacher viewing something.",
    memoryTipZh: "「拝」有谦恭低头看的感觉。",
    memoryTipEn: "拝 carries the image of looking with humility.",
  },
  649: {
    meaningZh: "聆听（「聞く」的谦让语）",
    meaningEn: "to listen to, humble form of 聞く",
    structure: "名词 + を拝聴する",
    explanationZh:
      "「拝聴する」用于谦让地表示自己听演讲、讲话、意见、说明等。",
    explanationEn:
      "拝聴する humbly expresses listening to a lecture, speech, opinion, explanation, or similar content.",
    usageNoteZh: "比「聞く」正式，常见于演讲会、会议、致辞后的表达。",
    usageNoteEn: "It is more formal than 聞く and often appears after lectures, meetings, or speeches.",
    exampleJp: "先生の講演を拝聴しました。",
    exampleZh: "我聆听了老师的讲演。",
    exampleEn: "I listened to the teacher's lecture.",
    commonMistakeZh: "日常听音乐通常不用「拝聴する」，除非要表达非常正式或恭敬的语气。",
    commonMistakeEn:
      "Do not usually use 拝聴する for casually listening to music unless a very formal or respectful tone is intended.",
    memoryTipZh: "「聴」强调认真听，「拝」让语气更谦让。",
    memoryTipEn: "聴 emphasizes attentive listening; 拝 makes the tone humble.",
  },
  650: {
    meaningZh: "拜收；收到（「受け取る」的谦让语）",
    meaningEn: "to receive humbly",
    structure: "名词 + を拝受する",
    explanationZh:
      "「拝受する」是正式邮件、商务往来中表示自己收到文件、通知、物品的谦让语。",
    explanationEn:
      "拝受する is a formal humble verb used in emails and business settings to say that one has received a document, notice, or item.",
    usageNoteZh: "邮件中常写「確かに拝受いたしました」。",
    usageNoteEn: "In email, 確かに拝受いたしました is a common phrase.",
    exampleJp: "ご案内のメールを拝受しました。",
    exampleZh: "我已拜收您的通知邮件。",
    exampleEn: "I received your information email.",
    commonMistakeZh: "它表示自己收到了对方给的东西，不能用于“给对方发送”。",
    commonMistakeEn: "It means the speaker received something; it is not used for sending something to the other person.",
    memoryTipZh: "「受」就是收到，「拝」让收到这件事更谦恭。",
    memoryTipEn: "受 means receive; 拝 makes the receiving humble.",
  },
  651: {
    meaningZh: "借用；占用（「借りる」的谦让语）",
    meaningEn: "to borrow humbly; to take up someone's time",
    structure: "名词 + を拝借する",
    explanationZh:
      "「拝借する」用于谦让地表示向对方借物品，也可用于「お時間を拝借する」表示占用时间。",
    explanationEn:
      "拝借する humbly expresses borrowing something from someone, and お時間を拝借する means taking up someone's time.",
    usageNoteZh: "常用于正式请求前，语气比「借りる」郑重。",
    usageNoteEn: "Often used before a formal request and sounds more polite than 借りる.",
    exampleJp: "少しお時間を拝借してもよろしいでしょうか。",
    exampleZh: "可以占用您一点时间吗？",
    exampleEn: "May I have a little of your time?",
    commonMistakeZh: "不要把「拝借」用于对方借东西；这是自己一方借用时的谦让语。",
    commonMistakeEn:
      "Do not use 拝借する for someone else's borrowing; it humbly describes the speaker's side borrowing.",
    memoryTipZh: "“拜托借一下”就是「拝借」。",
    memoryTipEn: "拝借 is borrowing with humility.",
  },
  661: {
    meaningZh: "不应该……；不是该……的事",
    meaningEn: "should not; is not something one should do",
    structure: "动词辞书形 + ものではない",
    grammarType: "義務・当然",
    explanationZh:
      "用于从常识、道德或社会规范角度劝告对方不要做某事，语气带有训诫感。",
    explanationEn:
      "Used to advise against doing something from the viewpoint of common sense, morals, or social norms. It has an admonishing tone.",
    usageNoteZh: "多用于一般规则，不太用于单纯描述个人喜好。",
    usageNoteEn: "Mostly used for general rules or norms, not simply for personal likes or dislikes.",
    exampleJp: "人の努力を笑うものではない。",
    exampleZh: "不应该嘲笑别人的努力。",
    exampleEn: "One should not laugh at someone else's effort.",
    commonMistakeZh: "不要和「ものがない」混淆；这里的「もの」不是具体物品。",
    commonMistakeEn: "Do not confuse it with ものがない; もの here is not a concrete object.",
    memoryTipZh: "「ものではない」像是在说“这不是人该做的事”。",
    memoryTipEn: "Think of it as: 'That is not the kind of thing one should do.'",
  },
  662: {
    meaningZh: "不是因为……就该……；不是需要……的事",
    meaningEn: "is not something to; does not call for",
    structure: "动词辞书形 + ことではない",
    grammarType: "義務・当然",
    explanationZh:
      "用于说明某种反应或行动没有必要，常带有安慰、提醒或纠正过度反应的语气。",
    explanationEn:
      "Used to say that a certain reaction or action is not necessary, often to reassure someone or correct an overreaction.",
    usageNoteZh: "比「ものではない」更偏向具体事情的判断，而不是社会规范。",
    usageNoteEn:
      "Compared with ものではない, this focuses more on judging a concrete matter than stating a social norm.",
    exampleJp: "一度失敗したくらいで、あきらめることではない。",
    exampleZh: "不过失败了一次，并不是就该放弃的事。",
    exampleEn: "Failing once is not something that calls for giving up.",
    commonMistakeZh: "不要把它理解成普通名词短语；句尾的「ことではない」是在评价前面的行动是否必要。",
    commonMistakeEn:
      "Do not read it as a simple noun phrase; sentence-final ことではない judges whether the preceding action is called for.",
    memoryTipZh: "「こと」指这件事本身，后面否定“没必要到那一步”。",
    memoryTipEn: "こと points to the matter itself, and the phrase denies that such a reaction is necessary.",
  },
  663: {
    meaningZh: "绝不……；怎么会……呢",
    meaningEn: "absolutely not; as if I would",
    structure: "普通形 + ものか / もんか",
    grammarType: "否定",
    explanationZh:
      "用反问形式强烈否定某事。口语中「もんか」更随意，常带有生气、不服或坚决拒绝的语气。",
    explanationEn:
      "Strongly denies something through a rhetorical question. もんか is more casual and often sounds angry, defiant, or firmly rejecting.",
    usageNoteZh: "正式文章中少用；说话时语气很强，要注意场合。",
    usageNoteEn: "It is uncommon in formal writing and sounds strong in speech, so use it carefully.",
    exampleJp: "こんな不公平な条件を受け入れるものか。",
    exampleZh: "这种不公平的条件，我怎么可能接受。",
    exampleEn: "As if I would accept such unfair conditions.",
    commonMistakeZh: "句末虽然有「か」，但不是普通提问，而是强烈否定。",
    commonMistakeEn: "Although it ends with か, it is not a normal question; it is a strong denial.",
    memoryTipZh: "「ものか」可以想成“哪有这种事”。",
    memoryTipEn: "Think of ものか as 'No way that would happen.'",
  },
  664: {
    meaningZh: "多么……啊；不知道有多……",
    meaningEn: "how very; I cannot tell you how",
    structure: "疑问词 + 普通形 + ことか",
    grammarType: "程度",
    explanationZh:
      "和疑问词搭配，表示强烈感叹。常用于回顾辛苦、喜悦、担心等程度很深的经历。",
    explanationEn:
      "Used with an interrogative word to express strong exclamation, often looking back on intense hardship, joy, worry, or similar feelings.",
    usageNoteZh: "常见搭配有「どれほど〜ことか」「何度〜ことか」「どんなに〜ことか」。",
    usageNoteEn: "Common forms include どれほど〜ことか, 何度〜ことか, and どんなに〜ことか.",
    exampleJp: "合格の知らせを聞いて、どれほど嬉しかったことか。",
    exampleZh: "听到合格的消息时，不知道有多高兴。",
    exampleEn: "I cannot tell you how happy I was when I heard I had passed.",
    commonMistakeZh: "不要漏掉前面的疑问词；没有疑问词时感叹语气会不自然。",
    commonMistakeEn: "Do not omit the interrogative word; without it the exclamatory tone sounds unnatural.",
    memoryTipZh: "「疑问词 + ことか」不是提问，是感叹程度。",
    memoryTipEn: "Interrogative + ことか is not asking; it is exclaiming degree.",
  },
  665: {
    meaningZh: "如果能……的话；要是可以……",
    meaningEn: "if it were possible to; if one could",
    structure: "可能形 + ものなら / 动词意志形 + ものなら",
    grammarType: "条件",
    explanationZh:
      "表示现实中很难做到的假设，常带有“如果真能那样就好了”的语气。接意志形时可表示挑战或警告。",
    explanationEn:
      "Expresses a hypothetical situation that is difficult or unlikely in reality, often with a wishful nuance. With volitional forms, it can sound like a challenge or warning.",
    usageNoteZh: "表示愿望时多接可能形；表示“你敢……试试看”时可接意志形。",
    usageNoteEn: "Use the potential form for wishes; use the volitional form for a challenge-like nuance.",
    exampleJp: "戻れるものなら、もう一度あの日に戻りたい。",
    exampleZh: "如果能回去的话，我想再回到那一天。",
    exampleEn: "If I could go back, I would like to return to that day once more.",
    commonMistakeZh: "不要把它当普通条件「なら」；「ものなら」常暗示实现困难。",
    commonMistakeEn: "Do not treat it as ordinary なら; ものなら often implies that realization is difficult.",
    memoryTipZh: "「ものなら」里有“要是真能做到”的感觉。",
    memoryTipEn: "ものなら carries the feeling of 'if that were really possible.'",
  },
  666: {
    meaningZh: "如果是关于……的话；说到……的话",
    meaningEn: "if it is about; when it comes to",
    structure: "名词 + のことなら / 名词 + なら",
    grammarType: "提示",
    explanationZh:
      "用于提出一个话题范围，表示在这个范围内可以给出建议、介绍人选或表达判断。",
    explanationEn:
      "Sets a topic range and says that within that range one can offer advice, name a suitable person, or make a judgment.",
    usageNoteZh: "常用于推荐“这方面问某人最好”或说明自己擅长的范围。",
    usageNoteEn:
      "Often used to recommend who to ask about a topic or to state someone's area of expertise.",
    exampleJp: "日本語の発音のことなら、佐藤さんに聞いてください。",
    exampleZh: "如果是日语发音方面的问题，请问佐藤先生。",
    exampleEn: "If it is about Japanese pronunciation, please ask Sato.",
    commonMistakeZh: "不要机械接动词辞书形；更自然的是「名词のことなら」。",
    commonMistakeEn: "Do not mechanically attach it to dictionary-form verbs; 名词のことなら is more natural.",
    memoryTipZh: "「ことなら」先圈定“这件事/这个领域”。",
    memoryTipEn: "ことなら first marks the matter or field being discussed.",
  },
  667: {
    meaningZh: "虽然……但是……",
    meaningEn: "although; even though",
    structure: "普通形 + ものの",
    grammarType: "逆接・譲歩",
    explanationZh:
      "表示前项已经成立，但后项没有出现理应期待的结果。语气偏书面。",
    explanationEn:
      "States that the first clause is true, but the expected result does not follow. It has a written tone.",
    usageNoteZh: "后句通常接困扰、未完成、判断保留等和预期相反的内容。",
    usageNoteEn:
      "The following clause often describes difficulty, incompletion, reservation, or another result contrary to expectation.",
    exampleJp: "申し込んだものの、まだ返事が来ない。",
    exampleZh: "虽然已经申请了，但还没有收到回复。",
    exampleEn: "Although I applied, I still have not received a reply.",
    commonMistakeZh: "不要和单纯转折「が」完全等同；「ものの」更强调结果落差。",
    commonMistakeEn:
      "Do not treat it as exactly the same as が; ものの emphasizes the gap between expectation and result.",
    memoryTipZh: "前面“有这么一回事”，后面却没按预期走。",
    memoryTipEn: "The first fact exists, but the result does not go as expected.",
  },
  668: {
    meaningZh: "做某事这件事的……；关于做某事的……",
    meaningEn: "the ... of doing; related to the act of doing",
    structure: "动词辞书形 + ことの + 名词",
    grammarType: "関係",
    explanationZh:
      "用「こと」把前面的动作名词化，再用「の」连接后面的名词，表示“做某事这件事的性质、难度、重要性”等。",
    explanationEn:
      "Nominalizes the preceding action with こと and links it to a following noun with の, such as the difficulty, importance, or meaning of doing something.",
    usageNoteZh: "后面多接「難しさ」「大切さ」「意味」「必要性」等抽象名词。",
    usageNoteEn: "Often followed by abstract nouns such as 難しさ, 大切さ, 意味, or 必要性.",
    exampleJp: "新しい企画を続けることの難しさを実感した。",
    exampleZh: "我切实体会到了持续推进新企划这件事的困难。",
    exampleEn: "I realized how difficult it is to keep a new project going.",
    commonMistakeZh: "它不是句末表达，后面需要接名词来完成结构。",
    commonMistakeEn: "This is not a sentence-ending expression; it needs a following noun to complete the structure.",
    memoryTipZh: "「こと」变名词，「の」再把它接到后面的名词上。",
    memoryTipEn: "こと turns the action into a noun, and の connects it to the next noun.",
  },
  669: {
    meaningZh: "明明……却；要是……就好了",
    meaningEn: "although; if only",
    structure: "普通形 + ものを",
    grammarType: "逆接・譲歩",
    explanationZh:
      "表示对已经发生的结果感到遗憾、不满或责备。常暗含“如果当时那样做就好了”。",
    explanationEn:
      "Expresses regret, dissatisfaction, or blame about an outcome, often implying that things would have been better if someone had acted differently.",
    usageNoteZh: "语气带有情绪，常用于独白或责备，不适合随便对上级使用。",
    usageNoteEn:
      "It carries emotion and often appears in monologue or blame, so it should be used carefully toward superiors.",
    exampleJp: "早く相談してくれれば助けたものを。",
    exampleZh: "你要是早点来商量，我本来可以帮你的。",
    exampleEn: "If only you had consulted me earlier, I could have helped.",
    commonMistakeZh: "不要把句末「ものを」理解成普通宾语标记「を」。这里整句表达遗憾。",
    commonMistakeEn:
      "Do not read the final ものを as the ordinary object particle を; the whole phrase expresses regret.",
    memoryTipZh: "「ものを」后面没说出口的常是“可惜啊”。",
    memoryTipEn: "After ものを, the unspoken feeling is often 'what a shame.'",
  },
  670: {
    meaningZh: "把……这件事作为宾语；表示“……这件事”",
    meaningEn: "the fact that; the act of doing as an object",
    structure: "普通形 + ことを + 动词",
    grammarType: "関係",
    explanationZh:
      "用「こと」把前面的句子名词化，再用「を」作为后面动词的宾语，常接知らせる、忘れる、覚える、願う等动词。",
    explanationEn:
      "Nominalizes the preceding clause with こと and marks it with を as the object of a following verb such as inform, forget, remember, or wish.",
    usageNoteZh: "后面必须有能接宾语的动词；单独停在「ことを」会不完整。",
    usageNoteEn: "It needs a following transitive verb; stopping at ことを leaves the sentence incomplete.",
    exampleJp: "試験に合格したことを家族に知らせた。",
    exampleZh: "我把考试合格这件事告诉了家人。",
    exampleEn: "I told my family that I had passed the exam.",
    commonMistakeZh: "不要把「ことを」误当句末语法；它通常只是名词化后的宾语部分。",
    commonMistakeEn:
      "Do not mistake ことを for a sentence-ending grammar point; it is usually a nominalized object phrase.",
    memoryTipZh: "「こと」把整句包起来，「を」交给后面的动词处理。",
    memoryTipEn: "こと packages the clause, and を hands it to the following verb.",
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

redirects["698"] = "583";
redirects["699"] = "584";
redirects["962"] = "583";
redirects["963"] = "584";

const deleted = new Set(["698", "699"]);
const nextGrammar = grammar.filter((item) => !deleted.has(item.id));

fs.writeFileSync(grammarPath, JSON.stringify(nextGrammar, null, 2) + "\n");
fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2) + "\n");
