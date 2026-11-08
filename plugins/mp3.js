const { cmd } = require('../command');
const axios = require("axios");

cmd({
    pattern: "song",
    alias: ["play", "music"],
    react: "🎧",
    desc: "Download Spotify/YouTube songs",
    category: "music",
    use: ".song <name or spotify link>",
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
          text: `╭─❍ *YUMI • MUSIC* ❍─
│
│ 🎧 *Hey* : ${m.pushName || "cutie"}
│ ❌ Song එකක නමක් දාන්න
│
│ 📌 *Ex* : .song bado badi
│ 📌 *Ex* : .song https://open.spotify.com/track/xxx
│
╰─〔 *Bunny Xmd Dev* 〕─`,
          contextInfo: getContext("Yumi Mini V1 • Music 🎧", "Search & Download")
        }, { quoted: mek });
      }

      let audioData = null;
      let apiUsed = null;

      if (query.includes("spotify.com/track/")) {
        await conn.sendMessage(from, {
          text: `╭─❍ *DOWNLOADING...* ❍─\n│ 🎶 Spotify track එක ගන්නවා...\n╰───────────────`,
          contextInfo: getContext("Downloading Spotify... 🎶", query.slice(0, 50))
        }, { quoted: mek });

        try {
          const api = `https://api.princetechn.com/api/download/spotifydl?apikey=prince&url=${encodeURIComponent(query)}`;
          const { data } = await axios.get(api, { timeout: 20000 });
          if (data?.result?.download_url) {
            audioData = data.result;
            apiUsed = "PrinceTech";
          }
        } catch {}

        if (!audioData) {
          try {
            const api = `https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(query)}&apikey=`;
            const { data } = await axios.get(api, { timeout: 20000 });
            if (data?.success && data?.DownloadLink) {
              audioData = {
                download_url: data.DownloadLink,
                title: data.title,
                duration: data.duration,
                thumbnail: data.thumbnail,
                channel: data.channel
              };
              apiUsed = "David Cyril";
            }
          } catch {}
        }
      }

      if (!audioData) {
        await conn.sendMessage(from, {
          text: `🔎 Searching: *${query}*...`,
          contextInfo: getContext(`Searching ${query} 🔎`, "Yumi Mini V1")
        }, { quoted: mek });

        try {
          const api = `https://api.princetechn.com/api/search/spotifysearch?apikey=prince&query=${encodeURIComponent(query)}`;
          const { data } = await axios.get(api, { timeout: 20000 });
          if (data?.results?.length) {
            const first = data.results[0];
            const dlApi = `https://api.princetechn.com/api/download/spotifydl?apikey=prince&url=${encodeURIComponent(first.url)}`;
            const { data: dlData } = await axios.get(dlApi, { timeout: 20000 });
            if (dlData?.result?.download_url) {
              audioData = dlData.result;
              audioData.title = first.title || audioData.title;
              audioData.channel = first.artist || audioData.channel;
              audioData.duration = first.duration || audioData.duration;
              audioData.thumbnail = first.thumbnail || audioData.thumbnail;
              apiUsed = "PrinceTech";
            }
          }
        } catch {}

        if (!audioData) {
          try {
            const searchApi = `https://api.princetechn.com/api/search/spotifysearch?apikey=prince&query=${encodeURIComponent(query)}`;
            const { data: searchData } = await axios.get(searchApi, { timeout: 15000 });
            if (searchData?.results?.length) {
              const firstResult = searchData.results[0];
              const api = `https://apis.davidcyriltech.my.id/spotifydl?url=${encodeURIComponent(firstResult.url)}&apikey=`;
              const { data } = await axios.get(api, { timeout: 20000 });
              if (data?.success && data?.DownloadLink) {
                audioData = {
                  download_url: data.DownloadLink,
                  title: data.title || firstResult.title,
                  duration: data.duration || firstResult.duration,
                  thumbnail: data.thumbnail || firstResult.thumbnail,
                  channel: data.channel || firstResult.artist
                };
                apiUsed = "David Cyril";
              }
            }
          } catch {}
        }
      }

      if (!audioData) {
        return await conn.sendMessage(from, {
          text: `╭─❍ *NOT FOUND* ❍─\n│ ❌ Song එක හොයාගන්න බැරි උනා\n│ 🔁 වෙන නමකින් try කරන්න\n╰───────────────`,
          contextInfo: getContext("Not Found ❌", query)
        }, { quoted: mek });
      }

      const { download_url, title, duration, thumbnail, channel } = audioData;

      let caption = `╭─❍ *YUMI • MUSIC DOWNLOADER* ❍─
│
│ 🎵 *Title* : ${title || "Unknown"}
│ 👤 *Artist* : ${channel || "Unknown"}
│ ⏱️ *Duration* : ${duration || "Unknown"}
│ 🌐 *Source* : ${apiUsed || "API"}
│
│ ✨ *Downloading as Audio...*
│
╰─〔 *Bunny Xmd Dev* 〕─

> _Powered by Yumi Mini V1 😽_`;

      let thumbBuffer;
      if (thumbnail) {
        try {
          const res = await axios.get(thumbnail, { responseType: "arraybuffer", timeout: 10000 });
          thumbBuffer = Buffer.from(res.data);
        } catch { thumbBuffer = null; }
      }

      await conn.sendMessage(from, {
        audio: { url: download_url },
        mimetype: "audio/mpeg",
        fileName: `${(title || "yumi_song").replace(/[^\w\s]/gi, '')}.mp3`,
        caption: caption,
        jpegThumbnail: thumbBuffer,
        contextInfo: getContext(`${title || "Yumi Song"} • ${channel || ""} 🎧`, `${duration || ""} • ${apiUsed} • Yumi Mini V1`)
      }, { quoted: mek });

      await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
      console.log(e);
      await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});