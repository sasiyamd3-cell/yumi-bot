const { cmd } = require('../command');

cmd({
    pattern: "bomb",
    alias: ["msgbomb", "spam", "bmb"],
    react: "💣",
    desc: "Bomb messages to user (Limit 100)",
    category: "fun",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, isOwner, isGroup, mentionedJid }) => {

    const MAX_LIMIT = 100; // 🔥 100 කරා!
    const DELAY = 700;

    if (!q) {
        return reply(`*💣 MSG BOMB 100 - YUMI MINI* 🎀

*Use:*
.bomb 20 Hello
.bomb @user 50 Hi
.bomb 100 I love you

*Limit:* 100 max!
> YUMI MINI`);
    }

    let args = q.split(" ");
    let targetJid = from;
    let count = 0;
    let message = "";

    if (mentionedJid && mentionedJid.length > 0) {
        targetJid = mentionedJid[0];
        count = parseInt(args[1]);
        message = args.slice(2).join(" ");
    } else {
        count = parseInt(args[0]);
        message = args.slice(1).join(" ");
    }

    if (isNaN(count) || count <= 0) return reply("❌ Count දාන්න! Ex: .bomb 10 Hello");
    if (count > MAX_LIMIT) return reply(`❌ Limit එක ${MAX_LIMIT} යි බන්! ඔයා ${count} දැම්මා!`);
    if (!message) return reply("❌ Message එකක් දාන්න!");

    if (isGroup && targetJid !== from && !isOwner) {
        return reply("❌ Group එකේ වෙන කෙනෙක්ට bomb කරන්න Owner වෙන්න ඕන!");
    }

    try {
        await reply(`💣 *BOMB STARTED!* 🎯\n📱 +${targetJid.split('@')[0]}\n🔢 ${count}/${MAX_LIMIT}\n💬 ${message}\n\nSending...`);

        for (let i = 1; i <= count; i++) {
            let bombText = `${message} *(${i}/${count})*`;
            if (i % 5 === 0) bombText = `${message} [${i}]`;
            await conn.sendMessage(targetJid, { text: bombText });
            if (i % 20 === 0 && i !== count) {
                await conn.sendMessage(from, { text: `🚀 ${i}/${count} sent!` }).catch(()=>{});
            }
            await new Promise(res => setTimeout(res, DELAY + Math.random() * 300));
        }

        await conn.sendMessage(from, { 
            text: `✅ *BOMB DONE 100!* 💣\n✅ Sent: ${count}\n> YUMI MINI` 
        }, { quoted: mek });

    } catch (e) {
        reply(`❌ Failed: ${e.message}`);
    }
});