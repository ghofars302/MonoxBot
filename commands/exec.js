exports.run = async (client, message, args, level) => {
  const code = args.join(" ");
  try {
    const exec = require('child_process').execSync;
    const execute = exec(`${code}`);
    message.channel.send(`\`\`\`xl\n${execute}\n\`\`\``)
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['ceval'],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "exec",
  category: "System",
  description: "Execute system command",
  usage: "exec || ceval [...code]"
};
