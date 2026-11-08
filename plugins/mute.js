const { cmd } = require('../command');

cmd({
    pattern: "mute",
    alias: ["unmute", "groupmute"],
    react: "🔇",
    desc: "Mute / Unmute group",
    category: "group",
    use: ".mute / .unmute [5m/1h]",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isBotAdmin, isAdmin, isOwner, q, command }) => {

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

    if (!isAdmin && !isOwner) {
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

    let action = command.toLowerCase();
    let args = q.split(" ");
    
    if (args[0]) {
      if (["on", "mute"].includes(args[0].toLowerCase())) action = "mute";
      if (["off", "unmute"].includes(args[0].toLowerCase())) action = "unmute";
    }

    if (action === "mute") {
      let timeArg = args[1] || args[0];
      let durationText = "";

      await conn.groupSettingUpdate(from, "announcement");
      
      if (timeArg && !["on", "mute"].includes(timeArg.toLowerCase())) {
        durationText = `\n│ ⏰ *Duration* : ${timeArg}`;
        let ms = 0;
        if (timeArg.endsWith("m")) ms = parseInt(timeArg) * 60 * 1000;
        if (timeArg.endsWith("h")) ms = parseInt(timeArg) * 60 * 60 * 1000;
        
        if (ms > 0) {
          setTimeout(async () => {
            await conn.groupSettingUpdate(from, "not_announcement").catch(()=>{});
            await conn.sendMessage(from, {
              text: `╭─〔 🔊 *AUTO UNMUTED* 〕─\n│ ⏰ ${timeArg} mute එක ඉවරයි!\n│ ✅ දැන් chat කරන්න පුළුවන්\n╰─〔 *${botName}* 〕─`,
              contextInfo: getContext("Auto Unmuted 🔊", botName)
            });
          }, ms);
        }
      }

      return await conn.sendMessage(from, {
        text: `╭─❍ *${botName} • MUTED* ❍─
│
│ 🔇 *Group muted!*
│ 👑 *By* : ${ownerName}${durationText}
│ 🤖 *Bot* : ${botName}
│
│ 👥 Admin ලට විතරයි chat කරන්න පුළුවන්
│
╰─〔 *${botName}* 〕─`,
        contextInfo: getContext(`${botName} • Muted 🔇`, "Admins only can chat")
      }, { quoted: mek });

    } else {
      await conn.groupSettingUpdate(from, "not_announcement");
      return await conn.sendMessage(from, {
        text: `╭─❍ *${botName} • UNMUTED* ❍─
│
│ 🔊 *Group unmuted!*
│ 👑 *By* : ${ownerName}
│ 🤖 *Bot* : ${botName}
│
│ 👥 හැමෝටම දැන් chat කරන්න පුළුවන්
│
╰─〔 *${botName}* 〕─`,
        contextInfo: getContext(`${botName} • Unmuted 🔊`, "Everyone can chat now")
      }, { quoted: mek });
    }
});