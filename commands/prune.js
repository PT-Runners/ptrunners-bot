const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { botLogs, staffRole } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune')
		.setDescription('Apaga mensagens em bulk')
		.addIntegerOption(option => option.setName('amount').setDescription('Número de mensagens')),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');
		if (!interaction.member.roles.cache.has(staffRole)) {
			return interaction.reply({
				content: 'Não tens permissões para usar este comando.',
				ephemeral: true,
			});
		}
		if (amount <= 1 || amount > 100) {
			return interaction.reply({
				content: 'Escolhe um número entre 1 e 99.',
				ephemeral: true,
			});
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.error(error);
			interaction.reply({
				content: 'Ocorreu um erro a apagar as mensagens.',
				ephemeral: true,
			});
		});
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		interaction.guild.channels.fetch(botLogs).then(logChannel =>
			{ logChannel.send(`${dateTime}: <@${interaction.user.id}> pruned ${amount} messages in ${interaction.channel.id}\n`);
		});
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} pruned ${amount} messages in ${interaction.channel.id}\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		return interaction.reply({
			content: `${amount} mensagens apagadas.`,
			ephemeral: true,
		});
	},
};
