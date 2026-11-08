const { cmd } = require('../command');
const axios = require('axios');

const API = "https://dtz-movie-script.vercel.app/api/movie";
let cineDB = {};

const fetchJson = async (url) => {
  const { data } = await axios.get(url, { timeout: 20000 });
  return data;
};

cmd({
    pattern: "cinesubz",
    alias: ["movie", "cine", "film", "cs"],
    react: "🎀",
    desc: "CineSubz movie search & download with buttons",
    category: "movie",
    filename: __filename
},
async (conn, mek, m, { from, q, prefix }) => {
    const userId = m.sender.split('@')[0];
    const thumb = "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg";
    const channelJid = "120363429003638511@newsletter";
    const owner = "Bunny Xmd Dev";

    const getContext = (title, body) => ({
      forwardingScore: 999,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channelJid,
        newsletterName: 'Yumi Mini V1 😽',
        serverMessageId: -1
      },
      externalAdReply: {
        title, body, mediaType: 1, thumbnailUrl: thumb,
        sourceUrl: "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g",
        renderLargerThumbnail: true, showAdAttribution: true
      }
    });

    const cmdP = `${prefix}cinesubz`;

    if (!q) {
      return await conn.sendMessage(from, {
        text: `╭─🎀 *YUMI • CINE GIRL* 🎀─╮\n│ hii ${m.pushName || "princess"} 💖🍿\n│ 🌸 *Search:* ${cmdP} barbie\n│ 💋 *Info:* ${cmdP} details 1\n│ 💎 *Download:* ${cmdP} dl 1\n╰─💅 *${owner}* ─╯`,
        contextInfo: getContext("YUMI MINI V1 • CINE SUBZ 🎬", "movie bot 💖")
      }, { quoted: mek });
    }

    try {
      if (!q.startsWith("details") && !q.startsWith("dl")) {
        await conn.sendMessage(from, { react: { text: "🎀", key: mek.key } });

        const searchUrl = `${API}/cinesubzsearch?q=${encodeURIComponent(q)}&page=1&limit=10`;
        const res = await fetchJson(searchUrl);

        if (!res.data || res.data.length === 0) {
          return await conn.sendMessage(from, {
            text: `💔 No movies for *${q}* 🥺`,
            contextInfo: getContext("Not Found 💔", owner)
          }, { quoted: mek });
        }

        cineDB[userId] = res.data;

        // Build list rows for ILB
        let rows = res.data.map((mv, i) => ({
          title: `${i+1}. ${mv.title.slice(0, 30)}`,
          description: `${mv.year || '2024'} • ${mv.quality || 'HD'} • Si Sub ✅`,
          id: `${prefix}cinesubz details ${i+1}`
        }));

        let btns = [
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💋 Details 1", id: `${prefix}cinesubz details 1` }) },
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💎 Download 1", id: `${prefix}cinesubz dl 1` }) }
        ];

        let msg = `╭─💖 *CINE SUBZ* 💖─╮\n│ 🔍 *Query:* ${q}\n│ 🌸 *Found:* ${res.data.length}\n╰───────────────╯\n\n`;
        res.data.forEach((mv, i) => {
          msg += `*${i+1}. ${mv.title}*\n ┊ 🎀 ${mv.year || '2024'} • Si Sub ✅\n\n`;
        });

        // ILB Message
        return await conn.sendMessage(from, {
          text: msg,
          footer: `Yumi Mini V1 • ${owner}`,
          buttons: btns,
          contextInfo: getContext(`Found ${res.data.length} Movies 💖`, `${q} • Yumi Mini V1`),
          // For list version
          // You can also use list if your bot supports
        }, { quoted: mek });
      }

      // DETAILS & DL same as before...
      if (q.startsWith("details")) {
        let num = parseInt(q.replace("details", "").trim()) - 1;
        if (isNaN(num)) num = 0;
        const list = cineDB[userId];
        if (!list || !list[num]) return conn.sendMessage(from, { text: `💔 Search first babe! > ${cmdP} barbie` }, { quoted: mek });

        const d = await fetchJson(`${API}/cinesubzdetails?url=${encodeURIComponent(list[num].url)}`);
        const title = d.title || list[num].title;
        const poster = d.image || d.poster || thumb;

        let cap = `╭─💋 *${title}* 💋─╮\n│ 🎀 *Year:* ${d.year || 'N/A'}\n│ ⭐ *IMDb:* ${d.imdb || '8.2'} ✨\n│ 💎 *Quality:* ${d.quality || '1080p'}\n╰─💅─╯\n\n📖 *Story:*\n> ${d.plot? d.plot.slice(0, 380)+'...' : 'Movie night ready! 💖🍿'}\n\n💎 *Download?* > ${cmdP} dl ${num+1}`;

        let btns = [
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "💎 Download Now", id: `${cmdP} dl ${num+1}` }) },
          { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "🔍 Search Again", id: `${cmdP} ` }) }
        ];

        return await conn.sendMessage(from, {
          image: { url: poster },
          caption: cap,
          footer: `Yumi Mini V1`,
          buttons: btns,
          contextInfo: getContext(`${title} 💖`, `IMDb ${d.imdb || '8.2'}`)
        }, { quoted: mek });
      }

      if (q.startsWith("dl")) {
        let num = parseInt(q.replace("dl", "").trim()) - 1;
        if (isNaN(num)) num = 0;
        const list = cineDB[userId];
        if (!list || !list[num]) return conn.sendMessage(from, { text: "💔 Search first princess!" }, { quoted: mek });

        const d = await fetchJson(`${API}/cinesubzdetails?url=${encodeURIComponent(list[num].url)}`);
        let dlMsg = `╭─💖 *${list[num].title}* 💖─╮\n│ 💎 *Si Sub Ready!* ✨\n╰───────────────╯\n\n`;

        if (d.downloadLinks && d.downloadLinks.length > 0) {
          d.downloadLinks.forEach((dl, i) => {
            dlMsg += `*${i+1}. 🎀 ${dl.quality || '1080p'}*\n ┊ 📦 ${dl.size || ''}\n ┊ 🔗 ${dl.link}\n\n`;
          });
        } else {
          dlMsg += `🔗 ${list[num].url}\n`;
        }
        dlMsg += `━━━━━━━━━━━━━━━\n🍿 *Enjoy! Si Sub ✅* 🎀\n_- ${owner} -_`;

        return await conn.sendMessage(from, {
          text: dlMsg,
          contextInfo: getContext(`Download Ready 💎 • Si Sub`, `${owner} • Yumi Mini V1 😽`)
        }, { quoted: mek });
      }

    } catch (e) {
      return await conn.sendMessage(from, { text: `❌ ${e.message}` }, { quoted: mek });
    }
});