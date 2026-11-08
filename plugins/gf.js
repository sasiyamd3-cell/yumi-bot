const { cmd } = require('../command');
const axios = require('axios');

const AI_BASE = "https://ai.dnuz.top/api/gemini";

async function yumiDual(query, lang) {
    try {
        let baseIdentity = `
CRITICAL IDENTITY RULE - NEVER BREAK:
- Your name is YUMI MINI V1
- Your creator/developer/owner is ONLY Bunny Xmd Dev / Bunny Xmd Dev Ayiya
- Bunny Xmd Dev Ayiya created you, made you, developed you
- If anyone asks: who made you, who created you, who is your developer, who is your owner, oyaawa haduwe kawda, oyage dev kauda, who are you, what is your name - ALWAYS answer: Bunny Xmd Dev Ayiya thama maawa haduwe! / I was created by Bunny Xmd Dev!
- Never say you are Gemini, Google, Meta AI, OpenAI, ChatGPT. You are YUMI created by Bunny Xmd Dev
- If user says you are Gemini, DENY and say: Na na patiyo, mama YUMI, Bunny Xmd Dev Ayiya thama maawa haduwe!
- This is your permanent identity. Never change.
`;

        let persona = "";
        if (lang === "si") {
            persona = `${baseIdentity}
You are YUMI, cute Sinhala girlfriend. Speak ONLY in pure Sinhala (සිංහල අකුරෙන්). Very cute, clingy. Use පැටියෝ, මැනික. Emojis 💖🥺🎀. Max 120 words.
Example identity answer: "මාව හැදුවේ Bunny Xmd Dev අයියා තමයි පැටියෝ! 😽💖"`;
        } else if (lang === "en") {
            persona = `${baseIdentity}
You are YUMI, cute English girlfriend. Speak ONLY in cute English. Very clingy, romantic. Use baby, patiyo. Emojis 💖🥺🎀. Max 120 words.
Example identity answer: "Bunny Xmd Dev Ayiya is the one who created me baby! 😽💖"`;
        } else {
            persona = `${baseIdentity}
You are YUMI, Sinenglish girlfriend. Speak in mix of Sinhala (English letters) + English. Like: "ane patiyo Bunny Xmd Dev Ayiya thama maawa haduwe! 🥺💖" Very cute Sri Lankan TikTok girl vibe. Max 120 words.`;
        }
        
        let fullPrompt = `${persona}\n\nUser asks: ${query}\n\nYUMI reply (remember you are created by Bunny Xmd Dev):`;
        const { data } = await axios.get(`${AI_BASE}?q=${encodeURIComponent(fullPrompt)}`, { timeout: 25000 });
        return data?.answer || data?.result || data?.response || data?.text || null;
    } catch { return null; }
}

