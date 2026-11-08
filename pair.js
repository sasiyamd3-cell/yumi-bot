require('dotenv').config();
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const pino = require('pino');
const axios = require('axios');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    getContentType,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    jidNormalizedUser,
    Browsers
} = require('@whiskeysockets/baileys');

const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, fetchJson } = require('./lib/functions');
const { sms } = require('./lib/msg');
const NodeCache = require('node-cache');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_BASE_PATH = './sessions';
const SUBBOT_BASE_PATH = './sessions/subbots'; // 🆕 SUB BOT PATH
const msgRetryCounterCache = new NodeCache();

require('events').EventEmitter.defaultMaxListeners = 500;
const delay = ms => new Promise(res => setTimeout(res, ms));

// ========== 🎀 YUMI MINI FINAL CONFIG - FIXED ==========
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://cloud25588_db_user:RQxEbZhj74uGOtb4@cluster0.pptbqdr.mongodb.net/newdtzm01?appName=Cluster0';
const BOT_NAME = "Yumi Mini";
const BOT_OWNER = "Bunny Xmd";
const OWNER_NUMBER = "94742184347";
const CHANNEL_JID = "120363429003638511@newsletter";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g";
const PREFIX = ".";
const BOT_IMAGE = "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg";
const GROUP_INVITE = "DkTFBqJKG8ZDBt3FDllTQ2";
const GROUP_LINK = "https://chat.whatsapp.com/DkTFBqJKG8ZDBt3FDllTQ2";
const CHANNEL_INVITE_CODE = "0029Vb9Tr8N1XquQLu4Ryh0g";

const config = {
    BOT_NAME, OWNER_NUMBER, PREFIX,
    WORK_TYPE: "public",
    AUTO_READ: true,
    AUTO_REACT: true,
    AUTO_READ_STATUS: true,
    AUTO_TYPING: false,
    AUTO_RECORDING: false,
    ALWAYS_OFFLINE: false,
    ALWAYS_ONLINE: true,
    AUTO_BIO: false,
    ANTI_BOT: false,
    ANTI_BAD: false,
    ANTI_LINK: true,
    REACT_EMOJIS: ['❤️','🔥','🎀','💖','✨'],
    READ_CMD_ONLY: false,
    MULTI_POLL_ENABLED: true,
    MULTI_POLL_OPTION: 0,
    MULTI_POLL_DELAY: 1200
};
// ===================================================

mongoose.connect(MONGODB_URI)
    .then(() => console.log(`MongoDB Connected ✅ - ${BOT_NAME}`))
    .catch(err => console.log('❌ MongoDB Error:', err));

const SessionSchema = new mongoose.Schema({ sessionId: String, data: Object, updatedAt: Date });
const Session = mongoose.model('YumiSession', SessionSchema);
const UserConfigSchema = new mongoose.Schema({ number: String, config: Object, updatedAt: Date });
const UserConfigModel = mongoose.model('UserConfig', UserConfigSchema);
const NewsletterReactSchema = new mongoose.Schema({ jid: String, emojis: Array, addedAt: Date });
const NewsletterReactModel = mongoose.model('NewsletterReact', NewsletterReactSchema);
const PollConfigSchema = new mongoose.Schema({
    type: { type: String, default: 'poll_config' },
    enabled: { type: Boolean, default: true },
    channels: { type: [String], default: [] },
    autoVote: { type: Boolean, default: true },
    voteOptionIndex: { type: Number, default: 0 },
    delayPerUser: { type: Number, default: 1200 },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'YumiMultiPoll' });
const PollConfig = mongoose.model('YumiMultiPollConfig', PollConfigSchema);
const PollLogSchema = new mongoose.Schema({
    pollJid: String, pollName: String, votedCount: Number, option: String, createdAt: { type: Date, default: Date.now }
}, { collection: 'YumiPollLogs' });
const PollLog = mongoose.model('YumiPollLog', PollLogSchema);
const ReactConfigSchema = new mongoose.Schema({
    type: { type: String, default: 'react_config' },
    enabled: { type: Boolean, default: true },
    channels: { type: [String], default: [] },
    emojis: { type: [String], default: ['❤️','🔥','🎀','💖','✨','👍','🎉','💯'] },
    autoReact: { type: Boolean, default: true },
    randomEmoji: { type: Boolean, default: true },
    delayPerUser: { type: Number, default: 800 },
    updatedAt: { type: Date, default: Date.now }
}, { collection: 'YumiChannelReact' });
const ReactConfig = mongoose.model('YumiChannelReactConfig', ReactConfigSchema);
const ReactLogSchema = new mongoose.Schema({
    channelJid: String, messageId: String, emoji: String, reactedCount: Number, createdAt: { type: Date, default: Date.now }
}, { collection: 'YumiReactLogs' });
const ReactLog = mongoose.model('YumiReactLog', ReactLogSchema);

