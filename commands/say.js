const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { botLogs, devRole } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Envia uma mensagem pelo bot')
        .addStringOption(option =>
			option
				.setName('mensagem')
				.setDescription('Escreve a mensagem')
				.setRequired(true),
			),
	async execute(interaction) {
		if (!interaction.member.roles.cache.has(devRole)) {
			return interaction.reply({
				content: 'Não tens permissões para usar este comando.',
				ephemeral: true,
			});
		}
		await interaction.channel.send(interaction.options.getString('mensagem'));
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		interaction.guild.channels.fetch(botLogs).then(logChannel =>
			{ logChannel.send(`${dateTime}: <@${interaction.user.id}> used say command.`);
		});
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} used say command.\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		return interaction.reply({
			content: 'Mensagem enviada.',
			ephemeral: true,
		});
	},
};