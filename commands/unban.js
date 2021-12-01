const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { ptrImage, ticketsChannel } = require('./commands_config.json');

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
		console.log(`${interaction.user.id} requested unban info.`);
		interaction.reply(response);
	},
};
