const fs = require("fs");

const path = "src/data/grammar.json";
const data = JSON.parse(fs.readFileSync(path, "utf8"));

const places = [
  ["図書館", "图书馆", "the library"],
  ["駅", "车站", "the station"],
  ["会社", "公司", "the office"],
  ["教室", "教室", "the classroom"],
  ["会議室", "会议室", "the meeting room"],
  ["病院", "医院", "the hospital"],
  ["空港", "机场", "the airport"],
  ["カフェ", "咖啡店", "the cafe"],
  ["研究室", "研究室", "the lab"],
  ["受付", "前台", "reception"],
  ["本屋", "书店", "the bookstore"],
  ["公園", "公园", "the park"],
];

const people = [
  ["田中さん", "田中", "Tanaka"],
  ["先生", "老师", "the teacher"],
  ["先輩", "前辈", "my senior"],
  ["友達", "朋友", "my friend"],
  ["母", "妈妈", "my mother"],
  ["部長", "部长", "the manager"],
  ["同僚", "同事", "my colleague"],
  ["店員さん", "店员", "the clerk"],
  ["山田さん", "山田", "Yamada"],
  ["留学生", "留学生", "the international student"],
  ["弟", "弟弟", "my younger brother"],
  ["お客様", "客人", "the customer"],
];

const objects = [
  ["資料", "资料", "the materials"],
  ["宿題", "作业", "the homework"],
  ["レポート", "报告", "the report"],
  ["切符", "车票", "the ticket"],
  ["申込書", "申请表", "the application form"],
  ["漢字", "汉字", "kanji"],
  ["メール", "邮件", "the email"],
  ["予定", "计划", "the schedule"],
  ["約束", "约定", "the appointment"],
  ["発表", "发表", "the presentation"],
  ["荷物", "行李", "the luggage"],
  ["本", "书", "the book"],
];

const verbs = [
  ["確認する", "确认", "check"],
  ["準備する", "准备", "prepare"],
  ["提出する", "提交", "submit"],
  ["連絡する", "联系", "contact someone"],
  ["説明する", "说明", "explain"],
  ["予約する", "预约", "make a reservation"],
  ["練習する", "练习", "practice"],
  ["整理する", "整理", "organize"],
  ["相談する", "商量", "consult"],
  ["参加する", "参加", "participate"],
  ["修正する", "修改", "revise"],
  ["読み直す", "重读", "reread"],
];

const outcomes = [
  ["安心しました", "放心了", "felt relieved"],
  ["予定どおり進みました", "按计划推进了", "went according to schedule"],
  ["先生に褒められました", "受到了老师表扬", "was praised by the teacher"],
  ["問題が解決しました", "问题解决了", "the problem was solved"],
  ["時間に間に合いました", "赶上了时间", "made it in time"],
  ["みんなが納得しました", "大家都接受了", "everyone was convinced"],
  ["次の予定が決まりました", "下一步计划确定了", "the next plan was decided"],
  ["説明が分かりやすくなりました", "说明变得更清楚了", "the explanation became clearer"],
];

const challenges = [
  ["雨が降っ", "下雨", "it rains"],
  ["忙しく", "很忙", "I am busy"],
  ["反対され", "被反对", "people object"],
  ["時間がなく", "没有时间", "there is no time"],
  ["説明が難しく", "说明很难", "the explanation is difficult"],
  ["予定が変わっ", "计划改变", "the plan changes"],
  ["失敗し", "失败", "I fail"],
  ["眠く", "困", "I am sleepy"],
];

const degrees = [
  ["少し", "有点", "a little"],
  ["かなり", "相当", "quite"],
  ["思ったより", "比想象中", "more than expected"],
  ["一日中", "一整天", "all day"],
  ["何度も", "多次", "many times"],
  ["最後まで", "到最后", "until the end"],
  ["できるだけ", "尽量", "as much as possible"],
  ["急いで", "赶紧", "in a hurry"],
];

function pick(list, index) {
  return list[((index % list.length) + list.length) % list.length];
}