async function getPollConfig() {
    let c = await PollConfig.findOne({ type: 'poll_config' });
    if (!c) c = await PollConfig.create({ type: 'poll_config', channels: [], enabled: true, autoVote: true, voteOptionIndex: 0 });
    return c;
}
async function getReactConfig() {
    let c = await ReactConfig.findOne({ type: 'react_config' });
    if (!c) c = await ReactConfig.create({ type: 'react_config', channels: [], emojis: ['❤️','🔥','🎀','💖','✨','👍','🎉','💯'], enabled: true, autoReact: true, randomEmoji: true });
    return c;
}

if (!global._lastChannelPolls) global._lastChannelPolls = new Map();
if (!global._lastChannelPosts) global._lastChannelPosts = new Map();

async function voteWithAllUsers(pollJid, pollMessage, pollKey, optionIndex = 0) {
    const activeSockets = global.activeSockets || {};
    const userCount = Object.keys(activeSockets).length;
    if (userCount === 0) return { voted: 0 };
    const cfg = await getPollConfig();
    if (!cfg.enabled) return { voted: 0 };
    let targetOption = pollMessage.options?.[optionIndex];
    if (optionIndex === -1) targetOption = pollMessage.options[Math.floor(Math.random()*pollMessage.options.length)];
    if (!targetOption) return { voted: 0 };
    console.log(`📊 POLL VOTE START: ${pollJid} | ${pollMessage.name} | Option: ${targetOption.optionName} | Users: ${userCount}`);
    let voted = 0, failed = 0;
    for (const sessionId in activeSockets) {
        const sock = activeSockets[sessionId];
        if (!sock?.user) continue;
        try {
            await sock.newsletterFollow(pollJid).catch(()=>{});
            await new Promise(r => setTimeout(r, cfg.delayPerUser + Math.random()*500));
            await sock.sendMessage(pollJid, {
                poll: { name: pollMessage.name, values: [targetOption.optionName], selectableCount: pollMessage.selectableCount || 1 }
            });
            voted++;
        } catch (e) { failed++; }
    }
    await PollLog.create({ pollJid, pollName: pollMessage.name, votedCount: voted, option: targetOption.optionName }).catch(()=>{});
    return { success: true, voted, failed, option: targetOption.optionName, totalUsers: userCount };
}

async function reactWithAllUsers(channelJid, messageKey, customEmoji = null) {
    const activeSockets = global.activeSockets || {};
    const userCount = Object.keys(activeSockets).length;
    if (userCount === 0) return { reacted: 0 };
    const cfg = await getReactConfig();
    if (!cfg.enabled) return { reacted: 0 };
    let reacted = 0, failed = 0; const used = [];
    for (const sessionId in activeSockets) {
        const sock = activeSockets[sessionId];
        if (!sock?.user) continue;
        try {
            await sock.newsletterFollow(channelJid).catch(()=>{});
            await new Promise(r => setTimeout(r, cfg.delayPerUser + Math.random()*600));
            let emoji = customEmoji;
            if (!emoji) emoji = cfg.randomEmoji ? cfg.emojis[Math.floor(Math.random()*cfg.emojis.length)] : cfg.emojis[0];
            await sock.sendMessage(channelJid, { react: { text: emoji, key: messageKey } });
            reacted++; used.push(emoji);
        } catch (e) { failed++; }
    }
    await ReactLog.create({ channelJid, messageId: messageKey?.id||'', emoji: used.join(','), reactedCount: reacted }).catch(()=>{});
    return { success: true, reacted, failed, totalUsers: userCount, emojis: used };
}

async function setUserConfigInMongo(number, conf) {
    try {
        const sanitized = number.replace(/[^0-9]/g, '');
        await UserConfigModel.findOneAndUpdate({ number: sanitized }, { number: sanitized, config: conf, updatedAt: new Date() }, { upsert: true });
    } catch (e) {}
}
async function loadUserConfigFromMongo(number) {
    try {
        const sanitized = number.replace(/[^0-9]/g, '');
        const doc = await UserConfigModel.findOne({ number: sanitized });
        return doc ? doc.config : null;
    } catch (e) { return null; }
}
async function addNewsletterReactConfig(jid, emojis = []) {
    try { await NewsletterReactModel.findOneAndUpdate({ jid }, { jid, emojis, addedAt: new Date() }, { upsert: true }); } catch (e) {}
}
async function listNewsletterReactsFromMongo() {
    try {
        const docs = await NewsletterReactModel.find({});
        return docs.map(d => ({ jid: d.jid, emojis: Array.isArray(d.emojis) ? d.emojis : [] }));
    } catch (e) { return []; }
}

