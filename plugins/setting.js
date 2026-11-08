const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const SETTINGS_PATH = path.join(__dirname, '../settings.json');

let settings = {
  botName: "YUMI MINI V1 😽",
  botNameShort: "YUMI",
  ownerName: "Bunny Xmd Dev",
  thumb: "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg",
  channelJid: "120363429003638511@newsletter",
  channelName: "Yumi Mini V1 😽",
  channelUrl: "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g",
  prefix: ".",
  footer: "cute • fast • powerful"
};

if (fs.existsSync(SETTINGS_PATH)) {
  try { settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8')); } catch {}
} else {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
}

const saveSettings = () => fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));

const runtime = () => {
  let sec = process.uptime()
  let d = Math.floor(sec / 86400)
  let h = Math.floor((sec % 86400) / 3600)
  let mm = Math.floor((sec % 3600) / 60)
  return d > 0? `${d}d ${h}h ${mm}m` : `${h}h ${mm}m`
};

const getContext = (title, body) => ({
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: settings.channelJid,
    newsletterName: settings.channelName,
    serverMessageId: -1
  },
  externalAdReply: {
    title: title,
    body: body,
    mediaType: 1,
    thumbnailUrl: settings.thumb,
    sourceUrl: settings.channelUrl,
    renderLargerThumbnail: true,
    showAdAttribution: true
  }
});

const isOwnerCheck = (sender) => {
    return sender.includes("94742184347") || sender.includes("94776903338");
}

// 1. MAIN SETTINGS MENU
cmd({
    pattern: "settings",
    alias: ["set", "config"],
    react: "🎀",
    desc: "Show bot settings",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    if (!isOwnerCheck(sender)) return await conn.sendMessage(from, { text: "╭─❍ *ᴀᴄᴄᴇss ᴅᴇɴɪᴇᴅ* ❍─\n│ ❌ ᴏᴡɴᴇʀ ᴏɴʟʏ ʙᴀʙʏ 😿\n╰───────────────" }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "🎀", key: mek.key } });
    return await conn.sendMessage(from, {
        text: `╭─❍ *YUMI • SETTINGS* ❍─
│
│ ♡ *ʙᴏᴛ* : ${settings.botName} ෆ
│ ♡ *ᴏᴡɴᴇʀ* : ${settings.ownerName} ✨
│ ♡ *ᴘʀᴇғɪx* : ${settings.prefix} 💫
│ ♡ *ᴜᴘᴛɪᴍᴇ* : ${runtime()} ⏱️
│ ♡ *ᴄʜᴀɴɴᴇʟ* : ${settings.channelName}
│
│ ──── *ᴇᴅɪᴛ ᴄᴏᴍᴍᴀɴᴅs* ────
│
│ 🎀 *.setbotname* <name>
│ └─ bot name change
│
│ 💋 *.setowner* <name>
│ └─ owner name change
│
│ 🖼️ *.setthumb* <url>
│ └─ thumbnail change
│
│ ⚡ *.setprefix* <symbol>
│ └─ prefix change
│
│ 📢 *.setchannel* <jid>
│ └─ channel jid change
│
╰─〔 *${settings.ownerName}* 〕─

> _ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${settings.botNameShort} ᴍɪɴɪ 💖_`,
        contextInfo: getContext(`${settings.botNameShort} • Settings Panel 🎀`, `Hey ${m.pushName || "cutie"} • Edit your bot`)
    }, { quoted: mek });
});

// 2. SET BOT NAME
cmd({
    pattern: "setbotname",
    alias: ["setname"],
    react: "🎀",
    desc: "Change bot name",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, q, sender }) => {
    if (!isOwnerCheck(sender)) return;
    const newName = q.trim();
    if (!newName) return await conn.sendMessage(from, { text: `╭─❍ *ᴜsᴀɢᴇ* ❍─\n│ • .setbotname YUMI SUPER V2 😽\n╰───────────────` }, { quoted: mek });
    settings.botName = newName;
    saveSettings();
    return await conn.sendMessage(from, {
        text: `╭─〔 ✅ *sᴜᴄᴄᴇss* 〕─\n│ ♡ *ᴛʏᴘᴇ* : ʙᴏᴛ ɴᴀᴍᴇ 🎀\n│ ♡ *ɴᴇᴡ* : ${newName}\n│ ♡ *sᴛᴀᴛᴜs* : ᴜᴘᴅᴀᴛᴇᴅ 💖\n╰─〔 *${settings.ownerName}* 〕─`,
        contextInfo: getContext(`Updated to ${newName} ✨`, "Bot name changed")
    }, { quoted: mek });
});

