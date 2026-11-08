const { cmd } = require('../command');
const axios = require('axios');

// ═══════════════════════════════════════
//  🌸 YUMI MINI - WEB SS PRO ULTRA 🌸
//  Owner: Bunny Xmd Dev
// ═══════════════════════════════════════
const config = {
    PREFIX: ".",
    BOT_NAME: "YUMI MINI V1",
    OWNER: "Bunny Xmd Dev",
};
// ═══════════════════════════════════════

const FOOTER = `\n\n> *✨ YUMI MINI V1 • Bunny Xmd Dev ✨*\n> _cute • fast • powerful >.<_ 💖`;

// 🎨 Premium Divider
const line = "─".repeat(28);

cmd({
    pattern: "webss",
    alias: ["ss", "screenshot", "webshot", "site"],
    react: "📸",
    desc: "Website Screenshot Ultra",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  📸  *WEB SCREENSHOT*  ✨  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

> ❌ *Oops! Link එකක් නෑ නේ!* 🥺

┌─❀ *HOW TO USE* ─❀─┐
│
│  📝  ${config.PREFIX}webss google.com
│  📝  ${config.PREFIX}ss youtube.com
│  📝  ${config.PREFIX}webss cinesubz.co
│
└───────────────────┘${FOOTER}`
        );

        let url = q.trim();
        if (!url.startsWith("http")) url = "https://" + url;
        let domain = url.replace("https://","").replace("http://","").split("/")[0];

        // ✨ Loading - Ultra UI
        let loadMsg = await conn.sendMessage(from, { text:
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  📸  *CAPTURING...*  ⏳  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

┌─🌐 *WEBSITE INFO* ────┐
│
│  🔗  *Site :* ${domain}
│  💻  *Mode :* Desktop HD
│  📐  *Size :* 1200 × 800
│  👤  *By   :* ${m.pushName || "User"}
│
└───────────────────┘

> ⏳ *Please Wait...*
> _Screenshot එක Load වෙනවා..._ 🎬✨` }, { quoted: mek });

        let ssUrl = `https://image.thum.io/get/width/1200/crop/800/noanimate/${url}`;
        let res = await axios.get(ssUrl, { responseType: 'arraybuffer', timeout: 30000 });

        // Loading Delete
        try { await conn.sendMessage(from, { delete: loadMsg.key }); } catch {}

        await conn.sendMessage(from, {
            image: Buffer.from(res.data),
            caption:
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅  *SHOT SUCCESS!*  📸  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

┌─🌐 *WEBSITE INFO* ────┐
│
│  🔗  *Site :* ${domain}
│  💻  *View :* Desktop • HD Quality
│  📐  *Size :* 1200 × 800 px
│  👤  *By   :* ${m.pushName || "User"} 💖
│  🕐  *Time :* ${new Date().toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}
│
└───────────────────┘

┌─🎀 *TRY MORE* ───────┐
│
│  📜  ${config.PREFIX}fullss ${q}
│       └ Full Page SS
│
│  📱  ${config.PREFIX}mobiless ${q}
│       └ Phone View SS
│
└───────────────────┘${FOOTER}`
        }, { quoted: mek });

    } catch (e) {
        await reply(
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  ❌  *FAILED!*  😢  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

> 🌐 Site එක Load වුනේ නෑ!
> 🔍 Link එක හරිද බලපන්!

┌─💡 *TRY THIS* ───────┐
│
│  📝  ${config.PREFIX}webss google.com
│  📝  ${config.PREFIX}webss youtube.com
│
└───────────────────┘${FOOTER}`
        );
    }
});