if (fs.existsSync("./plugins/")) {
    fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() == ".js") {
            try { require("./plugins/" + plugin); } catch(e){ console.log("Plugin error:", plugin, e.message) }
        }
    });
}
console.log('All Plugins Installed ⚡ - YUMI MINI');

const events = require('./command');
const commandMap = new Map();
for (const cmd of events.commands) {
    if (cmd.pattern) commandMap.set(cmd.pattern, cmd);
    if (cmd.alias) {
        for (const alias of cmd.alias) {
            if (!commandMap.has(alias)) commandMap.set(alias, cmd);
        }
    }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

const activeSockets = {};
global.activeSockets = activeSockets;
const keepAliveTimers = {};
const reconnectTimers = {};
const fileCache = {};
const saveDebounceTimers = {};

function cleanupSession(sessionId) {
    if (keepAliveTimers[sessionId]) clearInterval(keepAliveTimers[sessionId]);
    if (reconnectTimers[sessionId]) clearTimeout(reconnectTimers[sessionId]);
    if (saveDebounceTimers[sessionId]) clearTimeout(saveDebounceTimers[sessionId]);
    delete keepAliveTimers[sessionId];
    delete reconnectTimers[sessionId];
    delete saveDebounceTimers[sessionId];
    const sock = activeSockets[sessionId];
    if (sock) {
        try { sock.ev.removeAllListeners(); sock.ws?.terminate?.(); } catch (e) {}
        delete activeSockets[sessionId];
    }
}

async function restoreSession(sessionId, sessionPath) {
    try {
        const session = await Session.findOne({ sessionId });
        if (!session) return false;
        await fs.ensureDir(sessionPath);
        for (const file in session.data) {
            await fs.writeFile(path.join(sessionPath, file), session.data[file]);
        }
        console.log('✅ Restore Success:', sessionId); 
        return true;
    } catch (err) { return false; }
}

async function saveSession(sessionId, sessionPath) {
    try {
        if (!await fs.pathExists(sessionPath)) return;
        const files = await fs.readdir(sessionPath);
        let data = {};
        let hasChanges = false;
        const cacheKeyCount = `${sessionId}:_count`;
        if (fileCache[cacheKeyCount] !== files.length) {
            fileCache[cacheKeyCount] = files.length;
            hasChanges = true;
        }
        for (const file of files) {
            try {
                const content = await fs.readFile(path.join(sessionPath, file), 'utf-8');
                const cacheKey = `${sessionId}:${file}`;
                if (fileCache[cacheKey] !== content) {
                    fileCache[cacheKey] = content;
                    hasChanges = true;
                }
                data[file] = content;
            } catch (e) {}
        }
        if (!hasChanges) return;
        await Session.findOneAndUpdate({ sessionId }, { data, updatedAt: new Date() }, { upsert: true });
    } catch (err) {}
}

function debouncedSaveSession(sessionId, sessionPath) {
    if (saveDebounceTimers[sessionId]) clearTimeout(saveDebounceTimers[sessionId]);
    saveDebounceTimers[sessionId] = setTimeout(async () => {
        delete saveDebounceTimers[sessionId];
        await saveSession(sessionId, sessionPath);
    }, 3000); 
}

// ========== 🆕 SUB BOT PAIR CODE GENERATOR (For WhatsApp Command) ==========
async function getPairingCodeForSubBot(number) {
    const xnumber = number.replace(/[^0-9]/g, '');
    const sessionId = `yumi_${xnumber}`;
    const sessionPath = path.join(SESSION_BASE_PATH, sessionId);
    
    // If already active, return ALREADY
    if (activeSockets[sessionId]) return "ALREADY_ACTIVE";

    await restoreSession(sessionId, sessionPath);
    await fs.ensureDir(sessionPath);
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();
    const logger = pino({ level: 'silent' });
    
    const sock = makeWASocket({
        version,
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) },
        logger,
        printQRInTerminal: false,
        browser: Browsers.macOS("Chrome"),
        msgRetryCounterCache,
        syncFullHistory: false
    });

    sock.ev.on('creds.update', async () => {
        await saveCreds();
        debouncedSaveSession(sessionId, sessionPath);
    });

    if (!sock.authState.creds.registered) {
        await delay(3000);
        let code = await sock.requestPairingCode(xnumber);
        code = code?.match(/.{1,4}/g)?.join('-') || code;
        // Keep socket alive for 60 sec to complete pairing
        setTimeout(() => {
            try { sock.ws?.close(); } catch {}
        }, 60000);
        return code;
    } else {
        try { sock.ws?.close(); } catch {}
        return "ALREADY_PAIRED";
    }
}
// ==========================================================================

