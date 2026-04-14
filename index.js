const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

// 1. Professional HD QR Link Generator
client.on('qr', (qr) => {
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
    console.log('👇 HD QR Code Link (Browser mein open karein) 👇');
    console.log(qrLink);
});

client.on('ready', () => {
    console.log('Innovation Hub Groq AI Bot is Online and Ready!');
});
