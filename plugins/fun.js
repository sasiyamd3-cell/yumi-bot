const { cmd } = require('../command');
const axios = require('axios');

const config = { PREFIX: ".", BOT_NAME: "YUMI MINI V1" };
const FOOTER = `\n\n> *✨ YUMI MINI V1 • Bunny Xmd Dev ✨*`;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getUser = (m, q) => {
    let mentioned = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (mentioned) return mentioned.split('@')[0];
    if (q && q.includes('@')) return q.replace('@','').trim();
    return m.pushName || "User";
};

// ═════════ 1-10 ═════════

// 1. 8BALL 🎱
cmd({ pattern: "8ball", alias: ["ball"], react: "🎱", desc: "Magic 8Ball", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    if (!q) return reply(`🎱 *8BALL*\n\nUse: ${config.PREFIX}8ball මට කෙල්ලෙක් සෙට් වෙයිද?`);
    const ans = ["ඔව්! 100% 😍","නෑ බන්! හීන දකින්න එපා 😂","Maybe... 🤔","අනිවාර්යයෙන්ම! 🔥","හීනෙන්වත් නෑ 😭","අද නෙවෙයි, හෙට! ✨","Bot ටත් තේරෙන්නේ නෑ 😅","ඔව්, හැබැයි පොඩ්ඩක් ඉවසපන් 💖"];
    return reply(`┏━━🎱 *MAGIC 8BALL*━━┓\n\n❓ *Q:* ${q}\n🎱 *A:* ${pick(ans)}\n\n┗━━━━━━━━━━━━━━┛${FOOTER}`);
});

// 2. ROAST 🔥
cmd({ pattern: "roast", react: "🔥", desc: "Roast User", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    const roasts = ["ඔයාගේ මූණ දැක්කම WiFi එකත් Disconnect වෙනවා 😂","ඔයා ඉපදුන දවසේ Doctor වත් අඬලා තියෙනවා 😭","ඔයාගේ Brain එක Google එකේ Search කරත් හම්බ වෙන්නේ නෑ 🤡","ඔයා Photo එකක් දැම්මම Phone එකත් Hang වෙනවා 📱💥","ඔයාගේ Sense එක 0% - Battery Low වගේ 🪫","ඔයාට කෙල්ලෙක් සෙට් වෙන්නේ GTA එකේ විතරයි 🎮","ඔයාගේ ජීවිතේ Loading... 99% නවතිලා 😂","ඔයා දිහා බලද්දි ඇස් දෙකටත් පව් කියලා හිතෙනවා 👀"];
    return reply(`🔥 *ROAST FOR @${u}*\n\n> ${pick(roasts)}\n\n> _Don't Cry!_ 😂${FOOTER}`);
});

// 3. SHIP 💑
cmd({ pattern: "ship", react: "💑", desc: "Ship Couple", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    let a = m.pushName || "You";
    let per = Math.floor(Math.random() * 101);
    let msg = per > 90 ? "PERFECT COUPLE! 💍❤️" : per > 70 ? "Super Match! 😍" : per > 40 ? "Try කරලා බලපන්! 🤔" : "අයියෝ! මේක නම් Fail! 😂";
    let bar = "❤️".repeat(Math.floor(per/10)) + "🤍".repeat(10 - Math.floor(per/10));
    return reply(`💑 *SHIP RESULT*\n\n👤 ${a} + ❤️ + Crush\n\n${bar}\n📊 *${per}%* - ${msg}\n\n${FOOTER}`);
});

// 4. LOVE 💖
cmd({ pattern: "love", react: "💖", desc: "Love Calculator", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    let per = Math.floor(Math.random() * 101);
    return reply(`💖 *LOVE CALCULATOR*\n\n❤️ You + @${u}\n📊 Love: *${per}%*\n${per > 80 ? "💍 බඳින්නම ඕනි Couple එක!" : per > 50 ? "😍 හොඳයි! Try කරපන්!" : "😂 Friend Zone තමයි!"}\n\n${FOOTER}`);
});

