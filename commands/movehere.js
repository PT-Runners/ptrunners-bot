const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { botLogs, waitRoom  } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('move-here')
		.setDescription('Move um user para o voice channel onde estás.')
        .addUserOption(option =>
			option
				.setName('user')
				.setDescription('Pessoa a adicionar')
				.setRequired(true),
			),
	async execute(interaction) {
        if (interaction.guild.members.resolve(interaction.options.getUser('user').id).voice.channel.id != waitRoom) {
            return interaction.reply({
                content: 'O user a mover deve estar na sala de espera.',
                ephemeral: true,
            });
        }
        if (!interaction.member.voice.channel) {
            return interaction.reply({
                content: 'Tens que estar numa sala de voz para usar este comando.',
                ephemeral: true,
            });
        };
        if (interaction.member.voice.channel.id == waitRoom) {
            return interaction.reply({
                content: 'Não te podes mover a ti mesmo para a sala de espera. >.<',
                ephemeral: true,
            });
        };
        await interaction.guild.members.resolve(interaction.options.getUser('user').id).voice.setChannel(interaction.member.voice.channel).catch(error => {
            console.error(error);
            interaction.reply({
                content: 'Ocorreu um erro ao mover o user.',
                ephemeral: true,
            });
        });
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		interaction.guild.channels.fetch(botLogs).then(logChannel =>
			{ logChannel.send(`${dateTime}: <@${interaction.user.id}> moved ${interaction.options.getUser('user')} to ${interaction.member.voice.channel.name}.`);
		});
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} moved ${interaction.options.getUser('user')} to ${interaction.member.voice.channel.name}.\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		return interaction.reply({
			content: 'User movido!',
			ephemeral: true,
		});
	},
};