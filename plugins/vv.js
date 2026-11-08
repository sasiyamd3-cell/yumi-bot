const { cmd } = require('../command');
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

cmd({
    pattern: "vv",
    alias: ["viewonce", "vo"],
    react: "🙉",
    desc: "Open view-once media",
    category: "utility",
    use: ".vv [reply to view-once]",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    
    const botName = "YUMI MINI V1 💖";
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

    try {
      let quotedNode = m?.quoted?.message || m?.quoted || mek?.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;

      if (!quotedNode) {
        return await conn.sendMessage(from, {
          text: `╭─❍ *YUMI • VV* ❍─
│
│ 🙉 *ʙᴏᴛ* : ${botName}
│ 👑 *ᴏᴡɴᴇʀ* : ${ownerName}
│
│ 📌 ᴠɪᴇᴡ-ᴏɴᴄᴇ ᴍᴇᴅɪᴀ එකකට ʀᴇᴘʟʏ කරලා
│ 👉 *.vv* ගහන්න 😽
│
╰─〔 *${botName}* 〕─`,
          contextInfo: getContext(`${botName} • VV Opener 🙉`, `By ${ownerName}`)
        }, { quoted: mek });
      }

      let wrapper = quotedNode.viewOnceMessage || quotedNode.viewOnceMessageV2 || quotedNode.message?.viewOnceMessageV2 || null;
      let innerPayload = wrapper ? (wrapper.message || wrapper) : (quotedNode.message || quotedNode);
      const innerNode = innerPayload.imageMessage || innerPayload.videoMessage || innerPayload.audioMessage || null;

      if (!innerNode) {
        return await conn.sendMessage(from, {
          text: `╭─❍ *ERROR* ❍─\n│ ❌ මේක view-once එකක් නෙමෙයි\n╰─〔 ${botName} 〕─`,
          contextInfo: getContext("Not view-once ❌", botName)
        }, { quoted: mek });
      }

      let mediaType = innerPayload.imageMessage ? "image" : innerPayload.videoMessage ? "video" : "audio";
      await conn.sendMessage(from, { react: { text: "🙉", key: mek.key } }).catch(() => {});

      let loader = await conn.sendMessage(from, {
        text: `╭─〔 ⏳ *OPENING* 〕─\n│ ♡ *ᴛʏᴘᴇ* : ${mediaType} 🙉\n│ ♡ *ʙᴏᴛ* : ${botName}\n│ ♡ *sᴛᴀᴛᴜs* : downloading... 💫\n╰─〔 *${ownerName}* 〕─`,
        contextInfo: getContext(`Opening ${mediaType}...`, botName)
      }, { quoted: mek });

      let buffer = null;
      try { if (m?.quoted?.download) buffer = await m.quoted.download(); } catch {}

      if (!buffer) {
        const stream = await downloadContentFromMessage(innerNode, mediaType);
        let tmp = Buffer.from([]);
        for await (const chunk of stream) tmp = Buffer.concat([tmp, chunk]);
        buffer = tmp;
      }

      await conn.sendMessage(from, { delete: loader.key }).catch(() => {});

      const caption = `╭─❍ *YUMI • VV OPENED* ❍─
│
│ 🙉 *ᴛʏᴘᴇ* : ${mediaType}
│ 🤖 *ʙᴏᴛ* : ${botName}
│ 👑 *ᴏᴡɴᴇʀ* : ${ownerName}
│ ✅ *sᴛᴀᴛᴜs* : success 💖
│
╰─〔 *${botName}* 〕─

> _cute • fast • powerful >.<_`;

      if (mediaType === "image") {
        await conn.sendMessage(from, { image: buffer, caption, contextInfo: getContext(`${botName} • Opened 🙉`, `By ${ownerName}`) }, { quoted: mek });
      } else if (mediaType === "video") {
        await conn.sendMessage(from, { video: buffer, caption, contextInfo: getContext(`${botName} • Opened 🙉`, `By ${ownerName}`) }, { quoted: mek });
      } else {
        await conn.sendMessage(from, { audio: buffer, mimetype: innerNode.mimetype || "audio/mp4", ptt: false, contextInfo: getContext(`${botName} • Audio Opened`, ownerName) }, { quoted: mek });
      }

      await conn.sendMessage(from, { react: { text: "✅", key: mek.key } }).catch(() => {});

    } catch (e) {
      console.log("vv error", e);
      await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});