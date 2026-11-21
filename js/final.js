/* The last word on wording. Loaded after every other copy file.
   1. Nothing is "whispered". A person breathes; the rhythm is called the Hadva breath.
   2. The opening says what this is: an old secret, hidden in a book of Kabbalah, given here to
      everyone for nothing — a kindness done to you, to be passed on if it does you good.
   3. Passing it on: a message for one person, the friend's own words carried in the link,
      and a card for whoever completes the fourteen days. */
(function () {
  var S = window.NESHIMA_STRINGS, he = S.he, en = S.en;

  Object.assign(he, {
    frontSub: 'סוד ישן, שהוסתר בספר קבלה',
    frontBody: 'בספר קבלה ישן הוסתר סוד: כוחה של הנשימה במקצב הנכון. כאן הוא ניתן לכל אדם, בלי תמורה.',
    frontGift: 'זה חסד שנעשה לך. ואם ייטיב איתך — יעבור ממך הלאה, לאדם אחר.',
    invitedBy: function (n, h) { return (n ? 'החסד הזה בא אליך מ' + n + '.' : 'החסד הזה הועבר אליך.') + (h > 1 ? ' ' + h + ' ידיים בדרך.' : ''); },
    heroKicker: 'נשימה', introTitle: 'לפני שנושמים',
    rHadva: 'נשימת חדוה · 8·4·6·5',
    afterShort: 'קצר. גם זה נרשם.',
    setupTitle: 'שלוש פעמים ביום',
    calTitle: 'נשימה · נשימת חדוה', calDesc: 'הגיע הזמן לנשום. אוזניות, ולהתחיל.',
    today: function (n) { return n === 0 ? 'היום עוד לא נשמת.' : n === 1 ? 'היום: פעם אחת מתוך שלוש.' : 'היום: ' + n + ' פעמים מתוך שלוש.'; },
    todayFull: 'שלוש פעמים היום. כל השאר — מתנה.',
    remEdit: 'שעות התזכורת',
    refSummary: function (n, d) { return (n === 1 ? 'פעם אחת' : n + ' פעמים') + ', ב־' + d + ' מתוך ארבעה־עשר ימים.'; },
    refPrompt: 'קיבלת סוד אחד. מה השתנה — בגוף, בלב, במציאות שלך? גם ״שום דבר״ היא תשובה אמיתית.',
    chalBody: 'שלוש פעמים ביום, ארבעה־עשר ימים. בכל פעם — נשימת חדוה, בקצב הנשימה שלך. ובסופם נכתב כאן, באמת, מה השתנה.',
    chalLen: 'אורך כל פעם', manLen: 'אורך כל פעם',
    measRes: function (sec, cyc) { return 'שאיפה שלך: ' + sec + ' שניות. נשימת חדוה אחת, שלמה: ' + cyc + ' שניות.'; },
    levBody: 'חסד — שבעים ושתיים. כל פעם נמדדת בחסדים.',
    leafVeil: ['נפתח בפעם הראשונה של היום.', 'נפתח בפעם השנייה.', 'נפתח בפעם השלישית.'],
    // the kindness
    hesedAsk: 'ארבעה־עשר ימים לפניך. כשייטב לך — יגיע תורך להעביר אותו הלאה, לאדם אחד.',
    hesedNow: 'להעביר כבר עכשיו',
    turnT: 'הגיע תורך.',
    turnBody: 'אם זה מיטיב איתך — זה הזמן לעשות חסד עם אדם אחד.',
    waBtn: 'לשלוח בוואטסאפ', moreWays: 'עוד דרכים',
    shareTitle: 'להעביר חסד', shareLink: 'להעביר חסד', shareDay: 'להעביר חסד',
    shareBody: 'אדם אחד בכל פעם. ההודעה אינה מגלה את הסוד; היא רק פותחת את הדף.',
    shareMsg: function (d, dots, url) { return 'נעשה לי חסד, ועכשיו הוא עובר אליך.\nסוד ישן, שהוסתר בספר קבלה. ארבעה־עשר ימים, בלי תמורה.\n' + url; },
    shareInviteMsg: function (url) { return 'נעשה לי חסד, ועכשיו הוא עובר אליך.\nסוד ישן, שהוסתר בספר קבלה. ארבעה־עשר ימים, בלי תמורה.\n' + url; },
    testMsg: function (tx, url) { return '״' + tx + '״\nארבעה־עשר ימים של נשימה. נעשה לי חסד, ועכשיו הוא עובר אליך.\n' + url; },
    testCard: function (d) { return d >= 14 ? 'עמדתי באתגר ארבעה־עשר הימים' : d ? 'יום ' + d + ' מתוך ארבעה־עשר' : 'עדות'; },
    testFine: 'רק המשפט הזה יוצא מכאן, והוא יופיע גם למי שיפתח את הקישור שלך. כל השאר נשאר אצלך. ואם דבר לא השתנה — הדף נשאר ריק.',
    afterAgain: 'זה נרשם באילן שלך.', inviteQ: 'ארבעה־עשר ימים.',
    actIn: 'שאיפה', actLinger: 'השתהות', actOut: 'נשיפה', actRest: 'מנוחה',
    // a hard moment
    sosTop: 'רגע קשה', sosBtn: 'רגע קשה?',
    sosSub: function (t) { return 'רגע קשה · ' + t; }, sosRow: function (t) { return t + ' דקות של נשימה'; },
    sosLand: function (t) { return 'רגע קשה עכשיו? ' + t + ' דקות של נשימה'; },
    momentLead: 'לפני שמגיבים — נושמים.', momentDone: 'סיימתי',
    momentAfter: 'עכשיו אפשר להגיב.', sosAfterLead: function (t) { return t + ' דקות של נשימה.'; },
    sosAfterShort: 'אפשר לחזור לכאן בכל רגע.', sosHome: 'ללוח הנשימה', sosAgain: 'עוד פעם',
    sosPitch: 'זאת הנשימה של הסוד. ארבעה־עשר ימים שלה מלמדים את הגוף — וברגע קשה הוא כבר יודע.',
    sosPitchGo: 'לגלות את הסוד',
    firstKick: 'הקוד הסודי', firstT: 'נשימה אחת, והקוד מתגלה.',
    firstLead: 'נושמים יחד עם העיגול: שאיפה, השתהות, נשיפה, מנוחה. בכל חלק נדלקת אות, עם המספר שלה.',
    firstGo: 'להתחיל', firstAgain: 'עוד פעם',
    firstDone1: 'חדוה. שמחה.',
    firstDone2: 'זה הקוד: שאיפה 8, השתהות 4, נשיפה 6, מנוחה 5.',
    firstDoneSr: 'שאיפה 8, השתהות 4, נשיפה 6, מנוחה 5.',
    thSkip: 'כבר הייתי כאן',
    chalBody: 'שלוש פעמים ביום, ארבעה־עשר ימים. נשימת חדוה, בקצב הנשימה שלך.',
    chalLen: 'אורך כל פעם, לבחירתך', chalGo: 'להתחיל',
    beginK: 'לפני שמתחילים', beginT: 'לפני הנשימה הראשונה.', beginLead: 'שלושה צעדים קצרים:', beginGo: 'בוא נתחיל',
    beginSteps: ['בוחרים כמה זמן נושמים בכל פעם.', 'מודדים את הנשימה שלך, כדי שהקצב יתאים בדיוק לך.', 'נושמים לפי הקוד הסודי: שאיפה 8, השתהות 4, נשיפה 6, מנוחה 5.'],
    chalTitle: 'כמה זמן בכל פעם?', chalBody2: 'שלוש פעמים ביום, ארבעה־עשר ימים. האמצעי מסומן, ואפשר לשנות בכל יום.', chalGo2: 'למדוד את הנשימה שלי', codeTry: 'לנסות נשימה אחת קודם',
    levNote: 'אפשר לשנות בכל יום.',
    measT: 'יוצאים לדרך.', measKeep: function (sec) { return 'להשאיר את המדידה הקודמת: ' + sec + ' שניות'; },
    measBody: 'לפני התרגול נמדדת הנשימה שלך, והמקצב נבנה לפיה. שאיפה אחת, מלאה ורגועה: נגיעה כשהיא מתחילה, ונגיעה כשהיא תמה.',
    readyT: 'מוכנים?', readyLead: 'הנה, מתחילים.',
    readyLines: ['אוזניות על האוזניים.', 'העיניים יכולות להיעצם.', 'הקול מוביל: שאיפה, השתהות, נשיפה, מנוחה.'],
    readyGo: 'מתחילים',
    doneT: 'סיימת.', homeT: 'לוח הנשימה', homeGo: 'להתחיל',
    goodT: 'משהו טוב למישהו שחשוב לך.', goodBody: 'נעשה לך חסד. עכשיו אפשר להעביר אותו הלאה.', goodBtn: 'לשתף',
    leaveText: 'להשאיר כמה מילים',
    keepT: 'כדי לחזור מחר.', keepLead: 'המקום שלך נשמר במכשיר הזה. בלי הרשמה, בלי אימייל.',
    keepHomeT: 'להוסיף למסך הבית', keepHomeB: 'אייקון בטלפון, ונגיעה אחת מחזירה אותך ללוח.', keepHomeBtn: 'להוסיף',
    keepHomeIos: 'בספארי: כפתור השיתוף, ואז ״הוסף למסך הבית״.', keepHomeOther: 'בתפריט הדפדפן: ״הוספה למסך הבית״ או ״התקנת האפליקציה״.',
    keepRemT: 'שלוש תזכורות ביום', keepRemB: 'נכנסות ליומן של הטלפון, לארבעה־עשר ימים:', keepRemBtn: 'להוסיף ליומן', keepRemEdit: 'לשנות שעות',
    keepLinkT: 'הקישור האישי שלך', keepLinkB: 'מחזיר אותך למקום שלך, גם ממכשיר אחר. כדאי לשלוח אותו לעצמך.',
    keepLinkWa: 'לשלוח לעצמי', keepLinkCopy: 'להעתיק',
    keepLinkMsg: function (url) { return 'הלוח שלי באתגר הנשימה:\n' + url; },
    keepGo: 'ללוח הנשימה', menuT: 'תפריט', manKeep: 'לחזור מחר', manKeepVal: 'מסך הבית · קישור אישי',
    restored: 'המקום שלך שוחזר.',
    sealLabel: function (n, d) { return 'האילן שלי: ' + n + ' מתוך 42, יום ' + d + '.'; },
    privacyBody: 'אין חשבון ואין כלי מעקב. ההתקדמות, הדיווחים וההתבוננות נשמרים רק בדפדפן הזה, במכשיר הזה, והאתר אינו שולח אותם לשום מקום. לכן גם אין לנו דרך לשחזר אותם: מחיקת נתוני הדפדפן תמחק אותם, אלא אם נשמר הקישור האישי. כמו בכל אתר, חברת האירוח (GitHub) רואה את כתובת ה־IP של מי שגולש, ועשויה לרשום אותה ביומניה.',
    whence: 'מקורות', tune: 'קצב וצליל'
  });
  he.gates[4] = { label: 'חדוה', spell: true, lines: ['ארבעה שערים. ארבע אותיות.'],
    after: ['חדוה. שמחה.', 'האות היא המידה, והמידה היא הנשימה.', 'עתה — בקצב הנשימה שלך. הקול מוביל, והעיניים יכולות להיעצם.'],
    safety: 'לאט, ולא עמוק. ראש שמסתחרר — מרפים, ושבים לנשימה של כל יום.', cta: 'לנשום' };
  he.leaves[2].b = 'היום, נשימה אחת בכל פעם — בתודה.';
  // The path no longer passes through gates; these lines used to point back at them.
  he.leaves[3].b = 'שלושה כבר פגשת: נפש, רוח, נשמה. שניים מחכים למעלה.';
  he.testBody = 'משפט אחד, במילים שלך: מה השתנה. הוא ייכתב על דף, והדף ילך הלאה — אל מי שעוד לא גילה את הסוד.';
  // The opening already says that the secret is a breath; the gates lead to its measure.
  he.gates[3] = { label: 'סוד', gloss: 'שער רביעי', items: [['line', 'וכך כתוב בספר ישן:'], ['verse', 'וְהָאֲנָחָה הוּא אֲרִיכַת הַנְּשִׁימָה', 'ליקוטי מוהר״ן, תורה ח'], ['line', 'לאריכות הזאת יש מידה.'], ['line', 'והמידה — מילה אחת.']] };
  he.land = {
    kicker: 'סוד עתיק · מספר קבלה',
    h1a: 'יש סוד מוסתר.', h1b: 'כאן הוא מתגלה לך.',
    // Before 21 November 2026: 'נשימה, במקצב סודי אחד, שבכוחה לשנות את המציאות שלך.'
    sub: 'הנשימה היא המפתח. יש קוד סודי שהגיע עכשיו אליך: מקצב אחד, מיוחד מאוד, מתוך ספר קבלה עתיק. בכוחו לשנות את המציאות שלך.',
    src3: 'שהנשימה היא המפתח, על כך מסכימים מקורות רבים מעולמות שונים: הקבלה, הרפואה ופיזיקת הקוונטים.', more: 'לקרוא עוד',
    cta: 'לגלות את הסוד', cta3: 'להתחיל את האתגר', why: 'רוצה להבין למה?',
    terms: ['ארבעה־עשר ימים', 'שלוש פעמים ביום', 'בלי רישום', 'בלי עלות'],
    // The founder's pitch (21 November 2026). Before it, this section read: "אל דף שנשמר הרבה זמן." /
    // "בספר קבלה ישן הוסתר סוד פשוט: לנשימה יש מידה." / "מי שנושם במידה הזאת — משהו בו מתיישב,
    // ומשהו בעולמו זז." / "המידה נקראת במילה אחת. נשימה אחת, והיא מתגלה."
    openLink: 'עמוד הפתיחה', next3: 'הלאה', introK: 'נשימה', introGo: 'לקבל את המתנה', introA: 'איך הנשימה שלך', introB: 'עכשיו?',
    s1tag: 'הסוד', s1h: 'יש סוד מוסתר. כאן הוא מתגלה לך.',
    // The version before this one, in the founder's first wording: "הסטרס, הלחץ, הוא אבי אבות
    // החולאים." / "הרמב״ם כתב על כך כבר לפני שמונה מאות שנה, והמחקר של היום מאשר." / "לכן יש
    // לנו סוד. פתרון פשוט, שעובד אצלנו כמו קסם." / "ואני רוצה לעשות איתך חסד, ולתת לך אותו במתנה."
    intro: ['קצרה? זה הלחץ.',
      'הוא יורד אל הלב, אל השינה, אל הבטן. מקור גדול לחולאים, כתב הרמב״ם לפני שמונה מאות שנה. המחקר מאשר.',
      'מדיטציה, יוגה, חופשה. לא תמיד יש זמן.',
      'יש לי מתנה בשבילך: סוד קסום, שהולך איתך לכל מקום ועוזר לך. חסד. קח אותו.'],
    s1p: ['נשימה, במקצב סודי אחד, שבכוחה לשנות את המציאות שלך.', 'בספר קבלה ישן הוסתר סוד פשוט: לנשימה יש מידה.', 'נשימה אחת, והיא מתגלה.'],
    s2tag: 'למה זה עובד', s2h: 'שלושה עולמות. מפתח אחד.', s2sub: 'הנשימה ידועה לכול: הקבלה, הרפואה ופיזיקת הקוונטים מעידות על כוחה. הסוד הוא המקצב.',
    pillars: [
      { tag: 'הקבלה', h: '״עיקר תיקון השכל הוא על ידי הנשימה.״', p: 'ועוד אמר: מי שמאריך את נשימתו עושה את עצמו בריה חדשה.', c: 'רבי נחמן מברסלב, לפני מאתיים שנה · ליקוטי מוהר״ן, תורה ס' },
      { tag: 'הרפואה', h: 'הלב נרגע.', p: 'הקצב הסודי מאט את הנשימה לכחמש נשימות בדקה. בקצב כזה הלב נרגע דרך עצב הוואגוס, וזה נמדד במעבדות שוב ושוב.', c: 'מחקרים על נשימה איטית וקצב הלב' },
      { tag: 'פיזיקת הקוונטים', h: 'משנים תדר, משנים מציאות.', p: 'בעומקו, החומר הוא תנודה, והמתבונן משפיע על מה שהוא רואה. גם הנשימה היא תנודה: מקצב.', c: 'פיזיקת הקוונטים · תורת התדר של דולורס קנון' }
    ],
    s2foot: 'שלוש שפות, מפתח אחד.', s2more: 'כל המקורות',
    s3tag: 'האתגר', s3h: 'אני מזמין אותך לארבעה־עשר ימים.', s3sub: 'שלוש פעמים ביום, כמה דקות בכל פעם. זה כל מה שמתבקש ממך.',
    steps: [['נושמים שלוש פעמים ביום', 'שלוש וחצי, שש או שתים־עשרה דקות, לבחירתך. עם אוזניות, בעיניים עצומות.'], ['בכל יום נפתח דף', 'ארבעה־עשר דפים מן הספר. אחד ליום.'], ['ביום הארבעה־עשר כותבים', 'מה השתנה. במילים שלך.']],
    s4tag: 'חסד', s4h: 'זה ניתן לך בלי תמורה.',
    s4p: 'מישהו עשה איתך חסד. אם זה ייטיב איתך — יגיע תורך: להעביר את הדף לאדם אחד. כך הסוד עובר, מיד ליד.',
    s5a: 'אל תאמינו.', s5b: 'נסו.', cta2: 'לנשימה הראשונה',
    fine: 'לאט ובנחת. גוף שמבקש לעצור — עוצרים.',
    spine: ['הקדמה', 'השער', 'שלושה עולמות', 'האתגר', 'חסד', 'נשימה ראשונה']
  };

  Object.assign(en, {
    frontSub: 'An old secret, hidden in a book of Kabbalah',
    frontBody: 'In an old book of Kabbalah a secret was hidden: the power of the breath in the right rhythm. Here it is given to everyone, for nothing.',
    frontGift: 'This is a kindness done to you. And if it does you good, it will pass on from you, to another.',
    invitedBy: function (n, h) { return (n ? 'This kindness came to you from ' + n + '.' : 'This kindness was passed to you.') + (h > 1 ? ' ' + h + ' hands on the way.' : ''); },
    heroKicker: 'Neshima', introTitle: 'Before you breathe',
    rHadva: 'The Hadva breath · 8·4·6·5',
    afterShort: 'Short. It is noted all the same.',
    setupTitle: 'Three times a day',
    calTitle: 'Neshima · the Hadva breath', calDesc: 'Time to breathe. Headphones, and begin.',
    today: function (n) { return n === 0 ? 'Not yet today.' : n === 1 ? 'Today: once of three.' : 'Today: ' + n + ' of three.'; },
    todayFull: 'Three times today. Anything more is a gift.',
    remEdit: 'Reminder times',
    refSummary: function (n, d) { return (n === 1 ? 'Once' : n + ' times') + ', on ' + d + ' of fourteen days.'; },
    refPrompt: 'You were given one secret. What changed — in your body, your heart, your reality? “Nothing” is a true answer too.',
    chalBody: 'Three times a day, for fourteen days. Each time the Hadva breath, at the pace of your own breath. And at the end, what changed is written here, truthfully.',
    chalLen: 'The length of each time', manLen: 'Length of each time',
    measRes: function (sec, cyc) { return 'Your in-breath: ' + sec + ' seconds. One whole Hadva breath: ' + cyc + ' seconds.'; },
    levBody: 'Hesed — seventy-two. Each time is measured in hesed.',
    leafVeil: ['Opens the first time you breathe today.', 'Opens the second time.', 'Opens the third time.'],
    hesedAsk: 'Fourteen days are before you. When it has done you good, your turn will come to pass it on, to one person.',
    hesedNow: 'Pass it on now',
    turnT: 'Your turn has come.',
    turnBody: 'If this is doing you good, now is the time to do a kindness for one person.',
    waBtn: 'Send on WhatsApp', moreWays: 'Other ways',
    shareTitle: 'Pass the kindness on', shareLink: 'Pass the kindness on', shareDay: 'Pass the kindness on',
    shareBody: 'One person at a time. The message does not give the secret away; it only opens the leaf.',
    shareMsg: function (d, dots, url) { return 'A kindness was done to me, and now it passes to you.\nAn old secret, hidden in a book of Kabbalah. Fourteen days, for nothing.\n' + url; },
    shareInviteMsg: function (url) { return 'A kindness was done to me, and now it passes to you.\nAn old secret, hidden in a book of Kabbalah. Fourteen days, for nothing.\n' + url; },
    testMsg: function (tx, url) { return '“' + tx + '”\nFourteen days of breath. A kindness was done to me, and now it passes to you.\n' + url; },
    testCard: function (d) { return d >= 14 ? 'I completed the fourteen-day challenge' : d ? 'Day ' + d + ' of fourteen' : 'Testimony'; },
    testFine: 'Only this sentence leaves here, and it will also be shown to whoever opens your link. All the rest stays with you. And if nothing changed, the leaf stays blank.',
    afterAgain: 'It is marked on your tree.', inviteQ: 'Fourteen days.',
    actIn: 'In', actLinger: 'Linger', actOut: 'Out', actRest: 'Rest',
    sosTop: 'SOS', sosBtn: 'SOS',
    sosSub: function (t) { return 'SOS · ' + t; }, sosRow: function (t) { return t + ' of breath'; },
    sosLand: function (t) { return 'SOS — ' + t + ' of breath, right now'; },
    momentLead: 'Before you react — breathe.', momentDone: 'I am done',
    momentAfter: 'Now you can respond.', sosAfterLead: function (t) { return t + ' of breath.'; },
    sosAfterShort: 'You can come back here at any moment.', sosHome: 'To the breathing board', sosAgain: 'One more',
    sosPitch: 'This is the breath of the secret. Fourteen days of it teach the body — and in a hard moment it already knows.',
    sosPitchGo: 'Uncover the secret',
    firstKick: 'The secret code', firstT: 'One breath, and the code shows itself.',
    firstLead: 'Breathe with the circle: in, linger, out, rest. In each part a letter lights, with its number.',
    firstGo: 'Begin', firstAgain: 'Once more',
    firstDone1: 'Hadva. Joy.',
    firstDone2: 'This is the code: in 8, linger 4, out 6, rest 5.',
    firstDoneSr: 'In 8, linger 4, out 6, rest 5.',
    thSkip: 'I have been here',
    chalBody: 'Three times a day, for fourteen days. The Hadva breath, at the pace of your own breath.',
    chalLen: 'The length of each time — your choice', chalGo: 'Begin',
    beginK: 'Before you begin', beginT: 'Before the first breath.', beginLead: 'Three short steps:', beginGo: 'Let us begin',
    beginSteps: ['You choose how long you breathe each time.', 'Your breath is measured, so that the rhythm fits you exactly.', 'You breathe by the secret code: in 8, linger 4, out 6, rest 5.'],
    chalTitle: 'How long each time?', chalBody2: 'Three times a day, for fourteen days. The middle one is marked, and you can change it on any day.', chalGo2: 'Measure my breath', codeTry: 'Try one breath first',
    levNote: 'You can change it on any day.',
    measT: 'Setting out.', measKeep: function (sec) { return 'Keep the earlier measure: ' + sec + ' seconds'; },
    measBody: 'Before the practice your breath is measured, and the rhythm is built on it. One in-breath, full and calm: a touch as it begins, and a touch as it ends.',
    readyT: 'Ready?', readyLead: 'Here we begin.',
    readyLines: ['Headphones on.', 'The eyes may close.', 'The sound leads: in, linger, out, rest.'],
    readyGo: 'Begin',
    doneT: 'Done.', homeT: 'The breathing board', homeGo: 'Begin',
    goodT: 'Something good for someone who matters to you.', goodBody: 'A kindness was done to you. Now you can pass it on.', goodBtn: 'Share',
    leaveText: 'Leave a few words',
    keepT: 'To come back tomorrow.', keepLead: 'Your place is kept on this device. No sign-up, no email.',
    keepHomeT: 'Add to the home screen', keepHomeB: 'An icon on your phone, and one touch brings you back to the board.', keepHomeBtn: 'Add',
    keepHomeIos: 'In Safari: the share button, then “Add to Home Screen”.', keepHomeOther: 'In the browser menu: “Add to Home screen” or “Install app”.',
    keepRemT: 'Three reminders a day', keepRemB: 'They go into your phone’s calendar, for fourteen days:', keepRemBtn: 'Add to calendar', keepRemEdit: 'Change the times',
    keepLinkT: 'Your personal link', keepLinkB: 'It brings you back to your place, from another device too. Send it to yourself.',
    keepLinkWa: 'Send to myself', keepLinkCopy: 'Copy',
    keepLinkMsg: function (url) { return 'My board in the breathing challenge:\n' + url; },
    keepGo: 'To the breathing board', menuT: 'Menu', manKeep: 'Coming back', manKeepVal: 'home screen · personal link',
    restored: 'Your place has been restored.',
    sealLabel: function (n, d) { return 'My tree: ' + n + ' of 42, day ' + d + '.'; },
    privacyBody: 'There is no account and no analytics. Your progress, check-ins and reflection are stored only in this browser on this device, and the site does not send them anywhere. That also means we cannot recover them: clearing browser data removes them, unless you kept your personal link. As with any website, the hosting company (GitHub) sees the IP address of whoever visits and may keep it in its logs.',
    whence: 'Sources', tune: 'Pace and sound'
  });
  en.gates[4] = { label: 'Hadva', spell: true, lines: ['Four gates. Four letters.'],
    after: ['Hadva. Joy.', 'The letter is the measure, and the measure is the breath.', 'Now — at the pace of your own breath. The sound leads, and the eyes may close.'],
    safety: 'Slower, not deeper. A head that spins: let go, and return to the breath of every day.', cta: 'Breathe' };
  en.leaves[2].b = 'Today, one breath each time — in thanks.';
  en.leaves[3].b = 'Three you have met: nefesh, ruach, neshamah. Two wait higher up.';
  en.testBody = 'One sentence, in your own words: what changed. It is written on a leaf, and the leaf goes on — to one who has not yet uncovered the secret.';
  en.gates[3] = { label: 'Sod', gloss: 'the fourth gate · the secret', items: [['line', 'And so it is written in an old book:'], ['verse', 'וְהָאֲנָחָה הוּא אֲרִיכַת הַנְּשִׁימָה', '“The sigh is the lengthening of the breath.” Likutey Moharan, Lesson 8'], ['line', 'That lengthening has a measure.'], ['line', 'And the measure is one word.']] };
  en.land = {
    kicker: 'An ancient secret · from a book of Kabbalah',
    h1a: 'There is a hidden secret.', h1b: 'Here it is shown to you.',
    sub: 'The breath is the key. A secret code has now reached you: one rhythm, a very special one, from an ancient book of Kabbalah. It has the power to change your reality.',
    src3: 'That the breath is the key, many sources from different worlds agree: Kabbalah, medicine and quantum physics.', more: 'Read more',
    cta: 'Uncover the secret', cta3: 'Begin the challenge', why: 'Want to understand why?',
    terms: ['Fourteen days', 'three times a day', 'no sign-up', 'no cost'],
    openLink: 'The opening page', next3: 'Onward', introK: 'Neshima', introGo: 'Receive the gift', introA: 'How is your breath', introB: 'right now?',
    s1tag: 'The secret', s1h: 'There is a hidden secret. Here it is shown to you.',
    intro: ['Short? That is stress.',
      'It goes down to the heart, to sleep, to the gut. A great source of illness, wrote Maimonides eight hundred years ago. The research agrees.',
      'Meditation, yoga, a holiday. There is not always time.',
      'I have a gift for you: a magical secret that goes with you everywhere and helps you. A kindness. Take it.'],
    s1p: ['A breath, in one secret rhythm, with the power to change your reality.', 'In an old book of Kabbalah a simple secret was hidden: the breath has a measure.', 'One breath, and it shows itself.'],
    s2tag: 'Why it works', s2h: 'Three worlds. One key.', s2sub: 'The breath is known to all: Kabbalah, medicine and quantum physics testify to its power. The secret is the rhythm.',
    pillars: [
      { tag: 'Kabbalah', h: '“The chief repair of the mind is through the breath.”', p: 'And he said also: whoever lengthens their breath makes themselves a new creature.', c: 'Rabbi Nachman of Breslov, two hundred years ago · Likutey Moharan, Lesson 60' },
      { tag: 'Medicine', h: 'The heart settles.', p: 'The secret rhythm slows the breath to about five breaths a minute. At that pace the heart settles through the vagus nerve, and this has been measured in laboratories again and again.', c: 'Studies of slow breathing and heart rate' },
      { tag: 'Quantum physics', h: 'Change the frequency, change the reality.', p: 'In its depth, matter is vibration, and the one who observes affects what is seen. Breath too is a vibration: a rhythm.', c: 'Quantum physics · the frequency teaching of Dolores Cannon' }
    ],
    s2foot: 'Three tongues. One key.', s2more: 'All the sources',
    s3tag: 'The challenge', s3h: 'I invite you to fourteen days.', s3sub: 'Three times a day, a few minutes each time. That is all that is asked of you.',
    steps: [['You breathe three times a day', 'Three and a half, six or twelve minutes, as you choose. Headphones on, eyes closed.'], ['Each day a leaf opens', 'Fourteen leaves of the book. One a day.'], ['On the fourteenth day you write', 'What changed. In your own words.']],
    s4tag: 'Kindness', s4h: 'It is given to you for nothing.',
    s4p: 'Someone did you a kindness. If it does you good, your turn will come: to pass the leaf to one person. That is how the secret travels, hand to hand.',
    s5a: 'Do not believe.', s5b: 'Try.', cta2: 'To the first breath',
    fine: 'Slowly and at ease. A body that asks to stop, stops.',
    spine: ['Introduction', 'The gate', 'Three worlds', 'The challenge', 'Kindness', 'First breath']
  };
// The sources page, as the founder frames it: the rhythm is the secret, noted in an old book
  // of Kabbalah, and it comes first; everything after it explains why breath changes reality.
  // This entry is the founder's own statement. It names no book and quotes no text, because
  // none has been given; nothing here should be turned into a citation until one is.
  function reframe(L, top, lead, tag, oldRef, reading, about) {
    L.src = L.src.filter(function (it) { return it.tag !== 'method'; });
    L.src.forEach(function (it) { if (it.tag === 'interp' && it.ref === oldRef) { it.ref = reading.ref; it.body = reading.body; } });
    L.src.unshift(top); L.srcLead = lead; L.tagMethod = tag; L.aboutBody = about;
  }
  reframe(he,
    { tag: 'method', ref: 'הקצב — סוד מספר קבלה ישן', body: 'בספר קבלה ישן צוין סוד: קצב של נשימה. שהנשימה משנה את המציאות — זה ידוע מכבר. הסוד הוא הנשימה בקצב המיוחד הזה: חדוה — שאיפה 8, השתהות 4, נשיפה 6, מנוחה 5. זה מה שניתן כאן.' },
    'הקצב הוא הסוד, והוא עומד כאן ראשון. כל מה שאחריו מסביר למה נשימה משנה מציאות.',
    'הסוד',
    'איך התרגול הזה קורא אותם',
    { ref: 'מה עולה מן המקורות', body: 'מן המקורות האלה עולה דרך להתייחס לנשימה: כמתנה, כתיקון, וכדבר שמשנה את האדם ואת עולמו. הם ההסבר למה נשימה משנה מציאות. הקצב עצמו הוא הסוד.' },
    'אני מאמין שלנשימה יש עומק רוחני, ושמי שמשנה את התדר שלו משנה את המציאות שלו. את הקצב מצאתי בספר קבלה ישן, ואני נותן אותו כאן לכל אדם, בלי תמורה. זהו תרגול רוחני אישי, לא טיפול רפואי, ואין בו הבטחה לתוצאה ולא מסרים סמויים.');
  reframe(en,
    { tag: 'method', ref: 'The rhythm — a secret from an old book of Kabbalah', body: 'In an old book of Kabbalah a secret was noted: a rhythm of breath. That breath changes reality has long been known. The secret is the breath in this particular rhythm: Hadva — in 8, linger 4, out 6, rest 5. That is what is given here.' },
    'The rhythm is the secret, and it stands here first. Everything after it explains why breath changes reality.',
    'The secret',
    'How this practice reads them',
    { ref: 'What the sources come to', body: 'From these sources comes a way of regarding the breath: as a gift, as a repair, and as something that changes a person and their world. They are the explanation of why breath changes reality. The rhythm itself is the secret.' },
    'I believe that breath has spiritual depth, and that whoever changes their frequency changes their reality. I found the rhythm in an old book of Kabbalah, and I give it here to everyone, for nothing. This is a personal spiritual practice, not medical treatment; it promises no result and contains no hidden messages.');
  // The four gates are no longer on the path, so the Pardes source no longer names them.
  [he, en].forEach(function (L) {
    L.src.forEach(function (it) {
      if (!it.url) return;
      if (it.url.indexOf('Chagigah') >= 0) it.body = it.body.replace(' אלה שמות ארבעת השערים.', '').replace(' These name the four gates.', '');
      if (it.url.indexOf('Sefer_Yetzirah.1.7') >= 0) it.body = it.body.replace('השורה שמעל השער.', 'השורה הכתובה סביב הגלגל.').replace('The line over the gate:', 'The line written around the wheel:');
    });
  });
  // The pitch names Maimonides and "the research of today". These two entries say what each
  // actually says, so that the opening can speak boldly and the Sources page stays exact.
  he.src.splice(1, 0,
    { tag: 'text', ref: 'הרמב״ם, הנהגת הבריאות (1198)', body: 'הרמב״ם היה רופא חצר במצרים, ואת החיבור כתב לסולטאן אל־אפדל, בנו של צלאח א־דין. נאמר בו שיש להשגיח תמיד על תנועות הנפש ולאזן אותן, בבריאות ובחולי, ושאין להקדים להן שום הנהגה אחרת. הדברים מובאים כאן בתמצית, לפי תרגום אקדמי לאנגלית, ולא בלשון המקור.', url: 'https://www.posenlibrary.com/entry/regimen-health' },
    { tag: 'science', ref: 'לחץ נפשי ומחלה · Cohen, Janicki-Deverts, Miller · JAMA, 2007', body: 'סקירה בכתב העת של ההסתדרות הרפואית האמריקאית: לחץ מתמשך קשור לדיכאון ולמחלות לב וכלי דם, והראיות לגבי מחלות אחרות חלקיות. לחץ מעלה את הסיכון, ואינו מבטיח מחלה. הלחץ קשור אפוא לתחלואים רבים, ולא לכולם.', url: 'https://doi.org/10.1001/jama.298.14.1685' });
  en.src.splice(1, 0,
    { tag: 'text', ref: 'Maimonides, On the Regimen of Health (1198)', body: 'Maimonides was a court physician in Egypt and wrote the work for the sultan al-Afdal, son of Saladin. It says that care should always be given to the movements of the soul, that they should be kept in balance in health and in illness, and that no other regimen should come before this. Given here in summary, from an academic English translation, not in the original wording.', url: 'https://www.posenlibrary.com/entry/regimen-health' },
    { tag: 'science', ref: 'Psychological Stress and Disease · Cohen, Janicki-Deverts, Miller · JAMA, 2007', body: 'A review in the Journal of the American Medical Association: lasting stress is linked to depression and to cardiovascular disease, and the evidence for other diseases is partial. Stress raises the risk; it does not guarantee illness. So stress is tied to many ailments, not to all of them.', url: 'https://doi.org/10.1001/jama.298.14.1685' });
  he.src.splice(3, 0, { tag: 'science', ref: 'לחץ מתמשך והגוף · Mayo Clinic', body: 'לחץ מתמשך משאיר את הורמוני הלחץ פעילים זמן רב מדי. לפי Mayo Clinic זה עלול להביא לשינה גרועה, לבעיות עיכול ולמחלות לב, ובזמן לחץ הנשימה נעשית מהירה וקצרה. על זה נשען המשפט ״הוא יורד אל הלב, אל השינה, אל הבטן״ שבעמוד הפתיחה.', url: 'https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress/art-20046037' });
  en.src.splice(3, 0, { tag: 'science', ref: 'Lasting stress and the body · Mayo Clinic', body: 'Lasting stress keeps the stress hormones active for too long. According to Mayo Clinic this can lead to poor sleep, digestive problems and heart disease, and under stress the breath becomes fast and short. This is what the line "to the heart, to sleep, to the gut" on the opening rests on.', url: 'https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/stress/art-20046037' });
})();
