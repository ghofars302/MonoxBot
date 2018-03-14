exports.run = async (client, message, args, level) => {
  await message.reply("Bot is Restarting...");
  client.commands.forEach( async cmd => {
    await client.unloadCommand(cmd);
  });
  process.exit(1);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "reboot",
  category: "System",
  description: "Reload everything.",
  usage: "reboot"
};