// 3. SET OWNER
cmd({
    pattern: "setowner",
    react: "💋",
    desc: "Change owner name",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, q, sender }) => {
    if (!isOwnerCheck(sender)) return;
    const newOwner = q.trim();
    if (!newOwner) return await conn.sendMessage(from, { text: `╭─❍ *ᴜsᴀɢᴇ* ❍─\n│ • .setowner Bunny Xmd\n╰───────────────` }, { quoted: mek });
    settings.ownerName = newOwner;
    saveSettings();
    return await conn.sendMessage(from, {
        text: `╭─〔 ✅ *sᴜᴄᴄᴇss* 〕─\n│ ♡ *ᴛʏᴘᴇ* : ᴏᴡɴᴇʀ ɴᴀᴍᴇ 💋\n│ ♡ *ɴᴇᴡ* : ${newOwner}\n╰─〔 *${settings.ownerName}* 〕─`,
        contextInfo: getContext(`Owner -> ${newOwner}`, "Updated")
    }, { quoted: mek });
});

// 4. SET THUMB
cmd({
    pattern: "setthumb",
    react: "🖼️",
    desc: "Change thumbnail",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, q, sender }) => {
    if (!isOwnerCheck(sender)) return;
    let url = q.trim();
    if (!url || !url.startsWith("http")) return await conn.sendMessage(from, { text: `╭─❍ *ᴜsᴀɢᴇ* ❍─\n│ • .setthumb https://i.imgur.com/xxx.jpg\n╰───────────────` }, { quoted: mek });
    settings.thumb = url;
    saveSettings();
    return await conn.sendMessage(from, {
        image: { url: url },
        caption: `╭─〔 ✅ *ᴛʜᴜᴍʙ ᴜᴘᴅᴀᴛᴇᴅ* 〕─\n│ ♡ *sᴛᴀᴛᴜs* : sᴜᴄᴄᴇss 🖼️\n╰─〔 *${settings.ownerName}* 〕─`,
        contextInfo: getContext("Thumbnail Updated ✨", settings.botName)
    }, { quoted: mek });
});

// 5. SET PREFIX
cmd({
    pattern: "setprefix",
    react: "⚡",
    desc: "Change bot prefix",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, q, sender }) => {
    if (!isOwnerCheck(sender)) return;
    let newPrefix = q.trim();
    if (!newPrefix) return await conn.sendMessage(from, { text: `╭─❍ *ᴜsᴀɢᴇ* ❍─\n│ • .setprefix !\n╰───────────────` }, { quoted: mek });
    settings.prefix = newPrefix;
    saveSettings();
    return await conn.sendMessage(from, {
        text: `╭─〔 ✅ *ᴘʀᴇғɪx ᴜᴘᴅᴀᴛᴇᴅ* 〕─\n│ ♡ *ɴᴇᴡ* : ${newPrefix}\n│ ♡ *ᴇx* : ${newPrefix}alive\n╰─〔 *${settings.ownerName}* 〕─`,
        contextInfo: getContext(`Prefix -> ${newPrefix}`, "Updated")
    }, { quoted: mek });
});

// 6. SET CHANNEL
cmd({
    pattern: "setchannel",
    react: "📢",
    desc: "Change channel JID",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, q, sender }) => {
    if (!isOwnerCheck(sender)) return;
    let newJid = q.trim();
    if (!newJid) return await conn.sendMessage(from, { text: `❌ Ex: .setchannel 120363xxx@newsletter` }, { quoted: mek });
    settings.channelJid = newJid;
    saveSettings();
    return await conn.sendMessage(from, { text: `✅ Channel JID -> ${newJid}` }, { quoted: mek });
});