const { SlashCommandBuilder } = require('@discordjs/builders');
const { reportsChannel, ticketsRole, ticketsCategory } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close-ticket')
		.setDescription('Fecha o ticket onde o comando é chamado. Irreversível!'),
	async execute(interaction) {
        //  no need to check for roles since everyone who can see the ticket can close it
        if (interaction.channel.parentId != ticketsCategory ||
            interaction.channel.id == reportsChannel) {
            return interaction.reply({
                content: 'Isto não é um ticket!',
                ephemeral: true,
           });
        }
        for (let i = 0; i < interaction.channel.members.size; i++) {
            if (interaction.channel.members.at(i).roles.cache.has(ticketsRole)) {
                interaction.channel.members.at(i).roles.remove(ticketsRole);
            }
        }
        interaction.channel.delete();
	},
};