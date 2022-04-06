const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { botLogs, staffRole, ticketsChannel, ticketsCategory } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove-user')
		.setDescription('Remove um user do ticket onde é chamado')
        .addUserOption(option =>
			option
				.setName('user')
				.setDescription('Pessoa a remover')
				.setRequired(true),
			),
	async execute(interaction) {
		if (!interaction.member.roles.cache.has(staffRole)) {
			return interaction.reply({
				content: 'Não tens permissões para usar este comando.',
				ephemeral: true,
			});
		}
        if (interaction.channel.parentId != ticketsCategory ||
            interaction.channel.id == ticketsChannel) {
            return interaction.reply({
                content: 'Isto não é um ticket!',
                ephemeral: true,
           });
        }
        if (interaction.guild.members.cache.get(interaction.options.getUser('user').id).roles.cache.has(staffRole)) {
            return interaction.reply({
                content: 'Não podes remover staff!',
                ephemeral: true,
           });
        }
        await interaction.channel.permissionOverwrites.edit(interaction.options.getUser('user'), {
			VIEW_CHANNEL: false,
		});
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		interaction.guild.channels.fetch(botLogs).then(logChannel =>
			{ logChannel.send(`${dateTime}: <@${interaction.user.id}> removed ${interaction.options.getUser('user').id} from ${interaction.channel.name}`);
		});
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} removed ${interaction.options.getUser('user').id} from ${interaction.channel.name}\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		return interaction.reply({
			content: 'User removido!',
			ephemeral: true,
		});
	},
};