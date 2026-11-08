const { cmd } = require('../command');

cmd({
    pattern: "kick",
    alias: ["remove", "k"],
    react: "👢",
    desc: "Kick member from group",
    category: "group",
    use: ".kick @user or reply",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, sender, isBotAdmin, isAdmin, isOwner }) => {
    try {
      await conn.sendMessage(from, { react: { text: "👢", key: mek.key } });

      const thumb = "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg";
      const channelJid = "120363429003638511@newsletter";
      const channelUrl = "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g";
      const OWNER_NUMBERS = ["94776903338", "94742184347"];

      const getContext = (title, body) => ({
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelJid,
          newsletterName: "Yumi Mini V1 😽",
          serverMessageId: -1
        },
        externalAdReply: {
          title, body, mediaType: 1, thumbnailUrl: thumb,
          sourceUrl: channelUrl, renderLargerThumbnail: true, showAdAttribution: true
        }
      });

      if (!isGroup) {
        return await conn.sendMessage(from, {
          text: `❌ මේක groups වල විතරයි වැඩ බන්`,
          contextInfo: getContext("Group Only ❌", "Kick")
        }, { quoted: mek });
      }

      if (!isBotAdmin) {
        return await conn.sendMessage(from, {
          text: `╭─❍ *BOT NOT ADMIN* ❍─\n│ ❌ මාව admin කරන්න ඕන බන් kick කරන්න\n╰─〔 *Yumi* 〕─`,
          contextInfo: getContext("Bot Not Admin ❌", "Make me admin first")
        }, { quoted: mek });
      }

      if (!isAdmin && !isOwner) {
        return await conn.sendMessage(from, {
          text: `╭─❍ *ADMIN ONLY* ❍─\n│ ❌ Admins ලට විතරයි පුලුවන් බන්\n╰─〔 *Yumi* 〕─`,
          contextInfo: getContext("Admin Only ❌", "Kick")
        }, { quoted: mek });
      }

      const metadata = await conn.groupMetadata(from);
      const botJid = conn.user.id;
      const botNumber = botJid.split(":")[0] + "@s.whatsapp.net";

      const target = m.mentionedJid?.[0] || m.quoted?.sender;
      if (!target) {
        return await conn.sendMessage(from, {
          text: `╭─〔 *👢 YUMI • KICK* 〕─
│
│ ❌ කාවද kick කරන්න ඕන?
│
│ 📌 *Usage* : .kick @user
│ 📌 *Or* : Reply කරලා .kick
│
╰─〔 *Bunny Xmd Dev* 〕─`,
          contextInfo: getContext("Yumi • Kick 👢", "Mention a user")
        }, { quoted: mek });
      }

      if (target === botJid || target === botNumber) {
        return await conn.sendMessage(from, {
          text: `😿 මාව kick කරන්න බෑ බන්`,
          contextInfo: getContext("Can't Kick Me 😿", "I'm Yumi")
        }, { quoted: mek });
      }

      if (OWNER_NUMBERS.includes(target.split("@")[0])) {
        return await conn.sendMessage(from, {
          text: `👑 Owner ව kick කරන්න බෑ බන්!`,
          contextInfo: getContext("Owner Protected 👑", "Can't kick owner")
        }, { quoted: mek });
      }

      const isTargetAdmin = metadata.participants.find(p => p.id === target)?.admin;
      if (isTargetAdmin && !isOwner) {
        return await conn.sendMessage(from, {
          text: `❌ Admin කෙනෙක් ව kick කරන්න බෑ බන්`,
          contextInfo: getContext("Admin Can't Kick ❌", "Target is admin")
        }, { quoted: mek });
      }

      await conn.groupParticipantsUpdate(from, [target], "remove");

      const caption = `╭─〔 *👢 YUMI • KICKED* 〕─
│
│ 👤 *Kicked* : @${target.split("@")[0]}
│ 👮 *By* : @${sender.split("@")[0]}
│ 🏷️ *Group* : ${metadata.subject}
│
│ ✅ *Status* : Removed successfully
│
╰─〔 *Bunny Xmd Dev 👑* 〕─

> _Powered by Yumi Mini V1 😽_`;

      await conn.sendMessage(from, {
        text: caption,
        mentions: [target, sender],
        contextInfo: getContext(`👢 Kicked @${target.split("@")[0]}`, `By @${sender.split("@")[0]} • ${metadata.subject}`)
      }, { quoted: mek });

      await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
      console.log(e);
      await conn.sendMessage(from, {
        text: `❌ Error: ${e.message}`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: { newsletterJid: "120363429003638511@newsletter", newsletterName: "Yumi Mini V1 😽", serverMessageId: -1 }
        }
      }, { quoted: mek });
    }
});