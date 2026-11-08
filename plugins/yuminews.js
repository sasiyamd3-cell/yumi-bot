const { cmd } = require('../command');
const axios = require('axios');

const BASE = "https://apia-news-api--yumixmd.replit.app";
const IMG = "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg";

async function fetchNews(url) {
    try {
        const { data } = await axios.get(url, { timeout: 15000 });
        return data;
    } catch { return null; }
}

function premiumUI(articles, title, type = "global") {
    let arr = Array.isArray(articles) ? articles : (articles?.articles || articles?.data || articles?.news || []);
    arr = arr.filter(a => a && (a.title || a.heading)).slice(0, 5);
    
    if (arr.length === 0) {
        return `╭─〔 🎀 𝐘𝐔𝐌𝐈 𝐍𝐄𝐖𝐒 〕─\n│ ❌ 𝐍𝐨 𝐍𝐞𝐰𝐬 𝐅𝐨𝐮𝐧𝐝!\n╰──────────────`;
    }

    let emoji = type === "lk" ? "🇱🇰" : type === "bbc" ? "🌍" : "🎀";
    let catEmoji = type === "lk" ? "🏛️" : type === "bbc" ? "📡" : "🌐";
    
    let txt = `╭━━━〔 ${emoji} *𝐘𝐔𝐌𝐈 𝐍𝐄𝐖𝐒 𝐕𝟏* ${emoji} 〕━━━┈⊷\n`;
    txt += `┃\n`;
    txt += `┃ 🎀 *𝐇𝐄𝐋𝐋𝐎 𝐂𝐔𝐓𝐈𝐄!* 🎀\n`;
    txt += `┃ ✨ _${title}_\n`;
    txt += `┃\n`;
    txt += `┃ ━━━━〔 ${catEmoji} 𝗟𝗔𝗧𝗘𝗦𝗧 𝗨𝗣𝗗𝗔𝗧𝗘𝗦 〕━━━━\n`;
    txt += `┃\n`;

    arr.forEach((a, i) => {
        let t = (a.title || a.heading || "").replace(/\n/g, "").slice(0, 68).trim();
        let src = (a.source || a.publisher || "YUMI API").toUpperCase();
        let time = a.time || a.publishedAt || "Just Now";
        if (time.length > 20) time = time.slice(0, 16);
        
        let icons = ["💖", "💝", "💗", "💓", "💞"];
        let num = ["𝟏", "𝟐", "𝟑", "𝟒", "𝟓"][i];
        
        txt += `┃ ${num}. ${icons[i]} *${t}*..\n`;
        txt += `┃    ├ 📡 *${src}*\n`;
        txt += `┃    ╰ 🕒 _${time}_\n`;
        txt += `┃\n`;
    });

    txt += `┃ ━━━━〔 🔗 𝐌𝐎𝐑𝐄 〕━━━━\n`;
    txt += `┃\n`;
    txt += `┃ 📢 *Channel:* wa.me/channel/0029Vb9Tr8N1XquQLu4Ryh0g\n`;
    txt += `┃ 👥 *Group:* chat.whatsapp.com/DkTFBqJKG8ZDBt3FDllTQ2\n`;
    txt += `┃ 🌐 *API:* apia-news-api\n`;
    txt += `┃\n`;
    txt += `╰━━━━━━━━━━━━━━━━━━━┈⊷\n`;
    txt += `> _ᴄᴜᴛᴇ • ꜰᴀꜱᴛ • ᴘᴏᴡᴇʀꜰᴜʟ >.<_ 💖\n`;
    txt += `> _𝐁𝐮𝐧𝐧𝐲 𝐗𝐦𝐝 𝐃𝐞𝐯 | 𝐘𝐔𝐌𝐈 𝐌𝐈𝐍𝐈 🎀_`;

    return txt;
}

// ===== MAIN =====
cmd({
    pattern: "yuminews",
    alias: ["ynews", "news"],
    desc: "Premium YUMI News UI",
    category: "yumi-news",
    react: "🎀",
    filename: __filename
},
async (conn, mek, m, { from, q, pushname }) => {
    try {
        await conn.sendMessage(from, { react: { text: "💖", key: mek.key } });
        
        let url = `${BASE}/api/news?limit=5`;
        let title = `${pushname || "Cutie"} ෆ • Global Hot News 🌍🔥`;
        
        if (q) {
            let qq = q.toLowerCase().trim();
            if (qq === "si") { url = `${BASE}/api/news?lang=si&limit=5`; title = `Global Sinhala News 🇱🇰`; }
            else if (qq === "ta") { url = `${BASE}/api/news?lang=ta&limit=5`; title = `Global Tamil News 🇮🇳`; }
            else if (qq.startsWith("page")) { 
                let p = qq.split(" ")[1] || "2";
                url = `${BASE}/api/news?limit=5&page=${p}`; 
                title = `Global News Page ${p} 📄`;
            } else {
                url = `${BASE}/api/news?q=${encodeURIComponent(q)}&limit=5`;
                title = `Search: "${q}" 🔍💖`;
            }
        }

        let data = await fetchNews(url);
        let arts = data?.articles || data?.data || data || [];
        let caption = premiumUI(arts, title, "global");
        let img = arts[0]?.image || IMG;

        await conn.sendMessage(from, {
            image: { url: img },
            caption: caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363429003638511@newsletter',
                    newsletterName: '🎀 YUMI MINI V1 • NEWS API 🎀',
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: `🎀 YUMI NEWS • ${q || "Latest"} • Bunny Xmd`,
                    body: `Hello ${pushname || "Cutie"}! Tap to follow channel 💖`,
                    mediaType: 1,
                    thumbnailUrl: IMG,
                    sourceUrl: "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g",
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });
    } catch (e) { 
        conn.sendMessage(from, { text: `❌ ${e.message}` }, { quoted: mek });
    }
});

