const fs = require('fs');
const { exec } = require('child_process');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { botLogs, ticketsChannel, ticketsRole, ticketsCategory, ticketsLogs } = require('./commands_config.json');
const { token } = require('../config.json');

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
        interaction.guild.channels.fetch(botLogs).then(logChannel =>
			{ logChannel.send(`${dateTime}: <@${interaction.user.id}> closed ticket ${interaction.channel.name}.`);
		});
        fs.appendFile('logs.txt', `${dateTime}: ${interaction.user.username} closed ticket ${interaction.channel.name}.\n`, err => {
			if (err) {
				return console.error(err);
			}
		});
        const command = `dotnet /root/DiscordChatExporter/DiscordChatExporter.Cli.dll export -t ${token} -c ${interaction.channel.id} -o ../ticket-logs/${interaction.channel.name}.html`;
        exec(command,
    function (error, stdout, stderr) {
        // console.log('stdout: ' + stdout);
        // console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
        else {
            interaction.guild.channels.fetch(ticketsLogs).then(ticketLogsChannel => 
            {
                ticketLogsChannel.send({
                    files: [`../ticket-logs/${interaction.channel.name}.html`]
                });
            });
            interaction.channel.delete();
        }
    });
    interaction.reply({
        content: 'A dar backup dos dados e a fechar o ticket. Isto pode demorar um bocado...',
        ephemeral: true,
    });  
	},
};