const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/groupManager.json');

function loadDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
            return {};
        }
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch { return {}; }
}
function saveDB(data) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function getGroup(gid) {
    let db = loadDB();
    if (!db[gid]) {
        db[gid] = {
            antilink: false,
            antibadword: false,
            welcome: false,
            goodbye: false,
            antibot: false,
            mute: false,
            badwords: ["hukanna", "pakaya", "ponnaya"],
            welcomeMsg: "Welcome @user to @group! 🎉",
            goodbyeMsg: "Goodbye @user! 👋",
            warned: {}
        };
        saveDB(db);
    }
    return db[gid];
}

// ===== 1. ANTILINK + ANTIBADWORD LISTENER =====
cmd({
    on: "body"
}, async (conn, mek, m, { from, isGroup, isAdmin, isBotAdmin, body, sender }) => {
    if (!isGroup) return;
    if (!from.endsWith('@g.us')) return;
    
    let g = getGroup(from);
    let db = loadDB();
    
    if (isAdmin) return; // Admins bypass
    
    // Antilink
    if (g.antilink) {
        const linkRegex = /(https?:\/\/|www\.|wa\.me\/|chat\.whatsapp\.com\/)/i;
        if (linkRegex.test(body)) {
            if (!isBotAdmin) return;
            await conn.sendMessage(from, { text: `🚫 @${sender.split('@')[0]} Link detected! Antilink active!`, mentions: [sender] });
            await conn.groupParticipantsUpdate(from, [sender], "remove");
            return;
        }
    }
    
    // Antibadword
    if (g.antibadword) {
        let bad = g.badwords.some(w => body.toLowerCase().includes(w.toLowerCase()));
        if (bad) {
            if (!isBotAdmin) return;
            if (!db[from].warned[sender]) db[from].warned[sender] = 0;
            db[from].warned[sender] += 1;
            saveDB(db);
            
            if (db[from].warned[sender] >= 3) {
                await conn.sendMessage(from, { text: `🚫 @${sender.split('@')[0]} 3 Warnings! Kicked!`, mentions: [sender] });
                await conn.groupParticipantsUpdate(from, [sender], "remove");
                delete db[from].warned[sender];
                saveDB(db);
            } else {
                await conn.sendMessage(from, { text: `⚠️ @${sender.split('@')[0]} Bad word! Warning ${db[from].warned[sender]}/3`, mentions: [sender] });
            }
        }
    }
    
    // Mute check
    if (g.mute && !isAdmin) {
        if (!isBotAdmin) return;
        await conn.sendMessage(from, { delete: mek.key });
    }
});

// ===== 2. WELCOME & GOODBYE =====
cmd({
    on: "participantsUpdate"
}, async (conn, update) => {
    try {
        let gid = update.id;
        let g = getGroup(gid);
        if (!g.welcome && !g.goodbye) return;
        
        for (let p of update.participants) {
            if (update.action === 'add' && g.welcome) {
                let msg = g.welcomeMsg.replace('@user', `@${p.split('@')[0]}`).replace('@group', update.id);
                await conn.sendMessage(gid, { text: msg, mentions: [p] });
            }
            if (update.action === 'remove' && g.goodbye) {
                let msg = g.goodbyeMsg.replace('@user', `@${p.split('@')[0]}`);
                await conn.sendMessage(gid, { text: msg, mentions: [p] });
            }
        }
    } catch {}
});

// ===== 3. TOGGLE COMMANDS =====
cmd({
    pattern: "antilink",
    react: "🔗",
    desc: "On/Off Antilink",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, isBotAdmin, q, reply }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    if (!isBotAdmin) return reply("Bot must be admin!");
    
    let db = loadDB();
    let g = getGroup(from);
    
    if (q === 'on') {
        db[from].antilink = true;
        saveDB(db);
        reply("✅ Antilink ON! Link දැම්මොත් kick!");
    } else if (q === 'off') {
        db[from].antilink = false;
        saveDB(db);
        reply("❌ Antilink OFF!");
    } else {
        reply(`🔗 Antilink: ${g.antilink ? 'ON' : 'OFF'}\n\nUse: .antilink on/off`);
    }
});