// 5. TRUTH 🎲
cmd({ pattern: "truth", react: "🎲", desc: "Truth Q", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    const t = ["අන්තිමට Crush ට Msg කරේ කවද්ද? 👀","Phone එකේ අන්තිමට Search කරේ මොකක්ද? 😂","කෙල්ලෙක්/කොල්ලෙක්ට කවදාවත් I Love You කියලා තියෙනවද? 💖","Group එකේ කවුද වැඩියෙන්ම Crush? 😍","කවදාවත් Teacher ට බොරු කියලා තියෙනවද? 🤫","Ex ගේ නම කියපන්! 😈","කවදාවත් පන්ති කට් කරලා තියෙනවද? 🏃","Crush ගේ Photo එක Gallery එකේ තියෙනවද? 📸"];
    return reply(`🎲 *TRUTH!*\n\n> ${pick(t)}\n\n> _ඇත්ත කියපන්! බොරු කියන්න එපා!_ 😤${FOOTER}`);
});

// 6. DARE 😈
cmd({ pattern: "dare", react: "😈", desc: "Dare", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    const d = ["Crush ට Hi කියලා Msg එකක් දාපන්! 💖","Group එකේ Voice එකක් දාලා Song එකක් කියපන්! 🎤","Profile Photo එක 1 පැයක් මාරු කරපන්! 📸","Ex ට Miss You කියලා Msg එකක් දාපන්! 😂","10 Push Ups ගහපන්! 💪","ඊළඟ 1 පැය English වලින් විතරක් කතා කරපන්! 🇬🇧","Selfie එකක් Group එකට දාපන්! 🤳","Best Friend ට I Love You කියපන්! 😘"];
    return reply(`😈 *DARE!*\n\n> ${pick(d)}\n\n> _කෙරුවේ නැත්තම් පරාදයි!_ 🔥${FOOTER}`);
});

// 7. TOD
cmd({ pattern: "tod", react: "🎲", desc: "Truth or Dare", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    return reply(`🎲 *TRUTH OR DARE!*\n\n• ${config.PREFIX}truth - Truth Q\n• ${config.PREFIX}dare - Dare!\n\n> එකක් තෝරපන්! 😈${FOOTER}`);
});

// 8. SLOT 🎰
cmd({ pattern: "slot", react: "🎰", desc: "Slot Game", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    let e = ["🍒","🍋","🔔","💎","7️⃣","⭐","🍇"];
    let a = pick(e), b = pick(e), c = pick(e);
    let win = (a===b && b===c) ? "🎉 JACKPOT! ඔයා දිනුවා!" : (a===b || b===c || a===c) ? "😍 පොඩ්ඩක් දිනුවා!" : "😂 පරාදයි! ආයෙ Try කරපන්!";
    return reply(`🎰 *SLOT MACHINE*\n\n| ${a} | ${b} | ${c} |\n\n> ${win}${FOOTER}`);
});

// 9. DICE 🎲
cmd({ pattern: "dice", react: "🎲", desc: "Roll Dice", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    let n = Math.floor(Math.random()*6)+1;
    return reply(`🎲 *DICE ROLL*\n\n> ඔයාට ආවේ: *${n}* ${["","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣"][n]}\n\n${FOOTER}`);
});

// 10. COINFLIP 🪙
cmd({ pattern: "coinflip", alias: ["coin","flip"], react: "🪙", desc: "Coin Flip", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    return reply(`🪙 *COIN FLIP*\n\n> ආවේ: *${pick(["HEADS 👑","TAILS 💖"])}* !\n\n${FOOTER}`);
});

// ═════════ 11-20 ═════════

