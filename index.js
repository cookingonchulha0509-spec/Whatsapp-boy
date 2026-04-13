const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

// WhatsApp Client Setup (LocalAuth se baar-baar scan nahi karna padega)
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
    // Terminal ke kachre ki jagah direct HD Image URL dega
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
    console.log('👇 Bhai, terminal wala QR chhod, is naye link ko copy karke browser mein khol 👇');
    console.log(qrLink);
    console.log('Link kholte hi ekdam saaf HD QR aayega, usko fatafat scan maar le!');
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
                'Authorization': `Bearer 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`, 
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
