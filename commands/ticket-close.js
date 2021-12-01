const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { ticketsChannel, ticketsRole, ticketsCategory } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close-ticket')
		.setDescription('Fecha o ticket onde o comando é chamado'),
	async execute(interaction) {
        //  no need to check for roles since everyone who can see the ticket can close it
        if (interaction.channel.parentId != ticketsCategory ||
            interaction.channel.id == ticketsChannel) {
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
        const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
        fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} closed ticket ${interaction.channel.name}.\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
        interaction.channel.delete();
	},
};