const { cmd } = require('../command');
const axios = require('axios');

const API_BASE = "https://shadowx-multi-dl-api.itzmekcey.workers.dev/?url=";
const THUMB = "https://files.catbox.moe/3z2z8p.jpg";
const CHANNEL_JID = "120363429003638511@newsletter";

cmd({
    pattern: "dl",
    alias: ["download", "bdl", "bunnyxdl", "bunnydl", "alldl", "bunnyx"],
    desc: "Bunny X DL - Premium",
    category: "downloader",
    react: "🐰",
    filename: __filename
},
async (conn, mek, m, { from, q }) => {
    try {
        if (!q) {
            let ui = `
╭─〔 🐰 *BUNNY X DL* ✨ 〕─
│
│  _Premium All-in-One Downloader_
│
│  ┌─〔 🌸 *SUPPORTED* 〕─
│  │ • 🎵 TikTok
│  │ • 📸 Instagram
│  │ • 📘 Facebook
│  │ • 🎬 YouTube MP4
│  │ • 🎧 YouTube MP3
│  │ • 📁 MediaFire
│  │ • 💾 Google Drive
│  └───────────────
│
│  ┌─〔 💋 *HOW TO USE* 〕─
│  │ • .dl <link>
│  │ • .dl <yt link> mp3
│  │ • .dl <yt link> mp4
│  └───────────────
│
│  ┌─〔 🎀 *EXAMPLE* 〕─
│  │ • .dl https://vm.tiktok.com/xxx
│  │ • .dl https://youtu.be/xxx mp3
│  │ • .dl https://fb.watch/xxx
│  └───────────────
│
╰─────────────────╯

> _Power by Bunny X MD_ 🐰🔥`.trim();

            return await conn.sendMessage(from, {
                image: { url: THUMB },
                caption: ui,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: CHANNEL_JID,
                        newsletterName: "Bunny X DL 🐰💀",
                        serverMessageId: -1
                    },
                    externalAdReply: {
                        title: "🐰 Bunny X DL - Premium",
                        body: "All-in-One Downloader ✨",
                        mediaType: 1,
                        thumbnailUrl: THUMB,
                        sourceUrl: "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g",
                        renderLargerThumbnail: true,
                        showAdAttribution: true
                    }
                }
            }, { quoted: mek });
        }

        let args = q.trim().split(/\s+/);
        let url = args[0];
        let mode = args[1] ? args[1].toLowerCase() : null;

        if (!mode && (url.includes("youtu.be") || url.includes("youtube.com"))) {
            mode = "mp4";
        }
        if (mode && !["mp4", "mp3"].includes(mode)) mode = null;

        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
        await conn.sendPresenceUpdate('composing', from);

        let waitMsg = await conn.sendMessage(from, {
            text: `╭─〔 🐰 *BUNNY X DL* 〕─\n│\n│  ⏳ *Downloading...*\n│  🔗 ${url.slice(0, 40)}...\n│  🎬 *Mode:* ${mode ? mode.toUpperCase() : "AUTO"}\n│\n╰───────────────\n> _Please wait patiyo_ 💖`,
        }, { quoted: mek });

        let apiUrl = `${API_BASE}${encodeURIComponent(url)}`;
        if (mode) apiUrl += `&mode=${mode}`;

        let res;
        try {
            res = await axios.get(apiUrl, { timeout: 45000 });
        } catch (err) {
            return await conn.sendMessage(from, {
                text: `╭─〔 ❌ *ERROR* 〕─\n│\n│  ⚠️ ${err.message}\n│  API offline වගේ!\n│\n╰───────────────\n> _Power by Bunny X MD_ 🔥`
            }, { quoted: mek });
        }

        let data = res.data;
        let dlUrl = data.url || data.download || data.result || data.direct || data.link || data.data?.url || data.data?.download;

        if (!dlUrl) {
            return await conn.sendMessage(from, {
                text: `╭─〔 ❌ *FAILED* 〕─\n│\n│  Link හම්බුනේ නෑ!\n│  📦 Raw: ${JSON.stringify(data).slice(0, 300)}...\n│\n╰───────────────\n> _Bunny X MD_ 🐰`
            }, { quoted: mek });
        }

        let isAudio = mode === "mp3";
        let successCaption = `
╭─〔 🐰 *BUNNY X DL* ✅ 〕─
│
│  ✅ *Download Success!*
│
│  ┌─〔 📥 *DETAILS* 〕─
│  │ • Type: ${isAudio ? "MP3 / Audio 🎧" : "MP4 / Video 🎬"}
│  │ • Status: Done ✨
│  │ • Engine: Bunny X API
│  └───────────────
│
╰─────────────────╯

> _Power by Bunny X MD_ 🐰🔥`.trim();

        if (isAudio) {
            await conn.sendMessage(from, {
                audio: { url: dlUrl },
                mimetype: "audio/mpeg"
            }, { quoted: mek });
            await conn.sendMessage(from, { text: successCaption }, { quoted: mek });
        } else {
            try {
                await conn.sendMessage(from, {
                    video: { url: dlUrl },
                    caption: successCaption,
                    contextInfo: {
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: CHANNEL_JID,
                            newsletterName: "Bunny X DL 🐰💀",
                            serverMessageId: -1
                        }
                    }
                }, { quoted: mek });
            } catch {
                await conn.sendMessage(from, {
                    text: `╭─〔 🐰 *READY* ✅ 〕─\n│\n│  🔗 Link: ${dlUrl}\n│\n╰───────────────\n\n${successCaption}`
                }, { quoted: mek });
            }
        }

        await conn.sendMessage(from, { react: { text: "🐰", key: mek.key } });

    } catch (e) {
        await conn.sendMessage(from, { text: `╭─〔 ❌ *ERROR* 〕─\n│  ${e.message}\n╰───────────────\n> Bunny X MD` }, { quoted: mek });
    }
});