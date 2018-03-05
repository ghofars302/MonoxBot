exports.run = async (client, message, args, level) => {
  const Users = message.users.find("name", args);
  try {
    if(!Users) return message.channel.send(`\`\``+ message.author.username + '``\'s avatar. ' + message.author.displayAvatarURL);
    message.channel.send('``' + Users.username + '``\'s avatar. ' + Users.displayAvatarURL);
  } catch (e) {
    message.channel.send('Wow. Bot can\'t load avatar from the target sorry. :(');
    console.log(e);
  };
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "avatar",
  category: "unity",
  description: "Get user avatar.",
  usage: "avatar (user)"
};
