const { cmd } = require('../command');

// ===== YUMI MINI CONFIG - MENU එක ඇතුලෙම! =====
const config = {
    PREFIX: ".",
    BOT_NAME: "YUMI MINI V1",
    OWNER: "Bunny Xmd Dev",
    THUMB: "https://database.ominisave.store/image/OMINISAVE_1791213591965_33S93R.jpg",
    CHANNEL_JID: "120363429003638511@newsletter",
    CHANNEL_URL: "https://whatsapp.com/channel/0029Vb9Tr8N1XquQLu4Ryh0g",
    MENU_SONG: "https://u.pone.rs/lwxertva.mp3"
};
// ==============================================

cmd({
    pattern: "menu",
    alias: ["help", "list", "allmenu", "yumi", "cmds"],
    react: "🎀",
    desc: "Show all commands",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const uptime = () => {
            let sec = process.uptime();
            let d = Math.floor(sec / 86400);
            let h = Math.floor((sec % 86400) / 3600);
            let mm = Math.floor((sec % 3600) / 60);
            let s = Math.floor(sec % 60);
            if(d>0) return `${d}d ${h}h ${mm}m ${s}s`;
            return `${h}h ${mm}m ${s}s`;
        };

        const prefix = config.PREFIX;
        const thumb = config.THUMB;
        const channelJid = config.CHANNEL_JID;
        const menuSong = config.MENU_SONG;

        let caption = `
╭─〔 🎀 *${config.BOT_NAME}* 🎀 〕─
│
│  👤 *User:* ${m.pushName || "princess"} 💖
│  ⏱️ *Uptime:* ${uptime()}
│  🌸 *Prefix:* ${prefix}
│  💝 *Owner:* ${config.OWNER}
│  👥 *Active:* ${Object.keys(global.activeSockets||{}).length} users
│
╰─────────────────╯

╭─〔 💋 *YUMI DUAL GF* 🎀 〕─
│ 🇱🇰 *Sinhala + English Dual!*
│ • ${prefix}yumigf si oyata kohomada
│ • ${prefix}yumigf en i miss you
│ • ${prefix}yumigf both mama oyata adarei
│ • ${prefix}kiss / hug / loveu / missu
╰──────────────

╭─〔 💀 *Bunny api ban Check* 🔍 〕─
│ 📱 *WhatsApp Ban Checker*
│ • ${prefix}bancheck 947123456789
│ • ${prefix}ban 94771234567
│ • ${prefix}bunnyban 0712345678
╰──────────────

╭─〔 🎬 *CINESUBZ* 〕─
│ • ${prefix}cinesubz <name>
│ • ${prefix}cinesubz details 1
│ • ${prefix}cinesubz dl 1
╰──────────────

╭─〔 👑 *GROUP MANAGER* 💎 〕─
│ 🆕 *NEW - PRO Group Control!*
│ • ${prefix}gsettings - Show group settings
│ • ${prefix}mute 5m - Mute 5min / 1h / 1d
│ • ${prefix}unmute - Unmute group
│ • ${prefix}lock - Lock group settings
│ • ${prefix}unlock - Unlock group
│ • ${prefix}gname new name - Change name
│ • ${prefix}gdesc new desc - Change desc
│ • ${prefix}gpp - Set group PP (reply img)
│ • ${prefix}add 9471xxxxxxx - Add member
│ • ${prefix}invite - Get invite link
│ • ${prefix}revoke - Reset invite link
│ • ${prefix}join https://... - Join via link
│ • ${prefix}leave - Leave group
│ • ${prefix}gmanager - Full menu
╰──────────────

╭─〔 🛡️ *SECURITY MANAGER* 🔥 〕─
│ 🆕 *NEW - Bot Security System!*
│ • ${prefix}security - Security menu
│ • ${prefix}anticall on/off - Block calls
│ • ${prefix}antibot on/off - Remove bots
│ • ${prefix}owneronly on/off - Owner only
│ • ${prefix}antibot add 94xx - Block bot num
│ • ${prefix}callblock 94xx - Block caller
│ • ${prefix}security check - Status
╰──────────────

╭─〔 🕵️‍♂️ *STALKER PRO* 👁️ 〕─
│ 🆕 *NEW - Profile Stalker!*
│ • ${prefix}stalk @user - Full info
│ • ${prefix}stalk 9471xxxxxxx - By number
│ • ${prefix}pp @user - HD Profile Pic
│ • ${prefix}getpp @user - HD PP
│ • Reply + ${prefix}stalk - Stalk replied
╰──────────────

╭─〔 👑 *GROUP ADMIN* 〕─
│ • ${prefix}admin - group admins list
│ • ${prefix}promote @tag / reply
│ • ${prefix}demote / adminadd / adminremove
│ • ${prefix}ban / unban / banlist
│ • ${prefix}kick @tag / reply
│ • ${prefix}kickall - remove all
│ • ${prefix}mute - mute group
│ • ${prefix}antilink on / off / kick
│ • ${prefix}creact - custom react
╰──────────────

╭─〔 🎥 *DOWNLOADER* 〕─
│ • ${prefix}video - yt video
│ • ${prefix}mp4 - yt mp4
│ • ${prefix}mp3 - yt mp3 / song
│ • ${prefix}fb - facebook dl
│ • ${prefix}insta - instagram dl
│ • ${prefix}tt - tiktok dl
│ • ${prefix}url - url to media
│ • ${prefix}img - image search
│ • ${prefix}pinters - pinterest dl
│ • ${prefix}dl - All in one downloder
╰──────────────

╭─〔 ⚙️ *TOOLS & INFO* 〕─
│ • ${prefix}getdp - get profile pic
│ • ${prefix}vv - view once bypass
│ • ${prefix}info - bot info
│ • ${prefix}dev - developer info
│ • ${prefix}ping - bot speed
│ • ${prefix}jid - get jid
│ • ${prefix}setting - bot settings
│ • ${prefix}spair - sub bot pair
│ • ${prefix}pair - bot pair
│ • ${prefix}bomb - msg bomb
│ • ${prefix}ss - web screenshot
│ • ${prefix}webss - web ss
╰──────────────

╭─〔 💀 *FUN* 〕─
│ • ${prefix}aura @tag / reply
│ • ${prefix}prankmenu - Prank 40
╰──────────────

╭─〔 👁️ *OWNER* 〕─
│ • ${prefix}autoreply on / off / list
│ • ${prefix}antidel gc on / dm on / status
│ • ${prefix}antidelete / antidel
╰──────────────

╭─〔 ✨ *MAIN* 〕─
│ • ${prefix}alive / bot / yumi
│ • ${prefix}menu / help / allmenu
╰──────────────

╭─〔 📊 *MULTI-USER POLL VOTE* 🔥 〕─
│ 🗳️ *Bot Users ලා Poll වලට Vote දානවා!*
│ • ${prefix}cpoll on - Auto vote ON ✅
│ • ${prefix}cpoll off - OFF ❌
│ • ${prefix}cpoll opt 1 - 1st option vote
│ • ${prefix}cpoll opt 2 - 2nd option
│ • ${prefix}cpoll random - Random vote 🎲
│ • ${prefix}cpoll vote 1 - Manual vote (all users)
│ • ${prefix}cpoll force 1 - All polls vote 🚀
│ • ${prefix}cpoll add/list - Channel add/list
╰──────────────

╭─〔 ❤️ *MULTI-USER CHANNEL REACT* 💣 〕─
│ 🔥 *Bot Users ලා React දානවා!*
│ • ${prefix}creact on - Auto react ON ✅
│ • ${prefix}creact off - OFF ❌
│ • ${prefix}creact emoji ❤️ 🔥 🎀 - Set emojis
│ • ${prefix}creact random - Random emoji ON/OFF 🎲
│ • ${prefix}creact react ❤️ - Manual react (all)
│ • ${prefix}creact bomb ❤️ - REACT BOMB! 💣 3x
│ • ${prefix}creact add/list/stats - Channel list
╰──────────────

╭─〔 😂 *PRANK KING 40* 🤣 〕─
│ 🎭 *Prank.js - 40 Commands!*
│ • ${prefix}prankmenu - All 40 List
│ • ${prefix}fakehack @user - Hack Prank
│ • ${prefix}fakeban @user - Ban Prank
│ • ${prefix}fakekick @user - Kick Prank
│ • ${prefix}fakeblock @user - Block Prank
│ • ${prefix}fakevirus - Virus Prank
│ • ${prefix}fakecall @user - Missed Call
│ • ${prefix}fakepolice @user - Police Prank
│ • ${prefix}fakeotp - Fake OTP
│ • ${prefix}fakebalance - Bank 5 Lakh
│ • ${prefix}fakeiphone @user - iPhone Win
│ • ${prefix}fakegift @user - Gift Prank
│ • ${prefix}fakelottery - Lottery Win
│ • ${prefix}fakemarriage @user - Marry 💍
│ • ${prefix}fakebreakup @user - Breakup 💔
│ • ${prefix}fakeexam @user - Exam Fail
│ • ${prefix}fakejob @user - Google Job
│ • ${prefix}fakedelete @user - Delete Msg
│ • ${prefix}fakelocation @user - Location
│ • ${prefix}fakebattery - Battery 1%
│ • ${prefix}fakewifi @user - Wifi Hack
│ • ${prefix}fakegf @user - New GF ❤️
│ • ${prefix}fakebf @user - New BF 💙
│ • ${prefix}fakepregnant @user - Pregnant
│ • ${prefix}fakehospital @user - Hospital
│ • ${prefix}fakecrush @user - Crush
│ • ${prefix}fakemoney @user - Money Ask
│ • ${prefix}fakeadmin @user - New Admin
│ • ${prefix}fakeowner @user - New Owner
│ • ${prefix}fakeverified @user - Blue Tick
│ • ${prefix}fakeghost @user - Ghost 👻
│ • ${prefix}fakecharge - Charging 200%
│ • ${prefix}fakeupdate - WA Update
│ • ${prefix}fakesim @user - SIM Block
│ • ${prefix}fakeleak @user - Photo Leak
│ • ${prefix}fakefight @user - Fight
│ • ${prefix}fakearrest @user - Arrested
│ • ${prefix}fakebus @user - Bus Missed
│ • ${prefix}fakerain @user - Rain
│ • ${prefix}fakesleep @user - Sleeping
╰──────────────

> _cute • fast • powerful >.<_
> _Yumi Mini V1 😽 • Bunny Xmd Dev_
> _Prefix: ${prefix} | New: Prank King 40! 😂🎭_
> _Poll+React: ${Object.keys(global.activeSockets||{}).length} users voting! 📊❤️_
`.trim();

        await conn.sendMessage(from, {
            text: caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: channelJid,
                    newsletterName: "Yumi Mini V1 😽💝",
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: "Yumi Mini V1 🎀 | Bunny Xmd Dev",
                    body: `Prefix: ${prefix} | New: Prank King 40! | Tap to follow`,
                    mediaType: 1,
                    thumbnailUrl: thumb,
                    sourceUrl: config.CHANNEL_URL,
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

        await new Promise(r => setTimeout(r, 600));
        await conn.sendMessage(from, {
            audio: { url: menuSong },
            mimetype: 'audio/mpeg',
            ptt: true,
            waveform: [10,20,35,50,80,60,40,90,100,75,50,30,20,10,40,60,80,100,90,70,50],
            contextInfo: {
                externalAdReply: {
                    title: "🎀 Yumi Mini Voice 💖",
                    body: "Bunny Xmd • Menu Vibes 🎵",
                    mediaType: 1,
                    thumbnailUrl: thumb,
                    sourceUrl: config.CHANNEL_URL,
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        await conn.sendMessage(from, { text: `❌ Error: ${e.message}` }, { quoted: mek });
    }
});