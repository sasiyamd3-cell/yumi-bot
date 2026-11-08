const { default: makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function startPair() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
    
    const conn = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
        },
        browser: ["Yumi Mini V1", "Chrome", "1.0.0"]
    });

    if (!conn.authState.creds.registered) {
        console.log("\n╭─〔 🎀 YUMI MINI V1 PAIR 〕─\n│\n");
        let phoneNumber = await question("│ 📱 Enter your number (9477...): ");
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        if (!phoneNumber) {
            console.log("│ ❌ Invalid number!");
            process.exit(1);
        }

        await delay(1000);
        try {
            let code = await conn.requestPairingCode(phoneNumber);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(`│\n│ ✨ YOUR PAIR CODE: ${code}\n│\n│ 👉 WhatsApp > Linked Devices > Link with phone number\n│ ⏳ Code expires in 60s\n│\n╰─────────────────\n`);
        } catch (e) {
            console.log(`│ ❌ Error: ${e.message}\n╰─────────────────`);
        }
    }

    conn.ev.on('creds.update', saveCreds);
    
    conn.ev.on('connection.update', async (s) => {
        const { connection } = s;
        if (connection === 'open') {
            console.log("\n✅ Connected! Yumi Mini V1 Ready! 🎀\n");
            rl.close();
            await delay(2000);
            process.exit(0);
        }
        if (connection === 'close') {
            console.log("❌ Connection closed, restarting...");
            startPair();
        }
    });
}

startPair();