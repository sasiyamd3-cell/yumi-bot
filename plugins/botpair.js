const { cmd } = require('../command');
const { getPairingCode, listSubBots, deleteSubBot, startAllSubBots } = require('../lib/subBotManager');

cmd({
    pattern: "spair",
    alias: ["subbot", "rent", "addsub"],
    react: "🔗",
    desc: "Pair sub bot",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { q, reply, isOwner }) => {
    if (!isOwner) return reply("❌ Owner only!");

    if (!q) {
        return reply(`*SUB BOT PAIR SYSTEM* 🤖🎀

*Use:*
.pair 9471xxxxxxx - Get pairing code
.pair list - Show active sub bots
.pair del 9471xxxxxxx - Delete sub bot
.pair start - Start all sub bots

*How to pair:*
1. .pair 94712345678
2. Code එකක් එනවා: 123-456
3. යාලුවා: WhatsApp > Linked Devices > Link with phone number > Code දාන්න
4. Done! එයාගේ number එකත් bot වෙනවා!

> YUMI MINI SUB BOT SYSTEM`);
    }

    if (q.startsWith("list")) {
        const bots = listSubBots();
        let txt = `*ACTIVE SUB BOTS: ${bots.length}* 🤖\n\n`;
        if (bots.length === 0) txt += "No sub bots active!";
        else bots.forEach((num, i) => txt += `${i+1}. +${num} ✅ Online\n`);
        return reply(txt);
    }

    if (q.startsWith("del")) {
        let num = q.replace("del", "").trim().replace(/[^0-9]/g, '');
        if (!num) return reply("Number එක දාන්න: .pair del 9471xxxxxxx");
        deleteSubBot(num);
        return reply(`✅ Sub Bot Deleted: +${num}`);
    }

    if (q.startsWith("start")) {
        startAllSubBots();
        return reply("🚀 Starting all sub bots...");
    }

    // Get pairing code
    let num = q.replace(/[^0-9]/g, '');
    if (num.length < 10) return reply("❌ Valid number එකක් දාන්න! Ex: .pair 94712345678");

    try {
        await reply(`⏳ Generating pairing code for +${num}...`);
        const code = await getPairingCode(num);
        
        if (code === "ALREADY_PAIRED") {
            return reply(`✅ +${num} Already paired and online!`);
        }

        let msg = `╭──〔 *SUB BOT PAIR* 〕──╮
┃
┃ 📱 Number: +${num}
┃ 🔑 Code: *${code}*
┃
┃ 📲 How to link:
┃ 1. Open WhatsApp
┃ 2. Linked Devices
┃ 3. Link with phone number
┃ 4. Enter code: ${code}
┃
┃ ⏰ Code expires in 60 sec!
╰─────────────────╯

> YUMI MINI V1 - Sub Bot 🎀`;

        await conn.sendMessage(m.chat, { text: msg }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e.message}\n\nMake sure number is on WhatsApp!`);
    }
});