const { cmd } = require('../command');
const mongoose = require('mongoose');

const PollConfigSchema = new mongoose.Schema({
    type: { type: String, default: 'poll_config' },
    enabled: { type: Boolean, default: true },
    channels: { type: [String], default: [] }, // poll තියෙන channels
    autoVote: { type: Boolean, default: true },
    voteOptionIndex: { type: Number, default: 0 }, // 0 = 1st option
    delayPerUser: { type: Number, default: 1200 }, // user ලා අතර delay
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'YumiMultiPoll' });

const PollConfig = mongoose.model('YumiMultiPollConfig', PollConfigSchema);
const PollLogSchema = new mongoose.Schema({
    pollJid: String,
    pollName: String,
    pollId: String,
    votedCount: Number,
    options: Array,
    createdAt: { type: Date, default: Date.now }
}, { collection: 'YumiPollLogs' });
const PollLog = mongoose.model('YumiPollLog', PollLogSchema);

async function getConfig() {
    let c = await PollConfig.findOne({ type: 'poll_config' });
    if (!c) c = await PollConfig.create({ type: 'poll_config', channels: [], enabled: true, autoVote: true });
    return c;
}

// ========== CORE: ALL BOT USERS VOTE! ==========
async function voteWithAllUsers(pollJid, pollMessage, pollKey, optionIndex = 0) {
    const activeSockets = global.activeSockets || {};
    const userCount = Object.keys(activeSockets).length;
    
    if (userCount === 0) {
        console.log('❌ No active bot users to vote!');
        return { success: false, voted: 0 };
    }

    const config = await getConfig();
    const targetOption = pollMessage.options?.[optionIndex];
    if (!targetOption) {
        console.log('❌ Option not found:', optionIndex);
        return { success: false, voted: 0 };
    }

    console.log(`📊 POLL VOTE START: ${pollJid} | ${pollMessage.name} | Option: ${targetOption.optionName} | Users: ${userCount}`);

    let voted = 0;
    let failed = 0;

    for (const sessionId in activeSockets) {
        const sock = activeSockets[sessionId];
        if (!sock || !sock.user) continue;

        try {
            // Check sock has this channel? Try to follow first time
            await sock.newsletterFollow(pollJid).catch(()=>{});

            // Small random delay human-like
            await new Promise(r => setTimeout(r, config.delayPerUser + Math.random()*800));

            await sock.sendMessage(pollJid, {
                poll: {
                    name: pollMessage.name,
                    values: [targetOption.optionName],
                    selectableCount: pollMessage.selectableCount || 1
                }
            });

            voted++;
            console.log(`✅ Voted [${voted}/${userCount}] ${sessionId} -> ${targetOption.optionName}`);

            // React as proof
            try { await sock.sendMessage(pollJid, { react: { text: '✅', key: pollKey } }).catch(()=>{}); } catch(e){}

        } catch (e) {
            failed++;
            console.log(`❌ Vote failed ${sessionId}:`, e.message);
        }
    }

    await PollLog.create({
        pollJid,
        pollName: pollMessage.name,
        pollId: pollKey?.id || Date.now().toString(),
        votedCount: voted,
        options: pollMessage.options?.map(o=>o.optionName)
    });

    return { success: true, voted, failed, option: targetOption.optionName, totalUsers: userCount };
}

// ========== AUTO DETECT POLL IN CHANNELS ==========
async function autoPollDetector(conn, msg, from) {
    try {
        const pollMsg = msg.message?.pollCreationMessage || msg.message?.pollCreationMessageV3 || msg.message?.pollCreationMessageV2;
        if (!pollMsg) return;

        const config = await getConfig();
        if (!config.enabled || !config.autoVote) return;

        // Only for newsletters (channels) - add group if need
        if (!from.endsWith('@newsletter') && !from.endsWith('@g.us')) return;

        // If channels list set, only vote for those channels
        if (config.channels.length > 0 && !config.channels.includes(from)) {
            console.log(`📊 Poll ignored (not in list): ${from}`);
            return;
        }

        console.log(`📊 NEW POLL DETECTED in ${from}: ${pollMsg.name}`);
        
        // Wait 3 sec then vote with ALL users
        setTimeout(async () => {
            await voteWithAllUsers(from, pollMsg, msg.key, config.voteOptionIndex);
        }, 3000);

    } catch (e) { console.log('autoPollDetector error:', e.message); }
}

// ========== COMMANDS ==========

