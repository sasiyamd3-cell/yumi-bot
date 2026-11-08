const { proto, downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys')

// --- Turbo Media Download (No Disk Save) ---
const downloadMediaMessage = async (m, filename) => {
    try {
        if (m.type === 'viewOnceMessage' || m.type === 'viewOnceMessageV2') {
            m.type = m.msg?.type || Object.keys(m.msg || {})[0] || m.type;
        }
        let type = m.type.replace('Message', '');
        if (['image','video','audio','sticker','document'].includes(type)) {
            const stream = await downloadContentFromMessage(m.msg, type);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
            return buffer;
        }
        return null;
    } catch (e) {
        console.log('downloadMedia Error:', e.message);
        return null;
    }
}

const sms = (sock, m) => {
    if (m.key) {
        m.id = m.key.id
        m.chat = m.key.remoteJid
        m.fromMe = m.key.fromMe
        m.isGroup = m.chat.endsWith('@g.us')
        m.sender = m.fromMe ? sock.user.id.split(':')[0]+'@s.whatsapp.net' : m.isGroup ? m.key.participant : m.key.remoteJid
    }
    if (m.message) {
        m.type = getContentType(m.message)
        // ViewOnce V1 & V2 Support
        let msgContent = m.message[m.type];
        if (m.type === 'viewOnceMessage' || m.type === 'viewOnceMessageV2') {
            const inner = msgContent.message;
            const innerType = getContentType(inner);
            m.msg = inner[innerType];
            m.type = innerType;
            if (m.type === 'viewOnceMessage') m.msg.type = innerType;
        } else {
            m.msg = m.message[m.type];
        }

        if (m.msg) {
            var quotedMention = m.msg.contextInfo != null ? m.msg.contextInfo.participant : ''
            var tagMention = m.msg.contextInfo != null ? m.msg.contextInfo.mentionedJid : []
            var mention = typeof(tagMention) == 'string' ? [tagMention] : tagMention
            mention != undefined ? mention.push(quotedMention) : []
            m.mentionUser = mention != undefined ? mention.filter(x => x) : []
            
            // --- ILB & Button Support Added ---
            m.body = (m.type === 'conversation') ? m.msg : 
                     (m.type === 'extendedTextMessage') ? m.msg.text : 
                     (m.type == 'imageMessage') && m.msg.caption ? m.msg.caption : 
                     (m.type == 'videoMessage') && m.msg.caption ? m.msg.caption : 
                     (m.type == 'interactiveResponseMessage') ? (() => {
                        try { return JSON.parse(m.msg.nativeFlowResponseMessage?.paramsJson)?.id || m.msg.nativeFlowResponseMessage?.paramsJson || ''; } catch { return m.msg.nativeFlowResponseMessage?.paramsJson || ''; }
                     })() :
                     (m.type == 'templateButtonReplyMessage') && m.msg.selectedId ? m.msg.selectedId : 
                     (m.type == 'buttonsResponseMessage') && m.msg.selectedButtonId ? m.msg.selectedButtonId : 
                     m.msg.text || m.msg.caption || ''

            m.quoted = m.msg.contextInfo != undefined ? m.msg.contextInfo.quotedMessage : null
            if (m.quoted) {
                m.quoted.type = getContentType(m.quoted)
                m.quoted.id = m.msg.contextInfo.stanzaId
                m.quoted.sender = m.msg.contextInfo.participant
                m.quoted.fromMe = m.quoted.sender ? m.quoted.sender.split('@')[0].includes(sock.user.id.split(':')[0]) : false
                m.quoted.msg = (m.quoted.type === 'viewOnceMessage' || m.quoted.type === 'viewOnceMessageV2') ? m.quoted[m.quoted.type].message[getContentType(m.quoted[m.quoted.type].message)] : m.quoted[m.quoted.type]
                
                m.quoted.fakeObj = proto.WebMessageInfo.fromObject({
                    key: { remoteJid: m.chat, fromMe: m.quoted.fromMe, id: m.quoted.id, participant: m.quoted.sender },
                    message: m.quoted
                })
                m.quoted.download = (filename) => downloadMediaMessage(m.quoted, filename)
                m.quoted.delete = () => sock.sendMessage(m.chat, { delete: m.quoted.fakeObj.key })
                m.quoted.react = (emoji) => sock.sendMessage(m.chat, { react: { text: emoji, key: m.quoted.fakeObj.key } })
            }
        }
        m.download = (filename) => downloadMediaMessage(m, filename)
    }
    
    // Short replies
    m.reply = (teks, id = m.chat, option = { mentions: [m.sender] }) => sock.sendMessage(id, { text: teks, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
    m.replyImg = (img, teks, id = m.chat, option = { mentions: [m.sender] }) => sock.sendMessage(id, { image: img, caption: teks, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
    m.replyVid = (vid, teks, id = m.chat, option = { mentions: [m.sender], gif: false }) => sock.sendMessage(id, { video: vid, caption: teks, gifPlayback: option.gif, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
    m.replyAud = (aud, id = m.chat, option = { mentions: [m.sender], ptt: false }) => sock.sendMessage(id, { audio: aud, ptt: option.ptt, mimetype: 'audio/mpeg', contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
    m.replyDoc = (doc, id = m.chat, option = { mentions: [m.sender], filename: 'file.pdf', mimetype: 'application/pdf' }) => sock.sendMessage(id, { document: doc, mimetype: option.mimetype, fileName: option.filename, contextInfo: { mentionedJid: option.mentions } }, { quoted: m })
    m.react = (emoji) => sock.sendMessage(m.chat, { react: { text: emoji, key: m.key } })
    
    return m
}

module.exports = { sms, downloadMediaMessage }