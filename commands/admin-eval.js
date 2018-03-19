const os = require('os');
exports.run = async (client, message, args, level) => {
  const code = args.join(" ");
  if(!code) return message.channel.send('```\neval (code)\n\neval Javascript code```');
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
  } catch (err) {
    message.channel.send('```xl\n' + await client.clean(client, err) + '\n```');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "eval",
  category: "System",
  description: "Evaluates arbitrary javascript.",
  usage: "eval [...code]"
};
