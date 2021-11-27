const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { ptrImage } = require('./commands_config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Ver comandos do bot'),
	async execute(interaction) {
        const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
        let commands = '';
        for (const file of commandFiles) {
            const command = require(`./${file}`);
            commands += `\n/${command.data.name} - ${command.data.description}.`;
        }
		const response = {
			components: [],
			embeds: [
				new MessageEmbed()
					.setColor('RANDOM')
					.setAuthor('​', ptrImage, 'https://ptrunners.net')
					.setTitle('PTRunners Discord Bot - Comandos')
					.setDescription(
                        commands,
                    ),
			],
            ephemeral: true,
		};
		interaction.reply(response);
    },
};