/* The book of days. Loaded after rite.js.
   Fourteen leaves, one for each day of the challenge. A leaf opens in three parts, one for
   each whisper of the day: the old text, what it says, and what it asks.
   Every quotation here was checked against its source during the research for this project
   and carries its reference. The lines around the quotations are this project's own. */
(function () {
  var S = window.NESHIMA_STRINGS;

  Object.assign(S.he, {
    leafOf: function (m) { return 'הדף של יום ' + m; },
    leafVeil: ['נפתח בלחישה הראשונה של היום.', 'נפתח בלחישה השנייה.', 'נפתח בלחישה השלישית.'],
    leafToday: 'הדף של היום', leafNav: 'דפים שנפתחו', leafWrite: 'לכתוב', leafCatch: 'הדף',
    leaves: [
      { t: 'נשמת חיים', q: 'וַיִּפַּח בְּאַפָּיו נִשְׁמַת חַיִּים וַיְהִי הָאָדָם לְנֶפֶשׁ חַיָּה', src: 'בראשית ב, ז',
        a: 'החיים נכנסו באדם בנשיפה אחת.', b: 'כל נשימה שלך ממשיכה אותה.' },
      { t: 'מי שנופח', q: 'כִּי הַנּוֹפֵחַ בְּאַפֵּי אַחֵר מִנִּשְׁמָתוֹ יִתֵּן בּוֹ', src: 'רמב״ן על בראשית ב, ז',
        a: 'מי שנופח — נותן מעצמו.', b: 'מה שנושם בך אינו רק שלך.' },
      { t: 'נשמה, נשימה', q: 'עַל כָּל נְשִׁימָה וּנְשִׁימָה שֶׁאָדָם נוֹשֵׁם צָרִיךְ לְקַלֵּס לַבּוֹרֵא', src: 'בראשית רבה יד, ט',
        a: 'נשמה ונשימה. אותן אותיות, אותו דבר.', b: 'היום, נשימה אחת מכל לחישה — בתודה.' },
      { t: 'חמישה שמות', q: 'חֲמִשָּׁה שֵׁמוֹת נִקְרְאוּ לָהּ: נֶפֶשׁ, רוּחַ, נְשָׁמָה, יְחִידָה, חַיָּה', src: 'בראשית רבה יד, ט',
        a: 'חמישה שמות לנפש.', b: 'שלושה פגשת בשערים. שניים מחכים למעלה.' },
      { t: 'קול ורוח ודיבור', q: 'אחת רוח אלהים חיים … קול ורוח ודבור', src: 'ספר יצירה א, ט',
        a: 'בראש הספירות — רוח.', b: 'לפני הדיבור יש קול. ולפני הקול — נשימה.' },
      { t: 'כנפי הריאה', q: 'ואי לאו כנפי ריאה דנשבין על לבא, הוה אוקיד כל גופא', src: 'תיקוני זוהר, תיקון יג',
        tr: 'אלמלא כנפי הריאה הנושבות על הלב, היה הלב שורף את הגוף כולו.',
        a: 'הריאה מצננת את הלב. כך כתוב בזוהר.', b: 'והמעבדה מצאה אותו דבר בשפה אחרת: בנשיפה ארוכה הלב מאט, דרך העצב התועה.' },
      { t: 'אריכת הנשימה', q: 'וְהָאֲנָחָה הוּא אֲרִיכַת הַנְּשִׁימָה', src: 'ליקוטי מוהר״ן, תורה ח',
        a: 'אנחה איננה צער. היא נשימה שהתארכה.', b: 'היום — להאריך, בלי להתאמץ.' },
      { t: 'בביאתו וביציאתו', q: 'וַאֲנָחָה הוּא שֶׁמַּאֲרִיךְ הֶבֶל בְּבִיאָתוֹ וּבִיצִיאָתוֹ', src: 'חיי מוהר״ן, לז',
        a: 'להאריך בכניסה. ולהאריך ביציאה.', b: 'כך כתב רבי נחמן בנעוריו, אות באות.' },
      { t: 'בריה חדשה', q: 'וְתֵדַע שֶׁבַּאֲנָחָה שֶׁנֶּאֱנָח עוֹשֶׂה אֶת עַצְמוֹ בִּרְיָה חֲדָשָׁה', src: 'חיי מוהר״ן, לז',
        a: 'נשימה ארוכה אחת — ובריה חדשה.', b: 'זה התיקון.' },
      { t: 'תיקון השכל', q: 'כִּי עִקַּר תִּקּוּן הַשֵּׂכֶל הוּא עַל־יְדֵי הַנְּשִׁימָה', src: 'ליקוטי מוהר״ן, תורה ס',
        a: 'עיקר תיקון השכל — בנשימה.', b: 'את המחשבה אין מתקנים במחשבה.' },
      { t: 'ריאה וביטחון', q: 'דַּע, כְּשֶׁהָרֵאָה בִּשְׁלֵמוּת, עַל־יְדֵי־זֶה הַבִּטָּחוֹן בִּשְׁלֵמוּת', src: 'ליקוטי מוהר״ן, תורה רכה',
        a: 'ריאה שלמה — ביטחון שלם.', b: 'כשהנשימה מתרחבת, הפחד מתכווץ.' },
      { t: 'כפי כוח נשימתך', q: 'ותאריך בנשימה ההיא המיוחדת כפי שיעור כח אריכות נשימתך', src: 'רבי אברהם אבולעפיה, אור השכל, חלק ח · המאה השלוש־עשרה',
        a: 'לפני שבע מאות שנה נכתב בספר קבלה: לפי כוח נשימתך. לא לפי של אחר.', b: 'לכן נמדדה נשימתך לפני שהתחלת.' },
      { t: 'שלושה עדים', o: 'המקובלים כתבו: הכול רוטט.',
        a: 'מי שירדה אל עומק התודעה אמרה: התדר שלך הוא עולמך. ומי שפירקו את החומר מצאו בתחתיתו תנודה.', b: 'שלוש שפות. דבר אחד.' },
      { t: 'כל הנשמה', q: 'כֹּל הַנְּשָׁמָה תְּהַלֵּל', src: 'תהלים קנ, ו',
        a: 'בפסוק הזה נחתם ספר תהלים.', b: 'והדף האחרון של הספר הזה ריק. הוא נכתב ביד שלך.' }
    ]
  });

  Object.assign(S.en, {
    leafOf: function (m) { return 'The leaf of day ' + m; },
    leafVeil: ['Opens with the first whisper of the day.', 'Opens with the second whisper.', 'Opens with the third whisper.'],
    leafToday: 'Today’s leaf', leafNav: 'Leaves that have opened', leafWrite: 'Write', leafCatch: 'the leaf',
    leaves: [
      { t: 'The breath of life', q: 'וַיִּפַּח בְּאַפָּיו נִשְׁמַת חַיִּים וַיְהִי הָאָדָם לְנֶפֶשׁ חַיָּה', src: 'Genesis 2:7', tr: '“And He blew into his nostrils the breath of life, and the human became a living soul.”',
        a: 'Life entered the human in one out-breath.', b: 'Every breath of yours carries it on.' },
      { t: 'The one who blows', q: 'כִּי הַנּוֹפֵחַ בְּאַפֵּי אַחֵר מִנִּשְׁמָתוֹ יִתֵּן בּוֹ', src: 'Ramban on Genesis 2:7', tr: '“For one who blows into another’s nostrils gives him of his own breath.”',
        a: 'Whoever blows gives of themselves.', b: 'What breathes in you is not yours alone.' },
      { t: 'Soul, breath', q: 'עַל כָּל נְשִׁימָה וּנְשִׁימָה שֶׁאָדָם נוֹשֵׁם צָרִיךְ לְקַלֵּס לַבּוֹרֵא', src: 'Bereshit Rabbah 14:9', tr: '“For every single breath a person breathes, one should praise the Creator.”',
        a: 'Neshamah and neshimah: soul and breath, the same letters.', b: 'Today, one breath of each whisper — in thanks.' },
      { t: 'Five names', q: 'חֲמִשָּׁה שֵׁמוֹת נִקְרְאוּ לָהּ: נֶפֶשׁ, רוּחַ, נְשָׁמָה, יְחִידָה, חַיָּה', src: 'Bereshit Rabbah 14:9', tr: '“Five names it is called: nefesh, ruach, neshamah, yechidah, chayah.”',
        a: 'Five names for the soul.', b: 'Three you met at the gates. Two wait higher up.' },
      { t: 'Voice, breath and speech', q: 'אחת רוח אלהים חיים … קול ורוח ודבור', src: 'Sefer Yetzirah 1:9', tr: '“One: the breath of the living God … voice, breath and speech.”',
        a: 'At the head of the sefirot — breath.', b: 'Before speech there is voice. Before voice — breath.' },
      { t: 'The wings of the lung', q: 'ואי לאו כנפי ריאה דנשבין על לבא, הוה אוקיד כל גופא', src: 'Tikkunei Zohar, Tikkun 13', tr: '“Were it not for the wings of the lung blowing on the heart, it would burn up the whole body.”',
        a: 'The lung cools the heart. So it is written in the Zohar.', b: 'And the laboratory found the same in another tongue: on a long out-breath the heart slows, by way of the vagus nerve.' },
      { t: 'The lengthening of the breath', q: 'וְהָאֲנָחָה הוּא אֲרִיכַת הַנְּשִׁימָה', src: 'Likutey Moharan, Lesson 8', tr: '“The sigh is the lengthening of the breath.”',
        a: 'A sigh is not sorrow. It is a breath grown long.', b: 'Today — lengthen, without strain.' },
      { t: 'Coming in and going out', q: 'וַאֲנָחָה הוּא שֶׁמַּאֲרִיךְ הֶבֶל בְּבִיאָתוֹ וּבִיצִיאָתוֹ', src: 'Chayei Moharan 37', tr: '“A sigh is when one lengthens the breath in its coming in and its going out.”',
        a: 'Lengthen the coming in. Lengthen the going out.', b: 'So wrote Rabbi Nachman in his youth, letter for letter.' },
      { t: 'A new creature', q: 'וְתֵדַע שֶׁבַּאֲנָחָה שֶׁנֶּאֱנָח עוֹשֶׂה אֶת עַצְמוֹ בִּרְיָה חֲדָשָׁה', src: 'Chayei Moharan 37', tr: '“Know that by the sigh one sighs, one makes oneself a new creature.”',
        a: 'One long breath — and a new creature.', b: 'This is the repair.' },
      { t: 'The repair of the mind', q: 'כִּי עִקַּר תִּקּוּן הַשֵּׂכֶל הוּא עַל־יְדֵי הַנְּשִׁימָה', src: 'Likutey Moharan, Lesson 60', tr: '“For the essential repair of the mind is through the breath.”',
        a: 'The repair of the mind is in the breath.', b: 'Thought is not repaired by thought.' },
      { t: 'Lung and trust', q: 'דַּע, כְּשֶׁהָרֵאָה בִּשְׁלֵמוּת, עַל־יְדֵי־זֶה הַבִּטָּחוֹן בִּשְׁלֵמוּת', src: 'Likutey Moharan, Lesson 225', tr: '“Know: when the lung is whole, trust is whole.”',
        a: 'A whole lung — a whole trust.', b: 'As the breath widens, fear narrows.' },
      { t: 'By the strength of your breath', q: 'ותאריך בנשימה ההיא המיוחדת כפי שיעור כח אריכות נשימתך', src: 'Rabbi Abraham Abulafia, Or HaSekhel, part 8 · thirteenth century', tr: '“And lengthen that one breath by the measure of the strength of your own breath’s length.”',
        a: 'Seven hundred years ago it was written in a book of Kabbalah: by the strength of your breath. Not another’s.', b: 'That is why your breath was measured before you began.' },
      { t: 'Three witnesses', o: 'The Kabbalists wrote: everything vibrates.',
        a: 'One who went down into the depths of the mind said: your frequency is your world. And those who took matter apart found, at the bottom of it, vibration.', b: 'Three tongues. One thing.' },
      { t: 'Every breath', q: 'כֹּל הַנְּשָׁמָה תְּהַלֵּל', src: 'Psalms 150:6', tr: '“Let every breath give praise.”',
        a: 'With this verse the Book of Psalms is sealed.', b: 'And the last leaf of this book is blank. It is written by your hand.' }
    ]
  });

  // the old books behind the leaves, on the sources page
  S.he.src.unshift(
    { tag: 'text', ref: 'רבי אברהם אבולעפיה, אור השכל, חלק ח (המאה השלוש־עשרה)', he: 'ותאריך בנשימה ההיא המיוחדת כפי שיעור כח אריכות נשימתך', body: 'ספר קבלה מן המאה השלוש־עשרה, ובו הדרכת נשימה של ממש: נשימה ארוכה אחת לכל אות, לפי כוחו של הנושם. רבי משה קורדובירו הביא את הדברים בפרדס רימונים. אבולעפיה מונה נשימות; מקצב של שניות אין שם.', url: 'https://www.sefaria.org/Ohr_HaSekhel.8.60?lang=he' },
    { tag: 'text', ref: 'חיי מוהר״ן, לז', he: 'וַאֲנָחָה הוּא שֶׁמַּאֲרִיךְ הֶבֶל בְּבִיאָתוֹ וּבִיצִיאָתוֹ … עוֹשֶׂה אֶת עַצְמוֹ בִּרְיָה חֲדָשָׁה', body: 'מכתב יד נעוריו של רבי נחמן: להאריך את הנשימה בכניסתה וביציאתה, ובכך להיעשות בריה חדשה.', url: 'https://www.sefaria.org/Chayei_Moharan.37?lang=he' },
    { tag: 'text', ref: 'ליקוטי מוהר״ן, תורה ס', he: 'כִּי עִקַּר תִּקּוּן הַשֵּׂכֶל הוּא עַל־יְדֵי הַנְּשִׁימָה', body: 'עיקר תיקון השכל הוא על ידי הנשימה.', url: 'https://www.sefaria.org/Likutei_Moharan.60.3?lang=he' },
    { tag: 'text', ref: 'תיקוני זוהר, תיקון יג', he: 'ואי לאו כנפי ריאה דנשבין על לבא, הוה אוקיד כל גופא', body: 'אלמלא כנפי הריאה הנושבות על הלב, היה הלב שורף את הגוף כולו.', url: 'https://www.sefaria.org/Tikkunei_Zohar.28a.13?lang=he' }
  );
  S.en.src.unshift(
    { tag: 'text', ref: 'Rabbi Abraham Abulafia, Or HaSekhel, part 8 (thirteenth century)', he: 'ותאריך בנשימה ההיא המיוחדת כפי שיעור כח אריכות נשימתך', body: 'A thirteenth-century book of Kabbalah with real instruction in breathing: one long breath to each letter, by the strength of the one who breathes. Rabbi Moses Cordovero quoted it in Pardes Rimonim. Abulafia counts breaths; there is no rhythm in seconds there.', url: 'https://www.sefaria.org/Ohr_HaSekhel.8.60' },
    { tag: 'text', ref: 'Chayei Moharan 37', he: 'וַאֲנָחָה הוּא שֶׁמַּאֲרִיךְ הֶבֶל בְּבִיאָתוֹ וּבִיצִיאָתוֹ … עוֹשֶׂה אֶת עַצְמוֹ בִּרְיָה חֲדָשָׁה', body: 'From Rabbi Nachman’s own youthful manuscript: to lengthen the breath as it comes in and as it goes out, and so to be made a new creature.', url: 'https://www.sefaria.org/Chayei_Moharan.37' },
    { tag: 'text', ref: 'Likutey Moharan, Lesson 60', he: 'כִּי עִקַּר תִּקּוּן הַשֵּׂכֶל הוּא עַל־יְדֵי הַנְּשִׁימָה', body: '“For the essential repair of the mind is through the breath.”', url: 'https://www.sefaria.org/Likutei_Moharan.60.3' },
    { tag: 'text', ref: 'Tikkunei Zohar, Tikkun 13', he: 'ואי לאו כנפי ריאה דנשבין על לבא, הוה אוקיד כל גופא', body: '“Were it not for the wings of the lung blowing on the heart, it would burn up the whole body.”', url: 'https://www.sefaria.org/Tikkunei_Zohar.28a.13' }
  );
})();