cmd({
    pattern: "antibadword",
    alias: ["antiword", "antibad"],
    react: "🤬",
    desc: "On/Off Anti Badword",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, isBotAdmin, q, reply }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    let db = loadDB();
    let g = getGroup(from);
    
    if (q === 'on') { db[from].antibadword = true; saveDB(db); reply("✅ Antibadword ON! 3 warnings = kick!"); }
    else if (q === 'off') { db[from].antibadword = false; saveDB(db); reply("❌ Antibadword OFF!"); }
    else reply(`🤬 Antibadword: ${g.antibadword ? 'ON' : 'OFF'}\nUse: .antibadword on/off\nBadwords: ${g.badwords.join(', ')}`);
});

cmd({
    pattern: "welcome",
    react: "👋",
    desc: "On/Off Welcome",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, q, reply }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    let db = loadDB(); getGroup(from);
    if (q === 'on') { db[from].welcome = true; saveDB(db); reply("✅ Welcome ON!"); }
    else if (q === 'off') { db[from].welcome = false; saveDB(db); reply("❌ Welcome OFF!"); }
    else if (q) { db[from].welcomeMsg = q; db[from].welcome = true; saveDB(db); reply(`✅ Welcome Msg set:\n${q}\n\nUse @user & @group`); }
    else reply(`👋 Welcome: ${db[from].welcome ? 'ON' : 'OFF'}\nUse: .welcome on/off OR .welcome your custom message`);
});

cmd({
    pattern: "goodbye",
    react: "😢",
    desc: "On/Off Goodbye",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, q, reply }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    let db = loadDB(); getGroup(from);
    if (q === 'on') { db[from].goodbye = true; saveDB(db); reply("✅ Goodbye ON!"); }
    else if (q === 'off') { db[from].goodbye = false; saveDB(db); reply("❌ Goodbye OFF!"); }
    else if (q) { db[from].goodbyeMsg = q; db[from].goodbye = true; saveDB(db); reply(`✅ Goodbye Msg set:\n${q}`); }
    else reply(`😢 Goodbye: ${db[from].goodbye ? 'ON' : 'OFF'}\nUse: .goodbye on/off OR custom msg`);
});

// ===== 4. ADMIN ACTIONS =====
cmd({
    pattern: "kick",
    react: "🦶",
    desc: "Kick user",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, isBotAdmin, reply, quoted, mentionedJid }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    if (!isBotAdmin) return reply("Bot must be admin!");
    let user = quoted?.sender || mentionedJid?.[0];
    if (!user) return reply("Tag or reply to user! .kick @user");
    await conn.groupParticipantsUpdate(from, [user], "remove");
    reply(`✅ Kicked @${user.split('@')[0]}`, { mentions: [user] });
});

cmd({
    pattern: "add",
    react: "➕",
    desc: "Add user",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, isBotAdmin, q, reply }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    if (!isBotAdmin) return reply("Bot must be admin!");
    if (!q) return reply("Use: .add 9476xxxxxxx");
    let num = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    await conn.groupParticipantsUpdate(from, [num], "add");
    reply(`✅ Added ${q}`);
});

cmd({
    pattern: "promote",
    react: "👑",
    desc: "Promote to admin",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, isBotAdmin, reply, quoted, mentionedJid }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    if (!isBotAdmin) return reply("Bot must be admin!");
    let user = quoted?.sender || mentionedJid?.[0];
    if (!user) return reply(".promote @user");
    await conn.groupParticipantsUpdate(from, [user], "promote");
    reply(`👑 Promoted @${user.split('@')[0]}`, { mentions: [user] });
});

cmd({
    pattern: "demote",
    react: "👤",
    desc: "Demote admin",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, isBotAdmin, reply, quoted, mentionedJid }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    if (!isBotAdmin) return reply("Bot must be admin!");
    let user = quoted?.sender || mentionedJid?.[0];
    if (!user) return reply(".demote @user");
    await conn.groupParticipantsUpdate(from, [user], "demote");
    reply(`👤 Demoted @${user.split('@')[0]}`, { mentions: [user] });
});

