const { Client, Intents, MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const token = 'TOKEN DO SEU BOT AQUI';
const prefix = '!';

const intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES];

const bot = new Client({
  intents: intents
});

bot.on('ready', () => {
  console.log(`Bot está pronto como ${bot.user.tag}`);
  bot.user.setActivity('Bot Online!!', { type: 'PLAYING' });	
});

bot.on('messageCreate', (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
      message.reply('Pong!');
    }

    if (command === 'ajuda') {
      const helpEmbed = new MessageEmbed()
        .setTitle('Comandos disponíveis')
        .addField('!ping', 'Responde com "Pong!"')
        .addField('!serverinfo', 'Mostra informações do servidor')
        .addField('!userinfo @usuário', 'Mostra informações de um usuário mencionado')
        .addField('!sortear [de] [até]', 'Sorteia um número dentre os dois valores passados')
        .addField('!limpar [quantidade]', 'Limpa uma quantidade específica de mensagens no canal')
        .addField('!avatar @usuário', 'Mostra o avatar de um usuário mencionado')
        .addField('!hora', 'Retorna a hora atual do bot')
        .addField('!contador', 'Inicia um contador em um canal de texto')
        .setColor('#3498db');

      message.channel.send({ embeds: [helpEmbed] });
    }

    if (command === 'serverinfo') {
      const serverName = message.guild.name;
      const memberCount = message.guild.memberCount;
      message.channel.send(`Nome do Servidor: ${serverName}\nMembros: ${memberCount}`);
    }

    if (command === 'userinfo') {
      const user = message.mentions.users.first();
      if (user) {
        message.channel.send(`Nome de Usuário: ${user.username}\nID: ${user.id}`);
      } else {
        message.reply('Você precisa mencionar um usuário para obter informações.');
      }
    }

	if (command === 'sortear') {
	  const minNumber = parseInt(args[0]);
	  const maxNumber = parseInt(args[1]);
	
	  if (!isNaN(minNumber) && !isNaN(maxNumber)) {
	    if (minNumber < maxNumber) {
	      const resultado = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
	      message.channel.send(`Número sorteado entre ${minNumber} e ${maxNumber}: **${resultado}**`);
	    } else {
	      message.reply('O número mínimo deve ser menor que o número máximo.');
	    }
	  } else {
	    message.reply('Por favor, forneça um número mínimo e um número máximo para o sorteio.');
	  }
	}

    if (command === 'limpar') {
      const quantidade = parseInt(args[0]);
      if (!isNaN(quantidade)) {
        message.channel.bulkDelete(quantidade + 1)
          .catch(error => {
            console.error(error);
            message.reply('Ocorreu um erro ao tentar limpar as mensagens.');
          });
      } else {
        message.reply('Por favor, especifique a quantidade de mensagens a serem limpas.');
      }
    }

    if (command === 'avatar') {
      const user = message.mentions.users.first() || message.author;
      const avatarURL = user.displayAvatarURL({ dynamic: true });
      message.channel.send(`Avatar de ${user.username}:\n${avatarURL}`);
    }

    if (command === 'hora') {
      const horaAtual = new Date().toLocaleTimeString();
      message.channel.send(`Hora atual do bot: ${horaAtual}`);
    }

    if (command === 'contador') {
      const channel = message.guild.channels.cache.find((ch) => ch.name === 'contador');
      if (channel) {
        let count = 0;
        const interval = setInterval(() => {
          count++;
          channel.send(`Contagem: ${count}`);
        }, 1000);
      } else {
        message.reply('O canal "contador" não foi encontrado neste servidor.');
      }
    }
  }
});

bot.login(token);
