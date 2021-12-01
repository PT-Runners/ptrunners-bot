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
		console.log(`${interaction.user.id} requested website info.`);
		interaction.reply(response);
    },
};