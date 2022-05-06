const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { botLogs, staffRole, mutedRole } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Dá mute a alguém')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('Pessoa a mutar')
				.setRequired(true),
			)
		.addStringOption(option =>
			option
				.setName('motive')
				.setDescription('Motivo')
				.setRequired(true),
			),
	async execute(interaction) {
		if (!interaction.member.roles.cache.has(staffRole)) {
			return interaction.reply({
				content: 'Não tens permissões para usar este comando.',
				ephemeral: true,
			});
		}
		else if (interaction.guild.members.resolve(interaction.options.getUser('user')).roles.cache.has(staffRole)) {
			return interaction.reply({
				content: 'Não podes dar mute a outro staff.',
				ephemeral: true,
			});
		}
		else if (interaction.guild.members.resolve(interaction.options.getUser('user')).roles.cache.has(mutedRole)) {
			return interaction.reply({
				content: 'Essa pessoa já está mutada.',
				ephemeral: true,
			});
		}
		await interaction.guild.members.resolve(interaction.options.getUser('user')).roles.add(mutedRole);
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		interaction.guild.channels.fetch(botLogs).then(logChannel =>
			{ logChannel.send(`${dateTime}: <@${interaction.user.id}> deu mute a ${interaction.options.getUser('user')} com a razão "${interaction.options.getString('motive')}"\n`);
		});
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} deu mute a ${interaction.options.getUser('user')} com a razão "${interaction.options.getString('motive')}"\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		return interaction.reply({
			content: `Utilizador mutado.`,
			ephemeral: true,
		});
	},
};
