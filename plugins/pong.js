const { cmd } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    react: "⚡",
    desc: "Check bot speed",
    category: "general",
    use: ".ping",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    
    const uptime = () => {
      let sec = process.uptime()
      let d = Math.floor(sec / 86400)
      let h = Math.floor((sec % 86400) / 3600)
      let mm = Math.floor((sec % 3600) / 60)
      let s = Math.floor(sec % 60)
      if(d>0) return `${d}d ${h}h ${mm}m ${s}s`
      return `${h}h ${mm}m ${s}s`
    }

    let start = new Date().getTime()
    await conn.sendMessage(from, { react: { text: "⚡", key: mek.key } })
    let end = new Date().getTime()
    let ping = end - start

    let caption = `
╭─〔 🎀 *YUMI MINI V1* 〕─
│
│  ♡ *User* : ${m.pushName || "cutie"} ෆ
│  ♡ *Bot Name* : Yumi mini v1 💖
│  ♡ *Speed* : ${ping}ms ${ping < 300 ? "💨" : "🐢"}
│  ♡ *Uptime* : ${uptime()}
│  ♡ *Status* : Online & Active ✨
│  ♡ *Owner* : Bunny Xmd Dev
│
╰───────────────

> _${ping}ms • cute & fast >.<_
`.trim()

    await conn.sendMessage(from, {
      text: caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363429003638511@newsletter',
          newsletterName: 'Yumi Mini v1 💝😽',
          serverMessageId: -1
        },
        externalAdReply: {
          title: `YUMI MINI V1 • ${ping}ms ⚡`,
          body: "Bunny Xmd Dev • speed check",
          mediaType: 1,
          thumbnailUrl: "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg",
          sourceUrl: "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g",
          renderLargerThumbnail: true,
          showAdAttribution: true
        }
      }
    }, { quoted: mek })
});