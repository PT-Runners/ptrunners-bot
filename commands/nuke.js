const lineReader = require('line-reader');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { devRole } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nuke')
        .setDescription('Bang POW!'),
	async execute(interaction) {
		if (!interaction.member.roles.cache.has(devRole)) {
			return interaction.reply({
				content: 'Não tens permissões para usar este comando.',
				ephemeral: true,
			});
		}
        lineReader.eachLine('/root/PTRunners-bot/commands/error.txt',(line,last)=>{
            interaction.channel.send(`${line}`);
        });
		return interaction.reply({
			content: 'Done.',
			ephemeral: true,
		});
	},
};