// 11. JOKE 😂
cmd({ pattern: "joke", react: "😂", desc: "Joke", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    const j = ["Teacher: ඇයි Homework කරේ නැත්තේ? Student: Sir, Wifi නැති වුනා! Teacher: Wifi නැති වුනාම Homework කරන්නේ කොහොමද? 😂","කොල්ලෙක්: මට කෙල්ලෙක් නෑ! යාලුවා: ඇයි? කොල්ලෙක්: කෙල්ලෝ මට බයයි! 😭","Phone එකේ Battery 1% - මම: තව ටිකක් ඉන්න! Phone: නෑ මම යනවා! 🪫😂","අම්මා: බත් කෑවද? මම: ඔව්! අම්මා: බොරු කියන්න එපා! මම දන්නවා! 😅","Exam එකට පාඩම් කරන්නේ නැතුව Pass වෙන්නේ කොහොමද? - ChatGPT ට අහපන්! 🤖"];
    return reply(`😂 *JOKE OF THE DAY*\n\n> ${pick(j)}${FOOTER}`);
});

// 12. FACT 🧠
cmd({ pattern: "fact", react: "🧠", desc: "Random Fact", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    const f = ["🐙 Octopus කෙනෙක්ට හදවත් 3ක් තියෙනවා!","🍯 Honey කවදාවත් නරක් වෙන්නේ නෑ! 3000 අවුරුදු පරණ Honeyත් කන්න පුලුවන්!","🌍 ලෝකේ වැඩියෙන්ම පාවිච්චි වෙන Password එක 123456!","🐶 බල්ලෝ මිනිස්සුන්ගේ සතුට දැනගන්නවා!","🍌 කෙසෙල් ඇට වලින් හදලා නෙවෙයි! ඇත්තටම Berry එකක්!","😴 මිනිස්සු ජීවිතේ 1/3ක් නිදාගෙන ඉන්නවා!"];
    return reply(`🧠 *DID YOU KNOW?*\n\n> ${pick(f)}${FOOTER}`);
});

// 13. QUOTE ✨
cmd({ pattern: "quote", react: "✨", desc: "Motivation", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    const q = ["\"හීන දකින්න, ඒවා හැබෑ කරගන්න!\" ✨","\"අද පරාද වුනත් හෙට දිනන්න පුලුවන්!\" 🔥","\"ඔයා හිතනවට වඩා ඔයා Strong!\" 💪","\"Small Steps = Big Dreams!\" 🚀","\"කවුරුහරි ඔයාව විහිලු කරොත්, එයාලා ඔයාට බයයි!\" 😎"];
    return reply(`✨ *QUOTE*\n\n> ${pick(q)}${FOOTER}`);
});

// 14. PICK 🤔
cmd({ pattern: "pick", react: "🤔", desc: "Pick One", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    if (!q || !q.includes("or")) return reply(`Use: ${config.PREFIX}pick කෙල්ල or කොල්ලා`);
    let parts = q.split("or");
    return reply(`🤔 *BOT PICKED!*\n\n> *${pick(parts).trim()}* තමයි හොඳම! ✅${FOOTER}`);
});

// 15. GAY 🌈
cmd({ pattern: "gay", react: "🌈", desc: "How Gay", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`🌈 *GAY METER*\n\n> @${u} is *${Math.floor(Math.random()*101)}%* Gay! 😂${FOOTER}`);
});

// 16. SIMP 💖
cmd({ pattern: "simp", react: "💖", desc: "Simp Meter", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`💖 *SIMP METER*\n\n> @${u} is *${Math.floor(Math.random()*101)}%* Simp! 🥺${FOOTER}`);
});

// 17. BEAUTIFUL ✨
cmd({ pattern: "beautiful", alias: ["cute"], react: "✨", desc: "Beautiful Meter", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`✨ *BEAUTIFUL METER*\n\n> @${u} is *${Math.floor(Math.random()*101)}%* Beautiful! 😍${FOOTER}`);
});

// 18. STUPID 🤡
cmd({ pattern: "stupid", react: "🤡", desc: "Stupid Meter", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`🤡 *STUPID METER*\n\n> @${u} is *${Math.floor(Math.random()*101)}%* Stupid! 😂${FOOTER}`);
});

// 19. RIP ⚰️
cmd({ pattern: "rip", react: "⚰️", desc: "RIP", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`⚰️ *R.I.P*\n\n> @${u} මැරිලා! 😭\n> 2000 - 2026\n> RIP Legend! 🪦${FOOTER}`);
});

