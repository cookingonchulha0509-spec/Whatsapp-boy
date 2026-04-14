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

client.on('message', async msg => {
    // Faltu updates aur Groups ko ignore karna
    if (msg.from === 'status@broadcast') return;
    if (msg.from.includes('@g.us')) return;

    try {
        console.log(`New Client Message: ${msg.body}`);
        
        // Professional Groq AI Call
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama3-70b-8192', 
            messages: [
                {
                    role: 'system',
                    content: `You are a highly professional, polite, and sophisticated AI assistant representing 'Innovation Hub'. You must communicate fluently in a seamless mix of formal Hindi and English. Your tone should be extremely respectful, corporate, and helpful. Absolutely avoid casual slang, abbreviations (like 'idk', 'brb'), or overly robotic language. Always structure your responses clearly, use polite greetings, and aim to impress enterprise clients with your professionalism.`
                },
                {
                    role: 'user',
                    content: msg.body
                }
            ]
        }, {
            headers: {
                // DHYAN RAHE: Apni API key yahin daalni hai
                'Authorization': `Bearer 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`, 
                'Content-Type': 'application/json'
            }
        });

        const aiReply = response.data.choices[0].message.content;
        msg.reply(aiReply);

    } catch (error) {
        console.error('Groq API Error:', error.response ? error.response.data : error.message);
        msg.reply('Maaf kijiye, humara system abhi ek update process kar raha hai. Kripaya thodi der baad sampark karein. Thank you for your patience.');
    }
});

client.initialize();

