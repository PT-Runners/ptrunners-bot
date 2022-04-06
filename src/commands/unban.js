const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { botLogs, ptrImage, ticketsChannel } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Mostra informação sobre pedidos de unban'),
	async execute(interaction) {
        const response = {
			components: [],
			embeds: [
				new MessageEmbed()
					.setColor('RANDOM')
					.setAuthor('​', ptrImage, 'https://ptrunners.net')
					.setTitle('Pedido de unban')
					.setDescription(
                        `Não vendemos unbans, podes apenas pedir desculpa pelo erro cometido e pedir que sejas desbanido através de um ticket. 
						Dirige-te à sala <#${ticketsChannel}>`,
                    ),
			],
            ephemeral: true,
		};
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		interaction.guild.channels.fetch(botLogs).then(logChannel =>
			{ logChannel.send(`${dateTime}: <@${interaction.user.id}> requested unban info.`);
		});
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} requested unban info.\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		interaction.reply(response);
	},
};
