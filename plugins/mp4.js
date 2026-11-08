const { cmd } = require('../command');
const axios = require("axios");

cmd({
    pattern: "song",
    alias: ["play", "music", "spotify"],
    react: "🎧",
    desc: "Download Spotify songs",
    category: "music",
    use: ".song <name or link>",
    filename: __filename
},
async (conn, mek, m, { from, q }) => {
    try {
      await conn.sendMessage(from, { react: { text: "🎧", key: mek.key } });

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
          image: { url: thumb },
          caption: `╭─〔 *🎧 YUMI • MUSIC WORLD 🎧* 〕─
│
│ *˗ˏˋ Hello ${m.pushName || "Cutie"} ˎˊ˗* 💋
│
│ ┌─❍ *Command* : Song DL
│ │ ◦ *Status* : Waiting for query ⏳
│ │ ◦ *Engine* : Spotify API ✨
│ └─❍
│
│ *📌 Usage* :
│ • .song <name>
│ • .song <spotify link>
│
│ *💡 Example* :
│ • .song bado badi
│ • .song die with a smile
│
╰─〔 *Bunny Xmd Dev 👑* 〕─

> _Powered by Yumi Mini V1 😽💖_`,
          contextInfo: getContext("🎧 YUMI MINI V1 • MUSIC WORLD", "Search your favourite track ✨")
        }, { quoted: mek });
      }

      let audioData = null;
      let apiUsed = null;

      const fetchPrinceDL = async (url) => {
        try {
          const api = `https://api.princetechn.com/api/download/spotifydl?apikey=prince&url=${encodeURIComponent(url)}`;
          const { data } = await axios.get(api, { timeout: 20000 });
          if (data?.result?.download_url) return data.result;
        } catch {}
        return null;
      };
      const fetchDavidDL = async (url) => {
        try {
          const api = `https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(url)}&apikey=`;
          const { data } = await axios.get(api, { timeout: 20000 });
          if (data?.success && data?.DownloadLink) {
            return {
              download_url: data.DownloadLink,
              title: data.title,
              duration: data.duration,
              thumbnail: data.thumbnail,
              channel: data.channel
            };
          }
        } catch {}
        return null;
      };

      let loadMsg = await conn.sendMessage(from, {
        text: `╭─〔 *🎧 SEARCHING...* 〕─
│
│ 🔎 *Query* : ${query.slice(0, 40)}
│ ⏳ *Status* : Fetching data...
│
╰───────────────`,
        contextInfo: getContext(`Searching ${query.slice(0, 20)}... 🔎`, "Please wait cutie 💫")
      }, { quoted: mek });

      if (query.includes("spotify.com/track/")) {
        audioData = await fetchPrinceDL(query);
        if (audioData) apiUsed = "PrinceTech API";
        if (!audioData) {
          audioData = await fetchDavidDL(query);
          if (audioData) apiUsed = "David Cyril API";
        }
      }

      if (!audioData) {
        try {
          const searchApi = `https://api.princetechn.com/api/search/spotifysearch?apikey=prince&query=${encodeURIComponent(query)}`;
          const { data } = await axios.get(searchApi, { timeout: 20000 });
          if (data?.results?.length) {
            const first = data.results[0];
            let dl = await fetchPrinceDL(first.url);
            if (dl) {
              audioData = dl;
              audioData.title = first.title || dl.title;
              audioData.channel = first.artist || dl.channel;
              audioData.duration = first.duration || dl.duration;
              audioData.thumbnail = first.thumbnail || dl.thumbnail;
              apiUsed = "PrinceTech API";
            } else {
              dl = await fetchDavidDL(first.url);
              if (dl) {
                audioData = dl;
                audioData.title = first.title || dl.title;
                audioData.channel = first.artist || dl.channel;
                audioData.duration = first.duration || dl.duration;
                audioData.thumbnail = first.thumbnail || dl.thumbnail;
                apiUsed = "David Cyril API";
              }
            }
          }
        } catch {}
      }

      if (!audioData) {
        await conn.sendMessage(from, { delete: loadMsg.key }).catch(()=>{});
        return await conn.sendMessage(from, {
          text: `╭─❍ *NOT FOUND* ❍─
│ ❌ *${query}* හොයාගන්න බැරි උනා
│ 🔁 වෙන නමකින් try කරන්න බන්
╰─〔 *Yumi* 〕─`,
          contextInfo: getContext("Not Found ❌", query)
        }, { quoted: mek });
      }

      const { download_url, title, duration, thumbnail, channel } = audioData;

      await conn.sendMessage(from, { delete: loadMsg.key }).catch(()=>{});

      let thumbBuffer = null;
      if (thumbnail) {
        try {
          const res = await axios.get(thumbnail, { responseType: "arraybuffer", timeout: 10000 });
          thumbBuffer = Buffer.from(res.data);
        } catch {}
      }

      let caption = `╭─〔 *🎀 YUMI • MUSIC PLAYER 🎀* 〕─
│
│ *🎵 TRACK DETAILS* ✨
│
│ ┌─❍
│ │ ◦ *Title* : ${title || "Unknown"} 🎶
│ │ ◦ *Artist* : ${channel || "Unknown"} 👤
│ │ ◦ *Duration* : ${duration || "Unknown"} ⏱️
│ │ ◦ *Source* : ${apiUsed} 🌐
│ │ ◦ *Quality* : 320kbps High 💎
│ └─❍
│
│ *🎧 Enjoy Your Music Cutie!* 💋
│
╰─〔 *Bunny Xmd Dev 👑* 〕─

> _${title} - ${channel}_
> _Powered by Yumi Mini V1 😽💖_`;

      await conn.sendMessage(from, {
        image: { url: thumbnail || thumb },
        caption: caption,
        contextInfo: getContext(`🎧 ${title} • ${channel}`, `⏱️ ${duration} • ${apiUsed} • 320kbps 💎`)
      }, { quoted: mek });

      await conn.sendMessage(from, {
        audio: { url: download_url },
        mimetype: "audio/mpeg",
        fileName: `${(title || "yumi").replace(/[^\w\s]/gi, '')}.mp3`,
        ptt: false,
        jpegThumbnail: thumbBuffer,
        contextInfo: getContext(`${title} • Now Playing 🎧`, `${channel} • Yumi Mini V1`)
      }, { quoted: mek });

      await conn.sendMessage(from, { react: { text: "💖", key: mek.key } });

    } catch (e) {
      console.log(e);
      await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});