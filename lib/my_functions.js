const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');

// ========= 🎀 CINESUBZ API HELPERS 🎀 =========

async function fetchJson(url, options = {}) {
    try {
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*'
            },
           ...options
        });
        return res.data;
    } catch (err) {
        console.log(chalk.red(`[fetchJson Error] ${err.message}`));
        return { error: true, data: [], message: err.message };
    }
}

async function getBuffer(url, options = {}) {
    try {
        const res = await axios({
            method: 'get',
            url,
            headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 },
           ...options,
            responseType: 'arraybuffer'
        });
        return res.data;
    } catch (err) {
        console.log(chalk.red(`[getBuffer Error] ${err.message}`));
        return null;
    }
}

// ========= ✨ YUMI COMMON FUNCTIONS ✨ =========

const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000);

const generateMessageTag = (epoch) => {
    let tag = unixTimestampSeconds().toString();
    if (epoch) tag += '.--' + epoch;
    return tag;
}

const getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
}

const runtime = function(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    return `${d > 0? d + ' day, ' : ''}${h > 0? h + ' hour, ' : ''}${m > 0? m + ' minute, ' : ''}${s} second`;
}

const clockString = (ms) => {
    let h = isNaN(ms)? '--' : Math.floor(ms / 3600000);
    let m = isNaN(ms)? '--' : Math.floor(ms / 60000) % 60;
    let s = isNaN(ms)? '--' : Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'));
}

const bytesToSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

// ========= 💖 GIRL VIBE UI MAKER 💖 =========

function girlBox(title, text) {
    return `╭───🎀 *${title}* 🎀───╮\n${text}\n╰───💖───╯`;
}

function girlSearchCard(movie, index) {
    return `*${index}. ${movie.title}*\n 🗓️ ${movie.year || '2024'} | 🎬 ${movie.quality || 'HD'}\n ✨ Sinhala Sub ✅\n`;
}

module.exports = {
    fetchJson,
    getBuffer,
    unixTimestampSeconds,
    generateMessageTag,
    getRandom,
    runtime,
    clockString,
    sleep,
    isUrl,
    bytesToSize,
    girlBox,
    girlSearchCard
};