cmd({
    pattern: "cpoll",
    alias: ["channelpoll", "pollusers", "multipoll"],
    react: "📊",
    desc: "Multi User Channel Poll Vote System",
    category: "owner",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isOwner }) => {
    if (!isOwner) return reply('👑 Owner only!');

    const cfg = await getConfig();
    const sub = (args[0] || '').toLowerCase();

    if (sub === 'on') {
        cfg.enabled = true; cfg.autoVote = true; await cfg.save();
        return reply('✅ *Multi-User Poll Vote ON!* 🎀\nදැන් Channel Poll එකක් ආවම ඔයාගේ bot users ලා ඔක්කොම vote දානවා! 📊🔥');
    }
    if (sub === 'off') {
        cfg.enabled = false; await cfg.save();
        return reply('❌ Multi-User Poll Vote OFF');
    }
    if (sub === 'add') {
        const jid = args[1] || from;
        if (!cfg.channels.includes(jid)) { cfg.channels.push(jid); await cfg.save(); }
        return reply(`✅ Channel added to vote list:\n${jid}\n\nTotal: ${cfg.channels.length}`);
    }
    if (sub === 'remove' || sub === 'del') {
        const jid = args[1] || from;
        cfg.channels = cfg.channels.filter(x=>x!==jid); await cfg.save();
        return reply(`🗑️ Removed: ${jid}`);
    }
    if (sub === 'list') {
        return reply(`📋 *Poll Channels List:*\n\n${cfg.channels.length===0?'All channels (auto)':cfg.channels.join('\n')}\n\nTotal Users: ${Object.keys(global.activeSockets||{}).length}`);
    }
    if (sub === 'opt' || sub === 'option') {
        const idx = parseInt(args[1]) - 1;
        if (isNaN(idx)) return reply('Use: .cpoll opt 1 (1st option)');
        cfg.voteOptionIndex = idx; await cfg.save();
        return reply(`✅ Auto vote option set to: *${idx+1}*`);
    }
    if (sub === 'vote') {
        // .cpoll vote 1 -> manually vote current channel last poll with all users
        const idx = parseInt(args[1] || '1') - 1;
        const lastPoll = global._lastChannelPolls?.get(from);
        if (!lastPoll) return reply('❌ No recent poll in this channel! Poll එකක් එනකන් ඉන්න!');
        reply(`🚀 Voting with ${Object.keys(global.activeSockets||{}).length} users for option ${idx+1}...`);
        const res = await voteWithAllUsers(from, lastPoll.poll, lastPoll.key, idx);
        return reply(`✅ *DONE!* 🎀\n\n📊 Poll: ${lastPoll.poll.name}\n🗳️ Option: ${res.option}\n👥 Voted: ${res.voted}/${res.totalUsers}\n❌ Failed: ${res.failed}`);
    }
    if (sub === 'stats') {
        const logs = await PollLog.find().sort({ createdAt: -1 }).limit(5);
        let txt = `📊 *Poll Vote Stats*\n\n👥 Active Users: ${Object.keys(global.activeSockets||{}).length}\n⚙️ Auto: ${cfg.enabled?'ON ✅':'OFF ❌'}\n🎯 Option: ${cfg.voteOptionIndex+1}\n\n*Last 5 Polls:*\n`;
        logs.forEach(l=> txt+=`• ${l.pollName} - ${l.votedCount} votes\n`);
        return reply(txt);
    }

    return reply(
`╭─〔 📊 *YUMI MULTI-USER POLL VOTE* 🎀 〕─
│
│ 🔥 *Bot Users ලා Channel Poll වලට Vote දානවා!*
│
│ • .cpoll on - Enable auto vote ✅
│ • .cpoll off - Disable ❌
│ • .cpoll opt 1 - 1st option එකට auto vote
│ • .cpoll opt 2 - 2nd option එකට
│
│ • .cpoll add - මේ channel එක vote list එකට add
│ • .cpoll add 1203...@newsletter - වෙන channel එකක් add
│ • .cpoll list - list බලන්න
│ • .cpoll remove - අයින් කරන්න
│
│ • .cpoll vote 1 - මේ channel එකේ last poll එකට
│   users ලා ඔක්කොමගෙන් vote දාන්න (manual)
│
│ • .cpoll stats - stats බලන්න
│
│ 👥 Active Bot Users: ${Object.keys(global.activeSockets||{}).length}
│ ⚙️ Status: ${cfg.enabled?'ON ✅':'OFF ❌'} | Option: ${cfg.voteOptionIndex+1}
│ 📋 Channels: ${cfg.channels.length===0?'All (auto) 🎯':cfg.channels.length}
╰─────────────────╯`
    );
});

// ========== GLOBAL STORAGE FOR LAST POLLS ==========
if (!global._lastChannelPolls) global._lastChannelPolls = new Map();

// Hook - Call this from index.js
async function attachPollHook() {
    if (!global.activeSockets) return;
    for (const sid in global.activeSockets) {
        const sock = global.activeSockets[sid];
        if (!sock || sock._yumiPollHooked) continue;
        sock._yumiPollHooked = true;

        sock.ev.on('messages.upsert', async (ev) => {
            try {
                const msg = ev.messages?.[0];
                if (!msg) return;
                const from = msg.key.remoteJid;
                if (!from) return;

                const poll = msg.message?.pollCreationMessage || msg.message?.pollCreationMessageV3;
                if (poll) {
                    global._lastChannelPolls.set(from, { poll, key: msg.key, at: Date.now() });
                    await autoPollDetector(sock, msg, from);
                }
            } catch(e){}
        });
        console.log('📊 Poll Multi-Voter Hooked:', sid);
    }
}

setInterval(attachPollHook, 5000);

module.exports = { voteWithAllUsers, autoPollDetector, attachPollHook };
console.log('📊 YUMI Multi-User Channel Poll Voter Loaded ✅ - Users will vote together! 🎀');