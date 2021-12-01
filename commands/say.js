const { SlashCommandBuilder } = require('@discordjs/builders');
const { devRole } = require('./commands_config.json');

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
		console.log(`${interaction.user.username} used say command.`);
		return interaction.reply({
			content: 'Mensagem enviada.',
			ephemeral: true,
		});
	},
};