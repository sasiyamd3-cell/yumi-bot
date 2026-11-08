const { cmd } = require('../command');
const axios = require('axios');

const BASE = "https://host-yumi-cartoon-api--bunnyxmddev.replit.app";
const IMG = "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg";

async function fetchCartoon(url) {
    try {
        const { data } = await axios.get(url, { timeout: 20000 });
        return data;
    } catch { return null; }
}

function cartoonUI(articles, header, type = "latest") {
    let arr = Array.isArray(articles) ? articles : (articles?.data || articles?.result || articles?.cartoons || []);
    if (!Array.isArray(arr)) arr = [arr];
    arr = arr.filter(a => a && (a.title || a.name)).slice(0, 8);
    
    if (arr.length === 0) return `╭─〔 🎬 𝐘𝐔𝐌𝐈 𝐂𝐀𝐑𝐓𝐎𝐎𝐍 〕─\n│ ❌ 𝐍𝐨 𝐂𝐚𝐫𝐭𝐨𝐨𝐧𝐬 𝐅𝐨𝐮𝐧𝐝!\n╰──────────────`;

    let txt = `╭━━━〔 🎬 *𝐘𝐔𝐌𝐈 𝐂𝐀𝐑𝐓𝐎𝐎𝐍 𝐀𝐏𝐈* 🎀 〕━━━┈⊷\n`;
    txt += `┃\n`;
    txt += `┃ 🎀 *𝐇𝐄𝐋𝐋𝐎 𝐂𝐔𝐓𝐈𝐄!* 🎀\n`;
    txt += `┃ ✨ _${header}_\n`;
    txt += `┃\n`;
    txt += `┃ ━━━━〔 🎬 𝗖𝗔𝗥𝗧𝗢𝗢𝗡𝗦 〕━━━━\n`;
    txt += `┃\n`;

    arr.forEach((a, i) => {
        let t = (a.title || a.name || "").replace(/\n/g, "").slice(0, 60).trim();
        let id = a.id || a.cartoonId || "?";
        let num = ["𝟏","𝟐","𝟑","𝟒","𝟓","𝟔","𝟕","𝟖"][i];
        let icons = ["💖","💝","💗","💓","💞","💟","❤️‍🔥","💘"];
        
        txt += `┃ ${num}. ${icons[i]} *${t}*\n`;
        txt += `┃    ├ 🆔 ID: ${id}\n`;
        if (a.year) txt += `┃    ├ 📅 ${a.year}\n`;
        txt += `┃    ╰ 🔗 .yumicartoon ${id}\n`;
        txt += `┃\n`;
    });

    txt += `┃ ━━━━〔 💡 𝐇𝐎𝐖 𝐓𝐎 〕━━━━\n`;
    txt += `┃\n`;
    txt += `┃ 📥 .yumicartoon <ID> - Info + Download\n`;
    txt += `┃ 🔍 .yumicsearch jungle book\n`;
    txt += `┃\n`;
    txt += `╰━━━━━━━━━━━━━━━━━━━┈⊷\n`;
    txt += `> _ᴄᴜᴛᴇ ᴄᴀʀᴛᴏᴏɴꜱ • ꜰᴀꜱᴛ >.<_ 🎀\n`;
    txt += `> _𝐁𝐮𝐧𝐧𝐲 𝐗𝐦𝐝 | 𝐘𝐔𝐌𝐈 𝐌𝐈𝐍𝐈 🎀_`;

    return txt;
}

