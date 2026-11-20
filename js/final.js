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
    whence: 'מקורות', tune: 'קצב וצליל'
  });
  he.gates[4] = { label: 'חדוה', spell: true, lines: ['ארבעה שערים. ארבע אותיות.'],
    after: ['חדוה. שמחה.', 'האות היא המידה, והמידה היא הנשימה.', 'עתה — בקצב הנשימה שלך. הקול מוביל, והעיניים יכולות להיעצם.'],
    safety: 'לאט, ולא עמוק. ראש שמסתחרר — מרפים, ושבים לנשימה של כל יום.', cta: 'לנשום' };
  he.leaves[2].b = 'היום, נשימה אחת בכל פעם — בתודה.';

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
    whence: 'Sources', tune: 'Pace and sound'
  });
  en.gates[4] = { label: 'Hadva', spell: true, lines: ['Four gates. Four letters.'],
    after: ['Hadva. Joy.', 'The letter is the measure, and the measure is the breath.', 'Now — at the pace of your own breath. The sound leads, and the eyes may close.'],
    safety: 'Slower, not deeper. A head that spins: let go, and return to the breath of every day.', cta: 'Breathe' };
  en.leaves[2].b = 'Today, one breath each time — in thanks.';
})();
