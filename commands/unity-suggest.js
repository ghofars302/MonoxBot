exports.run = async (client, message, args, level) => {
    if(message.author.id === client.config.owner) return message.channel.send("Hmm.. ");
    message.channel.send('NANI? I don"t want any suggest from you!!!')
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['report'],
  permLevel: "Users"
};

exports.help = {
  name: "suggest",
  category: "Unity",
  description: "Send suggestion to developer",
  usage: "suggest (your suggestion)"
};
