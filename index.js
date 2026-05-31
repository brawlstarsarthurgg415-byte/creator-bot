const express = require('express');
const app = express();
app.use(express.json());

// Rota que recebe os dados do botão do site
app.post('/salvar', (req, res) => {
    const config = req.body;
    console.log("Configurações recebidas do site:", config);
    // Aqui a gente salvaria no banco de dados ou num arquivo .json
    res.send("Configuração recebida!");
});

app.listen(3000, () => console.log("Servidor de recebimento rodando na porta 3000"));

const { Client, GatewayIntentBits } = require('discord.js');

// Configurando as permissões que ativamos lá no portal do Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ]
});

// A nossa lista de palavrões (adicione ou mude as palavras em minúsculo)
const badwords = ['palavrao1', 'palavrao2', 'feio', 'bobo'];

client.on('ready', () => {
    console.log(`🚀 Bot online e operante! Logado como: ${client.user.tag}`);
});

// O bot "escutando" o chat 24 horas por dia
client.on('messageCreate', async (message) => {
    // Ignora mensagens de outros bots para evitar bugs
    if (message.author.bot) return;

    // Transforma a mensagem em minúscula para facilitar a busca
    const msgTexto = message.content.toLowerCase();

    // FILTRO DE PALAVRÃO: Checa se a mensagem tem alguma palavra da nossa lista
    const temPalavrao = badwords.some(palavrao => msgTexto.includes(palavrao));

    if (temPalavrao) {
        try {
            await message.delete(); // Apaga a mensagem na mesma hora
            message.channel.send(`⚠️ ${message.author}, por favor, não use esse tipo de vocabulário aqui!`);
        } catch (error) {
            console.log('O bot tentou apagar, mas está sem permissão de Administrador no canal.');
        }
    }
    
    // Um comando de teste rápido
    if (msgTexto === '!ping') {
        message.reply('🏓 Pong! O sistema do Creator Bot está vivo!');
    }
});

// O Token vai ficar escondido na plataforma de hospedagem por segurança
client.login(process.env.TOKEN);

