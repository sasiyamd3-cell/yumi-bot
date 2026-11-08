const { cmd } = require('../command');

cmd({
    pattern: "kickall",
    alias: ["kickallgc"],
    react: "💣",
    desc: "Kick all members from group",
    category: "group",
    use: ".kickall confirm",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmin, isAdmin, isOwner, q, participants }) => {

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
      return await conn.sendMessage(from, {
        text: `╭─❍ *ERROR* ❍─\n│ ❌ Group එකක විතරයි!\n╰─〔 ${botName} 〕─`,
        contextInfo: getContext("Group only ❌", botName)
      }, { quoted: mek });
    }

    if (!isOwner && !isAdmin) {
      return await conn.sendMessage(from, {
        text: `╭─❍ *ADMIN ONLY* ❍─\n│ ❌ Admin ලට විතරයි!\n╰─〔 ${botName} 〕─`,
        contextInfo: getContext("Admin only ❌", botName)
      }, { quoted: mek });
    }

    if (!isBotAdmin) {
      return await conn.sendMessage(from, {
        text: `╭─❍ *BOT ADMIN?* ❍─\n│ ❌ මාව admin කරන්න!\n╰─〔 ${botName} 〕─`,
        contextInfo: getContext("Bot not admin ❌", botName)
      }, { quoted: mek });
    }

    if (!q || q.toLowerCase() !== "confirm") {
      return await conn.sendMessage(from, {
        text: `╭─❍ *${botName} • KICK ALL* ❍─
│
│ ⚠️ *DANGER ZONE* ⚠️
│
│ 💣 ඔක්කොම members ලා kick වෙනවා!
│ 👥 Count: ${participants.length} members
│
│ Confirm කරන්න:
│ 👉 *.kickall confirm* කියලා ගහන්න
│
│ ❌ Cancel: වෙන දෙයක් ගහන්න
│
╰─〔 *${ownerName}* 〕─

> _this action cannot be undone!_`,
        contextInfo: getContext(`${botName} • Kick All 💣`, "Confirm to kick all")
      }, { quoted: mek });
    }

    await conn.sendMessage(from, {
      text: `╭─〔 💣 *KICKING ALL...* 〕─\n│ ⏳ ${participants.length} members kicking...\n│ 🤖 ${botName} working...\n╰─〔 ${ownerName} 〕─`,
      contextInfo: getContext("Kicking all...", "Please wait")
    }, { quoted: mek });

    let kicked = 0;
    let failed = 0;

    for (let p of participants) {
      let jid = p.id || p.jid;
      if (jid === conn.user.id || jid.includes(conn.user.id.split(':')[0])) continue;
      if (jid === mek.key.participant || jid === m.sender) continue;

      try {
        await conn.groupParticipantsUpdate(from, [jid], "remove");
        kicked++;
        await new Promise(r => setTimeout(r, 800));
      } catch {
        failed++;
      }
    }

    await conn.sendMessage(from, {
      text: `╭─❍ *KICK ALL DONE* ❍─
│
│ ✅ *Kicked* : ${kicked}
│ ❌ *Failed* : ${failed}
│ 👑 *By* : ${ownerName}
│ 🤖 *Bot* : ${botName}
│
╰─〔 *${botName}* 〕─`,
      contextInfo: getContext(`Kicked ${kicked} members ✅`, botName)
    }, { quoted: mek });
});