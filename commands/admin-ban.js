exports.run = async (client, message, args, level) => {
    if(!message.channel.permissionsFor(message.guild.me).has('BAN_MEMBERS')) return message.channel.send('I can\'t ban any user in this server');
    const members = message.mentions.members.first();
    if(!members) return message.channel.send('idk who will get ban??');
    if(!members.bannable) return message.channel.send('i can\'t ban that user :(');
    let reason = args.slice(1).join(' ');
    if(!reason) return members.ban('Response ' + message.author).then(message.channel.send(members + " has been banned by " + message.author)).catch(err => message.channel.send('Wow, I can\'t ban that user sorry ' + err));
    members.ban('Response ' + message.author + ' Reason: ' + reason).then(message.channel.send(members + " has been banned by " + message.author + " Because: " + reason)).catch(err => message.channel.send('Wow, I can\'t ban that user sorry ' + err));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['banned'],
  permLevel: "Administrator"
};

exports.help = {
  name: "ban",
  category: "Administrator",
  description: "Banned user from server.",
  usage: "ban (players) (reason)"
};