// ===== 1. LATEST + INFO + DOWNLOAD =====
cmd({
    pattern: "yumicartoon",
    alias: ["ycartoon", "cartoon"],
    desc: "YUMI Cartoon API - Latest & Download",
    category: "yumi-cartoon",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, q, pushname }) => {
    try {
        await conn.sendMessage(from, { react: { text: "🎬", key: mek.key } });

        // If ID provided -> INFO + DOWNLOAD
        if (q && !isNaN(q)) {
            let id = q.trim();
            let info = await fetchCartoon(`${BASE}/api/info?id=${id}`);
            let dl = await fetchCartoon(`${BASE}/api/download?id=${id}`);

            if (!info) return conn.sendMessage(from, { text: `❌ Cartoon ID ${id} not found!` }, { quoted: mek });

            let title = info.title || info.name || `Cartoon ${id}`;
            let desc = (info.description || info.desc || "No description").slice(0, 300);
            let image = info.image || info.thumbnail || IMG;
            let category = info.category || "Cartoon";
            
            let txt = `╭━━━〔 🎬 *𝐘𝐔𝐌𝐈 𝐂𝐀𝐑𝐓𝐎𝐎𝐍* 🎀 〕━━━┈⊷\n`;
            txt += `┃\n`;
            txt += `┃ 🎀 *${title}*\n`;
            txt += `┃\n`;
            txt += `┃ ━━━━〔 📋 𝗜𝗡𝗙𝗢 〕━━━━\n`;
            txt += `┃ 🆔 ID: ${id}\n`;
            txt += `┃ 📂 Category: ${category}\n`;
            if (info.year) txt += `┃ 📅 Year: ${info.year}\n`;
            if (info.rating) txt += `┃ ⭐ Rating: ${info.rating}\n`;
            txt += `┃\n`;
            txt += `┃ ━━━━〔 📝 𝗦𝗧𝗢𝗥𝗬 〕━━━━\n`;
            txt += `┃ ${desc}...\n`;
            txt += `┃\n`;
            txt += `┃ ━━━━〔 ⬇️ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗 〕━━━━\n`;
            
            if (dl && (dl.links || dl.downloadLinks || dl.data)) {
                let links = dl.links || dl.downloadLinks || dl.data || [];
                if (!Array.isArray(links)) links = [links];
                links.slice(0, 3).forEach((l, i) => {
                    let quality = l.quality || l.label || `Link ${i+1}`;
                    let url = l.url || l.link || l;
                    txt += `┃ ${i+1}. ${quality}\n┃    └ ${url}\n`;
                });
                txt += `┃\n┃ ⚡ Direct: ${BASE}/api/download?id=${id}&resolve=1\n`;
            } else {
                txt += `┃ 🔗 ${BASE}/api/download?id=${id}\n`;
            }
            txt += `┃\n╰━━━━━━━━━━━━━━━━━━━┈⊷\n> Bunny Xmd | YUMI MINI V1 🎀`;

            return await conn.sendMessage(from, {
                image: { url: image },
                caption: txt
            }, { quoted: mek });
        }

        // Otherwise -> LATEST
        let page = "1";
        if (q && q.toLowerCase().startsWith("page")) {
            page = q.split(" ")[1] || "1";
        }
        
        let url = `${BASE}/api/latest?page=${page}`;
        let data = await fetchCartoon(url);
        if (!data) return conn.sendMessage(from, { text: `❌ API Offline! ${BASE}` }, { quoted: mek });

        let arts = data.data || data.result || data.cartoons || data;
        let cap = cartoonUI(arts, `${pushname || "Cutie"} ෆ • Latest Cartoons Page ${page} 🔥`, "latest");

        await conn.sendMessage(from, {
            image: { url: IMG },
            caption: cap,
            contextInfo: {
                externalAdReply: {
                    title: `🎬 YUMI CARTOON • Page ${page} • Bunny Xmd`,
                    body: `Hello ${pushname || "Cutie"}! Tap to follow 💖`,
                    thumbnailUrl: IMG,
                    sourceUrl: "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g",
                    mediaType: 1,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});

// ===== 2. SEARCH =====
cmd({
    pattern: "yumicsearch",
    alias: ["ycsearch", "csearch", "cartoonsearch"],
    desc: "Search YUMI Cartoons",
    category: "yumi-cartoon",
    react: "🔍",
    filename: __filename
},
async (conn, mek, m, { from, q, pushname }) => {
    if (!q) return conn.sendMessage(from, { text: `🔍 Usage: .yumicsearch jungle book\nExample: .yumicsearch tom and jerry` }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });
    
    let url = `${BASE}/api/search?q=${encodeURIComponent(q)}`;
    let data = await fetchCartoon(url);
    let arts = data?.data || data?.result || data || [];
    
    let cap = cartoonUI(arts, `${pushname || "Cutie"} • Search: "${q}" 🔍`, "search");
    
    await conn.sendMessage(from, {
        image: { url: IMG },
        caption: cap
    }, { quoted: mek });
});

// ===== 3. CATEGORIES =====
cmd({
    pattern: "yumiccat",
    alias: ["ycat", "ccat", "cartooncat"],
    desc: "YUMI Cartoon Categories",
    category: "yumi-cartoon",
    react: "📂",
    filename: __filename
},
async (conn, mek, m, { from, q, pushname }) => {
    try {
        await conn.sendMessage(from, { react: { text: "📂", key: mek.key } });

        // If ID provided -> CATEGORY Cartoons
        if (q) {
            let parts = q.split(" ");
            let id = parts[0];
            let page = parts[1] || "1";
            let type = "cat";
            
            // Check if user gave type
            if (parts.length >= 2 && isNaN(parts[0])) {
                type = parts[0];
                id = parts[1];
                page = parts[2] || "1";
            }

            let url = `${BASE}/api/category?type=${type}&id=${id}&page=${page}`;
            let data = await fetchCartoon(url);
            let arts = data?.data || data?.result || data || [];
            
            let cap = cartoonUI(arts, `${pushname || "Cutie"} • Category ${id} • Page ${page} 📂`, "cat");
            return await conn.sendMessage(from, {
                image: { url: IMG },
                caption: cap
            }, { quoted: mek });
        }

        // Otherwise -> LIST CATEGORIES
        let data = await fetchCartoon(`${BASE}/api/categories`);
        let cats = data?.data || data?.categories || data || [];
        if (!Array.isArray(cats)) cats = [];

        let txt = `╭━━━〔 📂 *𝐘𝐔𝐌𝐈 𝐂𝐀𝐑𝐓𝐎𝐎𝐍 𝐂𝐀𝐓𝐒* 🎀 〕━━━┈⊷\n`;
        txt += `┃\n`;
        txt += `┃ ✨ _${pushname || "Cutie"} • All Categories_\n`;
        txt += `┃\n`;
        txt += `┃ ━━━━〔 📂 𝗟𝗜𝗦𝗧 〕━━━━\n`;
        txt += `┃\n`;

        if (cats.length === 0) {
            txt += `┃ • Example: .yumiccat 984\n`;
            txt += `┃ • Use ID to browse\n`;
        } else {
            cats.slice(0, 15).forEach((c, i) => {
                let name = c.name || c.title || `Category ${c.id}`;
                let id = c.id || c.categoryId || "?";
                let num = ["𝟏","𝟐","𝟑","𝟒","𝟓","𝟔","𝟕","𝟖","𝟗","𝟏𝟎","𝟏𝟏","𝟏𝟐","𝟏𝟑","𝟏𝟒","𝟏𝟓"][i];
                txt += `┃ ${num}. ${name}\n┃    └ 🆔 .yumiccat ${id}\n┃\n`;
            });
        }

        txt += `┃ ━━━━〔 💡 𝐔𝐒𝐀𝐆𝐄 〕━━━━\n`;
        txt += `┃ • .yumiccat - List\n`;
        txt += `┃ • .yumiccat 984 - Open cat\n`;
        txt += `┃ • .yumiccat 984 2 - Page 2\n`;
        txt += `┃\n╰━━━━━━━━━━━━━━━━━━━┈⊷\n> Bunny Xmd | YUMI MINI V1 🎀`;

        await conn.sendMessage(from, {
            image: { url: IMG },
            caption: txt
        }, { quoted: mek });

    } catch (e) {
        conn.sendMessage(from, { text: `❌ ${e.message}` }, { quoted: mek });
    }
});

// ===== 4. DIRECT DOWNLOAD =====
cmd({
    pattern: "yumicdl",
    alias: ["ycdl", "cdl"],
    desc: "Direct Download Cartoon",
    category: "yumi-cartoon",
    react: "⬇️",
    filename: __filename
},
async (conn, mek, m, { from, q }) => {
    if (!q || isNaN(q)) return conn.sendMessage(from, { text: `⬇️ Usage: .yumicdl 263302\nGet direct download link` }, { quoted: mek });

    let url = `${BASE}/api/download?id=${q.trim()}&resolve=1`;
    let data = await fetchCartoon(url);
    
    let txt = `╭━━━〔 ⬇️ *𝐘𝐔𝐌𝐈 𝐃𝐋* 〕━━━┈⊷\n`;
    txt += `┃\n┃ 🆔 ID: ${q}\n`;
    if (data?.url || data?.downloadUrl) {
        txt += `┃ 🔗 Link: ${data.url || data.downloadUrl}\n`;
    } else {
        txt += `┃ 🔗 ${url}\n`;
        txt += `┃ 📋 ${JSON.stringify(data || {}).slice(0,300)}\n`;
    }
    txt += `┃\n╰━━━━━━━━━━━━━━━━━━\n> Bunny Xmd 🎀`;

    await conn.sendMessage(from, { text: txt }, { quoted: mek });
});