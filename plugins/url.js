const { cmd } = require('../command');
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

cmd({
    pattern: "url",
    alias: ["catbox", "tourl"],
    react: "🖇️",
    desc: "Convert media to Catbox URL",
    category: "utility",
    use: ".url [reply to media]",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
      await conn.sendMessage(from, { react: { text: "🖇️", key: mek.key } });

      const thumb = "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg";
      const channelJid = "120363429003638511@newsletter";
      const channelUrl = "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g";

      const getContext = (title, body) => ({
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelJid,
          newsletterName: "Yumi Mini V1 😽",
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

      // 1) target msg
      const quotedMsg = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
      const target = quotedMsg || mek.message;

      if (!target) {
        return await conn.sendMessage(from, {
          text: `╭─❍ *Yumi • URL UPLOADER* ❍─
│
│ ❌ *Media* එකක් නෑ බන්
│ 📸 Image / Video / Audio / Doc
│ එකකට reply කරලා .url ගහන්න
│
╰─〔 *Bunny Xmd Dev* 〕─`,
          contextInfo: getContext("Yumi Mini V1 • URL 😽", "Reply to media")
        }, { quoted: mek });
      }

      // 2) detect type
      let mediaNode = null;
      let mediaType = null;
      if (target.imageMessage) {
        mediaNode = target.imageMessage;
        mediaType = "image";
      } else if (target.videoMessage) {
        mediaNode = target.videoMessage;
        mediaType = "video";
      } else if (target.audioMessage) {
        mediaNode = target.audioMessage;
        mediaType = "audio";
      } else if (target.documentMessage) {
        mediaNode = target.documentMessage;
        mediaType = "document";
      } else if (target.stickerMessage) {
        mediaNode = target.stickerMessage;
        mediaType = "sticker";
      } else {
        return await conn.sendMessage(from, {
          text: `❌ Image, Video, Audio, Document එකකට විතරයි වැඩ 😿`,
          contextInfo: getContext("Error ❌", "Invalid media")
        }, { quoted: mek });
      }

      let waitMsg = await conn.sendMessage(from, {
        text: `╭─❍ *UPLOADING...* ❍─
│ ⏳ *${mediaType.toUpperCase()}* එක Catbox වලට දානවා...
╰───────────────`,
        contextInfo: getContext("Uploading... ⏳", `${mediaType} to Catbox`)
      }, { quoted: mek });

      // 3) download
      let buffer;
      try {
        const stream = await downloadContentFromMessage(mediaNode, mediaType === "sticker"? "sticker" : mediaType);
        let _buf = Buffer.from([]);
        for await (const chunk of stream) {
          _buf = Buffer.concat([_buf, chunk]);
        }
        buffer = _buf;
      } catch (e) {
        return await conn.sendMessage(from, {
          text: `❌ Media download කරන්න බැරි උනා 😿`,
          contextInfo: getContext("Download Failed ❌", "Try again")
        }, { quoted: mek });
      }

      if (!buffer || buffer.length === 0) {
        return await conn.sendMessage(from, {
          text: `❌ File එක empty බන්`,
          contextInfo: getContext("Empty File ❌", "Try another")
        }, { quoted: mek });
      }

      // 4) ext
      let extension = "";
      if (mediaType === "image") extension = ".jpg";
      else if (mediaType === "video") extension = ".mp4";
      else if (mediaType === "audio") extension = ".mp3";
      else if (mediaType === "sticker") extension = ".webp";
      else if (mediaType === "document") {
        const fileName = mediaNode.fileName || "";
        extension = path.extname(fileName) || ".bin";
      }

      const tempFilePath = path.join(os.tmpdir(), `yumi_url_${Date.now()}${extension}`);
      fs.writeFileSync(tempFilePath, buffer);

      // 5) upload catbox
      const form = new FormData();
      form.append("fileToUpload", fs.createReadStream(tempFilePath));
      form.append("reqtype", "fileupload");

      const uploadResponse = await axios.post("https://catbox.moe/user/api.php", form, {
        headers: form.getHeaders(),
        timeout: 60000
      });

      try { fs.unlinkSync(tempFilePath); } catch {}

      if (!uploadResponse.data) throw new Error("Upload failed");
      const uploadedUrl = uploadResponse.data.toString().trim();

      // 6) result
      let resultText = `╭─❍ *Yumi • URL UPLOADED* ❍─
│
│ 🖇️ *Type* : ${mediaType.toUpperCase()}
│ 📦 *Size* : ${formatBytes(buffer.length)}
│ 🔗 *URL* : ${uploadedUrl}
│
│ ✨ *Catbox Upload Success!*
│
╰─〔 *Bunny Xmd Dev* 〕─

> *URL එක copy කරගන්න 👆*
> _Powered by Yumi Mini V1 😽_`;

      await conn.sendMessage(from, {
        text: resultText,
        contextInfo: getContext("URL Uploaded ✅", `${formatBytes(buffer.length)} • ${mediaType}`)
      }, { quoted: mek });

      await conn.sendMessage(from, { delete: waitMsg.key }).catch(()=>{});

    } catch (err) {
      console.log(err);
      await conn.sendMessage(from, { text: `❌ Error: ${err.message}` }, { quoted: mek });
    }
});