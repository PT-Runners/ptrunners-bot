const { guildId } = require('../config.json');
const { gangsCategory, mutedRole } = require('../commands/commands_config.json');
const { Permissions } = require('discord.js');

module.exports.create_gang = function (client, gang_name) {
    return client.guilds.fetch(guildId)
    .then(guild => {
      let gangFound = guild.roles.cache.find(role => role.name == gang_name);
      if(gangFound) {
        throw('Role already exists');
      }
      return guild;
    })
    .then(guild => {
      return guild.roles.create({
        name: gang_name,
        color: 'RANDOM',
        mentionable: true,
      })
      .then(guildRole => {
        guild.channels.create(`${gang_name.toLowerCase().replaceAll(" ", "-")}-text`, { //(desnecessário, o discord já faz este parsing automaticamente)
          parent: gangsCategory,
          type: 'GUILD_TEXT',
          permissionOverwrites: [
            {
              id: guild.roles.resolve(guild.roles.everyone.id),
              deny: [Permissions.FLAGS.VIEW_CHANNEL],
            },
            {
              id: guildRole.id,
              allow: [Permissions.FLAGS.VIEW_CHANNEL],
            },
            {
              id: guild.roles.resolve(mutedRole),
              deny: [Permissions.FLAGS.SEND_MESSAGES],
            },
          ],
          topic: `Sala de texto da gang ${gang_name}`,
        });
        return guildRole.id;
      })
    })
}

module.exports.add_to_gang = function (client, player, gang) {
  return client.guilds.fetch(guildId).then(guild => {
    guild.members.fetch(player)
    .then(player => {
      player.roles.add(guild.roles.cache.find(role => role.name == gang));
    });
  });
}

module.exports.delete_gang = function (client, gang) {
  return client.guilds.fetch(guildId).then(guild => {
    guild.roles.cache.find(role => role.name == gang)?.delete();
    guild.channels.cache.find(channel => channel.name == `${gang.toLowerCase().replaceAll(" ", "-")}-text`)?.delete();
  });
}

module.exports.remove_from_gang = function (client, player, gang) {
  return client.guilds.fetch(guildId).then(guild => {
    guild.members.fetch(player).then(player => {
      player.roles.remove(guild.roles.cache.find(role => role.name == gang));
    });
  });
}

module.exports.rename_gang = function (client, gang, new_name) {
  return client.guilds.fetch(guildId).then(guild => {
    guild.roles.edit(guild.roles.cache.find(role => role.name == gang), { name: `${new_name}` });
    guild.channels.cache.find(channel => channel.name == `${gang.toLowerCase().replaceAll(" ", "-")}-text`)?.edit({ name: `${new_name}-text` });
  });
}