// ===== LANKA PREMIUM =====
cmd({
    pattern: "yumilk",
    alias: ["lknews", "lanka"],
    desc: "Premium Lanka News",
    category: "yumi-news",
    react: "🇱🇰",
    filename: __filename
},
async (conn, mek, m, { from, q, pushname }) => {
    let url = `${BASE}/api/lk?limit=5`;
    let title = `${pushname || "Cutie"} • Lanka News 🇱🇰✨`;
    
    if (q) {
        let qq = q.toLowerCase().trim();
        if (["si","ta","en"].includes(qq)) {
            url = `${BASE}/api/lk?lang=${qq}&limit=5`;
            title = `Lanka ${qq === "si" ? "සිංහල" : qq === "ta" ? "தமிழ்" : "English"} News 🇱🇰`;
        } else if (["business","sports","politics"].includes(qq)) {
            url = `${BASE}/api/lk?category=${qq}&limit=5`;
            title = `Lanka ${qq.toUpperCase()} 📊`;
        } else {
            url = `${BASE}/api/lk/${qq}?limit=5`;
            title = `${qq.toUpperCase()} News 🏛️`;
        }
    }

    let data = await fetchNews(url);
    let cap = premiumUI(data, title, "lk");
    
    await conn.sendMessage(from, {
        image: { url: IMG },
        caption: cap
    }, { quoted: mek });
});

// ===== BBC PREMIUM =====
cmd({
    pattern: "yumibbc",
    alias: ["bbc", "ybbc"],
    desc: "Premium BBC News",
    category: "yumi-news",
    react: "🌍",
    filename: __filename
},
async (conn, mek, m, { from, q, pushname }) => {
    let cat = q ? q.toLowerCase().trim() : "all";
    let url = `${BASE}/api/bbc/${cat}?limit=5`;
    let title = `${pushname || "Cutie"} • BBC ${cat.toUpperCase()} 🌍`;

    let data = await fetchNews(url);
    if (!data) data = await fetchNews(`${BASE}/api/bbc/all?limit=5`);
    
    let cap = premiumUI(data, title, "bbc");
    
    await conn.sendMessage(from, {
        image: { url: IMG },
        caption: cap
    }, { quoted: mek });
});

// ===== SOURCES PREMIUM =====
cmd({
    pattern: "yumisources",
    alias: ["sources", "newslist"],
    desc: "Show all sources with premium UI",
    category: "yumi-news",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, pushname }) => {
    let txt = `╭━━━〔 🎀 *𝐘𝐔𝐌𝐈 𝐍𝐄𝐖𝐒 𝐕𝟏* 🎀 〕━━━┈⊷\n`;
    txt += `┃\n`;
    txt += `┃ 👋 *Hello ${pushname || "Cutie"}!* ෆ\n`;
    txt += `┃ 📋 *All YUMI News Sources*\n`;
    txt += `┃\n`;
    txt += `┃ ━━━━〔 🌍 GLOBAL 〕━━━━\n`;
    txt += `┃ 🎀 .yuminews - Latest\n`;
    txt += `┃ 🔍 .yuminews cricket\n`;
    txt += `┃ 🌐 .yuminews si / ta\n`;
    txt += `┃ 📄 .yuminews page 2\n`;
    txt += `┃\n`;
    txt += `┃ ━━━━〔 🇱🇰 LANKA - 20+ 〕━━━━\n`;
    txt += `┃ 💖 .yumilk\n`;
    txt += `┃ 💖 .yumilk si / ta\n`;
    txt += `┃ 💖 .yumilk business\n`;
    txt += `┃ 💖 .yumilk adaderana\n`;
    txt += `┃ 💖 .yumilk hirunews-si\n`;
    txt += `┃ 💖 .yumilk dinamina\n`;
    txt += `┃ 💖 .yumilk virakesari\n`;
    txt += `┃  ➕ 15+ more sources!\n`;
    txt += `┃\n`;
    txt += `┃ ━━━━〔 🌍 BBC - 20+ 〕━━━━\n`;
    txt += `┃ 💝 .yumibbc world\n`;
    txt += `┃ 💝 .yumibbc sinhala\n`;
    txt += `┃ 💝 .yumibbc cricket\n`;
    txt += `┃ 💝 .yumibbc technology\n`;
    txt += `┃  ➕ 15+ more categories!\n`;
    txt += `┃\n`;
    txt += `╰━━━━━━━━━━━━━━━━━━┈⊷\n`;
    txt += `> _Total: 50+ API Endpoints_ 🚀\n`;
    txt += `> _Bunny Xmd | YUMI MINI V1_ 🎀`;

    await conn.sendMessage(from, {
        image: { url: IMG },
        caption: txt,
        contextInfo: {
            externalAdReply: {
                title: "🎀 YUMI NEWS SOURCES • 50+ APIs",
                body: "Tap to explore all news 💖",
                thumbnailUrl: IMG,
                sourceUrl: BASE,
                mediaType: 1,
                showAdAttribution: true
            }
        }
    }, { quoted: mek });
});