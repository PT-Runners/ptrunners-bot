const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { ptrImage } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Ver informação geral sobre o bot'),
	async execute(interaction) {
        let uptime;
        uptime = Math.floor(interaction.client.uptime / 1000);
        const days = Math.floor(uptime / (24 * 3600));
        uptime -= days * (24 * 3600);
        const hours = Math.floor(uptime / 3600);
        uptime -= hours * 3600;
        const minutes = Math.floor(uptime / 60);
        uptime -= minutes * 60;
        const seconds = uptime;
		const response = {
			components: [],
			embeds: [
				new MessageEmbed()
					.setColor('RANDOM')
					.setAuthor('Website', ptrImage, 'https://ptrunners.net')
					.setTitle('PTRunners Discord Bot')
					.setDescription(
                        `Made with :heart: by <@351410153523904513>
                        version 1.1.0`,
                    )
					.setFooter(`Uptime: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds `),
			],
            ephemeral: true,
		};
		interaction.reply(response);
    },
};