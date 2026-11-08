const { cmd } = require('../command');

function prankCmd(pattern, alias, textFn) {
    cmd({ pattern, alias, react: "😂", desc: "Prank: " + pattern, category: "prank", filename: __filename },
    async (conn, mek, m, { from, q, reply, senderNumber, pushname, mentionedJid }) => {
        let target = mentionedJid && mentionedJid[0] ? "@" + mentionedJid[0].split('@')[0] : (q || pushname);
        let txt = textFn(target, pushname, senderNumber, q);
        await conn.sendMessage(from, { text: txt, mentions: mentionedJid || [] }, { quoted: mek });
    });
}

// 1. FAKE HACK
prankCmd("fakehack", ["hack"], (t) => `⚠️ *HACKING STARTED...*\n\n👤 Target: ${t}\n📱 Hacking WhatsApp...\n🔓 Getting Password...\n📸 Getting Photos...\n\n▓▓▓▓▓▓▓▓▓▓ 100%\n\n✅ *HACKED!* 😂\nJust Prank! No one hacked!`);

// 2. FAKE BAN
prankCmd("fakeban", ["ban"], (t) => `🚫 *WHATSAPP BANNED!*\n\n👤 ${t} is Banned!\nReason: Spamming\nDuration: 24 Hours\n\n> This is Prank 😂`);

// 3. FAKE KICK
prankCmd("fakekick", ["kickprank"], (t) => `❌ *${t} was removed from group!*\n\nReason: Bad Behaviour\nBy: Admin\n\n> Prank! Nobody removed 😂`);

// 4. FAKE BLOCK
prankCmd("fakeblock", ["blockprank"], (t) => `🚫 *You have been BLOCKED by ${t}*\n\nYou can't message anymore!\n> Prank! 😂`);

// 5. FAKE VIRUS
prankCmd("fakevirus", ["virus"], (t) => `🦠 *VIRUS DETECTED!*\n\n📱 Your phone has 5 virus!\n🔋 Battery: 2%\n📸 Photos deleting...\n\n😂 Prank! Your phone is safe!`);

// 6. FAKE CALL
prankCmd("fakecall", ["missedcall"], (t) => `📞 *Missed Call (12)*\nFrom: ${t}\nTime: Now\n\nCall back? 😂 Prank!`);

// 7. FAKE POLICE
prankCmd("fakepolice", ["police"], (t) => `👮 *POLICE ALERT!*\n\n${t} is wanted!\nCrime: Stealing my heart ❤️\n\n😂 Prank!`);

// 8. FAKE OTP
prankCmd("fakeotp", ["otp"], (t) => `🔐 *OTP: 894521*\n\nDo not share this code!\nFrom: WhatsApp\n\n😂 Prank OTP! Fake!`);

// 9. FAKE BALANCE
prankCmd("fakebalance", ["balance"], (t) => `💰 *BANK ALERT*\n\nRs. 500,000.00 credited to your account!\nFrom: YUMI MINI\nBalance: Rs. 999,999\n\n😂 Prank! No money!`);

// 10. FAKE IPHONE
prankCmd("fakeiphone", ["iphone"], (t) => `🎉 *CONGRATULATIONS ${t}!*\n\nYou won iPhone 16 Pro Max!\nClaim: Click link\n\n😂 Prank! No iPhone!`);

// 11. FAKE GIFT
prankCmd("fakegift", ["gift"], (t) => `🎁 *GIFT FOR YOU!*\n\n${t} sent you a gift!\nOpen: https://fake-gift.com\n\n😂 Prank!`);

// 12. FAKE LOTTERY
prankCmd("fakelottery", ["lottery"], (t) => `🏆 *YOU WON LOTTERY!*\n\nTicket No: 12345\nPrize: Rs. 10 LAKHS!\n\n😂 Prank!`);

// 13. FAKE MARRIAGE
prankCmd("fakemarriage", ["marry"], (t) => `💍 *MARRIAGE PROPOSAL!*\n\n${t} wants to marry you!\nSay YES? ❤️\n\n😂 Prank!`);

// 14. FAKE BREAKUP
prankCmd("fakebreakup", ["breakup"], (t) => `💔 *BREAKUP!*\n\n${t} broke up with you!\nReason: You are too cute!\n\n😂 Prank!`);

// 15. FAKE EXAM
prankCmd("fakeexam", ["exam"], (t) => `📚 *EXAM RESULT!*\n\n${t} - FAILED!\nMarks: 02/100\n\n😂 Prank! You passed!`);

// 16. FAKE JOB
prankCmd("fakejob", ["job"], (t) => `💼 *JOB OFFER!*\n\n${t} selected for Google!\nSalary: Rs. 500,000/month\n\n😂 Prank!`);

// 17. FAKE DELETE
prankCmd("fakedelete", ["deleted"], (t) => `🗑️ *MESSAGE DELETED!*\n\n${t} deleted 100 messages!\n\n😂 Prank!`);

// 18. FAKE LOCATION
prankCmd("fakelocation", ["location"], (t) => `📍 *LIVE LOCATION*\n\n${t} is at: Colombo, Galle Face\nDistance: 2km\n\n😂 Prank Location!`);

// 19. FAKE BATTERY
prankCmd("fakebattery", ["battery"], (t) => `🔋 *BATTERY LOW!*\n\nBattery: 1%\nPhone will shutdown in 10 sec!\n\n😂 Prank!`);

// 20. FAKE WIFI
prankCmd("fakewifi", ["wifi"], (t) => `📶 *WIFI HACKED!*\n\n${t} is using your WiFi!\nPassword changed!\n\n😂 Prank!`);

