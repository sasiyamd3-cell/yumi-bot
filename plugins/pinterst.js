const { cmd } = require('../command');
const axios = require("axios");

cmd({
    pattern: "pinterest",
    alias: ["pin", "pindl"],
    react: "📌",
    desc: "Download Pinterest media",
    category: "download",
    use: ".pinterest <link>",
    filename: __filename
},
async (conn, mek, m, { from, q }) => {
    try {
      await conn.sendMessage(from, { react: { text: "📌", key: mek.key } });

      const query = (q || "").trim();
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

      if (!query) {
        return await conn.sendMessage(from, {
          text: `╭─〔 *📌 YUMI • PINTEREST* 〕─
│
│ ❌ Pinterest link එකක් දාන්න
│
│ 📌 *Usage* : .pinterest <link>
│
│ 💡 *Ex* : .pinterest https://pin.it/xxx
│
╰─〔 *Bunny Xmd Dev* 〕─`,
          contextInfo: getContext("Yumi • Pinterest 📌", "Download Pin")
        }, { quoted: mek });
      }

      if (!query.includes("pinterest.com") && !query.includes("pin.it")) {
        return await conn.sendMessage(from, {
          text: `❌ Valid Pinterest link එකක් දාන්න බන් 😿\n• pinterest.com or pin.it`,
          contextInfo: getContext("Invalid Link ❌", "Pinterest")
        }, { quoted: mek });
      }

      let loadMsg = await conn.sendMessage(from, {
        text: `╭─〔 *📌 DOWNLOADING...* 〕─
│ 🔎 *Link* : Pin detected
│ ⏳ *Status* : Fetching media...
╰───────────────`,
        contextInfo: getContext("Downloading Pinterest... 📌", "Please wait")
      }, { quoted: mek });

      let response;
      let apiUsed = "GiftedTech";

      try {
        const api = `https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(query)}`;
        response = await axios.get(api, { timeout: 30000 });
        if (!response.data.success) throw new Error("GiftedTech failed");
      } catch {
        try {
          apiUsed = "PrinceTech";
          const api = `https://api.princetechn.com/api/download/pinterestdl?apikey=prince&url=${encodeURIComponent(query)}`;
          response = await axios.get(api, { timeout: 30000 });
          if (!response.data || !response.data.result) throw new Error("PrinceTech failed");
        } catch {
          await conn.sendMessage(from, { delete: loadMsg.key }).catch(()=>{});
          return await conn.sendMessage(from, {
            text: `❌ Pinterest media එක ගන්න බැරි උනා 😿\nLink එක check කරලා ආයේ try කරන්න`,
            contextInfo: getContext("Failed ❌", "Pinterest DL")
          }, { quoted: mek });
        }
      }

      let media, title, description;

      if (apiUsed === "GiftedTech") {
        media = response.data.result.media;
        title = response.data.result.title || "No title";
        description = response.data.result.description || "No description";
      } else {
        media = response.data.result;
        title = response.data.result?.title || "No title";
        description = response.data.result?.description || "No description";
      }

      let mediaUrl;
      if (Array.isArray(media)) {
        mediaUrl = media.find(item => item.type && item.type.includes("720p"))?.download_url ||
                   media.find(item => item.type && item.type.includes("video"))?.download_url ||
                   media[0]?.download_url;
      } else if (media?.download_url) {
        mediaUrl = media.download_url;
      }

      if (!mediaUrl) {
        await conn.sendMessage(from, { delete: loadMsg.key }).catch(()=>{});
        return await conn.sendMessage(from, {
          text: `❌ Downloadable media එක හම්බුනේ නෑ 😿`,
          contextInfo: getContext("No Media ❌", "Pinterest")
        }, { quoted: mek });
      }

      await conn.sendMessage(from, { delete: loadMsg.key }).catch(()=>{});

      let caption = `╭─〔 *📌 YUMI • PINTEREST DL* 〕─
│
│ ✨ *Title* : ${title.slice(0, 60)}
│ 🌐 *Source* : ${apiUsed} API
│ 📝 *Desc* : ${description.substring(0, 80)}${description.length > 80? "..." : ""}
│
╰─〔 *Bunny Xmd Dev 👑* 〕─

> _Powered by Yumi Mini V1 😽_`;

      const isVideo = mediaUrl.includes(".mp4") || mediaUrl.includes("video") ||
                      (Array.isArray(media) && media.some(item => item.type && item.type.includes("video"))) ||
                      (media?.type && media.type.includes("video"));

      if (isVideo) {
        await conn.sendMessage(from, {
          video: { url: mediaUrl },
          caption: caption,
          contextInfo: getContext(`📌 ${title.slice(0, 40)}`, `${apiUsed} • Yumi Mini V1 😽`)
        }, { quoted: mek });
      } else {
        await conn.sendMessage(from, {
          image: { url: mediaUrl },
          caption: caption,
          contextInfo: getContext(`📌 ${title.slice(0, 40)}`, `${apiUsed} • Yumi Mini V1 😽`)
        }, { quoted: mek });
      }

      await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
      console.log(e);
      await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});