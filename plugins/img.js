const { cmd } = require('../command');
const axios = require("axios");

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
    pattern: "img",
    alias: ["image", "pinterest2"],
    react: "🦋",
    desc: "Search and download images from web",
    category: "fun",
    use: ".img <keywords>",
    filename: __filename
},
async (conn, mek, m, { from, q, sender }) => {
    try {
      const query = (q || "").trim();
      if (!query) {
        return conn.sendMessage(from, {
          text: `╭─❍ *${config.botName} • IMG* ❍─\n│ ❌ Keywords දෙන්න!\n│ 👉 .img cute cats\n╰─〔 *${config.ownerName}* 〕─`,
          contextInfo: getContext(`${config.botName} • Image Search 🦋`, "Provide keywords")
        }, { quoted: mek });
      }

      await conn.sendMessage(from, { react: { text: "🦋", key: mek.key } });

      await conn.sendMessage(from, {
        text: `╭─❍ *${config.botName} • SEARCHING* ❍─\n│\n│ 🔍 *Query* : ${query}\n│ ⏳ හොයනවා...\n│\n╰─〔 *${config.ownerName}* 〕─`,
        contextInfo: getContext(`Searching: ${query} 🔍`, config.botName)
      }, { quoted: mek });

      const apiEndpoints = [
        `https://api-toxxic.zone.id/api/search/unsplash?q=${encodeURIComponent(query)}`,
        `https://api-toxxic.zone.id/api/search/wallpaper?q=${encodeURIComponent(query)}`
      ];

      let response = null;
      for (const endpoint of apiEndpoints) {
        try {
          const r = await axios.get(endpoint, { timeout: 10000 });
          if (r && r.data) { response = r; break; }
        } catch (err) { console.warn(`[yumi-img] Failed: ${endpoint}`); }
      }

      if (!response || !response.data) {
        return conn.sendMessage(from, {
          text: `❌ All image services unavailable. Try later.`,
          contextInfo: getContext("Service down ❌", config.botName)
        }, { quoted: mek });
      }

      function extractArray(obj) {
        if (!obj) return [];
        if (Array.isArray(obj)) return obj;
        const candidates = ["result", "data", "imageUrls", "images", "photos", "hits", "results"];
        for (const c of candidates) if (Array.isArray(obj[c]) && obj[c].length) return obj[c];
        for (const k of Object.keys(obj)) if (Array.isArray(obj[k]) && obj[k].length) return obj[k];
        return [];
      }

      function urlFromItem(item) {
        if (!item) return null;
        if (typeof item === "string") return item;
        if (item.urls) return item.urls.full || item.urls.regular || item.urls.small;
        if (item.src) return typeof item.src === "string"? item.src : item.src.original;
        const tryFields = ["url", "image", "original", "src", "link", "download_url"];
        for (const f of tryFields) if (item[f] && typeof item[f] === "string") return item[f];
        return null;
      }

      let items = extractArray(response.data);
      const urls = [];
      for (const it of items) {
        const u = urlFromItem(it);
        if (u && typeof u === "string") urls.push(u);
      }

      const validUrls = [...new Set(urls.map(u => u.trim()).filter(u => /^https?:\/\//i.test(u)))];
      if (!validUrls.length) {
        return conn.sendMessage(from, {
          text: `╭─❍ *NO RESULT* ❍─\n│ ❌ Images හම්බුනේ නෑ\n│ 🔍 ${query}\n╰─〔 *${config.botName}* 〕─`,
          contextInfo: getContext("No images found ❌", query)
        }, { quoted: mek });
      }

      const selected = validUrls.sort(() => 0.5 - Math.random()).slice(0, 5);
      let sentCount = 0;

      for (const imageUrl of selected) {
        try {
          const imageResp = await axios.get(imageUrl, { responseType: "arraybuffer", timeout: 15000 });
          const buffer = Buffer.from(imageResp.data);

          const caption = `╭─❍ *${config.botName} • RESULT* ❍─
│
│ 📷 *Query* : ${query}
│ 👤 *By* : @${sender.split("@")[0]}
│ 🤖 *Bot* : ${config.botName}
│
╰─〔 *${config.ownerName}* 〕─`;

          await conn.sendMessage(from, {
            image: buffer,
            caption: caption,
            mentions: [sender],
            contextInfo: getContext(`${config.botName} • ${query} 🦋`, `Requested by @${sender.split('@')[0]}`)
          }, { quoted: mek });

          sentCount++;
          await new Promise(res => setTimeout(res, 800));
        } catch (imgErr) {
          continue;
        }
      }

      if (sentCount === 0) return conn.sendMessage(from, { text: "❌ Failed to download images." }, { quoted: mek });

    } catch (err) {
      console.error("yumi img error:", err);
      await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
      conn.sendMessage(from, { text: `⚠️ Error: ${err.message || "Failed to fetch images"}` }, { quoted: mek });
    }
});