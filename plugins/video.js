const { cmd } = require('../command');
const { ytmp4 } = require('sadaslk-dlcore');
const yts = require('yt-search');

cmd({
    pattern: "video",
    alias: ["ytvideo", "ytmp4", "yumi_video"],
    use: '.video <name or url>',
    react: "🎬",
    desc: "Download YouTube videos - Yumi Mini V1",
    category: "download",
    filename: __filename
},
async(conn, mek, m, { from, q, reply }) => {
    try {            
        if (!q) return await reply('🔎 *Video එකේ නම හරි Link එක හරි දාන්න බං!*\n\n> Ex: .video despacito');

        await conn.sendMessage(from, { react: { text: '🔍', key: mek.key } });

        const url = q.replace(/\?si=[^&]*/, '');
        let result;

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const results = await yts(url);
            result = results.videos[0];
        } else {
            const results = await yts(q);
            result = results.videos[0];
        }

        if (!result) return reply("❌ *Video එක හම්බුනේ නෑ බං!*");

        let caption = `╭━━━〔 *𝒀𝑼𝑴𝑰 𝑴𝑰𝑵𝑰 𝑽1* 〕━━━┈⊷
┃ 🎬 *VIDEO DOWNLOADER*
╰━━━━━━━━━━━━━━━━┈⊷

*┌──────────────────┐*
*├ 🎬 Title:* ${result.title} 
*├ 👀 Views:* ${result.views}
*├ ⏱️ Duration:* ${result.timestamp}
*├ 📅 Ago:* ${result.ago}
*├ 🔗 Url:* ${result.url}
*└──────────────────┘*

╭━━━〔 *SELECT QUALITY* 〕━━━┈⊷
┃
┃ *📽️ NORMAL VIDEO*
┃ 1️⃣  144p Quality
┃ 2️⃣  240p Quality
┃ 3️⃣  360p Quality
┃ 4️⃣  480p Quality
┃ 5️⃣  720p HD
┃ 6️⃣  1080p Full HD
┃
┃ *📂 DOCUMENT VIDEO*
┃ 7️⃣  144p Doc
┃ 8️⃣  240p Doc
┃ 9️⃣  360p Doc
┃ 🔟 480p Doc
┃ 1️⃣1️⃣ 720p Doc
┃ 1️⃣2️⃣ 1080p Doc
╰━━━━━━━━━━━━━━━━┈⊷

> 🔢 *Number එක reply කරන්න බං*

> 𝒀𝒖𝒎𝒊 𝑴𝒊𝒏𝒊 𝑽1 💖`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption: caption
        }, { quoted: mek });

        const msgId = sentMsg.key.id;
        global.numberStore = global.numberStore || {};
        global.numberStore[msgId] = {
            "1": `videodl 144&${result.url}`,
            "2": `videodl 240&${result.url}`,
            "3": `videodl 360&${result.url}`,
            "4": `videodl 480&${result.url}`,
            "5": `videodl 720&${result.url}`,
            "6": `videodl 1080&${result.url}`,
            "7": `docdl 144&${result.url}&${result.title}`,
            "8": `docdl 240&${result.url}&${result.title}`,
            "9": `docdl 360&${result.url}&${result.title}`,
            "10": `docdl 480&${result.url}&${result.title}`,
            "11": `docdl 720&${result.url}&${result.title}`,
            "12": `docdl 1080&${result.url}&${result.title}`
        };

        await conn.sendMessage(from, { react: { text: '✅', key: mek.key } });

    } catch (e) {
        reply('❌ *Error උනා බං!*');
        console.log(e);
    }
});

cmd({
    pattern: "videodl",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return;
        const [quality, url] = q.split('&');
        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
        const data = await ytmp4(url, { format: "mp4", videoQuality: quality });
        const dlUrl = data.downloadLink || data.dl_url || data.url;
        if (!dlUrl) return reply(`❌ *${quality}p link එක ගන්න බැරි උනා!*`);
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
        await conn.sendMessage(from, {
            video: { url: dlUrl },
            caption: `🎬 *Quality:* ${quality}p\n\n> 𝒀𝒖𝒎𝒊 𝑴𝒊𝒏𝒊 𝑽1 💖`
        }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (e) {
        reply('❌ *Download Failed බං!*');
        console.log(e);
    }
});

cmd({
    pattern: "docdl",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return;
        const [quality, url, title] = q.split('&');
        await conn.sendMessage(from, { react: { text: '⬇️', key: mek.key } });
        const data = await ytmp4(url, { format: "mp4", videoQuality: quality });
        const dlUrl = data.downloadLink || data.dl_url || data.url;
        if (!dlUrl) return reply(`❌ *${quality}p doc link එක ගන්න බැරි උනා!*`);
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });
        await conn.sendMessage(from, {
            document: { url: dlUrl },
            mimetype: 'video/mp4',
            fileName: `${(title || 'yumi_video').replace(/[^\w\s]/gi, '')}.mp4`,
            caption: `📂 *File:* ${title}\n🎬 *Quality:* ${quality}p\n\n> 𝒀𝒖𝒎𝒊 𝑴𝒊𝒏𝒊 𝑽1 💖`
        }, { quoted: mek });
        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key } });
    } catch (e) {
        reply('❌ *Document Download Failed!*');
        console.log(e);
    }
});