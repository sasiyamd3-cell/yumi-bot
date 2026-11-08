const { cmd } = require('../command');
const mongoose = require('mongoose');

const ReactConfigSchema = new mongoose.Schema({
    type: { type: String, default: 'react_config' },
    enabled: { type: Boolean, default: true },
    channels: { type: [String], default: [] }, // react දාන channels
    emojis: { type: [String], default: ['❤️','🔥','🎀','💖','✨','👍','🎉','💯'] },
    autoReact: { type: Boolean, default: true },
    multiUser: { type: Boolean, default: true }, // users ලා ඔක්කොම react දානවද?
    delayPerUser: { type: Number, default: 800 },
    randomEmoji: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'YumiChannelReact' });

const ReactConfig = mongoose.model('YumiChannelReactConfig', ReactConfigSchema);

const ReactLogSchema = new mongoose.Schema({
    channelJid: String,
    messageId: String,
    emoji: String,
    reactedCount: Number,
    createdAt: { type: Date, default: Date.now }
}, { collection: 'YumiReactLogs' });
const ReactLog = mongoose.model('YumiReactLog', ReactLogSchema);

async function getReactConfig() {
    let c = await ReactConfig.findOne({ type: 'react_config' });
    if (!c) c = await ReactConfig.create({ type: 'react_config', channels: [], emojis: ['❤️','🔥','🎀','💖','✨','👍','🎉','💯'], enabled: true });
    return c;
}

// ========== CORE: ALL BOT USERS REACT! ==========
async function reactWithAllUsers(channelJid, messageKey, customEmoji = null) {
    const activeSockets = global.activeSockets || {};
    const userCount = Object.keys(activeSockets).length;
    if (userCount === 0) return { reacted: 0 };

    const cfg = await getReactConfig();
    if (!cfg.enabled) return { reacted: 0 };

    console.log(`❤️ REACT START: ${channelJid} | Users: ${userCount} | Emoji: ${customEmoji || 'random'}`);

    let reacted = 0, failed = 0;
    const usedEmojis = [];

    for (const sessionId in activeSockets) {
        const sock = activeSockets[sessionId];
        if (!sock?.user) continue;

        try {
            await sock.newsletterFollow(channelJid).catch(()=>{});
            await new Promise(r => setTimeout(r, cfg.delayPerUser + Math.random()*600));

            let emoji = customEmoji;
            if (!emoji) {
                if (cfg.randomEmoji) {
                    emoji = cfg.emojis[Math.floor(Math.random() * cfg.emojis.length)];
                } else {
                    emoji = cfg.emojis[0];
                }
            }

            await sock.sendMessage(channelJid, {
                react: { text: emoji, key: messageKey }
            });

            reacted++;
            usedEmojis.push(emoji);
            console.log(`✅ Reacted [${reacted}/${userCount}] ${sessionId} -> ${emoji}`);

        } catch (e) {
            failed++;
            console.log(`❌ React fail ${sessionId}: ${e.message}`);
        }
    }

    await ReactLog.create({
        channelJid,
        messageId: messageKey?.id || '',
        emoji: usedEmojis.join(','),
        reactedCount: reacted
    }).catch(()=>{});

    return { success: true, reacted, failed, totalUsers: userCount, emojis: usedEmojis };
}

// ========== AUTO DETECT CHANNEL POST ==========
async function autoReactDetector(conn, msg, from) {
    try {
        const cfg = await getReactConfig();
        if (!cfg.enabled || !cfg.autoReact) return;

        if (!from.endsWith('@newsletter')) return;

        // If channels list set, only react for those
        if (cfg.channels.length > 0 && !cfg.channels.includes(from)) return;

        // Skip polls (poll voter handles)
        if (msg.message?.pollCreationMessage || msg.message?.pollCreationMessageV3) return;

        console.log(`❤️ NEW CHANNEL POST: ${from} - Auto reacting...`);

        setTimeout(async () => {
            await reactWithAllUsers(from, msg.key, null);
        }, 2000);

    } catch (e) { console.log('autoReact error:', e.message); }
}