// 20. FAKE HACK 💻
cmd({ pattern: "hack", react: "💻", desc: "Fake Hack", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`💻 *HACKING @${u}...*\n\n[███░░░░░░] 30%\n[██████░░░] 60%\n[█████████] 100%\n\n✅ *HACKED!*\n📱 Password: ${u}123\n📸 Gallery Hacked!\n💬 WhatsApp Hacked!\n\n> _Just Joking! 😂_${FOOTER}`);
});

// ═════════ 21-30 ═════════

// 21. COMPLIMENT 💖
cmd({ pattern: "compliment", alias: ["nice"], react: "💖", desc: "Compliment", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    const c = ["ඔයාගේ හිනාව මාර ලස්සනයි! 😍","ඔයා වගේ කෙනෙක් ලෝකේ තව නෑ! ✨","ඔයාගේ ඇස් දෙක පට්ට ලස්සනයි! 👀💖","ඔයා එක්ක කතා කරද්දි Time එක යනවා දැනෙන්නේ නෑ! 🕐","ඔයා ඇත්තටම Cute! 🥰"];
    return reply(`💖 *COMPLIMENT FOR @${u}*\n\n> ${pick(c)}${FOOTER}`);
});

// 22. INSULT 🤬
cmd({ pattern: "insult", react: "🤬", desc: "Insult", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`🤬 *INSULT FOR @${u}*\n\n> ${pick(["ඔයාගේ Brain එක Offline! 📴","ඔයාට Sense එකක් නෑ! 😂","ඔයාගේ Face එක දැක්කම Mirror එකත් බය වෙනවා! 🪞"])}${FOOTER}`);
});

// 23. FORTUNE 🔮
cmd({ pattern: "fortune", react: "🔮", desc: "Fortune Teller", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    return reply(`🔮 *YOUR FORTUNE*\n\n> ${pick(["අද ඔයාට හොඳ දවසක්! 💖","හෙට ඔයාට Surprise එකක් ලැබෙනවා! 🎁","Crush ඔයාව බලනවා! 👀","අද Salli ලැබෙනවා! 💰","පරෙස්සම් වෙලා ඉන්න! 😅"])}${FOOTER}`);
});

// 24. RATE ⭐
cmd({ pattern: "rate", react: "⭐", desc: "Rate User", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`⭐ *RATE*\n\n> @${u} : *${Math.floor(Math.random()*10)+1}/10* ⭐\n\n${pick(["Pattama! 🔥","Hondai! 😍","Average! 🤔","Aiyo! 😂"])}${FOOTER}`);
});

// 25. HOWGAY / HOWCOOL
cmd({ pattern: "howcool", react: "😎", desc: "How Cool", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`😎 *COOL METER*\n\n> @${u} is *${Math.floor(Math.random()*101)}%* Cool! 🧊${FOOTER}`);
});

// 26. CRUSH 💘
cmd({ pattern: "crush", react: "💘", desc: "Who is Crush", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    return reply(`💘 *YOUR CRUSH*\n\n> ඔයාගේ Crush තමයි... *${pick(["Group Admin! 😍","Bot! 🤖","Ex! 😂","Best Friend! 🥰","Teacher! 😅","Nobody! 😭"])}*${FOOTER}`);
});

// 27. MARRY 💍
cmd({ pattern: "marry", react: "💍", desc: "Marry", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`💍 *MARRIAGE!*\n\n> @${m.pushName} ❤️ @${u}\n\n> *Congratulations!* 🎉💍\n> ඔයාලා දැන් බැඳලා! 😂${FOOTER}`);
});

// 28. DIVORCE 💔
cmd({ pattern: "divorce", react: "💔", desc: "Divorce", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`💔 *DIVORCE!*\n\n> @${m.pushName} 💔 @${u}\n\n> දික්කසාද වුනා! 😭${FOOTER}`);
});

