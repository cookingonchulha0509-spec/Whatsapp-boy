const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
    // Direct HD Image URL for easy scanning
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
    console.log('👇 HD QR Code Link (Browser mein open karein) 👇');
    console.log(qrLink);
});

client.on('ready', () => {
    console.log('Professional Groq AI Bot is Online and Ready!');
});

client.on('message', async msg => {
    // Status aur Groups ko ignore karo taaki spam na ho
    if (msg.from === 'status@broadcast') return;
    if (msg.from.includes('@g.us')) {
        console.log('Group message ignore kiya gaya.');
        return;
    }

    try {
        console.log(`New Client Message: ${msg.body}`);
        
        // Groq API Call (Using Llama 3 70B for highly professional responses)
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
                // APNI GROQ API KEY YAHAN DAALEIN
                'Authorization': `Bearer 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`, 
                'Content-Type': 'application/json'
            }
        });

        const aiReply = response.data.choices[0].message.content;
        msg.reply(aiReply);

    } catch (error) {
        console.error('Groq API Error:', error.response ? error.response.data : error.message);
        // Error message bhi professional hona chahiye
        msg.reply('Maaf kijiye, humara system abhi ek update process kar raha hai. Kripaya thodi der baad sampark karein. Thank you for your patience.');
    }
});

client.initialize();
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
