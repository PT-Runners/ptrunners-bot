const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { suggestionsChannel, ptrImage } = require('./commands_config.json');

const talkedRecently = new Set();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Cria uma sugestão')
		.addStringOption(option =>
			option
				.setName('título')
				.setDescription('Escreve o título da sugestão')
				.setRequired(true),
			)
		.addStringOption(option =>
			option
				.setName('sugestão')
				.setDescription('Escreve a sugestão')
				.setRequired(true),
			),
	async execute(interaction) {
		if (interaction.channel.id != suggestionsChannel) {
			return interaction.reply({
				content: 'Utiliza o channel adequado para fazer sugestões.',
				ephemeral: true,
			});
		}
		if (talkedRecently.has(interaction.user)) {
			return interaction.reply({
				content: 'Espera 5 minutos antes de voltares a fazer uma sugestão',
				ephemeral: true,
			});
		}
		talkedRecently.add(interaction.user);
		setTimeout(() => {
		talkedRecently.delete(interaction.user);
		}, 5 * 60000);
		const response = {
			components: [],
			embeds: [
				new MessageEmbed()
					.setColor('RANDOM')
					.setTitle(interaction.options.getString('título'))
					.setDescription(interaction.options.getString('sugestão'))
					.setFooter(`Sugestão feita por ${interaction.user.username}`, ptrImage),
			],
			fetchReply: true,
		};
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} made a suggestion\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		const message = await interaction.reply(response);
		message.react('✅');
		message.react('❌');
	},
};