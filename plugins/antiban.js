const { cmd } = require('../command');
const { getBans, isBanned, addBan, removeBan } = require('../data');
const { proto, generateWAMessageFromContent } = require('@whiskeysockets/baileys');

async function sendBanMenu(conn, jid, mek, banList) {
    const count = banList.length;
    const buttons = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🚫 Ban User", id: ".ban" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "✅ Unban User", id: ".unban" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: `📋 Ban List (${count})`, id: ".banlist" }) }
    ];
    const msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                messageContextInfo: { deviceListMetadataVersion: 2 },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `*YUMI BAN SYSTEM 🚫*\n\n*Group Bans:* ${count} users\n\n*.ban @user* - Ban\n*.unban @user* - Unban\n*.banlist* - List`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({ text: "Yumi Mini Bot • Ban System" }),
                    header: proto.Message.InteractiveMessage.Header.create({ title: "Ban Control", hasMediaAttachment: false }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons })
                })
            }
        }
    }, { quoted: mek });
    await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
}

// AUTO CHECK - Every message
cmd({
    pattern: ".*",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isOwner }) => {
    if (!isGroup) return;
    const sender = m.sender || mek.key.participant;
    if (!sender) return;
    if (isOwner || m.isMe) return;

    const banned = await isBanned(from, sender);
    if (banned) {
        console.log(`[BAN] ${sender} blocked in ${from}`);
        m.isBanned = true;
        conn.bannedUsers = conn.bannedUsers || {};
        conn.bannedUsers[`${from}_${sender}`] = true;
        return;
    }
});

cmd({
    pattern: "ban",
    alias: ["gban"],
    react: "🚫",
    desc: "Ban user from bot",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isOwner, args }) => {
    if (!isGroup) return m.reply("❌ Group Only!");
    if (!isAdmins && !isOwner) return m.reply("❌ Admin Only!");

    let userToBan = m.mentionedJid?.[0] || m.msg?.contextInfo?.participant || m.quoted?.sender;
    if (!userToBan && args[0]) userToBan = args[0].replace('@','') + '@s.whatsapp.net';
    if (!userToBan) return m.reply("❌ Tag කරන්න! `.ban @user`");

    if (userToBan === conn.user.id) return m.reply("❌ Bot ව ban කරන්න බෑ!");
    
    await addBan(from, userToBan);
    await conn.sendMessage(from, { text: `*🚫 Banned!* @${userToBan.split('@')[0]} ට දැන් Bot use කරන්න බෑ!`, mentions: [userToBan] }, { quoted: mek });
});

cmd({
    pattern: "unban",
    alias: ["gunban"],
    react: "✅",
    desc: "Unban user from bot",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isOwner, args }) => {
    if (!isGroup) return m.reply("❌ Group Only!");
    if (!isAdmins && !isOwner) return m.reply("❌ Admin Only!");

    let userToUnban = m.mentionedJid?.[0] || m.msg?.contextInfo?.participant || m.quoted?.sender;
    if (!userToUnban && args[0]) userToUnban = args[0].replace('@','') + '@s.whatsapp.net';
    if (!userToUnban) return m.reply("❌ Tag කරන්න! `.unban @user`");

    await removeBan(from, userToUnban);
    await conn.sendMessage(from, { text: `*✅ Unbanned!* @${userToUnban.split('@')[0]} ට දැන් Bot use කරන්න පුළුවන්!`, mentions: [userToUnban] }, { quoted: mek });
});

cmd({
    pattern: "banlist",
    alias: ["bans", "banmenu"],
    react: "📋",
    desc: "Show ban list",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup }) => {
    if (!isGroup) return m.reply("❌ Group Only!");
    const bans = await getBans(from);
    if (bans.length === 0) return m.reply("✅ Ban List හිස්!");

    let text = `*🚫 Ban List - ${bans.length}*\n\n`;
    bans.forEach((jid,i)=> text+= `${i+1}. @${jid.split('@')[0]}\n`);

    // ILB Menu if many
    if (bans.length > 0) {
        try {
            await sendBanMenu(conn, from, mek, bans);
        } catch {}
    }

    await conn.sendMessage(from, { text, mentions: bans }, { quoted: mek });
});