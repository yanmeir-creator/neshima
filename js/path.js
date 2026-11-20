/* The hidden path — the founder's own telling: "I found a secret in an old book of
   Kabbalah, and I want to give it to you." A descent through seven gates to one secret,
   then the whisper, then the fourteen-day challenge.

   Written in the founder's first person, as his discovery and his conviction.
   The book is real (Likutey Moharan, first printed 1808) and the line quoted from it is
   verbatim. The rhythm 8·4·6·5 is credited inside the story to "a Kabbalist of our own
   generation", and by name on the Sources page. Loaded after brand.js. */
(function () {
  var S = window.NESHIMA_STRINGS;

  Object.assign(S.he, {
    thTitle: 'מצאתי סוד בספר קבלה ישן.',
    thBody: 'הוא חיכה שם יותר ממאתיים שנה, מוסתר במקום שאיש לא חושד בו. אני רוצה לתת לך אותו.',
    thEnter: 'לפתוח את הספר',
    thFine: 'שבעה שערים. סוד אחד. בלי הרשמה, בלי תשלום.',
    thSkip: 'כבר הייתי כאן — ישר אל הלחש',
    deeper: 'לרדת עמוק יותר',
    pathLink: 'הדרך אל הסוד',
    whence: 'הספרים שמאחורי הסוד',
    tune: 'קצב וצליל',
    gates: [
      { label: 'שער ראשון · ההזמנה', lines: ['זו הזמנה למסע של תיקון הנפש.', 'לא קורס. לא סדנה. לא דרך ארוכה וקשה.', 'יש לי סוד. ויש לי לחש.', 'ואני רוצה לתת לך את שניהם.'] },
      { label: 'שער שני · ההסתר', lines: ['בעברית, ״עוֹלָם״ ו״הֶעְלֵם״ הן אותה מילה.', 'המקובלים ידעו: מה שנראה לנו כמו המציאות הוא רק המעטה שלה.', 'מתחתיו יש מציאות אחרת. האמיתית.', 'והיא קרובה אליך יותר ממה שנדמה.'] },
      { label: 'שער שלישי · התדר', lines: ['דולורס קנון הקדישה עשרות שנים למה שמסתתר מתחת לתודעה.', 'את מה שלימדה אפשר לומר במשפט אחד:', 'המציאות שלך היא התדר שלך.', 'מי שמשנה את התדר — עובר למציאות אחרת.'] },
      { label: 'שער רביעי · ההד', lines: ['גם הפיזיקה ירדה אל מתחת לחומר. היא לא מצאה שם דבר מוצק — היא מצאה שדות, גלים, תנודות.', 'קבלה עתיקה. חוקרת תודעה. פיזיקה של קוונטים.', 'שלושה עולמות שלא נפגשו מעולם — ואני רואה איך שלושתם מראים את אותה מציאות.', 'בשבילי, זה משלים את האמונה.'] },
      { label: 'שער חמישי · האמונה', lines: ['אני מאמין בזה בכל ליבי:', 'מי שמשנה את התדר שלו — משנה את המציאות שלו.', 'שנים חיפשתי איך עושים את זה.', 'את התשובה לא מצאתי בקורס. מצאתי אותה בספר.'] },
      { label: 'שער שישי · הספר', lines: ['ספר קבלה ישן. נדפס לפני יותר ממאתיים שנה.', 'בעמוד אחד, בשורה אחת, הסוד כתוב במפורש:'], verse: 'וְהָאֲנָחָה הוּא אֲרִיכַת הַנְּשִׁימָה', ref: 'ליקוטי מוהר״ן, תורה ח', after: ['מי שמאריך את הנשימה — כך כתוב שם — ממשיך רוח חיים אל מה שחסר לו.', 'ומשלים את החיסרון.'] },
      { label: 'שער שביעי · הגילוי', huge: 'נשימה.', lines: ['כן. רק נשימה.', 'הסוד לא הוסתר במקום רחוק. הוא הוסתר בפשטות.'], big: 'נֶפֶשׁ · רוּחַ · נְשָׁמָה', after: ['שלושה שמות עתיקים לנפש — ושלושתם נשימה.', 'הוא היה איתך מהרגע הראשון שלך.'], cta: 'ומה הלחש?' },
      { label: 'הלחש', spell: true, lines: ['אבל לא כל נשימה. נשימה בדרך הזאת.', 'לחש הוא לחישה. ולחישה היא נשימה.'], after: ['חדוה. שמחה. מילה מן המקרא.', 'מקובל בן דורנו נתן לסוד הזה קצב — ארבע האותיות שלה:', 'שאיפה 8 · השתהות 4 · נשיפה 6 · מנוחה 5', 'שבע פעמים. זה כל הלחש.'], safety: 'בעדינות: לאט, לא עמוק. אם מופיעה סחרחורת — מרפים וחוזרים לנשימה רגילה.', cta: 'ללחוש אותו עכשיו' }
    ],

    // After the reveal: the same voice, everywhere.
    heroKicker: 'נשימה · הלחש',
    heroTitle: 'הסוד כבר אצלך.',
    heroSub: 'נשימה אחת, בדרך הזאת: 8·4·6·5. עכשיו נשאר רק לחזור אליה.',
    heroDare: 'ארבעה־עשר ימים. ואז כותבים מה השתנה.',
    how: [
      ['לוחשים את המילה', 'ארבע אותיות קובעות את הקצב. שבע נשימות.'],
      ['שלוש פעמים ביום', 'בוקר, צהריים, לילה. דקה וחצי בכל פעם.'],
      ['מדליקים ארבעים ושתיים אורות', 'כל לחישה מדליקה אור בחותם. ארבעים ושתיים — כמספר האותיות בשם מ״ב העתיק.'],
      ['מעבירים את הסוד', 'סוד כזה לא שומרים. נותנים אותו הלאה.']
    ],
    noPromise: 'אני לא מבטיח לך דבר. אני מזמין אותך לבדוק: ארבעה־עשר ימים, ואז לכתוב מה השתנה.',
    introTitle: 'לפני הלחישה',
    rHadva: 'הלחש · 8·4·6·5', rHadvaD: 'שאיפה, השתהות, נשיפה, מנוחה — כאותיות חדוה.',
    afterTitle: 'זהו. זה כל הסוד.',
    afterShort: 'לחישה קצרה. גם היא נשמעה.',
    inviteQ: 'ועכשיו — האתגר.',
    inviteBody: '14 ימים. 3 פעמים ביום. 7 נשימות של הלחש. משהו פשוט מאוד. ואחרי שבועיים — כותבים כאן, בכנות, מה מרגישים.',
    setup: 'אני בפנים',
    setupTitle: 'שלוש לחישות ביום',
    setupBody: 'כמו שחרית, מנחה וערבית — שלושה רגעים קבועים. בוחרים אותם עכשיו, וקושרים כל אחד למשהו שכבר קורה: קפה, ארוחת צהריים, לפני השינה.',
    calTitle: 'נשימה · הלחש', calDesc: 'הגיע זמן הלחש. אוזניות, ולהתחיל.',
    pauseNow: 'ללחוש עכשיו · 7 נשימות', pauseLong: 'לחישה ארוכה · 21 נשימות',
    shortNote: 'שבע נשימות מדליקות אור אחד.',
    day: function (n, total) { return 'יום ' + n + ' מתוך ' + total; },
    dayBeyond: function (n) { return 'יום ' + n + ' — הסוד כבר שלך'; },
    today: function (n) { return n === 0 ? 'היום עוד לא נלחש.' : n === 1 ? 'היום: לחישה אחת.' : 'היום: ' + n + ' לחישות.'; },
    todayFull: 'שלוש לחישות היום. כל השאר — מתנה.',
    welcomeBack: 'טוב לחזור. האורות שהדלקת עדיין דולקים.',
    sealLabel: function (n, d) { return 'החותם שלי: ' + n + ' מתוך 42 אורות דולקים, יום ' + d + '.'; },
    doneTitle: 'ארבעה־עשר ימים. הגיע הרגע.', doneCta: 'מה השתנה במציאות שלך?',
    reflectLink: 'מה השתנה', remEdit: 'שעות הלחישה', practiceSettings: 'קצב וצליל',
    momentLead: 'בלי לחשוב. רק הנשימה הזאת.',
    refTitle: 'מה השתנה?',
    refSummary: function (n, d) { return (n === 1 ? 'לחישה אחת' : n + ' לחישות') + ', ב־' + d + ' מתוך ארבעה־עשר ימים.'; },
    refEarly: 'אפשר לכתוב כאן בכל שלב. השאלה האמיתית מחכה ליום הארבעה־עשר.',
    refPrompt: 'קיבלת סוד אחד ולחש אחד. מה מרגישים עכשיו? מה השתנה — בגוף, בלב, במציאות שלך? גם ״שום דבר״ היא תשובה כנה.',
    teamT: 'לספר לי — רק אם רוצים',
    teamLabel: 'כמה מילים למי שנתן לך את הסוד',
    shareTitle: 'מעבירים את הסוד', shareLink: 'להעביר את הסוד', shareDay: 'להעביר את הסוד',
    shareBody: 'החותם מראה רק אילו לחישות נעשו. שום דבר שנכתב כאן לא מופיע בו.',
    cardTitle: function (d) { return 'נשימה · יום ' + d + ' מתוך 14'; },
    cardInvite: 'מצאתי סוד בספר ישן',
    cardFoot: 'סוד עתיק, מוסתר בפשטות',
    shareMsg: function (d, dots, url) { return 'חדוה · יום ' + d + '/14\n' + dots + '\nקיבלתי סוד מספר קבלה ישן. הוא מוסתר בפשטות.\nשבעה שערים בדרך אליו: ' + url; },
    shareInviteMsg: function (url) { return 'יש סוד מספר קבלה ישן, מוסתר בפשטות.\nשבעה שערים בדרך אליו: ' + url; },
    invitedBy: function (n) { return 'הסוד הזה הגיע אליך מ' + n + '.'; },
    srcTitle: 'הספרים שמאחורי הסוד',
    srcLead: 'כאן הכול גלוי: מה כתוב בספרים, מה אני מאמין, מי נתן לסוד את הקצב, ומה אומר המחקר. כל אחד מהם עומד בפני עצמו.',
    aboutT: 'מי מדבר כאן',
    aboutBody: 'אני מאמין שלנשימה יש עומק רוחני, ושמי שמשנה את התדר שלו משנה את המציאות שלו. את הסוד מצאתי בליקוטי מוהר״ן של רבי נחמן מברסלב; את הקצב 8·4·6·5 מלמד בדורנו הרב יצחק גינזבורג (גל עיני), והמיזם הזה אינו קשור אליו. ״נשימה״ הוא עדיין שם עבודה. זהו תרגול רוחני אישי, לא טיפול רפואי, ואין בו הבטחה לתוצאה ולא מסרים סמויים.'
  });
  S.he.src.push(
    { tag: 'interp', ref: 'דולורס קנון', body: 'היפנותרפיסטית וסופרת אמריקאית (1931–2014). לימדה שהמציאות שאדם חי בה קשורה לתדר שלו, ושהעלאת התדר מובילה למציאות אחרת. זו תורה רוחנית שלה, והיא חלק מהאמונה שמאחורי המסע הזה.' },
    { tag: 'interp', ref: 'שלושה עולמות, מציאות אחת', body: 'קבלה, חקר התודעה ופיזיקה של קוונטים מדברים בשפות שונות. אני רואה בהם שלושה מבטים על אותה מציאות, ובשבילי זה משלים את האמונה. זו השקפה רוחנית שלי.' },
    { tag: 'science', ref: 'מה הפיזיקה אומרת, ומה לא', body: 'בפיזיקה המודרנית חלקיקי החומר מתוארים כעירורים של שדות. הפיזיקה עצמה אינה אומרת שנשימה או ״תדר אישי״ משנים את המציאות; את החיבור הזה עושה האמונה, לא המעבדה.' }
  );

  Object.assign(S.en, {
    thTitle: 'I found a secret in an old book of Kabbalah.',
    thBody: 'It waited there for more than two hundred years, hidden where nobody thinks to look. I want to give it to you.',
    thEnter: 'Open the book',
    thFine: 'Seven gates. One secret. No sign-up, no payment.',
    thSkip: 'I’ve been here — take me to the whisper',
    deeper: 'Go deeper',
    pathLink: 'The path to the secret',
    whence: 'The books behind the secret',
    tune: 'Pace & sound',
    gates: [
      { label: 'The first gate · The invitation', lines: ['This is an invitation to a journey of mending the soul.', 'Not a course. Not a workshop. Not a long, hard road.', 'I have a secret. And I have a whisper.', 'I want to give you both.'] },
      { label: 'The second gate · The concealment', lines: ['In Hebrew, olam — “world” — and he’elem — “concealment” — are the same word.', 'The Kabbalists knew: what looks like reality is only its covering.', 'Beneath it lies another reality. The true one.', 'And it is closer to you than it seems.'] },
      { label: 'The third gate · The frequency', lines: ['Dolores Cannon gave decades to what lies beneath the conscious mind.', 'What she taught fits in one sentence:', 'Your reality is your frequency.', 'Change the frequency, and you step into a different reality.'] },
      { label: 'The fourth gate · The echo', lines: ['Physics, too, went looking beneath matter. It found nothing solid there — it found fields, waves, vibration.', 'Ancient Kabbalah. A researcher of consciousness. Quantum physics.', 'Three worlds that never met — and I see all three showing the same reality.', 'For me, that completes the faith.'] },
      { label: 'The fifth gate · The conviction', lines: ['I believe this with all my heart:', 'whoever changes their frequency changes their reality.', 'For years I searched for how it is done.', 'I did not find the answer in a course. I found it in a book.'] },
      { label: 'The sixth gate · The book', lines: ['An old book of Kabbalah. First printed more than two hundred years ago.', 'On one page, in one line, the secret is written in plain words:'], verse: 'וְהָאֲנָחָה הוּא אֲרִיכַת הַנְּשִׁימָה', ref: '“The sigh is the lengthening of the breath.” Likutey Moharan, Lesson 8', after: ['Whoever lengthens the breath — so it says there — draws the spirit of life toward what they lack.', 'And what was lacking is made whole.'] },
      { label: 'The seventh gate · The revelation', huge: 'Breath.', lines: ['Yes. Only breath.', 'The secret was not hidden somewhere far away. It was hidden in simplicity.'], big: 'נֶפֶשׁ · רוּחַ · נְשָׁמָה', bigGloss: 'nefesh · ruach · neshamah', after: ['Three ancient Hebrew names for the soul — and all three mean breath.', 'It has been with you since your first moment.'], cta: 'And the whisper?' },
      { label: 'The whisper', spell: true, lines: ['But not just any breath. Breath, in this way.', 'In Hebrew a spell is a lachash — a whisper. And a whisper is a breath.'], after: ['Hadva. Joy. A word from the Bible.', 'A Kabbalist of our own generation gave the secret a rhythm — the four letters of that word:', 'In 8 · linger 4 · out 6 · rest 5', 'Seven times. That is the whole whisper.'], safety: 'Gently: slower, not deeper. If you feel dizzy, let go and breathe normally.', cta: 'Whisper it now' }
    ],

    heroKicker: 'Neshima · The whisper',
    heroTitle: 'The secret is already yours.',
    heroSub: 'One breath, in this way: 8·4·6·5. All that is left is to return to it.',
    heroDare: 'Fourteen days. Then write down what changed.',
    how: [
      ['Whisper the word', 'Four letters set the rhythm. Seven breaths.'],
      ['Three times a day', 'Morning, midday, night. Ninety seconds each.'],
      ['Light forty-two lights', 'Each whisper lights one on your seal. Forty-two — the number of letters in the ancient 42-letter Name.'],
      ['Pass the secret on', 'A secret like this is not for keeping.']
    ],
    noPromise: 'I promise you nothing. I invite you to test it: fourteen days, and then write down what changed.',
    introTitle: 'Before the whisper',
    rHadva: 'The whisper · 8·4·6·5', rHadvaD: 'In, linger, out, rest — the letters of Hadva.',
    afterTitle: 'That’s it. That is the whole secret.',
    afterShort: 'A short whisper. It was heard too.',
    inviteQ: 'And now — the challenge.',
    inviteBody: '14 days. 3 times a day. 7 breaths of the whisper. Something very simple. And after two weeks, you write here, honestly, how you feel.',
    setup: 'I’m in',
    setupTitle: 'Three whispers a day',
    setupBody: 'Like the three daily prayers — morning, afternoon, night — three fixed moments. Pick them now and tie each one to something that already happens: coffee, lunch, bedtime.',
    calTitle: 'Neshima · The whisper', calDesc: 'Time for the whisper. Headphones, and begin.',
    pauseNow: 'Whisper now · 7 breaths', pauseLong: 'A long whisper · 21 breaths',
    shortNote: 'Seven breaths light one light.',
    dayBeyond: function (n) { return 'Day ' + n + ' — the secret is yours'; },
    today: function (n) { return n === 0 ? 'Not yet whispered today.' : n === 1 ? 'Today: one whisper.' : 'Today: ' + n + ' whispers.'; },
    todayFull: 'Three whispers today. Anything more is a gift.',
    welcomeBack: 'Good to see you. The lights you lit are still burning.',
    sealLabel: function (n, d) { return 'My seal: ' + n + ' of 42 lights lit, day ' + d + '.'; },
    doneTitle: 'Fourteen days. The moment has come.', doneCta: 'What changed in your reality?',
    reflectLink: 'What changed', remEdit: 'Whisper times', practiceSettings: 'Pace & sound',
    momentLead: 'No thinking. Only this breath.',
    refTitle: 'What changed?',
    refSummary: function (n, d) { return (n === 1 ? 'One whisper' : n + ' whispers') + ', on ' + d + ' of fourteen days.'; },
    refEarly: 'You can write here at any point. The real question waits for day fourteen.',
    refPrompt: 'You were given one secret and one whisper. How do you feel now? What changed — in your body, your heart, your reality? “Nothing” is an honest answer too.',
    teamT: 'Tell me — only if you want to',
    teamLabel: 'A few words for the one who gave you the secret',
    shareTitle: 'Pass the secret on', shareLink: 'Pass the secret on', shareDay: 'Pass the secret on',
    shareBody: 'Your seal shows only which whispers you took. Nothing you wrote is on it.',
    cardTitle: function (d) { return 'Neshima · Day ' + d + ' of 14'; },
    cardInvite: 'I found a secret in an old book',
    cardFoot: 'An ancient secret, hidden in simplicity',
    shareMsg: function (d, dots, url) { return 'Hadva · Day ' + d + '/14\n' + dots + '\nI was given a secret from an old book of Kabbalah. It is hidden in simplicity.\nSeven gates lead to it: ' + url; },
    shareInviteMsg: function (url) { return 'There is a secret from an old book of Kabbalah, hidden in simplicity.\nSeven gates lead to it: ' + url; },
    invitedBy: function (n) { return 'This secret reached you from ' + n + '.'; },
    srcTitle: 'The books behind the secret',
    srcLead: 'Everything is in the open here: what the books say, what I believe, who gave the secret its rhythm, and what research says. Each stands on its own.',
    aboutT: 'Who is speaking',
    aboutBody: 'I believe that breath has spiritual depth, and that whoever changes their frequency changes their reality. I found the secret in Likutey Moharan by Rabbi Nachman of Breslov; the 8·4·6·5 rhythm is taught in our generation by Rabbi Yitzchak Ginsburgh (Gal Einai), and this project is not affiliated with him. “Neshima” is still a working name. This is a personal spiritual practice, not medical treatment; it promises no result and contains no hidden messages.'
  });
  S.en.src.push(
    { tag: 'interp', ref: 'Dolores Cannon', body: 'An American hypnotherapist and author (1931–2014). She taught that the reality a person lives in is tied to their frequency, and that raising it leads into a different reality. It is her spiritual teaching, and part of the faith behind this journey.' },
    { tag: 'interp', ref: 'Three worlds, one reality', body: 'Kabbalah, the study of consciousness and quantum physics speak different languages. I see them as three views of the same reality, and for me that completes the faith. This is my own spiritual outlook.' },
    { tag: 'science', ref: 'What physics says, and what it does not', body: 'In modern physics, particles of matter are described as excitations of fields. Physics itself does not say that breath or a “personal frequency” changes reality; that connection is made by faith, not by the laboratory.' }
  );
})();
