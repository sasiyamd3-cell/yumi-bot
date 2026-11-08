const { getAnti, setAnti } = require('../data');
const { isJidGroup } = require('@whiskeysockets/baileys');

const isLink = (text) => {
    if (!text) return false;
    const regex = /(https?:\/\/|www\.|wa\.me\/|chat\.whatsapp\.com\/|t\.me\/|youtube\.com\/|youtu\.be\/|instagram\.com\/|tiktok\.com\/)/i;
    return regex.test(text);
};

const AntiLink = async (conn, mek, m) => {
    try {
        if (!m.isGroup) return;
        const from = m.chat;
        
        const antiStatus = await getAnti('antilink');
        if (!antiStatus) return;
        
        // Adminලටයි Ownerටයි bypass
        if (m.isAdmins || m.isMe || m.isOwner) return;

        const body = m.body || m.msg?.text || m.msg?.caption || '';
        if (!isLink(body)) return;

        // Group Metadata
        const isBotAdmin = m.isBotAdmins;
        if (!isBotAdmin) return; // Bot admin නැත්තම් delete කරන්න බෑ

        const sender = m.sender;
        const senderNum = sender.split('@')[0];

        // Delete the link message
        await conn.sendMessage(from, { delete: mek.key });

        // Warning message
        const warnText = `*🚨 ANTI LINK DETECTED!*\n\n` +
                         `*User:* @${senderNum}\n` +
                         `*Action:* Message Deleted\n` +
                         `*Reason:* Link not allowed ❌\n\n` +
                         `> Yumi Mini Bot Antilink 💖`;

        await conn.sendMessage(from, { 
            text: warnText, 
            mentions: [sender] 
        });

        // Optional: kick if repeated? (3 times)
        // ඔයාට ඕන නම් මේක on කරන්න
        /*
        conn.antilinkWarn = conn.antilinkWarn || {};
        conn.antilinkWarn[sender] = (conn.antilinkWarn[sender] || 0) + 1;
        if (conn.antilinkWarn[sender] >= 3) {
            await conn.groupParticipantsUpdate(from, [sender], "remove");
            await conn.sendMessage(from, { text: `*User @${senderNum} kicked - 3 Links sent!*`, mentions: [sender] });
            delete conn.antilinkWarn[sender];
        }
        */

    } catch (e) {
        console.log("AntiLink Error:", e.message);
    }
};

module.exports = { AntiLink, isLink };