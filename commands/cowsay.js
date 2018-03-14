
exports.run = async (client, message, args, level) => {
  var cowsay = require('cowsay');
  const text = args.join(" ");
  try {
   if(!text) return message.channel.send('```cowsay (text)```');
   message.channel.send(cowsay.say({text: text}), {code:"xl"});
  } catch (e) {
    console.log(e);
    message.channel.send(e);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Users"
};

exports.help = {
  name: "cowsay",
  category: "Fun",
  description: "Make ASCII cowsay say your text",
  usage: "cowsay [Qoutes]"
};