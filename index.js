const http = require('./http_requests/http.js');

const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
const { Client, Collection, Intents } = require('discord.js');
const { token, game } = require('./config.json');
const { ticketsChannel, suggestionsChannel, verificationChannel } = require('./commands/commands_config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity(game, { type: 'PLAYING' });
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'Erro a executar o comando. Vê as logs para detalhes.', ephemeral: true });
	}
});

client.on('messageCreate', msg => {
    if ((msg.channel == ticketsChannel || msg.channel == suggestionsChannel) && msg.author.bot == false) {
		msg.delete();
	}
	if (msg.channel == verificationChannel) {
		setTimeout(function() {
			msg.delete().catch(error => {
				console.error(error);
				});
		}, 1000 * 30);
	}
});

client.login(token);

app.get('/create-gang', (req, res) => {
	res.send('Creating gang role!');
	http.create_gang(client, req);
  });

  app.listen(port, () => {
	console.log(`Listening on port ${port}`)
  });