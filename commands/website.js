const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { ptrImage } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('website')
		.setDescription('Ver website'),
	async execute(interaction) {
		const response = {
			components: [],
			embeds: [
				new MessageEmbed()
					.setColor('RANDOM')
					.setAuthor('​PTRunners', ptrImage, 'https://ptrunners.net'),
			],
            ephemeral: true,
		};
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} requested website info.\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		interaction.reply(response);
    },
};