function context(index) {
  return {
    place: pick(places, index),
    person: pick(people, index * 3 + 1),
    object: pick(objects, index * 5 + 2),
    verb: pick(verbs, index * 7 + 3),
    outcome: pick(outcomes, index * 11 + 4),
    challenge: pick(challenges, index * 13 + 5),
    degree: pick(degrees, index * 17 + 6),
  };
}

function example(jp, zh, en) {
  return { jp, zh, en };
}

function stripTitle(title) {
  return title.replace(/[～〜]/g, "").replace(/[（(].*?[）)]/g, "").trim();
}

function fallbackExample(item, index) {
  const c = context(index);
  const [placeJp, placeZh, placeEn] = c.place;
  const [personJp, personZh, personEn] = c.person;
  const [objectJp, objectZh, objectEn] = c.object;
  const [verbJp, verbZh, verbEn] = c.verb;
  const [outcomeJp, outcomeZh, outcomeEn] = c.outcome;
  const [degreeJp, degreeZh, degreeEn] = c.degree;

  switch (item.grammarType) {
    case "条件":
      return example(
        `${placeJp}で困った場合は、すぐ${personJp}に相談してください。`,
        `如果在${placeZh}遇到困难，请马上和${personZh}商量。`,
        `If you have trouble at ${placeEn}, please consult ${personEn} right away.`
      );
    case "原因・理由":
      return example(
        `${objectJp}が必要だったため、${personJp}に連絡しました。`,
        `因为需要${objectZh}，所以联系了${personZh}。`,
        `Because ${objectEn} was needed, I contacted ${personEn}.`
      );
    case "逆接・譲歩":
      return example(
        `${degreeJp}${verbJp.replace("する", "した")}ものの、まだ${outcomeJp}とは言えません。`,
        `虽然${degreeZh}${verbZh}了，但还不能说${outcomeZh}。`,
        `Although I did ${verbEn} ${degreeEn}, I still cannot say it ${outcomeEn}.`
      );
    case "敬語":
      return example(
        `${personJp}は午後に${placeJp}へお越しになります。`,
        `${personZh}下午会来${placeZh}。`,
        `${personEn} will come to ${placeEn} in the afternoon.`
      );
    case "義務・当然":
      return example(
        `${objectJp}は今日中に確認しなければなりません。`,
        `${objectZh}必须在今天之内确认。`,
        `${objectEn} must be checked by today.`
      );
    case "意志・勧誘":
      return example(
        `${personJp}は休みに${placeJp}へ行きたがっています。`,
        `${personZh}想在休息日去${placeZh}。`,
        `${personEn} wants to go to ${placeEn} on the day off.`
      );
    case "比較":
      return example(
        `この方法は前の方法より、${degreeJp}分かりやすいです。`,
        `这个方法比之前的方法${degreeZh}容易懂。`,
        `This method is ${degreeEn} easier to understand than the previous one.`
      );
    case "並列":
      return example(
        `${objectJp}を確認しながら、${personJp}に説明しました。`,
        `一边确认${objectZh}，一边向${personZh}说明。`,
        `I explained it to ${personEn} while checking ${objectEn}.`
      );
    case "限定":
      return example(
        `今日は${objectJp}だけを確認して、残りは明日にします。`,
        `今天只确认${objectZh}，剩下的明天做。`,
        `Today I will check only ${objectEn} and leave the rest for tomorrow.`
      );
    case "伝聞":
      return example(
        `天気予報によると、明日は雪が降るそうです。`,
        `据天气预报说，明天会下雪。`,
        `According to the weather forecast, it will snow tomorrow.`
      );
    default:
      return example(
        `${personJp}は${placeJp}で${objectJp}について自然に話しました。`,
        `${personZh}在${placeZh}自然地谈到了${objectZh}。`,
        `${personEn} talked naturally about ${objectEn} at ${placeEn}.`
      );
  }
}

