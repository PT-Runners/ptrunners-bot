const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

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
					.setURL('https://ptrunners.net/bans')
					.setTitle('PTRunners - Bans')
					.setDescription(
                        'Acede ao website acima para acederes à base de dados dos bans.',
                    ),
			],
            ephemeral: true,
		};
		interaction.reply(response);
    },
};