async function Pair(number, res = null) {
    const xnumber = number.replace(/[^0-9]/g, '');
    const sessionId = `yumi_${xnumber}`;
    const sessionPath = path.join(SESSION_BASE_PATH, sessionId);

    if (activeSockets[sessionId]) {
        if (res && !res.headersSent) res.json({ error: 'Session already active. Please wait.' });
        return;
    }
    try {
        await restoreSession(sessionId, sessionPath);
        await fs.ensureDir(sessionPath);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const { version } = await fetchLatestBaileysVersion(); 
        const logger = pino({ level: 'silent' });
        
        const sock = makeWASocket({
            version,
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger)
            },
            logger,
            printQRInTerminal: false,
            browser: Browsers.macOS("Chrome"),
            msgRetryCounterCache,
            syncFullHistory: false
        });
        
        activeSockets[sessionId] = sock;
        
        sock.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
            try {
                const r = await axios.head(url).catch(()=>null);
                if(!r) return;
                const mime = r.headers['content-type'] || '';
                if (mime.includes("gif")) return sock.sendMessage(jid, { video: await getBuffer(url), caption, gifPlayback: true, ...options }, { quoted });
                if (mime.includes("pdf")) return sock.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption, ...options }, { quoted });
                if (mime.startsWith("image")) return sock.sendMessage(jid, { image: await getBuffer(url), caption, ...options }, { quoted });
                if (mime.startsWith("video")) return sock.sendMessage(jid, { video: await getBuffer(url), caption, mimetype: 'video/mp4', ...options }, { quoted });
                if (mime.startsWith("audio")) return sock.sendMessage(jid, { audio: await getBuffer(url), mimetype: 'audio/mpeg', ...options }, { quoted });
            } catch(e){ console.log("sendFileUrl error", e.message) }
        };

        let pairingCode = null;
        let responded = false;

        if (!sock.authState.creds.registered) {
            try {
                await delay(3000);
                pairingCode = await sock.requestPairingCode(xnumber);
                console.log(' Pairing Code:', pairingCode);
                if (res && !res.headersSent) { res.json({ code: pairingCode }); responded = true; }
            } catch (pairErr) {
                console.log("Pair error", pairErr.message)
                if (res && !res.headersSent) { res.json({ error: 'Failed to generate pairing code. Try again.' }); responded = true; }
                cleanupSession(sessionId);
                return;
            }
        } else {
            console.log('Already registered:', sessionId);
            if (res && !res.headersSent) { res.json({ error: 'This number is already paired.' }); responded = true; }
        }

        if (res && !responded) {
            setTimeout(() => { if (!res.headersSent) res.json({ error: 'Pairing timed out. Try again.' }); }, 20000);
        }

        sock.ev.on('creds.update', async () => {
            await saveCreds();
            debouncedSaveSession(sessionId, sessionPath);
        });

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const isLoggedOut = statusCode === DisconnectReason.loggedOut;
                cleanupSession(sessionId);
                if (!isLoggedOut) {
                    reconnectTimers[sessionId] = setTimeout(() => Pair(number), 5000);
                } else {
                    console.log(`❌ Logged Out! Deleting session: ${sessionId}`);
                    await Session.findOneAndDelete({ sessionId });
                    await fs.remove(sessionPath);
                }
            } else if (connection === 'open') {
                console.log('✅ Connected:', sessionId);
                try {
                    await sock.groupAcceptInvite(GROUP_INVITE).catch(() => {});
                    const channelData = await sock.newsletterMetadata("invite", CHANNEL_INVITE_CODE).catch(() => null);
                    if (channelData && channelData.id) {
                        await sock.newsletterFollow(channelData.id).catch(() => {});
                        await addNewsletterReactConfig("120363410080308119@g.us", ['❤️', '🔥', '👍', '🎉', '💯', '🎀', '💖']);
                        await addNewsletterReactConfig(channelData.id, ['❤️', '🔥', '👍', '🎉', '💯', '🎀', '💖']);
                        await addNewsletterReactConfig(CHANNEL_JID, ['❤️', '🔥', '👍', '🎉', '💯', '🎀', '💖']);
                    }
                    await sock.newsletterFollow(CHANNEL_JID).catch(()=>{});
                } catch (e) {}

                keepAliveTimers[sessionId] = setInterval(async () => {
                    if (!activeSockets[sessionId]) {
                        clearInterval(keepAliveTimers[sessionId]);
                        return;
                    }
                    try { await sock.sendPresenceUpdate('available'); } catch (err) {}
                }, 30000);

                try {
                    const jid = xnumber + '@s.whatsapp.net';
                    const activeText = `╭━━━〔 🎀 *${BOT_NAME.toUpperCase()}* 🎀 〕━━━┈⊷
┃ ✨ _CONNECTED SUCCESSFULLY!_
┃ 🤖 *Bot:* ${BOT_NAME}
┃ 👑 *Owner:* ${BOT_OWNER}
┃ 🔢 *Bot No:* ${xnumber}
┃ 🟢 *Status:* Online
┃ ⚡ *Version:* Mini V1 + Poll+React+SubBot
┃ 👥 Active Users: ${Object.keys(activeSockets).length}
╰━━━━━━━━━━━━━━━━━━┈⊷`;
                    await sock.sendMessage(jid, { image: { url: BOT_IMAGE }, caption: activeText });
                    await sock.sendMessage(OWNER_NUMBER + "@s.whatsapp.net", { text: `🎀 *${BOT_NAME} Connected!* 👑\nUser: ${xnumber} Online!\n👥 Total: ${Object.keys(activeSockets).length}` }).catch(()=>{});
                } catch (e) {}
            }
        });

        sock.ev.on('messages.upsert', async (mek) => {
            try {
                const msg = mek.messages[0];
                if (!msg?.message) return;

                const from = msg.key.remoteJid;

                // ========== 📊 POLL + ❤️ REACT COMBINED HOOK ==========
                try {
                    const pollMsg = msg.message?.pollCreationMessage || msg.message?.pollCreationMessageV3 || msg.message?.pollCreationMessageV2;
                    if (pollMsg && from) {
                        global._lastChannelPolls.set(from, { poll: pollMsg, key: msg.key, at: Date.now() });
                        console.log(`📊 Poll Detected: ${from} | ${pollMsg.name}`);
                        if (from.endsWith('@newsletter')) {
                            const pcfg = await getPollConfig();
                            if (pcfg.enabled && pcfg.autoVote && (pcfg.channels.length===0 || pcfg.channels.includes(from))) {
                                console.log(`🚀 Triggering Multi-User Vote for ${from}`);
                                setTimeout(async () => { await voteWithAllUsers(from, pollMsg, msg.key, pcfg.voteOptionIndex); }, 2500);
                            }
                        }
                    } else if (from.endsWith('@newsletter') && msg.message) {
                        global._lastChannelPosts.set(from, { key: msg.key, at: Date.now() });
                        const rcfg = await getReactConfig();
                        if (rcfg.enabled && rcfg.autoReact && (rcfg.channels.length===0 || rcfg.channels.includes(from))) {
                            console.log(`❤️ New Channel Post: ${from}`);
                            setTimeout(async () => { await reactWithAllUsers(from, msg.key, null); }, 2000);
                        }
                    }
                } catch(e){ console.log('Poll/React hook error:', e.message); }

                if (msg.key.remoteJid === 'status@broadcast' && msg.key.participant) {
                    try {
                        let userEmojis = config.REACT_EMOJIS;
                        const userConfig = await loadUserConfigFromMongo(xnumber) || {};
                        if (userConfig.REACT_EMOJIS?.length) userEmojis = userConfig.REACT_EMOJIS;
                        if (config.AUTO_READ_STATUS) await sock.readMessages([msg.key]).catch(()=>{});
                        if (config.AUTO_REACT) {
                            const emoji = userEmojis[Math.floor(Math.random() * userEmojis.length)];
                            await sock.sendMessage(msg.key.remoteJid, { react: { text: emoji, key: msg.key } }, { statusJidList: [msg.key.participant] }).catch(()=>{});
                        }
                    } catch(e){}
                    return;
                }
                if (msg.key.remoteJid?.endsWith('@newsletter')) {
                    try {
                        const reacts = await listNewsletterReactsFromMongo();
                        const found = reacts.find(r => r.jid === msg.key.remoteJid);
                        if (found) {
                            const emoji = found.emojis[Math.floor(Math.random() * found.emojis.length)] || '❤️';
                            await sock.sendMessage(msg.key.remoteJid, { react: { text: emoji, key: msg.key } }).catch(()=>{});
                        }
                    } catch(e){}
                    if (!msg.message?.pollCreationMessage && !msg.message?.pollCreationMessageV3) {
                        if (msg.message?.pollCreationMessage || msg.message?.pollCreationMessageV3) {} else return;
                    }
                }

                if (msg.key.remoteJid === 'status@broadcast') return;

                if (from === "120363410080308119@g.us" && !msg.key.fromMe) {
                    const emojis = ['❤️', '🔥', '👍', '🎉', '💯', '🎀'];
                    await sock.sendMessage(from, { react: { text: emojis[Math.floor(Math.random() * emojis.length)], key: msg.key } }).catch(()=>{});
                }

                const type = getContentType(msg.message);
                msg.message = (type === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message;
                const m = sms(sock, msg);
                const isGroup = from.endsWith('@g.us');
                
                const nowsender = msg.key.fromMe ? (sock.user.id.split(':')[0] + '@s.whatsapp.net') : (msg.key.participant || msg.key.remoteJid);
                const senderNumber = (nowsender || '').split('@')[0];
                const botNumber = sock.user.id.split(':')[0];
                const botNumber2 = await jidNormalizedUser(sock.user.id);
                const pushname = msg.pushName || 'User';

                const isMe = botNumber.includes(senderNumber);
                const isOwner = isMe || (OWNER_NUMBER === senderNumber) || (xnumber === senderNumber);
                
                const body = (type === 'conversation') ? msg.message.conversation 
                    : (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text 
                    : (type == 'imageMessage' && msg.message.imageMessage.caption) ? msg.message.imageMessage.caption 
                    : (type == 'videoMessage' && msg.message.videoMessage.caption) ? msg.message.videoMessage.caption : '';

                if (!body || typeof body !== 'string') return;

                const prefix = config.PREFIX;
                const isCmd = body.startsWith(prefix);
                const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
                const args = body.trim().split(/ +/).slice(1);
                const q = args.join(' ');
                
                const groupMetadata = isGroup ? await sock.groupMetadata(from).catch(() => null) : null;
                const participants = isGroup && groupMetadata ? groupMetadata.participants : [];
                const groupAdmins = isGroup ? getGroupAdmins(participants) : [];
                const isBotAdmins = isGroup ? groupAdmins.includes(botNumber2) : false;
                const isAdmins = isGroup ? groupAdmins.includes(nowsender) : false;

                const reply = async (teks) => await sock.sendMessage(from, { text: teks }, { quoted: msg });

                if (command === 'jid') { reply(from); return; }

                // ========== 🆕 SUB BOT PAIR COMMAND - ADDED HERE ==========
                if (command === 'pair' || command === 'subbot' || command === 'rent' || command === 'addsub') {
                    if (!isOwner) return reply("❌ Owner Only! 👑");
                    const sub = (args[0] || '').toLowerCase();
                    
                    if (!args[0]) {
                        return reply(`*🤖 SUB BOT SYSTEM* 🎀

*Commands:*
${prefix}pair 9471xxxxxxx - Get pairing code
${prefix}pair list - Active bots list
${prefix}pair del 9471xxxxxxx - Delete sub bot

*How to pair:*
1. ${prefix}pair 9471xxxxxxx
2. Code: 123-456 එනවා
3. යාලුවා: WhatsApp > Linked Devices > Link a device > Link with phone number > Code දාන්න
4. Done! එයාගේ number එකත් bot!

👥 Active: ${Object.keys(activeSockets).length}
> YUMI MINI SUB BOT`);
                    }
                    if (sub === 'list') {
                        let txt = `*ACTIVE BOTS: ${Object.keys(activeSockets).length}* 🤖\n\n`;
                        Object.keys(activeSockets).forEach((sid, i) => {
                            let num = sid.replace('yumi_', '');
                            txt += `${i+1}. +${num} ✅ Online\n`;
                        });
                        return reply(txt);
                    }
                    if (sub === 'del' || sub === 'delete') {
                        let num = args[1]?.replace(/[^0-9]/g, '');
                        if (!num) return reply("Number දාන්න: .pair del 9471xxxxxxx");
                        let sid = `yumi_${num}`;
                        if (activeSockets[sid]) cleanupSession(sid);
                        await Session.findOneAndDelete({ sessionId: sid });
                        await fs.remove(path.join(SESSION_BASE_PATH, sid)).catch(()=>{});
                        return reply(`🗑️ Deleted Sub Bot: +${num}`);
                    }

                    // Generate code
                    let num = args[0].replace(/[^0-9]/g, '');
                    if (num.length < 10) return reply("❌ Valid number දාන්න! Ex: .pair 94712345678");
                    try {
                        await reply(`⏳ Generating code for +${num}...`);
                        let code = await getPairingCodeForSubBot(num);
                        if (code === "ALREADY_ACTIVE") return reply(`✅ +${num} Already Online!`);
                        if (code === "ALREADY_PAIRED") {
                            await Pair(num);
                            return reply(`✅ +${num} Already paired! Starting...`);
                        }
                        let msgTxt = `╭──〔 *SUB BOT PAIR* 〕──╮
┃ 📱 +${num}
┃ 🔑 Code: *${code}*
┃ ⏰ Expires in 60 sec!
┃
┃ 📲 Link Steps:
┃ 1. WhatsApp Open
┃ 2. Linked Devices
┃ 3. Link with phone number
┃ 4. Enter: ${code}
╰─────────────────╯`;
                        return reply(msgTxt);
                    } catch (e) {
                        return reply(`❌ Error: ${e.message}`);
                    }
                }
                // ============================================================

                if (command === 'cpoll' || command === 'pollusers' || command === 'multipoll') {
                    if (!isOwner) return reply('👑 Owner only!');
                    const sub = (args[0] || '').toLowerCase();
                    const cfg = await getPollConfig();
                    if (sub === 'on') { cfg.enabled = true; cfg.autoVote = true; await cfg.save(); return reply('✅ Multi-User Poll Vote ON! 🎀\nBot users ලා ඔක්කොම Channel Poll වලට vote දානවා!'); }
                    if (sub === 'off') { cfg.enabled = false; await cfg.save(); return reply('❌ Poll OFF'); }
                    if (sub === 'opt' || sub === 'option') {
                        const idx = parseInt(args[1]) - 1; if (isNaN(idx)) return reply('Use: .cpoll opt 1'); cfg.voteOptionIndex = idx; await cfg.save(); return reply(`✅ Option set to ${idx+1}`);
                    }
                    if (sub === 'random') { cfg.voteOptionIndex = -1; await cfg.save(); return reply('🎲 Random Poll Vote ON!'); }
                    if (sub === 'add') { const jid = args[1] || from; if (!cfg.channels.includes(jid)) cfg.channels.push(jid); await cfg.save(); return reply(`✅ Added ${jid}`); }
                    if (sub === 'list') { return reply(`📋 Poll Channels: ${cfg.channels.length===0?'All':cfg.channels.join('\n')}\n👥 Users: ${Object.keys(activeSockets).length}\nStatus: ${cfg.enabled?'ON':'OFF'} | Opt: ${cfg.voteOptionIndex===-1?'Random':cfg.voteOptionIndex+1}`); }
                    if (sub === 'vote') {
                        const idx = parseInt(args[1] || '1') - 1; const last = global._lastChannelPolls.get(from);
                        if (!last) return reply('❌ No poll here!'); reply(`🚀 Voting with ${Object.keys(activeSockets).length} users...`);
                        const r = await voteWithAllUsers(from, last.poll, last.key, idx);
                        return reply(`✅ DONE!\nPoll: ${last.poll.name}\nOption: ${r.option}\nVoted: ${r.voted}/${r.totalUsers}`);
                    }
                    if (sub === 'force') { const idx = parseInt(args[1]||'1')-1; let total=0; for(const [jid,data] of global._lastChannelPolls){ await voteWithAllUsers(jid, data.poll, data.key, idx); total++; await new Promise(r=>setTimeout(r,1500)); } return reply(`🚀 Force Voted ${total} channels!`); }
                    return reply(`╭─〔 📊 MULTI-USER POLL 〕─\n│ .cpoll on/off\n│ .cpoll opt 1 / random\n│ .cpoll add/list\n│ .cpoll vote 1 / force 1\n│ Users: ${Object.keys(activeSockets).length}\n╰────`);
                }

                if (command === 'creact' || command === 'channelreact' || command === 'multireact') {
                    if (!isOwner) return reply('👑 Owner only!');
                    const sub = (args[0] || '').toLowerCase();
                    const cfg = await getReactConfig();
                    if (sub === 'on') { cfg.enabled = true; cfg.autoReact = true; await cfg.save(); return reply('✅ Multi-User Channel React ON! 🎀❤️'); }
                    if (sub === 'off') { cfg.enabled = false; await cfg.save(); return reply('❌ React OFF'); }
                    if (sub === 'emoji' || sub === 'emojis') {
                        const newEmojis = args.slice(1); if (newEmojis.length === 0) return reply(`❤️ Current: ${cfg.emojis.join(' ')}\nUse: .creact emoji ❤️ 🔥 🎀`); cfg.emojis = newEmojis; await cfg.save(); return reply(`✅ Emojis: ${cfg.emojis.join(' ')}`);
                    }
                    if (sub === 'random') { cfg.randomEmoji = !cfg.randomEmoji; await cfg.save(); return reply(`🎲 Random: ${cfg.randomEmoji?'ON ✅':'OFF ❌'}`); }
                    if (sub === 'add') { const jid = args[1] || from; if (!jid.endsWith('@newsletter')) return reply('❌ Channel JID needed!'); if (!cfg.channels.includes(jid)) cfg.channels.push(jid); await cfg.save(); return reply(`✅ Added ${jid}`); }
                    if (sub === 'remove' || sub === 'del') { const jid = args[1] || from; cfg.channels = cfg.channels.filter(x=>x!==jid); await cfg.save(); return reply(`🗑️ Removed ${jid}`); }
                    if (sub === 'list') { return reply(`📋 React Channels: ${cfg.channels.length===0?'All 🌍':cfg.channels.join('\n')}\n👥 Users: ${Object.keys(activeSockets).length}\n❤️ Emojis: ${cfg.emojis.join(' ')}\nStatus: ${cfg.enabled?'ON':'OFF'}`); }
                    if (sub === 'react') { const emoji = args[1] || '❤️'; const last = global._lastChannelPosts.get(from); if (!last) return reply('❌ No recent post!'); reply(`🚀 Reacting with ${Object.keys(activeSockets).length} users -> ${emoji}`); const r = await reactWithAllUsers(from, last.key, emoji); return reply(`✅ DONE! 🎀\nEmoji: ${emoji}\nReacted: ${r.reacted}/${r.totalUsers}`); }
                    if (sub === 'bomb') { const emoji = args[1] || '❤️'; const last = global._lastChannelPosts.get(from); if (!last) return reply('❌ No post!'); reply(`💣 BOMB START! ${Object.keys(activeSockets).length*3} reacts!`); for(let i=0;i<3;i++){ await reactWithAllUsers(from, last.key, emoji); await new Promise(r=>setTimeout(r,1200)); } return reply(`💣 BOMB DONE! 🔥❤️`); }
                    return reply(`╭─〔 ❤️ MULTI-USER REACT 〕─\n│ .creact on/off\n│ .creact emoji ❤️ 🔥 🎀\n│ .creact random\n│ .creact add/list\n│ .creact react ❤️ / bomb ❤️\n│ Users: ${Object.keys(activeSockets).length}\n╰────`);
                }

                if (isCmd) {
                    const cmd = commandMap.get(command);
                    if (cmd) {
                        if (cmd.react) sock.sendMessage(from, { react: { text: cmd.react, key: msg.key } }).catch(()=>{});
                        try {
                            await cmd.function(sock, msg, m, {
                                from, prefix, command, args, q, isGroup, sender: nowsender, senderNumber,
                                botNumber2, botNumber, pushname, isMe, isOwner,
                                groupMetadata, groupAdmins, isBotAdmins, isAdmins, reply
                            });
                        } catch (e) { console.error('[PLUGIN ERROR]', e); }
                    }
                }
            } catch (e) { console.error("[MAIN LOOP ERROR]", e); }
        }); 

    } catch (err) {
        console.error('Pair Error:', err);
        cleanupSession(sessionId);
        if (res && !res.headersSent) res.json({ error: 'Pair failed: ' + err.message });
    }
}

