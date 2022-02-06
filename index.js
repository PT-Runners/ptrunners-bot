const http = require('./http_requests/http.js');

const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
const { Client, Collection, Intents } = require('discord.js');
const { token, game, webhook_token } = require('./config.json');
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
		setTimeout(function () {
			msg.delete().catch(error => {
				console.log("Error deleting message.");
			});
		}, 1000 * 30);
	}
});

client.login(token);

//FIXME:
app.use('/webhooks', (req, res, next) => {
	var webhookToken = req.body.token;
	if (webhookToken && webhookToken == webhook_token) {
		next();
	}
	else res.redirect('/error');
});

app.get('/error', (req, res) => {
	res.send('Wrong request');
});

app.post('/webhooks/create-gang', (req, res) => {
	var gang_name = req.body.name;
	if (!gang_name) {
		res.redirect('/error');
	}
	else {
		http.create_gang(client, gang_name);
		res.send('Creating gang role!');
	}
});

app.post('/webhooks/delete-gang', (req, res) => {
	var gang_name = req.body.name;
	if (!gang_name) {
		res.redirect('/error');
	}
	else {
		http.delete_gang(client, gang_name);
		res.send('Deleting gang role!');
	}
});

app.post('/webhooks/add-to-gang', (req, res) => {
	var gang_name = req.body.name;
	var player = req.body.player;
	if (!gang_name || !player) {
		res.redirect('/error');
	}
	else {
		http.add_to_gang(client, player, gang_name);
		res.send('Adding player to gang!');
	}
});

// app.post('/webhooks/remove-from-gang', (req, res) => {
// 	var gang_name = req.body.name;
// 	var player = req.body.player;
// 	if (!gang_name || !player) {
// 		res.redirect('/error');
// 	}
// 	else {
// 		res.send('Removing player from gang!');
// 		http.remove_from_gang(client, player, gang_name);
// 	}
// });

// app.post('/webhooks/rename-gang', (req, res) => {
// 	var gang_name = req.body.name;
// 	var new_name = req.body.new-name;
// 	if (!gang_name || !new_name) {
// 		res.redirect('/error');
// 	}
// 	else {
// 		res.send('Renaming gang!');
// 		http.rename_gang(client, gang_name, new_name);
// 	}
// });

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});