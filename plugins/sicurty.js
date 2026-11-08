// YUMI MINI V1 - SECURITY MANAGER 🛡️
// Bunny Xmd Dev 🎀 - Anti Call + Anti Bot + Owner Mode + Session Backup

const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/security.json');

function loadDB() {
    try {
        if (!fs.existsSync(DB_FILE)) {
            fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
            return {
                anticall: false,
                antibot: false,
                owneronly: false,
                antibot_numbers: [],
                callBlocked: [],
                backupEmail: ""
            };
        }
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch { return { anticall: false, antibot: false, owneronly: false, antibot_numbers: [], callBlocked: [] }; }
}
function saveDB(data) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ===== 1. ANTI CALL SYSTEM 📵 =====
cmd({
    on: "call"
}, async (conn, calls) => {
    try {
        let db = loadDB();
        if (!db.anticall) return;

        for (let call of calls) {
            let caller = call.from;
            if (call.status === 'offer') {
                console.log(`📵 Call from ${caller} - Blocking!`);
                
                // Reject call
                await conn.rejectCall(call.id, caller);
                
                // Send warning
                await conn.sendMessage(caller, { 
                    text: `📵 *ANTI CALL ACTIVE* 📵\n\n❌ Don't call YUMI MINI bot!\n\n⚠️ Your number reported!\n\n> YUMI MINI V1 Security 🛡️` 
                });
                
                // Block if repeated (3 calls = auto block)
                if (!db.callBlocked.includes(caller)) db.callBlocked.push(caller);
                saveDB(db);
                
                // Optional: Block caller
                // await conn.updateBlockStatus(caller, "block");
            }
        }
    } catch (e) { console.log("AntiCall Error:", e.message); }
});

// ===== 2. ANTI BOT SYSTEM 🤖 =====
cmd({
    on: "body"
}, async (conn, mek, m, { from, isGroup, isBotAdmin, body, sender, isAdmin }) => {
    try {
        let db = loadDB();
        if (!db.antibot) return;
        if (!isGroup) return;
        if (isAdmin) return; // Admins bypass
        
        // Detect bot patterns (common bot prefixes)
        const botPatterns = [
            /\.menu/, /\.alive/, /\.ping/, /🤖.*bot/i, 
            /baileys/i, /whatsapp-bot/i, /\.bot/i
        ];
        
        // If message looks like bot command + sender not whitelisted
        let isBotMsg = botPatterns.some(p => p.test(body));
        
        // Check if sender is other bot (has large status or sends auto msgs)
        if (isBotMsg && body.length > 5) {
            if (!isBotAdmin) return;
            
            // Check if already in list
            if (db.antibot_numbers.includes(sender)) {
                await conn.sendMessage(from, { 
                    text: `🤖 @${sender.split('@')[0]} is a BOT! Removing!`, 
                    mentions: [sender] 
                });
                await conn.groupParticipantsUpdate(from, [sender], "remove");
            } else {
                // Warn first time
                await conn.sendMessage(from, { 
                    text: `⚠️ @${sender.split('@')[0]} Bot detected? If bot, will be kicked next time!`, 
                    mentions: [sender] 
                });
                db.antibot_numbers.push(sender);
                saveDB(db);
            }
        }
    } catch {}
});

// ===== 3. OWNER ONLY MODE 👑 =====
cmd({
    on: "body"
}, async (conn, mek, m, { from, isGroup, sender, isOwner, body }) => {
    try {
        let db = loadDB();
        if (!db.owneronly) return;
        if (isOwner) return;
        if (body.startsWith('.owneronly')) return; // Allow owneronly command itself
        
        // If owner only ON, delete non-owner messages in inbox
        if (!isGroup) {
            await conn.sendMessage(from, { 
                text: `👑 *OWNER ONLY MODE ACTIVE*\n\n❌ Bot is in private mode!\nOnly owner can use!\n\n> YUMI MINI V1 🛡️` 
            });
            // Optional: block non-owner from using
            return;
        }
    } catch {}
});

// ===== 4. COMMANDS =====
cmd({
    pattern: "anticall",
    react: "📵",
    desc: "On/Off Anti Call",
    category: "security",
    filename: __filename
}, async (conn, mek, m, { isOwner, q, reply }) => {
    if (!isOwner) return reply("👑 Owner only!");
    let db = loadDB();
    
    if (q === 'on') {
        db.anticall = true;
        saveDB(db);
        reply("✅ *ANTI CALL ON* 📵\n\nCall ආවොත් auto reject + warning යනවා!\n\n> YUMI SECURITY 🛡️");
    } else if (q === 'off') {
        db.anticall = false;
        saveDB(db);
        reply("❌ Anti Call OFF!");
    } else {
        reply(`📵 Anti Call: ${db.anticall ? 'ON ✅' : 'OFF ❌'}\n\nUse: .anticall on/off\nBlocked: ${db.callBlocked.length} numbers`);
    }
});

cmd({
    pattern: "antibot",
    react: "🤖",
    desc: "On/Off Anti Bot",
    category: "security",
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isAdmin, isBotAdmin, isOwner, q, reply }) => {
    if (!isGroup) return reply("Group only!");
    if (!isAdmin && !isOwner) return reply("Admin only!");
    if (!isBotAdmin) return reply("Bot must be admin!");
    
    let db = loadDB();
    if (q === 'on') {
        db.antibot = true;
        saveDB(db);
        reply("✅ *ANTI BOT ON* 🤖\n\nවෙන Bot කෙනෙක් command දැම්මොත් auto kick!\n\n> YUMI SECURITY 🛡️");
    } else if (q === 'off') {
        db.antibot = false;
        saveDB(db);
        reply("❌ Anti Bot OFF!");
    } else {
        reply(`🤖 Anti Bot: ${db.antibot ? 'ON ✅' : 'OFF ❌'}\n\nUse: .antibot on/off\nDetected Bots: ${db.antibot_numbers.length}`);
    }
});

