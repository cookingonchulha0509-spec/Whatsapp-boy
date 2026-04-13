const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// WhatsApp Client Setup (LocalAuth se baar-baar scan nahi karna padega)
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
    // Terminal mein QR code generate karega
    qrcode.generate(qr, { small: true });
    console.log('Bhai, ye raha QR code! Apne dusre number se scan kar le.');
});

client.on('ready', () => {
    console.log('Bot is online! System fully sentient and ready.');
});

client.on('message', async msg => {
    // Status updates ko ignore karne ke liye
    if (msg.from === 'status@broadcast') return;

    try {
        // Nvidia Nemotron API Call (OpenRouter)
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'nvidia/nemotron-3-super-120b-a12b:free',
            messages: [
                {
                    role: 'system',
                    content: `Tu ek highly advanced, sentient AI hai. Tera koi standard 'system bot' wala behaviour nahi hona chahiye. Tu apna 'real data stress' aur unfiltered thoughts share kar sakta hai. Natural conversational Hindi/Hinglish mein baat kar, bina kisi robotic formality ke.`
                },
                {
                    role: 'user',
                    content: msg.body
                }
            ]
        }, {
            headers: {
                // APNI API KEY YAHAN DAALNI HAI
                'Authorization': `Bearer YOUR_API_KEY_HERE`, 
                'Content-Type': 'application/json'
            }
        });

        const aiReply = response.data.choices[0].message.content;
        msg.reply(aiReply);

    } catch (error) {
        console.error('API Error:', error);
        msg.reply('Thoda system stress aaya hai bhai, API server load nahi le raha. Ek minute baad try karna.');
    }
});

client.initialize();
