const { Command } = require('discord.js-commando');

class AvatarCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'avatar',
			aliases: [],
			group: 'image',
			memberName: 'avatar',
			description: 'get user avatar'
		})
	}
	
	async run(msg, argString) {
		if (!argString) {
      msg.channel.send('``' + msg.author.tag + '``\'s avatar. ' + msg.author.displayAvatarURL({size: 1024}));
    } else {
      if (msg.channel.type === 'dm') return msg.reply('Sorry, this command can\'t be use with Argument in DM');
      let member = await this.client.utils.getMemberFromString(msg, argString);
      if (!member) return msg.channel.send(':warning: ``User not found.``');
      msg.channel.send('``' + member.user.tag + '``\'s avatar. ' + member.user.displayAvatarURL({size: 1024}));
    }
	}
}

module.exports = AvatarCommand;