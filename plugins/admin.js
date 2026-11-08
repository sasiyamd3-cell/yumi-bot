const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["demote", "adminadd", "adminremove"],
    react: "👑",
    desc: "Promote / Demote members to admin",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmin, isAdmins, isOwner, args, command }) => {

    const botName = "Yumi mini v1";
    const ownerName = "Bunny Xmd Dev";
    const thmanilUrl = "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg";
    const channelJid = "120363429003638511@newsletter";
    const channelName = "Yumi Mini V1 😽";
    const channelUrl = "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g";

    const getContext = (title, body) => ({
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelJid,
        newsletterName: channelName,
        serverMessageId: -1
      },
      externalAdReply: {
        title: title,
        body: body,
        mediaType: 1,
        thumbnailUrl: thmanilUrl,
        sourceUrl: channelUrl,
        renderLargerThumbnail: true,
        showAdAttribution: true
      }
    });

    if (!isGroup) {
      return await conn.sendMessage(from, { text: `╭─❍ *ERROR* ❍─\n│ ❌ Group එකක විතරයි!\n╰─〔 ${botName} 〕─`, contextInfo: getContext("Group only ❌", botName) }, { quoted: mek });
    }
    if (!isAdmins && !isOwner) {
      return await conn.sendMessage(from, { text: `╭─❍ *ADMIN ONLY* ❍─\n│ ❌ Admin ලට විතරයි!\n╰─〔 ${botName} 〕─`, contextInfo: getContext("Admin only ❌", botName) }, { quoted: mek });
    }
    if (!isBotAdmin) {
      return await conn.sendMessage(from, { text: `╭─❍ *BOT ADMIN?* ❍─\n│ ❌ මාව admin කරන්න!\n╰─〔 ${botName} 〕─`, contextInfo: getContext("Bot not admin ❌", botName) }, { quoted: mek });
    }

    let target = null;
    if (m?.quoted) target = m.quoted.sender || m.quoted.participant || m.quoted.jid;
    else if (args[0]) {
      let num = args[0].replace(/[^0-9]/g, '');
      if (num) target = num + "@s.whatsapp.net";
    }

    if (!target) {
      return await conn.sendMessage(from, {
        text: `╭─❍ *${botName} • PROMOTE* ❍─
│
│ 👑 *Use* :
│.promote @tag / reply
│.demote @tag / reply
│
│ 📌 කෙනෙකුට reply කරලා හරි tag කරලා හරි
│ 👉.promote ගහන්න
│
╰─〔 *${ownerName}* 〕─`,
        contextInfo: getContext(`${botName} • Promote/Demote 👑`, "Reply or tag user")
      }, { quoted: mek });
    }

    let isPromote = ["promote", "adminadd"].includes(command.toLowerCase());

    try {
      if (isPromote) {
        await conn.groupParticipantsUpdate(from, [target], "promote");
        return await conn.sendMessage(from, {
          text: `╭─❍ *PROMOTED* ❍─
│
│ 👑 @${target.split('@')[0]} promoted!
│ ✨ දැන් admin කෙනෙක්
│ 🤖 *Bot* : ${botName}
│ 👑 *By* : ${ownerName}
│
╰─〔 *${botName}* 〕─`,
          mentions: [target],
          contextInfo: getContext(`Promoted @${target.split('@')[0]} 👑`, `${botName} • Admin added`)
        }, { quoted: mek });
      } else {
        await conn.groupParticipantsUpdate(from, [target], "demote");
        return await conn.sendMessage(from, {
          text: `╭─❍ *DEMOTED* ❍─
│
│ 💔 @${target.split('@')[0]} demoted!
│ 📉 admin අයින් කළා
│ 🤖 *Bot* : ${botName}
│ 👑 *By* : ${ownerName}
│
╰─〔 *${botName}* 〕─`,
          mentions: [target],
          contextInfo: getContext(`Demoted @${target.split('@')[0]} 💔`, `${botName} • Admin removed`)
        }, { quoted: mek });
      }
    } catch (e) {
      return await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});