// 29. KISS 😘
cmd({ pattern: "kiss", react: "😘", desc: "Kiss", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`😘 @${m.pushName} kissed @${u} 😘💖\n\n> _Aww! Cute!_ 🥰${FOOTER}`);
});

// 30. HUG 🤗
cmd({ pattern: "hug", react: "🤗", desc: "Hug", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`🤗 @${m.pushName} hugged @${u} 🤗💖\n\n> _Warm Hug!_ 🥰${FOOTER}`);
});

// ═════════ 31-40 ═════════

// 31. SLAP 👋
cmd({ pattern: "slap", react: "👋", desc: "Slap", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`👋 @${m.pushName} slapped @${u}! 👋💥\n\n> _Ow! That Hurt!_ 😂${FOOTER}`);
});

// 32. PAT 🐾
cmd({ pattern: "pat", react: "🐾", desc: "Pat", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`🐾 @${m.pushName} patted @${u} 🐾💖\n\n> _Good Boy/Girl!_ 🥰${FOOTER}`);
});

// 33. KILL 🔪
cmd({ pattern: "kill", react: "🔪", desc: "Kill Fun", category: "fun", filename: __filename },
async (conn, mek, m, { from, q, reply }) => {
    let u = getUser(m, q);
    return reply(`🔪 @${m.pushName} killed @${u}! 🔪😂\n\n> _RIP! Just Joking!_ 😅${FOOTER}`);
});

// 34. WAIFU 💖
cmd({ pattern: "waifu", react: "💖", desc: "Random Waifu", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        let res = await axios.get('https://api.waifu.pics/sfw/waifu');
        await conn.sendMessage(from, { image: { url: res.data.url }, caption: `💖 *YOUR WAIFU!* 😍\n\n> Cute නේද? 🥰${FOOTER}` }, { quoted: mek });
    } catch { return reply(`💖 Waifu එක Load වුනේ නෑ! 😭`); }
});

// 35. ANIME QUOTE
cmd({ pattern: "animequote", alias: ["aq"], react: "🎌", desc: "Anime Quote", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    const a = ["\"Believe it!\" - Naruto 🍥","\"I'll become Hokage!\" - Naruto 🔥","\"Plus Ultra!\" - My Hero Academia 💪","\"I will become Pirate King!\" - Luffy 🏴‍☠️","\"Itachi...\" - Sasuke 😢"];
    return reply(`🎌 *ANIME QUOTE*\n\n> ${pick(a)}${FOOTER}`);
});

// 36. PICKUP LINE 💘
cmd({ pattern: "pickup", alias: ["pline"], react: "💘", desc: "Pickup Line", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    const p = ["Are you WiFi? Because I'm feeling the connection! 📶💖","ඔයා Google ද? ඔයාගේ Photo එක Search කර කර ඉන්නේ! 🔍😍","ඔයාගේ නම Wifi ද? Signal එක Strong! 📶","Are you a Magician? ඔයාව දැක්කම අනිත් අය අතුරුදහන් වෙනවා! ✨","ඔයාගේ හිනාව දැක්කම Battery Full වෙනවා! 🔋💖"];
    return reply(`💘 *PICKUP LINE*\n\n> ${pick(p)}\n\n> _Crush ට දාපන්!_ 😍${FOOTER}`);
});

// 37. RIDDLE 🧩
cmd({ pattern: "riddle", react: "🧩", desc: "Riddle", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    const r = ["මොකක්ද පාද 4ක් තියෙන, ඒත් ඇවිදින්න බැරි? - මේසය! 🪑","මොකක්ද හැමදාම එන, ඒත් කවදාවත් එන්නේ නැති? - හෙට! ⏰","මොකක්ද අතින් අල්ලන්න බැරි, ඒත් බිඳින්න පුලුවන්? - පොරොන්දුව! 💔","මොකක්ද උඩට යද්දි බර අඩු වෙන, බහිද්දි බර වැඩි වෙන? - බාල්දිය! 🪣"];
    return reply(`🧩 *RIDDLE!*\n\n> ${pick(r)}${FOOTER}`);
});

