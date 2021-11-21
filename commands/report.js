const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { memberRole, reportsChannel, ticketsRole } = require('./commands_config.json');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Reporta um player ou problema. Um ticket será criado.'),
	async execute(interaction) {
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
        const channel = await interaction.channel.parent.createChannel(`ticket-${name}`, {
            type: 'GUILD_TEXT',
            permissionOverwrites: [
               {
                 id: interaction.guild.roles.resolve(memberRole),
                 deny: [Permissions.FLAGS.VIEW_CHANNEL],
              },
              {
                id: interaction.user.id,
                allow: [Permissions.FLAGS.VIEW_CHANNEL],
             },
            ],
            position: 3,
            topic: `Ticket ${name}`,
          });
        channel.send(`Olá <@${userId}>, descreve aqui o problema.`);
        interaction.member.roles.add(ticketsRole);
		return interaction.reply({
			content: 'Ticket criado! Podes agora dirigir-te ao channel e descrever o problema. Obrigado pelo report.',
			ephemeral: true,
		});
	},
};
