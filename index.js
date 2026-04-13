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
    // 1. Faltu updates aur Groups ko puri tarah ignore karo
    if (msg.from === 'status@broadcast') return;
    if (msg.from.includes('@g.us')) {
        console.log('Group message ignore kiya.');
        return;
    }

    try {
        console.log(`Naya message aaya: ${msg.body}`);
        
        // Nvidia Nemotron API Call with Strong Headers
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
                // DHYAN RAHE: Niche wali line mein YOUR_API_KEY_HERE ki jagah apni key dalo
                'Authorization': `Bearer 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`, 
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com/ai-wa-bot', 
                'X-Title': 'WhatsApp Bot'
            }
        });

        const aiReply = response.data.choices[0].message.content;
        msg.reply(aiReply);

    } catch (error) {
        // Asli error console mein print hoga taaki humein exact bimari pata chale
        console.error('API Error ka Asli Reason:', error.response ? error.response.data : error.message);
        msg.reply('Thoda system stress aaya hai bhai, API server load nahi le raha. Ek minute baad try karna.');
    }
});

client.initialize();
