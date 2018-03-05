
exports.run = async (client, message, args, level) => {
  try {
    const sayqueue = args.join(" ");
    if (!sayqueue) return message.channel.send('```headinass (text)```');
    var exec = require('child_process').execSync;
    let cowsaying = exec(`cowsay -f head-in "${sayqueue}"`);
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
  name: "headinass",
  category: "Fun",
  description: "Make ASCII cowsay but head-in-ass mode say your text",
  usage: "headinass [Qoutes]"
};