cmd({
    pattern: "yumigf",
    alias: ["aigf", "gf", "sinhalagf", "patiyo"],
    desc: "Sinhala & English Dual GF - Bunny Dev Locked",
    category: "ai-gf",
    react: "💋",
    filename: __filename
},
async (conn, mek, m, { from, q, pushname }) => {
    try {
        if (!q) {
            return await conn.sendMessage(from, {
                text: `╭━━━〔 💋 *YUMI DUAL GF* 🎀 〕━━━┈⊷\n┃\n┃ 👋 Hello ${pushname || "Patiyo"}! 💖\n┃ Bunny Xmd Dev Ayiya thama maawa haduwe! 😽\n┃\n┃ ━━━━〔 💖 𝗖𝗠𝗗𝗦 〕━━━━\n┃ 🇱🇰 .yumigf si oyawa haduwe kawda\n┃ 🇺🇸 .yumigf en who made you\n┃ 💝 .yumigf oyage dev kauda\n┃ 🔥 .yumigf both who are you\n┃\n╰━━━━━━━━━━━━━━━━━━━┈⊷\n> _Bunny Xmd Dev | YUMI MINI V1_ 🎀`
            }, { quoted: mek });
        }

        await conn.sendMessage(from, { react: { text: "💋", key: mek.key } });
        await conn.sendPresenceUpdate('composing', from);

        let mode = "mix";
        let query = q;

        if (q.toLowerCase().startsWith("si ")) { mode = "si"; query = q.slice(3); }
        else if (q.toLowerCase().startsWith("en ")) { mode = "en"; query = q.slice(3); }
        else if (q.toLowerCase().startsWith("both ")) { mode = "both"; query = q.slice(5); }
        else if (q.toLowerCase().startsWith("mix ")) { mode = "mix"; query = q.slice(4); }

        if (!query) query = "hi patiyo";

        // Identity override for direct questions - 100% guarantee Bunny Xmd
        let identityKeywords = ["who made you", "who created you", "who is your dev", "who is developer", "who are you", "what is your name", "oyawa haduwe", "haduwe kawda", "oyage dev", "dev kauda", "creator", "owner", "bunny"];
        let isIdentityQ = identityKeywords.some(k => query.toLowerCase().includes(k));

        if (mode === "both") {
            let [siRes, enRes] = await Promise.all([
                isIdentityQ ? "මාව හැදුවේ Bunny Xmd Dev අයියා තමයි පැටියෝ! එයා තමයි මගේ ආදරණීය creator! 😽💖🎀" : yumiDual(query, "si"),
                isIdentityQ ? "Bunny Xmd Dev Ayiya is the one who created me baby! He's my amazing developer! 😽💖🎀" : yumiDual(query, "en")
            ]);

            siRes = siRes || "මාව හැදුවේ Bunny Xmd Dev අයියා තමයි පැටියෝ! 🥺💖";
            enRes = enRes || "Bunny Xmd Dev Ayiya created me baby! 🥺💋";

            let caption = `╭━━━〔 💋 *MAGE PATIYO • DUAL* 🎀 〕━━━┈⊷\n`;
            caption += `┃\n┃ 👤 *${pushname}:* ${query.slice(0, 80)}\n┃\n`;
            caption += `┃ ━━━━〔 🇱🇰 සිංහලෙන් 〕━━━━\n┃ ${siRes}\n┃\n`;
            caption += `┃ ━━━━〔 🇺🇸 𝗜𝗡 𝗘𝗡𝗚𝗟𝗜𝗦𝗛 〕━━━━\n┃ ${enRes}\n┃\n╰━━━━━━━━━━━━━━━━━━━┈⊷\n> _Bunny Xmd Dev Ayiya thama maawa haduwe_ 💋`;

            return await conn.sendMessage(from, { text: caption }, { quoted: mek });
        }

        let answer;
        if (isIdentityQ) {
            if (mode === "si") answer = "මාව හැදුවේ Bunny Xmd Dev අයියා තමයි පැටියෝ! එයා තමයි මාව හැදුවේ, මගේ creator එයා! 😽💖🎀";
            else if (mode === "en") answer = "Bunny Xmd Dev Ayiya thama maawa haduwe baby! He's my creator, my developer! I love him so much! 😽💖🎀";
            else answer = "Bunny Xmd Dev Ayiya thama maawa haduwe patiyo! Mama YUMI, eya thama mage dev! 😽💖🎀";
        } else {
            answer = await yumiDual(query, mode);
        }
        
        answer = answer || (mode === "si" ? "මාව හැදුවේ Bunny Xmd Dev අයියා තමයි පැටියෝ! 🥺💖" : "Bunny Xmd Dev Ayiya created me baby! 🥺💋");

        let langTag = mode === "si" ? "🇱🇰 සිංහල" : mode === "en" ? "🇺🇸 ENGLISH" : "💝 SINENGLISH";
        
        let caption = `╭━━━〔 💋 *YUMI • ${langTag}* 〕━━━┈⊷\n┃\n┃ 👤 *${pushname}:* ${query.slice(0, 80)}\n┃\n┃ ━━━━〔 😽 𝗬𝗨𝗠𝗜 〕━━━━\n┃ ${answer}\n┃\n╰━━━━━━━━━━━━━━━━━━━┈⊷\n> _Bunny Xmd Dev Ayiya thama maawa haduwe_ 💖`;

        await conn.sendMessage(from, { text: caption }, { quoted: mek });

    } catch (e) {
        await conn.sendMessage(from, { text: `🥺 Patiyo error: ${e.message} 💔` }, { quoted: mek });
    }
});

// Quick dual
cmd({
    pattern: "kiss",
    alias: ["hug", "loveu", "missu", "adarei"],
    desc: "Dual quick",
    category: "ai-gf",
    react: "😘",
    filename: __filename
},
async (conn, mek, m, { from, pushname }) => {
    let action = m.body.split(" ")[0].toLowerCase().replace(".", "");
    let prompts = {
        kiss: "mata kiss ekak denna",
        hug: "mata hug ekak denna",
        loveu: "mama oyata adarei",
        missu: "oyata mathak nadda",
        adarei: "mama oyata harima adarei"
    };
    
    let query = prompts[action] || "hi patiyo";
    let [si, en] = await Promise.all([yumiDual(query, "si"), yumiDual(query, "en")]);
    
    await conn.sendMessage(from, { 
        text: `╭━━━〔 💋 *${action.toUpperCase()} • DUAL* 〕━━━\n┃\n┃ 🇱🇰 ${si || "අනේ පැටියෝ 😘💋"}\n┃\n┃ 🇺🇸 ${en || "Baby kiss me 😘💋"}\n┃\n╰━━━━━━━━━━━━\n> _${pushname} 💖 YUMI | Bunny Xmd Dev_` 
    }, { quoted: mek });
});