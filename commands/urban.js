exports.run = async (client, message, args, level) => {
    const msg = await message.channel.send('Searching...')
    try {
      const webdict = require('webdict');
      const word = args.join(" ");
      if(!word) return message.channel.send('I need a word before I search it')
      webdict('dictionary', word).then(res => {
        let result;
        if(!res || !res.definition || !res.definition[0] || !res.definition[1] || !res.definition[2]) {
          result = 'No result found.';
        } else {
          result = `--\n${res.definition[0]}\n--\n${res.definition[1]}\n--\n${res.definition[2]}\n--`;
        }
        msg.edit({embed: {
          description: `:book: Result of : **${word}**\n` + result
        }});
      })
    } catch (error) {
      msg.edit(':warning: Webdict API down!');
      console.error(error);
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "urban",
  category: "Unity",
  description: "Get meaning of word from urbandictionary.com",
  usage: "urban word"
};
