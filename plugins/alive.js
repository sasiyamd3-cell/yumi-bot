const { cmd } = require('../command');

cmd({
    pattern: "alive",
    alias: ["bot", "yumi"],
    react: "🎀",
    desc: "Check bot alive status",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        const uptime = () => {
          let sec = process.uptime()
          let d = Math.floor(sec / 86400)
          let h = Math.floor((sec % 86400) / 3600)
          let mm = Math.floor((sec % 3600) / 60)
          let s = Math.floor(sec % 60)
          if(d>0) return `${d}d ${h}h ${mm}m ${s}s`
          return `${h}h ${mm}m ${s}s`
        }

        let caption = `
╭─〔 🎀 *YUMI MINI V1* 〕─
│
│  ♡ *User* : ${pushname || m.pushName || "cutie"} ෆ
│  ♡ *Bot Name* : Yumi mini v1 💖
│  ♡ *Owner* : Bunny Xmd Dev
│  ♡ *Uptime* : ${uptime()}
│  ♡ *Status* : Online & Active ✨
│  ♡ *Owner No* : wa.me/94742184347
│
╰───────────────
> _cute • fast • powerful >.<_
`.trim()

        await conn.sendMessage(from, {
          text: caption,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363429003638511@newsletter',
              newsletterName: 'Yumi Mini V1 😽💝',
              serverMessageId: 1
            },
            externalAdReply: {
              title: "Yumi mini v1 🎀 | Bunny Xmd Dev",
              body: "Bunny Xmd Dev • Tap to follow channel",
              mediaType: 1,
              thumbnailUrl: "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg",
              sourceUrl: "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g",
              renderLargerThumbnail: true,
              showAdAttribution: true
            }
          }
        }, { quoted: mek });

    } catch (e) {
        console.log("alive error:", e.message)
        await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});
