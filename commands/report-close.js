const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close-report')
		.setDescription('Fecha o ticket onde o comando é chamado.'),
	async execute(interaction) {
        //  check if we're closing the right thing
        //  >it's a ticket and it's not the report channel
        //  no need to check for roles since everyone who can see the ticket can close it

        // id of the tickets category
        if (interaction.channel.parentId != '911740580827136020' ||
            // id of the report channel
            interaction.channel.id == '911740610698952734') {
            return interaction.reply({
                content: 'Isto não é um ticket!',
                ephemeral: true,
           });
        }
        for (let i = 0; i < interaction.channel.members.size; i++) {
            //  look for the requester and remove role
            //  id of ticket role
            if (interaction.channel.members.at(i).roles.cache.has('911750668728025099')) {
                interaction.channel.members.at(i).roles.remove('911750668728025099');
            }
        }

        interaction.channel.delete();
	},
};