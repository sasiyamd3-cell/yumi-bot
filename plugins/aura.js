const { cmd } = require('../command');

cmd({
    pattern: "aura",
    alias: ["aurascan"],
    react: "💀",
    desc: "Calculate aura score of a user",
    category: "fun",
    use: ".aura @user OR reply",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, sender }) => {
    try {
      await conn.sendMessage(from, { react: { text: "💀", key: mek.key } });

      const thumb = "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg";
      const channelJid = "120363429003638511@newsletter";
      const channelUrl = "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g";

      const OWNER_NUMBERS = ["94776903338", "94742184347"];

      const getContext = (title, body) => ({
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelJid,
          newsletterName: "Yumi Mini V1 😽",
          serverMessageId: -1
        },
        externalAdReply: {
          title, body, mediaType: 1, thumbnailUrl: thumb,
          sourceUrl: channelUrl, renderLargerThumbnail: true, showAdAttribution: true
        }
      });

      if (!isGroup) {
        return await conn.sendMessage(from, {
          text: `❌ මේක groups වල විතරයි වැඩ කරන්නෙ බන්`,
          contextInfo: getContext("Group Only ❌", "Aura Scan")
        }, { quoted: mek });
      }

      let target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
      if (!target) {
        return await conn.sendMessage(from, {
          text: `❌ mention එකක් හරි reply එකක් හරි දාන්න`,
          contextInfo: getContext("Need User ❌", "Aura")
        }, { quoted: mek });
      }

      const targetNumber = target.split("@")[0];
      const targetName = targetNumber;
      const senderName = sender.split("@")[0];

      let auraScore;

      if (OWNER_NUMBERS.includes(targetNumber)) {
        auraScore = 997;
      } else {
        const seed = targetNumber;
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
          hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        auraScore = (Math.abs(hash % 800) + 1);
      }

      const auraTiers = [
        { range: [1, 150], emoji: "⚫", title: "VOID SOUL", text: "Dark and chaotic… stay away! 💀", color: "Black aura detected" },
        { range: [151, 300], emoji: "🌫️", title: "SHADOW", text: "Cloudy and mysterious… can't be trusted fully. 👁️", color: "Grey mist" },
        { range: [301, 450], emoji: "🌙", title: "MYSTIC", text: "Quiet but dangerous… deep thinker energy. 🧠", color: "Moonlight glow" },
        { range: [451, 600], emoji: "🌊", title: "BALANCED", text: "Calm and peaceful… good vibes only. 🕊️", color: "Ocean blue" },
        { range: [601, 750], emoji: "🔥", title: "INFERNO", text: "Fiery and powerful… you light up the room! ⚡", color: "Fire storm" },
        { range: [751, 900], emoji: "✨", title: "CELESTIAL", text: "Rare aura… shining brighter than others! 🌟", color: "Star dust" },
        { range: [901, 1000], emoji: "👑", title: "DIVINE", text: "Legendary and godlike… one of a kind! 🔱 Yumi's fav 😽", color: "Divine gold" }
      ];

      const aura = auraTiers.find(d => auraScore >= d.range[0] && auraScore <= d.range[1]) || auraTiers[3];

      let ppUrl;
      try { ppUrl = await conn.profilePictureUrl(target, 'image') }
      catch { ppUrl = thumb }

      const barLength = 10;
      const filled = Math.floor((auraScore / 1000) * barLength);
      const bar = "█".repeat(filled) + "░".repeat(barLength - filled);

      const caption = `╭─〔 *${aura.emoji} YUMI • AURA SCAN ${aura.emoji}* 〕─
│
│ 👤 *Target* : @${targetName}
│ 📊 *Score* : *${auraScore}/1000* ${aura.emoji}
│ 🏷️ *Rank* : *${aura.title}*
│ 🎨 *Vibe* : ${aura.color}
│
│ ${bar} ${auraScore > 900? "🔥" : "💫"}
│
│ > ${aura.text}
│
│ ${OWNER_NUMBERS.includes(targetNumber)? "│ 👑 *Owner Aura Boosted!* 👑\n│\n" : ""}╰─〔 *Bunny Xmd Dev* 〕─

> _Scanned by @${senderName} • Yumi Mini V1 😽_`;

      await conn.sendMessage(from, {
        image: { url: ppUrl },
        caption: caption,
        mentions: [target, sender],
        contextInfo: getContext(`${aura.emoji} ${aura.title} • ${auraScore}/1000`, `${aura.text.slice(0, 50)}`)
      }, { quoted: mek });

      await conn.sendMessage(from, { react: { text: aura.emoji, key: mek.key } });

    } catch (e) {
      console.log(e);
      await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
      await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});