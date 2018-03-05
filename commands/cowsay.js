
exports.run = async (client, message, args, level) => {
  try {
    const sayqueue = args.join(" ");
    if (!sayqueue) return message.channel.send('```Cowsay (text)```');
    var exec = require('child_process').execSync;
    let cowsaying = exec(`cowsay "${sayqueue}"`);
    message.channel.send(`\`\`\`xl\n${cowsaying}\n\`\`\``)
  } catch (err) {
    message.channel.send(`\`\`\`xl\n${err}\n\`\`\``);
    console.error(error)
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "cowsay",
  category: "Fun",
  description: "Make ASCII cowsay say your text",
  usage: "cowsay [Qoutes]"
};
