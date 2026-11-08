const { cmd } = require('../command');
const axios = require("axios");

cmd({
    pattern: "insta",
    alias: ["ig", "igdl", "instagram"],
    react: "📸",
    desc: "Download Instagram reels/posts - No API Key",
    category: "download",
    use: ".insta <link>",
    filename: __filename
},
async (conn, mek, m, { from, q }) => {
    try {
      await conn.sendMessage(from, { react: { text: "📸", key: mek.key } });

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
          title, body, mediaType: 1, thumbnailUrl: thumb,
          sourceUrl: channelUrl, renderLargerThumbnail: true, showAdAttribution: true
        }
      });

      if (!query) {
        return await conn.sendMessage(from, {
          text: `╭─〔 *📸 YUMI • INSTA DL* 〕─
│
│ ❌ Insta link එකක් දාන්න
│
│ 📌 *Usage* : .insta <link>
│ 💡 *Ex* : .insta https://www.instagram.com/reel/xxx
│
╰─〔 *Bunny Xmd Dev* 〕─`,
          contextInfo: getContext("Yumi • Insta DL 📸", "No API Key • Free")
        }, { quoted: mek });
      }

      if (!query.includes("instagram.com")) {
        return await conn.sendMessage(from, {
          text: `❌ Valid Instagram link එකක් දාන්න බන් 😿`,
          contextInfo: getContext("Invalid Link ❌", "Instagram")
        }, { quoted: mek });
      }

      let loadMsg = await conn.sendMessage(from, {
        text: `╭─〔 *📸 DOWNLOADING...* 〕─
│ 🔎 *Link* : Instagram detected
│ ⏳ *Status* : Fetching in HD...
╰───────────────`,
        contextInfo: getContext("Downloading Insta... 📸", "No API Key • Free")
      }, { quoted: mek });

      let mediaUrl = null;
      let title = "Instagram Media";
      let apiUsed = "";

      try {
        const api = `https://delirius-apiofc.vercel.app/download/instagram?url=${encodeURIComponent(query)}`;
        const { data } = await axios.get(api, { timeout: 25000 });
        if (data?.data?.length) {
          mediaUrl = data.data[0].url;
          title = data.data[0].title || title;
          apiUsed = "Delirius";
        }
      } catch {}

      if (!mediaUrl) {
        try {
          const api = `https://apis.davidcyriltech.my.id/instagram?url=${encodeURIComponent(query)}`;
          const { data } = await axios.get(api, { timeout: 25000 });
          if (data?.result?.url) {
            mediaUrl = data.result.url;
            apiUsed = "David Cyril";
          } else if (data?.url) {
            mediaUrl = data.url;
            apiUsed = "David Cyril";
          }
        } catch {}
      }

      if (!mediaUrl) {
        try {
          const api = `https://api.princetechn.com/api/download/instagramdl?apikey=prince&url=${encodeURIComponent(query)}`;
          const { data } = await axios.get(api, { timeout: 25000 });
          if (data?.result?.download_url) {
            mediaUrl = data.result.download_url;
            apiUsed = "PrinceTech";
          } else if (data?.result?.[0]?.download_url) {
            mediaUrl = data.result[0].download_url;
            apiUsed = "PrinceTech";
          }
        } catch {}
      }

      if (!mediaUrl) {
        await conn.sendMessage(from, { delete: loadMsg.key }).catch(()=>{});
        return await conn.sendMessage(from, {
          text: `❌ Insta media එක ගන්න බැරි උනා 😿\n\n• Private නම් බෑ\n• Link එක public ද කියලා බලන්න`,
          contextInfo: getContext("Failed ❌", "Insta DL")
        }, { quoted: mek });
      }

      await conn.sendMessage(from, { delete: loadMsg.key }).catch(()=>{});

      let caption = `╭─〔 *📸 YUMI • INSTA DL* 〕─
│
│ ✨ *Title* : ${title.slice(0, 60)}
│ 🌐 *Source* : ${apiUsed} • No Key 🔓
│ 📥 *Quality* : HD Original 💎
│
╰─〔 *Bunny Xmd Dev 👑* 〕─

> _Powered by Yumi Mini V1 😽_`;

      const isVideo = mediaUrl.includes(".mp4") || query.includes("/reel/") || query.includes("/tv/");

      if (isVideo) {
        await conn.sendMessage(from, {
          video: { url: mediaUrl },
          caption: caption,
          contextInfo: getContext(`📸 ${title.slice(0, 40)}`, `${apiUsed} • HD • Yumi`)
        }, { quoted: mek });
      } else {
        await conn.sendMessage(from, {
          image: { url: mediaUrl },
          caption: caption,
          contextInfo: getContext(`📸 ${title.slice(0, 40)}`, `${apiUsed} • HD • Yumi`)
        }, { quoted: mek });
      }

      await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
      console.log(e);
      await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});