// ─── FULL PAGE ───
cmd({
    pattern: "fullss",
    alias: ["fullscreenshot", "fullpage"],
    react: "🖥️",
    desc: "Full Page Screenshot",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`┏━━━━━━━━━━━━━━━━━━━━━━┓\n┃  🖥️  *FULL PAGE SS*  ┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> 📝 Use: ${config.PREFIX}fullss google.com${FOOTER}`);

        let url = q.trim();
        if (!url.startsWith("http")) url = "https://" + url;
        let domain = url.replace("https://","").split("/")[0];

        let loadMsg = await conn.sendMessage(from, { text:
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  🖥️  *FULL PAGE...*  ⏳  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

┌─🌐 *INFO* ───────────┐
│
│  🔗  ${domain}
│  📜  Full Scroll Capture
│  ⏳  ටිකක් Slow වෙයි...
│
└───────────────────┘` }, { quoted: mek });

        let ssUrl = `https://image.thum.io/get/width/1200/fullpage/${url}`;
        let res = await axios.get(ssUrl, { responseType: 'arraybuffer', timeout: 45000 });
        try { await conn.sendMessage(from, { delete: loadMsg.key }); } catch {}

        await conn.sendMessage(from, {
            image: Buffer.from(res.data),
            caption:
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅  *FULL PAGE DONE!*  🖥️  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

┌─🌐 *INFO* ───────────┐
│
│  🔗  *Site :* ${domain}
│  📜  *View :* Full Page Scroll
│  👤  *By   :* ${m.pushName || "User"} 💖
│
└───────────────────┘${FOOTER}`
        }, { quoted: mek });
    } catch (e) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━┓\n┃  ❌  *FAILED!*  ┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> Full Page SS ගන්න බැරි උනා!${FOOTER}`);
    }
});

// ─── MOBILE ───
cmd({
    pattern: "mobiless",
    alias: ["mss", "phones"],
    react: "📱",
    desc: "Mobile Screenshot",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply(`┏━━━━━━━━━━━━━━━━━━━━━━┓\n┃  📱  *MOBILE SS*  ┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> 📝 Use: ${config.PREFIX}mobiless youtube.com${FOOTER}`);

        let url = q.trim();
        if (!url.startsWith("http")) url = "https://" + url;
        let domain = url.replace("https://","").split("/")[0];

        let loadMsg = await conn.sendMessage(from, { text:
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  📱  *MOBILE VIEW...*  ⏳  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

┌─🌐 *INFO* ───────────┐
│
│  🔗  ${domain}
│  📱  iPhone 14 View
│  📐  375 × 667
│
└───────────────────┘` }, { quoted: mek });

        let ssUrl = `https://image.thum.io/get/width/375/crop/667/noanimate/${url}`;
        let res = await axios.get(ssUrl, { responseType: 'arraybuffer', timeout: 30000 });
        try { await conn.sendMessage(from, { delete: loadMsg.key }); } catch {}

        await conn.sendMessage(from, {
            image: Buffer.from(res.data),
            caption:
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅  *MOBILE DONE!*  📱  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

┌─🌐 *INFO* ───────────┐
│
│  🔗  *Site :* ${domain}
│  📱  *View :* Phone • 375 × 667
│  👤  *By   :* ${m.pushName || "User"} 💖
│
└───────────────────┘${FOOTER}`
        }, { quoted: mek });
    } catch (e) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━┓\n┃  ❌  *FAILED!*  ┃\n┗━━━━━━━━━━━━━━━━━━━━━━┛\n\n> Mobile SS ගන්න බැරි උනා!${FOOTER}`);
    }
});

// ─── MENU ───
cmd({
    pattern: "webssmenu",
    alias: ["ssmenu"],
    react: "📸",
    desc: "Web SS List",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    return reply(
`┏━━━━━━━━━━━━━━━━━━━━━━┓
┃  📸  *WEB SS PRO*  ✨  ┃
┃  *YUMI MINI V1*  🎀  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

> 👤 *User :* ${m.pushName || "User"} 💖
> ⚡ *Speed :* 5 Sec • FREE
> 🔑 *API Key :* ඕනි නෑ!

┌─💻 *DESKTOP • HD* ───┐
│
│  📸  ${config.PREFIX}webss google.com
│  📸  ${config.PREFIX}ss youtube.com
│  📸  ${config.PREFIX}webss cinesubz.co
│
└───────────────────┘

┌─🖥️ *FULL PAGE* ─────┐
│
│  📜  ${config.PREFIX}fullss google.com
│  📜  ${config.PREFIX}fullpage wikipedia.org
│
└───────────────────┘

┌─📱 *MOBILE VIEW* ───┐
│
│  📱  ${config.PREFIX}mobiless youtube.com
│  📱  ${config.PREFIX}mss tiktok.com
│
└───────────────────┘

┌─💡 *TIPS* ──────────┐
│
│  ✨ https:// දාන්න ඕනි නෑ!
│  ✨ google.com කියලා ඇති!
│  ✨ Full Page එක ටිකක් Slow!
│
└───────────────────┘${FOOTER}`
    );
});