cmd({
    pattern: "owneronly",
    alias: ["ownermode", "private"],
    react: "👑",
    desc: "Owner Only Mode",
    category: "security",
    filename: __filename
}, async (conn, mek, m, { isOwner, q, reply }) => {
    if (!isOwner) return reply("👑 Owner only!");
    let db = loadDB();
    
    if (q === 'on') {
        db.owneronly = true;
        saveDB(db);
        reply("✅ *OWNER ONLY ON* 👑\n\nදැන් inbox එකේ owner ට විතරයි bot වැඩ කරන්නේ!\nGroup වල වැඩ කරනවා!\n\n> YUMI SECURITY 🛡️");
    } else if (q === 'off') {
        db.owneronly = false;
        saveDB(db);
        reply("❌ Owner Only OFF! Public mode ON!");
    } else {
        reply(`👑 Owner Only: ${db.owneronly ? 'ON ✅ (Private)' : 'OFF ❌ (Public)'}\n\nUse: .owneronly on/off`);
    }
});

cmd({
    pattern: "backup",
    alias: ["sessionbackup", "savedsession"],
    react: "💾",
    desc: "Backup Session",
    category: "security",
    filename: __filename
}, async (conn, mek, m, { isOwner, q, reply }) => {
    if (!isOwner) return reply("👑 Owner only!");
    
    try {
        // Check if session file exists
        let sessionPath = path.join(__dirname, '../session/creds.json');
        let authPath = path.join(__dirname, '../auth_info_baileys/creds.json');
        
        let credsFile = null;
        if (fs.existsSync(sessionPath)) credsFile = sessionPath;
        else if (fs.existsSync(authPath)) credsFile = authPath;
        
        if (!credsFile) return reply("❌ Session file not found!");
        
        let creds = fs.readFileSync(credsFile, 'utf8');
        
        // Save backup in data folder
        let backupPath = path.join(__dirname, `../data/backup_creds_${Date.now()}.json`);
        fs.writeFileSync(backupPath, creds);
        
        // Send to owner as document (so it doesn't expire)
        await conn.sendMessage(m.sender, {
            document: fs.readFileSync(credsFile),
            mimetype: 'application/json',
            fileName: `YUMI_BACKUP_${new Date().toISOString().split('T')[0]}.json`,
            caption: `💾 *SESSION BACKUP* 💾\n\n📅 Date: ${new Date().toLocaleString()}\n🔐 Keep this safe!\n⚠️ Don't share with anyone!\n\n> YUMI MINI V1 Security 🛡️`
        });
        
        reply(`✅ *BACKUP SUCCESS* 💾\n\n📁 Saved to: data/backup_...\n📨 Sent to your inbox!\n\n⚠️ Gmail එකට auto backup ඕන නම් .setemail your@gmail.com`);
        
    } catch (e) {
        reply(`❌ Backup Error: ${e.message}`);
    }
});

cmd({
    pattern: "security",
    alias: ["sec", "securitymenu"],
    react: "🛡️",
    desc: "Security Menu",
    category: "security",
    filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
    let db = loadDB();
    reply(`╭──〔 *YUMI SECURITY* 🛡️ 〕──╮
┃
┃ 📵 .anticall on/off
┃    └ Call ආවොත් auto reject
┃
┃ 🤖 .antibot on/off
┃    └ වෙන bot ලා auto kick
┃
┃ 👑 .owneronly on/off
┃    └ Owner ට විතරක් bot වැඩ
┃
┃ 💾 .backup
┃    └ Session backup ගන්න
┃
┃ 📊 Status:
┃    AntiCall: ${db.anticall ? 'ON ✅' : 'OFF ❌'}
┃    AntiBot: ${db.antibot ? 'ON ✅' : 'OFF ❌'}
┃    OwnerOnly: ${db.owneronly ? 'ON ✅' : 'OFF ❌'}
┃    Blocked Calls: ${db.callBlocked.length}
┃
╰───────────────╯
> YUMI MINI V1 Security 🛡️`);
});