const fs = require('fs');
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
					.setAuthor('​', ptrImage, 'https://ptrunners.net')
					.setTitle('PTRunners Discord Bot')
					.setDescription(
                        `Made with :heart: by <@351410153523904513>
                        version 1.3.0`,
                    )
					.setFooter(`Uptime: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds `),
			],
            ephemeral: true,
		};
		const date = new Date();
		const cDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		const cTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		const dateTime = cDate + ' | ' + cTime;
		fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} requested about info.\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
		interaction.reply(response);
    },
};