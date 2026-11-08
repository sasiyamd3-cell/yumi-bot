const { cmd } = require('../command');
const axios = require('axios');
const moment = require('moment-timezone');

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    react: "🎀",
    desc: "Download Facebook videos",
    category: "download",
    use: ".fb <link>",
    filename: __filename
},
async (conn, mek, m, { from, q }) => {
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
      return d > 0 ? `${d}d ${h}h ${mm}m ${s}s` : `${h}h ${mm}m ${s}s`
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
│ ◍ *ᴄᴏᴍᴍᴀɴᴅ* : ғʙ ᴅʟ 🎀
│ ◍ *sᴛᴀᴛᴜs* : ᴡᴀɪᴛɪɴɢ ғᴏʀ ʟɪɴᴋ 🔗
│
│ *ᴜsᴀɢᴇ* : .ғʙ <ʟɪɴᴋ>
│ *ᴇx* : .ғʙ ʜᴛᴛᴘs://ғʙ.ᴡᴀᴛᴄʜ/xxxx
│
╰─〔 ${owner} 〕─`,
        contextInfo: getContext("YUMI MINI V1 • FACEBOOK 🎀", "send fb link cutie")
      }, { quoted: mek });
    }

    if (!q.includes('facebook.com') && !q.includes('fb.watch')) {
      return await conn.sendMessage(from, {
        text: `*ᴏᴏᴘs* 😿 ғʙ ʟɪɴᴋ ᴇᴋᴀᴋ ɴᴇᴍᴇɪ ʙɴ >.<`,
        contextInfo: getContext("Invalid Link ❌", owner)
      }, { quoted: mek });
    }

    try {
      await conn.sendMessage(from, { react: { text: "🎀", key: mek.key } });

      let loadMsg = await conn.sendMessage(from, {
        text: `╭─❍ *DOWNLOADING...* ❍─\n│ ⏳ ғᴇᴛᴄʜɪɴɢ ғʙ ᴠɪᴅᴇᴏ... 💫\n│ 🔗 ${q.slice(0, 40)}...\n╰───────────────`,
        contextInfo: getContext("Fetching FB Video... ⏳", "Yumi is working")
      }, { quoted: mek });

      const fbRes = await axios.get(`https://www.movanest.xyz/v2/fbdown?url=${encodeURIComponent(q)}`, { timeout: 20000 });
      
      if (!fbRes.data.status || !fbRes.data.results?.length) throw new Error("Can't get video, private maybe");

      const videoData = fbRes.data.results[0];
      const videoUrl = videoData.hdQualityLink || videoData.normalQualityLink;
      const quality = videoData.hdQualityLink ? 'HD 720p ✨' : 'SD 480p';

      const response = await axios.get(videoUrl, {
        responseType: 'arraybuffer',
        timeout: 60000,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      
      const videoBuffer = Buffer.from(response.data);
      const fileSizeMB = (videoBuffer.length / (1024 * 1024)).toFixed(2);

      const slDate = moment().tz('Asia/Colombo').format('YYYY-MM-DD');
      const slTime = moment().tz('Asia/Colombo').format('HH:mm:ss');

      const caption = `
╭─〔 🎀 *YUMI • FB DL* 〕─
│
│ ♡ *User* : ${m.pushName || "cutie"} ෆ
│ ♡ *Quality* : ${quality}
│ ♡ *Size* : ${fileSizeMB} MB 📦
│ ♡ *Duration* : ${videoData.duration || "Unknown"} ⏱️
│ ♡ *Uptime* : ${runtime()}
│
╰─〔 *${owner}* 〕─

*ᴛɪᴛʟᴇ* : ${videoData.title !== "No video title" ? videoData.title.slice(0, 100) : "Facebook Video"}

📅 ${slDate} | ⌚ ${slTime}

> _ᴅᴏᴡɴʟᴏᴀᴅᴇᴅ ʙʏ ʏᴜᴍɪ ᴍɪɴɪ ᴠ1 😽_
`.trim();

      await conn.sendMessage(from, {
        video: videoBuffer,
        mimetype: 'video/mp4',
        caption: caption,
        fileName: `YUMI_FB_${Date.now()}.mp4`,
        contextInfo: getContext(`FB • ${quality} • ${fileSizeMB}MB 💖`, `${owner} • Yumi Mini V1 😽👊`)
      }, { quoted: mek });

      await conn.sendMessage(from, { react: { text: "💖", key: mek.key } });
      await conn.sendMessage(from, { delete: loadMsg.key }).catch(()=>{});

    } catch (e) {
      console.error(e);
      await conn.sendMessage(from, {
        text: `╭─❍ *ERROR* ❍─\n│ ❌ ${e.message}\n│ 💡 private video ද? public එකක් try කරන්න\n│ 📞 wa.me/94742184347\n╰───────────────`,
        contextInfo: getContext("Error ❌", owner)
      }, { quoted: mek });
      await conn.sendMessage(from, { react: { text: "😿", key: mek.key } });
    }
});