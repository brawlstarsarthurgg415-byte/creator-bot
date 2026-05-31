const { Client, GatewayIntentBits } = require('discord.js');

// Configuração do Bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ]
});

// Variáveis de Controle
let moderacaoAtiva = true; 
const badwords = ['palavrao1', 'palavrao2', 'feio', 'bobo'];

// Quando o bot ligar
client.on('ready', () => {
    console.log(`🚀 Creator Bot está online e operante!`);
    client.user.setActivity('Protegendo o servidor', { type: 'PLAYING' });
});

// O "Cérebro" do bot - Onde tudo acontece
client.on('messageCreate', async (message) => {
    // Regra de ouro: não responde a si mesmo
    if (message.author.bot) return;

    const msg = message.content.toLowerCase();

    // --- COMANDOS DE CONTROLE ---
    if (msg === '!moderar on') {
        moderacaoAtiva = true;
        return message.reply('✅ Sistema de moderação ativado!');
    }
    
    if (msg === '!moderar off') {
        moderacaoAtiva = false;
        return message.reply('❌ Sistema de moderação desativado!');
    }

    if (msg === '!ping') {
        return message.reply(`🏓 Pong! Latência: ${client.ws.ping}ms`);
    }

    // --- MÓDULO DE MODERAÇÃO (Filtro) ---
    if (moderacaoAtiva) {
        const temPalavrao = badwords.some(palavrao => msg.includes(palavrao));
        if (temPalavrao) {
            try {
                await message.delete();
                const aviso = await message.channel.send(`⚠️ ${message.author}, essa palavra não é permitida aqui!`);
                setTimeout(() => aviso.delete(), 5000); // O aviso some depois de 5 segundos
            } catch (error) {
                console.log('Erro ao deletar mensagem: O bot precisa de permissão de Administrador.');
            }
        }
    }
});

// Login do Bot usando o Token que você configurou na Discloud
client.login(process.env.TOKEN);