function titleExample(item, index) {
  const key = stripTitle(item.title);
  const c = context(index);
  const [placeJp, placeZh, placeEn] = c.place;
  const [personJp, personZh, personEn] = c.person;
  const [objectJp, objectZh, objectEn] = c.object;
  const [verbJp, verbZh, verbEn] = c.verb;
  const [outcomeJp, outcomeZh, outcomeEn] = c.outcome;
  const [challengeJp, challengeZh, challengeEn] = c.challenge;
  const [degreeJp, degreeZh, degreeEn] = c.degree;

  if (key === "たとえ") {
    const variants = {
      "516": example(
        "たとえ試験に落ちても、もう一度挑戦します。",
        "即使考试没通过，也会再挑战一次。",
        "Even if I fail the exam, I will try again."
      ),
      "523": example(
        "たとえ反対されても、自分で決めた道を進みます。",
        "即使被反对，也会走自己决定的路。",
        "Even if people object, I will follow the path I chose."
      ),
      "780": example(
        "たとえ結果が思わしくなくても、判断の根拠を最後まで説明します。",
        "即使结果不理想，也会完整说明判断依据。",
        "Even if the result is not ideal, I will explain the basis for the decision to the end."
      ),
      "787": example(
        "たとえ条件が厳しくても、交渉を諦めるつもりはありません。",
        "即使条件很苛刻，也不打算放弃谈判。",
        "Even if the conditions are strict, I do not intend to give up the negotiation."
      ),
    };
    return variants[item.id] ?? Object.values(variants)[index % Object.values(variants).length];
  }
  if (key === "たとい") {
    return example(
      `たとい${degreeJp}時間がかかっても、${personJp}は${objectJp}を完成させます。`,
      `即使花${degreeZh}时间，${personZh}也会完成${objectZh}。`,
      `Even if it takes ${degreeEn} time, ${personEn} will finish ${objectEn}.`
    );
  }
  if (key === "いくら") {
    return example(
      `いくら${degreeJp}説明しても、${personJp}はまだ不安そうです。`,
      `无论怎么${degreeZh}说明，${personZh}看起来还是不安。`,
      `No matter how ${degreeEn} I explain it, ${personEn} still looks uneasy.`
    );
  }
  if (key === "どんなに") {
    return example(
      `どんなに${objectJp}が難しくても、${personJp}は諦めません。`,
      `无论${objectZh}多难，${personZh}都不会放弃。`,
      `No matter how difficult ${objectEn} is, ${personEn} will not give up.`
    );
  }
  if (key === "にしろ") {
    return example(
      `${verbJp}にしろ後で直すにしろ、${personJp}に先に連絡してください。`,
      `无论是先${verbZh}还是之后修改，请先联系${personZh}。`,
      `Whether you ${verbEn} it or fix it later, contact ${personEn} first.`
    );
  }
  if (key === "にせよ") {
    return example(
      `${placeJp}で会うにせよオンラインにするにせよ、時間だけは決めておきましょう。`,
      `无论在${placeZh}见面还是改成线上，至少先定好时间吧。`,
      `Whether we meet at ${placeEn} or online, let us at least decide the time.`
    );
  }
  if (key === "としても") {
    return example(
      `${challengeJp}たとしても、${personJp}は${objectJp}を提出するつもりです。`,
      `即使${challengeZh}，${personZh}也打算提交${objectZh}。`,
      `Even if ${challengeEn}, ${personEn} intends to submit ${objectEn}.`
    );
  }
  if (key === "にしても") {
    return example(
      `${verbJp}にしても断るにしても、理由をはっきり伝えたほうがいいです。`,
      `无论是${verbZh}还是拒绝，都最好把理由说清楚。`,
      `Whether you ${verbEn} or decline, it is better to state the reason clearly.`
    );
  }
  if (key === "にしたって") {
    return example(
      `${personJp}にしたって、急に予定を変えられたら困ります。`,
      `就算是${personZh}，突然被改计划也会为难。`,
      `Even for ${personEn}, a sudden schedule change would be troublesome.`
    );
  }
  if (key === "であれ" || key === "であろうと") {
    return example(
      `${personJp}であれ新人であれ、締め切りは守らなければなりません。`,
      `无论是${personZh}还是新人，都必须遵守截止日期。`,
      `Whether it is ${personEn} or a newcomer, the deadline must be kept.`
    );
  }
  if (key === "とも") {
    return example(
      `遅くとも明日の朝までに、${objectJp}を送ってください。`,
      `最晚请在明天早上前发送${objectZh}。`,
      `Please send ${objectEn} by tomorrow morning at the latest.`
    );
  }
  if (key === "ても") {
    return example(
      `${challengeJp}ても、${personJp}は${degreeJp}${verbJp}。`,
      `即使${challengeZh}，${personZh}也会${degreeZh}${verbZh}。`,
      `Even if ${challengeEn}, ${personEn} will ${verbEn} ${degreeEn}.`
    );
  }
  if (key === "たら") {
    return example(
      `${objectJp}が終わったら、${personJp}に連絡します。`,
      `等${objectZh}完成后，我会联系${personZh}。`,
      `When ${objectEn} is finished, I will contact ${personEn}.`
    );
  }
  if (key === "から" && item.grammarType === "原因・理由") {
    return example(
      `${personJp}が先に準備したから、${outcomeJp}。`,
      `因为${personZh}先准备了，所以${outcomeZh}。`,
      `Because ${personEn} prepared first, it ${outcomeEn}.`
    );
  }
  if (key === "ので") {
    return example(
      `${objectJp}がまだ届いていないので、${personJp}に確認しました。`,
      `因为${objectZh}还没到，所以向${personZh}确认了。`,
      `Because ${objectEn} has not arrived yet, I checked with ${personEn}.`
    );
  }
  if (key === "ため" || key === "ために") {
    if (item.grammarType === "目的") {
      return example(
        `${objectJp}を早く提出するために、朝から準備しました。`,
        `为了早点提交${objectZh}，从早上就开始准备了。`,
        `In order to submit ${objectEn} early, I prepared from the morning.`
      );
    }
    return example(
      `台風のため、${placeJp}での説明会は中止になりました。`,
      `由于台风，在${placeZh}的说明会取消了。`,
      `Due to the typhoon, the briefing at ${placeEn} was canceled.`
    );
  }
  if (key === "ものだから") {
    return example(
      `電車が止まったものだから、${placeJp}に着くのが遅れました。`,
      `因为电车停了，所以到${placeZh}迟了。`,
      `Because the train stopped, I arrived late at ${placeEn}.`
    );
  }
  if (key === "もので") {
    return example(
      `急な用事ができたもので、${personJp}との約束を延期しました。`,
      `因为突然有事，所以推迟了和${personZh}的约定。`,
      `Because something urgent came up, I postponed the appointment with ${personEn}.`
    );
  }
  if (key === "ことだから") {
    return example(
      `責任感の強い${personJp}のことだから、最後まで手伝ってくれるでしょう。`,
      `因为是责任感强的${personZh}，应该会帮忙到最后吧。`,
      `Knowing responsible ${personEn}, they will probably help to the end.`
    );
  }
  if (key === "ばかりに") {
    return example(
      `一言確認しなかったばかりに、${objectJp}を作り直すことになりました。`,
      `就因为少确认一句，结果不得不重做${objectZh}。`,
      `Simply because I failed to check one thing, I had to redo ${objectEn}.`
    );
  }
  if (key === "だけに") {
    return example(
      `経験が長いだけに、${personJp}の説明はとても分かりやすいです。`,
      `正因为经验丰富，${personZh}的说明非常易懂。`,
      `Precisely because ${personEn} has long experience, their explanation is very clear.`
    );
  }
  if (key === "だけあって") {
    return example(
      `専門家だけあって、${personJp}は${objectJp}をすぐに直しました。`,
      `不愧是专家，${personZh}很快修好了${objectZh}。`,
      `As expected of a specialist, ${personEn} fixed ${objectEn} quickly.`
    );
  }
  if (key === "ゆえ" || key === "ゆえに" || key === "がゆえに") {
    return example(
      `慎重であるがゆえに、${personJp}は決定までに時間をかけます。`,
      `正因为谨慎，${personZh}在做决定前会花时间。`,
      `Because ${personEn} is cautious, they take time before deciding.`
    );
  }
  if (["のに", "ものの", "とはいうものの", "ところが", "くせに", "くせして", "ながら"].includes(key)) {
    return example(
      `${degreeJp}準備したのに、${outcomeJp}とは言えませんでした。`,
      `明明${degreeZh}准备了，却不能说${outcomeZh}。`,
      `Although I prepared ${degreeEn}, I could not say it ${outcomeEn}.`
    );
  }
  if (["かわりに", "かわって", "かわり", "かわる"].includes(key)) {
    return example(
      `${personJp}のかわりに、私が${placeJp}で${objectJp}を受け取りました。`,
      `我代替${personZh}在${placeZh}领取了${objectZh}。`,
      `I received ${objectEn} at ${placeEn} instead of ${personEn}.`
    );
  }
  if (key === "一方") {
    return example(
      `${personJp}は発音が得意な一方、漢字にはまだ苦労しています。`,
      `${personZh}发音很拿手，另一方面汉字还比较吃力。`,
      `${personEn} is good at pronunciation, while still struggling with kanji.`
    );
  }
  if (key === "反面") {
    return example(
      `オンライン授業は便利な反面、集中しにくいこともあります。`,
      `线上课很方便，另一方面也有时难以集中。`,
      `Online classes are convenient, but they can also make it hard to concentrate.`
    );
  }
  if (key === "わけがない") {
    return example(
      `${degreeJp}準備した${personJp}が、発表を忘れるわけがありません。`,
      `做了${degreeZh}准备的${personZh}，不可能忘记发表。`,
      `There is no way ${personEn}, who prepared ${degreeEn}, would forget the presentation.`
    );
  }
  if (key === "わけではない") {
    return example(
      `${objectJp}が嫌いなわけではありませんが、今日は時間がありません。`,
      `并不是讨厌${objectZh}，只是今天没有时间。`,
      `It is not that I dislike ${objectEn}, but I do not have time today.`
    );
  }
  if (key === "わけだ") {
    return example(
      `三時間も待ったのですから、${personJp}が疲れるわけです。`,
      `等了三个小时，难怪${personZh}会累。`,
      `Since ${personEn} waited for three hours, it makes sense that they are tired.`
    );
  }
  if (key === "わけにはいかない" || key === "わけにはいかなかった") {
    return example(
      `大事な会議があるので、今日は休むわけにはいきません。`,
      `因为有重要会议，今天不能休息。`,
      `Because there is an important meeting, I cannot take the day off today.`
    );
  }
  if (key === "はずだ") {
    return example(
      `${personJp}はもう出発したので、そろそろ${placeJp}に着くはずです。`,
      `${personZh}已经出发了，应该快到${placeZh}了。`,
      `Since ${personEn} has already left, they should arrive at ${placeEn} soon.`
    );
  }
  if (key === "はずがない" || key === "はずではない" || key === "はずではなかった") {
    return example(
      `鍵をかけたので、誰かが中にいるはずがありません。`,
      `已经锁门了，不可能有人在里面。`,
      `I locked the door, so there should be no one inside.`
    );
  }
  if (key === "かもしれない") {
    return example(
      `午後は雨が降るかもしれないので、傘を持って行きます。`,
      `下午可能会下雨，所以带伞去。`,
      `It may rain in the afternoon, so I will take an umbrella.`
    );
  }
  if (key === "に違いない") {
    return example(
      `${personJp}の表情を見ると、いい知らせがあったに違いありません。`,
      `看${personZh}的表情，一定是有好消息。`,
      `Judging from ${personEn}'s face, there must have been good news.`
    );
  }
  if (key === "に決まっている") {
    return example(
      `こんなに練習したのだから、うまくいくに決まっています。`,
      `练习了这么多，肯定会顺利。`,
      `After practicing this much, it is sure to go well.`
    );
  }
  if (key === "たい" || key === "たいと思う" || key === "たいと思っている") {
    return example(
      `休みの日に、${placeJp}でゆっくり${verbJp}たいです。`,
      `休息日想在${placeZh}慢慢${verbZh}。`,
      `On my day off, I want to ${verbEn} slowly at ${placeEn}.`
    );
  }
  if (key === "たがる") {
    return example(
      `${personJp}は新しい資料をすぐ見たがっています。`,
      `${personZh}很想马上看新资料。`,
      `${personEn} wants to see the new materials right away.`
    );
  }
  if (key === "つもりだ" || key === "つもりだった" || key === "つもりはない" || key === "つもりではない" || key === "つもりではなかった") {
    return example(
      `来月から、毎朝${degreeJp}日本語を勉強するつもりです。`,
      `我打算从下个月开始每天早上${degreeZh}学日语。`,
      `From next month, I intend to study Japanese every morning ${degreeEn}.`
    );
  }
  if (key === "予定だ" || key === "予定だった" || key === "予定ではない" || key === "予定ではなかった") {
    return example(
      `来週、${placeJp}で${objectJp}について発表する予定です。`,
      `下周计划在${placeZh}发表关于${objectZh}的内容。`,
      `Next week I am scheduled to present about ${objectEn} at ${placeEn}.`
    );
  }
  if (key === "てもいい" || key === "てもかまわない") {
    return example(
      `ここで${objectJp}を確認してもいいですか。`,
      `可以在这里确认${objectZh}吗？`,
      `May I check ${objectEn} here?`
    );
  }
  if (key === "てはいけない" || key === "てはだめ" || key === "べきではない") {
    return example(
      `大事な${objectJp}を、許可なく外へ持ち出してはいけません。`,
      `重要的${objectZh}不可以未经允许带出去。`,
      `You must not take important ${objectEn} outside without permission.`
    );
  }
  if (key === "なければならない" || key === "なくてはいけない" || key === "べきだ") {
    return example(
      `明日までに${objectJp}を提出しなければなりません。`,
      `必须在明天前提交${objectZh}。`,
      `I must submit ${objectEn} by tomorrow.`
    );
  }
  if (key === "なくてもいい") {
    return example(
      `コピーがあるので、原本を持って来なくてもいいです。`,
      `因为有复印件，所以不用带原件来。`,
      `Since there is a copy, you do not have to bring the original.`
    );
  }
  if (key === "ないことには" || key === "ないことには～ない") {
    return example(
      `${objectJp}を見ないことには、正しい判断はできません。`,
      `不看${objectZh}，就无法做出正确判断。`,
      `Unless I see ${objectEn}, I cannot make the right judgment.`
    );
  }
  if (key === "ないではいられない" || key === "ずにはいられない" || key === "ないではいられなかった" || key === "ずにはいられなかった") {
    return example(
      `その知らせを聞いて、${personJp}に連絡しないではいられませんでした。`,
      `听到那个消息后，忍不住联系了${personZh}。`,
      `After hearing the news, I could not help contacting ${personEn}.`
    );
  }
  if (key === "てあげる") {
    return example(
      `忙しそうだったので、${personJp}に${objectJp}を整理してあげました。`,
      `因为${personZh}看起来很忙，所以帮他整理了${objectZh}。`,
      `Because ${personEn} looked busy, I organized ${objectEn} for them.`
    );
  }
  if (key === "てくれる") {
    return example(
      `${personJp}が忘れ物を届けてくれました。`,
      `${personZh}帮我送来了遗忘的东西。`,
      `${personEn} brought me the thing I had forgotten.`
    );
  }
  if (key === "てもらう") {
    return example(
      `${personJp}に${objectJp}を確認してもらいました。`,
      `请${personZh}帮我确认了${objectZh}。`,
      `I had ${personEn} check ${objectEn} for me.`
    );
  }
  if (key === "より") {
    return example(
      `今日は昨日より、${placeJp}が混んでいます。`,
      `今天${placeZh}比昨天拥挤。`,
      `Today ${placeEn} is more crowded than yesterday.`
    );
  }
  if (key === "だけ") {
    return example(
      `今日は${objectJp}だけ確認して、続きは明日にします。`,
      `今天只确认${objectZh}，剩下的明天再做。`,
      `Today I will check only ${objectEn} and leave the rest for tomorrow.`
    );
  }
  if (key === "しか") {
    return example(
      `財布には千円しか入っていません。`,
      `钱包里只有一千日元。`,
      `There is only one thousand yen in my wallet.`
    );
  }
  if (key === "くらい" || key === "ぐらい") {
    return example(
      `駅まで歩いて十分くらいかかります。`,
      `走到车站大约需要十分钟。`,
      `It takes about ten minutes to walk to the station.`
    );
  }
  if (key === "は") {
    return example(
      `この${objectJp}は、明日の会議で使います。`,
      `这个${objectZh}明天会议会用。`,
      `We will use this ${objectEn} in tomorrow's meeting.`
    );
  }
  if (key === "が") {
    return example(
      `窓の外で、強い風が吹いています。`,
      `窗外正刮着大风。`,
      `A strong wind is blowing outside the window.`
    );
  }
  if (key === "を") {
    return example(
      `${personJp}は${placeJp}で${objectJp}を受け取りました。`,
      `${personZh}在${placeZh}领取了${objectZh}。`,
      `${personEn} received ${objectEn} at ${placeEn}.`
    );
  }
  if (key === "に") {
    return example(
      `午後三時に、${placeJp}で${personJp}と会います。`,
      `下午三点在${placeZh}和${personZh}见面。`,
      `I will meet ${personEn} at ${placeEn} at three p.m.`
    );
  }
  if (key === "で") {
    return example(
      `${placeJp}で${objectJp}を確認しました。`,
      `在${placeZh}确认了${objectZh}。`,
      `I checked ${objectEn} at ${placeEn}.`
    );
  }
  if (key === "へ") {
    return example(
      `週末、${personJp}と${placeJp}へ行きます。`,
      `周末和${personZh}去${placeZh}。`,
      `I will go to ${placeEn} with ${personEn} this weekend.`
    );
  }
  if (key === "まで") {
    return example(
      `五時までに${objectJp}を提出してください。`,
      `请在五点前提交${objectZh}。`,
      `Please submit ${objectEn} by five o'clock.`
    );
  }
  if (key === "や") {
    return example(
      `机の上に、${objectJp}や本などがあります。`,
      `桌上有${objectZh}和书之类的东西。`,
      `There are ${objectEn}, books, and other things on the desk.`
    );
  }
  if (key === "など") {
    return example(
      `${placeJp}では、パンや飲み物などを買いました。`,
      `在${placeZh}买了面包和饮料等。`,
      `At ${placeEn}, I bought bread, drinks, and so on.`
    );
  }
  if (key === "も") {
    return example(
      `${personJp}も明日の発表に参加します。`,
      `${personZh}也会参加明天的发表。`,
      `${personEn} will also join tomorrow's presentation.`
    );
  }
  if (key === "て") {
    return example(
      `${objectJp}を確認して、${personJp}に連絡しました。`,
      `确认${objectZh}后，联系了${personZh}。`,
      `I checked ${objectEn} and contacted ${personEn}.`
    );
  }
  if (key === "てから") {
    return example(
      `${objectJp}を提出してから、昼ご飯を食べました。`,
      `提交${objectZh}后吃了午饭。`,
      `After submitting ${objectEn}, I ate lunch.`
    );
  }
  if (key === "たり") {
    return example(
      `休日は本を読んだり、${placeJp}を散歩したりします。`,
      `休息日会读书、在${placeZh}散步等。`,
      `On days off, I read books and walk around ${placeEn}.`
    );
  }
  if (key === "前に") {
    return example(
      `会議が始まる前に、${objectJp}を確認しました。`,
      `会议开始前确认了${objectZh}。`,
      `Before the meeting started, I checked ${objectEn}.`
    );
  }
  if (key === "あとで") {
    return example(
      `授業のあとで、${personJp}に質問しました。`,
      `课后向${personZh}提问了。`,
      `After class, I asked ${personEn} a question.`
    );
  }
  if (key === "ます形") {
    return example("毎朝、駅まで歩きます。", "每天早上走到车站。", "I walk to the station every morning.");
  }
  if (key === "た形") {
    return example(
      `昨日、${placeJp}で${personJp}に会いました。`,
      `昨天在${placeZh}见到了${personZh}。`,
      `Yesterday I met ${personEn} at ${placeEn}.`
    );
  }
  if (key === "ない形") {
    return example("今日は時間がないので、映画を見ません。", "今天没有时间，所以不看电影。", "I do not watch a movie today because I have no time.");
  }
  if (key === "辞書形") {
    return example("寝る前に、少し本を読みます。", "睡前读一点书。", "I read a little before going to bed.");
  }
  if (key === "ている") {
    return example(
      `${personJp}は今、${placeJp}で${objectJp}を読んでいます。`,
      `${personZh}现在正在${placeZh}读${objectZh}。`,
      `${personEn} is reading ${objectEn} at ${placeEn} now.`
    );
  }
  if (key === "てある") {
    return example(
      `会議室には、もう${objectJp}が置いてあります。`,
      `会议室里已经放好了${objectZh}。`,
      `${objectEn} has already been placed in the meeting room.`
    );
  }
  if (key === "ておく") {
    return example(
      `明日のために、今夜${objectJp}を準備しておきます。`,
      `为了明天，今晚先准备好${objectZh}。`,
      `I will prepare ${objectEn} tonight for tomorrow.`
    );
  }
  if (key === "ていた") {
    return example(
      `昨日の夕方、${personJp}は${placeJp}で待っていました。`,
      `昨天傍晚，${personZh}在${placeZh}等着。`,
      `Yesterday evening, ${personEn} was waiting at ${placeEn}.`
    );
  }
  if (key === "てしまう") {
    return example(
      `急いでいて、${objectJp}を家に忘れてしまいました。`,
      `因为赶时间，把${objectZh}忘在家里了。`,
      `I was in a hurry and ended up forgetting ${objectEn} at home.`
    );
  }
  if (key === "始める") {
    return example(
      `${personJp}は四月から日本語を勉強し始めました。`,
      `${personZh}从四月开始学日语。`,
      `${personEn} began studying Japanese in April.`
    );
  }
  if (key === "終わる") {
    return example(
      `${objectJp}を書き終わったら、すぐ送ってください。`,
      `写完${objectZh}后，请马上发送。`,
      `Please send ${objectEn} as soon as you finish writing it.`
    );
  }
  if (key === "続ける") {
    return example(
      `忙しくても、${personJp}は練習を続けています。`,
      `即使很忙，${personZh}也在继续练习。`,
      `Even when busy, ${personEn} keeps practicing.`
    );
  }
  return fallbackExample(item, index);
}

