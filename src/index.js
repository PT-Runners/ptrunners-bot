const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const http = require('./http_requests/http.js');

const fs = require('fs');
const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
const { Client, Collection, Intents } = require('discord.js');
const { token, game, webhook_token, sentry_dsn } = require('./config.json');

const regexGangName = /[A-Za-z0-9 _áàéèíóúç]/g;

if(sentry_dsn) {
	Sentry.init({
		dsn: sentry_dsn,
		release: "discord-bot@1.0.0",
	  
		// Set tracesSampleRate to 1.0 to capture 100%
		// of transactions for performance monitoring.
		// We recommend adjusting this value in production
		tracesSampleRate: 1.0,
	});
}

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
	gang_name = gang_name.match(regexGangName).join('').trim();
	if (!gang_name) {
		res.redirect('/error');
	}
	else {
		http.create_gang(client, gang_name)
		.then(message => {
			res.status(201);
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify({id: message}));
		})
		.catch(e => {
			if(e == "Role already exists") {
				res.status(302);
			}else {
				Sentry.captureException(e);
				res.status(500);
			}

			res.send(e);
		});
	}
});

app.post('/webhooks/delete-gang', (req, res) => {
	var gang_name = req.body.name;
	gang_name = gang_name.match(regexGangName).join('').trim();
	if (!gang_name) {
		res.redirect('/error');
	}
	else {
		http.delete_gang(client, gang_name)
		.then(() => {
			res.send('Deleting gang role!');
		});
	}
});

app.post('/webhooks/add-to-gang', (req, res) => {
	var gang_name = req.body.name;
	gang_name = gang_name.match(regexGangName).join('').trim();
	var player = req.body.player;
	if (!gang_name || !player) {
		res.redirect('/error');
	}
	else {
		http.add_to_gang(client, player, gang_name)
		.then(() => {
			res.send('Adding player to gang!');
		});
	}
});

app.post('/webhooks/remove-from-gang', (req, res) => {
	var gang_name = req.body.name;
	gang_name = gang_name.match(regexGangName).join('').trim();
	var player = req.body.player;
	if (!gang_name || !player) {
		res.redirect('/error');
	}
	else {
		http.remove_from_gang(client, player, gang_name)
		.then(() => {
			res.send('Removing player from gang!');
		});
	}
});

app.post('/webhooks/rename-gang', (req, res) => {
	var gang_name = req.body.name;
	gang_name = gang_name.match(regexGangName).join('').trim();
	var new_name = req.body.newName;
	new_name = new_name.match(regexGangName).join('').trim();
	if (!gang_name || !new_name) {
		res.redirect('/error');
	}
	else {
		http.rename_gang(client, gang_name, new_name)
		.then(() => {
			res.send('Renaming gang!');
		});
	}
});

app.post('/webhooks/discord-voice-members', (req, res) => {
	http.get_voice_members(client)
	.then((userIds) => {
		res.status(200);
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify({ids: userIds}));
	})
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});