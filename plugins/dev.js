const { cmd } = require('../command');

cmd({
    pattern: "dev",
    alias: ["developer", "owner"],
    react: "👑",
    desc: "Show developer info",
    category: "main",
    use: ".dev",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
      await conn.sendMessage(from, { react: { text: "👑", key: mek.key } });

      let caption = `╭─❍ *Yumi mini v1 • DEVELOPER* ❍─
│
│ 👑 *Name* : Bunny Xmd Dev
│ 📞 *Number* : +94 74 218 4347
│ 🤖 *Bot* : Yumi mini v1
│ 🔖 *Version* : 1.0.0
│ 🌐 *Country* : Sri Lanka 🇱🇰
│
│ 📢 *Channel* : Yumi Mini V1 😽
│ 🔗 *Link* : https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g
│
│ ✨ *Made with 🩷 by Bunny*
│
╰─〔 *Bunny Xmd Dev* 〕─`;

      await conn.sendMessage(from, {
        video: { url: "https://tmpfiles.org/dl/wbARl6dNWyYo/video.mp4" },
        caption: caption,
        gifPlayback: false,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363429003638511@newsletter",
            newsletterName: "Yumi Mini V1 😽",
            serverMessageId: -1
          },
          externalAdReply: {
            title: "Bunny Xmd Dev • Owner 👑",
            body: "Yumi mini v1 Developer",
            mediaType: 1,
            thumbnailUrl: "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg",
            sourceUrl: "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g",
            renderLargerThumbnail: true,
            showAdAttribution: true
          }
        }
      }, { quoted: mek });

      const vcard = 'BEGIN:VCARD\n' +
        'VERSION:3.0\n' +
        'FN:Bunny Xmd Dev\n' +
        'ORG:Yumi Mini V1;\n' +
        'TEL;type=CELL;type=VOICE;waid=94742184347:+94 74 218 4347\n' +
        'END:VCARD';

      await conn.sendMessage(from, {
        contacts: {
          displayName: 'Bunny Xmd Dev',
          contacts: [{ vcard }]
        }
      }, { quoted: mek });

    } catch (e) {
      await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});