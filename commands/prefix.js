const { inspect } = require("util");
exports.run = async (client, message, [action, key, ...value], level)=> {
  const settings = client.settings.get(message.guild.id);
  if(value.length < 1) return message.channel.send('```\nprefix (new prefix)\n\nChange bot guild prefix');
  settings[key] = value.join(" ");
  client.settings.set(message.guild.id, settings);
  message.channel.send(`:white_check_mark: Prefix successfully changed to \`\`${value.join(" ")}\`\``);
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "prefix",
  category: "Administrator",
  description: "Change bot guild prefix!",
  usage: "prefix (new prefix)"
};
