exports.run = (client, message, args, level) => {
  if (!args[0]) {
    message.reply('https://monoxbot.glitch.me/');
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      if (level < client.levelCache[command.conf.permLevel]) return;
      message.channel.send({embed: {
        title: 'Information about command:  ' + command.help.name,
        fields: [{
          name: 'Description',
          value: command.help.description
        },
        {
          name: 'Usage',
          value: command.help.usage
        },
        {
          name: 'Alias',
          value: command.conf.aliases.join(", ")
        }
        ],
      }});
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp'],
  permLevel: "User"
};

exports.help = {
  name: "help",
  category: "System",
  description: "Look command list at Bot website or look Invidual command.",
  usage: "help [command]"
};