cmd({
    pattern: "mute",
    react: "🔇",
    desc: "Mute group",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, isBotAdmin, reply }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    if (!isBotAdmin) return reply("Bot must be admin!");
    let db = loadDB(); getGroup(from);
    db[from].mute = true; saveDB(db);
    await conn.groupSettingUpdate(from, 'announcement');
    reply("🔇 Group Muted! Only admins can chat!");
});

cmd({
    pattern: "unmute",
    react: "🔊",
    desc: "Unmute group",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, isBotAdmin, reply }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    if (!isBotAdmin) return reply("Bot must be admin!");
    let db = loadDB(); getGroup(from);
    db[from].mute = false; saveDB(db);
    await conn.groupSettingUpdate(from, 'not_announcement');
    reply("🔊 Group Unmuted!");
});

// ===== 5. TAG & UTILS =====
cmd({
    pattern: "tagall",
    alias: ["hidetag"],
    react: "📢",
    desc: "Tag all members",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, q, reply, groupMetadata }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    let members = groupMetadata.participants.map(p => p.id);
    let msg = q || "📢 Attention Everyone!";
    await conn.sendMessage(from, { text: `╭──〔 *TAG ALL* 〕──╮\n┃\n┃ ${msg}\n┃\n${members.map(m => `┃ @${m.split('@')[0]}`).join('\n')}\n┃\n╰───────────────╯\n> YUMI MINI V1 🎀`, mentions: members });
});

cmd({
    pattern: "ginfo",
    alias: ["groupinfo"],
    react: "ℹ️",
    desc: "Group info",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, reply, groupMetadata }) => {
    if (!isGroup) return reply("Group only!");
    let g = getGroup(from);
    let admins = groupMetadata.participants.filter(p => p.admin).length;
    reply(`╭──〔 *GROUP INFO* 〕──╮
┃
┃ 📛 Name: ${groupMetadata.subject}
┃ 👥 Members: ${groupMetadata.participants.length}
┃ 👑 Admins: ${admins}
┃ 🔗 Antilink: ${g.antilink ? 'ON' : 'OFF'}
┃ 🤬 Antibad: ${g.antibadword ? 'ON' : 'OFF'}
┃ 👋 Welcome: ${g.welcome ? 'ON' : 'OFF'}
┃ 😢 Goodbye: ${g.goodbye ? 'ON' : 'OFF'}
┃ 🔇 Mute: ${g.mute ? 'ON' : 'OFF'}
┃
╰───────────────╯
> YUMI MINI V1 🎀`);
});

cmd({
    pattern: "revoke",
    alias: ["resetlink"],
    react: "🔗",
    desc: "Revoke group link",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, isBotAdmin, reply }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin) return reply("Admin only!");
    if (!isBotAdmin) return reply("Bot must be admin!");
    await conn.groupRevokeInvite(from);
    reply("✅ Group link revoked! New link generated!");
});

cmd({
    pattern: "gsettings",
    alias: ["gmanage"],
    react: "⚙️",
    desc: "All group settings",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
    if (!isGroup) return reply("Group only!");
    let g = getGroup(from);
    reply(`╭──〔 *YUMI GROUP MANAGER* 〕──╮
┃
┃ 🔗 .antilink on/off
┃ 🤬 .antibadword on/off
┃ 👋 .welcome on/off or custom msg
┃ 😢 .goodbye on/off or custom msg
┃ 🦶 .kick @user
┃ ➕ .add 94xxxxxxxx
┃ 👑 .promote @user
┃ 👤 .demote @user
┃ 🔇 .mute / .unmute
┃ 📢 .tagall [msg]
┃ ℹ️ .ginfo
┃ 🔗 .revoke
┃ ⚙️ .gsettings
┃
╰───────────────╯
> Use @user & @group in welcome msg
> YUMI MINI V1 🎀`);
});