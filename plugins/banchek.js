const { cmd } = require('../command');
const axios = require('axios');

const API = "https://wptest.udmodz-2ab.workers.dev/test?number=";

cmd({
    pattern: "bancheck",
    alias: ["ban", "checkban", "isban", "waban", "bunnyban", "bunnyapi"],
    desc: "Bunny api ban Check",
    category: "tools",
    react: "💀",
    filename: __filename
},
async (conn, mek, m, { from, q }) => {
    try {
        if (!q) {
            return await conn.sendMessage(from, {
                text: `╭━━━〔 💀 *Bunny api ban Check* 🔍 〕━━━┈⊷\n┃\n┃ 📱 Number එක දාන්න patiyo!\n┃\n┃ • .bancheck 947123456789\n┃ • .ban 94771234567\n┃ • .ban 0712345678\n┃ • .bunnyban 94xxxxxxxxx\n┃\n╰━━━━━━━━━━━━━━━━━━━┈⊷\n> _Bunny api ban Check_ 💀\n> _Power by Bunny xmd_ 🔥`
            }, { quoted: mek });
        }

        let number = q.split(" ")[0].replace(/[^0-9]/g, "");
        if (number.startsWith("0")) number = "94" + number.slice(1);
        if (number.length === 9) number = "94" + number;
        
        await conn.sendMessage(from, { react: { text: "💀", key: mek.key } });
        await conn.sendPresenceUpdate('composing', from);

        let res;
        try {
            res = await axios.get(`${API}${number}`, {
                timeout: 20000,
                headers: { "User-Agent": "Mozilla/5.0" }
            });
        } catch (err) {
            return await conn.sendMessage(from, { 
                text: `╭━━━〔 💀 *Bunny api ban Check* 〕━━━┈⊷\n┃\n┃ 📱 Number: +${number}\n┃ ❌ API Error: ${err.message}\n┃\n╰━━━━━━━━━━━━━━━━━━━┈⊷\n> _Bunny api ban Check_\n> _Power by Bunny xmd_ 💀` 
            }, { quoted: mek });
        }

        let data = res.data;
        let isBanned = false;
        let statusText = "";

        let jsonStr = JSON.stringify(data).toLowerCase();
        if (jsonStr.includes("banned") || data.banned === true || data.isBanned === true) {
            isBanned = true;
            statusText = "BANNED 💀🔴";
        } else if (jsonStr.includes("not") || data.banned === false || data.status === "ok") {
            isBanned = false;
            statusText = "NOT BANNED ✅🟢";
        } else {
            statusText = data.status || data.result || "CHECKED";
        }

        let caption = `╭━━━〔 ${isBanned ? "💀" : "✅"} *Bunny api ban Check* ${isBanned ? "💀" : "✅"} 〕━━━┈⊷\n`;
        caption += `┃\n`;
        caption += `┃ 📱 *Number:* +${number}\n`;
        caption += `┃ 📊 *Status:* ${statusText}\n`;
        caption += `┃\n`;
        caption += `┃ ━━━━〔 📦 RAW DATA 〕━━━━\n`;
        caption += `┃ ${typeof data === "object" ? JSON.stringify(data, null, 2).slice(0, 800) : String(data).slice(0, 800)}\n`;
        caption += `┃\n`;
        caption += `┃ ━━━━〔 ${isBanned ? "💀 RESULT" : "✅ RESULT"} 〕━━━━\n`;
        caption += `┃ ${isBanned ? "🔴 BANNED - WhatsApp ban වෙලා!" : "🟢 SAFE - Ban වෙලා නෑ!"}\n`;
        caption += `┃\n`;
        caption += `╰━━━━━━━━━━━━━━━━━━━┈⊷\n`;
        caption += `> _Bunny api ban Check_ 💀\n`;
        caption += `> _Power by Bunny xmd_ 🔥`;

        await conn.sendMessage(from, { text: caption }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, { text: `❌ Error in Bunny api ban Check: ${e.message}\n> Power by Bunny xmd` }, { quoted: mek });
    }
});