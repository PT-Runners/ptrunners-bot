const { guildId } = require('../config.json');
const { gangsCategory, mutedRole, squadsCategory } = require('../commands/commands_config.json');
const { Permissions } = require('discord.js');

module.exports.create_gang = function (client, gang_name) {
    var role_gang_name = `Gang ${gang_name}`;
    return client.guilds.fetch(guildId)
    .then(guild => {
      let gangFound = guild.roles.cache.find(role => role.name == role_gang_name);
      if(gangFound) {
        throw('Role already exists');
      }
      return guild;
    })
    .then(guild => {
      return guild.roles.create({
        name: role_gang_name,
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
  var role_gang_name = `Gang ${gang}`;
  return client.guilds.fetch(guildId).then(guild => {
    guild.members.fetch(player)
    .then(player => {
      player.roles.add(guild.roles.cache.find(role => role.name == role_gang_name));
    });
  });
}

module.exports.delete_gang = function (client, gang) {
  var role_gang_name = `Gang ${gang}`;
  return client.guilds.fetch(guildId).then(guild => {
    guild.roles.cache.find(role => role.name == role_gang_name)?.delete();
    guild.channels.cache.find(channel => channel.name == `${gang.toLowerCase().replaceAll(" ", "-")}-text`)?.delete();
  });
}

module.exports.remove_from_gang = function (client, player, gang) {
  var role_gang_name = `Gang ${gang}`;
  return client.guilds.fetch(guildId).then(guild => {
    guild.members.fetch(player).then(player => {
      player.roles.remove(guild.roles.cache.find(role => role.name == role_gang_name));
    });
  });
}

module.exports.rename_gang = function (client, gang, new_name) {
  var role_gang_name = `Gang ${gang}`;
  var role_new_gang_name = `Gang ${new_name}`;
  return client.guilds.fetch(guildId).then(guild => {
    guild.roles.edit(guild.roles.cache.find(role => role.name == role_gang_name), { name: `${role_new_gang_name}` });
    guild.channels.cache.find(channel => channel.name == `${gang.toLowerCase().replaceAll(" ", "-")}-text`)?.edit({ name: `${new_name}-text` });
  });
}

module.exports.create_squad = function (client, squad_name) {
  var role_squad_name = `Squad ${squad_name}`;
  return client.guilds.fetch(guildId)
  .then(guild => {
    let squadFound = guild.roles.cache.find(role => role.name == role_squad_name);
    if(squadFound) {
      throw('Role already exists');
    }
    return guild;
  })
  .then(guild => {
    return guild.roles.create({
      name: role_squad_name,
      color: 'RANDOM',
      mentionable: true,
    })
    .then(guildRole => {
      guild.channels.create(`${squad_name.toLowerCase().replaceAll(" ", "-")}-text`, { //(desnecessário, o discord já faz este parsing automaticamente)
        parent: squadsCategory,
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
        topic: `Sala de texto da squad ${squad_name}`,
      });
      return guildRole.id;
    })
  })
}

module.exports.add_to_squad = function (client, player, squad) {
  var role_squad_name = `Squad ${squad}`;
  return client.guilds.fetch(guildId).then(guild => {
    guild.members.fetch(player)
    .then(player => {
      player.roles.add(guild.roles.cache.find(role => role.name == role_squad_name));
    });
  });
}

module.exports.delete_squad = function (client, squad) {
  var role_squad_name = `Squad ${squad}`;
  return client.guilds.fetch(guildId).then(guild => {
    guild.roles.cache.find(role => role.name == role_squad_name)?.delete();
    guild.channels.cache.find(channel => channel.name == `${squad.toLowerCase().replaceAll(" ", "-")}-text`)?.delete();
  });
}

module.exports.remove_from_squad = function (client, player, squad) {
  var role_squad_name = `Squad ${squad}`;
  return client.guilds.fetch(guildId).then(guild => {
    guild.members.fetch(player).then(player => {
      player.roles.remove(guild.roles.cache.find(role => role.name == role_squad_name));
    });
  });
}

module.exports.rename_squad = function (client, squad, new_name) {
  var role_squad_name = `Squad ${squad}`;
  var role_new_squad_name = `Squad ${new_name}`;
  return client.guilds.fetch(guildId).then(guild => {
    guild.roles.edit(guild.roles.cache.find(role => role.name == role_squad_name), { name: `${role_new_squad_name}` });
    guild.channels.cache.find(channel => channel.name == `${squad.toLowerCase().replaceAll(" ", "-")}-text`)?.edit({ name: `${new_name}-text` });
  });
}