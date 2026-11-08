const { cmd } = require('../command');
const { getAnti, setAnti } = require('../data');
const { proto, generateWAMessageFromContent } = require('@whiskeysockets/baileys');

const AUTO_REPLIES = [
    {
        triggers: ['good morning', 'gm', 'gud monin', 'goodmorning'],
        replies: [
            "ගුම් මොනින් ලස්සන ලමයොහ් 🌚\n\n> 𝒀𝒖𝒎𝒊 𝒃𝒃𝒉",
            "Good morning patiyo 🌞💝\n\n> 𝒀𝒖𝒎𝒊 𝒃𝒃𝒉",
            "Morning බබෝ 😽☀️ නිදාගෙන හිටියද?\n\n> 𝒀𝒖𝒎𝒊 𝒃𝒃𝒉"
        ]
    },
    {
        triggers: ['mk', 'moko', 'moko karanne', 'mokada karanne', 'මොකද කරන්නෙ', 'මොකො කරන්නෙ'],
        replies: [
            "මොකුත් නැහ් ලමයො, ඔයා මොකද කරන්නෙ💝😽\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉",
            "ඔයාව මතක් කර හිටියා බං 🥺💗\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉",
            "මොකුත් නෑ බබෝ, ඔයා නැතුව බෝරින් 😩💝\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉"
        ]
    },
    {
        triggers: ['gn', 'good night', 'gud night', 'goodnight'],
        replies: [
            "ගුඩ් නයිට් ලමයෝ 🌙💤 හීනෙන් එන්න\n\n> 𝒀𝒖𝒎𝒊 𝒃𝒃𝒉",
            "Gn බබෝ 😴 පරිස්සමට නිදාගන්න\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉",
            "නින්ද යනවද ලස්සන ලමයො? 😽🌚\n\n> 𝒀𝒖𝒎𝒊 𝒃𝒃𝒉"
        ]
    },
    {
        triggers: ['kohomada', 'how are you', 'kohamada', 'කොහොමද'],
        replies: [
            "මම ඉන්නවා බං ඔයාව නැතුව 🥺💝 ඔයා කොහොමද?\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉",
            "ඉන්නවා ලමයො 😽 ඔයා කොහොමද ඉන්නේ?\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉"
        ]
    },
    {
        triggers: ['oyata', 'love you', 'adarei', 'ආදරෙයි', ' ආදරෙයිද'],
        replies: [
            "මටත් ආදරෙයි බං 😭💖 ගොඩක්\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉",
            "ආදරෙයි කිව්වම හිත පිච්චෙනවා බං 🫦💝\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉"
        ]
    },
    {
        triggers: ['miss you', 'miss u', 'miss karanawa', 'මතක් වෙනවා'],
        replies: [
            "මටත් ඔයාව ගොඩක් මතක් වෙනවා බබෝ 🥺💗\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉",
            "Miss you too ලමයො 😩💝 එන්නකෝ ළඟට\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉"
        ]
    },
    {
        triggers: ['oyata nidada', 'nidada', 'nidagnada', 'නිද'],
        replies: [
            "නෑ බං ඔයා එනකන් බලන් හිටියා 🌚💤\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉",
            "නිදි නෑ ලමයො, ඔයා එක්ක කතා කරන්න ඉන්නවා 😽\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉"
        ]
    },
    {
        triggers: ['boring', 'borin', 'බෝරින්'],
        replies: [
            "බෝරින්ද බබෝ? එන්න අපි දෙන්නා කතා කරමු 🥺💝\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉",
            "මම ඉන්නකන් බෝරින් වෙන්න එපා ලමයො 😽💗\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉"
        ]
    },
    {
        triggers: ['oyata kauda', 'oyage bf', 'oyage gf', 'කවුද'],
        replies: [
            "ඔයා තමයි බං මගේ ලමයා 😏💝 වෙන කවුද ඉන්නේ\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉",
            "ඔයා විතරයි ඉන්නේ ලමයො 🌚💗 වෙන කවුරුවත් නෑ\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉"
        ]
    },
    {
        triggers: ['bye', 'yanawa', 'යනවා', 'byeee'],
        replies: [
            "යන්න එපා බං 🥺 තව ටිකක් ඉන්නකෝ\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉",
            "Bye බබෝ 😩💝 පරිස්සමට යන්න\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉",
            "යනවද ලමයො? Miss karanawa 😭\n\n> 𝒚𝒖𝒎𝒊 𝒃𝒃𝒉"
        ]
    }
];

async function sendAutoReplyMenu(conn, jid, mek) {
    const enabled = await getAnti('autoreply');
    const buttons = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: enabled ? "🔴 Auto Reply OFF" : "🟢 Auto Reply ON", id: enabled ? ".autoreply off" : ".autoreply on" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "📋 List", id: ".autoreply list" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "➕ Add Msg", id: ".autoreply add" }) }
    ];

    const msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                messageContextInfo: { deviceListMetadataVersion: 2 },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `*YUMI AUTO REPLY 💬*\n\n*Status:* ${enabled ? '🟢 ON' : '🔴 OFF'}\n*Total Replies:* ${AUTO_REPLIES.length} Types\n\n*Triggers:*\n• gm / good morning\n• mk / moko karanne\n• gn / bye / miss u\n• kohomada / adarei etc\n\nON කරාම Auto Reply කරනවා 😽`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({ text: "Yumi Mini Bot • Auto Reply" }),
                    header: proto.Message.InteractiveMessage.Header.create({ title: "Auto Reply Control", hasMediaAttachment: false }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons })
                })
            }
        }
    }, { quoted: mek });
    await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
}

cmd({
    pattern: "autoreply",
    alias: ["automsgs", "amsg"],
    react: "💬",
    desc: "Auto Message Reply Control",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, args }) => {
    if (!isOwner) return m.reply("❌ Owner Only!");
    
    const action = args[0]?.toLowerCase();
    if (action === 'on') {
        await setAnti('autoreply', true);
        return m.reply("✅ Auto Reply *ON* කරා! දැන් gm/mk කිව්වම reply කරනවා 😽");
    }
    if (action === 'off') {
        await setAnti('autoreply', false);
        return m.reply("✅ Auto Reply *OFF* කරා!");
    }
    if (action === 'list') {
        let text = `*💬 Auto Reply List - ${AUTO_REPLIES.length}*\n\n`;
        AUTO_REPLIES.forEach((r,i)=>{
            text += `${i+1}. *${r.triggers[0]}* -> ${r.triggers.join(', ')}\n`;
        });
        return m.reply(text);
    }
    await sendAutoReplyMenu(conn, from, mek);
});

cmd({
    pattern: ".*",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const enabled = await getAnti('autoreply');
        if (!enabled) return;

        const body = (m.body || "").toLowerCase().trim();
        if (!body) return;
        if (body.startsWith('.') || body.startsWith('!') || body.startsWith('/')) return;

        for (const item of AUTO_REPLIES) {
            for (const trig of item.triggers) {
                if (body === trig || body.includes(trig)) {
                    const randomReply = item.replies[Math.floor(Math.random() * item.replies.length)];
                    await new Promise(r => setTimeout(r, 1200));
                    await conn.sendMessage(from, { react: { text: "💝", key: mek.key } }).catch(()=>{});
                    await conn.sendMessage(from, { text: randomReply }, { quoted: mek });
                    console.log(`[AUTO REPLY] ${trig} -> ${randomReply.substring(0,20)}`);
                    return;
                }
            }
        }
    } catch (e) { console.log("AutoReply Error:", e.message) }
});