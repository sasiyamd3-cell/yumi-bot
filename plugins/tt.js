const { cmd } = require('../command');
const axios = require("axios");

cmd({
    pattern: "tiktok",
    alias: ["tt", "ttdl", "tiktokdl"],
    react: "🎀",
    desc: "Download TikTok videos - YUMI MINI V1",
    category: "download",
    use: ".tiktok <link>",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    // CONFIG - ඔයාගේ
    const thumb = "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg";
    const channelJid = "120363429003638511@newsletter";
    const channelUrl = "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g";
    const owner = "Bunny Xmd Dev";

    const runtime = () => {
      let sec = process.uptime()
      let d = Math.floor(sec / 86400)
      let h = Math.floor((sec % 86400) / 3600)
      let mm = Math.floor((sec % 3600) / 60)
      let s = Math.floor(sec % 60)
      return d > 0? `${d}d ${h}h ${mm}m ${s}s` : `${h}h ${mm}m ${s}s`
    }

    const getContext = (title, body) => ({
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelJid,
        newsletterName: 'Yumi Mini V1 😽',
        serverMessageId: -1
      },
      externalAdReply: {
        title: title,
        body: body,
        mediaType: 1,
        thumbnailUrl: thumb,
        sourceUrl: channelUrl,
        renderLargerThumbnail: true,
        showAdAttribution: true
      }
    });

    if (!q) {
      return await conn.sendMessage(from, {
        text: `╭─❍ *YUMI MINI V1* ❍─
│
│ ◍ *ʜᴇʏ* : ${m.pushName || "ᴄᴜᴛɪᴇ"} 💋
│ ◍ *ᴄᴏᴍᴍᴀɴᴅ* : ᴛɪᴋᴛᴏᴋ ᴅʟ 🎀
│ ◍ *sᴛᴀᴛᴜs* : ᴡᴀɪᴛɪɴɢ ғᴏʀ ʟɪɴᴋ 🔗
│
│ *ᴜsᴀɢᴇ* : .ᴛɪᴋᴛᴏᴋ <ʟɪɴᴋ>
│ *ᴇx* : .ᴛɪᴋᴛᴏᴋ ʜᴛᴛᴘs://ᴠᴛ.ᴛɪᴋᴛᴏᴋ.ᴄᴏᴍ/xxx
│
╰─〔 ${owner} 〕─

> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʏᴜᴍɪ ᴍɪɴɪ 💖_`,
        contextInfo: getContext("YUMI MINI V1 • TIKTOK 🎀", "send a tiktok link cutie")
      }, { quoted: mek });
    }

    if (!q.includes("tiktok.com")) {
      return await conn.sendMessage(from, {
        text: `*ᴏᴏᴘs* 😿\n\nᴛɪᴋᴛᴏᴋ ʟɪɴᴋ ᴇᴋᴀᴋ ɴᴇᴍᴇɪ ʙɴ >.<`,
        contextInfo: getContext("Invalid Link ❌", owner)
      }, { quoted: mek });
    }

    try {
      await conn.sendMessage(from, { react: { text: "🎀", key: mek.key } });

      let loadMsg = await conn.sendMessage(from, {
        text: `╭─❍ *DOWNLOADING...* ❍─
│ ⏳ *ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ* : ғᴇᴛᴄʜɪɴɢ ᴅᴀᴛᴀ 💫
╰───────────────`,
        contextInfo: getContext("Fetching Video... ⏳", "Yumi is working")
      }, { quoted: mek });

      const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${encodeURIComponent(q)}`;
      const { data } = await axios.get(apiUrl, { timeout: 15000 });

      if (!data.status ||!data.data) throw new Error("Video not found");

      const { title, like, comment, share, author, meta } = data.data;
      const videoUrl = meta.media.find(v => v.type === "video")?.org || meta.media[0]?.org;
      if (!videoUrl) throw new Error("Video url missing");

      const caption = `
╭─〔 🎀 *YUMI • TIKTOK* 〕─
│
│ ♡ *User* : ${m.pushName || "cutie"} ෆ
│ ♡ *Author* : ${author.nickname} ✨
│ ♡ *Like* : ${like.toLocaleString()} 💖
│ ♡ *Comment* : ${comment.toLocaleString()} 💬
│ ♡ *Share* : ${share.toLocaleString()} 🔁
│ ♡ *Uptime* : ${runtime()}
│
╰─〔 *${owner}* 〕─

*ᴛɪᴛʟᴇ* : ${title? title.slice(0, 120) : "No Title"} ${title && title.length > 120? "..." : ""}

> _ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ʙʏ ʏᴜᴍɪ ᴍɪɴɪ ᴠ1 😽_
`.trim();

      await conn.sendMessage(from, {
        video: { url: videoUrl },
        caption: caption,
        contextInfo: getContext(`@${author.username} • ${like} likes 💖`, `${owner} • Yumi Mini V1 😽👊`)
      }, { quoted: mek });

      await conn.sendMessage(from, { react: { text: "💖", key: mek.key } });
      await conn.sendMessage(from, { delete: loadMsg.key }).catch(()=>{});

    } catch (e) {
      console.error(e);
      await conn.sendMessage(from, {
        text: `╭─❍ *ERROR* ❍─
│ ❌ ${e.message}
│ 📞 Contact: wa.me/94742184347
╰───────────────`,
        contextInfo: getContext("Error ❌", owner)
      }, { quoted: mek });
      await conn.sendMessage(from, { react: { text: "😿", key: mek.key } });
    }
});