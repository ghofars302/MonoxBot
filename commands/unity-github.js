exports.run = async (client, message, args, level) => {
  message.channel.send('Bot repo : https://github.com/ghofars302/MonoxBot')
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['git'],
  permLevel: "Users"
};

exports.help = {
  name: "github",
  category: "unity",
  description: "View this bot repo, if You want look sources and selfhost this bot",
  usage: "github || git"
};
