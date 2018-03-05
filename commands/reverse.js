exports.run = async (client, message, args, level) => {
  const text = args.join(" ");
  try {
    if(!text) return message.channel.send('You must input text before bot process it.');
    message.channel.send(text.split('').reverse().join(''));
  } catch (e) {
    message.channel.send('Uhh simple thing bot can\'t do it');
    console.log(e);
  };
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['r'],
  permLevel: "User"
};

exports.help = {
  name: "reverse",
  category: "fun",
  description: "Reverse the text.",
  usage: "reverse || r (text)"
};
