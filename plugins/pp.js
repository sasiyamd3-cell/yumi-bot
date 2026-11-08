const { cmd } = require('../command');

const config = {
  botName: "Yumi mini v1",
  ownerName: "Bunny Xmd Dev",
  thumb: "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg",
  channelJid: "120363429003638511@newsletter",
  channelName: "Yumi Mini V1 😽",
  channelUrl: "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g"
};

function getContext(title, body) {
  return {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: config.channelJid,
      newsletterName: config.channelName,
      serverMessageId: -1
    },
    externalAdReply: {
      title: title,
      body: body,
      mediaType: 1,
      thumbnailUrl: config.thumb,
      sourceUrl: config.channelUrl,
      renderLargerThumbnail: true,
      showAdAttribution: true
    }
  };
}

cmd({
    pattern: "getdp",
    alias: ["getpp", "dp", "pp", "profilepic"],
    react: "📸",
    desc: "Get user profile picture",
    category: "fun",
    use: ".getdp @user or reply",
    filename: __filename
},
async (conn, mek, m, { from, q, sender }) => {
    try {
      let target = null;
      
      if (m.quoted) {
          target = m.quoted.sender;
      } else if (m.mentionedJid && m.mentionedJid[0]) {
          target = m.mentionedJid[0];
      } else if (q) {
        let num = q.replace(/[^0-9]/g, '');
        if (num) target = num + "@s.whatsapp.net";
      } else {
        target = sender; 
      }

      await conn.sendMessage(from, { react: { text: "📸", key: mek.key } });

      try {
        let ppUrl = await conn.profilePictureUrl(target, 'image');

        let caption = `╭─❍ *${config.botName} • PROFILE PIC* ❍─
│
│ 👤 *User* : @${target.split('@')[0]}
│ 📸 *HD Quality*
│ 🤖 *Bot* : ${config.botName}
│
╰─〔 *${config.ownerName}* 〕─`;

        await conn.sendMessage(from, {
          image: { url: ppUrl },
          caption: caption,
          mentions: [target],
          contextInfo: getContext(`DP of @${target.split('@')[0]} 📸`, config.botName)
        }, { quoted: mek });

      } catch (e) {
        return await conn.sendMessage(from, {
          text: `╭─❍ *${config.botName} • NO DP* ❍─\n│\n│ 😿 @${target.split('@')[0]} ගෙ DP එක නෑ!\n│ 🔒 Private or no profile pic\n│\n╰─〔 *${config.ownerName}* 〕─`,
          mentions: [target],
          contextInfo: getContext("No DP found 😿", config.botName)
        }, { quoted: mek });
      }

    } catch (err) {
      await conn.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: mek });
    }
});