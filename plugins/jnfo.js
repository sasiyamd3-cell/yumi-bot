const { cmd } = require('../command');
const os = require("os");

function formatRuntime(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

cmd({
    pattern: "botinfo",
    alias: ["info", "bot", "yumi"],
    react: "🤖",
    desc: "Show bot information",
    category: "main",
    use: ".botinfo",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
      await conn.sendMessage(from, { react: { text: "🤖", key: mek.key } });

      let uptime = formatRuntime(process.uptime());
      let ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
      let totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

      let text = `╭─❍ *Yumi mini v1 • INFO* ❍─
│
│ 🤖 *Name* : Yumi mini v1
│ 👑 *Owner* : Bunny Xmd Dev
│ 🔖 *Version* : 1.0.0
│ 📚 *Library* : Baileys
│ 🖥️ *Platform* : ${os.platform()} (${os.arch()})
│
│ ⏰ *Uptime* : ${uptime}
│ 💾 *Ram Usage* : ${ram} MB / ${totalRam} GB
│ 🔌 *Node.js* : ${process.version}
│
│ 📢 *Channel* : Yumi Mini V1 😽
│ 🔗 *Link* : https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g
│
│ ✨ *Yumi is Online!*
│
╰─〔 *Bunny Xmd Dev* 〕─`;

      await conn.sendMessage(from, {
        video: { url: "https://tmpfiles.org/dl/wNAelodrnl7G/video.mp4" },
        caption: text,
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
            title: "Yumi mini v1 • Online 😽",
            body: `${uptime} • ${ram} MB`,
            mediaType: 1,
            thumbnailUrl: "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg",
            sourceUrl: "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g",
            renderLargerThumbnail: true,
            showAdAttribution: true
          }
        }
      }, { quoted: mek });

    } catch (e) {
      await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});