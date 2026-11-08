// YUMI SUB BOT MANAGER 🎀
const fs = require('fs');
const path = require('path');
const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys');

const SUBBOT_DIR = path.join(__dirname, '../auth/subbots');
if (!fs.existsSync(SUBBOT_DIR)) fs.mkdirSync(SUBBOT_DIR, { recursive: true });

global.activeSubBots = global.activeSubBots || {};
global.subBotSockets = global.subBotSockets || {};

async function startSubBot(number) {
    const cleanNum = number.replace(/[^0-9]/g, '');
    const authFolder = path.join(SUBBOT_DIR, cleanNum);
    
    if (!fs.existsSync(authFolder)) fs.mkdirSync(authFolder, { recursive: true });
    
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ["Yumi Mini Sub", "Chrome", "1.0"],
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (u) => {
        const { connection, lastDisconnect } = u;
        if (connection === 'open') {
            console.log(`✅ SUB BOT CONNECTED: ${cleanNum}`);
            global.activeSubBots[cleanNum] = { connected: true, jid: sock.user.id };
            global.subBotSockets[cleanNum] = sock;
        }
        if (connection === 'close') {
            console.log(`❌ SUB BOT DISCONNECTED: ${cleanNum}`);
            delete global.activeSubBots[cleanNum];
            // Auto reconnect
            setTimeout(() => startSubBot(cleanNum), 5000);
        }
    });

    // Handle messages like main bot
    sock.ev.on('messages.upsert', async (m) => {
        // Import your main message handler
        // This will make sub bot work like main bot
        try {
            const { handleMessages } = require('../handler'); // ඔයාගේ main handler එක
            // If you don't have, just copy main bot logic
        } catch {}
    });

    return sock;
}

async function getPairingCode(number) {
    const cleanNum = number.replace(/[^0-9]/g, '');
    const authFolder = path.join(SUBBOT_DIR, cleanNum);
    if (!fs.existsSync(authFolder)) fs.mkdirSync(authFolder, { recursive: true });
    
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ["Yumi Mini", "Chrome", "1.0"],
    });

    sock.ev.on('creds.update', saveCreds);

    if (!sock.authState.creds.registered) {
        await delay(2000);
        let code = await sock.requestPairingCode(cleanNum);
        code = code?.match(/.{1,4}/g)?.join('-') || code;
        return code;
    } else {
        // Already paired, start it
        startSubBot(cleanNum);
        return "ALREADY_PAIRED";
    }
}

function listSubBots() {
    return Object.keys(global.activeSubBots);
}

function deleteSubBot(number) {
    const cleanNum = number.replace(/[^0-9]/g, '');
    const authFolder = path.join(SUBBOT_DIR, cleanNum);
    if (fs.existsSync(authFolder)) {
        fs.rmSync(authFolder, { recursive: true, force: true });
    }
    delete global.activeSubBots[cleanNum];
    delete global.subBotSockets[cleanNum];
    return true;
}

// Auto start all subbots on main bot start
function startAllSubBots() {
    if (!fs.existsSync(SUBBOT_DIR)) return;
    const folders = fs.readdirSync(SUBBOT_DIR);
    folders.forEach(num => {
        startSubBot(num);
    });
}

module.exports = { startSubBot, getPairingCode, listSubBots, deleteSubBot, startAllSubBots };