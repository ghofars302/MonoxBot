const randomfact = [
  '1/10',
  '2/10',
  '3/10',
  '4/10',
  '5/10',
  '6/10',
  '7/10',
  '8/10',
  '9/10',
  '10/10'
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

exports.run = async (client, message, args, level) => {
    let oWo = args.join(" ");
    if(!oWo) return message.channel.send('Name plz');
    message.channel.send('I rate ' + oWo + ' ``' + randomItem(randomfact) + '``');
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "rate",
  category: "Fun",
  description: "Make bot rate something you ask for.",
  usage: "rate [args]"
};