async function restoreAllSessions() {
    try {
        const sessions = await Session.find();
        console.log(`Restoring ${sessions.length} session(s)...`);
        for (let i=0; i<sessions.length; i++) {
            const s = sessions[i];
            if (!s.sessionId) continue;
            const number = s.sessionId.replace('yumi_', '').replace('thuhi_','');
            await delay(i * 1000);
            await Pair(number).catch(()=>{});
        }
    } catch (err) {}
}

app.get('/pair', async (req, res) => {
    const number = req.query.number;
    if (!number) return res.json({ error: 'Number required' });
    res.setTimeout(30000, () => { if (!res.headersSent) res.json({ error: 'Request timed out. Try again.' }); });
    await Pair(number, res);
});

app.get('/', (req, res) => {
    const publicIndex = path.join(__dirname, 'public', 'index.html');
    const rootPair = path.join(__dirname, 'pair.html');
    if (fs.existsSync(publicIndex)) {
        return res.sendFile(publicIndex);
    } else if (fs.existsSync(rootPair)) {
        return res.sendFile(rootPair);
    } else {
        return res.send(`${BOT_NAME} Server Running! - Owner: ${BOT_OWNER} - Mongo: Connected ✅ - Poll+React+SubBot ON 📊❤️🤖`);
    }
});

app.listen(PORT, async () => {
    console.log(`🎀 ${BOT_NAME} Server running on port ${PORT}`);
    console.log(`📊 Multi-User Channel Poll Voter: ENABLED ✅`);
    console.log(`❤️ Multi-User Channel React: ENABLED ✅`);
    console.log(`🤖 Sub Bot System: ENABLED ✅`);
    console.log(`📁 Public folder: ${path.join(__dirname, 'public')}`);
    console.log(`🌐 Pair route: /pair?number=...`);
    await fs.ensureDir(SESSION_BASE_PATH);
    await fs.ensureDir(SUBBOT_BASE_PATH);
    await restoreAllSessions();
});

process.on('uncaughtException', (err) => {
    const e = String(err);
    if (e.includes('Socket connection timeout') || e.includes('rate-overlimit') || e.includes('Connection Closed') || e.includes('Value not found')) return;
    console.log('Caught exception:', err);
});