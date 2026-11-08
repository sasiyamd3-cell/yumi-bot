const { cmd } = require('../command');
const { getAnti, setAnti } = require('../data');
const { sendAntiMenu } = require('../lib/antidelete');

cmd({
    pattern: "antidel",
    alias: ["antidelete"],
    react: "👁️",
    desc: "Anti Delete ILB Control",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, args, isGroup }) => {
    if (!isOwner) return m.reply("❌ Owner Only!");
    
    const type = args[0]?.toLowerCase(); // gc / dm / status
    const action = args[1]?.toLowerCase(); // on / off

    if ((type === 'gc' || type === 'dm') && (action === 'on' || action === 'off')) {
        await setAnti(type, action === 'on');
        return m.reply(`✅ Anti Delete *${type.toUpperCase()}* ${action.toUpperCase()} කළා!`);
    }
    if (type === 'status') {
        const gc = await getAnti('gc');
        const dm = await getAnti('dm');
        return m.reply(`*AntiDel Status*\n\nGC: ${gc ? 'ON 🟢' : 'OFF 🔴'}\nDM: ${dm ? 'ON 🟢' : 'OFF 🔴'}`);
    }
    // ILB Menu Show
    await sendAntiMenu(conn, from, mek, isGroup);
});