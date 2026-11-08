const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti, setAnti } = require('../data');
const config = require('../config');
const { proto, generateWAMessageFromContent } = require('@whiskeysockets/baileys');

// --- ILB Menu ---
async function sendAntiMenu(conn, jid, mek, isGc) {
    const type = isGc ? 'gc' : 'dm';
    const current = await getAnti(type);
    const status = current ? "🟢 ON" : "🔴 OFF";
    const target = isGc ? "Group" : "DM";

    const buttons = [
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: `✅ ${target} ON`, id: `.antidel ${type} on` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: `❌ ${target} OFF`, id: `.antidel ${type} off` }) },
        { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "📊 Status", id: `.antidel status` }) }
    ];

    const msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                messageContextInfo: { deviceListMetadataVersion: 2 },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: `*YUMI ANTI DELETE 👁️*\n\n*Target:* ${target}\n*Status:* ${status}\n\nDelete කරන msg ආපහු එවනවා 💖`
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({ text: "Yumi Mini Bot • AntiDel" }),
                    header: proto.Message.InteractiveMessage.Header.create({ title: "Anti Delete Control", hasMediaAttachment: false }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons })
                })
            }
        }
    }, { quoted: mek });

    await conn.relayMessage(jid, msg.message, { messageId: msg.key.id });
}

const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    try {
        const messageContent = mek.message?.conversation || mek.message?.extendedTextMessage?.text || mek.message?.imageMessage?.caption || mek.message?.videoMessage?.caption || 'Media Message';
        deleteInfo += `\n\n*💬 ᴍᴇssᴀɢᴇ:* ${messageContent}`;
        await conn.sendMessage(jid, {
            text: deleteInfo,
            contextInfo: { mentionedJid: isGroup ? [update.key.participant, mek.key.participant].filter(Boolean) : [update.key.remoteJid] }
        }, { quoted: mek });
    } catch (e) { console.log("DeletedText Error:", e.message) }
};

const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
    try {
        const antideletedmek = JSON.parse(JSON.stringify(mek.message)); // safe clone
        const messageType = Object.keys(antideletedmek)[0];
        
        if (antideletedmek[messageType]) {
            antideletedmek[messageType].contextInfo = {
                stanzaId: mek.key.id,
                participant: mek.sender || mek.key.participant || mek.key.remoteJid,
                quotedMessage: mek.message,
            };
        }
        if (messageType === 'imageMessage' || messageType === 'videoMessage') {
            antideletedmek[messageType].caption = deleteInfo;
        } else {
            await conn.sendMessage(jid, { text: `*🚨 Delete Detected!*\n\n${deleteInfo}` }, { quoted: mek });
        }
        await conn.relayMessage(jid, antideletedmek, {});
    } catch (e) { console.log("DeletedMedia Error:", e.message) }
};

const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message === null) {
            const store = await loadMessage(update.key.id);
            if (store && store.message) {
                const mek = store.message;
                const isGroup = isJidGroup(store.jid);
                const antiDeleteType = isGroup ? 'gc' : 'dm';
                const antiDeleteStatus = await getAnti(antiDeleteType);
                if (!antiDeleteStatus) continue;

                const deleteTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                let deleteInfo, jid;
                
                if (isGroup) {
                    try {
                        const groupMetadata = await conn.groupMetadata(store.jid);
                        const groupName = groupMetadata.subject;
                        const sender = mek.key.participant?.split('@')[0];
                        const deleter = update.key.participant?.split('@')[0];
                        deleteInfo = `*⭕ sᴏᴍᴇᴏɴᴇ ᴅᴇʟᴇᴛᴇ ᴀ ᴍᴇssᴀɢᴇ!!*\n\n*⏰ ᴛɪᴍᴇ:* ${deleteTime}\n*🎡 ɢʀᴏᴜᴘ:* ${groupName}\n*🚯 ᴅᴇʟᴇᴛᴇᴅ ʙʏ:* @${deleter}\n*🙇🏻 sᴇɴᴅᴇʀ:* @${sender}`;
                        jid = config.ANTI_DEL_PATH === "log" ? conn.user.id : store.jid;
                    } catch { jid = store.jid; deleteInfo = `*⭕ Delete Detected*\n*⏰ ${deleteTime}*`; }
                } else {
                    const senderNumber = mek.key.remoteJid?.split('@')[0];
                    const deleterNumber = update.key.remoteJid?.split('@')[0];
                    deleteInfo = `*⭕ sᴏᴍᴇᴏɴᴇ ᴅᴇʟᴇᴛᴇ ᴀ ᴍᴇssᴀɢᴇ!!*\n\n*⏰ ᴛɪᴍᴇ:* ${deleteTime}\n*🚯 ᴅᴇʟᴇᴛᴇᴅ ʙʏ:* @${deleterNumber}\n*🙇🏻 sᴇɴᴅᴇʀ:* @${senderNumber}`;
                    jid = config.ANTI_DEL_PATH === "log" ? conn.user.id : update.key.remoteJid;
                }

                if (mek.message?.conversation || mek.message?.extendedTextMessage || mek.message?.imageMessage?.caption) {
                    await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
                } else {
                    await DeletedMedia(conn, mek, jid, deleteInfo);
                }
            }
        }
    }
};

module.exports = { DeletedText, DeletedMedia, AntiDelete, sendAntiMenu };