// ========== COMMANDS ==========
cmd({
    pattern: "creact",
    alias: ["channelreact", "reactall", "multireact"],
    react: "❤️",
    desc: "Multi User Channel React System",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isOwner }) => {
    if (!isOwner) return reply('👑 Owner only!');

    const cfg = await getReactConfig();
    const sub = (args[0] || '').toLowerCase();

    if (sub === 'on') {
        cfg.enabled = true; cfg.autoReact = true; await cfg.save();
        return reply('✅ *Multi-User Channel React ON!* 🎀\nදැන් Channel Post එකක් ආවම bot users ලා ඔක්කොම react දානවා! ❤️🔥');
    }
    if (sub === 'off') {
        cfg.enabled = false; await cfg.save();
        return reply('❌ Channel React OFF');
    }
    if (sub === 'add') {
        const jid = args[1] || from;
        if (!jid.endsWith('@newsletter')) return reply('❌ Channel JID එකක් දාන්න! ex: 1203...@newsletter');
        if (!cfg.channels.includes(jid)) { cfg.channels.push(jid); await cfg.save(); }
        return reply(`✅ Channel added:\n${jid}\nTotal: ${cfg.channels.length}`);
    }
    if (sub === 'remove' || sub === 'del') {
        const jid = args[1] || from;
        cfg.channels = cfg.channels.filter(x=>x!==jid); await cfg.save();
        return reply(`🗑️ Removed: ${jid}`);
    }
    if (sub === 'list') {
        return reply(`📋 *React Channels:*\n\n${cfg.channels.length===0?'All channels (auto) 🌍':cfg.channels.join('\n')}\n\n👥 Users: ${Object.keys(global.activeSockets||{}).length}\n❤️ Emojis: ${cfg.emojis.join(' ')}\nStatus: ${cfg.enabled?'ON ✅':'OFF ❌'}`);
    }
    if (sub === 'emoji' || sub === 'emojis') {
        const newEmojis = args.slice(1);
        if (newEmojis.length === 0) return reply(`❤️ Current: ${cfg.emojis.join(' ')}\n\nUse: .creact emoji ❤️ 🔥 🎀 💖 ✨`);
        cfg.emojis = newEmojis; await cfg.save();
        return reply(`✅ Emojis set: ${cfg.emojis.join(' ')}`);
    }
    if (sub === 'random') {
        cfg.randomEmoji = !cfg.randomEmoji; await cfg.save();
        return reply(`🎲 Random Emoji: ${cfg.randomEmoji?'ON ✅ (හැම user වෙන emoji)':'OFF ❌ (එකම emoji)'}`);
    }
    if (sub === 'react') {
        // .creact react ❤️ - manual react current channel last post
        const emoji = args[1] || '❤️';
        const last = global._lastChannelPosts?.get(from);
        if (!last) return reply('❌ No recent post in this channel!');
        reply(`🚀 Reacting with ${Object.keys(global.activeSockets||{}).length} users -> ${emoji}`);
        const r = await reactWithAllUsers(from, last.key, emoji);
        return reply(`✅ DONE! 🎀\n\n❤️ Emoji: ${emoji}\n👥 Reacted: ${r.reacted}/${r.totalUsers}\n📢 Channel: ${from}`);
    }
    if (sub === 'bomb') {
        // MASS REACT BOMB! 🔥
        const emoji = args[1] || '❤️';
        const last = global._lastChannelPosts?.get(from);
        if (!last) return reply('❌ No post!');
        reply(`💣 REACT BOMB START! ${Object.keys(global.activeSockets||{}).length} users x 3 times! 🚀`);
        for (let i=0;i<3;i++) {
            await reactWithAllUsers(from, last.key, emoji);
            await new Promise(r=>setTimeout(r,1500));
        }
        return reply(`💣 BOMB DONE! ${Object.keys(global.activeSockets||{}).length * 3} reacts! 🔥❤️`);
    }
    if (sub === 'stats') {
        const logs = await ReactLog.find().sort({ createdAt: -1 }).limit(5);
        let txt = `❤️ *React Stats*\n\n👥 Active Users: ${Object.keys(global.activeSockets||{}).length}\n⚙️ Auto: ${cfg.enabled?'ON ✅':'OFF ❌'}\n\n*Last 5:*\n`;
        logs.forEach(l=> txt+=`• ${l.channelJid.slice(0,15)}... - ${l.reactedCount} reacts ${l.emoji}\n`);
        return reply(txt);
    }

    return reply(
`╭─〔 ❤️ *YUMI MULTI-USER REACT* 🎀 〕─
│
│ 🔥 *Bot Users ලා Channel වලට React දානවා!*
│
│ • .creact on - Enable auto react ✅
│ • .creact off - Disable ❌
│ • .creact emoji ❤️ 🔥 🎀 - Emojis set
│ • .creact random - Random emoji ON/OFF 🎲
│
│ • .creact add - මේ channel එක add
│ • .creact add 1203...@newsletter - වෙන එක add
│ • .creact list - list බලන්න
│ • .creact remove - අයින් කරන්න
│
│ • .creact react ❤️ - මේ channel එකේ last post එකට
│   users ලා ඔක්කොමගෙන් react!
│ • .creact bomb ❤️🔥 - REACT BOMB! 💣 (3x)
│
│ • .creact stats - stats බලන්න
│
│ 👥 Active Users: ${Object.keys(global.activeSockets||{}).length}
│ ❤️ Emojis: ${cfg.emojis.join(' ')}
│ Status: ${cfg.enabled?'ON ✅':'OFF ❌'} | Random: ${cfg.randomEmoji?'ON 🎲':'OFF'}
╰─────────────────╯`
    );
});

if (!global._lastChannelPosts) global._lastChannelPosts = new Map();

async function attachReactHook() {
    if (!global.activeSockets) return;
    for (const sid in global.activeSockets) {
        const sock = global.activeSockets[sid];
        if (!sock || sock._yumiReactHooked) continue;
        sock._yumiReactHooked = true;
        sock.ev.on('messages.upsert', async (ev) => {
            try {
                const msg = ev.messages?.[0];
                if (!msg) return;
                const from = msg.key.remoteJid;
                if (!from?.endsWith('@newsletter')) return;
                global._lastChannelPosts.set(from, { key: msg.key, at: Date.now() });
                await autoReactDetector(sock, msg, from);
            } catch(e){}
        });
        console.log('❤️ React Hook Attached:', sid);
    }
}
setInterval(attachReactHook, 5000);

module.exports = { reactWithAllUsers, autoReactDetector, attachReactHook, getReactConfig };
console.log('❤️ YUMI Multi-User Channel React Loaded ✅ - Users will react together! 🎀');