const fs = require('fs-extra');
const path = require('path');

const DB_PATH = './database';
fs.ensureDirSync(DB_PATH);

const ANTI_PATH = path.join(DB_PATH, 'anti.json');
const BAN_PATH = path.join(DB_PATH, 'bans.json');

// ===============================
// INIT anti.json - LATEST FULL
// ===============================
if (!fs.existsSync(ANTI_PATH)) {
    fs.writeJsonSync(ANTI_PATH, {
        gc: false,                  // Anti Delete Group
        dm: false,                  // Anti Delete DM
        antilink: false,            // Anti Link
        antilink_kick: false,       // Anti Link Kick
        antibadword: false,         // Anti Bad Word
        antiblock: false,           // Anti Block
        antiban: false,             // Anti Ban (Safe Mode)
        autostatus: false,          // 👁️ Auto Status View
        autostatus_react: false,    // 💖 Auto Status React
        autostatus_like: false,     // 👍 Auto Status Like
        autoreply: false            // 💬 Auto Reply (gm/mk etc)
    }, { spaces: 2 });
} else {
    // Auto update old file with new keys
    try {
        const old = fs.readJsonSync(ANTI_PATH);
        let changed = false;
        const defaults = {
            gc: false, dm: false, antilink: false, antilink_kick: false,
            antibadword: false, antiblock: false, antiban: false,
            autostatus: false, autostatus_react: false, autostatus_like: false,
            autoreply: false
        };
        for (let k in defaults) {
            if (old[k] === undefined) {
                old[k] = defaults[k];
                changed = true;
            }
        }
        if (changed) fs.writeJsonSync(ANTI_PATH, old, { spaces: 2 });
    } catch {}
}

if (!fs.existsSync(BAN_PATH)) {
    fs.writeJsonSync(BAN_PATH, {}, { spaces: 2 });
}

// ===============================
// MEMORY STORES
// ===============================
let messageStore = new Map();
let warnStore = {};

// ===============================
// 1. ANTI SETTINGS
// ===============================
async function getAnti(type) {
    try {
        const data = await fs.readJson(ANTI_PATH);
        return data[type] || false;
    } catch { return false; }
}

async function setAnti(type, status) {
    try {
        const data = await fs.readJson(ANTI_PATH);
        data[type] = status;
        await fs.writeJson(ANTI_PATH, data, { spaces: 2 });
        console.log(`[ANTI] ${type} = ${status}`);
        return true;
    } catch (e) {
        console.log("setAnti Error:", e.message);
        return false;
    }
}

async function getAllAnti() {
    try { return await fs.readJson(ANTI_PATH); } catch { return {}; }
}

// ===============================
// 2. MESSAGE SAVE / LOAD
// ===============================
async function saveMessage(id, jid, messageObj) {
    try {
        if (!id || !messageObj) return;
        messageStore.set(id, { id, jid, message: messageObj, time: Date.now() });
    } catch {}
}
async function loadMessage(id) {
    try { return messageStore.get(id) || null; } catch { return null; }
}
async function deleteMessage(id) {
    try { messageStore.delete(id); } catch {}
}

setInterval(() => {
    const now = Date.now();
    for (const [key, val] of messageStore) {
        if (now - val.time > 1000 * 60 * 60 * 5) messageStore.delete(key);
    }
}, 1000 * 60 * 30);

// ===============================
// 3. WARN SYSTEM
// ===============================
async function addWarn(jid, type = 'link') {
    const key = `${jid}_${type}`;
    warnStore[key] = (warnStore[key] || 0) + 1;
    return warnStore[key];
}
async function getWarn(jid, type = 'link') {
    const key = `${jid}_${type}`;
    return warnStore[key] || 0;
}
async function resetWarn(jid, type = 'link') {
    const key = `${jid}_${type}`;
    delete warnStore[key];
}

// ===============================
// 4. GROUP BAN SYSTEM
// ===============================
async function getBans(groupJid) {
    try {
        const data = await fs.readJson(BAN_PATH);
        return data[groupJid] || [];
    } catch { return []; }
}
async function isBanned(groupJid, userJid) {
    try {
        const bans = await getBans(groupJid);
        return bans.includes(userJid);
    } catch { return false; }
}
async function addBan(groupJid, userJid) {
    try {
        const data = await fs.readJson(BAN_PATH);
        if (!data[groupJid]) data[groupJid] = [];
        if (!data[groupJid].includes(userJid)) {
            data[groupJid].push(userJid);
            await fs.writeJson(BAN_PATH, data, { spaces: 2 });
        }
        return true;
    } catch (e) { console.log("addBan Error:", e.message); return false; }
}
async function removeBan(groupJid, userJid) {
    try {
        const data = await fs.readJson(BAN_PATH);
        if (data[groupJid]) {
            data[groupJid] = data[groupJid].filter(u => u !== userJid);
            await fs.writeJson(BAN_PATH, data, { spaces: 2 });
        }
        return true;
    } catch (e) { console.log("removeBan Error:", e.message); return false; }
}
async function getAllBans() {
    try { return await fs.readJson(BAN_PATH); } catch { return {}; }
}

// ===============================
// EXPORT
// ===============================
module.exports = {
    getAnti,
    setAnti,
    getAllAnti,
    saveMessage,
    loadMessage,
    deleteMessage,
    addWarn,
    getWarn,
    resetWarn,
    getBans,
    isBanned,
    addBan,
    removeBan,
    getAllBans
};