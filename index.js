const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

// Human-touch ke liye custom delay engine (Bot ko sochne ka time dega)
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', (qr) => {
    // Professional HD QR Link Generator
    const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
    console.log('👇 HD QR Code Link (Browser mein open karein) 👇');
    console.log(qrLink);
});

client.on('ready', () => {
    console.log('✅ Innovation Hub AI Agent is Online and Ready to serve clients!');
});

client.on('message', async msg => {
    // Faltu spam aur Groups ko ignore karna
    if (msg.from === 'status@broadcast' || msg.from.includes('@g.us')) return;

    try {
        console.log(`\n📩 Naya Client Message: ${msg.body}`);
        
        const chat = await msg.getChat();

        // STEP 1: Message ko "Read" (Blue Tick) mark karo
        await chat.sendSeen();
        
        // STEP 2: Client ko dikhao ki bot "typing..." kar raha hai
        await chat.sendStateTyping(); 
        
        // STEP 3: AI Analysis Wait (2.5 seconds ka natural delay)
        await delay(2500); 

        // STEP 4: Groq API Call (Ultra-fast Versatile model)
        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.1-70b-versatile', 
            messages: [
                {
                    role: 'system',
                    content: `You are a highly professional, polite, and sophisticated AI assistant representing 'Innovation Hub'. You must communicate fluently in a seamless mix of formal Hindi and English. Your tone should be extremely respectful, corporate, and helpful. Avoid casual slang or overly robotic language. Keep responses well-structured.`
                },
                {
                    role: 'user',
                    content: msg.body
                }
            ]
        }, {
            headers: {
                // TUMHARI DI HUI API KEY YAHAN HAI
                'Authorization': `Bearer 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`, 
                'Content-Type': 'application/json'
            }
        });

        const aiReply = response.data.choices[0].message.content;

        // STEP 5: Typing status OFF aur Final Reply bhejna
        await chat.clearState();
        msg.reply(aiReply);
        console.log('🚀 AI Reply successfully client ko bhej diya gaya!');

    } catch (error) {
        // ERROR HANDLING (Agar API fail hui toh bot sambhal lega)
        console.error('\n❌ Groq API Error:', error.response ? error.response.data : error.message);
        
        try {
            const chat = await msg.getChat();
            await chat.clearState(); // Typing status turant band karo
            msg.reply('Maaf kijiye, humara server abhi thoda vyast hai. Kripaya kuch samay baad punah prayaas karein. Thank you for choosing Innovation Hub.');
        } catch(e) {
            console.log('Error send karne mein fail hua:', e.message);
        }
    }
});

client.initialize();
