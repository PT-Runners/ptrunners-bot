const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { botLogs, ptrImage } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gt')
		.setDescription('Ver informação do GameTracker'),
	async execute(interaction) {
		const response = {
			components: [],
			embeds: [
				new MessageEmbed()
					.setColor('RANDOM')
					.setTitle('GameTracker Server Stats')
					.setImage('https://cache.gametracker.com/server_info/185.113.141.9:27117/b_560_95_1.png')
					.setFooter('​', ptrImage),
			],
            ephemeral: false,
		};
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		interaction.guild.channels.fetch(botLogs).then(logChannel =>
			{ logChannel.send(`${dateTime}: <@${interaction.user.id}> requested about info.`);
		});
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} requested about info.\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		interaction.reply(response);
    },
};