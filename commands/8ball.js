const randomfact = [
  'No u',
  'Ask this later',
  'Maybe :thinking:',
  'Yes',
  'I can\'t answer it',
  'I think yes',
  'I think no',
  'Ask Monodoxy#0240 for answer',
  'AAA I dunno'
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

exports.run = async (client, message, args, level) => {
      try {
        const qu = args.join(" ");
        if(!qu) return message.channel.send('Where the question?');
        message.channel.send('``8Ball``\n**Question:** ' + qu + '\n**Answer:** ' + randomItem(randomfact));
      } catch (error) {
        message.channel.send('Uhh. I can\'t give you the answer. Sorry');
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
  name: "8ball",
  category: "Fun",
  description: "Answer your question with shitpost or funny answer",
  usage: "8ball [question]"
};
