// YUMI MINI V1 - COMMAND.JS - FIXED & UPGRADED
// Owner: 94742184347 | Channel: 120363429003638511@newsletter

let commands = [];

function cmd(info, func) {
    // Validation - pattern නැත්තම් on එකක් තියෙන්න ඕන
    if (!info.pattern && !info.on) {
        console.log(`⚠️ Command skipped (no pattern/on): ${info.filename || 'unknown'}`);
        return null;
    }

    let data = {
        pattern: info.pattern ? info.pattern.toLowerCase() : null, // FIX: lowercase
        alias: info.alias ? info.alias.map(a => a.toLowerCase()) : [], // FIX: lowercase aliases
        desc: info.desc || "",
        category: info.category || "misc",
        react: info.react || "💖",
        filename: info.filename || "unknown",
        use: info.use || "",
        dontAddCommandList: info.dontAddCommandList || false,
        on: info.on || null, // for body, image, sticker events
        fromMe: info.fromMe || false,
        function: func
    };
    
    commands.push(data);
    console.log(`✅ Loaded: ${data.pattern || data.on} [${data.category}]`);
    return data;
}

module.exports = {
    cmd,
    AddCommand: cmd, // FIX: පරණ plugins වලට support
    Function: cmd,
    Module: cmd,
    commands
};