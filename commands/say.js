exports.run = async (client, message, args, level) => {
  const text = args.join(" ");
  if(!text) return message.channel.send('idk i will say??');
  message.delete().catch(O_o=>{});
  message.channel.send(text);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['saying'],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "say",
  category: "System",
  description: "Make bot say something",
  usage: "say (word)"
};
