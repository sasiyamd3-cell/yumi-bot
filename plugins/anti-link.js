const { cmd } = require('../command');
const { getAnti, setAnti } = require('../data');
const { proto, generateWAMessageFromContent } = require('@whiskeysockets/baileys');

async function sendAntilinkMenu(conn, jid, mek) {
    const current = await getAnti('antilink');
    const status = current ? "🟢 ON" : "🔴 OFF";

    const buttons = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "✅ ON කරන්න", id: ".antilink on" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "❌ OFF කරන්න", id: ".antilink off" }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "⚙️ Kick ON/OFF", id: ".antilink kick" }) }
    ];

    const msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                messageContextInfo: { deviceListMetadataVersion: 2 },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `*YUMI ANTI LINK 🔗*\n\n*Status:* ${status}\n\nGroup එකේ Link දාන එක Block කරනවා.\nAdminලට Bypass තියෙනවා.\n\nපහලින් තෝරන්න 👇`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({ text: "Yumi Mini Bot • Antilink" }),
                    header: proto.Message.InteractiveMessage.Header.create({ title: "Anti Link Control", hasMediaAttachment: false }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons })
                })
            }
        }
    }, { quoted: mek });

    await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
}

cmd({
    pattern: "antilink",
    alias: ["antilinks", "linkoff"],
    react: "🔗",
    desc: "Anti Link ILB Control",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, isAdmins, args }) => {
    if (!isOwner && !isAdmins) return m.reply("❌ Group Admin Only!");
    
    const action = args[0]?.toLowerCase();

    if (action === "on") {
        await setAnti('antilink', true);
        return m.reply("✅ *Anti Link ON* කළා!\nදැන් Link දාන අයගේ msg delete වෙනවා.");
    } else if (action === "off") {
        await setAnti('antilink', false);
        return m.reply("❌ *Anti Link OFF* කළා!");
    } else if (action === "kick") {
        const currentKick = await getAnti('antilink_kick');
        await setAnti('antilink_kick', !currentKick);
        return m.reply(`*Kick Mode:* ${!currentKick ? 'ON 🟢 - 3 Links = Kick' : 'OFF 🔴'}`);
    } else {
        await sendAntilinkMenu(conn, from, mek);
    }
});

cmd({
    pattern: ".*",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const { AntiLink } = require('../lib/antilink');
        await AntiLink(conn, mek, m);
    } catch (e) {
        // silent - if lib not found
    }
});