// 38. WOULD YOU RATHER 🤔
cmd({ pattern: "wyr", alias: ["wouldyou"], react: "🤔", desc: "Would You Rather", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    const w = ["Invisible වෙන්නද? නැත්තම් Fly කරන්නද? 🦸","කෝටිපතියෙක් වෙන්නද? නැත්තම් Famous වෙන්නද? 💰","කවදාවත් Phone නැතුව ඉන්නද? නැත්තම් කවදාවත් Food නැතුව ඉන්නද? 📱","Time Travel කරන්නද? නැත්තම් Future බලන්නද? ⏰","Crush එක්ක Date යන්නද? නැත්තම් 1 Lakh සල්ලි ගන්නද? 💖"];
    return reply(`🤔 *WOULD YOU RATHER?*\n\n> ${pick(w)}${FOOTER}`);
});

// 39. MEME 😂
cmd({ pattern: "meme", react: "😂", desc: "Random Meme", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    try {
        let res = await axios.get('https://meme-api.com/gimme');
        await conn.sendMessage(from, { image: { url: res.data.url }, caption: `😂 *MEME!*\n\n> ${res.data.title}\n> _r/${res.data.subreddit}_${FOOTER}` }, { quoted: mek });
    } catch { return reply(`😂 Meme එක Load වුනේ නෑ!`); }
});

// 40. FUN MENU 🎉
cmd({ pattern: "funmenu", alias: ["fun", "funlist"], react: "🎉", desc: "Fun Menu", category: "fun", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    return reply(
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎉  *FUN KING*  😂  ┃
┃  *40 COMMANDS!*  🔥  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

> 👤 *User:* ${m.pushName} 💖

┌─🎲 *GAMES* ─────────┐
│ 🎱 ${config.PREFIX}8ball <q>
│ 🎲 ${config.PREFIX}truth / dare / tod
│ 🎰 ${config.PREFIX}slot
│ 🎲 ${config.PREFIX}dice / coinflip
│ 🧩 ${config.PREFIX}riddle / wyr
└───────────────────┘

┌─💖 *LOVE* ──────────┐
│ 💑 ${config.PREFIX}ship
│ 💖 ${config.PREFIX}love @user
│ 💘 ${config.PREFIX}crush / pickup
│ 💍 ${config.PREFIX}marry @user
│ 💔 ${config.PREFIX}divorce @user
└───────────────────┘

┌─😂 *ROAST & FUN* ───┐
│ 🔥 ${config.PREFIX}roast @user
│ 🤬 ${config.PREFIX}insult @user
│ 💖 ${config.PREFIX}compliment @user
│ 😂 ${config.PREFIX}joke / meme
│ 🧠 ${config.PREFIX}fact / quote
└───────────────────┘

┌─📊 *METERS* ────────┐
│ 🌈 ${config.PREFIX}gay @user
│ 💖 ${config.PREFIX}simp @user
│ ✨ ${config.PREFIX}beautiful @user
│ 🤡 ${config.PREFIX}stupid @user
│ ⭐ ${config.PREFIX}rate @user
│ 😎 ${config.PREFIX}howcool @user
└───────────────────┘

┌─🤗 *ACTIONS* ───────┐
│ 😘 ${config.PREFIX}kiss @user
│ 🤗 ${config.PREFIX}hug @user
│ 👋 ${config.PREFIX}slap @user
│ 🐾 ${config.PREFIX}pat @user
│ 🔪 ${config.PREFIX}kill @user
└───────────────────┘

┌─🎌 *ANIME* ─────────┐
│ 💖 ${config.PREFIX}waifu
│ 🎌 ${config.PREFIX}animequote
│ 💻 ${config.PREFIX}hack @user
│ ⚰️ ${config.PREFIX}rip @user
│ 🤔 ${config.PREFIX}pick A or B
└───────────────────┘

┌─💡 *OTHER* ─────────┐
│ 🔮 ${config.PREFIX}fortune
│ 🎲 ${config.PREFIX}tod
└───────────────────┘${FOOTER}`
    );
});