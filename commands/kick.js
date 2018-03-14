exports.run = async (client, message, args, level) => {
    if(!message.channel.permissionsFor(message.guild.me).has('BAN_MEMBERS')) return message.channel.send('I can\'t kick any user in this server');
    const members = message.mentions.members.first();
    if(!members) return message.channel.send('idk who will get kick??');
    if(!members.kickable) return message.channel.send('i can\'t kick that user :(');
    let reason = args.slice(1).join(' ');
    if(!reason) return members.kick('Response ' + message.author).then(message.channel.send(members + " has been kicked by " + message.author)).catch(err => message.channel.send('Wow, I can\'t kick that user sorry ' + err));
    members.kick('Response ' + message.author + ' Reason: ' + reason).then(message.channel.send(members + " has been kicked by " + message.author + " Because: " + reason)).catch(err => message.channel.send('Wow, I can\'t kick that user sorry ' + err));
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['kicked'],
  permLevel: "Administrator"
};

exports.help = {
  name: "kick",
  category: "Administrator",
  description: "kick user from server.",
  usage: "kick (players) (reason)"
};
