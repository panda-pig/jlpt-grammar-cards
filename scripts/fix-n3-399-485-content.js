const fs = require("fs");
const path = require("path");

const grammarPath = path.join(__dirname, "../src/data/grammar.json");
const grammar = JSON.parse(fs.readFileSync(grammarPath, "utf8"));

const updates = {
  "399": ["不应该……", "should not", "动词辞书形 + べきではない", "「べきではない」表示从道理、责任或常识上不应该做某事。", "べきではない means something should not be done based on principle, duty, or common sense.", "语气较强，常用于建议、批评或规则。", "It is fairly strong and appears in advice, criticism, or rules.", "人の失敗を笑うべきではありません。", "不应该嘲笑别人的失败。", "You should not laugh at other people's failures.", "不要把它当成单纯禁止；它强调道理上的不应该。", "It is not just prohibition; it stresses what is improper by principle."],
  "400": ["如果不……就……", "unless; if not", "动词ない形 + ないことには", "「ないことには」提出必要前提，后项通常说明不满足前提就无法判断或行动。", "ないことには presents a necessary condition; the following clause often says judgment or action is impossible without it.", "后项常接否定或困难表达。", "The following clause often contains a negative or difficulty expression.", "実物を見ないことには、買うかどうか決められません。", "不看实物的话，无法决定买不买。", "Unless I see the actual item, I cannot decide whether to buy it.", "不是义务表达，而是必要条件。", "It is not obligation; it is a necessary condition."],
  "401": ["不……就不能……", "cannot...unless...", "动词ない形 + ないことには〜ない", "「ないことには〜ない」明确表示如果前项不成立，后项就不能实现。", "ないことには〜ない clearly means the latter cannot happen unless the former condition is met.", "常用于判断、开始行动、得出结论等。", "It is common for judgment, taking action, or reaching conclusions.", "本人に聞かないことには、本当の理由は分かりません。", "不问本人，就不知道真正原因。", "Unless we ask the person, we cannot know the real reason.", "不要和「なければならない」的必须做混同。", "Do not confuse it with obligation なければならない."],
  "402": ["忍不住……；不能不……", "cannot help doing", "动词ない形 + ないではいられない", "「ないではいられない」表示感情或冲动强到无法不做某事。", "ないではいられない means an emotion or impulse is so strong that one cannot help doing something.", "常用于笑、哭、担心、说出来等反应。", "It is common with reactions such as laughing, crying, worrying, or speaking up.", "その映画を見て、泣かないではいられませんでした。", "看了那部电影，忍不住哭了。", "After watching that movie, I could not help crying.", "不是外部义务，而是内心控制不住。", "It is not external obligation; it is an uncontrollable inner response."],
  "407": ["请别人为我方做……（谦让）", "humbly receive someone's action", "动词て形 + いただく", "「ていただく」表示承蒙对方为自己一方做某事，是「てもらう」的谦让表达。", "ていただく means humbly receiving someone doing something for the speaker's side; it is the humble form of てもらう.", "提出请求时常用「ていただけますか」。", "For requests, ていただけますか is common.", "受付で書類の書き方を教えていただきました。", "在前台请人教了文件的填写方法。", "At reception, I had someone teach me how to fill out the document.", "不要用于自己为别人做事。", "Do not use it for actions you do for others."],
  "408": ["为我方做……（尊敬）", "honorifically do something for us", "动词て形 + くださる", "「てくださる」尊敬地说明对方为自己一方做了有益的事。", "てくださる respectfully states that someone did something beneficial for the speaker's side.", "过去礼貌形是「てくださいました」。", "The polite past form is てくださいました.", "先生が面接の練習をしてくださいました。", "老师帮我练习了面试。", "The teacher kindly practiced the interview with me.", "不要和请求形式「てください」混为一谈。", "Do not confuse it with request てください."],
  "409": ["给……（谦让）", "humbly give", "名词を + さしあげる", "「さしあげる」是「あげる」的谦让语，表示自己一方给尊敬对象某物。", "さしあげる is the humble form of あげる and means the speaker's side gives something to a respected person.", "语气郑重，服务场景较常见。", "It is formal and common in service situations.", "参加者に記念品をさしあげました。", "给了参加者纪念品。", "We gave souvenirs to the participants.", "对亲近的人通常用「あげる」。", "Use あげる with close people in ordinary speech."],
  "410": ["做；する的尊敬语", "honorific do", "名词を + なさる / ご + 名词 + なさる", "「なさる」是「する」的尊敬语，用于尊敬地描述对方动作。", "なさる is the honorific form of する, used for another person's action.", "礼貌形是特殊变化「なさいます」。", "The polite form is the irregular なさいます.", "先生は毎朝、研究をなさっています。", "老师每天早上做研究。", "The teacher does research every morning.", "自己的动作不用「なさる」。", "Do not use なさる for your own actions."],
  "411": ["在、来、去；尊敬语", "honorific be/come/go", "場所に + いらっしゃる", "「いらっしゃる」是「いる／来る／行く」的尊敬语。", "いらっしゃる is the honorific form of いる, 来る, and 行く.", "礼貌形是「いらっしゃいます」。", "The polite form is いらっしゃいます.", "山田先生は今、研究室にいらっしゃいます。", "山田老师现在在研究室。", "Professor Yamada is in the lab now.", "不要用来描述自己在哪里或去哪里。", "Do not use it for where you yourself are or go."],
  "412": ["说；言う的尊敬语", "honorific say", "内容と + おっしゃる", "「おっしゃる」是「言う」的尊敬语，用于尊敬地描述对方说话。", "おっしゃる is the honorific form of 言う, used for another person's speech.", "礼貌形是「おっしゃいます」。", "The polite form is おっしゃいます.", "社長は「安全が第一だ」とおっしゃいました。", "社长说“安全第一”。", "The company president said, 'Safety comes first.'", "自己的发言不用「おっしゃる」。", "Do not use おっしゃる for your own speech."],
  "413": ["给我方；くれる的尊敬语", "honorific give to us", "名词を + くださる", "「くださる」是「くれる」的尊敬语，表示尊敬对象给自己一方东西或恩惠。", "くださる is the honorific form of くれる, meaning a respected person gives something or a benefit to the speaker's side.", "礼貌形常变为「くださいます」。", "The polite form often becomes くださいます.", "先生が参考書をくださいました。", "老师给了我参考书。", "The teacher kindly gave me a reference book.", "不要和请求用的「ください」混淆。", "Do not confuse it with request ください."],
  "414": ["来、去；行く/来る的谦让语", "humble go/come", "場所へ + まいる", "「まいる」是「行く／来る」的谦让语，用于谦虚地说自己一方移动。", "まいる is the humble form of 行く/来る, used for the speaker's side's movement.", "也可表示“参拜”，需看语境。", "It can also mean visit a shrine/temple; check context.", "明日の午後、こちらから伺いにまいります。", "明天下午我方会前去拜访。", "We will come visit tomorrow afternoon.", "对方来去不用「まいる」，要用尊敬语。", "For another person's coming/going, use honorific language instead."],
  "415": ["做；する的谦让语", "humble do", "名词を + いたす", "「いたす」是「する」的谦让语，用来谦虚地说自己一方做某事。", "いたす is the humble form of する, used for the speaker's side's actions.", "商务和服务场景中常见。", "It is common in business and service situations.", "後ほどこちらからご連絡いたします。", "稍后由我方联系您。", "We will contact you later.", "不要用「いたす」描述对方动作。", "Do not use いたす for another person's action."],
  "419": ["按理应该……", "should; expected to", "普通形 + はず", "「はず」表示根据事实、安排或常识推断，事情按理应该如此。", "はず expresses an expectation based on facts, arrangements, or common sense.", "名词接「のはず」，な形容词接「なはず」。", "Use のはず after nouns and なはず after na-adjectives.", "会議は三時に終わるはずです。", "会议按理应该三点结束。", "The meeting should end at three.", "它不是义务的“应该做”，而是推断。", "It is not obligation; it is expectation."],
  "420": ["正要、正在、刚刚", "about to; doing; just did", "动词辞书形/ている/た形 + ところ", "「ところ」表示动作处在某个阶段。", "ところ shows the stage an action is in.", "辞书形是正要，ている是正在，た形是刚刚。", "Dictionary form means about to, ている means in the middle of, and た-form means just finished.", "今、駅に着いたところです。", "现在刚到车站。", "I have just arrived at the station.", "这里不是地点，而是动作阶段。", "Here it is not a place; it is an action stage."],
  "421": ["为了；由于", "for; due to", "名词/动词辞书形 + ため", "「ため」可表示目的，也可表示原因，需根据后项判断。", "ため can express purpose or cause, depending on the following clause.", "有意志动作多为目的，已经发生的结果多为原因。", "Intentional actions often indicate purpose; actual results often indicate cause.", "大雨のため、イベントは延期されました。", "由于大雨，活动延期了。", "Due to heavy rain, the event was postponed.", "不要把所有「ため」都译成“为了”。", "Do not translate every ため as 'in order to.'"],
  "422": ["本来就……；真是……", "naturally; truly", "普通形 + ものだ", "「ものだ」可表示一般道理、感慨或回忆。", "ものだ can express general truths, emotion, or reminiscence.", "意思随语境变化，要看前后文。", "Its meaning depends on context.", "若いころは、よく友だちと夜遅くまで話したものです。", "年轻时，经常和朋友聊到很晚。", "When I was young, I often talked with friends until late at night.", "不要把它和具体物品的「もの」混同。", "Do not confuse it with もの meaning a concrete thing."],
  "423": ["应该……；最好……", "should; it is best to", "动词辞书形/ない形 + ことだ", "「ことだ」用于给建议，表示最好做或不要做某事。", "ことだ gives advice, meaning it is best to do or not do something.", "常用于说明解决方法或原则。", "It is common when stating a solution or principle.", "上手になりたければ、毎日少しずつ練習することです。", "想变厉害的话，最好每天一点点练习。", "If you want to improve, you should practice a little every day.", "不要和决定的「ことにする」混同。", "Do not confuse it with decision pattern ことにする."],
  "431": ["在……期间内", "while; during", "动词ている/名词の + 間に", "「間に」表示在某段时间范围内发生或完成某动作。", "間に means an action happens or is completed within a time span.", "重点是期间内某个点发生。", "The focus is on a point within the period.", "留守の間に、荷物が届きました。", "不在家的期间，包裹到了。", "A package arrived while I was away.", "整个期间持续用「間」，期间内发生用「間に」。", "Use 間 for the whole duration and 間に for an event within it."],
  "432": ["在……期间一直……", "during; while", "动词ている/名词の + 間", "「間」表示在整个某段时间里，后项动作或状态持续。", "間 means the following action or state continues throughout a time span.", "后项常是持续动作。", "The following clause is often continuous.", "日本にいる間、毎週日記を書いていました。", "在日本期间，每周都写日记。", "While I was in Japan, I wrote a diary every week.", "如果只发生一次，用「間に」。", "If it happens once, use 間に."],
  "433": ["趁……；在……期间", "while; before it changes", "普通形/名词の + うちに", "「うちに」表示趁某状态还持续时做某事，或在期间内发生变化。", "うちに means doing something while a state still lasts, or a change occurring during that period.", "常见于「忘れないうちに」「若いうちに」。", "Common phrases include 忘れないうちに and 若いうちに.", "温かいうちに、スープを飲んでください。", "请趁热喝汤。", "Please drink the soup while it is warm.", "它有“趁还……”的感觉。", "It has a 'while it is still...' feeling."],
  "434": ["每当……就……", "every time", "动词辞书形/名词の + たびに", "「たびに」表示每次前项发生，后项都会发生。", "たびに means every time the first event happens, the second also happens.", "强调反复对应关系。", "It emphasizes repeated correspondence.", "この写真を見るたびに、旅行を思い出します。", "每次看到这张照片，都会想起旅行。", "Every time I see this photo, I remember the trip.", "一次性事件不用「たびに」。", "Do not use たびに for a one-time event."],
  "438": ["……也好；……之类", "or something; either...or", "名词 + なり + 名词 + なり", "「なり」列举可选例子，表示其中任一种都可以。", "なり lists possible options and means any one of them would do.", "常用于建议对方采取某种可行行动。", "It is often used to suggest a feasible action.", "分からないことがあれば、先生なり先輩なりに聞いてください。", "有不懂的地方，可以问老师或前辈之类的人。", "If there is something you do not understand, ask a teacher, a senior, or someone like that.", "它不是完整清单，而是举出可选项。", "It is not a complete list; it gives possible options."],
  "445": ["也许……；可能……", "may; might", "普通形 + かもしれない", "「かもしれない」表示可能如此，但说话人没有把握。", "かもしれない means something may be true, but the speaker is uncertain.", "口语中常缩成「かも」。", "In casual speech it often shortens to かも.", "この道を行けば、駅に早く着くかもしれません。", "走这条路也许能更快到车站。", "If we take this road, we may reach the station faster.", "名词和な形容词后不要加「だ」。", "Do not add だ after nouns or na-adjectives."],
  "446": ["一定……；肯定……", "must; surely", "普通形 + に違いない", "「に違いない」表示根据证据强烈判断某事一定如此。", "に違いない expresses a strong judgment based on evidence that something must be true.", "比「かもしれない」确定得多。", "It is much more certain than かもしれない.", "この足跡を見ると、ここに動物がいたに違いありません。", "看这个脚印，这里一定有动物来过。", "Judging from these footprints, an animal must have been here.", "没有根据时使用会显得武断。", "Without evidence, it can sound assertive."],
  "447": ["肯定……；当然……", "of course; must be", "普通形 + に決まっている", "「に決まっている」表示说话人强烈认定某事当然如此。", "に決まっている expresses the speaker's strong conviction that something is obviously true.", "语气主观且强。", "The tone is subjective and strong.", "こんなに新鮮なら、おいしいに決まっています。", "这么新鲜，肯定好吃。", "If it is this fresh, it is bound to taste good.", "正式判断中要注意语气过强。", "Be careful: it can sound too strong in formal judgment."],
  "480": ["大约；到……程度", "about; to the extent", "数量/普通形 + ぐらい", "「ぐらい」表示大约数量、时间或程度。", "ぐらい expresses approximate amount, time, or degree.", "和「くらい」多可互换。", "It is often interchangeable with くらい.", "この店から駅まで五分ぐらいです。", "从这家店到车站大约五分钟。", "It is about five minutes from this shop to the station.", "时间点用「ごろ」，时间长度用「ぐらい」。", "Use ごろ for points in time and ぐらい for durations."],
  "483": ["约；大约", "approximately; about", "約 + 数量", "「約」放在数量前，表示数字是近似值。", "約 appears before a quantity and indicates an approximate number.", "常用于新闻、说明、统计。", "It is common in news, explanations, and statistics.", "このホールには約二千人入れます。", "这个大厅大约能容纳两千人。", "This hall can hold about two thousand people.", "「約」已经表示大约，不必再重复太多估算词。", "約 already means approximate, so avoid stacking too many approximation words."],
  "484": ["……左右；大约某时", "around; about a time", "时间 + ごろ", "「ごろ」接具体时间点，表示大约在那个时间。", "ごろ follows a specific time point and means around that time.", "用于时间点，不用于时间长度。", "Use it for points in time, not durations.", "昨日は十一時ごろ寝ました。", "昨天十一点左右睡了。", "I went to bed around eleven yesterday.", "三小时左右要说「三時間ぐらい」，不是「三時間ごろ」。", "For about three hours, say 三時間ぐらい, not 三時間ごろ."],
  "485": ["时候；时期", "time; period", "时间/时期 + 頃", "「頃」表示某个大致时间或时期。", "頃 indicates an approximate time or period.", "接钟点常读「ごろ」，接人生阶段等常读「ころ」。", "After clock times it is often read ごろ; with life periods it is often ころ.", "学生の頃、よくこの図書館に来ました。", "学生时代，经常来这个图书馆。", "When I was a student, I often came to this library.", "不要只理解成钟点左右，也可表示人生阶段。", "Do not understand it only as clock-time approximation; it can mean a life period too."],
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
