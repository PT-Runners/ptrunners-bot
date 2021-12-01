const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { ptrImage } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bans')
		.setDescription('Ver informação dos bans'),
	async execute(interaction) {
		const response = {
			components: [],
			embeds: [
				new MessageEmbed()
					.setColor('RANDOM')
					.setAuthor('​PTRunners - Bans', ptrImage, 'https://ptrunners.net')
					.setDescription(
                        'Acede ao website acima para acederes à base de dados dos bans.',
                    ),
			],
            ephemeral: true,
		};
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} requested ban info.\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		interaction.reply(response);
    },
};