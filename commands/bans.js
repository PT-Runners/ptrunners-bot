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
		console.log(`${interaction.user.username} requested ban info.`);
		interaction.reply(response);
    },
};