// 21. FAKE GF
prankCmd("fakegf", ["gf"], (t) => `❤️ *NEW GF!*\n\n${t} is your new girlfriend!\nLove: 100%\n\n😂 Prank!`);

// 22. FAKE BF
prankCmd("fakebf", ["bf"], (t) => `💙 *NEW BF!*\n\n${t} is your new boyfriend!\n\n😂 Prank!`);

// 23. FAKE PREGNANT
prankCmd("fakepregnant", ["pregnant"], (t) => `🤰 *PREGNANT!*\n\n${t} is pregnant!\nBaby coming soon!\n\n😂 Prank!`);

// 24. FAKE HOSPITAL
prankCmd("fakehospital", ["hospital"], (t) => `🏥 *HOSPITAL!*\n\n${t} admitted to hospital!\nReason: Too much laughing!\n\n😂 Prank!`);

// 25. FAKE CRUSH
prankCmd("fakecrush", ["crush"], (t) => `😍 *SECRET CRUSH!*\n\n${t} has crush on you!\nSince: 2 years!\n\n😂 Prank!`);

// 26. FAKE MONEY ASK
prankCmd("fakemoney", ["money"], (t) => `💸 *MONEY REQUEST*\n\n${t} asking Rs. 5000 from you!\nReason: Urgent!\n\n😂 Prank!`);

// 27. FAKE ADMIN
prankCmd("fakeadmin", ["admin"], (t) => `👑 *NEW ADMIN!*\n\n${t} is now Group Admin!\nPower: Unlimited!\n\n😂 Prank!`);

// 28. FAKE OWNER
prankCmd("fakeowner", ["owner"], (t) => `👑 *BOT OWNER CHANGED!*\n\nNew Owner: ${t}\nOld Owner Removed!\n\n😂 Prank!`);

// 29. FAKE VERIFIED
prankCmd("fakeverified", ["verified"], (t) => `✅ *VERIFIED!*\n\n${t} got Blue Tick! ✅\nNow Celebrity!\n\n😂 Prank!`);

// 30. FAKE GHOST
prankCmd("fakeghost", ["ghost"], (t) => `👻 *GHOST DETECTED!*\n\nGhost behind ${t}!\nRun! 👻\n\n😂 Prank!`);

// 31. FAKE CHARGE
prankCmd("fakecharge", ["charge"], (t) => `⚡ *PHONE CHARGING!*\n\nCharging: 200%\nExplosion in 5 sec! 💥\n\n😂 Prank!`);

// 32. FAKE UPDATE
prankCmd("fakeupdate", ["update"], (t) => `🔄 *WHATSAPP UPDATE!*\n\nWhatsApp will delete in 1 hour!\nUpdate now!\n\n😂 Prank!`);

// 33. FAKE SIM
prankCmd("fakesim", ["sim"], (t) => `📱 *SIM BLOCKED!*\n\n${t} SIM blocked!\nReason: No recharge\n\n😂 Prank!`);

// 34. FAKE PHOTO LEAK
prankCmd("fakeleak", ["leak"], (t) => `📸 *PHOTO LEAKED!*\n\n${t} photo leaked on internet!\nViews: 1M\n\n😂 Prank! No leak!`);

// 35. FAKE FIGHT
prankCmd("fakefight", ["fight"], (t) => `🥊 *FIGHT!*\n\n${t} wants to fight you!\nPlace: School Ground\nTime: Tomorrow 4PM\n\n😂 Prank!`);

// 36. FAKE ARREST
prankCmd("fakearrest", ["arrest"], (t) => `🚓 *ARRESTED!*\n\n${t} arrested by Police!\nCrime: Too handsome/beautiful!\n\n😂 Prank!`);

// 37. FAKE BUS
prankCmd("fakebus", ["bus"], (t) => `🚌 *BUS MISSED!*\n\n${t} missed bus!\nNext bus: Tomorrow!\n\n😂 Prank!`);

// 38. FAKE RAIN
prankCmd("fakerain", ["rain"], (t) => `🌧️ *HEAVY RAIN!*\n\nRain at ${t} location!\nBring umbrella!\n\n😂 Prank!`);

// 39. FAKE SLEEP
prankCmd("fakesleep", ["sleep"], (t) => `😴 *${t} IS SLEEPING!*\n\nDo not disturb!\nSnoring: 100dB\n\n😂 Prank!`);

// 40. FAKE PRANK MENU
cmd({ pattern: "prankmenu", alias: ["pranklist", "pranks"], react: "😂", desc: "Prank List", category: "prank", filename: __filename },
async (conn, mek, m, { from, reply }) => {
    return reply(`*😂 PRANK 40 COMMANDS - YUMI MINI* 🎀

1. .fakehack @user
2. .fakeban @user
3. .fakekick @user
4. .fakeblock @user
5. .fakevirus
6. .fakecall @user
7. .fakepolice @user
8. .fakeotp
9. .fakebalance
10. .fakeiphone @user
11. .fakegift @user
12. .fakelottery
13. .fakemarriage @user
14. .fakebreakup @user
15. .fakeexam @user
16. .fakejob @user
17. .fakedelete @user
18. .fakelocation @user
19. .fakebattery
20. .fakewifi @user
21. .fakegf @user
22. .fakebf @user
23. .fakepregnant @user
24. .fakehospital @user
25. .fakecrush @user
26. .fakemoney @user
27. .fakeadmin @user
28. .fakeowner @user
29. .fakeverified @user
30. .fakeghost @user
31. .fakecharge
32. .fakeupdate
33. .fakesim @user
34. .fakeleak @user
35. .fakefight @user
36. .fakearrest @user
37. .fakebus @user
38. .fakerain @user
39. .fakesleep @user
40. .prankmenu

> All Prank Only! No Real Hack! 😂`);
});