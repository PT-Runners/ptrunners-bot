const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { memberRole, reportsChannel, ticketsRole, staffRole, adminRole, devRole } = require('./commands_config.json');
module.exports = {
    data: new SlashCommandBuilder()
      .setName('ticket')
      .setDescription('Reporta um player ou problema. Um ticket será criado.')
      .addStringOption(option =>
        option
          .setName('tipo')
          .setDescription('Tipo do ticket')
          .addChoices([
            ['Reportar um bug no Servidor', 'server'],
			['Reportar um player', 'player'],
            ['Reportar um bug/problema no Site', 'site'],
            ['Reportar um problema com Vip', 'vip'],
            ['Reportar um problema no Discord', 'discord'],
            ['Reportar um Staff', 'staff'],
			['Pedido de unban', 'unban'],
			['Outros', 'outros'],
          ])
          .setRequired(true),
        ),
    async execute(interaction) {
		const problem = interaction.options.getString('tipo');
		if (interaction.channel.id != reportsChannel) {
			return interaction.reply({
				content: 'Utiliza o channel adequado para fazer reports.',
				ephemeral: true,
			});
		}
		if (interaction.member.roles.cache.has(ticketsRole)) {
			return interaction.reply({
				content: 'Já tens um ticket aberto. Se tens mais problemas podes utilizar o mesmo ticket ou criar um novo depois deste ser fechado.',
				ephemeral: true,
			});
		}
		const name = interaction.user.username;
		const userId = interaction.user.id;
		if (problem == 'server' || problem == 'site' || problem == 'vip') {
			const channel = await interaction.channel.parent.createChannel(`ticket-${name}`, {
				type: 'GUILD_TEXT',
				permissionOverwrites: [
				{
					id: interaction.guild.roles.resolve(memberRole),
					deny: [Permissions.FLAGS.VIEW_CHANNEL],
				},
				{
					id: userId,
					allow: [Permissions.FLAGS.VIEW_CHANNEL],
				},
				{
					id: interaction.guild.roles.resolve(devRole),
					allow: [Permissions.FLAGS.VIEW_CHANNEL],
				},
				],
				position: 3,
				topic: `Ticket ${name} - ${problem}`,
			});
			channel.send(`Olá <@${userId}>, descreve aqui o problema.`);
		}
		else if (problem == 'staff') {
			const channel = await interaction.channel.parent.createChannel(`ticket-${name}`, {
				type: 'GUILD_TEXT',
				permissionOverwrites: [
				{
					id: interaction.guild.roles.resolve(memberRole),
					deny: [Permissions.FLAGS.VIEW_CHANNEL],
				},
				{
					id: userId,
					allow: [Permissions.FLAGS.VIEW_CHANNEL],
				},
				{
					id: interaction.guild.roles.resolve(adminRole),
					allow: [Permissions.FLAGS.VIEW_CHANNEL],
				},
				],
				position: 3,
				topic: `Ticket ${name} - ${problem}`,
			});
			channel.send(`Olá <@${userId}>, descreve aqui o problema.`);
		}
		else {
			const channel = await interaction.channel.parent.createChannel(`ticket-${name}`, {
				type: 'GUILD_TEXT',
				permissionOverwrites: [
				{
					id: interaction.guild.roles.resolve(memberRole),
					deny: [Permissions.FLAGS.VIEW_CHANNEL],
				},
				{
					id: userId,
					allow: [Permissions.FLAGS.VIEW_CHANNEL],
				},
				{
					id: interaction.guild.roles.resolve(staffRole),
					allow: [Permissions.FLAGS.VIEW_CHANNEL],
				},
				],
				position: 3,
				topic: `Ticket ${name} - ${problem}`,
			});
			channel.send(`Olá <@${userId}>, descreve aqui o problema.`);
		}
		interaction.member.roles.add(ticketsRole);
		return interaction.reply({
			content: 'Ticket criado! Podes agora dirigir-te ao channel e descrever o problema. Obrigado pelo report.',
			ephemeral: true,
		});
    },
};