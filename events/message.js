module.exports = (client, message) => {
  if (message.author.bot) return;
  const settings = message.guild
    ? client.settings.get(message.guild.id)
    : client.config.defaultSettings;
  message.settings = settings;
  if (message.content.indexOf(settings.prefix) !== 0) return;
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const level = client.permlevel(message);
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (!cmd) return;
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send(`⛔ \`\`That command cannot execute here. Go guild instead.\`\``);

  if (level < client.levelCache[cmd.conf.permLevel]) {
    if (settings.systemNotice === "true") {
      return message.channel.send(`⛔ \`\`You don\'t have permission to execute that command.\`\``);
    } else {
      return;
    }
  }
  message.author.permLevel = level;

  message.flags = [];
  while (args[0] && args[0][0] === "-") {
    message.flags.push(args.shift().slice(1));
  }
  client.logger.cmd(`[CMD] ${client.config.permLevels.find(l => l.level === level).name} ${message.author.username} (${message.author.id}) Run command ${cmd.help.name}`);
  cmd.run(client, message, args, level);
};