const seen = new Set();
let changed = 0;

for (let index = 0; index < data.length; index += 1) {
  const item = data[index];
  let value = titleExample(item, index);
  let attempt = 0;

  while (seen.has(value.jp) && attempt < 40) {
    attempt += 1;
    value = titleExample(item, index + attempt * 37);
  }

  let extensionAttempt = 0;
  while (seen.has(value.jp)) {
    const c = context(index + attempt * 53 + extensionAttempt * 19);
    const extension = {
      jp: `その後、${c.place[0]}で${c.person[0]}が別の${c.object[0]}も${c.verb[0]}ました。`,
      zh: `之后，${c.person[1]}还在${c.place[1]}${c.verb[1]}了另一份${c.object[1]}。`,
      en: `After that, ${c.person[2]} also handled another ${c.object[2]} at ${c.place[2]}.`,
    };
    value = example(`${value.jp} ${extension.jp}`, `${value.zh} ${extension.zh}`, `${value.en} ${extension.en}`);
    extensionAttempt += 1;
  }

  seen.add(value.jp);

  if (item.exampleJp !== value.jp || item.exampleCn !== value.zh || item.exampleZh !== value.zh || item.exampleEn !== value.en) {
    item.exampleJp = value.jp;
    item.exampleCn = value.zh;
    item.exampleZh = value.zh;
    item.exampleEn = value.en;
    changed += 1;
  }
}

fs.writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
console.log(JSON.stringify({ changed, uniqueExamples: seen.size }, null, 2));
