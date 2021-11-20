const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Reporta um player ou problema. Um ticket será criado.'),
	async execute(interaction) {
        // id do channel de reports
        if (interaction.channel.id != '911740610698952734') {
			return interaction.reply({
				content: 'Utiliza o channel adequado para fazer reports.',
				ephemeral: true,
			});
        }
        const name = interaction.user.username;
        await interaction.channel.parent.createChannel(`ticket-\`${name}\``, {
            type: 'GUILD_TEXT',
            permissionOverwrites: [
               {
                //  id da role de membro do server
                 id: interaction.guild.roles.resolve('911740463118155778'),
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
		return interaction.reply({
			content: 'Ticket criado! Podes agora dirigir-te ao channel e descrever o problema. Obrigado pelo report.',
			ephemeral: true,
		});
	},
};
